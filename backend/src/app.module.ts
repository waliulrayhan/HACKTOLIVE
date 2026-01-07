import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
