// src/entities/task/ui/TaskForm.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import {
  getCategoryColor,
  getCategoryDisplayName,
  Task,
  TaskCategory,
  TaskPriority,
} from "../model";

type TaskFormData = Omit<
  Task,
  "id" | "isCompleted" | "addedToDaily" | "isDaily"
>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: TaskFormData) => void;
  initialData?: Task;
  mode?: "create" | "edit";
}

const priorityColors: Record<TaskPriority, string> = {
  regular: "#757575",
  high: "#f44336",
};

export const TaskForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
}: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    category: "personal",
    priority: "regular",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        priority: initialData.priority,
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(formData);
    if (mode === "create") {
      setFormData({ title: "", category: "personal", priority: "regular" });
    }
    onClose();
  };

  const categories: TaskCategory[] = ["work", "personal", "green", "chore"];
  const priorities: TaskPriority[] = ["regular", "high"];

  const handleCategoryChange = (category: TaskCategory) => {
    setFormData({ ...formData, category });
  };

  const handlePriorityChange = (
    _: React.MouseEvent<HTMLElement>,
    newPriority: TaskPriority | null
  ) => {
    if (newPriority !== null) {
      setFormData({ ...formData, priority: newPriority });
    }
  };

  // Function to capitalize first letter
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === "create" ? "New Task" : "Edit Task"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          sx={{ mb: 3 }}
        />

        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Category
          </FormLabel>
          <Grid container spacing={1}>
            {categories.map((category) => (
              <Grid item xs={6} key={category}>
                <Chip
                  label={capitalize(getCategoryDisplayName(category))}
                  onClick={() => handleCategoryChange(category)}
                  sx={{
                    backgroundColor:
                      formData.category === category
                        ? getCategoryColor(category)
                        : "transparent",
                    color:
                      formData.category === category ? "#fff" : "text.primary",
                    border: `1px solid ${getCategoryColor(category)}`,
                    fontWeight:
                      formData.category === category ? "bold" : "normal",
                    width: "100%",
                    height: 32,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </FormControl>

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Priority
          </FormLabel>
          <ToggleButtonGroup
            value={formData.priority}
            exclusive
            onChange={handlePriorityChange}
            aria-label="task priority"
            fullWidth
          >
            {priorities.map((priority) => (
              <ToggleButton
                key={priority}
                value={priority}
                aria-label={priority}
                sx={{
                  border: "none",
                  justifyContent: "center",
                  "&.Mui-selected": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Chip
                  label={capitalize(priority)}
                  sx={{
                    backgroundColor:
                      formData.priority === priority
                        ? priorityColors[priority]
                        : "transparent",
                    color:
                      formData.priority === priority ? "#fff" : "text.primary",
                    border: `1px solid ${priorityColors[priority]}`,
                    fontWeight:
                      formData.priority === priority ? "bold" : "normal",
                    width: "100%",
                  }}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title.trim()}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
