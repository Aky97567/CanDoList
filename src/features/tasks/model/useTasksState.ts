// src/features/tasks/model/useTasksState.ts
import { useState, useEffect } from "react";
import {
  Task,
  TaskPriority,
  generateInitialRank,
  generateRankBetween,
} from "@/entities";
import { useStorage } from "@/app/";

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

  const createTask = async (
    taskData: Omit<Task, "id" | "isCompleted" | "rank">
  ) => {
    const dailyTasks = tasks.filter(
      (t) => !t.isCompleted && (t.addedToDaily || t.category === "chore")
    );

    const rank =
      dailyTasks.length > 0
        ? generateRankBetween(
            dailyTasks[dailyTasks.length - 1].rank || null,
            null
          )
        : generateInitialRank();

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
      addedToDaily: taskData.category === "chore" || false,
      rank,
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

  const reorderTasks = async (oldIndex: number, newIndex: number) => {
    // Get daily tasks in the same order as they're displayed
    const dailyTasks = tasks
      .filter(
        (t) => !t.isCompleted && (t.addedToDaily || t.category === "chore")
      )
      .sort((a, b) => {
        if (!a.rank) return 1;
        if (!b.rank) return -1;
        return parseInt(a.rank) - parseInt(b.rank);
      });

    const movedTask = dailyTasks[oldIndex];
    let newRank;

    if (newIndex === 0) {
      // Moving to the top - generate rank smaller than the first item's rank
      // For the top position, we want a rank value SMALLER than any existing rank
      const firstItemRank = dailyTasks[0]?.rank;
      const firstRankValue = firstItemRank ? parseInt(firstItemRank) : 1000;
      newRank = Math.max(1, firstRankValue - 1000)
        .toString()
        .padStart(6, "0");
    } else if (newIndex >= dailyTasks.length - 1) {
      // Moving to the bottom - generate rank larger than the last item's rank
      const lastItemRank = dailyTasks[dailyTasks.length - 1]?.rank;
      const lastRankValue = lastItemRank ? parseInt(lastItemRank) : 1000;
      newRank = (lastRankValue + 1000).toString().padStart(6, "0");
    } else {
      // Moving to a middle position - generate rank between the two adjacent items
      const beforeRank = dailyTasks[newIndex - 1]?.rank;
      const afterRank = dailyTasks[newIndex]?.rank;
      const beforeValue = beforeRank ? parseInt(beforeRank) : 0;
      const afterValue = afterRank ? parseInt(afterRank) : beforeValue + 2000;
      newRank = Math.floor((beforeValue + afterValue) / 2)
        .toString()
        .padStart(6, "0");
    }

    // Update all tasks with the new rank
    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id ? { ...task, rank: newRank } : task
    );

    await saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== taskId) return task;

      if (task.isCompleted) {
        return {
          ...task,
          isCompleted: false,
          addedToDaily: task.category === "chore" || task.addedToDaily,
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
    reorderTasks,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  };
};
