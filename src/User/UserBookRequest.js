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
    title: 'Moby Dick',
    author: 'Herman Melville',
    publicationYear: 1851,
    reason: 'Interesting, assignment needed'
    },
    {
    code:'003',
    title: 'Moby Dick',
    author: 'Herman Melville',
    publicationYear: 1851,
    reason: 'Interesting, assignment needed'
    },
]
const UserBookRequest = () => {
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    // const { register, handleSubmit, setValue } = useForm();

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
            <Box>
                <Box sx={{display:'flex',flexDirection:'row',width:'90%',marginLeft:'auto',marginRight:'auto',marginTop:'20px'}}>
                    <label style={{
                        display: 'flex',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#183764',
                        justifyContent:'center',
                        alignItems:'center'

                    }}>Wish List</label>
                    <Button onClick={handleAddRequest} sx={{
                        backgroundColor: '#183764',
                        color: 'white',
                        width: '100px',
                        height: '25px',
                        marginLeft:'auto',
                        marginTop:'10px',
                        '&:hover': {
                            backgroundColor:'#2468CD',
                            color: 'white', // Change the hover background color here
                        },
                    }}>Add</Button>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '20px',
                    width:'90%',
                    marginRight:'auto',
                    marginLeft:'auto'
                }}>
                    {sampleWishList.map((item, index) => (
                        <Box sx={{width:'80%',marginLeft:'auto',marginRight:'auto'}}>
                            <Box sx={{display: 'flex', flexDirection:'row',justifyContent:'center',marginBottom:'15px',alignItems:'center',textAlign:'center'}}>
                                <label style={{fontWeight:'bold',fontSize:'20px'}}>code#</label>
                                <label style={{fontWeight:'bold',fontSize:'20px'}}>{item.code}</label>
                            </Box>
                            <Box key={index} sx={{
                                width: '350px',
                                height: '150px',
                                background: '#E4E2D9',
                                borderRadius:'10px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                                // marginBottom: '10px',

                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row',marginBottom:'10px',justifyContent:'center' }}>
                                    <label style={{fontWeight:'bold',color:'#183764'}}>Book Title:</label>
                                    <label style={{color:'#183764'}}>{item.title}</label>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row',marginBottom:'10px',justifyContent:'center' }}>
                                    <label style={{fontWeight:'bold',color:'#183764'}}>Author: </label>
                                    <label style={{color:'#183764'}}>{item.author}</label>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row',marginBottom:'10px',justifyContent:'center' }}>
                                    <label style={{fontWeight:'bold',color:'#183764'}}>Publish Year: </label>
                                    <label style={{color:'#183764'}}>{item.publicationYear}</label>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row',marginBottom:'10px',justifyContent:'center' }}>
                                    <label style={{fontWeight:'bold',color:'#183764'}}>Reason: </label>
                                    <label style={{color:'#183764'}}>{item.reason}</label>
                                </Box>
                            </Box>

                        </Box>
                    ))}

                </Box>
            </Box>
            <Dialog open={addOpen} onClose={handleClose}  PaperProps={{
                sx: {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    width: '60%',
                    height: '90%',
                    maxWidth: 'none',
                    maxHeight: 'none'
                }
            }}>
                <DialogContent sx={{width:'70%',marginTop:'70px',marginLeft:'auto',marginRight:'auto'}}>
                    <DialogContentText>
                        Please provide details about the book you want to request.
                    </DialogContentText>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column',marginTop:'20px' }}>
                            <label>Title:</label>
                            <input {...register('title')} type="text" style={{width:'90%',height:'30px'}} />
                            <label>Author:</label>
                            <input {...register('author')} type="text" style={{width:'90%',height:'30px'}} />
                            <label>Publication Year:</label>
                            <input {...register('publicationYear')} type="number" style={{width:'90%',height:'20px'}}  />
                            <label>Reason:</label>
                            <input {...register('reason')} type="text" style={{width:'90%',height:'90px',borderRadius:'10px'}} />
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
