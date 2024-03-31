import React from 'react';
import {useState} from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { styled, tableCellClasses, Stack,Button,Box, Collapse, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { FaCartPlus } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';

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

const subButtonStyle = {
    bgcolor: '#fff',
    color: '#183764',
    padding: '5px',
    '&:hover': {
        bgcolor: '#32496B', // Adjust hover background color
        color: '#fff', // Adjust hover text color
    },
};

const headCells = [
    { id: 'bookCode', numeric: false, disablePadding: true, label: 'Book Code' },
    { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
    { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
    { id: 'edition', numeric: false, disablePadding: false, label: 'Edition' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];


function BookTable(props) {
    const { booksData, onAddToCart, cartArray } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('bookCode');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedRow, setSelectedRow] = useState(null);
    const [bookAvaAlert, setBookAvaAlert] = useState(false);
    const [bookAddAlert, setBookAddAlert] = useState(false);

    const handleRowClick = (book) => {
        setSelectedRow(book);
    };

    const handleAlertWithTimeout = (alertState, setAlertState) => {
        setAlertState({ ...alertState, open: true });
        setTimeout(() => {
            setAlertState({ ...alertState, open: false });
        }, 5000); // Adjust the time (in milliseconds) as needed
    };

    const handleAddToCartClick = () => {
        const isBookInCart = cartArray.some((cartItem) => cartItem.id === selectedRow.id);
        if (!isBookInCart) {
            if (selectedRow && selectedRow.status === 'available') {
                onAddToCart(selectedRow);
                setBookAvaAlert({open: false, message: ''});
                handleAlertWithTimeout(bookAddAlert, setBookAddAlert);
                setBookAddAlert({open: true, message: 'This book is successfully added into cart.'});
            } else if (selectedRow && selectedRow.status !== 'available') {
                setBookAddAlert({open: false, message: ''});
                handleAlertWithTimeout(bookAvaAlert, setBookAvaAlert);
                setBookAvaAlert({open: true, message: 'This book is not available.'});
            } else {
                alert('Please select a book to add to cart.');
            }
        } else {
            setBookAddAlert({open: false, message: ''});
            handleAlertWithTimeout(bookAvaAlert, setBookAvaAlert);
            setBookAvaAlert({open: true, message: 'This book is already in the cart.'});
        }
    };

    const columns = [
        { field: 'bookCode', headerName: 'Book Code', flex: 1, headerClassName: 'bookTblHeader',headerAlign: "center" },
        { field: 'title', headerName: 'Title', flex: 1, headerClassName: 'bookTblHeader',headerAlign: "center" },
        { field: 'author', headerName: 'Author', flex: 1, headerClassName: 'bookTblHeader',headerAlign: "center" },
        { field: 'edition', headerName: 'Edition', flex: 1, headerClassName: 'bookTblHeader',headerAlign: "center" },
        { field: 'status', headerName: 'Status', flex: 1, headerClassName: 'bookTblHeader',headerAlign: "center" },
    ];


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = searchTerm
        ? booksData.filter(
            (book) =>
                book.bookCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : booksData;

    return (
        <Box sx={{ width: '100%' }} className={"rightContent-book"}>
            <Paper sx={{ width: '100%', mb: 2 }} className={"paperBook"}>
                <Stack direction="row" spacing={2} justifyContent="space-between" className={"buttons-bookTable"}>
                    <h2>Books Table</h2>
                    <TextField
                        label="Search Book"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        className={"searchbox-issues"}
                        InputProps={{
                            endAdornment: <SearchIcon />,
                        }}
                        sx={{marginBottom:'10px'}}
                    />
                    <Button
                        // onClick={handleAddToCart}
                        onClick={() => handleAddToCartClick(selectedRow)}
                        startIcon={<FaCartPlus />}
                        size="small"
                        // disabled={!selectedRow}
                        sx={subButtonStyle}
                    >
                        Add to Cart
                    </Button>
                </Stack>
                <Stack sx={{ width: '100%' }} className={"alertBox-bookTable"}>
                    <Collapse in={bookAvaAlert.open} timeout={500} unmountOnExit>
                        <Alert
                            severity="warning"
                            onClose={() => setBookAvaAlert({ ...bookAvaAlert, open: false })}
                            sx={{ borderRadius: 2 }}
                        >
                            {bookAvaAlert.message}
                        </Alert>
                    </Collapse>
                    <Collapse in={bookAddAlert.open} timeout={500} unmountOnExit>
                        <Alert
                            severity="success"
                            onClose={() => setBookAddAlert({ ...bookAddAlert, open: false })}
                            sx={{ borderRadius: 2 }}
                        >
                            {bookAddAlert.message}
                        </Alert>
                    </Collapse>
                </Stack>
                <Grid item xs={12}>
                    <Box sx={{ height: 400, width: '750px' }}>
                        <StyledDataGrid
                            rows={filteredData}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            checkboxSelection
                            slots={{ toolbar: GridToolbar }}
                            onSelectionModelChange={(selection) => {
                                setSelectedRow(filteredData.find((row) => row.id === selection.selectionModel[0]));
                            }}
                        />
                    </Box>
                </Grid>
            </Paper>
        </Box>
    );
}

BookTable.propTypes = {
    booksData: PropTypes.array.isRequired,
};

export default BookTable;
