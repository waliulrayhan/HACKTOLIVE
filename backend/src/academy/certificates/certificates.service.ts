import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Certificate, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CertificateCreateInput): Promise<Certificate> {
    // Generate verification code
    const verificationCode = this.generateVerificationCode();

    const certificate = await this.prisma.certificate.create({
      data: {
        ...data,
        verificationCode,
      },
      include: {
        student: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    // Update student certificates count
    await this.prisma.student.update({
      where: { id: certificate.studentId },
      data: {
        certificatesEarned: {
          increment: 1,
        },
      },
    });

    return certificate;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CertificateWhereInput;
    orderBy?: Prisma.CertificateOrderByWithRelationInput;
  }): Promise<Certificate[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.certificate.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        student: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Certificate | null> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        student: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async findByStudent(studentId: string): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async findByCourse(courseId: string): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      where: { courseId },
      include: {
        student: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async findByVerificationCode(
    verificationCode: string,
  ): Promise<Certificate | null> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        student: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException(
        `Certificate with verification code ${verificationCode} not found`,
      );
    }

    return certificate;
  }

  async update(
    id: string,
    data: Prisma.CertificateUpdateInput,
  ): Promise<Certificate> {
    return this.prisma.certificate.update({
      where: { id },
      data,
      include: {
        student: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Certificate> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    await this.prisma.certificate.delete({
      where: { id },
    });

    // Update student certificates count
    await this.prisma.student.update({
      where: { id: certificate.studentId },
      data: {
        certificatesEarned: {
          decrement: 1,
        },
      },
    });

    return certificate;
  }

  async issueCertificate(
    studentId: string,
    courseId: string,
  ): Promise<Certificate> {
    // Check if enrollment is completed
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
        status: 'COMPLETED',
      },
    });

    if (!enrollment) {
      throw new NotFoundException(
        'Enrollment not found or course not completed',
      );
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    // Get student and course details
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
      },
    });

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!student || !course) {
      throw new NotFoundException('Student or course not found');
    }

    // Create certificate
    const verificationCode = this.generateVerificationCode();
    
    return this.prisma.certificate.create({
      data: {
        student: { connect: { id: studentId } },
        course: { connect: { id: courseId } },
        studentName: student.user.name || 'Student',
        courseName: course.title,
        verificationCode,
        certificateUrl: `/certificates/${studentId}-${courseId}.pdf`,
      },
      include: {
        student: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });
  }

  private generateVerificationCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `HACK-${timestamp}-${randomPart}`;
  }
}
