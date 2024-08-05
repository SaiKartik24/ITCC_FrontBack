import * as React from 'react';
import { Box, Avatar, Typography, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Badge, Link, Tab, Tabs } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function UserDetails() {
  const [tabValue, setTabValue] = React.useState('stats');
  const [postsTabValue, setPostsTabValue] = React.useState('questions');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePostsTabChange = (event, newValue) => {
    setPostsTabValue(newValue);
  };

  const questions = [
    { votes: 135, title: "Windows XP or later Windows: How can I run a batch file in the background with no window displayed?", date: "Nov 18, 2008" },
    { votes: 77, title: "Conditional logging with minimal cyclomatic complexity", date: "Sep 19, 2008" },
    { votes: 13, title: "Windows XP or later Windows: How can I run a batch file in the background with no window displayed?", date: "Nov 18, 2008" },
    { votes: 7, title: "Conditional logging with minimal cyclomatic complexity", date: "Sep 19, 2008" },
  ];

  const answers = [
    { votes: 45, title: "Use the start command in a batch file to run a script in the background.", date: "Nov 20, 2008" },
    { votes: 30, title: "Conditional logging can be implemented using a logging framework with support for filters.", date: "Sep 21, 2008" },
    { votes: 4, title: "Use the start command in a batch file to run a script in the background.", date: "Nov 20, 2008" },
    { votes: 3, title: "Conditional logging can be implemented using a logging framework with support for filters.", date: "Sep 21, 2008" },
  ];

  const articles = [
    { name: "Project Plan", path: "", date: "Jul 15, 2023" },
    { name: "Design Document", path: "", date: "Aug 1, 2023" },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ display: 'flex', mb: 2 }}>
        <Avatar alt="User Avatar" src="https://talk.miraclesoft.com/avatar/snistala" sx={{ width: 100, height: 100, m: 2 }} />
        <CardContent>
          <Typography variant="h5">Karthik Nistala</Typography>
          <Typography variant="body2" color="textSecondary">Member for 15 years, 10 months</Typography>
        </CardContent>
      </Card>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs">
        <Tab label="Stats" value="stats" />
        <Tab label="Posts" value="posts" />
        <Tab label="Articles" value="articles" />
      </Tabs>
      {tabValue === 'stats' && (
        <Box p={2}>
          <Typography>Points: 373</Typography>
          <Typography>Answers: 29</Typography>
          <Typography>Questions: 16</Typography>
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
                    <Badge badgeContent={question.votes} color="primary">
                      <QuestionAnswerIcon />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={question.title} secondary={question.date} />
                </ListItem>
              ))}
            </List>
          )}
          {postsTabValue === 'answers' && (
            <List>
              {answers.map((answer, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Badge badgeContent={answer.votes} color="primary">
                      <QuestionAnswerIcon />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={answer.title} secondary={answer.date} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

     {/* Articles tab  */}
      {tabValue === 'articles' && (
        <Box p={2}>
          <List>
            {articles.map((article, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <InsertDriveFileIcon />
                </ListItemAvatar>
                <ListItemText primary={<Link href={article.path} target="_blank">{article.name}</Link>} secondary={article.date} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}