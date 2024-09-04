import React, { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from '../../ServiceHelper/AuthContext';

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

export default function UserList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userResponse = await fetch('http://172.17.15.253:3002/users', {
          method: 'GET',
          headers: {
            observe: 'response',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!userResponse.ok) {
          throw new Error('API request failed');
        }
        const userData = await userResponse.json();
        setUsers(userData.data);

        // Fetch community data
        const communityResponse = await fetch('http://172.17.15.253:3002/lookup/getCommunity', {
          method: 'GET',
          headers: {
            observe: 'response',
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
        console.error('API error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const handleCardClick = (user) => {
    navigate('/users-details', { state: { user } });
  };

  const handleFabClick = () => {
    console.log('FAB clicked');
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading data</Typography>;

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
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <UserCard  onClick={() => handleCardClick(user)}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Avatar
                      alt={user.firstName}
                      src={user.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIAgM6sos3TKKOp9xjnHJHYXTQGAq6hJfSJQ&s"} 
                      sx={{ width: 56, height: 56 }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TruncatedText variant="h6">{user.firstName} {user.lastName}</TruncatedText>
                    <TruncatedText variant="body2" color="text.secondary">
                      {user.community.map(id => communities[id] || 'Unknown Community').join(', ')}
                    </TruncatedText>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Questions:</strong>
                       {/* {card.questions} */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Answers:</strong> 
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
        onClick={handleFabClick}>
        <AddIcon />
      </Fab>
    </>
  );
}
