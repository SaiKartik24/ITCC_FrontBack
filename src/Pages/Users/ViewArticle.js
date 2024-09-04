import React, { useState, useEffect } from 'react';
import { Container, Typography, Chip, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';

export default function ViewArticle() {
    const [responseData, setResponseData] = useState()
    const [data, setData] = useState({
        "_id": "",
        "tittle": "<p>Tittle Connect</p>",
        "content": "<p><span style=\"color: rgb(26, 30, 35);\">Use radio buttons when the user needs to see all available options. If available options can be collapsed, consider using a&nbsp;because it uses less space.</span></p>",
        "communityTag": [
            {
                "tagName": "#nodejs",
                "tId": 3
            },
            {
                "tagName": "#reactjs",
                "tId": 1
            },
            {
                "tagName": "#Reactjs",
                "tId": 4
            }
        ],
        "shared_count": 0,
        "isPublished": false,
        "comments": [],
        "access": "private",
        "created_date": ""
    })
    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.253:3002/articles/getArticles/${decoded.userId}`, {
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
                setResponseData(data.questions);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <Container>
            <Typography variant="h4" gutterBottom dangerouslySetInnerHTML={{ __html: data.tittle }} />
            <Box sx={{ my: 2 }}>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: data.content }} />
            </Box>
            <Box sx={{ my: 2 }}>
                <Typography variant="h6">Tags:</Typography>
                {data.communityTag.map((tag) => (
                    <Chip key={tag.tId} label={tag.tagName} sx={{ mr: 1, mb: 1 }} />
                ))}
            </Box>
            <Box sx={{ my: 2 }}>
                <Typography variant="body2">Shared Count: {data.shared_count}</Typography>
                <Typography variant="body2">Published: {data.isPublished ? "Yes" : "No"}</Typography>
                <Typography variant="body2">Access: {data.access}</Typography>
                <Typography variant="body2">Created Date: {data.created_date ? data.created_date : "N/A"}</Typography>
            </Box>
        </Container>
    );
};