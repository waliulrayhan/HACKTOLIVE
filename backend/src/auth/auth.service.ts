import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@prisma/client';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, name, role } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || UserRole.STUDENT,
      },
    });

    // Create associated profile based on role
    if (user.role === UserRole.STUDENT) {
      await this.prisma.student.create({
        data: {
          userId: user.id,
          name: user.name || 'Student',
          email: user.email,
          avatar: '/images/user/default-avatar.jpg',
        },
      });
    } else if (user.role === UserRole.INSTRUCTOR) {
      await this.prisma.instructor.create({
        data: {
          userId: user.id,
          name: user.name || 'Instructor',
          avatar: '/images/user/default-avatar.jpg',
          bio: 'New instructor',
          skills: JSON.stringify([]),
        },
      });
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        instructor: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        instructor: true,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            enrollments: {
              include: {
                course: {
                  include: {
                    instructor: true,
                  },
                },
              },
            },
            certificates: true,
          },
        },
        instructor: {
          include: {
            courses: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string; bio?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      },
    });

    // Update associated profile
    if (user.role === UserRole.STUDENT && data.avatar) {
      await this.prisma.student.update({
        where: { userId },
        data: {
          name: data.name,
          avatar: data.avatar,
        },
      });
    } else if (user.role === UserRole.INSTRUCTOR) {
      await this.prisma.instructor.update({
        where: { userId },
        data: {
          name: data.name,
          avatar: data.avatar,
          bio: data.bio,
        },
      });
    }

    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
