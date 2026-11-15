// src/widgets/navigation/ui/NavbarMobileMenu.tsx
import { Menu, MenuItem } from '@mui/material'
import { View } from '@/shared'
import { NavbarActions } from './NavbarActions'

interface NavbarMobileMenuProps {
  anchorEl: HTMLElement | null
  isOpen: boolean
  onClose: () => void
  currentView: View
  onViewChange: (view: View) => void
}

export const NavbarMobileMenu = ({
  anchorEl,
  isOpen,
  onClose,
  currentView,
  onViewChange
}: NavbarMobileMenuProps) => {
  const handleViewChange = (view: View) => {
    onViewChange(view)
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isOpen}
      onClose={onClose}
    >
      <NavbarActions
        currentView={currentView}
        onViewChange={handleViewChange}
        component={MenuItem}
        sx={{ width: '100%', minWidth: '200px' }}
      />
    </Menu>
  )
}
