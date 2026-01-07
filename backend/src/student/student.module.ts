import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [StudentController],
  providers: [StudentService, PrismaService],
  exports: [StudentService],
})
export class StudentModule {}
