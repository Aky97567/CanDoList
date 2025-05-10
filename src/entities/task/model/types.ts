// src/entities/task/model/types.ts
export type TaskCategory = 'work' | 'personal' | 'green' | 'chore';
export type TaskPriority = 'high' | 'regular';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  isCompleted: boolean;
  isOneTime?: boolean;
  addedToDaily?: boolean;
  rank?: string;
  // Streak-related fields (used for habit tasks)
  currentStreak?: number;
  longestStreak?: number;
  lastCompletedDate?: string;
  streakUpdatedAt?: number; // timestamp when streak was last calculated
}

export const getCategoryColor = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return '#757575'; // grey[600]
    case 'personal':
      return '#2196F3'; // blue[500]
    case 'chore':
      return '#E91E63'; // vibrant pink
    case 'green':
      return '#4CAF50'; // green[500]
    default:
      return '#757575';
  }
};

export const getCategoryDisplayName = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return 'Work';
    case 'personal':
      return 'Personal';
    case 'chore':
      return 'Habit';
    case 'green':
      return 'Breakthrough';
    default:
      return 'Unknown';
  }
};
