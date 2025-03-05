// src/features/tasks/ui/TasksGridView.tsx
import { Box, Grid, Paper, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Task, TaskCard, TaskCategory } from "@/entities";

interface TasksGridViewProps {
  title?: string;
  categories: TaskCategory[];
  tasks: Task[];
  emptyStateMessage?: string;
  taskFilter: (task: Task) => boolean;
  onComplete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onTogglePriority?: (taskId: string) => void;
  onToggleDaily?: (taskId: string) => void;
  fabAction?: () => void;
}

export const TasksGridView = ({
  title,
  categories,
  tasks,
  emptyStateMessage,
  taskFilter,
  onComplete,
  onEdit,
  onTogglePriority,
  onToggleDaily,
  fabAction,
}: TasksGridViewProps) => {
  const filteredTasks = tasks.filter(taskFilter);

  if (filteredTasks.length === 0 && emptyStateMessage) {
    return (
      <Box
        sx={{ position: "relative", minHeight: "100vh", pb: 8, width: "100%" }}
      >
        {title && (
          <Typography variant="h6" sx={{ mb: 3 }}>
            {title}
          </Typography>
        )}
        <Typography color="text.secondary">{emptyStateMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box
      id="tasks-grid-box"
      sx={{
        position: "relative",
        minHeight: "100vh",
        pb: 8,
        width: "calc(100vw - 32px)",
      }}
    >
      {title && (
        <Typography variant="h6" sx={{ mb: 3 }}>
          {title} {filteredTasks.length > 0 && `(${filteredTasks.length})`}
        </Typography>
      )}

      <Grid container>
        {categories.map((category) => {
          const categoryTasks = filteredTasks.filter(
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
                    onComplete={() => onComplete(task.id)}
                    onEdit={onEdit ? () => onEdit(task) : undefined}
                    onTogglePriority={
                      onTogglePriority
                        ? () => onTogglePriority(task.id)
                        : undefined
                    }
                    onToggleDaily={
                      onToggleDaily ? () => onToggleDaily(task.id) : undefined
                    }
                  />
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {fabAction && (
        <Fab
          color="primary"
          aria-label="add task"
          onClick={fabAction}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};
