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

    const [userAction, setUserAction] = useState({
        likedQuestions: [],
        dislikedQuestions: [],
        likedAnswers: [],
        dislikedAnswers: [],
        likedComments: {},
        dislikedComments: {}
    });


    const handleLikeDislike = async (type, id, action, userId, token) => {
        try {
            const response = await fetch('http://172.17.15.253:3002/questions/addLikesDislikes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    type: type,
                    action: action,
                    userId: userId
                })
            });
            const result = await response.json();
            if (result.success) {
                // Update the count based on the action performed
                if (type === 'question') {
                    if (action === 'like') {
                        setQuestion(prevQuestion => ({
                            ...prevQuestion,
                            likes: [...prevQuestion.likes, userId]
                        }));
                    } else if (action === 'dislike') {
                        setQuestion(prevQuestion => ({
                            ...prevQuestion,
                            dislikes: [...prevQuestion.dislikes, userId]
                        }));
                    }
                } else if (type === 'answer') {
                    setAnswers(prevAnswers =>
                        prevAnswers.map(answer =>
                            answer._id === id
                                ? action === 'like'
                                    ? { ...answer, likes: [...answer.likes, userId] }
                                    : { ...answer, dislikes: [...answer.dislikes, userId] }
                                : answer
                        )
                    );
                }
                else if (type === 'comment') {
                    // Update answerComments state with like/dislike count
                    setAnswerComments(prevAnswerComments => ({
                        ...prevAnswerComments,
                        [id]: {
                            ...prevAnswerComments[id],
                            likes: action === 'like' ? prevAnswerComments[id].likes + 1 : prevAnswerComments[id].likes - 1,
                            dislikes: action === 'dislike' ? prevAnswerComments[id].dislikes + 1 : prevAnswerComments[id].dislikes - 1
                        }
                    }));
                }
                
            } else {
                console.error('Error performing action:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLikeDislikeClick = (type, id, action) => {
        console.log(type, id, action);
        if (['like', 'dislike'].includes(action)) {
            handleLikeDislike(type, id, action, userToken.userId, token);
        }
    };
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
                console.log(data, "question");

                setGetComments(data.questionComments?.comments || []);
                setAnswers(data.answers);


                setUserAction({
                    likedQuestions: data.likes.filter(like => like.userId === userToken.userId),
                    dislikedQuestions: data.dislikes.filter(dislike => dislike.userId === userToken.userId),
                    likedAnswers: data.answers.filter(answer => answer.likes.includes(userToken.userId)).map(answer => answer._id),
                    dislikedAnswers: data.answers.filter(answer => answer.dislikes.includes(userToken.userId)).map(answer => answer._id),
                });

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

    const handleQuillChange = (value) => {
        setNewAnswer(value);
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
                                    <IconButton onClick={() => handleLikeDislikeClick('question', ques, 'like')} aria-label="like"
                                        color={userAction.likedQuestions.includes(ques) ? 'primary' : 'default'}>
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <Typography variant="body2">{question.likes?.length}</Typography>

                                    <IconButton onClick={() => handleLikeDislikeClick('question', ques, 'dislike')} aria-label="dislike">
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
                                                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="textSecondary">
                                                        {comment.userName} - {format(new Date(comment.createdDate), 'MMMM d, yyyy')}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center">
                                                        <IconButton onClick={() => handleLikeDislikeClick('comment', comment._id, 'like')}>
                                                            <ThumbUpIcon />
                                                        </IconButton>
                                                        <Typography variant="body2">{comment.likesCount}</Typography>

                                                        <IconButton onClick={() => handleLikeDislikeClick('comment', comment._id, 'dislike')}>
                                                            <ThumbDownIcon />
                                                        </IconButton>
                                                        <Typography variant="body2">{comment.dislikesCount}</Typography>
                                                    </Box>
                                                </Box>
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
                                            <IconButton onClick={() => handleLikeDislikeClick('answer', answer._id, 'like')} 
                                                 color={userAction.likedAnswers.includes(answer._id) ? 'primary' : 'default'}>
                                                <ThumbUpIcon />
                                            </IconButton>
                                            <Typography variant="body2">{answer.likes.length}</Typography>

                                            <IconButton onClick={() => handleLikeDislikeClick('answer', answer._id, 'dislike')} 
                                                color={userAction.dislikedAnswers.includes(answer._id) ? 'primary' : 'default'}>
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
                                                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="textSecondary">
                                                            {comment.userName} - {format(new Date(comment.createdDate), 'MMMM d, yyyy')}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center">
                                                            <IconButton onClick={() => handleLikeDislikeClick('comment', comment._id, 'like')}>
                                                                <ThumbUpIcon />
                                                            </IconButton>
                                                            <Typography variant="body2">{comment.likesCount}</Typography>

                                                            <IconButton onClick={() => handleLikeDislikeClick('comment', comment._id, 'dislike')}>
                                                                <ThumbDownIcon />
                                                            </IconButton>
                                                            <Typography variant="body2">{comment.dislikesCount}</Typography>

                                                        </Box>
                                                    </Box>

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
                    {showAnswerField ? 'Cancel' : 'Add Answer'}
                </Button>
                {showAnswerField && (
                    <Box mt={2}>
                        <ReactQuill
                            value={newAnswer}
                            onChange={handleQuillChange} style={{ height: "200px", marginBottom: '50px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '10px' }}
                            onClick={() => handleAddItem('answer', ques)}
                        >
                            Post Answer
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}








// import React, { useContext, useEffect, useState } from 'react';
// import { Container, Typography, Button, Box, Grid, Paper, IconButton, Chip, TextField } from '@mui/material';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import CommentIcon from '@mui/icons-material/Comment';
// import { format } from 'date-fns';
// import { AuthContext } from '../../ServiceHelper/AuthContext';
// import DOMPurify from 'dompurify';
// import { useLocation } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import ReactQuill from 'react-quill';

// const stripHtmlTags = (html) => {
//     return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
// };

// export default function Posts() {
//     const [newAnswer, setNewAnswer] = useState('');
//     const [newComment, setNewComment] = useState('');
//     const [newQuestionComment, setNewQuestionComment] = useState('');
//     const [showAnswerField, setShowAnswerField] = useState(null);
//     const { token } = useContext(AuthContext);
//     const [userToken, setUserToken] = useState({});
//     const [communities, setCommunities] = useState({});
//     const [getComments, setGetComments] = useState([]);
//     const [answers, setAnswers] = useState([]);
//     const [answerComments, setAnswerComments] = useState({});
//     const [showCommentField, setShowCommentField] = useState(null);
//     const [showQuestionCommentField, setShowQuestionCommentField] = useState(null);
//     const [question, setQuestion] = useState([]);
//     const location = useLocation();
//     const { ques } = location.state || {};

//     const [userAction, setUserAction] = useState({
//         likedQuestions: [],
//         dislikedQuestions: [],
//         likedAnswers: [],
//         dislikedAnswers: [],
//     });


//     useEffect(() => {
//         if (typeof token === 'string') {
//             try {
//                 const decodedToken = jwtDecode(token);
//                 setUserToken(decodedToken);
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//             }
//         }

//         async function fetchData() {
//             try {
//                 const response = await fetch(`http://172.17.15.253:3002/questions/answers-comments/${ques}`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });
//                 const data = await response.json();
//                 setQuestion(data);
//                 setGetComments(data.questionComments?.comments || []);
//                 setAnswers(data.answers);

//                 // Set user actions for likes/dislikes
//                 // setUserAction({
//                 //     likedQuestions: data.likes.filter(like => like.userId === userToken.userId),
//                 //     dislikedQuestions: data.dislikes.filter(dislike => dislike.userId === userToken.userId),
//                 //     likedAnswers: data.answers.filter(answer => answer.likes.includes(userToken.userId)).map(answer => answer._id),
//                 //     dislikedAnswers: data.answers.filter(answer => answer.dislikes.includes(userToken.userId)).map(answer => answer._id),
//                 // });

//                 setUserAction({
//                     likedQuestions: data.likes.filter(like => like.userId === userToken.userId).map(like => like.questionId),
//                     dislikedQuestions: data.dislikes.filter(dislike => dislike.userId === userToken.userId).map(dislike => dislike.questionId),
//                     likedAnswers: data.answers.filter(answer => answer.likes.includes(userToken.userId)).map(answer => answer._id),
//                     dislikedAnswers: data.answers.filter(answer => answer.dislikes.includes(userToken.userId)).map(answer => answer._id),
//                     likedComments: data.answers.reduce((acc, answer) => {
//                         answer.answerComments.forEach(comment => {
//                             acc[comment._id] = comment.likes.includes(userToken.userId);
//                         });
//                         return acc;
//                     }, {}),
//                     dislikedComments: data.answers.reduce((acc, answer) => {
//                         answer.answerComments.forEach(comment => {
//                             acc[comment._id] = comment.dislikes.includes(userToken.userId);
//                         });
//                         return acc;
//                     }, {})
//                 });
//                 // Initialize answer comments
//                 const answerCommentsData = data.answers.reduce((acc, answer) => {
//                     acc[answer._id] = answer.answerComments || [];
//                     return acc;
//                 }, {});
//                 setAnswerComments(answerCommentsData);

//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         }

//         fetchData();
//     }, [token, ques, userToken.userId]);

//     // useEffect(() => {
//     //     if (typeof token === 'string') {
//     //         try {
//     //             const decodedToken = jwtDecode(token);
//     //             setUserToken(decodedToken);
//     //         } catch (error) {
//     //             console.error('Error decoding token:', error);
//     //         }
//     //     }

//     //     async function fetchData() {
//     //         try {
//     //             const response = await fetch(`http://172.17.15.253:3002/questions/answers-comments/${ques}`, {
//     //                 method: 'GET',
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                     'Authorization': `Bearer ${token}`
//     //                 }
//     //             });
//     //             const data = await response.json();
//     //             setQuestion(data);
//     //             setGetComments(data.questionComments?.comments || []);
//     //             setAnswers(data.answers);

//     //             // Set user actions for likes/dislikes
//     //             setUserAction({
//     //                 likedQuestions: data.likes.filter(like => like.userId === userToken.userId),
//     //                 dislikedQuestions: data.dislikes.filter(dislike => dislike.userId === userToken.userId),
//     //                 likedAnswers: data.answers.filter(answer => answer.likes.includes(userToken.userId)).map(answer => answer._id),
//     //                 dislikedAnswers: data.answers.filter(answer => answer.dislikes.includes(userToken.userId)).map(answer => answer._id),
//     //             });

//     //         } catch (error) {
//     //             console.error('Error fetching data:', error);
//     //         }
//     //     }

//     //     fetchData();
//     // }, [token, ques, userToken.userId]);

//     const handleLikeDislikeClick = async (type, id, action) => {
//         let liked, disliked;

//         if (type === 'question') {
//             liked = userAction.likedQuestions.includes(id);
//             disliked = userAction.dislikedQuestions.includes(id);
//         } else if (type === 'answer') {
//             liked = userAction.likedAnswers.includes(id);
//             disliked = userAction.dislikedAnswers.includes(id);
//         } else if (type === 'comment') {
//             liked = userAction.likedComments[id];
//             disliked = userAction.dislikedComments[id];
//         }

//         if ((action === 'like' && liked) || (action === 'dislike' && disliked)) {
//             return; // Prevent further API hits if the action is already performed
//         }

//         try {
//             const response = await fetch('http://172.17.15.253:3002/questions/addLikesDislikes', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     id,
//                     type,
//                     action,
//                     userId: userToken.userId
//                 })
//             });
//             const result = await response.json();

//             if (result.success) {
//                 if (type === 'question') {
//                     setUserAction(prev => ({
//                         ...prev,
//                         likedQuestions: action === 'like' ? [...prev.likedQuestions, id] : prev.likedQuestions,
//                         dislikedQuestions: action === 'dislike' ? [...prev.dislikedQuestions, id] : prev.dislikedQuestions,
//                     }));
//                 } else if (type === 'answer') {
//                     setUserAction(prev => ({
//                         ...prev,
//                         likedAnswers: action === 'like' ? [...prev.likedAnswers, id] : prev.likedAnswers,
//                         dislikedAnswers: action === 'dislike' ? [...prev.dislikedAnswers, id] : prev.dislikedAnswers,
//                     }));
//                 } else if (type === 'comment') {
//                                         setUserAction(prev => ({
//                                             ...prev,
//                                             likedComments: { ...prev.likedComments, [id]: action === 'like' },
//                                             dislikedComments: { ...prev.dislikedComments, [id]: action === 'dislike' },
//                                         }));
//                                     }
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const handleInputChange = (setter) => (event) => {
//         setter(event.target.value);
//     };

//     const handleAddItem = async (type, postId, answerId = null) => {
//         let referenceId, commentText, sanitizedComment;

//         if (type === 'answer' && newAnswer.trim()) {
//             const sanitizedAnswer = stripHtmlTags(newAnswer);
//             try {
//                 const response = await fetch(`http://172.17.15.253:3002/answers/addAnswer/${ques}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     body: JSON.stringify({
//                         answer: sanitizedAnswer,
//                         userId: userToken.userId
//                     })
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     setAnswers([...answers, {
//                         _id: result.data.answer._id,
//                         userName: 'User Name',
//                         createdDate: new Date(result.data.answer.createdDate),
//                         answer: sanitizedAnswer,
//                         likes: 0,
//                         dislikes: 0,
//                         answerComments: []
//                     }]);
//                     setNewAnswer('');
//                     setShowAnswerField(null);

//                 } else {
//                     console.error('Error adding answer:', result.message);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         } else if ((type === 'comment' && newComment.trim()) || (type === 'questionComment' && newQuestionComment.trim())) {
//             referenceId = type === 'comment' ? answerId : postId;
//             commentText = type === 'comment' ? newComment : newQuestionComment;
//             sanitizedComment = stripHtmlTags(commentText);
//             try {
//                 const response = await fetch('http://172.17.15.253:3002/comments/addComment', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     body: JSON.stringify({
//                         referenceId: String(referenceId),
//                         comment: sanitizedComment,
//                         userId: userToken.userId
//                     })
//                 });
//                 const result = await response.json();
//                 if (result.success) {
//                     if (type === 'comment') {
//                         setAnswerComments({
//                             ...answerComments,
//                             [answerId]: [...(answerComments[answerId] || []), {
//                                 _id: result.data.comment._id,
//                                 userId: 'User Comments',
//                                 createdDate: new Date(result.data.comment.createdDate),
//                                 comment: sanitizedComment
//                             }]
//                         });
//                         setNewComment('');
//                         setShowCommentField(null);
//                     } else {
//                         setGetComments([...getComments, {
//                             _id: result.data.comment._id,
//                             userId: 'User Comments',
//                             createdDate: new Date(result.data.comment.createdDate),
//                             comment: sanitizedComment
//                         }]);
//                         setNewQuestionComment('');
//                         setShowQuestionCommentField(null);
//                     }
//                 } else {
//                     console.error('Error adding comment:', result.message);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         }
//     };

//     const handleQuillChange = (value) => {
//         setNewAnswer(value);
//     };


//     return (
//         <Container>
//             <Box my={4}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Posts
//                 </Typography>
//             </Box>

//             <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                     {question.question ? (
//                         <Paper style={{ padding: '10px' }}>
//                             <Typography variant="h5" component="h5" gutterBottom>
//                                 {question.question}
//                             </Typography>
//                             <Typography variant="body1" gutterBottom>
//                                 {question.description}
//                             </Typography>

//                             <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
//                                 <Typography variant="body2" color="textSecondary">
//                                     Posted by {question.userName} on {format(new Date(question.createdDate), 'MMMM d, yyyy')}
//                                 </Typography>
//                                 <Box display="flex" alignItems="center">
//                                     <IconButton
//                                         onClick={() => handleLikeDislikeClick('question', ques, 'like')}
//                                         color={userAction.likedQuestions.includes(ques) ? 'primary' : 'default'}
//                                     >
//                                         <ThumbUpIcon />
//                                     </IconButton>
//                                     <Typography variant="body2">{question.likes?.length}</Typography>

//                                     <IconButton
//                                         onClick={() => handleLikeDislikeClick('question', ques, 'dislike')}
//                                         color={userAction.dislikedQuestions.includes(ques) ? 'secondary' : 'default'}
//                                     >
//                                         <ThumbDownIcon />
//                                     </IconButton>
//                                     <Typography variant="body2">{question.dislikes?.length}</Typography>
//                                     <IconButton onClick={() => setShowQuestionCommentField(ques)}>
//                                         <CommentIcon />
//                                     </IconButton>
//                                     <Typography variant="body2">{getComments.length}</Typography>

//                                 </Box>
//                             </Box>

//                             {showQuestionCommentField === ques && (
//                                 <Box mt={2}>
//                                     <TextField
//                                         label="Add comment"
//                                         fullWidth
//                                         value={newQuestionComment}
//                                         onChange={handleInputChange(setNewQuestionComment)}
//                                     />
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         style={{ marginTop: '10px' }}
//                                         onClick={() => handleAddItem('questionComment', ques)}
//                                     >
//                                         Add Comment
//                                     </Button>
//                                 </Box>
//                             )}

//                             {getComments.length > 0 && (
//                                 <Box mt={2}>
//                                     <Typography variant="h6" gutterBottom>
//                                         Comments
//                                     </Typography>
//                                     {getComments.map((comment) => (

//                                         <Paper key={comment._id} style={{ padding: '10px', backgroundColor: '#f1f1f1', marginBottom: '5px' }}>
//                                             <Typography variant="body1">
//                                                 {comment.comment}
//                                             </Typography>
//                                             <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
//                                                 <Typography variant="body2" color="textSecondary">
//                                                     {comment.userName} - {format(new Date(comment.createdDate), 'MMMM d, yyyy')}
//                                                 </Typography>
//                                                 <Box display="flex" alignItems="center">
//                                                     <IconButton >
//                                                         <ThumbUpIcon />
//                                                     </IconButton>
//                                                     <Typography variant="body2">{comment.likesCount}</Typography>
//                                                     <IconButton >
//                                                         <ThumbDownIcon />
//                                                     </IconButton>
//                                                     <Typography variant="body2">{comment.dislikesCount}</Typography>
//                                                     <IconButton >
//                                                         <CommentIcon />
//                                                     </IconButton>
//                                                 </Box>
//                                             </Box>

//                                         </Paper>

//                                     ))}
//                                 </Box>
//                             )}

//                         </Paper>
//                     ) : (
//                         <Typography variant="body1" color="textSecondary">
//                             No question data available or loading...
//                         </Typography>
//                     )}
//                 </Grid>

//                 {answers.length > 0 && (
//                     <Grid item xs={12}>
//                         <Box>
//                             <Typography variant="h6" component="h2" gutterBottom style={{ color: 'rgb(33, 150, 243)' }}>
//                                 {answers.length} Answers:
//                             </Typography>

//                             {answers.map((answer) => (
//                                 <Paper key={answer._id} style={{ padding: '10px', marginBottom: '10px' }}>
//                                     <Box mb={2}>
//                                         <Typography variant="body2" dangerouslySetInnerHTML={{ __html: answer.answer }} />
//                                     </Box>
//                                     <Box display="flex" justifyContent="space-between" alignItems="center">
//                                         <Typography variant="body2" color="textSecondary">
//                                             {answer.userName} - {format(new Date(answer.createdDate), 'MMMM d, yyyy')}
//                                         </Typography>
//                                         <Box display="flex" alignItems="center">
//                                             <IconButton
//                                                 onClick={() => handleLikeDislikeClick('answer', answer._id, 'like')}
//                                                 color={userAction.likedAnswers.includes(answer._id) ? 'primary' : 'default'}
//                                             >
//                                                 <ThumbUpIcon />
//                                             </IconButton>
//                                             <Typography variant="body2">{answer.likes.length}</Typography>

//                                             <IconButton
//                                                 onClick={() => handleLikeDislikeClick('answer', answer._id, 'dislike')}
//                                                 color={userAction.dislikedAnswers.includes(answer._id) ? 'secondary' : 'default'}
//                                             >
//                                                 <ThumbDownIcon />
//                                             </IconButton>
//                                             <Typography variant="body2">{answer.dislikes.length}</Typography>
//                                             <IconButton onClick={() => setShowCommentField(showCommentField === answer._id ? null : answer._id)}>
//                                                 <CommentIcon />
//                                             </IconButton>
//                                             <Typography variant="body2">{(answerComments[answer._id] || []).length}</Typography>
//                                         </Box>
//                                     </Box>

//                                     {showCommentField === answer._id && (
//                                         <Box mt={2}>
//                                             <TextField
//                                                 label="Add comment"
//                                                 fullWidth
//                                                 value={newComment}
//                                                 onChange={handleInputChange(setNewComment)}
//                                             />
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 style={{ marginTop: '10px' }}
//                                                 onClick={() => handleAddItem('comment', ques, answer._id)}
//                                             >
//                                                 Add Comment
//                                             </Button>
//                                         </Box>
//                                     )}



//                                     {answerComments[answer._id] && answerComments[answer._id].length > 0 && (
//                                         <Box mt={2}>
//                                             <Typography variant="h6" gutterBottom>
//                                                 Comments
//                                             </Typography>
//                                             {answerComments[answer._id].map((comment) => (
//                                                 <Paper key={comment._id} style={{ padding: '10px', backgroundColor: '#f1f1f1', marginBottom: '5px' }}>
//                                                     <Typography variant="body1">
//                                                         {comment.comment}
//                                                     </Typography>
//                                                     <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
//                                                         <Typography variant="body2" color="textSecondary">
//                                                             {comment.userName} - {format(new Date(comment.createdDate), 'MMMM d, yyyy')}
//                                                         </Typography>
//                                                         <Box display="flex" alignItems="center">
//                                                             <IconButton>
//                                                                 <ThumbUpIcon />
//                                                             </IconButton>
//                                                             <Typography variant="body2">{comment.likesCount}</Typography>
//                                                             <IconButton>
//                                                                 <ThumbDownIcon />
//                                                             </IconButton>
//                                                             <Typography variant="body2">{comment.dislikesCount}</Typography>
//                                                             <IconButton>
//                                                                 <CommentIcon />
//                                                             </IconButton>
//                                                         </Box>
//                                                     </Box>
//                                                 </Paper>
//                                             ))}
//                                         </Box>
//                                     )}

//                                 </Paper>
//                             ))}
//                         </Box>
//                     </Grid>
//                 )}
//             </Grid>
//             {/* Answer Field */}
//             <Box mt={3}>
//                 <Button variant="outlined" onClick={() => setShowAnswerField(!showAnswerField)}>
//                     {showAnswerField ? 'Cancel' : 'Add Answer'}
//                 </Button>
//                 {showAnswerField && (
//                     <Box mt={2}>
//                         <ReactQuill
//                             value={newAnswer}
//                             onChange={handleQuillChange} style={{ height: "200px", marginBottom: '50px' }}
//                         />
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             style={{ marginTop: '10px' }}
//                             onClick={() => handleAddItem('answer', ques)}
//                         >
//                             Post Answer
//                         </Button>
//                     </Box>
//                 )}
//             </Box>
//         </Container>
//     );
// }
