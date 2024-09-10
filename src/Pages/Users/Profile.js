import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Typography, Box, Card, CardContent, Divider, Button, IconButton, Breadcrumbs } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Profile = () => {
    const { token } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state || {};

    const [profile, setProfileData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://172.17.15.253:3002/users/getUserById/66d74360e54edc704d70001f', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('API request failed');
                }

                const profileData = await response.json();
                setProfileData(profileData.user);
            } catch (error) {
                console.error('API error:', error);
            }
        }
        fetchData();
    }, [token]);

    if (!profile) return <Typography variant="h5" align="center">Loading Profile...</Typography>;

    return (

        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#f7f9fc',
            padding: 4,
            position: 'relative',
        }}>
            {/* Back Button */}
            <IconButton
                onClick={() => navigate(-1)}
                sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    backgroundColor: '#fff',
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                }}
            >
                <ArrowBackIcon />
            </IconButton>

            {/* Profile Card */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 8,
            }}>
                <Card sx={{
                    display: 'flex',
                    maxWidth: '800px',
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: 6,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    padding: 4,
                    '@media (max-width: 600px)': {
                        flexDirection: 'column',
                    },
                }}>
                    {/* Profile Picture on Left */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 2,
                        flexShrink: 0,
                    }}>
                        <Avatar
                            alt={`${profile.firstName} ${profile.lastName}`}
                            src={profile.profilePicture}
                            sx={{ width: 180, height: 180, boxShadow: 3, marginRight: 3 }}
                        />
                    </Box>

                    {/* Profile Info */}
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight="bold">
                            {profile.firstName} {profile.lastName}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {profile.userRole.charAt(0).toUpperCase() + profile.userRole.slice(1)}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                            <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {profile.email}
                        </Typography>

                        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                            <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {profile.phoneNumber}
                        </Typography>

                        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                            <PointOfSaleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Points: {profile.points}
                        </Typography>

                        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                            <CalendarTodayIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Joined on: {new Date(profile.createdDate).toLocaleDateString()}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* <Button variant="contained" color="primary" fullWidth>
              Edit Profile
            </Button> */}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Profile;