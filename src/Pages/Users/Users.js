import React,{useState} from 'react';
import {
    Box, Tabs, Tab, Typography, Avatar, Grid, IconButton, ListItem, ListItemText, List,
    Badge, Fab, Button, Paper, InputBase, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { ListItemAvatar } from '@material-ui/core';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PostQuestions from './PostQuestions';

const CustomDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        borderRadius: 20,
        padding: '16px',
        minWidth: 300,
        maxWidth: 400, 
    },
});
const CustomTextField = styled(TextField)({
   
});

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
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleSignupClose = () => {
        setOpen(false);
    };
    const handleSignupOpen = () => setSignupOpen(true);
    const questions = [
        { votes: 135, title: "Can Browsers read a JSX File? What is Babel?", date: "Nov 18, 2008" },
        { votes: 77, title: "How do React apps load and display the components in the browser?", date: "Sep 19, 2008" },
    ];

    const answers = [
        { votes: 135, title: "It is used to transpile JSX syntax into regular Javascript which browsers can understand", date: "Nov 18, 2008" },
        { votes: 77, title: "React uses a virtual DOM to efficiently update and render components to the actual DOM in the browser.", date: "Sep 19, 2008" },
    ];
    const posts = [
        {
            votes: 135,
            ques: "Can Browsers read a JSX File? What is Babel?",
            date: "Nov 18, 2008",
            answers: [
                {
                    text: 'The most popular transpiler for JSX is Babel. Babel transforms the JSX code into a series of function calls. These function calls are equivalent to the HTML-like code written in JSX. The browser can then execute the resulting JavaScript code.',
                    date: 'Nov 19, 2008'
                },
                {
                    text: 'JSX is a syntax extension used for javascript within HTML, for readable and understandable code. You can even write pure JS inside your react project and it will still run. JSX is not natively understood by browsers. Instead, it needs to be converted into valid JavaScript using tools like Babel.',
                    date: 'Nov 20, 2008'
                }
            ]
        },

    ];
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
                        <b>{questions.length} questions</b>
                        <List>
                            {questions.map((question, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge badgeContent={question.votes} color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText primary={question.title} secondary={question.date} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 1 && (
                    <Box p={3}>
                        <b>{answers.length} Answers</b>
                        <List>
                            {answers.map((answers, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge badgeContent={answers.votes} color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText primary={answers.title} secondary={answers.date} />
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