// src/features/tasks/ui/AllTasksView.tsx
import { useState } from "react";
import { TaskForm, TaskCategory } from "@/entities/task";
import { useTasksState } from "../model";
import { TasksGridView } from "./TasksGridView";

export const AllTasksView = () => {
  const {
    tasks,
    createTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories: TaskCategory[] = ["work", "personal", "green"];

  return (
    <>
      <TasksGridView
        categories={categories}
        tasks={tasks}
        taskFilter={(task) => !task.isCompleted}
        onComplete={toggleTaskCompletion}
        onTogglePriority={toggleTaskPriority}
        onToggleDaily={toggleDailyTask}
        fabAction={() => setIsFormOpen(true)}
      />

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={createTask}
      />
    </>
  );
};
