import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemAvatar, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { DialogActions } from '@material-ui/core';
import { useTheme } from '@emotion/react';

export default function Requests() {
    const [tabValue, setTabValue] = useState('question');
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <Box my={4}>
                <Typography variant="h5" component="h1" gutterBottom>
                    User Requests
                </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs">
                    <Tab label="Question " value="question" />
                    <Tab label="Articles" value="articles" />
                </Tabs>
                {tabValue === 'question' && (
                    <Box p={2}>
                        <List>
                            {/* {articles.map((article, index) => ( */}
                            <ListItem >
                                <ListItemAvatar>
                                    <InsertDriveFileIcon />
                                </ListItemAvatar>
                                <Box>
                                    {/* <Typography variant="body2" dangerouslySetInnerHTML={{ __html: szedcsdcsddvdvgd}} /> */}
                                    <Typography variant="body2">Long labels will automatically wrap on tabs. If the label is too long for the tab, it will overflow, and the text will not be visible.</Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {/* userName - {format(new Date(article.createdDate), 'MMMM d, yyyy')} */}
                                            userName -
                                            <Typography variant="body2" color="textSecondary" style={{ color: 'red', cursor: 'pointer' }} onClick={handleClickOpen}>
                                                Request
                                            </Typography>
                                        </Typography>
                                    </Box></Box>

                            </ListItem>
                            {/* ))} */}
                        </List>
                    </Box>


                )}
                {tabValue === 'articles' && (

                    <Box p={2}>
                        <List>
                            {/* {articles.map((article, index) => ( */}
                            <ListItem >
                                <ListItemAvatar>
                                    <InsertDriveFileIcon />
                                </ListItemAvatar>
                                <Box>
                                    {/* <Typography variant="body2" dangerouslySetInnerHTML={{ __html: szedcsdcsddvdvgd}} /> */}
                                    <Typography variant="body2"  >@mui/lab offers utility components that inject props to implement accessible tabs following WAI-ARIA Authoring</Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {/* userName - {format(new Date(article.createdDate), 'MMMM d, yyyy')} */}
                                            userName -
                                            <Typography variant="body2" color="textSecondary" style={{ color: 'red', cursor: 'pointer' }}>
                                                Request
                                            </Typography>
                                        </Typography></Box></Box>

                            </ListItem>
                            {/* ))} */}
                        </List>
                    </Box>
                )}
            </Box>


            <Dialog
                // fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Reject
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        Aprove
                    </Button>
                </DialogActions>
            </Dialog>



        </div>
    )
}
