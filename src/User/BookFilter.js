import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const BookFilter = ({ ratingRange, handleChange, yearRange, handleChangeYear,handleReset }) => {
    const [checkboxes, setCheckboxes] = useState([
        { label: 'Engineering', checked: false },
        { label: 'Business', checked: false },
        { label: 'Computer Science', checked: false },
    ]);

    const [genreCheckboxes, setGenreCheckboxes] = useState(Array.from({ length: 9 }, () => false));

    const resetCheckboxes = () => {
        setCheckboxes(checkboxes.map(checkbox => ({ ...checkbox, checked: false })));
        setGenreCheckboxes(Array.from({ length: 9 }, () => false)); // Reset genre checkboxes
    };

    const handleCheckboxChange = (index) => {
        setCheckboxes(prevState => {
            const updatedCheckboxes = [...prevState];
            updatedCheckboxes[index] = { ...updatedCheckboxes[index], checked: !updatedCheckboxes[index].checked };
            return updatedCheckboxes;
        });
    };

    const handleGenreCheckboxChange = (index) => {
        setGenreCheckboxes(prevState => {
            const updatedCheckboxes = [...prevState];
            updatedCheckboxes[index] = !updatedCheckboxes[index];
            return updatedCheckboxes;
        });
    };

    return (
            <Box p={2}>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <Typography variant="body1">Filter Options:</Typography>
                    <button onClick={() => {
                        handleReset();
                        resetCheckboxes();
                    }} style={{
                        display: 'flex',
                        width: '100px',
                        height: '25px',
                        borderRadius: '20px',
                        backgroundColor: '#102B52',
                        color: 'white',
                        border: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 'auto',
                        cursor:'pointer'
                    }}>Reset
                    </button>
                </Box>
                <label style={{fontWeight: 'bold'}}>Courses</label>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: '10px',
                    fontSize: '15px'
                }}>
                    {checkboxes.slice(0, 3).map((checkbox, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginRight: '5px', marginBottom: '10px' }}>
                            <input type="checkbox" id={checkbox.label} checked={checkbox.checked}
                                   onChange={() => handleCheckboxChange(index)} />
                            <label htmlFor={checkbox.label} style={{ marginLeft: '5px', width: '150px' }}>{checkbox.label}</label>
                        </Box>
                    ))}
            </Box>

            <label style={{ fontWeight: 'bold' }}>Genre:</label>

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '10px', fontSize: '15px' }}>
                {[0, 3, 6].map((start, row) => (
                    <Box key={row} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {["Fiction", "Narrative", "Novel", "Programming", "Finance", "Math", "Discrete Math", "History", "Account"].slice(start, start + 3).map((genre, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginRight: '35px', marginBottom: '5px', width: '80px' }}>
                                <input type="checkbox" id={`${genre.replace(/\s+/g, '')}${row}`} checked={genreCheckboxes[start + index]}
                                       onChange={() => handleGenreCheckboxChange(start + index)} />
                                <label htmlFor={`${genre.replace(/\s+/g, '')}${row}`} style={{ marginLeft: '2px', width: '80px' }}>{genre}</label>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>


            <Typography style={{fontWeight:'bold'}} id="rating-range-slider" gutterBottom>
                Rating Range
            </Typography>
            <Box sx={{ width: '300px', marginTop: '10px',marginLeft:'auto',marginRight:'auto'}}>
                <Slider
                    getAriaLabel={() => 'Rating range'}
                    value={ratingRange}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="rating-range-slider"
                    min={1}
                    max={5}
                    style={{display:'flex',justifyContent:'center'}}
                />
            </Box>


            <label style={{fontWeight:'bold'}}>Publisher Year</label>
            <Box sx={{ width: '200px',marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Select
                    value={yearRange}
                    onChange={handleChangeYear}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Publisher Year Range' }}
                    style={{ width: '100%',height:'25px' }}
                >
                    {[...Array(24)].map((_, index) => (
                        <MenuItem key={index} value={2000 + index}>
                            {2000 + index}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <button style={{
                display:'flex',
                width:'100px',
                height:'25px',
                borderRadius:'20px',
                backgroundColor:'#102B52',
                color:'white',
                border:'none',
                alignItems:'center',
                justifyContent:'center',
                marginTop:'20px',
                marginLeft:'auto',
                marginRight:'auto'}}>
                Apply
            </button>

        </Box>
    );
};

export default BookFilter;
