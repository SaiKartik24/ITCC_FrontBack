
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import { TextField, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl, Autocomplete } from "@mui/material";
import useGet from "../../ServiceHelper/Api/useGet";
import usePost from "../../ServiceHelper/Api/usePost";
import { jwtDecode } from "jwt-decode";

const quillModules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    [{ color: ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff"] }]
  ]
};

const quillFormats = [
  "header", "height", "bold", "italic", "underline", "strike", "blockquote",
  "list", "color", "bullet", "indent", "link", "image", "align", "size"
];

export default function Articles() {

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  const { data: communityData, loading: communityLoading, error: communityError } = useGet('/communityList/getCommunity');
  const [selectedTags, setSelectedTags] = useState([]);
  const [access, setAccess] = useState("Public");
  const [postArticle, setPostArticle] = useState({
    title: "",
    content: "",
    community: [],
    createdDate: new Date().toISOString(),
    userId: decoded.userId,
    access: "Public" 
  });
  const [triggerPost, setTriggerPost] = useState(false);

  const { response, loading: postLoading } = usePost('/articles/addArticles', postArticle, triggerPost);

  useEffect(() => {
    if (response) {
      console.log("Article posted successfully", response);
      setTriggerPost(false);
    }
  }, [response]);

  const handleChange = (field) => (value) => {
    setPostArticle(prev => ({ ...prev, [field]: value }));
  };

  const savePost = () => {
    setPostArticle(prev => ({ 
      ...prev, 
      community: selectedTags.map(tag => tag.communityCode), 
      access: access
    }));
    setTriggerPost(true);
  };

  if (communityLoading) return <div>Loading...</div>;
  if (communityError) return <div>Error loading communities</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={savePost} disabled={postLoading}>
          {postLoading ? "Posting..." : "Post Article"}
        </Button>
      </div>

      <h4>Article Title</h4>
      <ReactQuill
        theme="snow"
        modules={quillModules}
        formats={quillFormats}
        placeholder="Write your title..."
        onChange={handleChange('title')}
        style={{ height: "100px" }}
      />

      <h4 style={{ marginTop: "56px" }}>Article Content</h4>
      <ReactQuill
        theme="snow"
        modules={quillModules}
        formats={quillFormats}
        placeholder="Write your content..."
        onChange={handleChange('content')}
        style={{ height: "220px" }}
      />

      <Grid container spacing={2} style={{ marginTop: "56px" }}>
        <Grid item xs={12} md={6}>
          <h4>Community Tags</h4>
          <Autocomplete
            multiple
            options={communityData}
            getOptionLabel={(option) => option.communityName}
            filterSelectedOptions
            onChange={(event, newValue) => setSelectedTags(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Select Tags" placeholder="Tags" />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h4>Access</h4>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="access"
              name="access"
              value={access}
              onChange={(event) => setAccess(event.target.value)} 
            >
              <FormControlLabel value="Public" control={<Radio />} label="Public" />
              <FormControlLabel value="Private" control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}
