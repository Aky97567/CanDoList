// src/entities/task/ui/TaskCard.tsx
import {
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import { Check, Star, StarBorder, Today, Undo } from "@mui/icons-material";
import { TaskCardContainer } from "./styles";
import { Task, getCategoryColor } from "../model";

interface TaskCardProps {
  task: Task;
  showDailyIndicator?: boolean;
  onComplete?: () => void;
  onTogglePriority?: () => void;
  onToggleDaily?: () => void;
  onRemoveFromDaily?: () => void;
}

export const TaskCard = ({
  task,
  showDailyIndicator = true,
  onComplete,
  onTogglePriority,
  onToggleDaily,
  onRemoveFromDaily,
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
      <CardContent sx={{ p: "12px !important" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            mb: 1,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </CardContent>
      <CardActions sx={{ pt: 0, px: 1, pb: 1 }}>
        {onTogglePriority && !isCompleted && (
          <IconButton size="small" onClick={onTogglePriority}>
            {priority === "high" ? <Star color="warning" /> : <StarBorder />}
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
      </CardActions>
    </TaskCardContainer>
  );
};
