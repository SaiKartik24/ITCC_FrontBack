import React, { useEffect, useState } from 'react';
import { Container, Typography, Chip, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ViewQuestion() {
    const location = useLocation();
    const { ques } = location.state || {};

    const [responseData, setResponseData] = useState(null); // Start with null to indicate no data yet
    const [communities, setCommunities] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);

        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/questions/getQuestionById/${ques}`, {
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
                console.log(data);

                setResponseData(data.result); // Set the result data
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };

        async function community() {
            try {
                const communityResponse = await fetch('http://172.17.15.253:3002/lookup/getCommunity', {
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
                    acc[community.value] = community.label;
                    return acc;
                }, {});
                setCommunities(communityMap);
            } catch (error) {
                console.error('Error fetching community data:', error);
            }
        }
        fetchData();
        community();
    }, [ques]);

    return (
        <Container>

            <Box my={4}>
                <Typography variant="h5" >
                    Question Details
                </Typography>
            </Box>
            {responseData ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        {responseData.question}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: responseData.description }} />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        {/* <Typography variant="h6">Tags:</Typography> */}
                        {responseData.community.map((communityId, index) => (
                            <Typography variant="body2">
                                Tags: {communities[communityId]}
                            </Typography>
                        ))}
                    </Box>
                </>
            ) : (
                <Typography variant="h6">Loading...</Typography>
            )}
        </Container>
    );
}
