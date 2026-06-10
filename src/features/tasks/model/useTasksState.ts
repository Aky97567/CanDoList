// src/features/tasks/model/useTasksState.ts
import { useState, useEffect } from 'react';
import {
  Task,
  TaskPriority,
  generateInitialRank,
  generateRankBetween,
  generateRankAfter,
} from '@/entities';
import { useStorage } from '@/app/';
import { updateHabitStreak, refreshAllHabitStreaks } from '@/features/habits';

export const useTasksState = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const storage = useStorage();

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await storage.getTasks();

      // Refresh habit streaks when loading tasks
      const refreshedTasks = refreshAllHabitStreaks(storedTasks);

      // One-time migration: replace old numeric ranks with fractional-indexing keys
      const hasLegacyRanks = refreshedTasks.some(
        (t) => t.rank !== undefined && /^\d+$/.test(t.rank)
      );
      if (hasLegacyRanks) {
        const sorted = [...refreshedTasks].sort((a, b) => {
          const aNum = parseInt(a.rank ?? '0');
          const bNum = parseInt(b.rank ?? '0');
          return aNum - bNum;
        });
        let prev: string | null = null;
        const migrated = sorted.map((task) => {
          const newRank = prev === null ? generateInitialRank() : generateRankAfter(prev);
          prev = newRank;
          return { ...task, rank: newRank };
        });
        await storage.saveTasks(migrated);
        setTasks(migrated);
        return;
      }

      // If any streaks were updated, save the changes
      if (JSON.stringify(refreshedTasks) !== JSON.stringify(storedTasks)) {
        await storage.saveTasks(refreshedTasks);
        setTasks(refreshedTasks);
      } else {
        setTasks(storedTasks);
      }
    };
    loadTasks();
  }, [storage]);

  const saveTasks = async (newTasks: Task[]) => {
    await storage.saveTasks(newTasks);
    setTasks(newTasks);
  };

  const createTask = async (
    taskData: Omit<Task, 'id' | 'isCompleted' | 'rank'>
  ) => {
    const dailyTasks = tasks.filter(
      (t) => !t.isCompleted && (t.addedToDaily || t.category === 'chore')
    );

    const rank =
      dailyTasks.length > 0
        ? generateRankBetween(
            dailyTasks[dailyTasks.length - 1].rank || null,
            null
          )
        : generateInitialRank();

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
      addedToDaily:
        taskData.category === 'chore' || taskData.addedToDaily || false,
      rank,
      // Initialize streak data for habit tasks
      ...(taskData.category === 'chore' ? { 
        currentStreak: 0, 
        longestStreak: 0 
      } : {})
    };
    await saveTasks([...tasks, newTask]);
  };

  const updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, 'id'>>
  ) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    await saveTasks(newTasks);
  };

  const reorderTasks = async (dailyTasks: Task[], oldIndex: number, newIndex: number) => {
    const movedTask = dailyTasks[oldIndex];
    const reordered = [...dailyTasks];
    reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedTask);

    const before = reordered[newIndex - 1]?.rank ?? null;
    const after = reordered[newIndex + 1]?.rank ?? null;
    const newRank = generateRankBetween(before, after);

    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id ? { ...task, rank: newRank } : task
    );

    await saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const taskToToggle = tasks.find(task => task.id === taskId);
    if (!taskToToggle) return;
    
    let updatedTask: Task;
    
    if (taskToToggle.isCompleted) {
      // Uncompleting a task
      updatedTask = {
        ...taskToToggle,
        isCompleted: false,
        addedToDaily: taskToToggle.category === 'chore' || taskToToggle.addedToDaily,
      };
    } else {
      // Completing a task
      updatedTask = { 
        ...taskToToggle, 
        isCompleted: true 
      };
      
      // If it's a habit task, update streak data
      if (taskToToggle.category === 'chore') {
        updatedTask = updateHabitStreak(updatedTask);
        
        // Also add to the archive for timeline tracking
        await storage.archiveHabitTask(taskId);
      }
    }
    
    const newTasks = tasks.map(task => 
      task.id === taskId ? updatedTask : task
    );
    
    await saveTasks(newTasks);
  };

  const toggleTaskPriority = async (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            priority: (task.priority === 'high'
              ? 'regular'
              : 'high') as TaskPriority,
          }
        : task
    );
    await saveTasks(newTasks);
  };

  const unskipHabit = async (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, skippedDate: undefined } : task
    );
    await saveTasks(newTasks);
  };

  const skipHabitForToday = async (taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, skippedDate: today } : task
    );
    await saveTasks(newTasks);
  };

  const toggleDailyTask = async (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, addedToDaily: !task.addedToDaily } : task
    );
    await saveTasks(newTasks);
  };

  const deleteTask = async (taskId: string) => {
    // Find the task to check its category
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (taskToDelete) {
      // If it's a habit task, use archiveHabitTask to preserve it
      if (taskToDelete.category === 'chore') {
        await storage.archiveHabitTask(taskId);
      } else {
        // For all other task types, use the original archiveTask method
        await storage.archiveTask(taskId);
      }
    }

    // Remove the task from the UI
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  };

  return {
    tasks,
    createTask,
    deleteTask,
    updateTask,
    reorderTasks,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
    skipHabitForToday,
    unskipHabit,
  };
};
