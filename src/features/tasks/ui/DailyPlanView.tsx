// src/features/tasks/ui/DailyPlanView.tsx
import { useState } from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskForm } from "@/entities";
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
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const dailyTasks = tasks
    .filter(
      (task) =>
        !task.isCompleted &&
        (task.isDaily || task.addedToDaily || task.category === "chore")
    )
    .sort((a, b) => (b.rank || "").localeCompare(a.rank || "")); // Reversed sort order

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 8 }}>
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
    </Box>
  );
};
