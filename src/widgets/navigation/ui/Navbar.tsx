// src/widgets/navigation/ui/Navbar.tsx
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { View } from '@/shared'
import { useNavbarMenu } from './useNavbarMenu'
import { NavbarMobileMenu } from './NavbarMobileMenu'
import { NavbarActions } from './NavbarActions'
import { NavContainer, MobileMenuButton } from './styles'

interface NavbarProps {
  currentView: View
  onViewChange: (view: View) => void
}

export const Navbar = ({ currentView, onViewChange }: NavbarProps) => {
  const { mobileAnchorEl, isMenuOpen, handleOpenMobileMenu, handleCloseMobileMenu } = useNavbarMenu()

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AssignmentIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 4,
              display: 'flex',
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

          <MobileMenuButton
            color="inherit"
            onClick={handleOpenMobileMenu}
          >
            <MenuIcon />
          </MobileMenuButton>

          <NavbarMobileMenu
            anchorEl={mobileAnchorEl}
            isOpen={isMenuOpen}
            onClose={handleCloseMobileMenu}
            currentView={currentView}
            onViewChange={onViewChange}
          />

          {/* Space reserved for future auth controls */}
          <Box sx={{ flexGrow: 0 }} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
