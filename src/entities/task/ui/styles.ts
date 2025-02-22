// src/entities/task/ui/styles.ts
import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
import { TaskCategory } from "../model";

interface TaskCardContainerProps {
  completed?: boolean;
  category: TaskCategory;
  categoryColor: string;
}

const OPTION: number = 1;

export const TaskCardContainer = styled(Card, {
  shouldForwardProp: (prop) =>
    !["completed", "category", "categoryColor"].includes(prop),
})<TaskCardContainerProps>(({ theme, completed, categoryColor }) => ({
  marginBottom: theme.spacing(1),
  opacity: completed ? 0.7 : 1,
  backgroundColor: completed
    ? theme.palette.grey[100]
    : theme.palette.background.paper,
  transition: theme.transitions.create(["opacity", "background-color"]),
  borderLeft: OPTION === 1 ? `6px solid ${categoryColor}` : "",
  ...(OPTION !== 1 ? { border: `3px solid ${categoryColor}` } : {}),
  [theme.breakpoints.up("md")]: {
    minWidth: "300px",
  },
  width: "100%",
}));
