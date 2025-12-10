import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CoursesController } from './courses/courses.controller';
import { CoursesService } from './courses/courses.service';
import { InstructorsController } from './instructors/instructors.controller';
import { InstructorsService } from './instructors/instructors.service';
import { EnrollmentsController } from './enrollments/enrollments.controller';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';
import { CertificatesController } from './certificates/certificates.controller';
import { CertificatesService } from './certificates/certificates.service';
import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesService } from './quizzes/quizzes.service';

@Module({
  controllers: [
    CoursesController,
    InstructorsController,
    EnrollmentsController,
    ReviewsController,
    CertificatesController,
    QuizzesController,
  ],
  providers: [
    PrismaService,
    CoursesService,
    InstructorsService,
    EnrollmentsService,
    ReviewsService,
    CertificatesService,
    QuizzesService,
  ],
  exports: [
    CoursesService,
    InstructorsService,
    EnrollmentsService,
    ReviewsService,
    CertificatesService,
    QuizzesService,
  ],
})
export class AcademyModule {}
