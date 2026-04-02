import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CourseCouponPreviewDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 32)
  couponCode: string;
}
