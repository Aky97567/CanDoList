// src/features/tasks/ui/CompletedTasksView.tsx
import { TaskCategory } from "@/entities/task";
import { useTasksState } from "../model";
import { TasksGridView } from "./TasksGridView";

export const CompletedTasksView = () => {
  const { tasks, toggleTaskCompletion } = useTasksState();
  const categories: TaskCategory[] = ["work", "personal", "green", "chore"];

  return (
    <TasksGridView
      title="Completed Tasks"
      categories={categories}
      tasks={tasks}
      taskFilter={(task) => task.isCompleted}
      onComplete={toggleTaskCompletion}
      emptyStateMessage="No completed tasks yet"
    />
  );
};
