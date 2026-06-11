// src/features/tasks/ui/CompletedTasksView.tsx
import { useState } from 'react';
import { Task, TaskCategory, TaskForm } from '@/entities';
import { useTasksState } from '../model';
import { TasksGridView } from './TasksGridView';
import { Box } from '@mui/material';

interface CompletedTasksViewProps {
  hideWorkTasks?: boolean;
}

export const CompletedTasksView = ({
  hideWorkTasks = false,
}: CompletedTasksViewProps) => {
  const { deleteTask, tasks, toggleTaskCompletion, updateTask, unskipHabit } =
    useTasksState();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const categories: TaskCategory[] = ['work', 'personal', 'green', 'chore'];

  const handleEditTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const taskFilter = (task: Task) => {
    if (hideWorkTasks && task.category === 'work') return false;
    return task.isCompleted;
  };

  return (
    <Box
      id="completed-tasks-view"
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        pb: 8,
        width: 'calc(100svw - 28px)',
        marginInline: 'auto',
      }}
    >
      <TasksGridView
        title="Completed Tasks"
        categories={categories}
        tasks={tasks}
        taskFilter={taskFilter}
        onComplete={toggleTaskCompletion}
        onDelete={deleteTask}
        onEdit={setEditingTask}
        onUnskip={unskipHabit}
        emptyStateMessage="No completed tasks yet"
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
