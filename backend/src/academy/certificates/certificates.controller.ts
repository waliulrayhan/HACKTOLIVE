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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import * as fs from 'fs';

@ApiTags('academy')
@Controller('academy/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  create(@Body() createCertificateDto: Prisma.CertificateCreateInput) {
    return this.certificatesService.create(createCertificateDto);
  }

  @Post('issue')
  issueCertificate(
    @Body('studentId') studentId: string,
    @Body('courseId') courseId: string,
  ) {
    return this.certificatesService.issueCertificate(studentId, courseId);
  }

  @Get()
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
  verify(@Param('verificationCode') verificationCode: string) {
    return this.certificatesService.findByVerificationCode(verificationCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCertificateDto: Prisma.CertificateUpdateInput,
  ) {
    return this.certificatesService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(id);
  }

  @Get('download/:id')
  async downloadCertificate(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const certificatePath = await this.certificatesService.getCertificatePdf(id);
    
    if (!fs.existsSync(certificatePath)) {
      throw new NotFoundException('Certificate file not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="certificate-${id}.pdf"`,
    );
    
    const fileStream = fs.createReadStream(certificatePath);
    fileStream.pipe(res);
  }
}
