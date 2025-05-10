// src/widgets/navigation/ui/NavbarActions.tsx
import { View } from '@/shared';
import { NavButton } from './styles';
import { ElementType } from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';

interface NavbarActionsProps {
  currentView: View;
  onViewChange: (view: View) => void;
  component?: ElementType;
  sx?: Record<string, unknown>;
}

export const NavbarActions = ({
  currentView,
  onViewChange,
  component: Component = NavButton,
  sx = {},
}: NavbarActionsProps) => {
  return (
    <>
      <Component
        onClick={() => onViewChange('daily-plan')}
        className={currentView === 'daily-plan' ? 'active' : ''}
        sx={sx}
      >
        Today
      </Component>
      <Component
        onClick={() => onViewChange('all-tasks')}
        className={currentView === 'all-tasks' ? 'active' : ''}
        sx={sx}
      >
        All Tasks
      </Component>
      <Component
        onClick={() => onViewChange('completed')}
        className={currentView === 'completed' ? 'active' : ''}
        sx={sx}
      >
        Completed
      </Component>
      <Component
        onClick={() => onViewChange('timeline')}
        className={currentView === 'timeline' ? 'active' : ''}
        sx={sx}
      >
        <TimelineIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        Timeline
      </Component>
    </>
  );
};
