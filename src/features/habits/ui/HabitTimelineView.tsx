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
import { LocalFireDepartment, Whatshot } from '@mui/icons-material';

interface HabitTimelineViewProps {
  habit: Task;
}

export const HabitTimelineView = ({ habit }: HabitTimelineViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<Record<string, Task[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const storage = useStorage();

  // Get dates for one year back
  const getYearDateRange = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return {
      startDate: oneYearAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    };
  };

  // Load archived task data for this habit
  const loadHabitCompletions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get date range
      const range = getYearDateRange();
      setDateRange(range);

      // Fetch archived tasks for date range
      const archivedTasks = await storage.getArchivedTasksForDateRange(
        range.startDate,
        range.endDate
      );

      // Filter for just this habit and create timeline data
      const habitData: Record<string, Task[]> = {};

      archivedTasks.forEach((task) => {
        if (task.id === habit.id) {
          const completedDate = (task as any).completedDate.split('T')[0];

          if (!habitData[completedDate]) {
            habitData[completedDate] = [];
          }

          habitData[completedDate].push(task);
        }
      });

      setTimelineData(habitData);
    } catch (error) {
      console.error('Error loading habit timeline data:', error);
      setError('Failed to load habit timeline data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // Load data on component mount
  useEffect(() => {
    loadHabitCompletions();
  }, [habit.id]);

  // Calculate streak data
  const totalCompletions = Object.values(timelineData).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  );
  const daysTracked = Object.keys(timelineData).length;

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

      <Paper sx={{ p: 2, mb: 3 }}>
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
            Total completions: <strong>{totalCompletions}</strong>
          </Typography>
          <Typography variant="body2">
            Days tracked: <strong>{daysTracked}</strong>
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
