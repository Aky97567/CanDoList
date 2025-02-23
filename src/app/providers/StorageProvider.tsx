// src/app/providers/StorageProvider.tsx
import { createContext, ReactNode, useState, useEffect } from 'react';
import { TaskStorage } from '@/shared/api/ports/out/storage/';
import { FirebaseAdapter } from '@/shared/api/adapters/out/storage/firebase/';
import { LocalStorageAdapter } from '@/shared/api/adapters/out/storage/local/';
import { LoadingState, ErrorState } from '@/shared/ui/';

export const StorageContext = createContext<TaskStorage | null>(null);

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider = ({ children }: StorageProviderProps) => {
  const [storage, setStorage] = useState<TaskStorage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const cacheStorage = new LocalStorageAdapter();
        const firebaseStorage = new FirebaseAdapter(cacheStorage);
        
        // Test connection by fetching tasks
        await firebaseStorage.getTasks();
        
        setStorage(firebaseStorage);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize storage:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize storage'));
      } finally {
        setIsInitializing(false);
      }
    };

    initializeStorage();
  }, []);

  const handleRetry = () => {
    setIsInitializing(true);
    setError(null);
  };

  if (isInitializing) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (!storage) {
    return null;
  }

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};
