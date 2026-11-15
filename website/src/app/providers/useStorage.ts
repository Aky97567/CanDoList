// src/app/providers/useStorage.ts
import { useContext } from 'react'
import { StorageContext } from './StorageProvider'

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}
