import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';
import { EmailService } from '../email/email.service';
import { 
  CreateCareerDto, 
  UpdateCareerDto, 
  FilterCareerDto,
  CreateApplicationDto,
  UpdateApplicationDto,
  FilterApplicationDto
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly emailService: EmailService,
  ) {}

  // Helper method to parse JSON fields
  private parseJsonField(field: any): any {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return [];
  }

  // Career Management
  async createCareer(createCareerDto: CreateCareerDto) {
    return this.prisma.career.create({
      data: createCareerDto,
      include: {
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
  }

  async findAllCareers(filterDto: FilterCareerDto) {
    const { 
      department, 
      type, 
      status, 
      featured, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filterDto;

    const skip = (page - 1) * limit;

    const where: Prisma.CareerWhereInput = {
      ...(department && { department }),
      ...(type && { type }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { department: { contains: search } },
          { description: { contains: search } },
          { location: { contains: search } },
        ],
      }),
    };

    const [careers, total] = await Promise.all([
      this.prisma.career.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          applications: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.career.count({ where }),
    ]);

    // Parse JSON fields
    const parsedCareers = careers.map((career) => ({
      ...career,
      requirements: this.parseJsonField(career.requirements),
      responsibilities: this.parseJsonField(career.responsibilities),
      benefits: this.parseJsonField(career.benefits),
    }));

    return {
      data: parsedCareers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneCareer(id: string) {
    const career = await this.prisma.career.findUnique({
      where: { id },
      include: {
        applications: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!career) {
      throw new NotFoundException(`Career with ID ${id} not found`);
    }

    // Parse JSON fields
    return {
      ...career,
      requirements: this.parseJsonField(career.requirements),
      responsibilities: this.parseJsonField(career.responsibilities),
      benefits: this.parseJsonField(career.benefits),
    };
  }

  async updateCareer(id: string, updateCareerDto: UpdateCareerDto) {
    try {
      return await this.prisma.career.update({
        where: { id },
        data: updateCareerDto,
        include: {
          applications: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }
      throw error;
    }
  }

  async removeCareer(id: string) {
    try {
      return await this.prisma.career.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getCareerStats() {
    const [total, active, closed, draft, totalApplications] = await Promise.all([
      this.prisma.career.count(),
      this.prisma.career.count({ where: { status: 'ACTIVE' } }),
      this.prisma.career.count({ where: { status: 'CLOSED' } }),
      this.prisma.career.count({ where: { status: 'DRAFT' } }),
      this.prisma.application.count(),
    ]);

    return {
      total,
      active,
      closed,
      draft,
      totalApplications,
    };
  }

  // Application Management
  async createApplication(
    createApplicationDto: CreateApplicationDto,
    resume?: Express.Multer.File,
  ) {
    // Verify career exists
    const career = await this.prisma.career.findUnique({
      where: { id: createApplicationDto.careerId },
    });

    if (!career) {
      throw new NotFoundException(`Career with ID ${createApplicationDto.careerId} not found`);
    }

    // Upload resume if provided
    let resumeUrl: string | undefined;
    if (resume) {
      resumeUrl = await this.uploadService.uploadResume(resume);
    }

    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        resumeUrl,
      },
      include: {
        career: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
      },
    });

    // Send confirmation email to applicant
    await this.emailService.sendCareerApplicationConfirmation(
      application.email,
      application.name,
      application.career.title,
      application.id,
    );

    return application;
  }

  async findAllApplications(filterDto: FilterApplicationDto) {
    const { 
      careerId, 
      status, 
      email, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filterDto;

    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {
      ...(careerId && { careerId }),
      ...(status && { status }),
      ...(email && { email }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          career: {
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
            },
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneApplication(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        career: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
            type: true,
            experience: true,
            salary: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async updateApplication(id: string, updateApplicationDto: UpdateApplicationDto) {
    try {
      const updateData: any = {
        ...updateApplicationDto,
      };

      // If status is being updated, set reviewedAt
      if (updateApplicationDto.status && updateApplicationDto.reviewedBy) {
        updateData.reviewedAt = new Date();
      }

      const application = await this.prisma.application.update({
        where: { id },
        data: updateData,
        include: {
          career: {
            select: {
              id: true,
              title: true,
              department: true,
            },
          },
        },
      });

      // Send status update email if status changed
      if (updateApplicationDto.status) {
        await this.emailService.sendCareerApplicationStatusUpdate(
          application.email,
          application.name,
          application.career.title,
          application.status,
          updateApplicationDto.notes,
        );
      }

      return application;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Application with ID ${id} not found`);
      }
      throw error;
    }
  }

  async removeApplication(id: string) {
    try {
      return await this.prisma.application.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Application with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getApplicationStats() {
    const [
      total,
      pending,
      reviewing,
      shortlisted,
      interviewed,
      accepted,
      rejected,
    ] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: 'PENDING' } }),
      this.prisma.application.count({ where: { status: 'REVIEWING' } }),
      this.prisma.application.count({ where: { status: 'SHORTLISTED' } }),
      this.prisma.application.count({ where: { status: 'INTERVIEWED' } }),
      this.prisma.application.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.application.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      total,
      pending,
      reviewing,
      shortlisted,
      interviewed,
      accepted,
      rejected,
    };
  }
}
