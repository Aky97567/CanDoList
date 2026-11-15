// src/features/habits/ui/HabitTimelineView.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Task } from '@/entities';
import { useStorage } from '@/app/';
import { TimelineHeatmap } from '@/features/timeline/ui/TimelineHeatmap';
import { TimelineData } from '@/features/timeline/model';
import { LocalFireDepartment, Whatshot } from '@mui/icons-material';

interface HabitTimelineViewProps {
  habit: Task;
  onToggleCompletion: (taskId: string, date: string) => Promise<void>;
}

export const HabitTimelineView = ({
  habit,
  onToggleCompletion,
}: HabitTimelineViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionDates, setCompletionDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateRange] = useState(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    return {
      startDate: oneYearAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    };
  });

  const storage = useStorage();

  const loadCompletions = async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      setError(null);
      const dates = await storage.getHabitCompletions(
        habit.id,
        dateRange.startDate,
        dateRange.endDate,
      );
      setCompletionDates(dates);
    } catch (err) {
      console.error('Error loading habit completions:', err);
      setError('Failed to load habit timeline data.');
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompletions();
  }, [habit.id]);

  const handleDateClick = async (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (date > today) return; // no future dates

    setSelectedDate(date);
    await onToggleCompletion(habit.id, date);
    await loadCompletions(false);
  };

  // Convert string[] to TimelineData shape TimelineHeatmap expects
  const timelineData: TimelineData = completionDates.reduce((acc, date) => {
    acc[date] = [habit];
    return acc;
  }, {} as TimelineData);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          {habit.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <LocalFireDepartment sx={{ mr: 0.5, color: '#E91E63' }} />
            <Typography variant="body2">
              Current: <strong>{habit.currentStreak || 0}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Whatshot sx={{ mr: 0.5, color: '#FF9800' }} />
            <Typography variant="body2">
              Best: <strong>{habit.longestStreak || 0}</strong>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Paper
        sx={{
          p: 2,
          mb: 3,
          overflowX: 'hidden',
        }}
      >
        <Typography variant="body1" gutterBottom>
          Completion Timeline (Last 12 Months)
        </Typography>

        <TimelineHeatmap
          data={timelineData}
          onDateClick={handleDateClick}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          selectedDate={selectedDate}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            Total completions: <strong>{completionDates.length}</strong>
          </Typography>
          <Typography variant="body2">
            Days tracked: <strong>{completionDates.length}</strong>
          </Typography>
          <Typography variant="body2">
            Current streak: <strong>{habit.currentStreak || 0} days</strong>
          </Typography>
          <Typography variant="body2">
            Longest streak: <strong>{habit.longestStreak || 0} days</strong>
          </Typography>
          {habit.lastCompletedDate && (
            <Typography variant="body2">
              Last completed:{' '}
              <strong>
                {new Date(habit.lastCompletedDate).toLocaleDateString()}
              </strong>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
