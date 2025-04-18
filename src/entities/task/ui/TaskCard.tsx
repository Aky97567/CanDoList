// src/entities/task/ui/TaskCard.tsx
import { CardContent, Typography, IconButton, Box } from "@mui/material";
import {
  Check,
  Delete,
  Edit,
  PriorityHigh,
  Today,
  Undo,
} from "@mui/icons-material";
import { TaskCardContainer } from "./styles";
import { Task, getCategoryColor } from "../model";

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
  onDelete?: () => void;
  onEdit?: (task: Task) => void;
  onRemoveFromDaily?: () => void;
  onTogglePriority?: () => void;
  onToggleDaily?: () => void;
}

export const TaskCard = ({
  task,
  onComplete,
  onDelete,
  onEdit,
  onRemoveFromDaily,
  onTogglePriority,
  onToggleDaily,
}: TaskCardProps) => {
  const { title, category, priority, isCompleted, addedToDaily } = task;
  const showRemoveFromDaily = addedToDaily && category !== "chore";

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
          alignItems: "flex-start",
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
            mr: 1,
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: 0.25,
            width: { xs: "66px", sm: "auto" }, // Reduced from 88px to 66px for smaller buttons
            justifyContent: "flex-end",
            "& .MuiIconButton-root": {
              width: { xs: "30px", sm: "40px" }, // Smaller buttons on mobile
              height: { xs: "30px", sm: "40px" },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1rem", sm: "1.25rem" }, // Smaller icons on mobile
              },
            },
          }}
        >
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
          {onToggleDaily && category !== "chore" && !isCompleted && (
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
          {isCompleted && (
            <IconButton
              size="small"
              onClick={() => onDelete && onDelete()}
              color="error"
            >
              <Delete />
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
