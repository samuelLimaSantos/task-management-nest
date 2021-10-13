import { IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/taks-status.enum';

export default class UpdateTaskDto {
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
