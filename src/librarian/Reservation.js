import './Reservation.css';
import React, { useState, useEffect } from 'react';
import TemporaryDrawer from "./TemporaryDrawer";
import {Box, Button, Stack, TextField, IconButton, styled, Collapse} from '@mui/material';
import { useForm } from 'react-hook-form';
import TableCell, { tableCellClasses }  from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Alert from "@mui/material/Alert";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
function Reservation(){
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

    const [reservationBooks, setReservationBooks] = useState([
        {
            id:1,
            studentId: '33371837',
            bookCode: 'B0002847',
            title: 'Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy',
            author: "Cathy O'Neil",
            edition: '4',
            startDatetime: '2024-04-15 10:00:00', // Using ISO 8601 format for datetime
            endDatetime: '2024-04-15 12:00:00', // Example end time (2 hours later)
            status: 'pending' // Default status is pending
        },
        {
            id:2,
            studentId: '40589342',
            bookCode: 'B0023748',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            edition: '2',
            startDatetime: '2024-04-20 14:30:00', // Using 24-hour format for time
            endDatetime: '2024-04-20 16:30:00', // Example end time (2 hours later)
            status: 'approved' // Example of an approved reservation
        },
        {
            id:3,
            studentId: '28904523',
            bookCode: 'B0092385',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            edition: '1',
            startDatetime: '2024-04-18 16:15:00', // Using 24-hour format for time
            endDatetime: '2024-04-18 18:15:00', // Example end time (2 hours later)
            status: 'rejected' // Example of a rejected reservation
        },
        // Add more dummy book objects as needed
    ]);

    const [selectedRow, setSelectedRow] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('reserving'); // Default selected option
    const [activeButton, setActiveButton] = useState('reserving');
    const { register, handleSubmit } = useForm();
    const [showStatus, setShowStatus] = useState(selectedOption === 'reserving');
    const [approveAlert, setApproveAlert] = useState(false);
    const [rejectAlert, setRejectAlert] = useState(false);
    const [selectAlert, setSelectAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor:"#242732",
            color: theme.palette.common.white,
            textAlign: 'center',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            textAlign: 'center',
        },
    }));

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setActiveButton(option); // Update activeButton state

        // Show/hide additional buttons based on the selected option
        setShowStatus(option === 'reserving');
    };

    const handleAlertWithTimeout = (alertState, setAlertState, message) => {
        setAlertMessage(message); // Set the alert message
        setAlertState({ ...alertState, open: true });
        setTimeout(() => {
            setAlertMessage(''); // Set the alert message
            setAlertState({ ...alertState, open: false });
        }, 5000); // Adjust the time (in milliseconds) as needed
    };

    const handleApproveClick = () =>{
        if (selectedRow !== null){
            setSelectAlert({open: false, message: ''});
            setApproveAlert({open: true});
            handleAlertWithTimeout(approveAlert, setApproveAlert, 'The request is approved.');
            setSelectedRow(null);
        }else{
            setApproveAlert({open: false, message: ''});
            setSelectAlert({open: true});
            handleAlertWithTimeout(selectAlert, setSelectAlert, 'Please select a row before proceed any action.');
        }
    }

    const handleRejectClick = () =>{
        if (selectedRow !== null){
            setSelectAlert({open: false, message: ''});
            setRejectAlert({open: true});
            handleAlertWithTimeout(rejectAlert, setRejectAlert, 'The request is rejected.');
            setSelectedRow(null);
        }else {
            setRejectAlert({open: false, message: ''});
            setSelectAlert({open: true});
            handleAlertWithTimeout(selectAlert, setSelectAlert, 'Please select a row before proceed any action.');
        }
    }

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

    const columnsReserving = [
        { field: 'id', headerName: 'ID', flex: 1, headerAlign: "center" },
        { field: 'studentId', headerName: 'Student ID', flex: 1, headerAlign: "center" },
        { field: 'bookCode', headerName: 'Book Code', flex: 1, headerAlign: "center" },
        { field: 'title', headerName: 'Title', flex: 1, headerAlign: "center" },
        { field: 'author', headerName: 'Author', flex: 1, headerAlign: "center" },
        { field: 'edition', headerName: 'Edition', flex: 1, headerAlign: "center" },
        { field: 'startDatetime', headerName: 'Start DateTime', flex: 1, headerAlign: "center" },
        { field: 'endDatetime', headerName: 'End DateTime', flex: 1, headerAlign: "center" },
        { field: 'status', headerName: 'Status', flex: 1, headerAlign: "center" },
    ];

    const columnsHistory = [
        { field: 'id', headerName: 'ID', flex: 1, headerAlign: "center" },
        { field: 'studentId', headerName: 'Student ID', flex: 1, headerAlign: "center" },
        { field: 'bookCode', headerName: 'Book Code', flex: 1, headerAlign: "center" },
        { field: 'title', headerName: 'Title', flex: 1, headerAlign: "center" },
        { field: 'author', headerName: 'Author', flex: 1, headerAlign: "center" },
        { field: 'edition', headerName: 'Edition', flex: 1, headerAlign: "center" },
        { field: 'startDatetime', headerName: 'Start DateTime', flex: 1, headerAlign: "center" },
        { field: 'endDatetime', headerName: 'End DateTime', flex: 1, headerAlign: "center" },
        { field: 'status', headerName: 'Status', flex: 1, headerAlign: "center" },
    ];

    const renderTable = () => {
        const columns = selectedOption === 'reserving' ? columnsReserving : columnsHistory;
        const rows = reservationBooks.filter((book) => {
            if (selectedOption === 'reserving') {
                return book.status === 'pending';
            } else {
                return book.status !== 'pending';
            }
        });
        return (
            <div style={{ height: '73vh', width: '100%' }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowHeight={40}
                    checkboxSelection
                    slots={{ toolbar: GridToolbar }}
                    onRowClick={(row) => handleRowClicked(row.row)}
                />
            </div>
        );
    };

    return (
        <Stack
            direction="column"
            spacing={0}
            className={"ReservePageContainer"}
            sx={{ height: '100vh', width: '100vw', overflow: 'auto' }} // Set full height and width
        >
            <Stack direction="row" spacing={3} className={"haederReserve"}>
                <TemporaryDrawer
                    open={drawerOpen}
                    onClose={toggleDrawer}
                />
                <h1 className={"headerTitle-reservation"}>Reserve Book Page</h1>
            </Stack>

            <Stack
                direction="column"
                className={"MainContent-Reserve"}
                sx={{ height: '90vh', width: '97vw', overflow: 'auto' }} // Set full height and width
            >
                <Box sx={{ width: '300px' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="form-containerReserve">
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
                            className="form-inputReserve"
                        />
                    </form>
                </Box>
                <Stack direction="row" spacing={3} justifyContent="space-between">
                    <Stack direction="row" spacing={0.3}>
                        <Button onClick={() => handleOptionClick('reserving')}
                                sx={activeButton === 'reserving' ? buttonStyle : {}}
                        >Reserving</Button>
                        <Button onClick={() => handleOptionClick('history')}
                                sx={activeButton === 'history' ? buttonStyle : {}}
                        >History</Button>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        {renderButtons()}
                    </Stack>
                </Stack>

                <div className={"tableContainer-Reserve"}>
                    <Stack sx={{ width: '100%' }} className={"alertBox-reserve"}>
                        <Collapse in={approveAlert.open} timeout={500} unmountOnExit>
                            <Alert
                                severity="success"
                                onClose={() => setApproveAlert({ ...approveAlert, open: false })}
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