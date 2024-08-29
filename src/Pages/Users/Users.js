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
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PostQuestions from './PostQuestions';
import { jwtDecode } from 'jwt-decode';

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
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [responseData, setResponseData] = useState([]); 
    const [answerResponseData, setanswerResponseData] = useState([]); 
    const handleChange = (event, newValue) => { setValue(newValue) };
    const handleSignupClose = () => { setOpen(false) };
    const handleSignupOpen = () => setSignupOpen(true);

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
                setResponseData(data);
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
                setanswerResponseData(data);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };
        fetchData();
    }, []);


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
                    <Tab label="Posts" />
                </Tabs>
                {value === 0 && (
                    <Box p={3}>
                        <List>
                            {responseData?.result?.map((question, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText primary={question.question} secondary={question.date} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 1 && (
                    <Box p={3}>
                        <b>{answers.length} Answers</b>
                        <List>
                            {answerResponseData?.result?.map((answer, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge badgeContent={answer.votes} color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText primary={answer.answer} secondary={answer.date} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 2 && (
                    <Box p={3}>
                        <b>{posts?.length || 0} Posts</b>
                        {Array.isArray(posts) && posts.length > 0 ? (
                            <List>
                                {posts.map((post, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Badge badgeContent={post.votes} color="primary">
                                                    <ContactSupportIcon fontSize="large" />
                                                </Badge>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="body1" fontWeight="bold">{post.ques}</Typography>}
                                                secondary={post.date}
                                            />
                                        </ListItem>
                                        {post.answers && (
                                            <List component="div" disablePadding>
                                                {post.answers.map((answer, idx) => (
                                                    <ListItem key={idx} style={{ paddingLeft: 40 }}>
                                                        <ListItemAvatar>
                                                            <QuestionAnswerIcon />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={answer.text} secondary={answer.date} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography>No posts available.</Typography>
                        )}
                    </Box>
                )}
            </Box>
            <CustomDialog
                open={open}
                onClose={handleSignupClose}
                aria-labelledby="ask-question-dialog-title"
                aria-describedby="ask-question-dialog-description"
            >
                <DialogActions>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleSignupClose}
                        aria-label="close"
                    >
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
