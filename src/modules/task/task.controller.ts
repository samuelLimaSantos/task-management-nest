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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async listAllTasks(
    @Query() searchTaskDto: SearchTaskDto,
    @GetUser() user: User
  ) {
    return this.taskService.getTasks(searchTaskDto, user);
  }

  @Post()
  async createTask(
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskDto, user);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return await this.taskService.getById(id, user);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return await this.taskService.deleteTaskById(id, user);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const updateTaskDto: UpdateTaskDto = {
      id,
      status,
    };

    return await this.taskService.updateStatus(updateTaskDto, user);
  }
}
