import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, IconButton, Chip, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import { format } from 'date-fns';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import DOMPurify from 'dompurify';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill';

const stripHtmlTags = (html) => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
};

export default function Posts() {
    const [newAnswer, setNewAnswer] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newQuestionComment, setNewQuestionComment] = useState('');
    const [showAnswerField, setShowAnswerField] = useState(null);
    const { token } = useContext(AuthContext);
    const [userToken, setUserToken] = useState({});
    const [communities, setCommunities] = useState({});
    const [getComments, setGetComments] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [answerComments, setAnswerComments] = useState({});
    const [showCommentField, setShowCommentField] = useState(null);
    const [showQuestionCommentField, setShowQuestionCommentField] = useState(null);
    const [question, setQuestion] = useState([]);

    const location = useLocation();
    const { ques } = location.state || {};

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

        async function fetchData() {
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

        async function getQuestionComments() {
            try {
                const response = await fetch(`http://172.17.15.253:3002/questions/answers-comments/${ques}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch question comments');
                }
                const data = await response.json();
                setQuestion(data);
                setGetComments(data.questionComments?.comments || []);
                setAnswers(data.answers);

                const commentsByAnswerId = data.answers.reduce((acc, answer) => {
                    acc[answer._id] = answer.answerComments || [];
                    return acc;
                }, {});
                setAnswerComments(commentsByAnswerId);
            } catch (error) {
                console.error('Failed to fetch question comments:', error);
                setGetComments([]);
            }
        }

        getQuestionComments();
        fetchData();
    }, [token]);

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };


    const handleAddItem = async (type, postId, answerId = null) => {
        let referenceId, commentText, sanitizedComment;

        if (type === 'answer' && newAnswer.trim()) {
            const sanitizedAnswer = stripHtmlTags(newAnswer);
            try {
                const response = await fetch(`http://172.17.15.253:3002/answers/addAnswer/${ques}`, {
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
                    setAnswers([...answers, {
                        _id: result.data.answer._id,
                        userName: 'User Name',
                        createdDate: new Date(result.data.answer.createdDate),
                        answer: sanitizedAnswer,
                        likes: 0,
                        dislikes: 0,
                        answerComments: []
                    }]);
                    setNewAnswer('');
                    setShowAnswerField(null);
                } else {
                    console.error('Error adding answer:', result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if ((type === 'comment' && newComment.trim()) || (type === 'questionComment' && newQuestionComment.trim())) {
            referenceId = type === 'comment' ? answerId : postId;
            commentText = type === 'comment' ? newComment : newQuestionComment;
            sanitizedComment = stripHtmlTags(commentText);
            try {
                const response = await fetch('http://172.17.15.253:3002/comments/addComment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        referenceId: String(referenceId),
                        comment: sanitizedComment,
                        userId: userToken.userId
                    })
                });
                const result = await response.json();
                if (result.success) {
                    if (type === 'comment') {
                        setAnswerComments({
                            ...answerComments,
                            [answerId]: [...(answerComments[answerId] || []), {
                                _id: result.data.comment._id,
                                userId: 'User Comments',
                                createdDate: new Date(result.data.comment.createdDate),
                                comment: sanitizedComment
                            }]
                        });
                        setNewComment('');
                        setShowCommentField(null);
                    } else {
                        setGetComments([...getComments, {
                            _id: result.data.comment._id,
                            userId: 'User Comments',
                            createdDate: new Date(result.data.comment.createdDate),
                            comment: sanitizedComment
                        }]);
                        setNewQuestionComment('');
                        setShowQuestionCommentField(null);
                    }
                } else {
                    console.error('Error adding comment:', result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };


    const handlePostLike = (postId) => {

    };

    const handlePostDislike = (postId) => {

    };
    const handleQuillChange = (value) => {
        setNewAnswer(value);
    };

    const handleAnswerLike = (answerId) => {
        setAnswers(answers.map(answer =>
            answer._id === answerId
                ? { ...answer, likes: answer.likes + 1 }
                : answer
        ));
    };
    const handleAnswerDislike = (answerId) => {
                setAnswers(answers.map(answer =>
                    answer._id === answerId
                        ? { ...answer, dislikes: answer.dislikes + 1 }
                        : answer
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
                <Grid item xs={12}>
                    {question.question ? (
                        <Paper style={{ padding: '10px' }}>
                            <Typography variant="h5" component="h5" gutterBottom>
                                {question.question}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {question.description}
                            </Typography>

                            <Box>
                                {question.community.map((communityId, index) => (
                                    <Chip
                                        key={index}
                                        label={communities[communityId] || 'Unknown Community'}
                                        style={{ marginRight: '5px', backgroundColor: '#2196f3', color: 'white', marginTop: '20px', fontSize: '11px', height: '25px' }}
                                    />
                                ))}
                            </Box>

                            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="textSecondary">
                                    Posted by {question.userName} on {format(new Date(question.createdDate), 'MMMM d, yyyy')}
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={() => handlePostLike(ques)} aria-label="like">
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <Typography variant="body2">{question.likes?.length}</Typography>

                                    <IconButton onClick={() => handlePostDislike(ques)} aria-label="dislike">
                                        <ThumbDownIcon />
                                    </IconButton>
                                    <Typography variant="body2">{question.dislikes.length}</Typography>

                                    <IconButton onClick={() => setShowQuestionCommentField(ques)}>
                                        <CommentIcon />
                                    </IconButton>
                                    <Typography variant="body2">{getComments.length}</Typography>
                                </Box>
                            </Box>

                            {showQuestionCommentField === ques && (
                                <Box mt={2}>
                                    <TextField
                                        label="Add comment"
                                        fullWidth
                                        value={newQuestionComment}
                                        onChange={handleInputChange(setNewQuestionComment)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '10px' }}
                                        onClick={() => handleAddItem('questionComment', ques)}
                                    >
                                        Add Comment
                                    </Button>
                                </Box>
                            )}

                            {getComments.length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="h6" gutterBottom>
                                        Comments
                                    </Typography>
                                    {getComments.map((comment) => (
                                        <Box key={comment._id} mb={2}>
                                            <Paper style={{ padding: '10px', backgroundColor: '#e8eaf6' }}>
                                                <Typography variant="body1">
                                                    {comment.comment}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {comment.userName} - {format(new Date(comment.createdDate), 'MMMM d, yyyy')}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            No question data available or loading...
                        </Typography>
                    )}
                </Grid>

                {answers.length > 0 && (
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="h6" component="h2" gutterBottom style={{ color: 'rgb(33, 150, 243)' }}>
                                {answers.length} Answers:
                            </Typography>

                            {answers.map((answer) => (
                                <Paper key={answer._id} style={{ padding: '10px', marginBottom: '10px' }}>
                                    <Box mb={2}>
                                        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: answer.answer }} />
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {answer.userName} - {format(new Date(answer.createdDate), 'MMMM d, yyyy')}
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <IconButton onClick={() => handleAnswerLike(answer._id)}>
                                                <ThumbUpIcon />
                                            </IconButton>
                                            <Typography variant="body2">{answer.likes.length}</Typography>

                                            <IconButton onClick={() => handleAnswerDislike(answer._id)}>
                                                <ThumbDownIcon />
                                            </IconButton>
                                            <Typography variant="body2">{answer.dislikes.length}</Typography>

                                            <IconButton onClick={() => setShowCommentField(showCommentField === answer._id ? null : answer._id)}>
                                                <CommentIcon />
                                            </IconButton>
                                            <Typography variant="body2">{(answerComments[answer._id] || []).length}</Typography>
                                        </Box>
                                    </Box>

                                    {showCommentField === answer._id && (
                                        <Box mt={2}>
                                            <TextField
                                                label="Add comment"
                                                fullWidth
                                                value={newComment}
                                                onChange={handleInputChange(setNewComment)}
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{ marginTop: '10px' }}
                                                onClick={() => handleAddItem('comment', ques, answer._id)}
                                            >
                                                Add Comment
                                            </Button>
                                        </Box>
                                    )}

                                    {answerComments[answer._id] && answerComments[answer._id].length > 0 && (
                                        <Box mt={2}>
                                            <Typography variant="subtitle2">{answerComments[answer._id].length} Comments:</Typography>
                                            {answerComments[answer._id].map((comment) => (
                                                <Paper key={comment._id} style={{ padding: '10px', backgroundColor: '#f1f1f1', marginBottom: '5px' }}>
                                                    <Typography variant="body2">
                                                        {comment.comment}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {comment.userName} - {format(new Date(comment.createdDate), 'MMMM d, yyyy')}
                                                    </Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    )}
                                </Paper>
                            ))}
                        </Box>
                    </Grid>
                )}
            </Grid>

          {/* Answer Field */}
            <Box mt={3}>
                <Button variant="outlined" onClick={() => setShowAnswerField(!showAnswerField)}>
                    {showAnswerField ? 'Cancel' : 'Add an Answer'}
                </Button>
                {showAnswerField && (
                    <Box mt={2}>
                        <ReactQuill
                            value={newAnswer}
                            onChange={handleQuillChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '10px' }}
                            onClick={() => handleAddItem('answer', ques)}
                        >
                            Submit Answer
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

