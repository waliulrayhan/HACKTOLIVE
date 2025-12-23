import { IsString, IsOptional } from 'class-validator';

export class ToggleCommentLikeDto {
  @IsString()
  @IsOptional()
  userEmail?: string;
}
