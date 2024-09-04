import * as React from 'react';
import { Box, Avatar, Typography, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Badge, Link, Tab, Tabs } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import { format } from 'date-fns';

export default function UserDetails() {
  const { token } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState('stats');
  const [postsTabValue, setPostsTabValue] = useState('questions');
  const [communities, setCommunities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [articles, setArticles] = useState([]);

  const location = useLocation();
  const { user } = location.state || {};

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePostsTabChange = (event, newValue) => {
    setPostsTabValue(newValue);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const communityResponse = await fetch('http://172.17.15.253:3002/lookup/getCommunity', {
          method: 'GET',
          headers: {
            observe: 'response',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
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
        console.error('API error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    async function fetchPostsData() {
      try {
        if (tabValue === 'posts') {
          if (postsTabValue === 'questions') {
            const response = await fetch(`http://172.17.15.253:3002/questions/getQuestionByUserId/${user._id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            setQuestions(data.questions);
          }

          if (postsTabValue === 'answers') {
            const response = await fetch(`http://172.17.15.253:3002/answers/getAnswersByUserId/${user._id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch answers');
            }

            const data = await response.json();
            setAnswers(data.answers);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPostsData();

  }, [postsTabValue, tabValue, user._id, token]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        if (tabValue === 'articles') {
          const response = await fetch(`http://172.17.15.253:3002/articles/getArticles/${user._id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch articles');
          }

          const data = await response.json();
          setArticles(data.article);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }

    fetchArticles();

  }, [tabValue, user._id, token]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading data</Typography>;

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ display: 'flex', mb: 2 }}>
        <Avatar alt="User Avatar" src={user.profilePicture} sx={{ width: 100, height: 100, m: 2 }} />
        <CardContent>
          <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
          <Typography variant="body2" color="textSecondary">Joined on {format(new Date(user.createdDate), 'MMMM dd, yyyy')}</Typography>
          <Typography variant="body2" color="textSecondary">{user.email}</Typography>
          <Typography variant="body2" color="text.secondary" style={{ color: '#0D416B' }}>
            {user.community.map(id => communities[id] || 'Unknown Community').join(', ')}
          </Typography>
        </CardContent>
      </Card>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs">
        <Tab label="Stats" value="stats" />
        <Tab label="Posts" value="posts" />
        <Tab label="Articles" value="articles" />
      </Tabs>
      {tabValue === 'stats' && (
        <Box p={2}>
          <Typography>Points: {user.points}</Typography>
          <Typography>Questions: {questions.length}</Typography>
          <Typography>Answers: {answers.length}</Typography>
        </Box>
      )}
      {tabValue === 'posts' && (
        <Box p={2}>
          <Tabs value={postsTabValue} onChange={handlePostsTabChange} aria-label="posts tabs">
            <Tab label="Questions" value="questions" />
            <Tab label="Answers" value="answers" />
          </Tabs>
          {postsTabValue === 'questions' && (
            <List>
              {questions.map((question, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <QuestionMarkIcon />
                  </ListItemAvatar>
                  <ListItemText primary={question.question} secondary={format(new Date(question.createdDate), 'yyyy-MM-dd kk:mm:ss')} />
                </ListItem>
              ))}
            </List>
          )}
          {postsTabValue === 'answers' && (
            <List>
              {answers.map((answer, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <QuestionAnswerIcon />
                  </ListItemAvatar>
                  <ListItemText primary={answer.answer} secondary={format(new Date(answer.createdDate), 'yyyy-MM-dd kk:mm:ss')} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
      {tabValue === 'articles' && (
        <Box p={2}>
          <List>
            {articles.map((article, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <InsertDriveFileIcon />
                </ListItemAvatar>
                <Box>
                  <Typography variant="body2" dangerouslySetInnerHTML={{ __html: article.title }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      userName - {format(new Date(article.createdDate), 'MMMM d, yyyy')}
                    </Typography></Box></Box>

              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}