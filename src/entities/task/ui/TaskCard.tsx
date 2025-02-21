// src/entities/task/ui/TaskCard.tsx
import { CardContent, Typography, CardActions, IconButton, Chip, Box } from '@mui/material'
import { Check, Star, StarBorder, Today, RemoveCircle } from '@mui/icons-material'
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
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={category} 
            size="small" 
            color={getCategoryColor(category)}
          />
          {showDailyIndicator && addedToDaily && (
            <Chip
              icon={<Today fontSize="small" />}
              label="Daily"
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        {onTogglePriority && (
          <IconButton onClick={onTogglePriority}>
            {priority === 'high' ? <Star color="warning" /> : <StarBorder />}
          </IconButton>
        )}
        {onToggleDaily && !task.isDaily && category !== 'chore' && (
          <IconButton 
            onClick={onToggleDaily}
            color={addedToDaily ? "info" : "default"}
          >
            <Today />
          </IconButton>
        )}
        {showRemoveFromDaily && onRemoveFromDaily && (
          <IconButton 
            onClick={onRemoveFromDaily}
            color="error"
          >
            <RemoveCircle />
          </IconButton>
        )}
        {onComplete && !isCompleted && (
          <IconButton onClick={onComplete}>
            <Check />
          </IconButton>
        )}
      </CardActions>
    </TaskCardContainer>
  )
}
