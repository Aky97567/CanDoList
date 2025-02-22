// src/entities/task/ui/TaskForm.tsx
import { useState, useEffect } from 'react'
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

type TaskFormData = Omit<Task, 'id' | 'isCompleted' | 'addedToDaily' | 'isDaily'>

interface TaskFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (task: TaskFormData) => void
  initialData?: Task
  mode?: 'create' | 'edit'
}

export const TaskForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create' 
}: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    category: 'personal',
    priority: 'regular'
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        priority: initialData.priority
      })
    }
  }, [initialData])

  const handleSubmit = () => {
    onSubmit(formData)
    if (mode === 'create') {
      setFormData({ title: '', category: 'personal', priority: 'regular' })
    }
    onClose()
  }

  const categories: TaskCategory[] = ['work', 'personal', 'green', 'chore']

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === 'create' ? 'New Task' : 'Edit Task'}</DialogTitle>
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
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
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
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
