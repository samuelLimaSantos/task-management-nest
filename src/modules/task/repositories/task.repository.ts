import { User } from 'src/modules/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/taks-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { description, title } = createTaskDto;

    const task = this.create({
      description,
      title,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }
}
