// src/entities/task/ui/TaskCard.tsx
import { CardContent, Typography, CardActions, IconButton, Chip } from '@mui/material'
import { Check, Star, StarBorder } from '@mui/icons-material'
import { TaskCardContainer } from './styles'
import { Task, getCategoryColor } from '../model'

interface TaskCardProps {
  task: Task
  onComplete?: () => void
  onTogglePriority?: () => void
}

export const TaskCard = ({ task, onComplete, onTogglePriority }: TaskCardProps) => {
  const { title, category, priority, isCompleted } = task

  return (
    <TaskCardContainer completed={isCompleted}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Chip 
          label={category} 
          size="small" 
          color={getCategoryColor(category)}
          sx={{ mr: 1 }}
        />
      </CardContent>
      <CardActions disableSpacing>
        {onTogglePriority && (
          <IconButton onClick={onTogglePriority}>
            {priority === 'high' ? <Star color="warning" /> : <StarBorder />}
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
