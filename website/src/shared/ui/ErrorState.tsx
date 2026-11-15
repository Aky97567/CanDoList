// src/shared/ui/ErrorState.tsx
import { Box, Typography, Button } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";

interface ErrorStateProps {
  onRetry?: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
    <ErrorIcon color="error" sx={{ fontSize: 48 }} />
    <Typography color="error">Failed to load tasks</Typography>
    {onRetry && (
      <Button variant="outlined" color="primary" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </Box>
);
