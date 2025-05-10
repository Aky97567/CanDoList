// src/entities/task/ui/TaskCard.tsx
import { CardContent, Typography, IconButton, Box, Tooltip } from "@mui/material";
import {
  Check,
  Delete,
  Edit,
  PriorityHigh,
  Today,
  Undo,
  LocalFireDepartment,
  Timer,
} from "@mui/icons-material";
import { TaskCardContainer } from "./styles";
import { Task, getCategoryColor } from "../model";
import { isStreakAtRisk } from "@/features/habits";

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
  
  // Check if this is a habit task with a streak
  const isHabit = category === "chore";
  const hasStreak = isHabit && ((task.currentStreak || 0) > 0);
  const atRisk = isHabit && isStreakAtRisk(task.lastCompletedDate);

  // Get border color - add highlight for at-risk streaks
  const categoryColor = getCategoryColor(category);

  return (
    <TaskCardContainer
      completed={isCompleted}
      category={category}
      categoryColor={categoryColor}
      // Add custom style for at-risk streaks
      sx={atRisk && !isCompleted ? { 
        boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.5)',
      } : {}}
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
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, mr: 1 }}>
          {/* Show streak indicator for habits with streaks */}
          {isHabit && hasStreak && (
            <Tooltip title={`${task.currentStreak} day streak${atRisk ? ' - at risk!' : ''}`}>
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                {atRisk ? (
                  <Timer fontSize="small" color="error" />
                ) : (
                  <LocalFireDepartment 
                    fontSize="small" 
                    sx={{ 
                      color: (task.currentStreak || 0) >= 7 ? '#E91E63' : '#FFA500' 
                    }} 
                  />
                )}
              </Box>
            </Tooltip>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              flex: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: 0.25,
            width: { xs: "66px", sm: "auto" },
            justifyContent: "flex-end",
            "& .MuiIconButton-root": {
              width: { xs: "30px", sm: "40px" },
              height: { xs: "30px", sm: "40px" },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1rem", sm: "1.25rem" },
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
          {isCompleted && task.category !== "chore" && (
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
