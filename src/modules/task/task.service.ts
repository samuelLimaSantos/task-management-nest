import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(readonly taskRepository: TaskRepository) {}

  async getTasks(searchTaskDto: SearchTaskDto, user: User): Promise<Task[]> {
    const { search, status } = searchTaskDto;

    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async getById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user,
      }
    });

    if (!task)
      throw new HttpException('Task does not exists', HttpStatus.BAD_REQUEST);

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const { affected } = await this.taskRepository.delete({id, user});

    if (affected === 0) {
      throw new HttpException('Task does not exists', HttpStatus.BAD_REQUEST);
    }
  }

  async updateStatus({ id, status }: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.getById(id, user);

    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }
}
