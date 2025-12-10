import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InstructorController } from './instructor.controller';

@Module({
  controllers: [InstructorController],
  providers: [PrismaService],
})
export class InstructorModule {}
