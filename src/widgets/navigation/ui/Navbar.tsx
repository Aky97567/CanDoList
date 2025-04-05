// src/widgets/navigation/ui/Navbar.tsx
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WeekendIcon from "@mui/icons-material/Weekend";
import { View } from "@/shared";
import { useNavbarMenu } from "./useNavbarMenu";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { NavbarActions } from "./NavbarActions";
import { NavContainer, MobileMenuButton } from "./styles";

interface NavbarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  hideWorkTasks: boolean;
  onToggleWorkTasks: () => void;
}

export const Navbar = ({
  currentView,
  onViewChange,
  hideWorkTasks,
  onToggleWorkTasks,
}: NavbarProps) => {
  const {
    mobileAnchorEl,
    isMenuOpen,
    handleOpenMobileMenu,
    handleCloseMobileMenu,
  } = useNavbarMenu();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100vw",
        left: 0,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <AssignmentIcon sx={{ display: "flex", mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mr: 4,
            display: "flex",
            fontWeight: 700,
          }}
        >
          CanDoList
        </Typography>

        <NavContainer>
          <NavbarActions
            currentView={currentView}
            onViewChange={onViewChange}
          />
        </NavContainer>

        <FormControlLabel
          control={
            <Switch
              checked={hideWorkTasks}
              onChange={onToggleWorkTasks}
              color="default"
              size="small"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <WeekendIcon fontSize="small" sx={{ mr: 0.5 }} />
            </Box>
          }
          sx={{
            mr: 2,
            ml: "auto",
            color: "white",
          }}
        />

        <MobileMenuButton color="inherit" onClick={handleOpenMobileMenu}>
          <MenuIcon />
        </MobileMenuButton>

        <NavbarMobileMenu
          anchorEl={mobileAnchorEl}
          isOpen={isMenuOpen}
          onClose={handleCloseMobileMenu}
          currentView={currentView}
          onViewChange={onViewChange}
        />

        <Box sx={{ flexGrow: 0 }} />
      </Toolbar>
    </AppBar>
  );
};
