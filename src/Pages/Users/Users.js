import React, { useState, useEffect } from 'react';
import {
    Box, Tabs, Tab, Typography, IconButton, ListItem, ListItemText, List,
    Badge, Fab, Paper, InputBase, ListItemAvatar, Pagination
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PostQuestions from './PostQuestions';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Users() {
    const [value, setValue] = useState(0);
    const [signupOpen, setSignupOpen] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const handleChange = (event, newValue) => { setValue(newValue) };
    const handleSignupClose = () => setSignupOpen(false);
    const handleSignupOpen = () => setSignupOpen(true);
    const [subValue, setSubValue] = useState(0);
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState([]);
    const [answerResponseData, setAnswerResponseData] = useState([]);
    const [articles, setArticles] = useState([]);
    const [postResponseData, setPostResponseData] = useState([]);
    const [allArticles, setAllArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPagesAws, setTotalPagesAws] = useState(0);
    const [totalPagesArt, setTotalPagesArt] = useState(0);
    const [totalPagesAllPost, setTotalPagesAllPost] = useState(0);
    const [totalPagesAllArticles, setTotalPagesAllArticles] = useState(0)
    const [postsPage, setPostsPage] = useState(1);
    const [articleData, setArticleData] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        async function communities() {
            try {
                const communityResponse = await fetch('http://172.17.15.253:3002/communityList/getCommunity', {
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
                    acc[community.communityCode] = community.communityName;
                    return acc;
                }, {});
                setCommunities(communityMap);
            } catch (error) {
                console.error('Error fetching community data:', error);
            }
        }
        communities();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const decoded = jwtDecode(token);
        const fetchData = async (url, setter) => {
            try {
                const response = await fetch(url, {
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
                setter(data);
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
            }
        };
        const fetchTabData = () => {
            const page = 1;
            const limit = 50;
            if (value === 0) {
                fetchData(
                    `http://172.17.15.253:3002/questions/getQuestionByUserId/${decoded.userId}?page=${page}&limit=${limit}`,
                    (data) => {
                        setResponseData(data.questions);
                        setTotalPages(Math.ceil(data.pages.total / data.pages.limit) || 0);
                    }
                );
            } else if (value === 1) {
                fetchData(
                    `http://172.17.15.253:3002/answers/getAnswersByUserId/${decoded.userId}?page=${page}&limit=${limit}`,
                    (data) => {
                        setAnswerResponseData(data.answers);
                        setTotalPagesAws(Math.ceil(data.pages.total / data.pages.limit) || 0);
                    }
                );
            } else if (value === 2) {
                fetchData(
                    `http://172.17.15.253:3002/articles/getArticles/${decoded.userId}?page=${page}&limit=${limit}`,
                    (data) => {
                        setArticles(data.article);
                        setTotalPagesArt(Math.ceil(data.pages.total / data.pages.limit) || 0);
                    }
                );
            } else if (value === 3) {
                if (subValue === 0) {
                    fetchData(
                        `http://172.17.15.253:3002/questions?page=${page}&limit=${limit}`,
                        (data) => {
                            setPostResponseData(data.questions);
                            setTotalPagesAllPost(Math.ceil(data.total / data.limit) || 0);
                        }
                    );
                } else if (subValue === 1) {
                    fetchData(
                        `http://172.17.15.253:3002/articles?page=${page}&limit=${limit}`,
                        (data) => {
                            setArticleData(data.articles);
                            setTotalPagesAllArticles(Math.ceil(data.total / data.limit) || 0);
                        }
                    );
                }
            }
        };
        fetchTabData();
    }, [value, subValue]);
    useEffect(() => {
        let filtered = [];
        
        if (searchValue.trim()) {
            switch (value) {
                case 0:
                    filtered = responseData.filter((question) =>
                        question.question.toLowerCase().includes(searchValue.toLowerCase())
                    );
                    break;
                case 1:
                    filtered = answerResponseData.filter((answer) =>
                        answer.answer.toLowerCase().includes(searchValue.toLowerCase())
                    );
                    break;
                case 2:
                    filtered = articles.filter((article) =>
                        article.title.toLowerCase().includes(searchValue.toLowerCase())
                    );
                    break;
                default:
                    switch (subValue) {
                        case 0:
                            filtered = postResponseData.filter((post) =>
                                post.question.toLowerCase().includes(searchValue.toLowerCase())
                            );
                            break;
                        case 1:
                            filtered = articleData.filter((post) =>
                                post.title.toLowerCase().includes(searchValue.toLowerCase())
                            );
                            break;
                        default:
                            break;
                    }
            }
            setFilteredData(filtered);
        } else {
            switch (value) {
                case 0:
                    setFilteredData(responseData);
                    break;
                case 1:
                    setFilteredData(answerResponseData);
                    break;
                case 2:
                    setFilteredData(articles);
                    break;
                default:
                    switch (subValue) {
                        case 0:
                            setFilteredData(postResponseData);
                            break;
                        case 1:
                            setFilteredData(articleData);
                            break;
                        default:
                            break;
                    }
            }
        }
    }, [searchValue, responseData, answerResponseData, articles, postResponseData, value, subValue]);
    
    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };
    const search = () => {
        setSearchValue(searchValue.trim());
    };
    const handleSubChange = (event, newValue) => { setSubValue(newValue) }

    const publicQuestionClick = (ques, question) => {
        const questionStatusList = responseData.map((item) => ({
            question: item.question,
            status: item.status
        }));
        console.log('Question statuses:', questionStatusList);
        const hasMatchingStatus = questionStatusList.some(
            (item) => item.status === 'underReview' || item.status === 'approved' || item.status === 'blocked'
        );
        if (hasMatchingStatus) {
            console.log('if');
            navigate('/question', { state: { ques } });
        } else {
            console.log('else');
            navigate('/user-post', { state: { ques, question } });
        }
    };

    const viewArticleClick = (article) => {
        navigate('/viewArticle', { state: { articleData: article } });
    }
    function truncateText(text, maxLength) {
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
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
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyUp={handleKeyUp}
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
                        <b>{filteredData.length} Questions</b>
                        <List>
                            {filteredData.map((question, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={question.question}
                                        // secondary={
                                        //     <Box display="flex" justifyContent="space-between" alignItems="center">
                                        //         {question.community.map((communityId, index) => (
                                        //             <Typography variant="body2" color="primary">
                                        //                 {communities[communityId]}
                                        //                 <Typography variant="body2" color="textSecondary">
                                        //                     {format(new Date(question.createdDate), 'MMMM d, yyyy')}
                                        //                 </Typography>
                                        //             </Typography>
                                        //         ))}

                                        //         <Typography
                                        //             variant="body2"
                                        //             sx={{
                                        //                 fontWeight: 'bold',
                                        //                 ml: 2,
                                        //                 color:
                                        //                     question.status === 'published' ? green[600] :
                                        //                         question.status === 'approved' ? green[600] :
                                        //                             question.status === 'blocked' ? red[500] :
                                        //                                 question.status === 'Under Review' ? yellow[700] :
                                        //                                     grey[600],
                                        //             }}
                                        //         >
                                        //             {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                                        //         </Typography>
                                        //     </Box>
                                        // }
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => publicQuestionClick(question._id)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {value === 1 && (
                    <Box p={3}>
                        <b>{filteredData.length} Answers</b>
                        <List>
                            {filteredData.map((answer, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Badge badgeContent={answer.votes} color="primary">
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText primary={answer.answer} secondary={format(new Date(answer.createdDate), 'MMMM d, yyyy')}
                                    />
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
                                            <QuestionAnswerIcon />
                                        </Badge>
                                    </ListItemAvatar>
                                    <Box>
                                        <Typography
                                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
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
                    <Box>
                        <Typography></Typography>
                        <Tabs value={subValue} onChange={handleSubChange} aria-label="sub tabs under All Posts">
                            <Tab label="All Questions" value={0} />
                            <Tab label="All Articles" value={1} />
                        </Tabs>

                        {subValue === 0 && (
                            <Box p={3}>
                                <b>{filteredData.length} All Questions</b>
                                {filteredData.map((ques, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Badge color="primary">
                                                <QuestionAnswerIcon />
                                            </Badge>
                                        </ListItemAvatar>
                                        <Box>
                                            <Typography style={{
                                                cursor: 'pointer', fontSize: '16px',
                                                lineHeight: '1.5',
                                            }} variant="body2" dangerouslySetInnerHTML={{ __html: ques.question }} onClick={() => publicQuestionClick(ques._id)} />
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    {ques.userName}     {format(new Date(ques.createdDate), 'MMMM d, yyyy')}
                                                </Typography></Box></Box>

                                    </ListItem>
                                ))}
                            </Box>
                        )}
                        {subValue === 1 && (
                            <Box p={3}>
                                <b>{filteredData.length} Articles</b>
                                {filteredData.map((article, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Badge color="primary">
                                                <QuestionAnswerIcon />
                                            </Badge>
                                        </ListItemAvatar>
                                        <Box>
                                            <Typography style={{
                                                cursor: 'pointer', fontSize: '16px',
                                                lineHeight: '1.5',
                                            }} variant="body2" dangerouslySetInnerHTML={{ __html: article.title }} />
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                            </Box>
                                        </Box>

                                    </ListItem>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPagesAllPost}
                        page={postsPage}
                        onChange={(e, page) => setPostsPage(page)}
                        color="primary"
                    /></Box>
            </Box>
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
