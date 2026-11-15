// src/styles.ts
import { styled } from '@mui/material/styles';
import { Container, ContainerProps } from '@mui/material';

interface AppContainerProps extends ContainerProps {
  component?: React.ElementType;
}

export const AppContainer = styled(Container)<AppContainerProps>(() => ({
  display: 'block',
  width: '100svw',
  margin: '1.5rem 0 0 0',
  paddingInline: '0',
}));
