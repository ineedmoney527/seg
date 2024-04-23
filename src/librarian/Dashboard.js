import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./Dashboard.css";
import Logo from "../UOSMLogo3.png";

import {
  Box,
  Grid,
  Typography,
  IconButton,
  Collapse,
  Alert,
  Stack,
} from "@mui/material";
import TemporaryDrawer from "./TemporaryDrawer";

const Piechart = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [genreData, setGenreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const data = {
    labels: genreData.map((item) => item.name),
    datasets: [
      {
        label: "Book Genress",
        data: genreData.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Genres of Books in the Library",

        font: {
          size: 20,
        },
      },
    },
  };
  const fetchPieData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/history/pie");
      setGenreData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPieData();
  }, []);

  return (
    <div>
      <Stack
        sx={{
          width: "90vw",
          height: "90vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : genreData && genreData.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Typography>No Data Shown during this period</Typography>
        )}
      </Stack>
    </div>
  );
};

const BorrowedPieChart = () => {
  const [startDate, setStartDate] = useState("2024-04-05");
  const [endDate, setEndDate] = useState(new Date());
  const [genreData, setGenreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const fetchPieData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/history/borrowpie",
        {
          params: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
        }
      );
      setGenreData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPieData();
    console.log(formatDate(startDate));
    console.log(formatDate(endDate));
  }, [startDate, endDate]); // Fetch data when start or end date changes

  const data = {
    labels:
      genreData && genreData.length > 0
        ? genreData.map((item) => item.name)
        : [],
    datasets: [
      {
        label: "Book Genres",
        data:
          genreData && genreData.length > 0
            ? genreData.map((item) => item.count)
            : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: `Genres of Books Borrowed from ${formatDate(
          startDate
        )} to ${formatDate(endDate)}`,
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div>
      <Stack
        sx={{
          width: "100%",
          height: "90vh",
          margin: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          direction={"row"}
          spacing={5}
          sx={{
            width: "100%",
            height: "90vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack direction={"Column"} spacing={3}>
            <label className="datelabel" htmlFor="startDate">
              Start Date:
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="datepicker-start"
            />
            <label className="datelabel" htmlFor="endDate">
              End Date:
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="datepicker-end"
            />
          </Stack>
          {!isLoading ? (
            genreData.length > 0 ? (
              <Pie data={data} options={options} />
            ) : (
              <Typography>No Data Shown during this period</Typography>
            )
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

const Histograms = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [cumulativeData, setCumulativeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly and cumulative data from your backend API
        const monthlyResponse = await axios.get(
          "http://localhost:5000/api/history/monthlyBookCount"
        );
        const cumulativeResponse = await axios.get(
          "http://localhost:5000/api/history/cumulativeBookCount"
        );

        setMonthlyData(monthlyResponse.data);
        setCumulativeData(cumulativeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const monthlyChartData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Count",
        data: monthlyData.map((item) => item.monthly_count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const cumulativeChartData = {
    labels: cumulativeData.map((item) => item.month),
    datasets: [
      {
        label: "Cumulative Count",
        data: cumulativeData.map((item) => item.cumulative_count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div>
      <div>
        <h2>Monthly Count</h2>
        <Bar data={monthlyChartData} />
      </div>
      <div>
        <h2>Cumulative Count (Last 12 Months)</h2>
        <Bar data={cumulativeChartData} />
      </div>
    </div>
  );
};

function Dashboard() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [cumulativeData, setCumulativeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly and cumulative data from your backend API
        const monthlyResponse = await axios.get(
          "http://localhost:5000/api/history/monthlyBookCount"
        );
        const cumulativeResponse = await axios.get(
          "http://localhost:5000/api/history/cumulativeBookCount"
        );

        setMonthlyData(monthlyResponse.data);
        setCumulativeData(cumulativeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const monthlyChartData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Count",
        data: monthlyData.map((item) => item.monthly_count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const cumulativeChartData = {
    labels: cumulativeData.map((item) => item.month),
    datasets: [
      {
        label: "Cumulative Count",
        data: cumulativeData.map((item) => item.cumulative_count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
  }

  const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "rgba(69, 124, 204, 1)",
      borderRadius: 2,
    },
  });

  interface StyledTabProps {
    label: string;
  }

  const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(15),
    // marginRight: theme.spacing(1),
    "&.Mui-selected": {
      color: "rgba(69, 124, 204, 1)",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  }));

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [drawerOpen, setDrawerOpen] = useState(false); // Define drawerOpen state

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <div>
      <Stack
        direction="column"
        spacing={0}
        className={"LoanPageContainer"}
        sx={{ height: "100vh", width: "100vw", overflow: "auto" }} // Set full height and width
      >
        <Stack direction="row" spacing={3} className={"haederLoan"}>
          <TemporaryDrawer open={drawerOpen} onClose={toggleDrawer} />
          <h1 className={"headerTitle-loan"}>Dashboard</h1>
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
        <Box
          sx={{
            width: "97vw",
            height: "90vh",
            marginLeft: 2,
            marginBottom: 5,
            marginRight: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ bgcolor: "#fff", borderRadius: 3 }}>
            <StyledTabs
              value={value}
              onChange={handleChange}
              aria-label="styled tabs example"
            >
              <StyledTab label="Genre of Books" />
              <StyledTab label="Genre of Books by Date" />
              <StyledTab label="Monthly Count" />
              <StyledTab label="Whole Year Count" />
            </StyledTabs>
            <Box sx={{ p: 3 }}>
              {value === 0 && <Piechart />}
              {value === 1 && <BorrowedPieChart />}
              {value === 2 && <Bar data={monthlyChartData} />}
              {value === 3 && <Bar data={cumulativeChartData} />}

              {/* {value === 2 && <ChartComponent />} */}
            </Box>
          </Box>
        </Box>
      </Stack>
    </div>
  );
}
export default Dashboard;
{
}
