import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import { Fab, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import useGet from '../../ServiceHelper/Api/useGet';
import { useEffect } from 'react';
import { useState } from 'react';
import AddCommunities from './AddCommunities';

const UserCard = styled(Card)(({ theme }) => ({
  borderRadius: 5,
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

export default function Communities() {
  const navigate = useNavigate();
  const [getUrl, setGetUrl] = React.useState("/communities");
  const [community, setCommunity] = React.useState([]);
  const getHook = useGet(getUrl);
  const handleSignupClose = () => setSignupOpen(false);
  const handleSignupOpen = () => setSignupOpen(true);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userResponse = await fetch('http://172.17.15.253:3002/communities', {
        method: 'GET',
        headers: {
          observe: 'response',
          'Content-Type': 'application/json',
        }
      });
      if (!userResponse.ok) {
        throw new Error('API request failed');
      }
      const communityData = await userResponse.json();
      setCommunity(communityData);
    }
    fetchData()
  }, [getHook.data]);

  const handleCardClick = (communityId) => {
    navigate('/community-details', { state: communityId });
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
            placeholder="Search for Community Name"
            inputProps={{ 'aria-label': 'search community' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
      <br />
      <Grid container spacing={2}>
        {community.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.value}>
            <UserCard onClick={() => handleCardClick(card.value)}>
              <CardContent sx={{ flex: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {card.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  <b>Tech:</b> {card.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Users:</b> {card.usersCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Questions:</b> {card.totalQuestionsCount}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Box sx={{ '& > legend': { mt: 2 } }}>
                  <Rating
                    name={`rating-${card.value}`}
                    value={card.ratings || 0}
                    precision={0.5}
                  />
                </Box>
              </CardActions>
            </UserCard>
          </Grid>
        ))}
      </Grid>
      <AddCommunities signupOpen={signupOpen} handleSignupClose={handleSignupClose} />
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleSignupOpen}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
