// src/features/habits/ui/HabitStreaksView.tsx
import { useState, useMemo } from "react";
import { Box, Typography, Paper, Tabs, Tab, Divider, Alert } from "@mui/material";
import { Task } from "@/entities";
import { HabitStreakCard } from "./HabitStreakCard";
import { useTasksState } from "@/features/tasks/model";
import { HabitTimelineView } from "./HabitTimelineView";

interface HabitStreaksViewProps {
  hideWorkTasks?: boolean;
}

export const HabitStreaksView = ({ hideWorkTasks = false }: HabitStreaksViewProps) => {
  const { tasks } = useTasksState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState<Task | null>(null);
  
  // Filter for habit tasks
  const habitTasks = useMemo(() => {
    return tasks
      .filter(
        task => 
          task.category === "chore" && 
          !(hideWorkTasks && task.category === "work")
      )
      .sort((a, b) => {
        // Sort by streak length (descending)
        const streakA = a.currentStreak || 0;
        const streakB = b.currentStreak || 0;
        return streakB - streakA;
      });
  }, [tasks, hideWorkTasks]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  const handleHabitSelect = (habit: Task) => {
    setSelectedHabit(habit);
    setSelectedTab(1); // Switch to detail view
  };
  
  return (
    <Box sx={{ pb: 4, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Habit Streaks
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All Habits" />
          <Tab 
            label="Habit Timeline" 
            disabled={!selectedHabit}
          />
        </Tabs>
        
        <Box sx={{ p: 2 }}>
          {selectedTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Your Habits ({habitTasks.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {habitTasks.length === 0 ? (
                <Alert severity="info">
                  You don't have any habits yet. Create a habit task to start tracking streaks!
                </Alert>
              ) : (
                <Box>
                  {habitTasks.map(habit => (
                    <HabitStreakCard 
                      key={habit.id} 
                      habit={habit}
                      onSelect={handleHabitSelect}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
          
          {selectedTab === 1 && selectedHabit && (
            <HabitTimelineView habit={selectedHabit} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};
