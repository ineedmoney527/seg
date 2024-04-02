//need to install 'npm install react-swipeable-views-utils'
import React, { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    label: 'Madness: Race and Insanity in a Jim Crow Asylum',
    author:'James, Liew',
    description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
        'New York Times In the tradition of' +
        'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
        'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
    imgPath: BookCover1
  },
  {
    label: 'SOUL',
    author:'Ke Xin, Tong',
    description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
        'New York Times In the tradition of' +
        'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
        'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
    imgPath: BookCover2
  },
  {
    label: 'My Book Cover',
    author:'Xin Win, Lim',
    description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
        'New York Times In the tradition of' +
        'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
        'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
    imgPath: BookCover3
  },
  {
    label: 'Harry Potter',
    author:'J.K Rowling',
    description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
        'New York Times In the tradition of' +
        'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
        'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
    imgPath: BookCover4
  },
  {
    label: 'Madness: Race and Insanity in a Jim Crow Asylum',
    author:'Hui Shien, Ong',
    description:'Madness, though ostensibly the story of Crownsville, is really about the continued lack of understanding, treatment and care of the mental health of a people, Black people, who need it most\'' +
        'New York Times In the tradition of' +
        'The Immortal Life of Henrietta Lacks, a page-turning 93-year history of Crownsville Hospital, one of the United States\' last segregated asylums.On a cold day in March of 1911, officials marched twelve Black men into the heart of a forest in Maryland. Under the supervision of a doctor, the men were forced to clear the land, pour cement, lay bricks and harvest tobacco. When construction finished, they became the first twelve patients of the state\'s Hospital for the Negro Insane.In' +
        'Madness, Peabody and Emmy award-winning journalist Antonia Hylton tells the 93-year-old history of Crownsville Hospital.',
    imgPath: BookCover1
  },
  {
    label: 'SOUL',
    author:'Ke Xin, Tong',
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

  const handleStepChange = (step) => {
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
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                      width:'80%',
                      height:'auto',
                      backgroundColor:'white',
                      borderRadius:'8px',
                      marginTop: '20px',
                      marginBottom: '20px',
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

                      <Box sx={{marginLeft:'auto',marginRight:'20px',marginBottom:'20px'}}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{backgroundColor:'#0F2A50',width:'100px',height:'30px',fontSize:'12px'}}
                            startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
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
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);


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

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

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
            <Box sx={{}}>
              <Box>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center',fontWeight:'bold' }} >
                  Recommended Books
                </Typography>
              </Box>
              <SwipeableTextMobileStepper />
              <Box sx={{display:'flex', flexDirection:'row',height:'auto',width:'auto',marginLeft:'auto',marginRight:'auto',justifyContent:'center',marginBottom:'50px'}}>
                <Box sx={{ backgroundColor: 'white', padding: '20px', marginTop: '20px', borderRadius: '5px',width:'33%',minHeight:'80px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                  <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px',fontSize:'18px' }}>
                    Today, {currentDate.toLocaleDateString()}
                  </Typography>
                  <Box>
                    <Box sx={{marginBottom:'10px',fontSize:'18px'}}>
                      <label>Central Library</label>
                    </Box>
                    <Box sx={{marginBottom:'10px',fontSize:'14px'}}>
                      <label>Operation: OPEN</label>
                    </Box>
                    <Box sx={{marginBottom:'10px',fontSize:'14px'}}>
                      <label>Operating Hours: 09:00a.m. - 6:00p.m.</label>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ backgroundColor: 'white', padding: '20px', marginTop: '20px',marginLeft:'100px', borderRadius: '5px',width:'32%',minHeight:'80px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>

                  <Box sx={{display:'flex',flexDirection:'row'}}>
                    <Box>
                      <img src={librarian} alt={"librarian-icon"} style={{minWidth:'100px',minHeight:'100px'}}/>
                    </Box>

                    <Box sx={{display:'flex',flexDirection:'column',marginLeft:'20px'}}>
                      <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px',fontSize:'18px' }}>
                        Librarian On-Duty
                      </Typography>
                      <label>Ms Afiqah</label>
                      <label>afiqah@soton.ac.uk</label>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{display:'flex',flexDirection:'row', justifyContent: 'center',width:'85%',marginLeft:'auto',marginRight:'auto',marginBottom:'20px'}}>
                <Box sx={{marginRight:'auto'}}>
                  <label
                      style={{fontSize: '25px', fontWeight: 'bold'}}>
                    All Books
                  </label>
                </Box>
                <Box >
                  <Button
                      size="small"
                      sx={{
                        width: '110px',
                        height: '30px',
                        color: '#0F2A50',
                        fontSize:'14px',
                        '&:hover': {
                          backgroundColor: '#0F2A50',
                          color: 'white',
                        },
                      }}
                      startIcon={<ExpandMoreIcon />}
                      onClick={handleBookListClick}
                  >
                    See All
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', width: '89%', flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto', height: '500px', overflow: 'auto',backgroundColor:'#EFEEEE',marginBottom:'50px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'}}>
                {images.map((book, index) => (
                    index % 5 === 0 && (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'row',paddingTop:'20px' }}>
                          {images.slice(index, index + 5).map((bookInRow, idx) => (
                              <ListItem key={index + idx}>
                                <Box
                                    sx={{
                                      width: '180px',
                                      height: '250px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      ':hover': {
                                        backgroundColor: hoveredIndex === index + idx ? '#D8D8D8' : 'transparent',
                                        cursor: 'pointer',
                                      }
                                    }}
                                    onMouseEnter={() => handleMouseEnter(index + idx)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                  <Box sx={{ width: '180px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Link to="/ViewBook" state={{ book: bookInRow }}>
                                      <img
                                          src={bookInRow.imgPath}
                                          alt={bookInRow.label}
                                          style={{ width: '130px', height: '190px', borderRadius: '5px', cursor: 'pointer' }}
                                          onClick={() => handleViewBookClick(bookInRow)}
                                      />
                                    </Link>
                                  </Box>
                                  <Box sx={{ width: '180px', height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column' }}>
                                    <Typography style={{ fontSize: '14px', textAlign: 'center',color:'#0B1D35' }}>{bookInRow.label}</Typography>
                                    <Typography style={{ fontSize: '12px', textAlign: 'center',color:'grey' }}>{bookInRow.author}</Typography>
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
      </Layout>
  );
}
