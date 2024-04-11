import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
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
        text: `Genres of Books in the Library`,

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
      {!isLoading && genreData && genreData.length > 0 && (
        <Pie data={data} options={options} />
      )}
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
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      {!isLoading && genreData.length > 0 && (
        <Pie data={data} options={options} />
      )}
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
  return (
    <div>
      <div>
        <Piechart />
      </div>

      <div>
        ------------------------------------我是分割线--------------------------
      </div>
      <div>
        <BorrowedPieChart />
      </div>
      <div>
        <Histograms></Histograms>
      </div>
    </div>
  );
}
export default Dashboard;
{
  /* <div>
<label htmlFor="startDate">Start Date:</label>
<DatePicker
  id="startDate"
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  dateFormat="yyyy-MM-dd"
/>
</div>
<div>
<label htmlFor="endDate">End Date:</label>
<DatePicker
  id="endDate"
  selected={endDate}
  onChange={(date) => setEndDate(date)}
  dateFormat="yyyy-MM-dd"
/>
</div> */
}
