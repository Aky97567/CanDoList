// src/shared/api/ports/out/storage/TaskStorage.ts
import { Task } from "@/entities/task";

export interface TaskStorage {
  archiveTask(taskId: string): Promise<void>;
  archiveHabitTask(taskId: string): Promise<void>;
  getTasks(): Promise<Task[]>;
  saveTasks(tasks: Task[]): Promise<void>;
  updateTaskRanks(taskIds: string[], ranks: string[]): Promise<void>;
  getArchivedTasks(): Promise<Record<string, Task[]>>;
  getArchivedTasksForDate(date: string): Promise<Task[]>;
  getArchivedTasksForDateRange(
    startDate: string,
    endDate: string
  ): Promise<Task[]>;
}
