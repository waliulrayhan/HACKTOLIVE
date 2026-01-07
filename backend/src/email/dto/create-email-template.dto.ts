import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum EmailTemplateType {
  CAREER_APPLICATION_CONFIRMATION = 'CAREER_APPLICATION_CONFIRMATION',
  CAREER_APPLICATION_STATUS_UPDATE = 'CAREER_APPLICATION_STATUS_UPDATE',
  CONTACT_FORM_CONFIRMATION = 'CONTACT_FORM_CONFIRMATION',
  WELCOME_EMAIL = 'WELCOME_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  COURSE_ENROLLMENT = 'COURSE_ENROLLMENT',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  CUSTOM = 'CUSTOM',
}

export enum EmailSender {
  NOREPLY = 'NOREPLY',
  SUPPORT = 'SUPPORT',
}

export class CreateEmailTemplateDto {
  @ApiProperty({ example: 'Career Application Confirmation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'career-application-confirmation' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Application Received - {{jobTitle}}' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ 
    example: '<h1>Hello {{applicantName}}</h1><p>We have received your application for {{jobTitle}}.</p>' 
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ enum: EmailTemplateType })
  @IsEnum(EmailTemplateType)
  @IsNotEmpty()
  type: EmailTemplateType;

  @ApiProperty({ 
    example: ['applicantName', 'jobTitle', 'applicationId', 'date'],
    description: 'List of available variables that can be used in subject and body'
  })
  @IsArray()
  @IsString({ each: true })
  variables: string[];

  @ApiPropertyOptional({ enum: EmailSender, default: EmailSender.NOREPLY })
  @IsEnum(EmailSender)
  @IsOptional()
  fromEmail?: EmailSender;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'Template for career application confirmation emails' })
  @IsString()
  @IsOptional()
  description?: string;
}
