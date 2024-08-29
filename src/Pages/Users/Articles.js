import React, { useState } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";


export default function Articles() {
  const [modules, setModules] = useState({
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
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  });
  const [formats, setFormats] = useState([
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ]);

  const [communities, setCommunities] = useState([
    { tagName: "#reactjs", tId: 1 },
    { tagName: "#angular", tId: 2 },
    { tagName: "#nodejs", tId: 3 },
    { tagName: "#Reactjs", tId: 4 },
    { tagName: "#javascript", tId: 5 },
  ]);

  const [selectedTags, setSelectedTags] = useState([]);
  const [access, setAccess] = useState("public");
  const [postArticle, setPostArticle] = useState({
    _id: "",
    tittle: "",
    content: "",
    communityTag: [],
    shared_count: 0,
    isPublished: false,
    comments: [],
    access: "",
    created_date: "",
  });

  const handleHeaderProcedureContentChange = (content) => {
    postArticle.tittle = content;
  };

  const handleBodyProcedureContentChange = (content) => {
    postArticle.content = content;
  };

  const handleAccessChange = (event) => {
    setAccess(event.target.value);
  };

  const savePost = () => {
    postArticle.communityTag = selectedTags;
    postArticle.access = access;
    console.log(postArticle, "129");
    
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={savePost}>
          Post Article
        </Button>
      </div>
      <h1 style={{ fontSize: "20px" }}>Article Labels</h1>
      <div style={{ justifyContent: "center" }}>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          placeholder="write your content ...."
          onChange={handleHeaderProcedureContentChange}
          style={{ height: "100px" }}
        ></ReactQuill>
      </div>
      <h1 style={{ fontSize: "20px", marginTop: "56px" }}>Article Content</h1>
      <div style={{ justifyContent: "center" }}>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          placeholder="write your content ...."
          onChange={handleBodyProcedureContentChange}
          style={{ height: "220px" }}
        ></ReactQuill>
      </div>
      <Grid container spacing={2} style={{ marginTop: "56px" }}>
        <Grid item xs={12} md={6}>
          <h1 style={{ fontSize: "20px" }}>Community Tag's</h1>
          <Autocomplete
            multiple
            options={communities}
            getOptionLabel={(option) => option.tagName}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setSelectedTags(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Tags"
                placeholder="Tags"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h1 style={{ fontSize: "20px" }}>Access</h1>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="access"
              name="access"
              value={access}
              onChange={handleAccessChange}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public"
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}
