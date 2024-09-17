import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Chip, IconButton, Stack, Button, DialogTitle, DialogContentText, Grid, DialogActions } from '@mui/material';
import Card from '@mui/material/Card';
import { useLocation, useNavigate } from 'react-router-dom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { jwtDecode } from 'jwt-decode';
import { Dialog, DialogContent, TextareaAutosize } from '@material-ui/core';

export default function ViewArticle() {
    const [responseData, setResponseData] = useState(null);
    const [communities, setCommunities] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let decoded = jwtDecode(token);
    const [value, setValue] = useState();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ reason: '' });
    const [formErrors, setFormErrors] = useState({ reason: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const articleData = location.state?.articleData;
    const articleId = articleData?._id;
    useEffect(() => {
    

        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/articles/getArticlesById/${articleId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                console.log(data.result);
                setResponseData(Array.isArray(data.result) ? data.result : [data.result]);
            } catch (error) {
                console.error('Error fetching article data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCommunityData = async () => {
            try {
                const communityResponse = await fetch('http://172.17.15.253:3002/lookup/getCommunity', {
                    method: 'GET',
                });
                if (!communityResponse.ok) {
                    throw new Error('API request failed');
                }
                const communityData = await communityResponse.json();
                const communityMap = communityData.reduce((acc, community) => {
                    acc[community.value] = community.label;
                    return acc;
                }, {});
                setCommunities(communityMap);
            } catch (error) {
                console.error('Error fetching community data:', error);
            }
        };
        fetchCommunityData();
    }, []);

    const aproveRej = async (value) => {
        setValue(value);
        setOpen(true);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.reason && value === 'rejected') {
            setFormErrors({ reason: 'Reason is required for rejection.' });
        } else if (formErrors.reason === '') {
            statusUpdate();
        }
    };
    const statusUpdate = async () => {
        if (value === 'rejected' && !formData.reason) {
            setFormErrors({ reason: 'Reason is required for rejection.' });
            return;
        }

        try {
            const response = await fetch(`http://172.17.15.253:3002/articles/updateArticleStatus/${articleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: value,
                    reason: formData.reason
                })
            });
            const result = await response.json();
            handleClose();

            if (result.success) {
                setAlertMessage(result.message);
                setAlertSeverity('success');
                navigate('/requests');
            } else {
                setAlertMessage('An error occurred.');
                setAlertSeverity('error');
            }
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('An error occurred.');
            setAlertSeverity('error');
            setSnackbarOpen(true);
        }
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'reason' && /\d/.test(value)) {
            setFormErrors({ ...formErrors, [name]: 'Numbers are not allowed.' });
            return;
        }
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: '' });
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
        setFormErrors({ reason: '' });
        setFormData({ reason: '' });
    };
    const styles = {
        textarea: {
            width: '100%',
        },
        errorMessage: {
            color: 'red',
            fontSize: '0.9rem',
        }
    };
    return (
        <Container >

            <Box my={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Article Details</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 2 }}>
                    <IconButton type="button" sx={{ p: '1px' }} aria-label="search" color='primary' onClick={() => navigate(-1)}>
                        <ArrowBackIcon /> Go Back
                    </IconButton>
                </Typography>
            </Box>

            {/* <Card style={{ padding: '25px', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}> */}
            {responseData && responseData?.map((article, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom dangerouslySetInnerHTML={{ __html: article.title }} />
                    <Box sx={{ my: 2 }}>
                        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6"><b>Tags</b></Typography>
                        {article.community.map((communityId, index) => (
                            <Chip
                                key={index}
                                label={communities[communityId] || 'Unknown Community'}
                                style={{ marginRight: '5px', backgroundColor: '#2196f3', color: 'white', marginTop: '20px', fontSize: '11px', height: '25px' }}
                            />
                        ))}
                    </Box>
                    {decoded.userRole === "admin" ? (
                        <Box mt={3} display="flex" justifyContent="flex-start">
                            <Stack spacing={2} direction="row">
                                <Button type="submit" variant="contained" onClick={() => aproveRej('approved')}>Approve</Button>
                                <Button type="submit" variant="contained" onClick={() => aproveRej('rejected')}>Reject</Button>
                            </Stack>
                        </Box>
                    ) : null}
                     <form onSubmit={handleSubmit}>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>
                                Are you sure you want to {value} this request?
                            </DialogTitle>
                            {value === 'rejected' ? (
                                <DialogContent>
                                    <DialogContentText>
                                        <Grid>
                                            <TextareaAutosize
                                                name="reason"
                                                value={formData.reason}
                                                onChange={handleInputChange}
                                                placeholder="Enter your reason here..."
                                                style={styles.textarea}
                                                maxRows={10}
                                                minRows={5}
                                            />
                                            {formErrors.reason && (
                                                <Typography style={styles.errorMessage}>
                                                    {formErrors.reason}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </DialogContentText>
                                </DialogContent>
                            ) : null}
                            <DialogActions>
                                <Button type="submit" onClick={statusUpdate}>Yes</Button>
                                <Button onClick={handleClose} autoFocus>No</Button>
                            </DialogActions>
                        </Dialog>
                    </form>
                </Box>
            ))}
        </Container>
    );
}
