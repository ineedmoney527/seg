//need to install 'npm install react-swipeable-views-utils'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './UserMainPage.css';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import BookCover1 from './Image/BookCover1.png';
import BookCover2 from './Image/BookCover2.png';
import BookCover3 from './Image/BookCover3.png';
import BookCover4 from './Image/BookCover4.png';
import librarian from './Image/librarian.png';
import {Link, useNavigate} from 'react-router-dom';
import BookList from './BookList';
import Layout from "./Layout";
import ViewBook from "./ViewBook";
import ListItem from "@mui/material/ListItem";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {
        label: 'Madness: Race and Insanity in a Jim Crow Asylum',
        description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
            'New York Times In the tradition of' +
            'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
            'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
        imgPath: BookCover1
    },
    {
        label: 'SOUL',
        description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
            'New York Times In the tradition of' +
            'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
            'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
        imgPath: BookCover2
    },
    {
        label: 'My Book Cover',
        description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
            'New York Times In the tradition of' +
            'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
            'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
        imgPath: BookCover3
    },
    {
        label: 'Harry Potter',
        description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
            'New York Times In the tradition of' +
            'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
            'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
        imgPath: BookCover4
    },
    {
        label: 'Madness: Race and Insanity in a Jim Crow Asylum',
        description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
            'New York Times In the tradition of' +
            'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
            'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
        imgPath: BookCover1
    },
    {
        label: 'SOUL',
        description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
            'New York Times In the tradition of' +
            'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
            'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
        imgPath: BookCover2
    },
];

function SwipeableTextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((step, index) => (
                    <div key={step.label}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box sx={{
                                display:'flex',
                                flexDirection:'column',
                                justifyContent:'center',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                width:'80%',
                                height:'auto',
                                backgroundColor:'white',
                                borderRadius:'8px',
                                marginTop: 'auto',
                                marginBottom: 'auto',
                                marginLeft:'auto',
                                marginRight:'auto',
                            }}>
                                <Box sx={{
                                    width:'80%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent:'center',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                    marginBottom: '20px',
                                    marginLeft:'auto',
                                    marginRight:'auto',

                                }}>
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 'auto',
                                            width: '100%',
                                            maxHeight:"150px",
                                            maxWidth: '120px',
                                            mb: 1,
                                            display:'flex',
                                            flexDirection:'row',
                                            justifyContent:'center',
                                        }}
                                        src={step.imgPath}
                                        alt={step.label}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column',marginLeft:'20px' }}>
                                        <Typography sx={{fontWeight:'Bold',fontSize:'15px'}}>{step.label}</Typography>
                                        <Typography sx={{fontSize:'12px'}}>{step.description}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{marginLeft:'auto',marginRight:'20px'}}>
                                    <button style={{width:'100px', height:'30px',backgroundColor:'#0F2A50', borderRadius:'5px',marginBottom:'10px',border:"none",color:'white',cursor:'pointer'}}>View</button>
                                </Box>
                            </Box>
                        ) : null}
                    </div>
                ))}

            </AutoPlaySwipeableViews>
            <MobileStepper
                sx={{backgroundColor:'transparent'}}
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Box>
    );
}

export default function UserMainPage() {
    const [open, setOpen] = useState(false);
    const [showBookList, setShowBookList] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(true);
    const navigate = useNavigate();


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(prevShowSearchBar => !prevShowSearchBar);
    };

    const [selectedBook, setSelectedBook] = useState(null);

    const handleViewBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleBookListClick =()=>{
        navigate('./BookList');
        setShowBookList(true);
    }

    return (
        <Layout
            showSearchBar={showSearchBar}
            toggleSearchBar={toggleSearchBar}
            toggleDrawer={toggleDrawer}
            open={open}
        >
            {showBookList ? (
                <BookList />
            ) : (
                <Box sx={{backgroundColor:'#EFEEEE'}}>
                    <Box>
                        <Typography variant="h6" component="div" sx={{ textAlign: 'center',fontWeight:'bold' }} >
                            Recommended Books
                        </Typography>
                    </Box>
                    <SwipeableTextMobileStepper />
                    <Box sx={{display:'flex', flexDirection:'row',height:'auto',width:'auto',marginLeft:'auto',marginRight:'auto',justifyContent:'center'}}>
                        <Box sx={{ backgroundColor: 'white', padding: '20px', marginTop: '20px', borderRadius: '5px',width:'400px',height:'200px',marginBottom:'50px' }}>
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px',fontSize:'18px' }}>
                                Today,26/03/24
                            </Typography>
                            <Box>
                                <Box sx={{marginBottom:'10px'}}>
                                    <label>Central Library</label>
                                </Box>
                                <Box sx={{marginBottom:'10px'}}>
                                    <label>Operation: OPEN</label>
                                </Box>
                                <Box sx={{marginBottom:'10px'}}>
                                    <label>Operating Hours: 09:00a.m. - 6:00p.m.</label>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: 'white', padding: '20px', marginTop: '20px',marginLeft:'100px', borderRadius: '5px',width:'400px',height:'200px' }}>
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px',fontSize:'18px' }}>
                                Librarian On-Duty
                            </Typography>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:"center"}}>
                                <Box>
                                    <img src={librarian} alt={"librarian-icon"}/>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'column',marginLeft:'20px'}}>
                                    <label>Ms Afiqah</label>
                                    <label>afiqah@soton.ac.uk</label>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{display:'flex',flexDirection:'row', justifyContent: 'center',width:'90%',marginLeft:'auto',marginRight:'auto'}}>
                        <Box sx={{marginRight:'auto'}}>
                            <label
                                style={{fontSize: '20px', fontWeight: 'bold'}}>
                                All Books
                            </label>
                        </Box>
                        <Box >
                            <button style={{
                                width:'100px',
                                height:'25px',
                                backgroundColor:'#0F2A50',
                                color:'white',
                                borderRadius:'5px',
                                border:'none',
                                cursor:'pointer',
                                marginRight:'20px'
                            }} onClick={handleBookListClick} >See All</button>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', width: '90%',flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto',height:'800px',marginBottom:'30px',overflow:'auto'}}>
                        {images.map((book, index) => (
                            index % 5 === 0 && (
                                <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    {images.slice(index, index + 5).map((bookInRow, idx) => (
                                        <ListItem key={index + idx} >
                                            <Box sx={{width:'180px',height:'250px',display:'flex',flexDirection:'column',backgroundColor:'white'}}>
                                                <Box sx={{width:'180px',height:'180px',backgroundColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                    <Link to="/ViewBook" state={{ book: bookInRow }}>
                                                        <img
                                                            src={bookInRow.imgPath}
                                                            alt={bookInRow.label}
                                                            style={{ width: '120px', height: '150px', borderRadius: '5px', cursor: 'pointer' }}
                                                            onClick={() => handleViewBookClick(bookInRow)}
                                                        />
                                                    </Link>
                                                </Box>
                                                <Box sx={{width:'180px',height:'70px',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                                                    <Typography style={{ fontSize: '14px', textAlign: 'center' }}>{bookInRow.label}</Typography>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </Box>
                            )
                        ))}
                        {selectedBook && <ViewBook book={selectedBook} />}
                    </Box>
                </Box>
            )}
            {selectedBook && <ViewBook book={selectedBook} />}
        </Layout>
    );
}
