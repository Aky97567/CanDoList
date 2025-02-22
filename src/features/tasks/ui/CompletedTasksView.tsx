// src/features/tasks/ui/CompletedTasksView.tsx
import { Paper, Typography, Box, Grid } from "@mui/material";
import { TaskCard, TaskCategory } from "@/entities/task";
import { useTasksState } from "../model";

export const CompletedTasksView = () => {
  const { tasks, toggleTaskCompletion } = useTasksState();
  const categories: TaskCategory[] = ["work", "personal", "green", "chore"];
  const completedTasks = tasks.filter((task) => task.isCompleted);

  if (completedTasks.length === 0) {
    return (
      <Box
        sx={{ position: "relative", minHeight: "100vh", pb: 8, width: "100%" }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Completed Tasks
        </Typography>
        <Typography color="text.secondary">No completed tasks yet</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ position: "relative", minHeight: "100vh", pb: 8, width: "100%" }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Completed Tasks ({completedTasks.length})
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => {
          const categoryTasks = completedTasks.filter(
            (task) => task.category === category
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
                  />
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
