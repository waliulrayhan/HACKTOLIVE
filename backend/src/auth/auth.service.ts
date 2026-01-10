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
import { OtpService } from './otp.service';
import { EmailService } from '../email/email.service';

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
    private otpService: OtpService,
    private emailService: EmailService,
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

    // Create user (not verified yet)
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || UserRole.STUDENT,
        isVerified: false,
      },
    });

    // Create associated profile based on role
    if (user.role === UserRole.STUDENT) {
      await this.prisma.student.create({
        data: {
          userId: user.id,
        },
      });
    } else if (user.role === UserRole.INSTRUCTOR) {
      await this.prisma.instructor.create({
        data: {
          userId: user.id,
          skills: JSON.stringify([]),
        },
      });
    }

    // Send OTP for email verification
    await this.otpService.createAndSendOtp(
      user.id,
      user.email,
      user.name || 'User',
      'REGISTRATION',
    );

    return {
      message: 'Registration successful! Please verify your email with the OTP sent to your inbox.',
      userId: user.id,
      email: user.email,
      requiresOtp: true,
    };
  }

  async verifyRegistrationOtp(userId: string, code: string) {
    const isValid = await this.otpService.verifyOtp(userId, code, 'REGISTRATION');

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark user as verified
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    // Send welcome email after successful verification
    const welcomeSent = await this.emailService.sendTemplateEmail(
      'welcome-email',
      user.email,
      {
        name: user.name || 'User',
        email: user.email,
      },
    );
    
    if (!welcomeSent) {
      // If template doesn't exist, send basic welcome email
      const welcomeBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to HACKTOLIVE! 🎉</h1>
          <p>Hello ${user.name || 'User'},</p>
          <p>Thank you for joining HACKTOLIVE Academy! We're excited to have you as part of our community.</p>
          <p>You've taken the first step toward mastering cybersecurity and ethical hacking.</p>
          <p>Your email has been verified successfully. You can now explore all our courses and resources!</p>
          <br>
          <p>Best regards,<br>HACKTOLIVE Team</p>
        </div>
      `;
      
      await this.emailService.sendEmail({
        from: 'noreply',
        to: user.email,
        subject: 'Welcome to HACKTOLIVE! 🚀',
        body: welcomeBody,
      });
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
      message: 'Email verified successfully!',
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

    // Check if user is STUDENT - skip OTP for students
    if (user.role === UserRole.STUDENT) {
      // Generate token directly for students
      const token = this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        token,
        message: 'Login successful!',
        requiresOtp: false,
      };
    }

    // Send OTP for login verification (INSTRUCTOR and ADMIN only)
    await this.otpService.createAndSendOtp(
      user.id,
      user.email,
      user.name || 'User',
      'LOGIN',
    );

    return {
      message: 'OTP sent to your email. Please verify to complete login.',
      userId: user.id,
      email: user.email,
      requiresOtp: true,
    };
  }

  async verifyLoginOtp(userId: string, code: string) {
    const isValid = await this.otpService.verifyOtp(userId, code, 'LOGIN');

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        instructor: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
      message: 'Login successful!',
    };
  }

  async sendPasswordResetOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message: 'If an account with that email exists, we\'ve sent a password reset OTP.',
      };
    }

    await this.otpService.createAndSendOtp(
      user.id,
      user.email,
      user.name || 'User',
      'PASSWORD_RESET',
    );

    return {
      message: 'Password reset OTP sent to your email.',
    };
  }

  async resetPasswordWithOtp(email: string, code: string, newPassword: string) {
    const { valid, userId } = await this.otpService.verifyOtpByEmail(
      email,
      code,
      'PASSWORD_RESET',
    );

    if (!valid || !userId) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Password reset successfully! You can now login with your new password.',
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

  async updateProfile(userId: string, data: { 
    name?: string; 
    avatar?: string; 
    bio?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        phone: data.phone,
        city: data.city,
        state: data.state,
        country: data.country,
      },
    });

    // Update associated profile
    if (user.role === UserRole.STUDENT && data.avatar) {
      // Student avatar is now in User table, no need to update Student
      // The update to user.avatar above already handles this
    } else if (user.role === UserRole.INSTRUCTOR) {
      // Instructor profile data is now in User table
      // All updates are already handled in the user update above
    }

    return this.sanitizeUser(user);
  }

  async updateSocialLinks(userId: string, data: {
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        facebookUrl: data.facebookUrl,
        twitterUrl: data.twitterUrl,
        linkedinUrl: data.linkedinUrl,
        instagramUrl: data.instagramUrl,
      },
    });

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

  async googleLogin(profile: { email: string; name: string; avatar?: string }) {
    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
      include: {
        student: true,
        instructor: true,
      },
    });

    // If user doesn't exist, create one
    if (!user) {
      // Generate a random password for OAuth users (they won't use it)
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email: profile.email,
          password: hashedPassword,
          name: profile.name,
          avatar: profile.avatar,
          role: UserRole.STUDENT, // Default role for OAuth signups
        },
      });

      // Create student profile
      await this.prisma.student.create({
        data: {
          userId: newUser.id,
        },
      });

      // Fetch user with student data
      user = await this.prisma.user.findUnique({
        where: { id: newUser.id },
        include: {
          student: true,
          instructor: true,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Failed to authenticate with Google');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
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
