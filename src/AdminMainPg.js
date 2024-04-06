import React from "react";
import "./AdminMainPg.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; //remember to 'npm install framer-motion'
import "./AdminMainPg.css";
import AddLibrarian from "./AddLibrarian";
import MenuBar from "./MenuBar";

import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditIcon from "@mui/icons-material/Edit";
import { Buffer } from "buffer";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Avatar from "@mui/material/Avatar";
import useLoggedInUser from "./checkLoggedIn";
import {
  useSignIn,
  useAuthUser,
  useAuthHeader,
  useIsAuthenticated,
  useSignOut,
} from "react-auth-kit";

import {
  Tab,
  Tabs,
  TabContainer,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios"; // Import Axios for API requests
import { Alert } from "@mui/material";

function AdminMainPg() {
  const [currentTab, setCurrentTab] = useState(1);

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [addLibrarian, setAddLibrarian] = useState(false);
  const [editLibrarian, setEditLibrarian] = useState(false);
  const authUser = useAuthUser();
  const authHeader = useAuthHeader();
  const userEmail = authUser().name;
  const token = authHeader().token;
  const token2 = authUser().token;
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  // const [showWarning, setShowWarning] = useState(false);
  // const user = useLoggedInUser();

  const handleAddClick = () => {
    setAddLibrarian(true);
  };
  const handleClose = () => {
    setAddLibrarian(false);
  };
  // const hideWarning = () =>
  //     setShowWarning(false);
  const handleEditClick = (x) => {
    const ross = data.find((row) => row.id === x);

    setSelectedRow(ross);
    setEditLibrarian(true);
  };
  const handleDeleteClick = async (id) => {
    console.log(id);
    if (
      window.confirm(`Are you sure you want to delete this user with ID ${id}?`)
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/user/${id}`
        );

        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
      }
    }
  };
  const deleteRows = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    try {
      const id = selectedRows.map((row) => row.id).join(",");
      if (
        window.confirm(
          `Are you sure you want to delete selected users with ID ${id}?`
        )
      ) {
        const response = await axios.delete(
          `http://localhost:5000/api/user/rows/${id}`
        );
        alert("Users deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting users:", error);
      alert(error.message);
    }

    setSelectedRows([]);
  };

  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/(" + currentTab + ")"
      );
      setData(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentTab, addLibrarian, editLibrarian]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {currentTab === 4
              ? "Student"
              : currentTab === 3
              ? "Lecturer"
              : currentTab === 2
              ? "Librarian"
              : "Librarians"}
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={deleteRows}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton onClick={handleAddClick}>
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }
  const handleSignOut = () => {
    signOut();
    // Redirect or perform other actions after sign-out
  };

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <MenuBar></MenuBar>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "60px",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Librarian"
            onClick={() => setCurrentTab(2)}
            value={1}
            selected={currentTab === 1}
          />
          <Tab
            label="Student"
            onClick={() => setCurrentTab(4)}
            value={2}
            selected={currentTab === 4}
          />
          <Tab
            label="Lecturer"
            onClick={() => setCurrentTab(3)}
            value={3}
            selected={currentTab === 3}
          />
        </Tabs>
      </div>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selectedRows?.length} />
        <TableContainer>
          <DataGrid
            rows={data}
            checkboxSelection
            disableRowSelectionOnClick
            headerClassName="header-center"
            disableSelectionOnClick
            // onRowClick={(row) => {
            //   console.log("haha");
            // }}
            onRowSelectionModelChange={(ids) => {
              setSelectedRows(
                ids.map((id) => data.find((row) => row.id === id))
              );
            }}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            pagination
            autoHeight
            slots={{
              toolbar: GridToolbar,
            }}
            {...data}
            columns={[
              {
                field: "id",
                headerName: "ID",
                width: 100,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "image_file",
                headerName: "Image",
                width: 150,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                  // Convert the Buffer array to a base64 string
                  const base64String = Buffer.from(params.value).toString(
                    "base64"
                  );

                  // Use the base64 string as the src attribute for the img tag
                  return (
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        margin: "auto", // Center the avatar within the cell
                      }}
                      src={`data:image/png;base64,${base64String}`}
                      alt="Image"
                    />
                  );
                },
              },
              {
                field: "name",
                headerName: "Name",
                headerAlign: "center",
                width: 150,
                align: "center",
                flex: 1,
              },
              {
                field: "email",
                headerName: "Email",
                headerAlign: "center",
                width: 200,
                align: "center",
                flex: 1,
              },
              {
                field: "join_date",
                headerName: "Join Date",
                headerAlign: "center",
                width: 150,
                align: "center",
                flex: 1,
              },
              {
                field: "birth_date",
                headerName: "Birth Date",
                headerAlign: "center",
                width: 150,
                align: "center",
                flex: 1,
              },
              {
                field: "actions",
                headerName: "Actions",
                headerAlign: "center",
                width: 100,
                align: "center",
                renderCell: (params) => (
                  <>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditClick(params.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteClick(params.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                ),
                disableSelectionOnClick: false, // Enable selection for this column
              },
              // Columns definition
            ]}
          />
        </TableContainer>
      </Paper>

      {addLibrarian && (
        <AddLibrarian
          open={addLibrarian}
          onClose={() => setAddLibrarian(false)}
          edit={false}
        />
      )}
      {editLibrarian && (
        <AddLibrarian
          open={editLibrarian}
          onClose={() => setEditLibrarian(false)}
          edit={true}
          selectedRowData={selectedRow}
        />
      )}
    </Box>
  );
}

export default AdminMainPg;
// export default WithNavigate;
