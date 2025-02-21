// src/shared/api/ports/out/storage/TaskStorage.ts
import { Task } from '@/entities/task'

export interface TaskStorage {
  getTasks(): Promise<Task[]>
  saveTasks(tasks: Task[]): Promise<void>
}
