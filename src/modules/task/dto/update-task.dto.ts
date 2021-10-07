import { IsEnum } from "class-validator";
import { TaskStatus } from "../entities/task.entity";

export default class UpdateTaskDto {
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}