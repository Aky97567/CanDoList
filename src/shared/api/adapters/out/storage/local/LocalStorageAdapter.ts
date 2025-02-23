// src/shared/api/adapters/out/storage/local/LocalStorageAdapter.ts
import { Task } from '@/entities';
import { TaskStorage } from '@/shared/api/ports/out/storage/';

const STORAGE_KEY = 'candolist_tasks';

export class LocalStorageAdapter implements TaskStorage {
  async getTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const tasks = data ? JSON.parse(data) : [];
      return tasks.sort((a: Task, b: Task) => 
        (a.rank || '').localeCompare(b.rank || '')
      );
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      throw error;
    }
  }

  async updateTaskRanks(taskIds: string[], ranks: string[]): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task => {
        const index = taskIds.indexOf(task.id);
        if (index !== -1) {
          return { ...task, rank: ranks[index] };
        }
        return task;
      });
      await this.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task ranks:', error);
      throw error;
    }
  }
}
