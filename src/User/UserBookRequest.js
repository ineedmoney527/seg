import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useForm } from 'react-hook-form';
import Layout from './Layout';
import bg from "./Image/BookPostCard.png";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import {useTheme} from "@mui/material/styles";
import Divider from '@mui/material/Divider';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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
        title: 'happy',
        author: 'Herman Melville',
        publicationYear: 1851,
        reason: 'Interesting, assignment needed'
    }
]


function SlideShow() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = sampleWishList.length;

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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <Box sx={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                width: '60%',
                height: '90vh',
                maxWidth: 'none',
                maxHeight: 'none',
                marginBottom: '20px',

            }}>
                <AutoPlaySwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                >
                    {sampleWishList.map((item, index) => (
                        <Box
                            key={index}
                        >
                            <Box sx={{ width: '80%', height: '80%', paddingTop: '70px', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px', }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                                        <label>Title:</label>
                                        <label style={{ width: '100%', height: '5vh', backgroundColor: '#EFEFEF', color: '#525252', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',paddingLeft:'10px',paddingTop:'5px' }}>{item.title}</label>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                                        <label>Author:</label>
                                        <label style={{ width: '100%', height: '5vh', backgroundColor: '#EFEFEF', color: '#525252', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',paddingLeft:'10px',paddingTop:'5px' }}>{item.author}</label>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                                        <label>Publication Year:</label>
                                        <label style={{ width: '100%', height: '5vh', backgroundColor: '#EFEFEF', color: '#525252', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',paddingLeft:'10px',paddingTop:'5px' }}>{item.publicationYear}</label>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <label>Reason:</label>
                                        <label style={{ width: '100%', height: '22vh', backgroundColor: '#EFEFEF', color: '#525252', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',paddingLeft:'10px',paddingTop:'5px' }}>{item.reason}</label>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </AutoPlaySwipeableViews>
            </Box>
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
const UserBookRequest = () => {
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const { register, handleSubmit, setValue } = useForm();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(prevShowSearchBar => !prevShowSearchBar);
    };

    const handleAddRequest = () => {
        setAddOpen(true);
        setValue('title', sampleWishList.title);
        setValue('author', sampleWishList.author);
        setValue('publicationYear', sampleWishList.publicationYear);
        setValue('reason', sampleWishList.reason);
    };

    const handleClose = () => {
        setAddOpen(false);
    };

    const onSubmit = (data) => {
        console.log(data);
        setAddOpen(false);
    };

    return (
        <Layout
            showSearchBar={showSearchBar}
            toggleSearchBar={toggleSearchBar}
            toggleDrawer={toggleDrawer}
            open={open}
        >
            <Box sx={{backgroundColor:'#F6F4F1'}}>
                <Box sx={{display:'flex',flexDirection:'row',width:'90%',marginLeft:'auto',marginRight:'auto',justifyContent:'center',alignItems:'center',fontFamily: 'monospace',height:'100px'}}>
                    <label style={{
                        display: 'flex',
                        fontSize: '35px',
                        fontWeight: 'bold',
                        color: '#2868C6',


                    }}>Monthly Wish List</label>
                </Box>
                <Divider sx={{ width: '50%', marginBottom: '20px', borderBottom: '1px solid black',marginLeft:'auto',marginRight:'auto' }} />
                <SlideShow />

                <Box sx={{
                    display:'flex',
                    marginTop:'10px',
                    justifyContent:'center',
                    alignItems:'center',
                    height:'100px',
                    marginLeft:'auto',
                    marginRight:'auto'}}>
                    <Button onClick={handleAddRequest} sx={{
                        backgroundColor: '#183764',
                        color: 'white',
                        width: '200px',
                        height: '30px',
                        '&:hover': {
                            backgroundColor:'#2468CD',
                            color: 'white',
                        },
                    }}>Add My Wish</Button>
                </Box>
            </Box>
            <Dialog open={addOpen} onClose={handleClose} PaperProps={{
                sx: {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    width: '60%',
                    height: '90%',
                    maxWidth: 'none',
                    maxHeight: 'none'
                }
            }}>
                <DialogContent sx={{ width: '80%', height: '80%', marginTop: '80px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <DialogContentText>
                        Please provide details about the book you want to request.
                    </DialogContentText>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px', width: '100%', height: '100%'}}>
                            <label>Title:</label>
                            <input {...register('title')} type="text" style={{ width: '100%', minHeight: '5vh' }} />
                            <label>Author:</label>
                            <input {...register('author')} type="text" style={{ width: '100%', height: '5vh' }} />
                            <label>Publication Year:</label>
                            <input {...register('publicationYear')} type="number" style={{ width: '100%', height: '5vh',borderRadius:'20px',border:'none' }} />
                            <label>Reason:</label>
                            <input {...register('reason')} type="text" style={{ width: '100%', height: '17vh', borderRadius: '10px' }} />
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">Submit</Button>
                </DialogActions>
            </Dialog>

        </Layout>
    );
};

export default UserBookRequest;
