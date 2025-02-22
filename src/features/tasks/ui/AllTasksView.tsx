// src/features/tasks/ui/AllTasksView.tsx
import { useState } from "react";
import { Paper, Typography, Box, Fab, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskCard, TaskForm, TaskCategory } from "@/entities/task";
import { useTasksState } from "../model";

export const AllTasksView = () => {
  const {
    tasks,
    createTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories: TaskCategory[] = ["work", "personal", "green"];

  return (
    <Box
      sx={{ position: "relative", minHeight: "100vh", pb: 8, width: "100%" }}
    >
      <Grid container spacing={3}>
        {categories.map((category) => {
          const categoryTasks = tasks.filter(
            (task) => task.category === category && !task.isCompleted
          );
          if (categoryTasks.length === 0) return null;

          return (
            <Grid item xs={12} md={4} key={category}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  height: "100%",
                  minWidth: { md: "300px" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    textTransform: "capitalize",
                  }}
                >
                  {category}
                </Typography>
                {categoryTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => toggleTaskCompletion(task.id)}
                    onTogglePriority={() => toggleTaskPriority(task.id)}
                    onToggleDaily={() => toggleDailyTask(task.id)}
                  />
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

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
        onSubmit={createTask}
      />
    </Box>
  );
};
