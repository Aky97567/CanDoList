// src/features/tasks/ui/DailyPlanView.tsx
import { useState } from 'react';
import { Box, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Task, TaskForm } from '@/entities';
import { useTasksState } from '../model';
import { DraggableTaskList } from './DraggableTaskList';

interface DailyPlanViewProps {
  hideWorkTasks?: boolean;
}

export const DailyPlanView = ({
  hideWorkTasks = false,
}: DailyPlanViewProps) => {
  const {
    tasks,
    createTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask,
    reorderTasks,
    updateTask,
    skipHabitForToday,
  } = useTasksState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const dailyTasks = tasks
    .filter((task) => {
      if (hideWorkTasks && task.category === 'work') return false;
      if (task.category === 'chore') {
        const lastCompletedDay = task.lastCompletedDate?.split('T')[0];
        const skipIsActive = !!task.skippedDate &&
          (!lastCompletedDay || task.skippedDate > lastCompletedDay);
        return !task.isCompleted && !skipIsActive;
      }
      return !task.isCompleted && task.addedToDaily;
    })
    .sort((a, b) => {
      if (!a.rank) return 1;
      if (!b.rank) return -1;
      return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;
    });

  return (
    <Box
      id="daily-plan-view"
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        pb: 8,
        width: 'calc(100svw - 28px)',
        marginInline: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Today's Tasks ({dailyTasks.length})
      </Typography>

      {dailyTasks.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          No tasks planned for today
        </Typography>
      ) : (
        <Box sx={{ mb: 4 }}>
          <DraggableTaskList
            tasks={dailyTasks}
            onEdit={setEditingTask}
            onReorder={(oldIndex, newIndex) =>
              reorderTasks(dailyTasks, oldIndex, newIndex)
            }
            onComplete={toggleTaskCompletion}
            onTogglePriority={toggleTaskPriority}
            onRemoveFromDaily={toggleDailyTask}
            onSkipToday={skipHabitForToday}
          />
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add task"
        onClick={() => setIsFormOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => createTask({ ...data, addedToDaily: true })}
      />

      <TaskForm
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        initialData={editingTask ?? undefined}
        mode="edit"
      />
    </Box>
  );
};
