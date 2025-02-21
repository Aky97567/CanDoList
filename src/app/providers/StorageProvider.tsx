// src/app/providers/StorageProvider.tsx
import { createContext, ReactNode } from 'react'
import { TaskStorage } from '@/shared/api/ports/out/storage'
import { LocalStorageAdapter } from '@/shared/api/adapters/out/storage/local'

export const StorageContext = createContext<TaskStorage | null>(null)

interface StorageProviderProps {
  children: ReactNode
  storage?: TaskStorage
}

export const StorageProvider = ({ 
  children, 
  storage = new LocalStorageAdapter() 
}: StorageProviderProps) => {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  )
}
