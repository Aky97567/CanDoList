// styles.tsx
import { styled } from "@mui/material/styles";
import { Container, ContainerProps } from "@mui/material";

interface AppContainerProps extends ContainerProps {
  component?: React.ElementType;
}

export const AppContainer = styled(Container)<AppContainerProps>(
  ({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(4, 0),
    width: "100%",
    maxWidth: "300px",
    margin: "0 .625rem",

    [theme.breakpoints.up("sm")]: {
      maxWidth: "400px",
    },
  })
);
