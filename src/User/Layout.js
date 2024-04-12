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
import Logo from "../UOSMLogo3.png";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';



const Layout = ({ children, showSearchBar, toggleDrawer, open }) => {
    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logged out");
    };
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
                {["Home", "Book Database", "Request", "My Library","Logout"].map(
                    (text, index) => (
                        <ListItem key={text} disablePadding>
                            <Link
                                to={
                                    text === "Book Database"
                                        ? "/BookList"
                                        : text === "My Library"
                                            ? "/UserMyLibrary"
                                            : text === "Request"
                                                ? "/UserBookRequest"
                                                : "/UserMainPage"

                                }
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "block",
                                }}
                            >
                                <ListItemButton component="div" sx={{ width: 250 }}>
                                    <ListItemIcon sx={{ color: "white" }}>
                                        {index % 5 === 0 ? <HomeIcon /> : index % 5 === 1 ? <BookIcon /> : index % 5 === 2 ? <LibraryBooksIcon /> : index % 5 === 3 ? <HistoryIcon /> : <ExitToAppIcon onClick={handleLogout} />}
                                    </ListItemIcon>

                                    <ListItemText primary={text} sx={{ color: "white" }} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    )
                )}
            </List>

            {/* Footer */}
            <Box sx={{paddingTop: 2, justifyContent:'center',textAlign: 'center', color: 'white', position: 'absolute', bottom: 20, left: 0, width: '100%',display:'flex',flexDirection:'row'}}>
                <Box sx={{alignItems:'center',textAlign:'center',display:'flex'}}>
                    <AccountCircleIcon sx={{ color: "white" }} fontSize="large" />
                    <label style={{marginLeft:'10px',fontSize:'16px'}}>
                        Ke Xin
                    </label>
                </Box>
            </Box>

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
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{fontWeight: "bold",width:'30%'}}
                        >
                            UOSM Libraries

                        </Typography>

                        {showSearchBar && (
                            <Box sx={{
                                display: "flex",
                                alignItems: "center", // Center the search bar vertically
                                flex: "1", // Allow the search bar to grow and take remaining space
                                // marginLeft: "auto", // Push the search bar to the right
                                // marginRight: "10px", // Add some margin to the right
                            }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        // justifyContent: "center",
                                        alignItems: "center",
                                        height:'35px',
                                        width: "350px",
                                        borderRadius: "10px",
                                        backgroundColor: "lightgrey",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                                        // marginLeft: "auto",
                                    }}
                                >
                                    <SearchIcon />
                                    <InputBase
                                        placeholder="Find Your Books…"
                                        inputProps={{"aria-label": "search"}}
                                        sx={{
                                            ml: 1,
                                            borderRadius: "20px",
                                            color: "dark grey",
                                            fontSize: "14px",
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}
                        <img
                            src={Logo}
                            alt={"Logo"}
                            // className={"UOSM-Logo"}
                            style={{
                                width: "200px",
                                height: "65px",
                                marginLeft: 'auto',
                                marginBottom: "10px",
                                filter: "brightness(0) invert(1) contrast(5)",
                            }}
                        />
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
