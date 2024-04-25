import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { set } from "date-fns";
import axios from "axios";

const BookFilter = ({
  ratingRange,
  handleChange,
  yearRange,
  handleChangeYear,
  genreRange,
  handleChangeGenre,
  handleReset,
}) => {
  const [genres, setGenres] = useState([]);
  const [genreNames, setGenreNames] = useState([]);

  const [localRatingRange, setLocalRatingRange] = useState([0, 5]); // State to manage the rating range
  const [localYearRange, setLocalYearRange] = useState([2000, 2024]); // State to manage the year range
  const [genreCheckboxes, setGenreCheckboxes] = useState([]); // State to manage genre checkboxes

  // const genres = [
  //   "Fiction",
  //   "Narrative",
  //   "Novel",
  //   "Programming",
  //   "Finance",
  //   "Math",
  //   "Discrete Math",
  //   "History",
  //   "Account",
  // ];

  // const [checkboxes, setCheckboxes] = useState([
  //   { label: "Engineering", checked: false },
  //   { label: "Business", checked: false },
  //   { label: "Computer Science", checked: false },
  // ]);

  // const [genreCheckboxes, setGenreCheckboxes] = useState(
  //   Array.from({ length: 9 }, () => false)
  // );

  // useEffect(() => {
  //   const fetchGenres = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:5000/api/bookinfo/genre/book"
  //       );

  //       setGenres(response.data);
  //       console.log("FIlter");
  //       console.log("Genres:", response.data);
  //       console.log("EHAT ");
  //       console.log(genres[0]);
  //       const genreNames = genres.map((genre) => genre.name);
  //       setGenreNames(genreNames);
  //       console.log("Genre Names:", genreNames);
  //       setGenreCheckboxes(
  //         Array.from({ length: response.data.length }, () => false)
  //       );
  //     } catch (error) {
  //       console.error("Error fetching genres:", error);
  //     }
  //   };

  //   fetchGenres();
  // }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookinfo/genre/book"
        );

        setGenres(response.data);
        console.log("FIlter");
        console.log("Genres:", response.data);

        const genreNames = response.data.map((genre) => genre.name);
        setGenreNames(genreNames);
        console.log("Genre Names:", genreNames);

        setGenreCheckboxes(
          Array.from({ length: response.data.length }, () => false)
        );
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const resetCheckboxes = () => {
    // setCheckboxes(
    //   checkboxes.map((checkbox) => ({ ...checkbox, checked: false }))
    // );
    setGenreCheckboxes(Array.from({ length: 9 }, () => false)); // Reset genre checkboxes
  };

  // const handleCheckboxChange = (index) => {
  //   setCheckboxes((prevState) => {
  //     const updatedCheckboxes = [...prevState];
  //     updatedCheckboxes[index] = {
  //       ...updatedCheckboxes[index],
  //       checked: !updatedCheckboxes[index].checked,
  //     };
  //     return updatedCheckboxes;
  //   });
  // };

  const handleGenreCheckboxChange = (index) => {
    setGenreCheckboxes((prevState) => {
      const updatedCheckboxes = [...prevState];
      updatedCheckboxes[index] = !updatedCheckboxes[index];
      return updatedCheckboxes;
    });
  };

  // const handleGenreCheckboxChange = (index) => {
  //   const updatedGenreCheckboxes = [...genreCheckboxes];
  //   updatedGenreCheckboxes[index] = !updatedGenreCheckboxes[index];
  //   setGenreCheckboxes(updatedGenreCheckboxes);
  // };

  // Function to handle changes in the rating range
  const handleRatingChange = (event, newValue) => {
    setLocalRatingRange(newValue); // Update local state
    // handleChange(event, newValue); // Call parent function to update global state
  };

  const handleYearChange = (event) => {
    const newValue = event.target.value;
    setLocalYearRange(newValue);
    // handleChangeYear(event);
  };

  const handleApplyFilter = () => {
    // Pass filter parameters to parent component
    console.log("Rating Range:", ratingRange);
    console.log("Year", yearRange);
    const selectedGenres = genres.filter(
      (genre, index) => genreCheckboxes[index]
    );
    console.log("BOOK FILTER");
    console.log("Selected Genres:", selectedGenres);

    handleChange(null, localRatingRange);
    handleChangeYear(null, localYearRange);
    handleChangeGenre(selectedGenres);
  };

  return (
    <Box p={2}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography variant="body1">Filter Options:</Typography>
        <button
          onClick={() => {
            handleReset();
            resetCheckboxes();
          }}
          style={{
            display: "flex",
            width: "100px",
            height: "25px",
            borderRadius: "20px",
            backgroundColor: "#102B52",
            color: "white",
            border: "none",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </Box>
      {/* <label style={{ fontWeight: "bold" }}>Courses</label>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: "10px",
          fontSize: "15px",
        }}
      >
        {checkboxes.slice(0, 3).map((checkbox, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: "5px",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id={checkbox.label}
              checked={checkbox.checked}
              onChange={() => handleCheckboxChange(index)}
            />
            <label
              htmlFor={checkbox.label}
              style={{ marginLeft: "5px", width: "150px" }}
            >
              {checkbox.label}
            </label>
          </Box>
        ))}
      </Box> */}

      <label style={{ fontWeight: "bold" }}>Genre:</label>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: "10px",
          fontSize: "15px",
        }}
      >
        {genreNames.map((genre, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: "35px",
              marginBottom: "5px",
              width: "150px",
            }}
          >
            <input
              type="checkbox"
              id={`${genre.replace(/\s+/g, "")}${index}`}
              checked={genreCheckboxes[index]}
              onChange={() => handleGenreCheckboxChange(index)}
            />
            <label
              htmlFor={`${genre.replace(/\s+/g, "")}${index}`}
              style={{ marginLeft: "5px", width: "150px" }}
            >
              {genre}
            </label>
          </Box>
        ))}
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: "10px",
          fontSize: "15px",
        }}
      >
        {[0, 3, 6].map((start, row) => (
          <Box
            key={row}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {genres.slice(start, start + 3).map((genre, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "35px",
                  marginBottom: "5px",
                  width: "80px",
                }}
              >
                <input
                  type="checkbox"
                  id={`${genre.replace(/\s+/g, "")}${row}`}
                  checked={genreCheckboxes[start + index]}
                  onChange={() => handleGenreCheckboxChange(index)}
                />
                <label
                  htmlFor={`${genre.replace(/\s+/g, "")}${index}`}
                  style={{ marginLeft: "2px", width: "80px" }}
                >
                  {genre}
                </label>
              </Box>
            ))}
          </Box>
        ))}
      </Box> */}

      <Typography
        style={{ fontWeight: "bold" }}
        id="rating-range-slider"
        gutterBottom
      >
        Rating Range
      </Typography>
      <Box
        sx={{
          width: "300px",
          marginTop: "10px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Slider
          getAriaLabel={() => "Rating range"}
          value={localRatingRange}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          aria-labelledby="rating-range-slider"
          min={0}
          max={5}
          style={{ display: "flex", justifyContent: "center" }}
        />
      </Box>

      <label style={{ fontWeight: "bold" }}>Publisher Year</label>
      <Box
        sx={{
          width: "300px",
          marginTop: "10px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* <Select
          value={localYearRange}
          onChange={handleYearChange}
          displayEmpty
          inputProps={{ "aria-label": "Publisher Year Range" }}
          style={{ width: "100%", height: "25px" }}
        >
          {[...Array(24)].map((_, index) => (
            <MenuItem key={index} value={2000 + index}>
              {2000 + index}
            </MenuItem>
          ))}
        </Select> */}

        <Slider
          getAriaLabel={() => "Publisher Year Range"}
          value={localYearRange}
          onChange={handleYearChange}
          valueLabelDisplay="auto"
          aria-labelledby="publisher-year-range-slider"
          min={2000}
          max={2023}
          style={{ display: "flex", justifyContent: "center" }}
        />
      </Box>

      <button
        onClick={() => {
          handleApplyFilter();
        }}
        style={{
          display: "flex",
          width: "100px",
          height: "25px",
          borderRadius: "20px",
          backgroundColor: "#102B52",
          color: "white",
          border: "none",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Apply
      </button>
    </Box>
  );
};

export default BookFilter;
