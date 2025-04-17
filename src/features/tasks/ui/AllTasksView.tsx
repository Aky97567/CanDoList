// src/features/tasks/ui/AllTasksView.tsx
import { useMemo, useState } from "react";
import { Task, TaskForm, TaskCategory } from "@/entities";
import { useTasksState } from "../model";
import { TasksGridView } from "./TasksGridView";

interface AllTasksViewProps {
  hideWorkTasks?: boolean;
}

const getPriorityValue = (priority: string): number => {
  switch (priority) {
    case "high":
      return 0;
    case "regular":
      return 1;
    case "low":
      return 2;
    default:
      return 3;
  }
};

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

  const sortedTasks = useMemo(() => {
    return [...tasks].sort(
      (a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority)
    );
  }, [tasks]);

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
        tasks={sortedTasks}
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
