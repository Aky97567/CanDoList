export type TaskPriority = 'high' | 'regular';
export type TaskCategory = 'work' | 'personal' | 'chore';
export type TaskColor = 'black' | 'blue' | 'pink' | 'green' | 'red';

export interface TaskEntity {
  id: string;
  title: string;
  category: TaskCategory;
  color: TaskColor;
  priority: TaskPriority;
  isDaily?: boolean;
  isOneTime?: boolean;
}

export {};
