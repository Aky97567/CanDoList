// src/App.tsx
import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Navbar } from "@/widgets";
import { View } from "@/shared";
import { AllTasksView, CompletedTasksView, DailyPlanView } from "@/features";
import { StorageProvider } from "@/app/";
import { AppContainer } from "./styles";

function App() {
  const [currentView, setCurrentView] = useState<View>("daily-plan");

  return (
    <StorageProvider>
      <Box
        id="root-of-all-evil"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <Navbar currentView={currentView} onViewChange={setCurrentView} />
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <AppContainer component="main">
          {currentView === "all-tasks" && <AllTasksView />}
          {currentView === "daily-plan" && <DailyPlanView />}
          {currentView === "completed" && <CompletedTasksView />}
        </AppContainer>
      </Box>
    </StorageProvider>
  );
}

export default App;
