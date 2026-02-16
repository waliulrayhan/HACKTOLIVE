import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { Prisma, UserRole } from '@prisma/client';
import type { Response } from 'express';
import * as fs from 'fs';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';

@ApiTags('academy')
@Controller('academy/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiBearerAuth()
  create(@Body() createCertificateDto: Prisma.CertificateCreateInput) {
    return this.certificatesService.create(createCertificateDto);
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiBearerAuth()
  issueCertificate(
    @Body('studentId') studentId: string,
    @Body('courseId') courseId: string,
  ) {
    return this.certificatesService.issueCertificate(studentId, courseId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.certificatesService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: { issuedAt: 'desc' },
    });
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.certificatesService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.certificatesService.findByCourse(courseId);
  }

  @Get('verify/:verificationCode')
  async verify(@Param('verificationCode') verificationCode: string) {
    try {
      const certificate = await this.certificatesService.findByVerificationCode(verificationCode);
      
      // Return formatted data for public verification
      return {
        valid: true,
        certificate: {
          id: certificate.id,
          verificationCode: certificate.verificationCode,
          studentName: certificate.student?.user?.name || 'Unknown Student',
          courseName: certificate.course?.title || 'Unknown Course',
          instructorName: certificate.course?.instructor?.user?.name || 'Unknown Instructor',
          issuedAt: certificate.issuedAt,
          status: certificate.status,
          certificateUrl: certificate.certificateUrl,
        }
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCertificateDto: Prisma.CertificateUpdateInput,
  ) {
    return this.certificatesService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(id);
  }

  @Get('download/:id')
  async downloadCertificate(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdfStream = await this.certificatesService.generateCertificatePdfStream(id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="certificate-${id}.pdf"`,
    );
    
    pdfStream.pipe(res);
  }
}
