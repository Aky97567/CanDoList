// src/App.tsx
import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Navbar } from '@/widgets';
import { View } from '@/shared';
import {
  AllTasksView,
  CompletedTasksView,
  DailyPlanView,
  Timeline,
} from '@/features';
import { HabitStreaksView } from '@/features/habits';
import { StorageProvider } from '@/app/';
import { useWorkTasksPreference } from '@/features/tasks/model';
import { AppContainer } from './styles';

function App() {
  const [currentView, setCurrentView] = useState<View>('daily-plan');
  const { hideWorkTasks, toggleWorkTasks } = useWorkTasksPreference();

  return (
    <StorageProvider>
      <Box
        id="root-of-all-evil"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: '100vw',
        }}
      >
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          hideWorkTasks={hideWorkTasks}
          onToggleWorkTasks={toggleWorkTasks}
        />
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <AppContainer component="main">
          {currentView === 'all-tasks' && (
            <AllTasksView hideWorkTasks={hideWorkTasks} />
          )}
          {currentView === 'daily-plan' && (
            <DailyPlanView hideWorkTasks={hideWorkTasks} />
          )}
          {currentView === 'completed' && (
            <CompletedTasksView hideWorkTasks={hideWorkTasks} />
          )}
          {currentView === 'timeline' && (
            <Timeline hideWorkTasks={hideWorkTasks} />
          )}
          {currentView === 'habit-streaks' && <HabitStreaksView />}
        </AppContainer>
      </Box>
    </StorageProvider>
  );
}

export default App;
