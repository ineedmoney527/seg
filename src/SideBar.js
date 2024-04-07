import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import {
  useSignIn,
  useAuthUser,
  useAuthHeader,
  useIsAuthenticated,
  useSignOut,
} from "react-auth-kit";
export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const authUser = useAuthUser();
  const signOut = useSignOut(); //
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleProfileClick = () => {
    navigate("/admin");
    setOpen(false);
  };

  const handleReserveClick = () => {
    navigate("/Reserve");
    setOpen(false);
  };
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
      alert("signed out successfully");
      navigate("/");
    }
  };
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <h2 style={{ textAlign: "center" }}>{authUser().name}</h2>
      <List>
        <ListItemButton onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <Divider />
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon sx={{ mr: 7, color: "white" }} />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
