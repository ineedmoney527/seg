import "./RequestBook.css";
import React, { useState, useEffect } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import {
  Box,
  Button,
  Stack,
  TextField,
  IconButton,
  styled,
  Collapse,
} from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
// import { DataGrid } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Logo from "../UOSMLogo3.png";

function Request() {
  function customCheckbox(theme) {
    return {
      "& .MuiCheckbox-root svg": {
        width: 16,
        height: 16,
        backgroundColor: "transparent",
        border: `1px solid ${
          theme.palette.mode === "light" ? "#d9d9d9" : "rgb(67, 67, 67)"
        }`,
        borderRadius: 2,
      },
      "& .MuiCheckbox-root svg path": {
        display: "none",
      },
      "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
        backgroundColor: "#1890ff",
        borderColor: "#1890ff",
      },
      "& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
        position: "absolute",
        display: "table",
        border: "2px solid #fff",
        borderTop: 0,
        borderLeft: 0,
        transform: "rotate(45deg) translate(-50%,-50%)",
        opacity: 1,
        transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
        content: '""',
        top: "50%",
        left: "39%",
        width: 5.71428571,
        height: 9.14285714,
      },
      "& .MuiCheckbox-indeterminate .MuiIconButton-label:after": {
        width: 8,
        height: 8,
        backgroundColor: "#1890ff",
        transform: "none",
        top: "39%",
        border: 0,
      },
    };
  }

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.85)"
        : "rgba(255,255,255,0.85)",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    WebkitFontSmoothing: "auto",
    letterSpacing: "normal",
    "& .MuiDataGrid-root": {
      borderRadius: 20, // Set the border radius here (adjust the value as needed)
      overflow: "hidden", // Optional: Hide overflow content if needed
    },
    "& .MuiDataGrid-columnsContainer .MuiDataGrid-iconSeparator": {
      color: "#fff", // Set your desired color here
    },
    "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
      borderBottom: `1px solid ${
        theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
      }`,
    },
    "& .MuiDataGrid-cell": {
      color:
        theme.palette.mode === "light"
          ? "rgba(0,0,0,.85)"
          : "rgba(255,255,255,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center", // Align text center
      padding: theme.spacing(1),
    },
    "& .MuiPaginationItem-root": {
      borderRadius: 0,
    },
    "& .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitle": {
      backgroundColor: "#282c34", // Change header background color here
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center", // Align text center
      padding: theme.spacing(1),
      color: "#fff",
    },
    "& .MuiDataGrid-sortIcon, .MuiDataGrid-menuIconButton": {
      color: "#fff",
    },
    ...customCheckbox(theme),
  }));

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("requesting"); // Default selected option
  const [activeButton, setActiveButton] = useState("requesting");
  const { register, handleSubmit } = useForm();
  const [showStatus, setShowStatus] = useState(selectedOption === "requesting");
  const [approveAlert, setApproveAlert] = useState(false);
  const [rejectAlert, setRejectAlert] = useState(false);
  const [selectAlert, setSelectAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/request/pending"
      );
      console.log(response);
      const formattedData = response?.data?.map((item) => ({
        ...item,
        request_date: item.request_date.toString().split("T")[0],
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRowClicked = (row) => {
    setSelectedRows([row, ...selectedRows]);
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const onSubmit = (data) => {
    console.log(data); // You can handle the search query here
  };

  const buttonStyle = {
    bgcolor: "#242732",
    color: "#fff",
    "&:hover": {
      bgcolor: "#32496B", // Adjust hover background color
      opacity: 5, // Adjust hover opacity as needed
    },
  };

  const subButtonStyle = {
    bgcolor: "#fff",
    color: "#183764",
    "&:hover": {
      bgcolor: "#32496B", // Adjust hover background color
      color: "#fff", // Adjust hover text color
    },
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setActiveButton(option); // Update activeButton state

    // Show/hide additional buttons based on the selected option
    setShowStatus(option === "requesting");
  };

  const handleAlertWithTimeout = (alertState, setAlertState, message) => {
    setAlertMessage(message); // Set the alert message
    setAlertState({ ...alertState, open: true });
    setTimeout(() => {
      setAlertMessage(""); // Set the alert message
      setAlertState({ ...alertState, open: false });
    }, 5000); // Adjust the time (in milliseconds) as needed
  };

  const handleApproveClick = async () => {
    if (selectedRows.length > 0) {
      const ids = selectedRows.map((row) => row.id).join(", ");
      const titles = selectedRows.map((row) => row.title).join(", "); // Extract titles
      const studentIds = selectedRows.map((row) => row.user_id).join(", "); // Extract student IDs

      console.log(ids);
      console.log(titles);
      console.log(studentIds);
      try {
        const confirmed = window.confirm(
          `Are you sure you want to approve the request ${ids}?`
        );
        if (confirmed) {
          setSelectAlert({ open: false, message: "" });

          // Approve the request and update the status
          const response = await axios.put(
            `http://localhost:5000/api/request/${ids}`,
            { type: "Approve", title: titles, student_id: studentIds }
          );
          console.log(response.data);
          handleAlertWithTimeout(
            approveAlert,
            setApproveAlert,
            "The request is approved."
          );
          fetchRequests(); // Fetch updated requests list
        }
      } catch (error) {
        console.error("Error managing reservation requests:", error);
        alert(error.message);
      }
    } else {
      setApproveAlert({ open: false, message: "" });
      setSelectAlert({ open: true });
      handleAlertWithTimeout(
        selectAlert,
        setSelectAlert,
        "Please select a row before proceeding with any action."
      );
    }
  };

  const handleRejectClick = async () => {
    if (selectedRows.length > 0) {
      const ids = selectedRows.map((row) => row.id).join(", ");
      const titles = selectedRows.map((row) => row.title).join(", "); // Extract titles
      const studentIds = selectedRows.map((row) => row.user_id).join(", "); // Extract student IDs
      try {
        const confirmed = window.confirm(
          `Are you sure you want to reject the request  ${ids}?`
        );
        if (confirmed) {
          setSelectAlert({ open: false, message: "" });
          setRejectAlert({ open: true });
          const response = await axios.put(
            `http://localhost:5000/api/request/${ids}`,
            { type: "Reject", title: titles, student_id: studentIds }
          );
          handleAlertWithTimeout(
            rejectAlert,
            setRejectAlert,
            "The request is rejected."
          );
          fetchRequests();
        }
      } catch (e) {
        console.error("Error managing reservation requests:", e);
        alert(e.message);
      }
    } else {
      setRejectAlert({ open: false, message: "" });
      setSelectAlert({ open: true });
      handleAlertWithTimeout(
        selectAlert,
        setSelectAlert,
        "Please select a row before proceeding with any action."
      );
    }
  };

  const renderButtons = () => {
    return (
      <Stack direction="row" spacing={2}>
        {showStatus && (
          <>
            <Button onClick={handleApproveClick} sx={subButtonStyle}>
              Approve
            </Button>
            <Button onClick={handleRejectClick} sx={subButtonStyle}>
              Reject
            </Button>
          </>
        )}
      </Stack>
    );
  };
  const fetchHistory = async () => {
    const options = { timeZone: "Asia/Shanghai" }; // UTC+8 timezone
    try {
      const response = await axios.get(
        "http://localhost:5000/api/request/history"
      );
      console.log(response);
      const formattedData = response?.data?.map((item) => ({
        ...item,
        request_date: item.request_date.toString().split("T")[0],
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const columns = [
    {
      field: "id",
      headerName: "Student ID",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },

    {
      field: "title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },
    {
      field: "author",
      headerName: "Author",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },
    {
      field: "edition",
      headerName: "Edition",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },
    {
      field: "publisher",
      headerName: "Publisher",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },

    {
      field: "request_date",
      headerName: "Request Date",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      filterable: true,
    },
  ];
  useEffect(() => {
    // Fetch data based on selected option
    selectedOption === "requesting" ? fetchRequests() : fetchHistory();
  }, [selectedOption]); // O
  const renderTable = () => {
    return (
      <div style={{ height: "73vh", width: "100%" }}>
        <StyledDataGrid
          rows={data}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={(row) => handleRowClicked(row.row)}
          onRowSelectionModelChange={(ids) => {
            setRowSelectionModel(ids);
            setSelectedRows(ids.map((id) => data.find((row) => row.id === id)));
          }}
          slots={{ toolbar: GridToolbar }}
          rowSelectionModel={rowSelectionModel}
        />
      </div>
    );
  };

  return (
    <Stack
      direction="column"
      spacing={0}
      className={"RequestPageContainer"}
      sx={{ height: "100vh", width: "100vw", overflow: "auto" }} // Set full height and width
    >
      <Stack direction="row" spacing={3} className={"haederRequest"}>
        <TemporaryDrawer open={drawerOpen} onClose={toggleDrawer} />
        <h1 className={"headerTitle-Request"}>Request / Acquisition Book</h1>
        <img
          src={Logo}
          alt={"Logo"}
          className={"UOSM-Logo"}
          style={{
            width: "200px",
            height: "55px",
            marginLeft: "auto",
            filter: "brightness(0) invert(1) contrast(5)",
          }}
        />
      </Stack>

      <Stack
        direction="column"
        className={"MainContent-Request"}
        sx={{ height: "90vh", width: "97vw", overflow: "auto" }} // Set full height and width
      >
        {/*<Box sx={{width: "300px"}}>*/}
        {/*  <form*/}
        {/*      onSubmit={handleSubmit(onSubmit)}*/}
        {/*      className="form-containerRequest"*/}
        {/*  >*/}
        {/*    <TextField*/}
        {/*      {...register("searchQuery")}*/}
        {/*      label="Search keywords"*/}
        {/*      variant="outlined"*/}
        {/*      size="small"*/}
        {/*      fullWidth*/}
        {/*      margin="normal"*/}
        {/*      InputProps={{*/}
        {/*        endAdornment: (*/}
        {/*          <IconButton type="submit" size="small">*/}
        {/*            <SearchIcon />*/}
        {/*          </IconButton>*/}
        {/*        ),*/}
        {/*      }}*/}
        {/*      className="form-inputRequest"*/}
        {/*    />*/}
        {/*  </form>*/}
        {/*</Box>*/}
        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Stack direction="row" spacing={0.3}>
            <Button
              onClick={() => handleOptionClick("requesting")}
              s
              sx={activeButton === "requesting" ? buttonStyle : {}}
            >
              Requesting
            </Button>
            <Button
              onClick={() => handleOptionClick("history")}
              sx={activeButton === "history" ? buttonStyle : {}}
            >
              History
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            {renderButtons()}
          </Stack>
        </Stack>

        <div className={"tableContainer-Request"}>
          <Stack sx={{ width: "100%" }} className={"alertBox-request"}>
            <Collapse in={approveAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() =>
                  setApproveAlert({ ...approveAlert, open: false })
                }
                sx={{ borderRadius: 2 }}
              >
                The request is approved.
              </Alert>
            </Collapse>
            <Collapse in={rejectAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() => setRejectAlert({ ...rejectAlert, open: false })}
                sx={{ borderRadius: 2 }}
              >
                The request is rejected.
              </Alert>
            </Collapse>
            <Collapse in={selectAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="warning"
                onClose={() => setSelectAlert({ ...rejectAlert, open: false })}
                sx={{ borderRadius: 2 }}
              >
                Please select a row before proceeding.
              </Alert>
            </Collapse>
          </Stack>
          {renderTable()}
        </div>
      </Stack>
    </Stack>
  );
}

export default Request;
