import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(3)
  comment: string;
}
