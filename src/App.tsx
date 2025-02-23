// src/App.tsx
import { useState } from "react";
import { Container, Box, Toolbar } from "@mui/material";
import { Navbar } from "@/widgets";
import { View } from "@/shared";
import { AllTasksView, CompletedTasksView, DailyPlanView } from "@/features";
import { StorageProvider } from "@/app/";

function App() {
  const [currentView, setCurrentView] = useState<View>("all-tasks");

  return (
    <StorageProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar currentView={currentView} onViewChange={setCurrentView} />
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Container
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            py: 4,
          }}
        >
          {currentView === "all-tasks" && <AllTasksView />}
          {currentView === "daily-plan" && <DailyPlanView />}
          {currentView === "completed" && <CompletedTasksView />}
        </Container>
      </Box>
    </StorageProvider>
  );
}

export default App;
