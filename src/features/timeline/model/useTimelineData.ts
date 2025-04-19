// src/features/timeline/model/useTimelineData.ts
import { useState, useEffect } from "react";
import { Task } from "@/entities";
import { useStorage } from "@/app/";

export type TimelineData = Record<string, Task[]>;

// Helper to get current year start and end dates
const getCurrentYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 0, 1).toISOString().split("T")[0]; // Jan 1
  const endDate = new Date(currentYear, 11, 31).toISOString().split("T")[0]; // Dec 31
  return { startDate, endDate };
};

// Get predefined date ranges
export const getDateRange = (rangeType: string) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  switch (rangeType) {
    case "current-week": {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      const startDate = new Date(now.setDate(diff)).toISOString().split("T")[0];
      return { startDate, endDate: today };
    }
    case "current-month": {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      return { startDate, endDate: today };
    }
    case "current-year": {
      return getCurrentYearDates();
    }
    case "last-week": {
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      const day = lastWeekDate.getDay();
      const diffStart = lastWeekDate.getDate() - day + (day === 0 ? -6 : 1);
      const startDate = new Date(lastWeekDate.setDate(diffStart))
        .toISOString()
        .split("T")[0];
      const endDate = new Date(
        new Date(startDate).getTime() + 6 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      return { startDate, endDate };
    }
    case "last-month": {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const startDate = new Date(
        lastMonth.getFullYear(),
        lastMonth.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      const endDate = new Date(
        lastMonth.getFullYear(),
        lastMonth.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0];
      return { startDate, endDate };
    }
    case "last-year": {
      const lastYear = now.getFullYear() - 1;
      const startDate = new Date(lastYear, 0, 1).toISOString().split("T")[0];
      const endDate = new Date(lastYear, 11, 31).toISOString().split("T")[0];
      return { startDate, endDate };
    }
    default:
      return getCurrentYearDates();
  }
};

export const useTimelineData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);

  // Default to current year
  const defaultDates = getCurrentYearDates();
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>(defaultDates);

  const storage = useStorage();

  const loadTimelineData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get all archived tasks grouped by date
      const data = await storage.getArchivedTasks();
      setTimelineData(data);

      // If there's a selected date, load tasks for that date
      if (selectedDate) {
        await loadTasksForDate(selectedDate);
      }
    } catch (error) {
      console.error("Error loading timeline data:", error);
      setError("Failed to load timeline data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasksForDate = async (date: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const tasks = await storage.getArchivedTasksForDate(date);
      setSelectedDateTasks(tasks);
      setSelectedDate(date);
    } catch (error) {
      console.error(`Error loading tasks for date ${date}:`, error);
      setError(`Failed to load tasks for ${date}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasksForDateRange = async (startDate: string, endDate: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const tasks = await storage.getArchivedTasksForDateRange(
        startDate,
        endDate
      );

      // Group tasks by date
      const groupedTasks: TimelineData = {};
      tasks.forEach((task) => {
        const completedDate = (
          task as Task & { completedDate: string }
        ).completedDate.split("T")[0];
        if (!groupedTasks[completedDate]) {
          groupedTasks[completedDate] = [];
        }
        groupedTasks[completedDate].push(task);
      });

      setTimelineData(groupedTasks);
      setDateRange({ startDate, endDate });
    } catch (error) {
      console.error(
        `Error loading tasks for date range ${startDate} to ${endDate}:`,
        error
      );
      setError(
        `Failed to load tasks for selected date range. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetDateRange = (rangeType: string) => {
    const { startDate, endDate } = getDateRange(rangeType);
    loadTasksForDateRange(startDate, endDate);
  };

  // Initial load
  useEffect(() => {
    loadTimelineData();
  }, [storage]);

  return {
    isLoading,
    error,
    timelineData,
    selectedDate,
    selectedDateTasks,
    dateRange,
    loadTasksForDate,
    loadTasksForDateRange,
    setPresetDateRange,
    refreshData: loadTimelineData,
  };
};
