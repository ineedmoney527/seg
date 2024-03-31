import React, {useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BookCover1 from './Image/BookCover1.png';
import BookCover2 from './Image/BookCover2.png';
import BookCover3 from './Image/BookCover3.png';
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Rating from '@mui/material/Rating';
import Popover from '@mui/material/Popover';
import { Link } from 'react-router-dom';
import BookFilter from './BookFilter';
import ViewBook from "./ViewBook";
import Layout from "./Layout";

const BookList = () => {
    const [open, setOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [ratingRange, setRatingRange] = useState([1, 5]);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null); // State to manage filter popover anchor element
    const [yearRange, setYearRange] = useState([2000, 2022]);
    const [selectedBook, setSelectedBook] = useState(null);


    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget); // Set anchor element for filter popover
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null); // Close filter popover
    };

    const openFilter = Boolean(filterAnchorEl);

    const handleChange = (event, newValue) => {
        setRatingRange(newValue); // Update rating range state
    };

    const handleChangeYear = (event) => {
        const newValue = event.target.value;
        setYearRange(newValue); // Update year range state
    };

    const handleReset = () => {
        setRatingRange([1, 5]);
        setYearRange([2000, 2022]);
    };

    const handleViewBookClick = (book) => {
        setSelectedBook(book)
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(prevShowSearchBar => !prevShowSearchBar); // Toggle the visibility of the search bar
    };

    const books = [
        {
            title: 'Madness: Race and Insanity in a Jim Crow Asylum',
            rating:'5',
            description: 'In the riveting narrative \'Madness\', ' +
                'journalist Antonia Hylton delves into the 93-year history of Crownsville Hospital, ' +
                'exploring race, insanity, and neglect. This poignant tale sheds light on the struggles of ' +
                'marginalized communities in accessing mental healthcare.'+
                'In the riveting narrative \'Madness\', ' +
                'journalist Antonia Hylton delves into the 93-year history of Crownsville Hospital, ' +
                'exploring race, insanity, and neglect. This poignant tale sheds light on the struggles of ' +
                'marginalized communities in accessing mental healthcare.',
            imgPath: BookCover1,
        },
        {
            title: 'Book 2',
            rating:'5',
            description: 'Description of Book 2',
            imgPath: BookCover2,
        },
        {
            title: 'Book 3',
            rating:'4',
            description: 'Description of Book 3',
            imgPath: BookCover3,
        },
        {
            title: 'Book 4',
            rating:'4',
            description: 'Description of Book 1',
            imgPath: BookCover1,
        },
        {
            title: 'Book 5',
            rating:'4',
            description: 'Description of Book 2',
            imgPath: BookCover2,
        },
        {
            title: 'Book 6',
            rating:'3',
            description: 'Description of Book 3',
            imgPath: BookCover3,
        }
    ];


    return (
        <Box sx={{backgroundColor:'#EFEEEE'}}>
            <Layout
                showSearchBar={showSearchBar}
                toggleSearchBar={toggleSearchBar}
                toggleDrawer={toggleDrawer}
                open={open}
            >
            {!selectedBook && (
            <Box sx={{
                display:'flex',
                flexDirection:'row'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent:'center',
                    alignItems: 'center',
                    width:'250px',
                    borderRadius:'20px',
                    backgroundColor:'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    marginRight:'auto',
                    marginLeft:'70px',
                    marginTop:'20px'
                }}>
                    <SearchIcon/>
                    <InputBase
                        placeholder="Find Your Books…"
                        inputProps={{ 'aria-label': 'search' }}
                        sx={{ ml: 1,borderRadius:'20px',color:'dark grey',fontSize:'14px' }}
                    />
                </Box>

                <Box>
                    <button onClick={handleFilterClick} style={{
                        display: 'flex',
                        justifyContent:'center',
                        alignItems: 'center',
                        width:'150px',
                        height:'30px',
                        borderRadius:'20px',
                        border:"none",
                        backgroundColor:'white',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        marginLeft:'auto',
                        marginRight:'70px',
                        marginTop:'20px',
                        cursor:'pointer',
                        fontSize:'14px'
                    }}>Filter</button>
                </Box>
            </Box>
            )}
            </Layout>


            <Popover
                open={openFilter}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        marginTop:'30px',
                        width: '400px',
                        maxHeight: '420px',
                        borderRadius:'10px',
                        borderColor:'#102B52',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        overflowY: 'auto',
                    },
                }}
            >
                <BookFilter
                    ratingRange={ratingRange}
                    handleChange={handleChange}
                    yearRange={yearRange}
                    handleChangeYear={handleChangeYear}
                    handleReset={handleReset}
                />
            </Popover>
            <Box>
                {!selectedBook && (
                <List>
                    {books.map((book, index) => (
                        <ListItem key={index}>
                            <Box sx={{
                                display:'flex',
                                width:'90%',
                                height:'auto',
                                backgroundColor:'white',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                                marginTop:'auto',
                                marginBottom:'auto',
                                marginLeft:'auto',
                                marginRight:'auto',
                                borderRadius:'10px',
                                alignItems: 'center',
                                padding: '10px',
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <img src={book.imgPath} alt={book.title} style={{marginLeft:'10px',marginRight: '25px', width: '80px', height: '110px', borderRadius: '10px',marginBottom:'auto',marginTop:'auto' }} />
                                    <Box>
                                        <Typography variant="h6" component="div" sx={{ width:'auto',fontWeight: 'bold', fontSize: '16px' }}>{book.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', marginRight: '5px' }}>Rating:</Typography>
                                            <Rating name="read-only" value={parseFloat(book.rating)} readOnly precision={0.5}/>
                                        </Box>
                                        <Typography sx={{fontSize:'15px',color:'#626262'}} variant="body1" gutterBottom>
                                            {book.description}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{marginLeft:'auto'}}>
                                    <Link to="/ViewBook" state={{ book: book }}>
                                        <button onClick={() => handleViewBookClick(book)} style={{
                                            width: '70px',
                                            height: '25px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                                            fontSize: '13px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            marginLeft: '20px'
                                        }}>View
                                        </button>
                                    </Link>
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
                )}
                {selectedBook && <ViewBook book={selectedBook} />}
            </Box>
        </Box>

    );
};

export default BookList;
