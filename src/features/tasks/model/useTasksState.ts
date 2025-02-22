// src/features/tasks/model/useTasksState.ts
import { useState, useEffect } from "react";
import { Task, TaskPriority } from "@/entities/task";
import { useStorage } from "@/app/providers/useStorage";

export const useTasksState = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const storage = useStorage();

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await storage.getTasks();
      setTasks(storedTasks);
    };
    loadTasks();
  }, [storage]);

  const saveTasks = async (newTasks: Task[]) => {
    await storage.saveTasks(newTasks);
    setTasks(newTasks);
  };

  const createTask = async (taskData: Omit<Task, "id" | "isCompleted">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
      addedToDaily: taskData.isDaily || taskData.category === "chore" || false,
    };
    await saveTasks([...tasks, newTask]);
  };

  const updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, "id">>
  ) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    await saveTasks(newTasks);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== taskId) return task;

      if (task.isCompleted) {
        return {
          ...task,
          isCompleted: false,
          addedToDaily:
            task.isDaily || task.category === "chore" || task.addedToDaily,
        };
      }

      return { ...task, isCompleted: true };
    });
    await saveTasks(newTasks);
  };

  const toggleTaskPriority = async (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            priority: (task.priority === "high"
              ? "regular"
              : "high") as TaskPriority,
          }
        : task
    );
    await saveTasks(newTasks);
  };

  const toggleDailyTask = async (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, addedToDaily: !task.addedToDaily } : task
    );
    await saveTasks(newTasks);
  };

  return {
    tasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  };
};
