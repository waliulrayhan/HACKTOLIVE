import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { CreateContactDto, FilterContactDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createContact(createContactDto: CreateContactDto) {
    // Create contact in database
    const contact = await this.prisma.contact.create({
      data: createContactDto,
    });

    // Send automated confirmation email
    await this.emailService.sendContactFormConfirmation(
      contact.email,
      contact.name,
      contact.subject,
    );

    return contact;
  }

  async findAllContacts(filterDto: FilterContactDto) {
    const {
      search,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const skip = (page - 1) * limit;

    const where: Prisma.ContactWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { subject: { contains: search } },
          { message: { contains: search } },
        ],
      }),
      ...(status && { status: status as any }),
    };

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data: contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateContact(id: string, updateData: any) {
    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteContact(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
