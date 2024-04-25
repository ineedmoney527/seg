import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { RiMailAddFill } from 'react-icons/ri';
// import { FiLogOut } from "react-icons/fi";
import "./LoanBook.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Logo from "../UOSMLogo3.png";
import {
  useSignIn,
  useAuthUser,
  useAuthHeader,
  useIsAuthenticated,
  useSignOut,
} from "react-auth-kit";

function TemporaryDrawer() {
  const [open, setOpen] = useState(false);
  const userName = "John Doe"; // Example username
  const navigate = useNavigate();
  const signOut = useSignOut(); //
  const handleReservationClick = () => {
    navigate("/Reservation");
  };

  const handleLoanClick = () => {
    navigate("/LoanBook");
  };
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
      alert("signed out successfully");
      navigate("/");
    }
  };
  const handleIssuesClick = () => {
    navigate("/IssuesBook");
  };

  const handleRequestClick = () => {
    navigate("/RequestBook");
  };
  const handleDashboardClick = () => {
    navigate("/Dashboard");
  };
  const handleInventoryClick = () => {
    navigate("/WithNavigate");
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const DrawerContent = (
    <Box
      sx={{
        width: 250,
        display: "flex",
        flexDirection: "column",
        height: "98vh",
        backgroundImage:
          "linear-gradient(320deg, rgba(40,52,70,1) 36%,\n" +
          "    rgba(50,73,107,1) 58%, rgba(69,124,204,1) 82%, rgba(180,205,253,1) 95%);",
        color: "#fff", // Set text color for sidebar items
      }}
    >
      <List>
        <ListItem>
          <img
            src={Logo}
            alt={"Logo"}
            className={"UOSM-Logo"}
            style={{
              width: "200px",
              height: "65px",
              marginBottom: "30px",
              filter: "brightness(0) invert(1) contrast(5)",
            }}
          />
        </ListItem>
        {[
          {
            text: "Dashboard",
            icon: <DashboardIcon />,
            button: true,
            onClick: handleDashboardClick,
          },
          {
            text: "Books Inventory",
            icon: <InventoryIcon />,
            button: true,
            onClick: handleInventoryClick,
          },
          {
            text: "Issue Books",
            icon: <LibraryBooksIcon />,
            button: true,
            onClick: handleIssuesClick,
          },
          {
            text: "Loan",
            icon: <MonetizationOnIcon />,
            button: true,
            onClick: handleLoanClick,
          },
          {
            text: "Reservation",
            icon: <EventAvailableIcon />,
            button: true,
            onClick: handleReservationClick,
          },
          {
            text: "Request",
            icon: <LibraryBooksIcon size={23} />,
            button: true,
            onClick: handleRequestClick,
          },
          {
            text: "Logout",
            icon: <ExitToAppIcon size={23} />,
            onClick: handleSignOut,
          },
        ].map((item, index) => (
          <ListItem button key={item.text} onClick={item.onClick}>
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginTop: "auto" }} />
      <List sx={{ flexGrow: 1 }} />
      <Divider />
      <ListItem
        disablePadding
        sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}
      >
        <ListItemIcon>
          <AccountCircleIcon sx={{ color: "white" }} fontSize="large" />
        </ListItemIcon>
        <ListItemText
          primary={userName}
          sx={{ color: "white" }}
          className={"usernameLoan"}
        />
      </ListItem>
    </Box>
  );

  return (
    <div>
      <IconButton
        color="#fff"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
      >
        <MenuIcon sx={{ color: "white", fontSize: 40 }} />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
          {DrawerContent}
        </div>
      </Drawer>
    </div>
  );
}
export default TemporaryDrawer;
