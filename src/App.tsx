// src/App.tsx
import { useState } from "react"
import { Container } from "@mui/material"
import { Navbar } from "@/widgets"
import { View } from "@/shared"
import { AllTasksView, CompletedTasksView, DailyPlanView } from "@/features"

function App() {
  const [currentView, setCurrentView] = useState<View>("all-tasks")

  return (
    <>
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <Container component="main" sx={{ mt: 4 }}>
        {currentView === "all-tasks" && <AllTasksView />}
        {currentView === "daily-plan" && <DailyPlanView />}
        {currentView === "completed" && <CompletedTasksView />}
      </Container>
    </>
  )
}

export default App
