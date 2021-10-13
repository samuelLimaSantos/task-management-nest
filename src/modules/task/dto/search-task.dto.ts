import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums/taks-status.enum';

export class SearchTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
