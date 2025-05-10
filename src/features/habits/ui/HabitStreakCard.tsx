// src/features/habits/ui/HabitStreakCard.tsx
import { CardContent, Typography, IconButton, Box } from '@mui/material';
import {
  LocalFireDepartment,
  ExpandMore,
  ExpandLess,
  Timer,
} from '@mui/icons-material';
import { useState } from 'react';
import { Task, getCategoryColor } from '@/entities';
import { TaskCardContainer } from '@/entities/task/ui/styles';
import { isStreakAtRisk } from '../model/streakUtils';

interface HabitStreakCardProps {
  habit: Task;
  onSelect: (habit: Task) => void;
}

export const HabitStreakCard = ({ habit, onSelect }: HabitStreakCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const categoryColor = getCategoryColor(habit.category);
  const currentStreak = habit.currentStreak || 0;
  const longestStreak = habit.longestStreak || 0;
  const atRisk = isStreakAtRisk(habit.lastCompletedDate);

  // Get streak color based on length
  const getStreakColor = () => {
    if (currentStreak >= 30) return '#E91E63'; // Pink for 30+ days
    if (currentStreak >= 7) return '#FF9800'; // Orange for 7+ days
    return '#FFC107'; // Yellow for shorter streaks
  };

  return (
    <TaskCardContainer
      category={habit.category}
      categoryColor={categoryColor}
      sx={{
        mb: 2,
        width: '100%',
        maxWidth: '100%',
        ...(atRisk ? { boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.5)' } : {}),
        cursor: 'pointer',
      }}
      onClick={() => onSelect(habit)}
    >
      <CardContent
        sx={{
          p: '12px !important',
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: '12px !important' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {atRisk ? (
              <Timer fontSize="small" color="error" sx={{ mr: 1 }} />
            ) : (
              <LocalFireDepartment
                fontSize="small"
                sx={{ mr: 1, color: getStreakColor() }}
              />
            )}
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              {habit.title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>

        {expanded && (
          <Box sx={{ mt: 1, pl: 3 }}>
            <Typography variant="body2">
              Current streak:{' '}
              <strong>
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </strong>
            </Typography>
            <Typography variant="body2">
              Longest streak:{' '}
              <strong>
                {longestStreak} day{longestStreak !== 1 ? 's' : ''}
              </strong>
            </Typography>
            {habit.lastCompletedDate && (
              <Typography variant="body2">
                Last completed:{' '}
                <strong>
                  {new Date(habit.lastCompletedDate).toLocaleDateString()}
                </strong>
              </Typography>
            )}
            {atRisk && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Complete today to keep your streak going!
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </TaskCardContainer>
  );
};
