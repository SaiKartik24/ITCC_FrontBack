import React, { useContext, useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Avatar, Grid, IconButton, Menu, MenuItem, ListItem, ListItemText, List, Badge } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ListItemAvatar } from '@material-ui/core';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { format } from 'date-fns';


export default function CommunityDetails() {
  const { token } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [communityUser, setCommunityUser] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [articles, setarticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const communityValue = location.state || '';

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (value === 0) {

          setLoading(true);

          const response = await fetch(`http://172.17.15.253:3002/community/getUsersByCommunity/${communityValue}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          setUsers(data.questions);
          if(data.questions == []){
            
          }
        }
        else if (value === 1) {
          setLoading(true);

          const response = await fetch(`http://172.17.15.253:3002/community/getQuestionsByCommunity/${communityValue}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          setQuestions(data.questions);
        }
        else if (value === 2) {
          setLoading(true);

          const response = await fetch(`http://172.17.15.253:3002/community/getArticlesByCommunity/${communityValue}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          setarticles(data.articles);
        }
      }
      catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();

  }, [value]); // Dependency on `value` to trigger on tab change

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="community tabs">
        <Tab label="Community Users" />
        <Tab label="Community Posts" />
        <Tab label="Community Articles" />
      </Tabs>

      {value === 0 && (
        <Box p={3}>
          <Grid container spacing={2}>
            {users.map((user, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                  </Menu>
                  <Avatar src={user.profilePicture} sx={{ width: 56, height: 56, mb: 2 }} />
                  <Typography variant="h6">{user.firstName}{user.firstName}</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {value === 1 && (
        <Box p={3}>
          <Typography variant="h6">{loading ? 'Loading...' : `${questions.length} questions`}</Typography>
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && (
            <List>
              {questions.map((question, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    {/* <Badge badgeContent={question.votes} color="primary"> */}
                    <QuestionMarkIcon />
                    {/* </Badge> */}
                  </ListItemAvatar>
                  <ListItemText primary={question.question} secondary={format(new Date(question.createdDate), 'yyyy-MM-dd kk:mm:ss')}/>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {value === 2 && (
        <Box p={3}>
          {/* <Typography variant="h6">{loading ? 'Loading...' : `${questions.length} questions`}</Typography> */}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && (
            <List>
              {articles.map((article, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    {/* <Badge badgeContent={question.votes} color="primary"> */}
                    <InsertDriveFileIcon />
                    {/* </Badge> */}
                  </ListItemAvatar>
                  <ListItemText primary={article.title} secondary={format(new Date(article.createdDate), 'yyyy-MM-dd kk:mm:ss')}/>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
}
