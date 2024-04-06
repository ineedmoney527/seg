import React, { useState, useEffect } from "react";
import "./IssuesBook.css";
import StudentTable from "./StudentTable";
import BookTable from "./BookTable";
import {
  Box,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  styled,
  tableCellClasses,
  TableContainer,
  Typography,
  Collapse,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import TemporaryDrawer from "./TemporaryDrawer";

import { MdCleaningServices } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { MdDeleteForever } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { PiPersonArmsSpreadFill } from "react-icons/pi";

import { SiDarkreader } from "react-icons/si";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import Data Grid components
import axios from "axios";
function IssuesBook() {
  // const [selectedBooks, setSelectedBooks] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [resetBookTable, setResetBookTable] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState(null);
  const [selectedStudentBorrowLimit, setSelectedStudentBorrowLimit] =
    useState(null);

  const [open, setOpen] = useState(true);
  const [canBorrowBooks, setCanBorrowBooks] = useState(true);
  const [selectedCartItem, setSelectedCartItem] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/(3,4)");
      setStudentData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/book/available"
      );
      setBookData(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

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

  const handleAlertWithTimeout = (alertState, setAlertState) => {
    setAlertState({ ...alertState, open: true });
    setTimeout(() => {
      setAlertState({ ...alertState, open: false });
    }, 5000); // Adjust the time (in milliseconds) as needed
  };

  // Columns configuration for Data Grid
  const columns = [
    {
      field: "book_code",
      headerName: "Book Code",
      width: 250,
      headerClassName: "cartTblHeader",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Title",
      width: 552,
      headerClassName: "cartTblHeader",
      headerAlign: "center",
    },
    {
      field: "author_name",
      headerName: "Author",
      width: 400,
      headerClassName: "cartTblHeader",
      headerAlign: "center",
    },
    {
      field: "edition",
      headerName: "Edition",
      width: 150,
      headerClassName: "cartTblHeader",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerClassName: "cartTblHeader",
      headerAlign: "center",
    },
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 1000); // Automatically close after 10 seconds (10000 milliseconds)

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  // Dummy row data for demonstration (replace with actual data from cartArray)

  const handleSelectStudent = (id, name, borrow_limit) => {
    setSelectedStudentId(id);
    setSelectedStudentBorrowLimit(borrow_limit);
    setSelectedRows([]);
    handleClearCart();
    fetchBooks();
    fetchUsers();
    setResetBookTable(!resetBookTable);
    setSelectedStudentName(name);
    setCanBorrowBooks(true);
    setOpen(false); // Set open to true when the limit is greater than 0
  };

  const handleAddToCart = (selectedBook) => {
    if (!selectedStudentId) {
      setSubmitAlert("Please select a borrower");
    } else {
      const updatedCart = (prev) => [...prev, selectedBook];
      setCartArray(updatedCart);
    }
  };
  const [bookDelAlert, setDelAlert] = useState(false);
  const [bookClearAlert, setClearAlert] = useState(false);
  const [bookSubmitAlert, setSubmitAlert] = useState(false);

  const handleDeleteFromCart = () => {
    const deleteLength = selectedRows.length;
    if (selectedRows.length > 0) {
      selectedRows.forEach((item) => {
        setCartArray((prev) =>
          prev.filter((row) => row.book_code !== item.book_code)
        );

        setBookData((prev) => [...prev, item]);
        setStudentData((prevStudents) =>
          prevStudents.map((student) =>
            student.id === selectedStudentId
              ? {
                  ...student,
                  borrow_limit: student.borrow_limit + deleteLength,
                }
              : student
          )
        );
        // Your add item logic here
      });
      setSelectedRows([]); // Clear selected rows after deletion

      handleAlertWithTimeout(bookDelAlert, setDelAlert);
      setClearAlert({ open: false });
      setSubmitAlert({ open: false });
      setDelAlert({ open: true, message: "Selected books are deleted." });
    } else {
      alert("Please select at least one book to delete.");
    }
  };

  const handleClearCart = () => {
    setSubmitAlert({ open: false });
    setDelAlert({ open: false });
    handleAlertWithTimeout(bookClearAlert, setClearAlert);
    setClearAlert({ open: true, message: "The Cart is empty right now." });
    setCartArray([]); // Clear the cart by setting an empty array
  };

  const handleSubmitCart = async () => {
    const bookCodes = cartArray.map((row) => row.book_code);
    console.log(JSON.stringify(bookCodes));
    setDelAlert({ open: false });
    setClearAlert({ open: false });
    handleAlertWithTimeout(bookSubmitAlert, setSubmitAlert);
    setSubmitAlert({
      open: true,
      message: "The borrowing process is sucessful.",
    });

    try {
      //update book status = borrowed
      const response = await axios.put(
        "http://localhost:5000/api/book/status",
        {
          bookCodes: bookCodes,
          status: "Borrowed",
        }
      );

      //reduce user borrow limit
      const responseLimit = await axios.put(
        "http://localhost:5000/api/user/limit",
        {
          id: selectedStudentId,
          limit: selectedStudentBorrowLimit - cartArray.length,
        }
      );

      const postRequests = bookCodes.map(async (bookCode) => {
        try {
          const insertBorrow = await axios.post(
            "http://localhost:5000/api/history/borrow",
            { bookCode: bookCode, user_id: selectedStudentId }
          );
          return insertBorrow.data; // Return the response data if the request is successful
        } catch (error) {
          console.error("Error sending POST request:", error);
          throw error; // Throw an error if the request fails
        }
      });
    } catch (e) {
      console.log("Error: " + e.message);
    }

    setCartArray([]); // Clear the cart by setting an empty array
  };

  const subButtonStyle = {
    bgcolor: "#fff",
    color: "#183764",
    "&:hover": {
      bgcolor: "#32496B", // Adjust hover background color
      color: "#fff", // Adjust hover text color
    },
  };
  return (
    <Stack
      direction="column"
      spacing={0}
      className={"IssuesPageContainer"}
      sx={{ height: "100%", width: "100vw", overflow: "auto" }} // Set full height and width
    >
      {" "}
      <div>{selectedStudentId}</div>
      <Stack direction="row" spacing={3} className={"haederIssues"}>
        <TemporaryDrawer open={drawerOpen} onClose={toggleDrawer} />
        <h1 className={"headerTitle-Issues"}>Issues Book Page</h1>
      </Stack>
      <Stack
        direction="column"
        className={"MainContent-Issues"}
        sx={{ height: "110vh", width: "97vw", overflow: "hidden" }} // Set full height and width
      >
        <Stack direction="row" spacing={3} justifyContent={"space-between"}>
          <StudentTable
            studentsData={studentData}
            onSelectStudent={handleSelectStudent}
          />
          <BookTable
            bookData={bookData}
            setBookData={setBookData}
            cartArray={cartArray}
            onAddToCart={handleAddToCart}
            studentId={selectedStudentId}
            setStudentData={setStudentData}
            borrowLimit={selectedStudentBorrowLimit}
          />
        </Stack>

        {/* Cart Table */}
        <Box>
          <Stack
            direction="row"
            spacing={1}
            justifyContent={"space-between"}
            className={"bookcartHeaderBar"}
          >
            <h2 className={"smallerheaderCart"}>Book Cart</h2>
            {selectedStudentId && selectedStudentName ? (
              <Stack
                direction={"row"}
                spacing={5}
                className={"cartBorrowerInfo"}
              >
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(64, 162, 216, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "30 20 10px  #232323",
                    "&:hover": {
                      backgroundColor: "rgba(64, 162, 216, 0.8)",
                    },
                    gap: "8px",
                    borderRadius: "8px",
                    px: "16px",
                    py: "8px",
                  }}
                >
                  {/*<PiStudentFill size={25} sx={{ color: 'white', marginRight: '10px' }} />*/}
                  <SiDarkreader
                    size={23}
                    sx={{ color: "white", marginRight: "10px" }}
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="cartInfoText-issues"
                  >
                    {`ID: ${selectedStudentId}, Name: ${selectedStudentName}`}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="cartInfoText-issues"
                  ></Typography>
                </Button>
              </Stack>
            ) : (
              <Stack
                sx={{ width: "600px" }}
                spacing={2}
                className={"alertBox-Issues"}
              >
                <Collapse in={open} timeout={1000} unmountOnExit>
                  <Alert
                    severity="warning"
                    onClose={handleClose}
                    className={open ? "fadeIn" : "fadeOut"}
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      transition:
                        "opacity 10s ease-out, transform 10s ease-out", // Add transition property
                      transformOrigin: "center", // Set transform origin for scale effect
                      transform: open ? "scale(1)" : "scale(0.9)", // Apply scale based on 'open' state
                      opacity: open ? 1 : 0, // Apply opacity based on 'open' state
                    }}
                  >
                    Please select a borrower who still has borrowing capacity
                    available
                  </Alert>
                </Collapse>
              </Stack>
            )}

            <Stack
              direction="row"
              spacing={1.5}
              className={"butttonsCart-Issues"}
            >
              <Button
                sx={subButtonStyle}
                disabled={cartArray.length === 0}
                onClick={handleDeleteFromCart}
              >
                <MdDeleteForever size={25} style={{ marginRight: "8px" }} />{" "}
                Delete
              </Button>
              {/* <Button
                sx={subButtonStyle}
                disabled={cartArray.length === 0}
                onClick={handleClearCart}
              >
                <MdCleaningServices size={20} style={{ marginRight: "8px" }} />{" "}
                Clear All
              </Button> */}
              <Button
                sx={subButtonStyle}
                disabled={cartArray.length === 0}
                onClick={handleSubmitCart}
              >
                <GiConfirmed size={20} style={{ marginRight: "8px" }} /> Submit
              </Button>
            </Stack>
          </Stack>

          <Stack sx={{ width: "100%" }} className={"alertBox-studentTable"}>
            <Collapse in={bookDelAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() => setDelAlert({ ...bookDelAlert, open: false })}
                sx={{ borderRadius: 2 }}
              >
                {bookDelAlert.message}
              </Alert>
            </Collapse>
            <Collapse in={bookClearAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() =>
                  setClearAlert({ ...bookClearAlert, open: false })
                }
                sx={{ borderRadius: 2 }}
              >
                {bookClearAlert.message}
              </Alert>
            </Collapse>
            <Collapse in={bookSubmitAlert.open} timeout={500} unmountOnExit>
              <Alert
                severity="success"
                onClose={() =>
                  setSubmitAlert({ ...bookSubmitAlert, open: false })
                }
                sx={{ borderRadius: 2 }}
              >
                {bookSubmitAlert.message}
              </Alert>
            </Collapse>
          </Stack>

          <Box className={"datagridContainer"}>
            <div style={{ height: "350px", width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.book_code}
                rows={cartArray}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                slots={{ toolbar: GridToolbar }}
                onRowSelectionModelChange={(selection) => {
                  setSelectedRows(
                    selection.map((id) =>
                      cartArray.find((row) => row.book_code === id)
                    )
                  );
                }}
              />
            </div>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default IssuesBook;
