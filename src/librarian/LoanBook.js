import React, { useState } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import { Box, Grid, Typography, IconButton, styled, Collapse,Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './LoanBook.css';
import { useForm } from 'react-hook-form';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import {Button, Stack, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,} from '@mui/material';
function LoanBook() {
    function customCheckbox(theme) {
        return {
            '& .MuiCheckbox-root svg': {
                width: 16,
                height: 16,
                backgroundColor: 'transparent',
                border: `1px solid ${
                    theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'
                }`,
                borderRadius: 2,
            },
            '& .MuiCheckbox-root svg path': {
                display: 'none',
            },
            '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
            },
            '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
                position: 'absolute',
                display: 'table',
                border: '2px solid #fff',
                borderTop: 0,
                borderLeft: 0,
                transform: 'rotate(45deg) translate(-50%,-50%)',
                opacity: 1,
                transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
                content: '""',
                top: '50%',
                left: '39%',
                width: 5.71428571,
                height: 9.14285714,
            },
            '& .MuiCheckbox-indeterminate .MuiIconButton-label:after': {
                width: 8,
                height: 8,
                backgroundColor: '#1890ff',
                transform: 'none',
                top: '39%',
                border: 0,
            },
        };
    }

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        border: 0,
        color:
            theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        WebkitFontSmoothing: 'auto',
        letterSpacing: 'normal',
        '& .MuiDataGrid-root': {
            borderRadius: 20, // Set the border radius here (adjust the value as needed)
            overflow: 'hidden', // Optional: Hide overflow content if needed
        },
        '& .MuiDataGrid-columnsContainer .MuiDataGrid-iconSeparator': {
            color: '#fff', // Set your desired color here
        },
        '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
            borderBottom: `1px solid ${
                theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
            }`,
        },
        '& .MuiDataGrid-cell': {
            color:
                theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center', // Align text center
            padding: theme.spacing(1),
        },
        '& .MuiPaginationItem-root': {
            borderRadius: 0,
        },
        '& .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitle': {
            backgroundColor: '#282c34', // Change header background color here
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center', // Align text center
            padding: theme.spacing(1),
            color: '#fff'
        },
        '& .MuiDataGrid-sortIcon, .MuiDataGrid-menuIconButton': {
            color: '#fff',
        },
        ...customCheckbox(theme),
    }));

    const columns = [
        { field: 'studentId', headerName: 'Student ID', flex: 1,headerAlign: "center" },
        { field: 'bookCode', headerName: 'Book Code', flex: 1,headerAlign: "center" },
        { field: 'title', headerName: 'Title', flex: 1,headerAlign: "center" },
        { field: 'author', headerName: 'Author', flex: 1,headerAlign: "center" },
        { field: 'edition', headerName: 'Edition', flex: 1,headerAlign: "center" },
        { field: 'startDate', headerName: 'Start Date', flex: 1,headerAlign: "center" },
        { field: 'endDate', headerName: 'End Date', flex: 1,headerAlign: "center" },
        { field: 'daysRemaining', headerName: 'Days Remaining', flex: 1,headerAlign: "center" },
    ];

    const borrowedBooks = [
  {
      id:1,
    studentId: '23456789',
    bookCode: 'B0123456',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    edition: '1',
    startDate: '10/03/2024',
    endDate: '25/03/2024',
    daysRemaining: '7',
    daysdue: 2,
    bookPrice: 18.99,
    status: 'borrowing'
  },
  {
      id:2,
      studentId: '45678901',
    bookCode: 'B0234567',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    edition: '2',
    startDate: '15/03/2024',
    endDate: '30/03/2024',
    daysRemaining: 0,
    daysdue: 6,
    bookPrice: 22.50,
    status: 'overdue'
  },
  {
      id:3,
      studentId: '67890123',
    bookCode: 'B0345678',
    title: 'Moby-Dick',
    author: 'Herman Melville',
    edition: '1',
    startDate: '20/03/2024',
    endDate: '04/04/2024',
    daysRemaining: 0,
    daysdue: 4,
    bookPrice: 28.75,
    status: 'overdue returned'
  },
  {
      id:4,
      studentId: '89012345',
    bookCode: 'B0456789',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    edition: '3',
    startDate: '25/03/2024',
    endDate: '09/04/2024',
    daysRemaining: 0,
    daysdue: 3,
    bookPrice: 40.00,
    status: 'overdue lost'
  },
  {
      id:5,
    studentId: '90123456',
    bookCode: 'B0567890',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    edition: '1',
    startDate: '30/03/2024',
    endDate: '14/04/2024',
    daysRemaining: '9',
    daysdue: 7,
    bookPrice: 36.99,
    status: 'borrowing'
  },
  {
      id:6,
    studentId: '01234567',
    bookCode: 'B0678901',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    edition: '2',
    startDate: '05/04/2024',
    endDate: '19/04/2024',
    daysRemaining: 0,
    daysdue: 10,
    bookPrice: 24.99,
    status: 'overdue'
  },
  {
      id:7,
    studentId: '34567890',
    bookCode: 'B0789012',
    title: 'Jane Eyre',
    author: 'Charlotte Bronte',
    edition: '1',
    startDate: '10/04/2024',
    endDate: '24/04/2024',
    daysRemaining: 0,
    daysdue: 12,
    bookPrice: 20.50,
    status: 'overdue returned'
  },
  {
      id:8,
    studentId: '56789012',
    bookCode: 'B0890123',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    edition: '1',
    startDate: '15/04/2024',
    endDate: '29/04/2024',
    daysRemaining: 0,
    daysdue: 1,
    bookPrice: 17.99,
    status: 'overdue lost'
  },
  {
      id:9,
    studentId: '78901234',
    bookCode: 'B0901234',
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    edition: '1',
    startDate: '20/04/2024',
    endDate: '04/05/2024',
    daysRemaining: '6',
    daysdue: 9,
    bookPrice: 32.75,
    status: 'borrowing'
  },
  {
      id:10,
    studentId: '90123456',
    bookCode: 'B1012345',
    title: 'Anna Karenina',
    author: 'Leo Tolstoy',
    edition: '1',
    startDate: '25/04/2024',
    endDate: '09/05/2024',
    daysRemaining: '4',
    daysdue: 7,
    bookPrice: 27.50,
    status: 'borrowing'
  },
  {
      id:11,
    studentId: '12345678',
    bookCode: 'B1123456',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    edition: '1',
    startDate: '30/04/2024',
    endDate: '14/05/2024',
    daysRemaining: 0,
    daysdue: 15,
    bookPrice: 21.99,
    status: 'overdue'
  },
  {
      id:12,
    studentId: '34567890',
    bookCode: 'B1234567',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    edition: '1',
    startDate: '05/05/2024',
    endDate: '19/05/2024',
    daysRemaining: 0,
    daysdue: 4,
    bookPrice: 23.50,
    status: 'overdue returned'
  },
  {
      id:13,
    studentId: '56789012',
    bookCode: 'B1345678',
    title: 'Wuthering Heights',
    author: 'Emily Bronte',
    edition: '1',
    startDate: '10/05/2024',
    endDate: '24/05/2024',
    daysRemaining: '8',
    daysdue: 6,
    bookPrice: 19.99,
    status: 'borrowing'
  },
    {
        id:14,
        studentId: '78901234',
        bookCode: 'B1456789',
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        edition: '1',
    },
    {
        id:15,
        studentId: '89012345',
        bookCode: 'B1567890',
        title: 'The Odyssey',
        author: 'Homer',
        edition: '1',
        startDate: '15/05/2024',
        endDate: '29/05/2024',
        daysRemaining: 0,
        daysdue: 3,
        bookPrice: 18.75,
        status: 'overdue'
    },
    {
        id:16,
        studentId: '90123456',
        bookCode: 'B1678901',
        title: 'The Adventures of Huckleberry Finn',
        author: 'Mark Twain',
        edition: '2',
        startDate: '20/05/2024',
        endDate: '03/06/2024',
        daysRemaining: '2',
        daysdue: 5,
        bookPrice: 21.50,
        status: 'borrowing'
    },
    {
        id:17,
        studentId: '01234567',
        bookCode: 'B1789012',
        title: 'Les Miserables',
        author: 'Victor Hugo',
        edition: '1',
        startDate: '25/05/2024',
        endDate: '08/06/2024',
        daysRemaining: 0,
        daysdue: 10,
        bookPrice: 29.99,
        status: 'overdue returned'
    },
    {
        id:18,
        studentId: '23456789',
        bookCode: 'B1890123',
        title: 'The Grapes of Wrath',
        author: 'John Steinbeck',
        edition: '1',
        startDate: '30/05/2024',
        endDate: '13/06/2024',
        daysRemaining: '4',
        daysdue: 7,
        bookPrice: 25.00,
        status: 'borrowing'
    },
    {
        id:19,
        studentId: '34567890',
        bookCode: 'B1901234',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        edition: '1',
        startDate: '04/06/2024',
        endDate: '18/06/2024',
        daysRemaining: 0,
        daysdue: 12,
        bookPrice: 20.99,
        status: 'overdue'
    },
    {
        id:20,
        studentId: '45678901',
        bookCode: 'B2012345',
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        edition: '1',
        startDate: '09/06/2024',
        endDate: '23/06/2024',
        daysRemaining: '6',
        daysdue: 8,
        bookPrice: 34.50,
        status: 'borrowing'
    }
    ];

    const [selectedRow, setSelectedRow] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('borrowing'); // Default selected option
    const [activeButton, setActiveButton] = useState('borrowing');
    const { register, handleSubmit } = useForm();
    const [showReturnedLost, setShowReturnedLost] = useState(selectedOption === 'borrowing');
    const [showPaidButtons, setShowPaidButtons] = useState(selectedOption === 'overdue');
    const [returnedAlert, setReturnedAlert] = useState(false);
    const [lostAlert, setLostAlert] = useState(false);
    const [paidReturnedAlert, setPaidReturnedAlert] = useState(false);
    const [paidLostAlert, setPaidLostAlert] = useState(false);
    const [selectAlert, setSelectAlert] = useState(false);

    const handleRowClicked = (row) => {
        setSelectedRow(row);
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const onSubmit = (data) => {
        console.log(data); // You can handle the search query here
    };

    const buttonStyle = {
        bgcolor: '#242732',
        color: '#fff',
        '&:hover': {
            bgcolor: '#32496B', // Adjust hover background color
            opacity: 5, // Adjust hover opacity as needed
        },
    };

    const subButtonStyle = {
        bgcolor: '#fff',
        color: '#183764',
        '&:hover': {
            bgcolor: '#32496B', // Adjust hover background color
            color: '#fff', // Adjust hover text color
        },
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setActiveButton(option); // Update activeButton state

        setSelectAlert({open: false});
        setReturnedAlert({open: false});
        setLostAlert({open: false});
        setPaidReturnedAlert({open: false});
        setPaidLostAlert({open: false});

        // Show/hide additional buttons based on the selected option
        setShowReturnedLost(option === 'borrowing');
        setShowPaidButtons(option === 'overdue');
    };


    const handleAlertWithTimeout = (alertState, setAlertState) => {
        setAlertState({ ...alertState, open: true });
        setTimeout(() => {
            setAlertState({ ...alertState, open: false });
        }, 5000); // Adjust the time (in milliseconds) as needed
    };

    const handleReturnedClick = () =>{
        if (selectedRow !== null){
            setSelectAlert({open: false});
            setReturnedAlert({open: true});
            setLostAlert({open: false});
            handleAlertWithTimeout(returnedAlert, setReturnedAlert);
            setSelectedRow(null);
        }else{
            setReturnedAlert({open: false});
            setSelectAlert({open: true});
            setLostAlert({open: false});
            handleAlertWithTimeout(selectAlert, setSelectAlert);
        }
    }

    const handleLostClick = () =>{
        if (selectedRow !== null){
            setSelectAlert({open: false});
            setLostAlert({open: true});
            setReturnedAlert({open: false});
            handleAlertWithTimeout(lostAlert, setLostAlert);
            setSelectedRow(null);
        }else{
            setLostAlert({open: false});
            setSelectAlert({open: true});
            setReturnedAlert({open: false});
            handleAlertWithTimeout(selectAlert, setSelectAlert);
        }
    }

    const handlePaidLostClick = () =>{
        if (selectedRow !== null){
            setSelectAlert({open: false});
            setPaidLostAlert({open: true});
            handleAlertWithTimeout(paidLostAlert, setPaidLostAlert);
            setSelectedRow(null);
        }else{
            setPaidLostAlert({open: false});
            setSelectAlert({open: true});
            handleAlertWithTimeout(selectAlert, setSelectAlert);
        }
    }

    const handlePaidReturnedClick = () =>{
        if (selectedRow !== null){
            setSelectAlert({open: false});
            setPaidReturnedAlert({open: true});
            handleAlertWithTimeout(paidReturnedAlert, setPaidReturnedAlert);
            setSelectedRow(null);
        }else{
            setPaidReturnedAlert({open: false});
            setSelectAlert({open: true});
            handleAlertWithTimeout(selectAlert, setSelectAlert);
        }
    }
    const renderButtons = () => {
        return (
            <Stack direction="row" spacing={2}>
                {showReturnedLost && (
                    <>
                    <Button onClick={handleReturnedClick} sx={subButtonStyle}>
                            Returned
                        </Button>
                        <Button onClick={(handleLostClick)} sx={subButtonStyle}>
                            Lost
                        </Button>
                    </>
                )}
                {showPaidButtons && (
                    <>
                        <Button onClick={(handlePaidReturnedClick)} sx={subButtonStyle}>
                            Paid & Returned
                        </Button>
                        <Button onClick={(handlePaidLostClick)} sx={subButtonStyle}>
                            Paid & Lost
                        </Button>
                    </>
                )}
            </Stack>
        );
    };

    const renderTable = () => {
        const rows = borrowedBooks
            .filter((book) => {
                if (selectedOption === 'borrowing') {
                    return book.status === 'borrowing' || book.status === 'overdue';
                }
                return book.status !== 'borrowing';
            })
            .map((book) => ({
                id: book.id,
                studentId: book.studentId,
                bookCode: book.bookCode,
                title: book.title,
                author: book.author,
                edition: book.edition,
                startDate: book.startDate,
                endDate: book.endDate,
                daysRemaining: book.daysRemaining,
            }));

        return (
            <div style={{ height: '73vh', width: '100%' }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    checkboxSelection
                    slots={{ toolbar: GridToolbar }}
                    onSelectionModelChange={(ids) => {
                        const selectedBook = rows.find((book) => book.id === ids[0]);
                        setSelectedRow(selectedBook);
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
                sx={{ height: '100vh', width: '100vw', overflow: 'auto' }} // Set full height and width
            >
                <Stack direction="row" spacing={3} className={"haederLoan"}>
                    {/*<img src={logo} alt={"UoSM Logo"} className={"Logo"}/>*/}
                    <TemporaryDrawer
                        open={drawerOpen}
                        onClose={toggleDrawer}
                    />
                    <h1 className={"headerTitle-loan"} >Loan Book Page</h1>
                </Stack>

                <Stack
                    direction="column"
                    className={"MainContent-loan"}
                    sx={{ height: '90vh', width: '97vw', overflow: 'auto' }} // Set full height and width
                >
                    <Box sx={{ width: '300px' }}>
                        <form onSubmit={handleSubmit(onSubmit)} className="form-containerLoan">
                            <TextField
                                {...register('searchQuery')}
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
                            />
                        </form>
                    </Box>
                    <Stack direction="row" spacing={3} justifyContent="space-between">
                        <Stack direction="row" spacing={0.3}>
                            <Button onClick={() => handleOptionClick('borrowing')}
                                    sx={activeButton === 'borrowing' ? buttonStyle : {}}
                            >Borrowing</Button>
                            <Button onClick={() => handleOptionClick('overdue')}
                                    sx={activeButton === 'overdue' ? buttonStyle : {}}
                            >Overdue</Button>
                            <Button onClick={() => handleOptionClick('returned')}
                                    sx={activeButton === 'returned' ? buttonStyle : {}}
                            >Returned</Button>
                            <Button onClick={() => handleOptionClick('lost')}
                                    sx={activeButton === 'lost' ? buttonStyle : {}}
                            >Lost</Button>
                            {/* Add buttons for 'returned' and 'lost' as needed */}
                        </Stack>

                        <Stack direction="row" spacing={2}>
                        {renderButtons()}
                        </Stack>
                    </Stack>

                    <div className={"tableContainer-loan"} sx={{height:'200px'}}>
                        <Stack sx={{ width: '100%' }} className={"alertBox-loan"}>
                            <Collapse in={returnedAlert.open} timeout={500} unmountOnExit>
                                <Alert
                                    severity="success"
                                    onClose={() => setReturnedAlert({ ...returnedAlert, open: false })}
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
                                    onClose={() => setPaidLostAlert({ ...paidLostAlert, open: false })}
                                    sx={{ borderRadius: 2 }}
                                >
                                    The fine is PAID and book is LOST.
                                </Alert>
                            </Collapse>
                            <Collapse in={paidReturnedAlert.open} timeout={500} unmountOnExit>
                                <Alert
                                    severity="success"
                                    onClose={() => setPaidReturnedAlert({ ...paidReturnedAlert, open: false })}
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
