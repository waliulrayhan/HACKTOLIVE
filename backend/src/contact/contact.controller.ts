import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto, FilterContactDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiResponse({ status: 201, description: 'Contact form submitted successfully. Confirmation email sent.' })
  createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contact submissions (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns all contact submissions' })
  findAllContacts(@Query() filterDto: FilterContactDto) {
    return this.contactService.findAllContacts(filterDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact status (Admin)' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  updateContact(@Param('id') id: string, @Body() updateData: any) {
    return this.contactService.updateContact(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete contact (Admin)' })
  @ApiResponse({ status: 204, description: 'Contact deleted successfully' })
  deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(id);
  }
}
