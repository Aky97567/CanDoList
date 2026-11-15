// src/shared/ui/LoadingState.tsx
import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingState = () => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
    <CircularProgress />
    <Typography color="text.secondary">Loading tasks...</Typography>
  </Box>
);
