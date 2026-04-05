import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsultationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import {
  CreateConsultationDto,
  FilterConsultationDto,
  UpdateConsultationDto,
} from './dto';

@Injectable()
export class ConsultationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createConsultation(createConsultationDto: CreateConsultationDto) {
    const consultation = await this.prisma.consultationRequest.create({
      data: createConsultationDto,
    });

    await this.emailService.sendContactFormConfirmation(
      consultation.email,
      consultation.name,
      consultation.serviceType,
    );

    return consultation;
  }

  async findAllConsultations(filterDto: FilterConsultationDto) {
    const {
      search,
      status,
      serviceType,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const skip = (page - 1) * limit;
    const allowedSortBy = new Set(['createdAt', 'updatedAt', 'name', 'email', 'status', 'serviceType']);
    const safeSortBy = allowedSortBy.has(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder: Prisma.SortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const where: Prisma.ConsultationRequestWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { company: { contains: search } },
          { phone: { contains: search } },
          { serviceType: { contains: search } },
          { message: { contains: search } },
        ],
      }),
      ...(status && { status: status as ConsultationStatus }),
      ...(serviceType && { serviceType: { contains: serviceType } }),
    };

    const [consultations, total] = await Promise.all([
      this.prisma.consultationRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: safeSortOrder },
      }),
      this.prisma.consultationRequest.count({ where }),
    ]);

    return {
      data: consultations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getConsultationStats() {
    const [total, pending, inReview, contacted, won, closed, spam] = await Promise.all([
      this.prisma.consultationRequest.count(),
      this.prisma.consultationRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.consultationRequest.count({ where: { status: 'IN_REVIEW' } }),
      this.prisma.consultationRequest.count({ where: { status: 'CONTACTED' } }),
      this.prisma.consultationRequest.count({ where: { status: 'WON' } }),
      this.prisma.consultationRequest.count({ where: { status: 'CLOSED' } }),
      this.prisma.consultationRequest.count({ where: { status: 'SPAM' } }),
    ]);

    return {
      total,
      pending,
      inReview,
      contacted,
      won,
      closed,
      spam,
    };
  }

  async updateConsultation(id: string, updateConsultationDto: UpdateConsultationDto) {
    try {
      return await this.prisma.consultationRequest.update({
        where: { id },
        data: {
          status: updateConsultationDto.status as ConsultationStatus | undefined,
          notes: updateConsultationDto.notes,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Consultation request with ID ${id} not found`);
      }

      throw error;
    }
  }

  async deleteConsultation(id: string) {
    try {
      return await this.prisma.consultationRequest.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Consultation request with ID ${id} not found`);
      }

      throw error;
    }
  }
}
