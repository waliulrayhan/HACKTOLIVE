import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AcademyModule } from './academy/academy.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { InstructorModule } from './instructor/instructor.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { BlogModule } from './blog/blog.module';
import { CareerModule } from './career/career.module';
import { ShopModule } from './shop/shop.module';
import { EmailModule } from './email/email.module';
import { ContactModule } from './contact/contact.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { PaymentModule } from './payment/payment.module';
import { ConsultationModule } from './consultation/consultation.module';

@Module({
  imports: [
    // Rate limiting configuration
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time to live: 60 seconds
      limit: 60, // Maximum 60 requests per minute (1 per second average)
    }]),
    UsersModule,
    AcademyModule,
    AuthModule,
    StudentModule,
    InstructorModule,
    AdminModule,
    UploadModule,
    BlogModule,
    CareerModule,
    ShopModule,
    EmailModule,
    ContactModule,
    NewsletterModule,
    PaymentModule,
    ConsultationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply throttling globally (can be overridden per route)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
