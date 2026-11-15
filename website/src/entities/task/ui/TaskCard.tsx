// src/entities/task/ui/TaskCard.tsx
import { CardContent, Chip, IconButton, Box, Tooltip, Typography } from "@mui/material";
import {
  Check,
  Delete,
  Edit,
  PriorityHigh,
  Today,
  Undo,
  LocalFireDepartment,
  Timer,
  Block,
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
  onSkipToday?: () => void;
  onUnskip?: () => void;
}

export const TaskCard = ({
  task,
  onComplete,
  onDelete,
  onEdit,
  onRemoveFromDaily,
  onTogglePriority,
  onToggleDaily,
  onSkipToday,
  onUnskip,
}: TaskCardProps) => {
  const { title, category, priority, isCompleted, addedToDaily } = task;
  const showRemoveFromDaily = addedToDaily && category !== "chore";

  const isHabit = category === "chore";
  const hasStreak = isHabit && ((task.currentStreak || 0) > 0);
  const atRisk = isHabit && isStreakAtRisk(task.lastCompletedDate);
  const lastCompletedDay = task.lastCompletedDate?.split('T')[0];
  const isSkippedToday = isHabit && !!task.skippedDate &&
    (!lastCompletedDay || task.skippedDate > lastCompletedDay);

  // Get border color - add highlight for at-risk streaks
  const categoryColor = getCategoryColor(category);

  return (
    <TaskCardContainer
      completed={isCompleted}
      category={category}
      categoryColor={categoryColor}
      sx={atRisk && !isCompleted ? {
        boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.5)',
      } : {}}
    >
      <CardContent
        sx={{
          p: "8px !important",
          pr: "4px !important",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          "&:last-child": { pb: "8px !important", pr: "4px !important" },
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
            gap: 0,
            width: { xs: "66px", sm: "auto" },
            justifyContent: "flex-end",
            "& .MuiIconButton-root": {
              width: { xs: "30px", sm: "32px" },
              height: { xs: "30px", sm: "32px" },
              padding: "4px",
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1rem", sm: "1.1rem" },
              },
            },
          }}
        >
          {isSkippedToday ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip label="Skipped" size="small" color="error" />
              {onUnskip && (
                <Tooltip title="Bring back to today">
                  <IconButton size="small" onClick={onUnskip} color="primary">
                    <Undo />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ) : (
            <>
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
              {category === "chore" && onSkipToday && !isCompleted && (
                <Tooltip title="Won't do today">
                  <IconButton size="small" onClick={onSkipToday} color="default">
                    <Block fontSize="small" />
                  </IconButton>
                </Tooltip>
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
            </>
          )}
        </Box>
      </CardContent>
    </TaskCardContainer>
  );
};
