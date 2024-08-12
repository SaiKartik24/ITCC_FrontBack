import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { Box, Button, TextField, Chip, Paper, List, ListItem, InputAdornment } from '@mui/material';
import useGet from '../../ServiceHelper/Api/useGet';
import usePost from "../../ServiceHelper/Api/usePost";
import { useForm } from "react-hook-form";
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import DOMPurify from 'dompurify';

export default function Post() {
  const { token } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [getUrl, setGetUrl] = useState("/lookup/getCommunity");
  const getHook = useGet(getUrl);
  const [community, setCommunity] = useState([]);
  const { register, handleSubmit, setValue } = useForm({ mode: "onTouched"});
  const [postData, setPostData] = useState(null);
  const [postUrl, setPostUrl] = useState("");
  const [triggerPost, setTriggerPost] = useState(false);
  const { response, loading, error } = usePost(postUrl, postData, triggerPost);
  const [userToken, setUserToken] = useState({});


  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  };
  const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
  ];
  const stripHtmlTags = (html) => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  };
  // Fetching community data
  useEffect(() => {
    if (getHook.data !== null) {
      setCommunity(getHook.data);
    }
  }, [getHook.data]);

  // Decoding token to get user information
  useEffect(() => {
    if (typeof token === 'string') {
      try {
        const decodedToken = jwtDecode(token);
        setUserToken(decodedToken);
        setValue("userId", decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('Token must be a string');
    }
  }, [token, setValue]);

  //post
  const onSubmit = async (data) => {
    try {
      let tagedValue = 0;
      community.forEach((x) => {
        if (tags.includes(x.tag)) {
          tagedValue += Number(x.value);
        }
      });
      const response = await fetch('http://172.17.15.253:3002/questions/addQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: data.question,
          description: data.description,
          community: tagedValue,
          userId: userToken.userId,
        })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
    } catch (error) {
      console.error('Submit failed:', error);
    }
  }
  // Handle input change for tags
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.startsWith('#')) {
      const filteredSuggestions = community.filter(element => {
        if (element.tag && typeof element.tag === 'string') {
          return element.tag.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      }).map(element => element.tag);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  // Add tag to the list
  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInputValue('');
    setSuggestions([]);
  };
  // Handle key down event for tags
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue !== '') {
      addTag(inputValue);
      event.preventDefault(); // Prevent form submission on Enter key
    }
  };
  // Remove tag from the list
  const removeTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <TextField
          id="question"
          variant="outlined"
          placeholder='Write your Query..'
          fullWidth
          margin="normal"
          {...register("question", { required: true })}
        />
        <ReactQuill
          theme="snow"
          id='description'
          modules={modules}
          formats={formats}
          placeholder="Write your content ...."
          onChange={(content) => setValue("description", content)}
          style={{ height: "220px", marginTop: '1rem' }}
        />
        <Box mt={6}>
          <TextField
            variant="outlined"
            id='tag'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type # to tag"
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(index)}
                      style={{ margin: '0.5rem' }}
                    />
                  ))}
                </InputAdornment>
              ),
            }}
          />
          {suggestions.length > 0 && (
            <Paper style={{ marginTop: '1rem' }}>
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem button key={index} onClick={() => addTag(suggestion)}>
                    {suggestion}
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-start">
          <Button type="submit" variant="contained" >Post your Answer</Button>
        </Box>
      </Box>
    </form>
  );
}
