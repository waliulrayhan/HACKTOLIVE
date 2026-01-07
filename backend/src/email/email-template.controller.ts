import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailTemplateService } from './email-template.service';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  FilterEmailTemplateDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('admin/email-templates')
@Controller('admin/email-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new email template (Admin only)' })
  @ApiResponse({ status: 201, description: 'Email template created successfully' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.emailTemplateService.create(createEmailTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all email templates (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all email templates' })
  findAll(@Query() filterDto: FilterEmailTemplateDto) {
    return this.emailTemplateService.findAll(filterDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get email template statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns email template statistics' })
  getStats() {
    return this.emailTemplateService.getStats();
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get email logs (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns email logs' })
  getEmailLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('status') status?: string,
  ) {
    return this.emailTemplateService.getEmailLogs(page, limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get email template by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns email template' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  findOne(@Param('id') id: string) {
    return this.emailTemplateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update email template (Admin only)' })
  @ApiResponse({ status: 200, description: 'Email template updated successfully' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  update(
    @Param('id') id: string,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
  ) {
    return this.emailTemplateService.update(id, updateEmailTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete email template (Admin only)' })
  @ApiResponse({ status: 204, description: 'Email template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.emailTemplateService.remove(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Send test email using template (Admin only)' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  testTemplate(
    @Param('id') id: string,
    @Body('recipientEmail') recipientEmail: string,
  ) {
    return this.emailTemplateService.sendTestEmail(id, recipientEmail);
  }
}
