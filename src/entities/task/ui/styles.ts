// src/entities/task/ui/styles.ts
import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

interface TaskCardContainerProps {
  completed?: boolean
}

export const TaskCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<TaskCardContainerProps>(({ theme, completed }) => ({
  marginBottom: theme.spacing(2),
  opacity: completed ? 0.7 : 1,
  backgroundColor: completed ? theme.palette.grey[100] : theme.palette.background.paper,
  transition: theme.transitions.create(['opacity', 'background-color']),
}))
