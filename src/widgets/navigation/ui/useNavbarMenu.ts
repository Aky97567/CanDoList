// src/widgets/navigation/ui/useNavbarMenu.ts
import { useState, MouseEvent } from 'react'

export const useNavbarMenu = () => {
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenMobileMenu = (event: MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget)
  }

  const handleCloseMobileMenu = () => {
    setMobileAnchorEl(null)
  }

  return {
    mobileAnchorEl,
    isMenuOpen: Boolean(mobileAnchorEl),
    handleOpenMobileMenu,
    handleCloseMobileMenu
  }
}
