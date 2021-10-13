import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/taks-status.enum';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(readonly taskRepository: TaskRepository) {}

  async getTasks(searchTaskDto: SearchTaskDto): Promise<Task[]> {
    const { search, status } = searchTaskDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async getById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task)
      throw new HttpException('Task does not exists', HttpStatus.BAD_REQUEST);

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: string): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);

    if (affected === 0) {
      throw new HttpException('Task does not exists', HttpStatus.BAD_REQUEST);
    }
  }

  async updateStatus({ id, status }: UpdateTaskDto): Promise<Task> {
    const task = await this.getById(id);

    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }
}
