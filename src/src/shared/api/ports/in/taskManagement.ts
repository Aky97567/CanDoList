import { Task } from '../../domain/task';

export interface TaskManagementPort {
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  getTasks(): Promise<Task[]>;
  getDailyTasks(): Promise<Task[]>;
}

export {};
