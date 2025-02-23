// src/features/tasks/ui/CompletedTasksView.tsx
import { useState } from "react";
import { Task, TaskCategory, TaskForm } from "@/entities";
import { useTasksState } from "../model";
import { TasksGridView } from "./TasksGridView";

export const CompletedTasksView = () => {
  const { tasks, toggleTaskCompletion, updateTask } = useTasksState();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const categories: TaskCategory[] = ["work", "personal", "green", "chore"];

  const handleEditTask = (taskData: Omit<Task, "id" | "isCompleted">) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  return (
    <>
      <TasksGridView
        title="Completed Tasks"
        categories={categories}
        tasks={tasks}
        taskFilter={(task) => task.isCompleted}
        onComplete={toggleTaskCompletion}
        onEdit={setEditingTask}
        emptyStateMessage="No completed tasks yet"
      />

      <TaskForm
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        initialData={editingTask ?? undefined}
        mode="edit"
      />
    </>
  );
};
