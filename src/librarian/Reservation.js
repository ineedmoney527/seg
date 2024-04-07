import "./Reservation.css";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
function Reservation() {
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedOption, setSelectedOption] = useState("reserving"); // Default selected option
  const [activeButton, setActiveButton] = useState("reserving");
  const { register, handleSubmit } = useForm();
  const [showStatus, setShowStatus] = useState(selectedOption === "reserving");
  const [approveAlert, setApproveAlert] = useState(false);
  const [rejectAlert, setRejectAlert] = useState(false);
  const [selectAlert, setSelectAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [data, setData] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reserve/pending"
      );
      const formattedData = response?.data?.map((item) => ({
        ...item,
        requested_at: new Date(item.requested_at).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "UTC",
        }),
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchHistory = async () => {
    const options = { timeZone: "Asia/Shanghai" }; // UTC+8 timezone
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reserve/history"
      );
      const formattedData = response?.data?.map((item) => ({
        ...item,
        requested_at: new Date(item.requested_at).toLocaleString({
          ...options,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "UTC",
        }),
        start_datetime: new Date(item.start_datetime).toLocaleString({
          ...options,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "UTC",
        }),
        end_datetime: new Date(item.end_datetime).toLocaleString({
          ...options,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "UTC",
        }),
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#242732",
      color: theme.palette.common.white,
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
    },
  }));

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setActiveButton(option); // Update activeButton state

    // Show/hide additional buttons based on the selected option
    setShowStatus(option === "reserving");
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
      try {
        const confirmed = window.confirm(
          `Are you sure you want to approve the request ${ids}?`
        );
        if (confirmed) {
          setSelectAlert({ open: false, message: "" });
          setRejectAlert({ open: true });

          // // Get the email associated with the student_id
          // const emails = await Promise.all(
          //   selectedRows.map(async (row) => {
          //     const response = await axios.get(
          //       `http://localhost:5000/api/user/email/${row.user_id}`
          //     );
          //     return response.data.email;
          //   })
          // );
          console.log("TESTING");
          console.log(selectedRows);
          console.log(selectedRows[0].user_id);

          // Approve the request and update the status for each selected row
          const approvalRequests = selectedRows.map(async (row) => {
            try {
              const response = await axios.put(
                `http://localhost:5000/api/reserve/${row.id}`,
                {
                  type: "Approve",
                  student_id: row.user_id,
                  book_code: row.book_code,
                  reserve_id: row.id,
                }
              );
              return response.data; // Return response data for each row
            } catch (error) {
              console.error("Error approving request:", error);
              throw error;
            }
          });

          // Wait for all approval requests to finish
          await Promise.all(approvalRequests);

          // Update the status of the selected books to "Reserved"
          const bookCodes = selectedRows.map((row) => row.book_code).join(", ");
          await axios.put("http://localhost:5000/api/book/status", {
            bookCodes,
            status: "Reserved",
          });

          // // Approve the request and update the status
          // const response = await axios.put(
          //   `http://localhost:5000/api/reserve/${ids}`,
          //   { type: "Approve", student_id: selectedRows[0].user_id }
          // );

          // // Update the status of the selected books to "Reserved"
          // const bookCodes = selectedRows.map((row) => row.book_code).join(", ");
          // const updateResponse = await axios.put(
          //   "http://localhost:5000/api/book/status",
          //   { bookCodes, status: "Reserved" }
          // );

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
      try {
        const confirmed = window.confirm(
          `Are you sure you want to reject the request  ${ids}?`
        );
        if (confirmed) {
          setSelectAlert({ open: false, message: "" });
          setRejectAlert({ open: true });

          const rejectionRequests = selectedRows.map(async (row) => {
            try {
              // Send reject request for each row
              const response = await axios.put(
                `http://localhost:5000/api/reserve/${row.id}`,
                {
                  type: "Reject",
                  student_id: row.user_id,
                  book_code: row.book_code,
                }
              );
              return response.data; // Return response data for each row
            } catch (error) {
              console.error("Error rejecting request:", error);
              throw error;
            }
          });

          // Wait for all rejection requests to finish
          await Promise.all(rejectionRequests);

          // Increase borrow limit for each user
          const userIDs = selectedRows.map((row) => row.user_id);
          const limitRequests = userIDs.map(async (user_id) => {
            try {
              const limitResponse = await axios.get(
                `http://localhost:5000/api/user/limit/${user_id}`
              );

              const currentLimit = limitResponse.data.borrow_limit;
              const selectedRowsUser = selectedRows.filter(
                (r) => r.user_id === user_id
              );
              const updatedLimit = currentLimit + selectedRowsUser.length;
              console.log("length" + selectedRowsUser.length);

              // Update borrow limit for the user
              return axios.put("http://localhost:5000/api/user/limit", {
                id: user_id,
                limit: updatedLimit,
              });
            } catch (error) {
              console.error("Error increasing borrow limit:", error);
              throw error;
            }
          });

          // Wait for all limitRequests to finish
          await Promise.all(limitRequests);

          // const response = await axios.put(
          //   `http://localhost:5000/api/reserve/${ids}`,
          //   { type: "Reject" }
          // );
          handleAlertWithTimeout(
            rejectAlert,
            setRejectAlert,
            "The request is rejected."
          );

          // const userIDs = selectedRows.map((row) => row.user_id);
          // //increase borrow limit
          // const limitRequests = userIDs.map(async (user_id) => {
          //   try {
          //     const limitResponse = await axios.get(
          //       "http://localhost:5000/api/user/limit/" + user_id
          //     );

          //     const currentLimit = limitResponse.data.borrow_limit;
          //     const selectedRowsUser = selectedRows.filter(
          //       (r) => r.user_id === user_id
          //     );
          //     const updatedLimit = currentLimit + selectedRowsUser.length;
          //     console.log("length" + selectedRowsUser.length);
          //     return axios.put("http://localhost:5000/api/user/limit", {
          //       id: user_id,
          //       limit: updatedLimit,
          //     });
          //   } catch (e) {
          //     console.log(e);
          //     throw e;
          //   }
          // });

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
  const handleIssueClick = async () => {
    const bookCodes = selectedRows.map((row) => row.book_code);
    const rowIDs = selectedRows.map((row) => row.id);
    const userIDs = selectedRows.map((row) => row.user_id);
    const statuses = selectedRows.map((row) => row.status);

    // Display confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to approve the request ${rowIDs}?`
    );

    // Exit function if confirmation is not given
    if (!confirmed) return;

    try {
      const containsRejected = selectedRows.some(
        (row) => row.status === "Rejected"
      );

      if (selectedRows.length < 1) {
        alert("Select a row");
        return;
      }

      if (containsRejected) {
        alert("Issuance is only possible for approved reservations.");
        return; // Exit function if any row contains "Rejected"
      }

      // Update book status to "Borrowed"
      await axios.put("http://localhost:5000/api/book/status", {
        bookCodes: bookCodes,
        status: "Borrowed",
      });

      // Reduce user borrow limit
      const limitRequests = userIDs.map(async (user_id) => {
        try {
          const limitResponse = await axios.get(
            "http://localhost:5000/api/user/limit/" + user_id
          );

          const currentLimit = limitResponse.data.borrow_limit;
          const selectedRowsUser = selectedRows.filter(
            (r) => r.user_id === user_id
          );
          const updatedLimit = currentLimit - selectedRowsUser.length;
          console.log("length" + selectedRowsUser.length);
          return axios.put("http://localhost:5000/api/user/limit", {
            id: user_id,
            limit: updatedLimit,
          });
        } catch (e) {
          console.log(e);
          throw e;
        }
      });

      // Insert borrow records for each book
      const borrowRequests = selectedRows.map(async (row, index) => {
        try {
          const insertBorrow = await axios.post(
            "http://localhost:5000/api/history/borrow",
            { bookCode: row.book_code, user_id: row.user_id } // Use user_id from selectedRows
          );
        } catch (error) {
          console.error("Error sending POST request:", error);
          throw error;
        }
      });

      // Wait for all limitRequests to finish
      await Promise.all(limitRequests);
      await Promise.all(borrowRequests);

      // Update reserve record status to "Issued"
      const res = await axios.put("http://localhost:5000/api/reserve/status", {
        ids: rowIDs,
        status: "Issued",
      });
      setRowSelectionModel([]);
      setSelectedRows([]); // Clear the cart
      fetchHistory();
      alert("Issue Successfully");
    } catch (error) {
      console.log("Error: " + error.message);
      alert("Error occurred while processing the request.");
    }
  };

  useEffect(() => {
    // Fetch data based on selected option
    selectedOption === "reserving" ? fetchRequests() : fetchHistory();
  }, [selectedOption]); // O

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
        {!showStatus && (
          <>
            <Button onClick={handleIssueClick} sx={subButtonStyle}>
              Issue
            </Button>
          </>
        )}
      </Stack>
    );
  };

  const columnsReserving = [
    { field: "id", headerName: "ID", flex: 1, headerAlign: "center" },
    {
      field: "user_id",
      headerName: "Student ID",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "book_code",
      headerName: "Book Code",
      flex: 1,
      headerAlign: "center",
    },
    { field: "title", headerName: "Title", flex: 1, headerAlign: "center" },
    { field: "name", headerName: "Author", flex: 1, headerAlign: "center" },
    { field: "edition", headerName: "Edition", flex: 1, headerAlign: "center" },
    {
      field: "requested_at",
      headerName: "Requested At",
      flex: 1,
      headerAlign: "center",
    },

    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
  ];

  const columnsHistory = [
    { field: "id", headerName: "ID", flex: 1, headerAlign: "center" },
    {
      field: "user_id",
      headerName: "Student ID",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "book_code",
      headerName: "Book Code",
      flex: 1,
      headerAlign: "center",
    },
    { field: "title", headerName: "Title", flex: 1, headerAlign: "center" },
    { field: "name", headerName: "Author", flex: 1, headerAlign: "center" },
    { field: "edition", headerName: "Edition", flex: 1, headerAlign: "center" },
    {
      field: "requested_at",
      headerName: "Requested At",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "start_datetime",
      headerName: "Start DateTime",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "end_datetime",
      headerName: "End DateTime",
      flex: 1,
      headerAlign: "center",
    },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
  ];

  const renderTable = () => {
    const columns =
      selectedOption === "reserving" ? columnsReserving : columnsHistory;
    const rows = data ? data : [];

    return (
      <div style={{ height: "73vh", width: "100%" }}>
        <StyledDataGrid
          rows={rows}
          getRowId={(row) => row.id}
          columns={columns}
          pageSize={5}
          rowHeight={40}
          checkboxSelection
          slots={{ toolbar: GridToolbar }}
          onRowClick={(row) => handleRowClicked(row.row)}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(ids) => {
            setRowSelectionModel(ids);
            setSelectedRows(ids.map((id) => data.find((row) => row.id === id)));
          }}
        />
      </div>
    );
  };

  return (
    <Stack
      direction="column"
      spacing={0}
      className={"ReservePageContainer"}
      sx={{ height: "100vh", width: "100vw", overflow: "auto" }} // Set full height and width
    >
      <Stack direction="row" spacing={3} className={"haederReserve"}>
        <TemporaryDrawer open={drawerOpen} onClose={toggleDrawer} />
        <h1 className={"headerTitle-reservation"}>Reserve Book Page</h1>
      </Stack>

      <Stack
        direction="column"
        className={"MainContent-Reserve"}
        mt={3}
        sx={{ height: "90vh", width: "97vw", overflow: "auto" }} // Set full height and width
      >
        <Box sx={{ width: "300px", marginTop: "15px" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-containerReserve"
          ></form>
        </Box>
        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Stack direction="row" spacing={0.3}>
            <Button
              onClick={() => handleOptionClick("reserving")}
              sx={activeButton === "reserving" ? buttonStyle : {}}
            >
              Reserving
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

        <div className={"tableContainer-Reserve"}>
          <Stack sx={{ width: "100%" }} className={"alertBox-reserve"}>
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
                onClose={() => setSelectAlert({ ...selectAlert, open: false })}
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

export default Reservation;
