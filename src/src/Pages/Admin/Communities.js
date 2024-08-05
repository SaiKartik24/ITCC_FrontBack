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

const cardData = [
  {
    communityName: "Angular",
    description: 'Angular is an open-source web application framework maintained by Google and a community of developers.',
    Questions: "/static/images/cards/contemplative-reptile.jpg",
    User: 45,
    Tech: "Another description about lizards.",
  },
  {
    communityName: "React JS",
    description: 'ReactJS, also known as React, is a popular JavaScript library for building user interfaces.',
    Questions: "/static/Questionss/cards/contemplative-reptile.jpg",
    User: 78,
    Tech: "Another description about lizards.",
  },
  {
    communityName: "JavaScript",
    description: 'JavaScript is a scripting language that enables you to create dynamically updating content, control multimedia, animate images.',
    Questions: "/static/Questionss/cards/contemplative-reptile.jpg",
    User: 90,
    Tech: "Another description about lizards.",
  },
  {
    communityName: "Node JS",
    description: 'Node. js is ideal for building fast and scalable web servers that handle numerous simultaneous connections.',
    Questions: "/static/Questionss/cards/contemplative-reptile.jpg",
    User: 80,
    Tech: "Another description about lizards.",
  },
];

export default function Communities() {
  const [value, setValue] = React.useState(2);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/community-details');
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
              <CardContent sx={{ flex: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {card.communityName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  <b>Tech:</b> {card.Tech}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>User:</b> {card.User}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Questions:</b> {card.Questions.length}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Box sx={{ '& > legend': { mt: 2 } }}>
                  <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => setValue(newValue)}
                  />
                </Box>
              </CardActions>
            </UserCard>
          </Grid>
          
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
