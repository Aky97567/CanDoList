// src/entities/task/ui/TaskCard.tsx
import { CardContent, Typography, IconButton, Chip, Box } from '@mui/material'
import { Check, Star, StarBorder, Today, Undo } from '@mui/icons-material'
import { TaskCardContainer } from './styles'
import { Task, getCategoryColor } from '../model'

interface TaskCardProps {
  task: Task
  showDailyIndicator?: boolean
  onComplete?: () => void
  onTogglePriority?: () => void
  onToggleDaily?: () => void
  onRemoveFromDaily?: () => void
}

export const TaskCard = ({ 
  task, 
  showDailyIndicator = true,
  onComplete, 
  onTogglePriority, 
  onToggleDaily,
  onRemoveFromDaily 
}: TaskCardProps) => {
  const { title, category, priority, isCompleted, addedToDaily } = task
  const showRemoveFromDaily = addedToDaily && !task.isDaily && category !== 'chore'

  return (
    <TaskCardContainer completed={isCompleted}>
      <CardContent sx={{ p: '12px !important' }}>  {/* Reduced padding */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            mb: 1,  // Reduced margin
            fontSize: '1rem',  // Smaller font size
            fontWeight: 500 
          }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>  {/* Reduced gap */}
            <Chip 
              label={category} 
              size="small" 
              color={getCategoryColor(category)}
              sx={{ height: 24 }}  // Smaller chip height
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>  {/* Reduced gap */}
            {onTogglePriority && !isCompleted && (
              <IconButton size="small" onClick={onTogglePriority} sx={{ p: 0.5 }}>
                {priority === 'high' ? <Star color="warning" /> : <StarBorder />}
              </IconButton>
            )}
            {onToggleDaily && !task.isDaily && category !== 'chore' && !isCompleted && (
              <IconButton 
                size="small"
                onClick={onToggleDaily}
                color={addedToDaily ? "info" : "default"}
                sx={{ p: 0.5 }}
              >
                <Today />
              </IconButton>
            )}
            {showRemoveFromDaily && onRemoveFromDaily && !isCompleted && (
              <IconButton 
                size="small"
                onClick={onRemoveFromDaily}
                color="error"
                sx={{ p: 0.5 }}
              >
                <Today />
              </IconButton>
            )}
            {isCompleted && onComplete && (
              <IconButton size="small" onClick={onComplete} color="primary" sx={{ p: 0.5 }}>
                <Undo />
              </IconButton>
            )}
            {!isCompleted && onComplete && (
              <IconButton size="small" onClick={onComplete} sx={{ p: 0.5 }}>
                <Check />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </TaskCardContainer>
  )
}
