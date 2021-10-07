import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  listAllTasks(@Query(new ValidationPipe()) searchTaskDto: SearchTaskDto) {
    if (!!Object.keys(searchTaskDto).length) {
      return this.taskService.searchTask(searchTaskDto);
    }

    return this.taskService.listAllTasks();
  }

  @Post() 
  createTask(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTaskById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body(new ValidationPipe()) {status}: UpdateTaskDto) {
    const updateTaskDto: UpdateTaskDto = {
      id,
      status,
    }

    return this.taskService.updateStatus(updateTaskDto);
  }
}
