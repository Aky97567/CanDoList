// src/features/timeline/ui/TimelineTaskList.tsx
import { Box, List, ListItem, Typography, Chip, Stack } from '@mui/material';
import { Task, getCategoryColor } from '@/entities';

interface TimelineTaskListProps {
  tasks: Task[];
}

export const TimelineTaskList = ({ tasks }: TimelineTaskListProps) => {
  if (tasks.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No tasks completed on this day.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ flex: 1, mb: { xs: 1, sm: 0 } }}>
            <Typography variant="body1">{task.title}</Typography>
            {/* Optional: Add timestamp if available */}
            {(task as any).completedDate && (
              <Typography variant="caption" color="text.secondary">
                Completed at: {new Date((task as any).completedDate).toLocaleTimeString()}
              </Typography>
            )}
          </Box>
          <Stack 
            direction="column" 
            spacing={1} 
            sx={{ 
              alignSelf: { xs: 'flex-start', sm: 'flex-start' },
              minWidth: '120px'
            }}
          >
            <Chip
              label={task.category}
              size="small"
              sx={{
                backgroundColor: getCategoryColor(task.category),
                color: 'white',
                width: 'fit-content'
              }}
            />
            {task.priority === 'high' && (
              <Chip
                label="High Priority"
                size="small"
                color="error"
                variant="outlined"
                sx={{ width: 'fit-content' }}
              />
            )}
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};
