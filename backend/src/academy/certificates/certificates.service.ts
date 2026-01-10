import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Certificate, Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import { CertificateGeneratorService } from './certificate-generator.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private certificateGenerator: CertificateGeneratorService,
    private emailService: EmailService,
  ) {}

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

  async findOne(id: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            },
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

  async findByVerificationCode(verificationCode: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            },
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
    const certificate = await this.prisma.certificate.update({
      where: { id },
      data,
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return certificate;
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
    console.log('🎓 issueCertificate called:', { studentId, courseId });
    
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
      console.log('🎓 Certificate already exists, returning existing one');
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
    
    const certificate = await this.prisma.certificate.create({
      data: {
        student: { connect: { id: studentId } },
        course: { connect: { id: courseId } },
        instructor: { connect: { id: course.instructorId } },
        status: 'PENDING',
        verificationCode,
        certificateUrl: `/certificates/${studentId}-${courseId}.pdf`,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Update certificate to ISSUED status
    const issuedCertificate = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: { status: 'ISSUED', issuedAt: new Date() },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Update student certificates count
    await this.prisma.student.update({
      where: { id: studentId },
      data: {
        certificatesEarned: {
          increment: 1,
        },
      },
    });

    console.log('🎓 Certificate issued, sending email to:', issuedCertificate.student?.user?.email);

    // Send certificate email to student
    this.sendCertificateIssuedEmail(issuedCertificate);

    return issuedCertificate;
  }

  private generateVerificationCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `HACK-${timestamp}-${randomPart}`;
  }

  async generateCertificatePdfStream(certificateId: string): Promise<PDFKit.PDFDocument> {
    const certificate = await this.findOne(certificateId);
    
    if (certificate.status !== 'ISSUED') {
      throw new NotFoundException('Certificate not yet issued');
    }

    const certificateData = {
      studentName: certificate.student?.user?.name || 'Student',
      courseName: certificate.course?.title || 'Course',
      instructorName: certificate.course?.instructor?.user?.name || 'Instructor',
      completionDate: certificate.issuedAt || new Date(),
      verificationCode: certificate.verificationCode || '',
      duration: certificate.course?.duration || 0,
    };

    return this.certificateGenerator.generateCertificatePDF(certificateData);
  }

  /**
   * Send certificate issued notification email to student
   */
  private async sendCertificateIssuedEmail(certificate: any): Promise<void> {
    try {
      console.log('=== Sending Certificate Issued Email ===');
      console.log('Certificate:', { id: certificate.id, studentId: certificate.studentId, courseId: certificate.courseId });
      
      const studentEmail = certificate.student?.user?.email;
      const studentName = certificate.student?.user?.name || 'Student';
      const courseName = certificate.course?.title || 'Course';
      const instructorName = certificate.course?.instructor?.user?.name || 'Instructor';
      
      console.log('Email details:', { studentEmail, studentName, courseName, instructorName });
      
      if (!studentEmail) {
        console.error('Student email not found for certificate:', certificate.id);
        return;
      }

      const result = await this.emailService.sendTemplateEmail(
        'certificate-issued',
        studentEmail,
        {
          studentName: studentName,
          courseName: courseName,
          instructorName: instructorName,
          issuedDate: new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          verificationCode: certificate.verificationCode,
          certificateUrl: `${process.env.FRONTEND_URL || 'https://hacktolive.io'}/academy/certificates/download/${certificate.id}`,
          verificationUrl: `${process.env.FRONTEND_URL || 'https://hacktolive.io'}/academy/certificates/verify/${certificate.verificationCode}`,
        },
        studentName,
      );
      
      console.log('Certificate issued email sent:', result);
    } catch (error) {
      console.error('Failed to send certificate issued email:', error);
      console.error('Error stack:', error.stack);
    }
  }
}
