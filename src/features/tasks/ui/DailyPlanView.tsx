// src/features/tasks/ui/DailyPlanView.tsx
import { useState } from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskCard, TaskForm } from "@/entities";
import { useTasksState } from "../model";

export const DailyPlanView = () => {
  const {
    tasks,
    createTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const dailyTasks = tasks.filter(
    (task) =>
      !task.isCompleted &&
      (task.isDaily || task.addedToDaily || task.category === "chore")
  );

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
          {dailyTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => toggleTaskCompletion(task.id)}
              onTogglePriority={() => toggleTaskPriority(task.id)}
              onRemoveFromDaily={() => toggleDailyTask(task.id)}
            />
          ))}
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
