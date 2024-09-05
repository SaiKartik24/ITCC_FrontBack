import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Chip } from '@mui/material';
import Card from '@mui/material/Card';
import { useLocation } from 'react-router-dom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export default function ViewArticle() {
    const [responseData, setResponseData] = useState(null);
    const [communities, setCommunities] = useState({});
    const location = useLocation();

    useEffect(() => {
        const articleId = location.state || '';
        console.log(articleId.id);
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/articles/getArticlesById/${articleId.id}`, {
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
                console.log(data.result);
                setResponseData(Array.isArray(data.result) ? data.result : [data.result]);
            } catch (error) {
                console.error('Error fetching article data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCommunityData = async () => {
            try {
                const communityResponse = await fetch('http://172.17.15.253:3002/lookup/getCommunity', {
                    method: 'GET',
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
        };
        fetchCommunityData();
    }, []);
    return (
        <Container >
            <Card style={{ padding: '25px', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                {responseData && responseData?.map((article, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                        <Typography variant="h4" gutterBottom dangerouslySetInnerHTML={{ __html: article.title }} />
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: article.content }} />
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="h6"><b>Tags</b></Typography>
                            {article.community.map((communityId, index) => (
                                <Chip
                                    key={index}
                                    label={communities[communityId] || 'Unknown Community'}
                                    style={{ marginRight: '5px', backgroundColor: '#2196f3', color: 'white', marginTop: '20px', fontSize: '11px', height: '25px' }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ my: 2 }}>

                            <Typography variant="body2" style={{ display: 'flex', justifyContent: 'end' }}>
                                <b>Created Date: &nbsp;</b> {new Date(article.createdDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </Typography><br></br>
                            <div style={{ display: 'flex', justifyContent: 'end', cursor: 'pointer' }}>
                                <ThumbUpOffAltIcon />&nbsp;<ThumbDownOffAltIcon />
                            </div>
                        </Box>
                    </Box>
                ))}
            </Card>
        </Container>
    );
}
