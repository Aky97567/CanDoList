// src/features/tasks/ui/CompletedTasksView.tsx
import { useState } from "react";
import { Task, TaskCategory, TaskForm } from "@/entities";
import { useTasksState } from "../model";
import { TasksGridView } from "./TasksGridView";

interface CompletedTasksViewProps {
  hideWorkTasks?: boolean;
}

export const CompletedTasksView = ({
  hideWorkTasks = false,
}: CompletedTasksViewProps) => {
  const { deleteTask, tasks, toggleTaskCompletion, updateTask, unskipHabit } =
    useTasksState();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const categories: TaskCategory[] = ["work", "personal", "green", "chore"];

  const handleEditTask = (taskData: Omit<Task, "id" | "isCompleted">) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const taskFilter = (task: Task) => {
    if (hideWorkTasks && task.category === "work") return false;
    const isSkippedToday = task.category === "chore" && task.skippedDate === today;
    return task.isCompleted || isSkippedToday;
  };

  return (
    <>
      <TasksGridView
        title="Completed Tasks"
        categories={categories}
        tasks={tasks}
        taskFilter={taskFilter}
        onComplete={toggleTaskCompletion}
        onDelete={deleteTask}
        onEdit={setEditingTask}
        onUnskip={unskipHabit}
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
