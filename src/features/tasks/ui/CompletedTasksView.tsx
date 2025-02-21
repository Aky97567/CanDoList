// src/features/tasks/ui/CompletedTasksView.tsx
import { Box, Typography } from '@mui/material'
import { TaskCard } from '@/entities/task'
import { useTasksState } from '../model'

export const CompletedTasksView = () => {
  const { tasks, toggleTaskCompletion } = useTasksState()
  
  const completedTasks = tasks.filter(task => task.isCompleted)

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Completed Tasks ({completedTasks.length})
      </Typography>
      
      {completedTasks.length === 0 ? (
        <Typography color="text.secondary">
          No completed tasks yet
        </Typography>
      ) : (
        completedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={() => toggleTaskCompletion(task.id)}
          />
        ))
      )}
    </Box>
  )
}
