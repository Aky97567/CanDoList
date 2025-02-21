// src/shared/api/adapters/out/storage/local/LocalStorageAdapter.ts
import { TaskStorage } from '@/shared/api/ports/out/storage'
import { Task } from '@/entities/task'

const STORAGE_KEY = 'candolist_tasks'

export class LocalStorageAdapter implements TaskStorage {
  async getTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      throw error
    }
  }
}
