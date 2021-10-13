import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async listAllTasks(@Query() searchTaskDto: SearchTaskDto) {
    return this.taskService.getTasks(searchTaskDto);
  }

  @Post()
  async createTask(
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTask(@Param('id') id: string): Promise<void> {
    return await this.taskService.deleteTaskById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskDto,
  ): Promise<Task> {
    const updateTaskDto: UpdateTaskDto = {
      id,
      status,
    };

    return await this.taskService.updateStatus(updateTaskDto);
  }
}
