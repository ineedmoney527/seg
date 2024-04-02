import React, { useState,useRef } from 'react';
import Box from '@mui/material/Box';
import BookCover1 from './Image/BookCover1.png';
import BookCover2 from './Image/BookCover2.png';
import BookCover3 from './Image/BookCover3.png';
import Popover from '@mui/material/Popover';
import BookFilter from './BookFilter';
import Layout from "./Layout";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import profile from './Image/ProfileBanner.png';
import UserRateBook from "./UserRateBook";
import Rating from "@mui/material/Rating";

const MyLibrary = () => {
    const [open, setOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [ratingRange, setRatingRange] = useState([1, 5]);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [yearRange, setYearRange] = useState([2000, 2022]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [value, setValue] = useState(0);
    const historyContainerRef = useRef(null); // Define historyContainerRef


    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const openFilter = Boolean(filterAnchorEl);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeYear = (event) => {
        const newValue = event.target.value;
        setYearRange(newValue);
    };

    const handleReset = () => {
        setRatingRange([1, 5]);
        setYearRange([2000, 2022]);
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(prevShowSearchBar => !prevShowSearchBar); // Toggle the visibility of the search bar
    };

    const SCROLL_AMOUNT = 100;

    const scrollNext = () => {
        const container = historyContainerRef.current;
        if (container) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            const targetScroll = Math.min(container.scrollLeft + SCROLL_AMOUNT, maxScroll);
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        const container = historyContainerRef.current;
        if (container) {
            const targetScroll = Math.max(container.scrollLeft - SCROLL_AMOUNT, 0);
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };

    const handleViewBookClick = (book) => {
        setSelectedBook(book)
    };

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const books = [
        {
            title: 'Madness: Race and Insanity in a Jim Crow Asylum',
            rating: '5',
            description: 'In the riveting narrative \'Madness\', ' +
                'journalist Antonia Hylton delves into the 93-year history of Crownsville Hospital, ' +
                'exploring race, insanity, and neglect. This poignant tale sheds light on the struggles of ' +
                'marginalized communities in accessing mental healthcare.' +
                'In the riveting narrative \'Madness\', ' +
                'journalist Antonia Hylton delves into the 93-year history of Crownsville Hospital, ' +
                'exploring race, insanity, and neglect. This poignant tale sheds light on the struggles of ' +
                'marginalized communities in accessing mental healthcare.',
            imgPath: BookCover1,
        },
        {
            title: 'Book 2',
            rating: '5',
            description: 'Description of Book 2',
            imgPath: BookCover2,
        },
        {
            title: 'Book 3',
            rating: '4',
            description: 'Description of Book 3',
            imgPath: BookCover3,
        },
        {
            title: 'Book 4',
            rating: '4',
            description: 'Description of Book 1',
            imgPath: BookCover1,
        },
        {
            title: 'Book 5',
            rating: '4',
            description: 'Description of Book 2',
            imgPath: BookCover2,
        },
        {
            title: 'Book 6',
            rating: '3',
            description: 'Description of Book 3',
            imgPath: BookCover3,
        },
        {
            title: 'Book 6',
            rating: '3',
            description: 'Description of Book 3',
            imgPath: BookCover3,
        }
    ];

    const sampleWishList =[
        {
            code:'001',
            title: 'Moby Dick',
            author: 'Herman Melville',
            publicationYear: 1851,
            reason: 'Interesting, assignment needed'
        },
        {
            code:'002',
            title: 'Nice To Meet You',
            author: 'Miss Nice',
            publicationYear: 1851,
            reason: 'very nice'
        },
        {
            code:'003',
            title: 'Happy',
            author: 'Mr Happy',
            publicationYear: 2005,
            reason: 'Make me happy'
        },
    ]

    const sampleReview=[
        {
            title:'Madness: Race and Insanity in a Jim Crow Asylum',
            imgPath:BookCover1,
            reviewRating:5,
            review:"This book is amazing! Highly recommended."
        },
        {
            title:'book2',
            imgPath:BookCover2,
            reviewRating:5,
            review:"This book is amazing! Highly recommended."
        },
        {
            title:'book3',
            imgPath:BookCover3,
            reviewRating:5,
            review:"This book is amazing! Highly recommended."
        }
    ]

    return (
        <Box>
            <Layout
                showSearchBar={showSearchBar}
                toggleSearchBar={toggleSearchBar}
                toggleDrawer={toggleDrawer}
                open={open}
            >
                <Box sx={{ width: '100%', height: '200px',  backgroundSize: 'cover',backgroundImage: `url(${profile})`, marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 'auto',marginRight:'50px',textAlign:'right' }}>
                            <Typography sx={{ fontSize: '40px',fontWeight:'bold' }}>Ke Xin Tong</Typography>
                            <Typography sx={{ fontSize: '15px' }}>kexin@soton.ac.uk</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height:'130px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    justifyContent: 'center',
                    alignItems:'center',
                }}>
                    <Box sx={{
                        width:'220px',
                        height:'60px',
                        display:'flex',
                        flexDirection:'column',
                        backgroundColor:'#183764',
                        color:'white',
                        borderRadius:'10px',
                        marginRight:'50px',
                        justifyContent:'center',
                        textAlign:'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
                        <label style={{}}>
                            Total Borrowed Book
                        </label>
                        <label style={{fontSize:'22px',fontWeight:'bold'}}>
                            10
                        </label>
                    </Box>

                    <Box sx={{
                        width:'220px',
                        height:'60px',
                        display:'flex',
                        flexDirection:'column',
                        backgroundColor:'#183764',
                        color:'white',
                        borderRadius:'10px',
                        marginRight:'50px',
                        justifyContent:'center',
                        textAlign:'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
                        <label style={{}}>
                            Current Loan
                        </label>
                        <label style={{fontWeight:'bold',fontSize:'22px'}}>
                            3
                        </label>
                    </Box>

                    <Box sx={{
                        width:'220px',
                        height:'60px',
                        display:'flex',
                        flexDirection:'column',
                        backgroundColor:'#183764',
                        color:'white',
                        borderRadius:'10px',
                        marginRight:'50px',
                        justifyContent:'center',
                        textAlign:'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
                        <label style={{}}>
                            Wishlist
                        </label>
                        <label style={{fontWeight:'bold',fontSize:'22px'}}>
                            5
                        </label>
                    </Box>

                    <Box sx={{
                        width:'220px',
                        height:'60px',
                        display:'flex',
                        flexDirection:'column',
                        backgroundColor:'#183764',
                        color:'white',
                        borderRadius:'10px',
                        marginRight:'10px',
                        justifyContent:'center',
                        textAlign:'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
                        <label style={{}}>
                            Rated Books
                        </label>
                        <label style={{fontWeight:'bold',fontSize:'22px'}}>
                            2
                        </label>
                    </Box>
                </Box>
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
                        marginTop: '30px',
                        width: '400px',
                        maxHeight: '420px',
                        borderRadius: '10px',
                        borderColor: '#102B52',
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

            <Box sx={{ width: '100%',height:'auto', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px',display:'flex',flexDirection:'column',overflow:'auto' }}>
                <Tabs value={value}
                      onChange={(event, newValue) => setValue(newValue)}
                      aria-label="My Library Tabs"
                      style={{marginRight: 'auto',marginLeft:'70px' }}>
                    <Tab label="Borrowed" />
                    <Tab label="Wishlist" />
                    <Tab label="History" />
                    <Tab label="Rated" />
                </Tabs>
                <Box role="tabpanel" hidden={value !== 0}>
                    {/* Render borrowed books here */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {books.map((book, index) => (
                            <Box key={index} sx={{ width: '180px', height: '250px', margin: '10px', borderRadius: '1spx', overflow: 'hidden',justifyContent:'center',
                                ':hover': {
                                    backgroundColor: hoveredIndex === index ? 'lightgrey' : 'transparent',
                                } }}
                                 onMouseEnter={() => handleMouseEnter(index)}
                                 onMouseLeave={handleMouseLeave}
                            >
                                <Box sx={{ width: '200px', height: '200px',  display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <img src={book.imgPath} alt={book.title} style={{ width: '130px', height: '180px' }} />
                                </Box>
                                <Box sx={{display:'flex',justifyContent:'center',flexDirection:'row'}}>
                                    <Typography style={{ fontSize: '15px',fontWeight:'bold' }}>Due Date: </Typography>
                                    <Typography style={{ fontSize: '15px',fontWeight:'bold' }}>01/04/24</Typography>
                                </Box>
                                <Box sx={{display:'flex',justifyContent:'center',flexDirection:'row'}}>
                                    <Typography style={{ fontSize: '14px',marginRight:'10px',color:'grey' }}>Left</Typography>
                                    <Typography style={{ fontSize: '14px',color:'red',marginRight:'10px' }}>3</Typography>
                                    <Typography style={{ fontSize: '14px',color:'grey' }}>days</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>


                <Box role="tabpanel" hidden={value !== 1}>
                    {sampleWishList.map((book, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', marginLeft: '60px' }}>
                            <Box key={index} sx={{ width: '90%', height: 'auto', margin: '10px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#F4F4F4', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px', paddingRight: '10px' }}>
                                <Box>
                                    <Typography style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>{book.title}</Typography>
                                    <Typography style={{ fontSize: '14px', display: 'flex', marginBottom: '5px' }}>
                                        <span style={{ width: '200px' }}>Author:</span>
                                        <span>{book.author}</span>
                                    </Typography>
                                    <Typography style={{ fontSize: '14px', display: 'flex', marginBottom: '5px' }}>
                                        <span style={{ width: '200px' }}>Publication year:</span>
                                        <span>{book.publicationYear}</span>
                                    </Typography>
                                    <Typography style={{ fontSize: '14px', display: 'flex' }}>
                                        <span style={{ width: '200px' }}>Reason:</span>
                                        <span>{book.reason}</span>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>


                <Box role="tabpanel" hidden={value !== 2}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                        <Box sx={{
                            marginTop:'130px',
                            marginRight:'5px',
                        }}>
                            <button style={{
                                backgroundColor:'#2C2C2C',
                                color:'white',
                                width:'37px',
                                height:'37px',
                                border:'none',
                                borderRadius:'5px',
                                cursor:'pointer'
                            }}
                                    onClick={scrollPrev}>
                                &lt;
                            </button>
                        </Box>

                        <div ref={historyContainerRef} style={{
                            display: 'flex',
                            gap: '10px',
                            overflowX: 'auto',
                            padding: '10px',
                            scrollBehavior: 'smooth',
                            width: '90%',
                            minHeight: '300px',
                            marginBottom: '100px',
                            backgroundColor: '#F4F4F4',
                            borderRadius: '5px'
                        }}>
                            {books.map((book, index) => (
                                <Box sx={{minWidth: '220px', height: '300px', marginRight: '20px'}}>
                                    <Box key={index} sx={{
                                        minWidth: '220px',
                                        height: '230px',
                                        // backgroundColor: '#F4F4F4',
                                        marginRight: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <img src={book.imgPath} alt={book.title}
                                             style={{width: '150px', height: '200px'}}/>
                                    </Box>
                                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                        <Link to="/UserMyLibrary/UserRateBook" state={{ book: book }}>
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
                                            }}>Rate
                                            </button>
                                        </Link>
                                    </Box>
                                </Box>

                            ))}
                        </div>
                        <Box sx={{marginTop:'130px',marginLeft:'5px'}}>
                            <button
                                style={{
                                    backgroundColor:'#2C2C2C',
                                    color:'white',
                                    width:'37px',
                                    height:'37px',
                                    border:'none',
                                    borderRadius:'5px',
                                    cursor:'pointer'
                                }}
                                onClick={scrollNext}>&gt;</button>
                        </Box>
                    </Box>
                </Box>

                <Box role="tabpanel" hidden={value !== 3}>
                    {sampleReview.map((book, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', marginLeft: '60px' }}>
                            <Box key={index} sx={{ width: '90%', height: '150px', margin: '10px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#F4F4F4', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',paddingTop:'20px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '150px', height: '130px', display: 'flex', marginRight: '20px', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={book.imgPath} alt={"review-book-cover"} style={{ width: '90px', height: '120px' }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                                            <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>Book Title:</Typography>
                                            <Typography style={{ fontSize: '14px' }}>{book.title}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                                            <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>Rating:</Typography>
                                            <Rating name="read-only" value={parseFloat(book.reviewRating)} readOnly precision={0.5} />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>Comment:</Typography>
                                            <Typography style={{ fontSize: '14px' }}>{book.review}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

            </Box>
            {selectedBook && <UserRateBook book={selectedBook} />}
        </Box>

    );
};

export default MyLibrary;
