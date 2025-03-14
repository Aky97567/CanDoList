// src/features/tasks/ui/DailyPlanView.tsx
import { useState } from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Task, TaskForm } from "@/entities";
import { useTasksState } from "../model";
import { DraggableTaskList } from "./DraggableTaskList";

export const DailyPlanView = () => {
  const {
    tasks,
    createTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
    reorderTasks,
    updateTask,
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (taskData: Omit<Task, "id" | "isCompleted">) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  // Filter for daily tasks and sort by rank (ascending order)
  // With numeric ranks stored as strings, smaller numbers appear at the top
  const dailyTasks = tasks
    .filter(
      (task) =>
        !task.isCompleted &&
        (task.isDaily || task.addedToDaily || task.category === "chore")
    )
    .sort((a, b) => {
      // Handle missing ranks
      if (!a.rank) return 1;
      if (!b.rank) return -1;

      // Compare as numbers, not strings
      return parseInt(a.rank) - parseInt(b.rank);
    });

  return (
    <Box
      id="daily-plan-view"
      sx={{
        position: "relative",
        minHeight: "100vh",
        pb: 8,
        width: "calc(100vw - 28px)",
        maxWidth: "400px",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Today's Tasks ({dailyTasks.length})
      </Typography>

      {dailyTasks.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          No tasks planned for today
        </Typography>
      ) : (
        <Box sx={{ mb: 4 }}>
          <DraggableTaskList
            tasks={dailyTasks}
            onEdit={setEditingTask}
            onReorder={reorderTasks}
            onComplete={toggleTaskCompletion}
            onTogglePriority={toggleTaskPriority}
            onRemoveFromDaily={toggleDailyTask}
          />
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add task"
        onClick={() => setIsFormOpen(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => createTask({ ...data, isDaily: true })}
      />

      <TaskForm
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        initialData={editingTask ?? undefined}
        mode="edit"
      />
    </Box>
  );
};
