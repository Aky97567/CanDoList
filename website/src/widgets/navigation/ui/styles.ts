// src/widgets/navigation/ui/styles.ts
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

export const NavContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  marginRight: theme.spacing(2),
  "&.active": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
}));

export const MobileMenuButton = styled(Button)(({ theme }) => ({
  display: "none",
  marginLeft: "auto", // Push to the right
  [theme.breakpoints.down("md")]: {
    display: "flex",
  },
}));
