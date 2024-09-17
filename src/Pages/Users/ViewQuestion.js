import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, IconButton, Stack, Dialog, DialogTitle, DialogActions, DialogContentText, TextareaAutosize, Grid, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DialogContent } from '@material-ui/core';
import { jwtDecode } from 'jwt-decode';

export default function ViewQuestion() {
    const location = useLocation();
    const { ques } = location.state || {};
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState(null);
    const [communities, setCommunities] = useState({});
    const [value, setValue] = useState();
    const token = localStorage.getItem('token');
    let decoded = jwtDecode(token);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ reason: '' });
    const [formErrors, setFormErrors] = useState({ reason: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/questions/getQuestionById/${ques}`, {
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
                setResponseData(data.result);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };

        async function community() {
            try {
                const communityResponse = await fetch('http://172.17.15.253:3002/lookup/getCommunity', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
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
        }
        fetchData();
        community();
    }, [ques]);

    const aproveRej = async (value) => {
        setValue(value);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormErrors({ reason: '' });
        setFormData({ reason: '' });
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

    const statusUpdate = async () => {
        if (value === 'rejected' && !formData.reason) {
            setFormErrors({ reason: 'Reason is required for rejection.' });
            return;
        }

        try {
            const response = await fetch(`http://172.17.15.253:3002/questions/updateQuestionStatus/${ques}`, {
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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.reason && value === 'rejected') {
            setFormErrors({ reason: 'Reason is required for rejection.' });
        } else if (formErrors.reason === '') {
            statusUpdate();
        }
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
        <Container>
            <Box my={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Question Details</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 2 }}>
                    <IconButton type="button" sx={{ p: '1px' }} aria-label="search" color='primary' onClick={() => navigate(-1)}>
                        <ArrowBackIcon /> Go Back
                    </IconButton>
                </Typography>
            </Box>
            {responseData ? (
                <>
                    <Typography variant="h4" gutterBottom>{responseData.question}</Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: responseData?.description }} />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        {responseData.community.map((communityId, index) => (
                            <Typography variant="body2" key={index}>
                                Tags: {communities[communityId]}
                            </Typography>
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
                </>
            ) : (
                <Typography variant="h6">Loading...</Typography>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>

        </Container>
    );
}
