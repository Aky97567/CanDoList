// src/features/habits/model/streakUtils.ts
import { Task } from '@/entities';

/**
 * Checks if two dates are consecutive days
 * @param date1 ISO date string
 * @param date2 ISO date string
 * @returns boolean indicating if dates are consecutive
 */
export const areConsecutiveDays = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set to midnight to compare just the dates
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

/**
 * Checks if a date is today
 * @param dateStr ISO date string
 * @returns boolean indicating if the date is today
 */
export const isToday = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Gets the current date as YYYY-MM-DD
 * @returns string date in YYYY-MM-DD format
 */
export const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calculates if a habit's streak is at risk (completed yesterday but not today)
 * @param lastCompletedDate ISO date string of last completion
 * @returns boolean indicating if streak is at risk
 */
export const isStreakAtRisk = (lastCompletedDate?: string): boolean => {
  if (!lastCompletedDate) return false;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayString = yesterday.toISOString().split('T')[0];
  const lastCompleted = lastCompletedDate.split('T')[0];
  
  // Streak is at risk if completed yesterday but not today
  return lastCompleted === yesterdayString;
};

/**
 * Checks if a streak is broken (missed for 2+ days)
 * @param lastCompletedDate ISO date string of last completion
 * @returns boolean indicating if streak is broken
 */
export const isStreakBroken = (lastCompletedDate?: string): boolean => {
  if (!lastCompletedDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastDate = new Date(lastCompletedDate);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  // Streak is broken if last completion was 2+ days ago
  return diffDays >= 2;
};

/**
 * Updates streak data for a habit task
 * @param task Habit task to update
 * @param completionDate Completion date (defaults to current date)
 * @returns Updated task with streak information
 */
export const updateHabitStreak = (
  task: Task,
  completionDate: string = new Date().toISOString()
): Task => {
  // If it's not a habit task, return as is
  if (task.category !== 'chore') return task;
  
  const currentDate = completionDate.split('T')[0];
  const lastCompleted = task.lastCompletedDate?.split('T')[0];
  
  // Initialize streak values if they don't exist
  const currentStreak = task.currentStreak || 0;
  const longestStreak = task.longestStreak || 0;
  
  let newCurrentStreak = currentStreak;
  let newLongestStreak = longestStreak;
  
  // If this is the first completion ever
  if (!lastCompleted) {
    newCurrentStreak = 1;
    newLongestStreak = 1;
  } 
  // If already completed today, don't increase streak
  else if (currentDate === lastCompleted) {
    // No change needed
  } 
  // If completed yesterday, continue the streak
  else if (areConsecutiveDays(lastCompleted, currentDate) || lastCompleted === currentDate) {
    newCurrentStreak += 1;
    newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
  } 
  // If streak was broken (missed days)
  else {
    newCurrentStreak = 1; // Reset streak
  }
  
  return {
    ...task,
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastCompletedDate: completionDate,
    streakUpdatedAt: Date.now(),
  };
};

/**
 * Updates streak statuses for all habits
 * This should be called when loading habits to check for broken streaks
 * @param tasks List of all tasks
 * @returns Updated tasks with refreshed streak statuses
 */
export const refreshAllHabitStreaks = (tasks: Task[]): Task[] => {
  const today = getCurrentDateString();
  
  return tasks.map(task => {
    // Only process habit tasks
    if (task.category !== 'chore') return task;
    
    // If no completion data yet, return as is
    if (!task.lastCompletedDate) return task;
    
    const lastCompleted = task.lastCompletedDate.split('T')[0];
    
    // If completed today, no change needed
    if (lastCompleted === today) return task;
    
    // Check if streak is broken (missed for 2+ days)
    if (isStreakBroken(task.lastCompletedDate)) {
      return {
        ...task,
        currentStreak: 0, // Reset streak when broken
        streakUpdatedAt: Date.now(),
      };
    }
    
    // Otherwise keep current streak intact
    return task;
  });
};
