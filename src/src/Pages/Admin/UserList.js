import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { IconButton, InputBase, Paper, Fab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const UserCard = styled(Card)(({ theme }) => ({
  borderRadius: 5,
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  backgroundColor: theme.palette.background.paper,
  width: '100%',
}));

const TruncatedText = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));


const cardData = [
  {
    img: 'https://talk.miraclesoft.com/avatar/snistala',
    userName: "Karthik Nistala",
    communityName: 'Angular Community.',
    questions: "3",
    solution: 4,
  },
  {
    img: 'https://talk.miraclesoft.com/avatar/snistala',
    userName: "Karthik Nistala",
    communityName: 'Angular Community.',
    questions: "3",
    solution: 4,
  }, {
    img: 'https://talk.miraclesoft.com/avatar/snistala',
    userName: "Karthik Nistala",
    communityName: 'Angular Community.',
    questions: "3",
    solution: 4,
  }, {
    img: 'https://talk.miraclesoft.com/avatar/snistala',
    userName: "Karthik Nistala",
    communityName: 'Angular Community.',
    questions: "3",
    solution: 4,
  }, {
    img: 'https://talk.miraclesoft.com/avatar/snistala',
    userName: "Karthik Nistala",
    communityName: 'Angular Community.',
    questions: "3",
    solution: 4,
  }, {
    img: 'https://talk.miraclesoft.com/avatar/snistala',
    userName: "Karthik Nistala",
    communityName: 'Angular Community.',
    questions: "3",
    solution: 4,
  },
];

export default function UserList() {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/users-details');
  };

  const handleFabClick = () => {
    console.log('FAB clicked');
  };

  return (
    <>
      <br />
      <Grid container spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for User Name or Community Name"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
      <br />
      <Grid container spacing={2}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <UserCard onClick={handleCardClick}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Avatar
                      alt={card.userName}
                      src={card.img}
                      sx={{ width: 56, height: 56 }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TruncatedText variant="h6">{card.userName}</TruncatedText>
                    <TruncatedText variant="body2" color="text.secondary">
                      {card.communityName}
                    </TruncatedText>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Questions count:</strong> {card.questions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Solution count:</strong> {card.solution}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </UserCard>
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleFabClick}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
