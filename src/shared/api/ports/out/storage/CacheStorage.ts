// src/shared/api/ports/out/storage/CacheStorage.ts
import { Task } from '@/entities';

export interface CacheStorage {
  getCachedTasks(): Promise<Task[]>;
  updateCache(tasks: Task[]): Promise<void>;
  clearCache(): Promise<void>;
}
