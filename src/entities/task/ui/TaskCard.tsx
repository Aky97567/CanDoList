// src/entities/task/ui/TaskCard.tsx
import { CardContent, Typography, IconButton, Box } from "@mui/material";
import { Check, Today, Undo, PriorityHigh, Edit } from "@mui/icons-material";
import { TaskCardContainer } from "./styles";
import { Task, getCategoryColor } from "../model";

interface TaskCardProps {
  task: Task;
  showDailyIndicator?: boolean;
  onComplete?: () => void;
  onTogglePriority?: () => void;
  onToggleDaily?: () => void;
  onRemoveFromDaily?: () => void;
  onEdit?: (task: Task) => void;
}

export const TaskCard = ({
  task,
  showDailyIndicator = true,
  onComplete,
  onTogglePriority,
  onToggleDaily,
  onRemoveFromDaily,
  onEdit,
}: TaskCardProps) => {
  const { title, category, priority, isCompleted, addedToDaily } = task;
  const showRemoveFromDaily =
    addedToDaily && !task.isDaily && category !== "chore";

  return (
    <TaskCardContainer
      completed={isCompleted}
      category={category}
      categoryColor={getCategoryColor(category)}
    >
      <CardContent
        sx={{
          p: "12px !important",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "&:last-child": { pb: "12px !important" },
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: "1rem",
            fontWeight: 500,
            flex: 1,
            mr: 2,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {onEdit && !isCompleted && (
            <IconButton size="small" onClick={() => onEdit(task)}>
              <Edit fontSize="small" />
            </IconButton>
          )}
          {onTogglePriority && !isCompleted && (
            <IconButton
              size="small"
              onClick={onTogglePriority}
              color={priority === "high" ? "error" : "default"}
            >
              <PriorityHigh />
            </IconButton>
          )}
          {onToggleDaily &&
            !task.isDaily &&
            category !== "chore" &&
            !isCompleted && (
              <IconButton
                size="small"
                onClick={onToggleDaily}
                color={addedToDaily ? "info" : "default"}
              >
                <Today />
              </IconButton>
            )}
          {showRemoveFromDaily && onRemoveFromDaily && !isCompleted && (
            <IconButton size="small" onClick={onRemoveFromDaily} color="error">
              <Today />
            </IconButton>
          )}
          {category === "chore" && (
            <IconButton
              size="small"
              color="error"
              sx={{
                pointerEvents: "none",
              }}
            >
              <Today />
            </IconButton>
          )}
          {isCompleted && onComplete && (
            <IconButton size="small" onClick={onComplete} color="primary">
              <Undo />
            </IconButton>
          )}
          {!isCompleted && onComplete && (
            <IconButton size="small" onClick={onComplete}>
              <Check />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </TaskCardContainer>
  );
};
