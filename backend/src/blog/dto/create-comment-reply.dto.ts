import { IsString, MinLength } from 'class-validator';

export class CreateCommentReplyDto {
  @IsString()
  @MinLength(3)
  comment: string;
}
