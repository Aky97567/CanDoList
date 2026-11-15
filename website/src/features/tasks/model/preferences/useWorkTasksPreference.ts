// src/features/tasks/model/preferences/useWorkTasksPreference.ts
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hideWorkTasks';

export const useWorkTasksPreference = () => {
  const [hideWorkTasks, setHideWorkTasks] = useState<boolean>(() => {
    // Initialize from localStorage if available
    const savedPreference = localStorage.getItem(STORAGE_KEY);
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  // Persist to localStorage whenever the value changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hideWorkTasks));
  }, [hideWorkTasks]);

  return {
    hideWorkTasks,
    setHideWorkTasks,
    toggleWorkTasks: () => setHideWorkTasks(prev => !prev)
  };
};
