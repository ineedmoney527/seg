import * as React from "react";
import PropTypes from "prop-types";
import "./IssuesBook.css";
import {
  styled,
  tableCellClasses,
  TextField,
  Paper,
  Stack,
  Box,
  TablePagination,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

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

const columns = [
  { field: "id", headerName: "ID", flex: 1, headerAlign: "center" },
  { field: "name", headerName: "Name", flex: 1.5, headerAlign: "center" },
  { field: "email", headerName: "Email", flex: 2, headerAlign: "center" },
  {
    field: "borrow_limit",
    headerName: "Limit Left",
    type: "number",
    flex: 1,
    headerAlign: "center",
  },
];

function StudentTable(props) {
  const { studentsData, onSelectStudent } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("studentId");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangePage = (params) => {
    setPage(params.page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return studentsData;
    return studentsData.filter(
      (student) =>
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [studentsData, searchTerm]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - studentsData.length) : 0;

  const sortedData = React.useMemo(() => {
    if (orderBy && order && studentsData) {
      return studentsData.slice().sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      });
    }
    return studentsData;
  }, [studentsData, order, orderBy]);

  if (!studentsData) {
    // Handle the case when studentsData is undefined
    return <div>No student data available</div>;
  }

  // const handleRowClicked = (row) => {
  //     if (selectedRow && selectedRow.id === row.id) {
  //         setSelectedRow(null); // Deselect the row if it's already selected
  //     } else {
  //         setSelectedRow(row); // Select the clicked row
  //     }
  // };
  const handleRowClick = (row) => {
    if (selectedRow && selectedRow.id === row.id) {
      setSelectedRow(null); // Deselect the row if it's already selected
      onSelectStudent(null, null, null);
    } else {
      setSelectedRow(row); // Select the clicked row
      onSelectStudent(row.id, row.name, row.borrow_limit);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ width: "100%", height: "400px" }} className={"boxStudent"}>
      <Paper sx={{ width: "100%", mb: 2 }} className={"paperStudent"}>
        <Stack direction="row" spacing={10} className={"studentHeader"}>
          <h2>User Table</h2>
          {/* <TextField
            label={"Search Student / Lecturer"}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            className={"searchbox-issues"}
            InputProps={{
              endAdornment: <SearchIcon />, // Include Search Icon
            }}
            sx={{ marginBottom: "10px" }}
          /> */}
        </Stack>

        <div style={{ height: 400, width: "750px" }}>
          <StyledDataGrid
            rows={filteredData}
            columns={columns}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            page={page}
            pagination
            slots={{ toolbar: GridToolbar }}
            onPageChange={handleChangePage}
            rowCount={studentsData.length}
            paginationMode="server"
            onPageSizeChange={handleChangeRowsPerPage}
            checkboxSelection={false}
            onRowClick={(row) => handleRowClick(row.row)}
            selectedRow={selectedRow}
            // onSelectionModelChange={(ids) => {
            //   const selectedStudent = studentsData.find(
            //     (student) => student.id === ids[0]
            //   );

            //   );
            // }}
          />
        </div>
      </Paper>
    </Box>
  );
}

StudentTable.propTypes = {
  studentsData: PropTypes.array.isRequired,
  onSelectStudent: PropTypes.func.isRequired,
};

export default StudentTable;
