// src/styles.ts
import { styled } from "@mui/material/styles";
import { Container, ContainerProps } from "@mui/material";

interface AppContainerProps extends ContainerProps {
  component?: React.ElementType;
}

export const AppContainer = styled(Container)<AppContainerProps>(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",

  width: "100%",
  margin: "1.5rem 0 0 0",
}));
