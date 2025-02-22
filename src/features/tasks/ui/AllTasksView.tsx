// src/features/tasks/ui/AllTasksView.tsx
import { useState } from "react"
import { Task, TaskForm, TaskCategory } from "@/entities/task"
import { useTasksState } from "../model"
import { TasksGridView } from "./TasksGridView"

export const AllTasksView = () => {
  const {
    tasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  } = useTasksState()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleEditTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setEditingTask(null)
    }
  }

  const categories: TaskCategory[] = ["work", "personal", "green"]

  return (
    <>
      <TasksGridView
        categories={categories}
        tasks={tasks}
        taskFilter={(task) => !task.isCompleted}
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
  )
}
