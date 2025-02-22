// src/entities/task/model/types.ts
export type TaskCategory = "work" | "personal" | "chore" | "green";
export type TaskPriority = "high" | "regular";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  isCompleted: boolean;
  isDaily?: boolean;
  isOneTime?: boolean;
  addedToDaily?: boolean;
}

export const getCategoryColor = (category: TaskCategory) => {
  switch (category) {
    case "work":
      return "default"; // black
    case "personal":
      return "primary"; // blue
    case "chore":
      return "secondary"; // pink
    default:
      return "default";
  }
};
