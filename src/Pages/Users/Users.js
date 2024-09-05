import React, { useState, useEffect } from 'react';
import {
    Box, Tabs, Tab, Typography, IconButton, ListItem, ListItemText, List,
    Badge, Fab, Button, Paper, InputBase, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ListItemAvatar
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import PostQuestions from './PostQuestions';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DescriptionIcon from '@mui/icons-material/Description';

const CustomDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        borderRadius: 20,
        padding: '16px',
        minWidth: 300,
        maxWidth: 400,
    },
});
const CustomTextField = styled(TextField)({});
const CustomButton = styled(Button)({
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#1976d2',
    },
});
export default function Users() {
    const [value, setValue] = useState(0);
    const [signupOpen, setSignupOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [answerResponseData, setanswerResponseData] = useState([]);
    const [postResponseData, setpostResponseData] = useState([]);
    const [articles, setArticles] = useState([]);
    const handleChange = (event, newValue) => { setValue(newValue) };
    const handleSignupClose = () => setSignupOpen(false);
    const handleSignupOpen = () => setSignupOpen(true);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/questions/getQuestionByUserId/${decoded.userId}`, {
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
                setResponseData(data.questions);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/articles/getArticles/${decoded.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setArticles(data.article || []);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/answers/getAnswersByUserId/${decoded.userId}`, {
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
                setanswerResponseData(data.answers);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await fetch(` http://172.17.15.253:3002/questions`, {
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
                console.log(data);
                setpostResponseData(data.questions)
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };
        fetchData();
    }, []);

    const publicQuestionClick = (ques) => {
        navigate('/user-post', { state: { ques } });
    };
    const viewArticleClick = (article) => {
        navigate('/viewArticle', { state: { id: article._id } });
    }
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search here....."
                        inputProps={{ 'aria-label': 'search' }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>
            <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="community tabs">
                    <Tab label="Questions" />
                    <Tab label="Answers" />
                    <Tab label="Articles" />
                    <Tab label="All Posts" />
                </Tabs>
                {value === 0 && (
                    <Box p={3}>
                        <b>{responseData.length} Questions</b>
                        <List>
                            {responseData.map((question, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText style={{ cursor: 'pointer' }} primary={question.question} secondary={format(new Date(question.createdDate), 'MMMM d, yyyy')}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 1 && (
                    <Box p={3}>
                        <b>{answerResponseData.length} Answers</b>
                        <List>
                            {answerResponseData.map((answer, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge badgeContent={answer.votes} color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText primary={answer.answer} secondary={format(new Date(answer.createdDate), 'MMMM d, yyyy')} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 2 && (
                    <Box p={3}>
                        <b>{articles.length} Articles</b>
                        <List>
                            {articles.map((article, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge color="primary">
                                            <DescriptionIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <Box>
                                        <Typography
                                            style={{ cursor: 'pointer' }}
                                            variant="body2"
                                            dangerouslySetInnerHTML={{ __html: article.title }}
                                            onClick={() => viewArticleClick(article)}
                                        />
                                        <ListItemText
                                            primary={<span dangerouslySetInnerHTML={{ __html: truncateText(article.content, 100) }} />}
                                            secondary={
                                                <span style={{ marginTop: '4px', display: 'block' }}>
                                                    {format(new Date(article.createdDate), 'MMMM d, yyyy')}
                                                </span>
                                            }
                                        />
                                    </Box>

                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 3 && (
                    <Box p={3}>
                        <b>{postResponseData.length} Posts</b>
                        <List>
                            {postResponseData.map((ques, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <Box>
                                        <Typography style={{ cursor: 'pointer' }} variant="body2" dangerouslySetInnerHTML={{ __html: ques.question }} onClick={() => publicQuestionClick(ques._id)} />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="textSecondary">
                                                {ques.userName}     {format(new Date(ques.createdDate), 'MMMM d, yyyy')}
                                            </Typography></Box></Box>

                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Box>
            <CustomDialog
                open={open}
                onClose={handleSignupClose}
                aria-labelledby="ask-question-dialog-title"
                aria-describedby="ask-question-dialog-description">
                <DialogActions>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleSignupClose}
                        aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogTitle>Ask your Query ?</DialogTitle>
                <DialogContent>
                    <CustomTextField
                        autoFocus
                        margin="dense"
                        id="question"
                        label="Type something..."
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleSignupClose}>Submit</CustomButton>
                </DialogActions>
            </CustomDialog>
            <PostQuestions signupOpen={signupOpen} handleSignupClose={handleSignupClose} />
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 30, right: 30 }}
                onClick={handleSignupOpen}
            >
                <AddIcon />
            </Fab>
        </div>
    );
}
