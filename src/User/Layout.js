import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Logo from "../UOSMLogo3.png";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Layout = ({ children, showSearchBar, toggleDrawer, open }) => {
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
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
        {["Home", "Book Database", "Request", "My Library"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <Link
                to={
                  text === "Book Database"
                    ? "/booklist"
                    : text === "My Library"
                    ? "/UserMyLibrary"
                    : text === "Request"
                    ? "/UserBookRequest"
                    : "/"
                }
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <ListItemButton component="div" sx={{ width: 250 }}>
                  <ListItemIcon sx={{ color: "white" }}>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ color: "white" }} />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            background: "linear-gradient(to right, #457CCC 0%, #051A39 100%)",
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              UOSM Libraries
            </Typography>
            {showSearchBar && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "250px",
                  borderRadius: "20px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginLeft: "auto",
                }}
              >
                <SearchIcon />
                <InputBase
                  placeholder="Find Your Books…"
                  inputProps={{ "aria-label": "search" }}
                  sx={{
                    ml: 1,
                    borderRadius: "20px",
                    color: "dark grey",
                    fontSize: "14px",
                  }}
                />
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(to bottom, #457CCC 0%, #051A39 100%)",
          },
        }}
      >
        {DrawerList}
      </Drawer>
      {children}
    </div>
  );
};

export default Layout;
