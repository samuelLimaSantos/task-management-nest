import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TaskService {

  private tasks: Task[] = [];

  listAllTasks(): Task[] {
    return this.tasks;
  }

  searchTask({search, status}: SearchTaskDto): Task[] {
    let taskFiltered = this.listAllTasks();

    if (status) {
      taskFiltered = this.tasks.filter(task => task.status === status);
    }

    if (search) {
      taskFiltered = this.tasks.filter(task => {
        const lowerSearch = search.toLowerCase();

        return task.description.toLowerCase().includes(lowerSearch) || task.title.toLowerCase().includes(lowerSearch);
      });
    }

    return taskFiltered;
  }

  getById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) 
      throw new HttpException('Task does not exists', HttpStatus.BAD_REQUEST);
      
    return task;
  }

  createTask({title, description}: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      description,
      title,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task);

    return task;
  }

  deleteTaskById(id: string): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      throw new HttpException('Task does not exists', HttpStatus.BAD_REQUEST);
    }

    this.tasks.splice(taskIndex, 1);
  }

  updateStatus({ id, status }: UpdateTaskDto): Task {
    this.tasks = this.tasks.map(task => {
      if (task.id === id) 
        task.status = status;

      return task;
    });

    return this.getById(id);
  }

 
}
