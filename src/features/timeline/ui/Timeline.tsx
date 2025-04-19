// src/features/timeline/ui/Timeline.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import { TimelineHeatmap } from "./TimelineHeatmap";
import { TimelineTaskList } from "./TimelineTaskList";
import { useTimelineData } from "../model";
import { TaskCategory } from "@/entities";

interface TimelineProps {
  hideWorkTasks: boolean;
}

export const Timeline = ({ hideWorkTasks }: TimelineProps) => {
  const {
    isLoading,
    error,
    timelineData,
    selectedDate,
    selectedDateTasks,
    dateRange,
    loadTasksForDate,
    loadTasksForDateRange,
    setPresetDateRange,
  } = useTimelineData();

  const [startDate, setStartDate] = useState(dateRange.startDate);
  const [endDate, setEndDate] = useState(dateRange.endDate);

  // Update local state when dateRange from hook changes
  useEffect(() => {
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
  }, [dateRange.startDate, dateRange.endDate]);

  const filteredTasks = hideWorkTasks
    ? selectedDateTasks.filter((task) => task.category !== "work")
    : selectedDateTasks;

  const handleDateClick = (date: string) => {
    loadTasksForDate(date);
  };

  const handleDateRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTasksForDateRange(startDate, endDate);
  };

  // Preset date range handlers - will update both backend data and UI inputs
  const handlePresetDateRange = (preset: string) => {
    const today = new Date();
    let newStartDate = "";
    let newEndDate = "";

    // Current week (Sunday to Saturday)
    if (preset === "current-week") {
      const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
      const sundayDate = new Date(today);
      sundayDate.setDate(today.getDate() - currentDay);

      const saturdayDate = new Date(today);
      saturdayDate.setDate(today.getDate() + (6 - currentDay));

      newStartDate = sundayDate.toISOString().split("T")[0];
      newEndDate = saturdayDate.toISOString().split("T")[0];
    }

    // Current month
    else if (preset === "current-month") {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      newStartDate = firstDayOfMonth.toISOString().split("T")[0];
      newEndDate = lastDayOfMonth.toISOString().split("T")[0];
    }

    // Year to date (Jan 1 to today)
    else if (preset === "current-year") {
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      newStartDate = firstDayOfYear.toISOString().split("T")[0];
      newEndDate = today.toISOString().split("T")[0];
    }

    // Last week
    else if (preset === "last-week") {
      const lastSunday = new Date(today);
      const currentDay = today.getDay();
      lastSunday.setDate(today.getDate() - currentDay - 7);

      const lastSaturday = new Date(lastSunday);
      lastSaturday.setDate(lastSunday.getDate() + 6);

      newStartDate = lastSunday.toISOString().split("T")[0];
      newEndDate = lastSaturday.toISOString().split("T")[0];
    }

    // Last month
    else if (preset === "last-month") {
      const firstDayLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastDayLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      newStartDate = firstDayLastMonth.toISOString().split("T")[0];
      newEndDate = lastDayLastMonth.toISOString().split("T")[0];
    }

    // Last 52 weeks
    else if (preset === "last-year") {
      const weeksAgo52 = new Date(today);
      weeksAgo52.setDate(today.getDate() - 364); // 52 weeks * 7 days = 364 days

      newStartDate = weeksAgo52.toISOString().split("T")[0];
      newEndDate = today.toISOString().split("T")[0];
    }

    // Update local state
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    // Update data
    loadTasksForDateRange(newStartDate, newEndDate);

    // Call the hook's preset function as well (in case it does other things)
    setPresetDateRange(preset);
  };

  // Calculate total tasks by category
  const getCategoryCounts = () => {
    const counts: Record<TaskCategory, number> = {
      work: 0,
      personal: 0,
      green: 0,
      chore: 0,
    };

    // Count tasks in the entire timeline data
    Object.values(timelineData).forEach((tasksForDate) => {
      tasksForDate.forEach((task) => {
        counts[task.category as TaskCategory] =
          (counts[task.category as TaskCategory] || 0) + 1;
      });
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const totalTasks = Object.values(categoryCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Box
      sx={{
        py: 2,
        width: "calc(100vw - 48px)",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Task Completion Timeline
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Date Range
        </Typography>

        {/* Quick selection buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2 }}
          flexWrap="wrap"
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePresetDateRange("current-week")}
          >
            Current Week
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePresetDateRange("current-month")}
          >
            Current Month
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePresetDateRange("current-year")}
          >
            Year to Date
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePresetDateRange("last-week")}
          >
            Last Week
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePresetDateRange("last-month")}
          >
            Last Month
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handlePresetDateRange("last-year")}
          >
            Last 52 Weeks
          </Button>
        </Stack>

        <form onSubmit={handleDateRangeSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{
                  "& input": {
                    width: "100%",
                    boxSizing: "border-box",
                    mb: 1,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{
                  "& input": {
                    width: "100%",
                    boxSizing: "border-box",
                    mb: 1,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="primary">
                  Apply
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Total tasks completed: <strong>{totalTasks}</strong>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    By category:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Work: {categoryCounts.work}
                    </Typography>
                    <Typography variant="body2">
                      Personal: {categoryCounts.personal}
                    </Typography>
                    <Typography variant="body2">
                      Green: {categoryCounts.green}
                    </Typography>
                    <Typography variant="body2">
                      Chores: {categoryCounts.chore}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Date range: <strong>{dateRange.startDate}</strong> to{" "}
                  <strong>{dateRange.endDate}</strong>
                </Typography>
                <Typography variant="body2">
                  Days with completed tasks:{" "}
                  <strong>{Object.keys(timelineData).length}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Completion Heatmap
            </Typography>
            <TimelineHeatmap
              data={timelineData}
              onDateClick={handleDateClick}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              selectedDate={selectedDate}
            />
          </Paper>

          {selectedDate && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tasks Completed on {selectedDate}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TimelineTaskList tasks={filteredTasks} />
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};
