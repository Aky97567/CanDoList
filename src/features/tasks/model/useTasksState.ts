// src/features/tasks/model/useTasksState.ts
import { useState } from 'react'
import { Task } from '@/entities/task'

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    category: 'work',
    priority: 'high',
    isCompleted: false,
    addedToDaily: true
  },
  {
    id: '2',
    title: 'Buy groceries',
    category: 'personal',
    priority: 'regular',
    isCompleted: false,
    isDaily: true
  },
  {
    id: '3',
    title: 'Clean the house',
    category: 'chore',
    priority: 'regular',
    isCompleted: false
  }
]

export const useTasksState = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const createTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
      addedToDaily: taskData.isDaily || false
    }
    setTasks([...tasks, newTask])
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ))
  }

  const toggleTaskPriority = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, priority: task.priority === 'high' ? 'regular' : 'high' }
        : task
    ))
  }

  const toggleDailyTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, addedToDaily: !task.addedToDaily }
        : task
    ))
  }

  return {
    tasks,
    createTask,
    toggleTaskCompletion,
    toggleTaskPriority,
    toggleDailyTask
  }
}
