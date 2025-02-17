// src/entities/task/ui/TaskForm.tsx
import { useState } from 'react'
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Task, TaskCategory, TaskPriority } from '../model'

type TaskFormData = Omit<Task, 'id' | 'isCompleted'>

interface TaskFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (task: TaskFormData) => void
}

export const TaskForm = ({ open, onClose, onSubmit }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    category: 'personal',
    priority: 'regular'
  })

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData({ title: '', category: 'personal', priority: 'regular' })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            label="Category"
            onChange={(e) => setFormData({ 
              ...formData, 
              category: e.target.value as TaskCategory 
            })}
          >
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="chore">Chore</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={formData.priority}
            label="Priority"
            onChange={(e) => setFormData({ 
              ...formData, 
              priority: e.target.value as TaskPriority 
            })}
          >
            <MenuItem value="regular">Regular</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!formData.title.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
