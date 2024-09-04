import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { Box, Button, TextField, Chip, Paper, List, ListItem, InputAdornment, Dialog, DialogTitle, Typography, DialogContent } from '@mui/material';
import useGet from '../../ServiceHelper/Api/useGet';
import usePost from "../../ServiceHelper/Api/usePost";
import { useForm } from "react-hook-form";
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../ServiceHelper/AuthContext';
import useAxiosInstance from '../../ServiceHelper/Services';

export default function PostQuestions(props) {
  const { token } = useContext(AuthContext);
  const axiosInstance = useAxiosInstance();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [getUrl, setGetUrl] = useState("/lookup/getCommunity");
  const getHook = useGet(getUrl);
  const [community, setCommunity] = useState([]);
  const { register, handleSubmit, setValue } = useForm({ mode: "onTouched" });
  const [postData, setPostData] = useState(null);
  const [postUrl, setPostUrl] = useState("");
  const [triggerPost, setTriggerPost] = useState(false);
  const { response, error } = usePost(postUrl, postData, triggerPost);

  const handleClose = () => {
    props.handleSignupClose();
  };

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

  useEffect(() => {
    if (getHook.data !== null) {
      setCommunity(getHook.data);
    }
    if (response) {
      console.log('Post response:', response);
    }
    if (error) {
      console.error('Post error:', error);
    }
  }, [getHook.data, response, error]);

  const onSubmit = (data) => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    try {
      let taggedValue = 0;
      community.forEach((item) => {
        if (tags.includes(item.tag)) {
          taggedValue += Number(item.value);
        }
      });
      setPostData({
        question: data.question,
        description: data.description,
        community: taggedValue,
        userId: decoded.userId,
      });
      setPostUrl("/questions/addQuestion");
      setTriggerPost(true);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

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

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue !== '') {
      addTag(inputValue);
      event.preventDefault();
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };

  return (
    <Dialog open={props.signupOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          <b>Post Question</b>
        </Typography>
      </DialogTitle>
      <DialogContent>
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
              <Button type="submit" variant="contained">Post your Question</Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
