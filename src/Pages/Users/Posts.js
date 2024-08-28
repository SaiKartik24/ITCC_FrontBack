import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, IconButton, Chip, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { format } from 'date-fns';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import DOMPurify from 'dompurify';
import { jwtDecode } from 'jwt-decode';

const initialPosts = [
    {
        id: 1,
        question: "I am trying to install node on my mac... can you guys tell me why I am facing that error?",
        userName: 'User Name',
        date: new Date(),
        likes: 0,
        dislikes: 0,
        comments: [],
        communities: ['#angular', '#CSS', '#react js'],
        answers: [
            {
                id: 1,
                userName: 'User Name',
                date: new Date(),
                text: "Running just npm install will look for dependencies listed in your package.json...",
                likes: 0,
                dislikes: 0,
                comments: []
            }
        ],
    }
];

const modules = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] }
        ],
        [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
};

const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
];

const stripHtmlTags = (html) => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
};

export default function Posts() {
    const [posts, setPosts] = useState(initialPosts);
    const [newAnswer, setNewAnswer] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newQuestionComment, setNewQuestionComment] = useState('');
    const [showAnswerField, setShowAnswerField] = useState(null);
    const [showCommentField, setShowCommentField] = useState(null);
    const [showQuestionCommentField, setShowQuestionCommentField] = useState(null);
    const { token } = useContext(AuthContext);
    const [userToken, setUserToken] = useState({});

    useEffect(() => {
        if (typeof token === 'string') {
            try {
                const decodedToken = jwtDecode(token);
                setUserToken(decodedToken);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.error('Token must be a string');
        }
    }, [token]);

    const handleInputChange = (setter) => (e) => setter(e.target.value);

    const handleAddItem = async (type, postId, answerId = null) => {
        if (type === 'answer' && newAnswer.trim()) {
            const sanitizedAnswer = newAnswer;
            try {
                const response = await fetch('http://172.17.15.253:3002/answers/addAnswer/66b22b386f6da54c035ee5ed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        answer: sanitizedAnswer,
                        userId: userToken.userId
                    })
                });

                const result = await response.json();
                if (result.success) {
                    setPosts(posts.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                answers: [
                                    ...post.answers,
                                    {
                                        id: result.data.answer._id,
                                        userName: 'User Name',
                                        date: new Date(result.data.answer.createdDate),
                                        text: newAnswer,
                                        likes: 0,
                                        dislikes: 0,
                                        comments: []
                                    }
                                ]
                            }
                            : post
                    ));
                    setNewAnswer('');
                    setShowAnswerField(null);
                } else {
                    console.error('Error adding answer');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if ((type === 'comment' && newComment.trim()) || (type === 'questionComment' && newQuestionComment.trim())) {
            const referenceId = type === 'comment' ? answerId : postId;
            const commentText = type === 'comment' ? newComment : newQuestionComment;
            const sanitizedComment = stripHtmlTags(commentText);
            try {
                const response = await fetch('http://172.17.15.253:3002/comments/addComment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        referenceId: String(referenceId),
                        comment: commentText,
                        userId: userToken.userId
                    })
                });
                const result = await response.json();
                if (result.success) {
                    if (type === 'comment') {
                        setPosts(posts.map(post =>
                            post.id === postId
                                ? {
                                    ...post,
                                    answers: post.answers.map(answer =>
                                        answer.id === answerId
                                            ? {
                                                ...answer,
                                                comments: [
                                                    ...answer.comments,
                                                    {
                                                        id: result.data.comment._id,
                                                        userName: 'User Comments',
                                                        date: new Date(result.data.comment.createdDate),
                                                        text: sanitizedComment
                                                    }
                                                ]
                                            }
                                            : answer
                                    )
                                }
                                : post
                        ));
                        setNewComment('');
                        setShowCommentField(null);
                    } else {
                        setPosts(posts.map(post =>
                            post.id === postId
                                ? {
                                    ...post,
                                    comments: [
                                        ...post.comments,
                                        {
                                            id: result.data.comment._id,
                                            userName: 'User Comments',
                                            date: new Date(result.data.comment.createdDate),
                                            text: sanitizedComment
                                        }
                                    ]
                                }
                                : post
                        ));
                        setNewQuestionComment('');
                        setShowQuestionCommentField(null);
                    }
                } else {
                    console.error('Error adding comment');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const handlePostLike = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, likes: post.likes + 1 }
                : post
        ));
    };
    const handlePostDislike = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, dislikes: post.dislikes + 1 }
                : post
        ));
    };
    const handleAnswerLike = (postId, answerId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    answers: post.answers.map(answer =>
                        answer.id === answerId
                            ? { ...answer, likes: answer.likes + 1 }
                            : answer
                    )
                }
                : post
        ));
    };
    const handleAnswerDislike = (postId, answerId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    answers: post.answers.map(answer =>
                        answer.id === answerId
                            ? { ...answer, dislikes: answer.dislikes + 1 }
                            : answer
                    )
                }
                : post
        ));
    };
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Posts
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item key={post.id} xs={12}>
                        <Paper style={{ padding: '10px' }}>
                            <Typography variant="h6" component="h6" gutterBottom>
                                {post.question}
                            </Typography>
                            <Box>
                                {post.communities.map((community, index) => (
                                    <Chip key={index} label={community} style={{ marginRight: '5px', backgroundColor: '#2196f3', color: 'white' }} />
                                ))}
                            </Box>
                            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="textSecondary">
                                    Posted by {post.userName} on {format(new Date(post.date), 'MMMM d, yyyy')}
                                </Typography>
                                <Box>
                                    <IconButton onClick={() => handlePostLike(post.id)}>
                                        <ThumbUpIcon />
                                    </IconButton>
                                    {post.likes}
                                    <IconButton onClick={() => handlePostDislike(post.id)}>
                                        <ThumbDownIcon />
                                    </IconButton>
                                    {post.dislikes}
                                    <IconButton onClick={() => setShowQuestionCommentField(showQuestionCommentField === post.id ? null : post.id)}>
                                        <CommentIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            {showQuestionCommentField === post.id && (
                                <Box mt={2}>
                                    <TextField
                                        label="Add comment"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        variant="outlined"
                                        value={newQuestionComment}
                                        onChange={handleInputChange(setNewQuestionComment)}
                                    />
                                    <Box mt={1} display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" onClick={() => handleAddItem('questionComment', post.id)}>
                                            Add Comment
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {post.comments.length > 0 && (
                                <Box mt={2} ml={2}>
                                    <Typography variant="subtitle2">{post.comments.length} Comments:</Typography>
                                    {post.comments.map((comment) => (
                                        <Paper key={comment.id} style={{ padding: '10px', marginTop: '10px', backgroundColor: '#e8eaf6' }}>
                                            <Box mb={2}>
                                                <Typography variant="body2">{comment.text}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    Comment by {comment.userName} on {format(new Date(comment.date), 'MMMM d, yyyy')}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                            )}
                        </Paper>
                        <Box mt={2}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                {post.answers.length} Answers:
                            </Typography>
                            {post.answers.map((answer) => (
                                <Paper key={answer.id} style={{ padding: '10px', marginTop: '10px', backgroundColor: '#f5f5f5' }}>
                                    <Box mb={2}>
                                        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: answer.text }} />
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {answer.userName} - {format(new Date(answer.date), 'MMMM d, yyyy')}
                                        </Typography>
                                        <Box>
                                            <IconButton onClick={() => handleAnswerLike(post.id, answer.id)}>
                                                <ThumbUpIcon />
                                            </IconButton>
                                            {answer.likes}
                                            <IconButton onClick={() => handleAnswerDislike(post.id, answer.id)}>
                                                <ThumbDownIcon />
                                            </IconButton>
                                            {answer.dislikes}
                                            <IconButton onClick={() => setShowCommentField(showCommentField === answer.id ? null : answer.id)}>
                                                <CommentIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    {showCommentField === answer.id && (
                                        <Box mt={2}>
                                            <TextField
                                                label="Add comment"
                                                multiline
                                                fullWidth
                                                rows={4}
                                                variant="outlined"
                                                value={newComment}
                                                onChange={handleInputChange(setNewComment)}
                                            />
                                            <Box mt={1} display="flex" justifyContent="flex-end">
                                                <Button variant="contained" color="primary" onClick={() => handleAddItem('comment', post.id, answer.id)}>
                                                    Add Comment
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                    {answer.comments.length > 0 && (
                                        <Box mt={2} ml={2}>
                                            <Typography variant="subtitle2">{answer.comments.length} Comments:</Typography>
                                            {answer.comments.map((comment) => (
                                                <Paper key={comment.id} style={{ padding: '10px', marginTop: '10px', backgroundColor: '#e8eaf6' }}>
                                                    <Box mb={2}>
                                                        <Typography variant="body2">{comment.text}</Typography>
                                                    </Box>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Comment by {comment.userName} on {format(new Date(comment.date), 'MMMM d, yyyy')}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </Box>
                                    )}
                                </Paper>
                            ))}
                            <Box mt={2}>
                                {showAnswerField === post.id ? (
                                    <>
                                        <ReactQuill
                                            theme="snow"
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Write your answer..."
                                            value={newAnswer}
                                            onChange={setNewAnswer}
                                            style={{ height: "200px", marginBottom: '50px' }}
                                        />
                                        <Box mt={1} display="flex" justifyContent="flex-end">
                                            <Button variant="contained" color="primary" onClick={() => handleAddItem('answer', post.id)}>
                                                Post Answer
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <Box mt={1} display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" onClick={() => setShowAnswerField(post.id)}>
                                            Post Answer
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

