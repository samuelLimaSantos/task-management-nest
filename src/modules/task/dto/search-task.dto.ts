import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../entities/task.entity";

export class SearchTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}