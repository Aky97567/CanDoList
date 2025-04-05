// src/features/tasks/ui/AllTasksView.tsx
import { useState } from "react";
import { Task, TaskForm, TaskCategory } from "@/entities";
import { useTasksState } from "../model";
import { TasksGridView } from "./TasksGridView";

interface AllTasksViewProps {
  hideWorkTasks?: boolean;
}

export const AllTasksView = ({ hideWorkTasks = false }: AllTasksViewProps) => {
  const {
    tasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (taskData: Omit<Task, "id" | "isCompleted">) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const categories: TaskCategory[] = ["work", "personal", "green"];

  const taskFilter = (task: Task) => {
    return !task.isCompleted && !(hideWorkTasks && task.category === "work");
  };

  return (
    <>
      <TasksGridView
        title="All Tasks"
        categories={categories}
        tasks={tasks}
        taskFilter={taskFilter}
        onComplete={toggleTaskCompletion}
        onTogglePriority={toggleTaskPriority}
        onToggleDaily={toggleDailyTask}
        onEdit={setEditingTask}
        fabAction={() => setIsFormOpen(true)}
      />

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={createTask}
        mode="create"
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
