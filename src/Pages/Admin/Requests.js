import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemAvatar, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { DialogActions } from '@material-ui/core';
import { useTheme } from '@emotion/react';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Requests() {
    const [tabValue, setTabValue] = useState('question');
    const { token } = useContext(AuthContext);
    const [question, setQuestion] = useState([])
    const [open, setOpen] = React.useState(false);
    const[article,setArticle]=useState([])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/questions/getUnderReviewQuestions`, {
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
                console.log(data.questions);
                setQuestion(data.questions)
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };


        const getArticle = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/articles/getUnderReviewArticles`, {
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
                setArticle(data.articles)
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };
        fetchData();
        getArticle();
    }, []);

    const handleClickOpen = (ques) => {
        navigate('/question', { state: { ques } });
    };
    const handleClickArticle =(article)=>{
        navigate('/viewArticle', { state: { articleData: article } });
    }
    return (
        <div>
            {/* <Box my={4}> */}
                <Typography variant="h5" component="h1" gutterBottom>
                    User Requests
                </Typography>
            {/* </Box> */}
            <Box sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs">
                    <Tab label="Question " value="question" />
                    <Tab label="Articles" value="articles" />
                </Tabs>
                {tabValue === 'question' && (
                    <Box p={2}>
                        <List>
                            {question.map((data, index) => (
                                <ListItem >
                                    <ListItemAvatar>
                                        <InsertDriveFileIcon />
                                    </ListItemAvatar>
                                    <Box>
                                        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: data.question }} />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="textSecondary">
                                                {data.userName} - {format(new Date(data.createdDate), 'MMMM d, yyyy')}
                                                {/* <Typography variant="body2" color="textSecondary" style={{ color: 'red', cursor: 'pointer' }} onClick={handleClickOpen(data._id)}>
                                                    Request
                                                </Typography> */}

                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    style={{ color: 'red', cursor: 'pointer' }}
                                                    onClick={() => handleClickOpen(data._id)}
                                                >
                                                 {data.status}  - Request
                                                </Typography>
                                            </Typography>
                                        </Box></Box>

                                </ListItem>
                            ))}
                        </List>
                    </Box>


                )}
                {tabValue === 'articles' && (

                    <Box p={2}>
                        <List>
                            {article.map((data, index) => (
                            <ListItem >
                                <ListItemAvatar>
                                    <InsertDriveFileIcon />
                                </ListItemAvatar>
                                <Box>
                                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html:data.title }} />
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {data.userName} - {format(new Date(data.createdDate), 'MMMM d, yyyy')}
                                            <Typography variant="body2" color="textSecondary" style={{ color: 'red', cursor: 'pointer' }}
                                              onClick={() => handleClickArticle(data)}>
                                                Request
                                            </Typography>
                                        </Typography></Box></Box>

                            </ListItem>
                             ))}
                        </List>
                    </Box>
                )}
            </Box>




        </div>
    )
}
