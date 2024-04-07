import React, { useState, useEffect } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  styled,
  Collapse,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./LoanBook.css";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";

import {
  Button,
  Stack,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
function LoanBook() {
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

  const [data, setData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("borrowing"); // Default selected option
  const [activeButton, setActiveButton] = useState("borrowing");
  const { register, handleSubmit } = useForm();
  const [showReturnedLost, setShowReturnedLost] = useState(
    selectedOption === "borrowing"
  );
  const [showPaidButtons, setShowPaidButtons] = useState(
    selectedOption === "overdue"
  );
  const [returnedAlert, setReturnedAlert] = useState(false);
  const [lostAlert, setLostAlert] = useState(false);
  const [paidReturnedAlert, setPaidReturnedAlert] = useState(false);
  const [paidLostAlert, setPaidLostAlert] = useState(false);
  const [selectAlert, setSelectAlert] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);

  const columns = [
    {
      field: "id",
      headerName: "Record ID",
      flex: 1,
      headerAlign: "center",
    },
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
    { field: "author", headerName: "Author", flex: 1, headerAlign: "center" },
    { field: "edition", headerName: "Edition", flex: 1, headerAlign: "center" },
    {
      field: "start_date",
      headerName: "Start Date",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "end_date",
      headerName: "End Date",
      flex: 1,
      headerAlign: "center",
    },
    activeButton === "borrowing" && {
      field: "days_remaining",
      headerName: "Days Remaining",
      flex: 1,
      headerAlign: "center",
    },
    activeButton === "overdue" && {
      field: "days_overdue",
      headerName: "Overdue Days",
      flex: 1,
      headerAlign: "center",
    },
    activeButton === "returned" && {
      field: "return_date",
      headerName: "Return Date",
      flex: 1,
      headerAlign: "center",
    },
    (activeButton === "returned" || activeButton === "overdue") && {
      field: "fine",
      headerName: "Fine",
      flex: 1,
      headerAlign: "center",
    },
    activeButton === "lost" && {
      field: "return_date",
      headerName: "Reported Date",
      flex: 1,
      headerAlign: "center",
    },
    activeButton === "lost" && {
      field: "fine",
      headerName: "Fine",
      flex: 1,
      headerAlign: "center",
    },
  ].filter(Boolean); // Remove falsy values (null, undefined) from the array

  //   useEffect(() => {
  //     setSelectionModel(selectedRows);
  //   }, [selectedRows]);

  const fetchRecords = async () => {
    try {
      let url = "http://localhost:5000/api/history/";

      // Append query parameters based on activeButton state
      if (activeButton === "overdue") {
        url += "overdue";
      } else if (activeButton === "borrowing") {
        url += "borrow";
      } else if (activeButton === "returned") {
        url += "returned";
      } else if (activeButton === "lost") {
        url += "lost";
      }

      const response = await axios.get(url);
      setData(response.data);
      checkOverdueAndSendEmail(response.data);
      console.log(response.data);
      console.log(response.data[0].id);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };
  useEffect(() => {
    fetchRecords();
  }, [activeButton]); // Run this effect whenever activeButton changes

  // Function to check overdue status and send email
  const checkOverdueAndSendEmail = (records) => {
    console.log("Checking overdue status...");
    console.log(records);
    const overdueRows = records.filter(
      (row) => row.id === 119 && row.reminder === "N"
    );
    if (overdueRows.length > 0) {
      sendEmailsForOverdue(overdueRows);
    }
  };

  // Function to send automated emails for each user associated with overdue rows
  const sendEmailsForOverdue = async (overdueRows) => {
    const emailRequests = overdueRows.map(async (row) => {
      try {
        console.log("Sending automated email for row:", row);

        // Replace the following line with your API endpoint to send automated emails
        const response = await axios.put(
          "http://localhost:5000/api/history/sendEmail",
          {
            id: row.id,
            user_id: row.user_id,
            title: row.title,
            fine: row.fine,
            days_overdue: row.days_overdue,
          }
        );
        return response.data; // Return response data for each row
      } catch (error) {
        console.error("Error sending automated email:", error);
        throw error;
      }
    });

    // Wait for all email requests to finish
    await Promise.all(emailRequests);
    // Show alert or perform any other action if needed
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

    setSelectAlert({ open: false });
    setReturnedAlert({ open: false });
    setLostAlert({ open: false });
    setPaidReturnedAlert({ open: false });
    setPaidLostAlert({ open: false });

    // Show/hide additional buttons based on the selected option
    setShowReturnedLost(option === "borrowing");
    setShowPaidButtons(option === "overdue");
  };

  const handleAlertWithTimeout = (alertState, setAlertState) => {
    setAlertState({ ...alertState, open: true });
    setTimeout(() => {
      setAlertState({ ...alertState, open: false });
    }, 5000); // Adjust the time (in milliseconds) as needed
  };

  const handleReturnedClick = async () => {
    if (selectedRows.length > 0) {
      setSelectAlert({ open: false });
      setReturnedAlert({ open: true });
      setLostAlert({ open: false });
      const ids = selectedRows.map((row) => row.id);
      const bookCodes = selectedRows.map((row) => row.book_code);
      alert(ids);
      try {
        await axios.put("http://localhost:5000/api/history/return", {
          id: ids,
        });

        await axios.put("http://localhost:5000/api/book/status", {
          bookCodes: bookCodes,
          status: "Available",
        });
        handleAlertWithTimeout(returnedAlert, setReturnedAlert);
        const userIDs = selectedRows.map((row) => row.user_id);
        //increase borrow limit
        const limitRequests = userIDs.map(async (user_id) => {
          try {
            const limitResponse = await axios.get(
              "http://localhost:5000/api/user/limit/" + user_id
            );

            const currentLimit = limitResponse.data.borrow_limit;
            const selectedRowsUser = selectedRows.filter(
              (r) => r.user_id === user_id
            );
            const updatedLimit = currentLimit + selectedRowsUser.length;
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
        setSelectedRows([]);
        fetchRecords();
      } catch (e) {
        console.log(e);
      }
    } else {
      setReturnedAlert({ open: false });
      setSelectAlert({ open: true });
      setLostAlert({ open: false });
      handleAlertWithTimeout(selectAlert, setSelectAlert);
    }
  };

  const handlePaidLostClick = async () => {
    if (selectedRows.length > 0) {
      try {
        const ids = selectedRows.map((row) => row.id);
        const bookCodes = selectedRows.map((row) => row.book_code);
        await axios.put("http://localhost:5000/api/history/lost", {
          id: ids,
        });

        await axios.put("http://localhost:5000/api/book/status", {
          bookCodes: bookCodes,
          status: "Lost",
        });
        setSelectAlert({ open: false });
        setPaidLostAlert({ open: true });
        handleAlertWithTimeout(paidLostAlert, setPaidLostAlert);
        setSelectedRows([]);
        fetchRecords();
      } catch (e) {
        console.log(e);
      }
    } else {
      setPaidLostAlert({ open: false });
      setSelectAlert({ open: true });
      handleAlertWithTimeout(selectAlert, setSelectAlert);
    }
  };

  // const handlePaidReturnedClick = async () => {
  //   if (selectedRows.length > 0) {
  //     try {
  //       const ids = selectedRows.map((row) => row.id);
  //       await axios.put("http://localhost:5000/api/history/return", {
  //         id: ids,
  //       });
  //       handleAlertWithTimeout(returnedAlert, setReturnedAlert);

  //       setSelectedRows([]);
  //       setSelectAlert({ open: false });
  //       setPaidReturnedAlert({ open: true });
  //       handleAlertWithTimeout(paidReturnedAlert, setPaidReturnedAlert);
  //       fetchRecords();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   } else {
  //     setPaidReturnedAlert({ open: false });
  //     setSelectAlert({ open: true });
  //     handleAlertWithTimeout(selectAlert, setSelectAlert);
  //   }
  // };
  const renderButtons = () => {
    return (
      <Stack direction="row" spacing={2}>
        {showReturnedLost && (
          <>
            <Button onClick={handleReturnedClick} sx={subButtonStyle}>
              Returned
            </Button>
            <Button onClick={handlePaidLostClick} sx={subButtonStyle}>
              Paid&Lost
            </Button>
          </>
        )}
        {showPaidButtons && (
          <>
            <Button onClick={handleReturnedClick} sx={subButtonStyle}>
              Paid & Returned
            </Button>
            <Button onClick={handlePaidLostClick} sx={subButtonStyle}>
              Paid & Lost
            </Button>
          </>
        )}
      </Stack>
    );
  };

  const renderTable = () => {
    // const rows = borrowedBooks
    //     .filter((book) => {
    //         if (selectedOption === 'borrowing') {
    //             return book.status === 'borrowing' || book.status === 'overdue';
    //         }
    //         return book.status !== 'borrowing';
    //     })
    //     .map((book) => ({
    //         id: book.id,
    //         studentId: book.studentId,
    //         bookCode: book.bookCode,
    //         title: book.title,
    //         author: book.author,
    //         edition: book.edition,
    //         startDate: book.startDate,
    //         endDate: book.endDate,
    //         daysRemaining: book.daysRemaining,
    //     }));

    return (
      <div style={{ height: "73vh", width: "100%" }}>
        <StyledDataGrid
          rows={data ? data : []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          slots={{ toolbar: GridToolbar }}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(selections) => {
            setSelectionModel(selections);
            setSelectedRows(
              selections.map((id) => data.find((row) => row.id === id))
            );
          }}
        />
      </div>
    );
  };

  return (
    <Stack
      direction="column"
      spacing={0}
      className={"LoanPageContainer"}
      sx={{ height: "100vh", width: "100vw", overflow: "auto" }} // Set full height and width
    >
      <Stack direction="row" spacing={3} className={"haederLoan"}>
        {/*<img src={logo} alt={"UoSM Logo"} className={"Logo"}/>*/}
        <TemporaryDrawer open={drawerOpen} onClose={toggleDrawer} />
        <h1 className={"headerTitle-loan"}>Loan Book Page</h1>
      </Stack>

      <Stack
        direction="column"
        className={"MainContent-loan"}
        sx={{ height: "90vh", width: "97vw", overflow: "auto" }} // Set full height and width
      >
        <Box sx={{ width: "300px" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-containerLoan"
          >
            {/* <TextField
              {...register("searchQuery")}
              label="Search keywords"
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              className="form-inputLoan"
            /> */}
          </form>
        </Box>
        <Stack
          direction="row"
          spacing={3}
          mt={2}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={0.3}>
            <Button
              onClick={() => handleOptionClick("borrowing")}
              sx={activeButton === "borrowing" ? buttonStyle : {}}
            >
              Borrowing
            </Button>
            <Button
              onClick={() => handleOptionClick("overdue")}
              sx={activeButton === "overdue" ? buttonStyle : {}}
            >
              Overdue
            </Button>
            <Button
              onClick={() => handleOptionClick("returned")}
              sx={activeButton === "returned" ? buttonStyle : {}}
            >
              Returned
            </Button>
            <Button
              onClick={() => handleOptionClick("lost")}
              sx={activeButton === "lost" ? buttonStyle : {}}
            >
              Lost
            </Button>
            {/* Add buttons for 'returned' and 'lost' as needed */}
          </Stack>

          <Stack direction="row" spacing={2}>
            {renderButtons()}
          </Stack>
        </Stack>

        <div className={"tableContainer-loan"} sx={{ height: "200px" }}>
          <Stack sx={{ width: "100%" }} className={"alertBox-loan"}>
            <Collapse in={returnedAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() =>
                  setReturnedAlert({ ...returnedAlert, open: false })
                }
                sx={{ borderRadius: 2 }}
              >
                The book is marked as returned.
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
            <Collapse in={lostAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() => setLostAlert({ ...lostAlert, open: false })}
                sx={{ borderRadius: 2 }}
              >
                The book is marked as lost.
              </Alert>
            </Collapse>
            <Collapse in={paidLostAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() =>
                  setPaidLostAlert({ ...paidLostAlert, open: false })
                }
                sx={{ borderRadius: 2 }}
              >
                The fine is PAID and book is LOST.
              </Alert>
            </Collapse>
            <Collapse in={paidReturnedAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() =>
                  setPaidReturnedAlert({ ...paidReturnedAlert, open: false })
                }
                sx={{ borderRadius: 2 }}
              >
                The fine is PAID and book is RETURNED.
              </Alert>
            </Collapse>
          </Stack>
          {renderTable()}
        </div>
      </Stack>
    </Stack>
  );
}

export default LoanBook;
