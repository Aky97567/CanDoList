// src/features/tasks/ui/DraggableTaskList.tsx
import { useMemo } from 'react';
import { TaskCard } from '@/entities';
import { Task } from '@/entities';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { Box } from '@mui/material';

interface SortableTaskCardProps {
  task: Task;
  onComplete?: () => void;
  onTogglePriority?: () => void;
  onRemoveFromDaily?: () => void;
}

const SortableTaskCard = ({ task, ...props }: SortableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <Box {...attributes} {...listeners} sx={{ 
        cursor: 'grab',
        '& .MuiButtonBase-root': {
          cursor: 'pointer',
          pointerEvents: 'auto',
        }
      }}>
        <TaskCard task={task} {...props} />
      </Box>
    </div>
  );
};

interface DraggableTaskListProps {
  tasks: Task[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onComplete: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
  onRemoveFromDaily: (taskId: string) => void;
}

export const DraggableTaskList = ({
  tasks,
  onReorder,
  onComplete,
  onTogglePriority,
  onRemoveFromDaily,
}: DraggableTaskListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableTaskCard
            key={task.id}
            task={task}
            onComplete={() => onComplete(task.id)}
            onTogglePriority={() => onTogglePriority(task.id)}
            onRemoveFromDaily={() => onRemoveFromDaily(task.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
