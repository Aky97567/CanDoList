// src/shared/api/adapters/out/storage/local/LocalStorageAdapter.ts
import { Task } from '@/entities';
import { CacheStorage } from '@/shared/api/ports/out/storage/';

const CACHE_KEY = 'candolist_cache';
const CACHE_TIMESTAMP_KEY = 'candolist_cache_timestamp';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export class LocalStorageAdapter implements CacheStorage {
  async getCachedTasks(): Promise<Task[]> {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const now = Date.now();

      // Return empty if cache is expired or no timestamp
      if (!timestamp || now - parseInt(timestamp) > CACHE_DURATION) {
        return [];
      }

      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from cache:', error);
      return [];
    }
  }

  async updateCache(tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(tasks));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error updating cache:', error);
      // Non-critical error, don't throw
    }
  }

  async clearCache(): Promise<void> {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Non-critical error, don't throw
    }
  }
}
