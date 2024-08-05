import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Avatar, Grid, IconButton, Menu, MenuItem, ListItem, ListItemText, List, Badge } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ListItemAvatar } from '@material-ui/core';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const users = [
  { name: 'Karthik Nistala', email: 'Karthike@gmail.com', profilePicture: '/path/to/profile-pic1.jpg' },
  { name: 'Vani Pidudgu', email: 'Vani@gmail.com', profilePicture: '/path/to/profile-pic2.jpg' },
  { name: 'Sambhavi Prathi', email: 'Sambhavi@gmail.com', profilePicture: '/path/to/profile-pic1.jpg' },
  { name: 'Karthik Nistala', email: 'Karthike@gmail.com', profilePicture: '/path/to/profile-pic1.jpg' },
  { name: 'Vani Pidudgu', email: 'Vani@gmail.com', profilePicture: '/path/to/profile-pic2.jpg' },
  { name: 'Sambhavi Prathi', email: 'Sambhavi@gmail.com', profilePicture: '/path/to/profile-pic1.jpg' },
  { name: 'Karthik Nistala', email: 'Karthike@gmail.com', profilePicture: '/path/to/profile-pic1.jpg' },
  { name: 'Vani Pidudgu', email: 'Vani@gmail.com', profilePicture: '/path/to/profile-pic2.jpg' },
];

export default function CommunityDetails() {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const questions = [
    { votes: 135, title: "Windows XP or later Windows: How can I run a batch file in the background with no window displayed?", date: "Nov 18, 2008" },
    { votes: 77, title: "Conditional logging with minimal cyclomatic complexity", date: "Sep 19, 2008" },
    { votes: 13, title: "Windows XP or later Windows: How can I run a batch file in the background with no window displayed?", date: "Nov 18, 2008" },
    { votes: 7, title: "Conditional logging with minimal cyclomatic complexity", date: "Sep 19, 2008" },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="community tabs">
        <Tab label="Community Users" />
        <Tab label="Community Posts" />
      </Tabs>
      {value === 0 && (
        <Box p={3}>
          <Grid container spacing={2}>
            {users.map((user, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {value === 1 && (
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
    </Box>
  );
}
