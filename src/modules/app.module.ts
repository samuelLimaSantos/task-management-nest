import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'task_management',
      username: 'postgres',
      password: 'docker',
      port: 5432,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
