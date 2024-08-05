import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid,TextField,Button,Dialog,DialogTitle, DialogContent,Typography, FormControl,FormHelperText,InputLabel,
  MenuItem,Select, Box} from "@mui/material";
import { DevTool } from "@hookform/devtools";
import usePost from "../../ServiceHelper/Api/usePost";
import useGet from "../../ServiceHelper/Api/useGet";

function Registration(props) {
  const form = useForm({
    mode: "onTouched",
  });
  const { register, handleSubmit, control, formState } = form;
  const { errors } = formState;
  const [postUrl, setPostUrl] = useState("");
  const [getUrl, setGetUrl] = useState("");
  const [community, setCommunity] = useState([]);
  const [postData, setPostData] = useState("");
  const [triggerPost, setTriggerPost] = useState(false);
  const { data: data1, loading: loading1, error: error1 } = usePost(postUrl, postData, triggerPost);
  const getHook = useGet(getUrl);

  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getUrl === "") {
      setGetUrl("/users/getCommunity");
    }
    if (getHook.data !== null) {
      setCommunity(getHook.data);
    }
  }, [getHook.data]);

  const applyOnlyNumbers = (event) => {
    const input = event.target.value;
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) || input.length >= 10) {
      event.preventDefault();
    }
  };
  const onSubmit = async (data) => {
    const phoneNumber = data.phoneNumber;
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please provide a valid phone number");
      return;
    }
    try {
      if (!triggerPost) {
        setTriggerPost(true);
        setPostData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          community: selectedCommunity,
        });
        setPostUrl("/users/create");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  const handleClose = () => {
    props.handleSignupClose();
  };

  return (
    <>
      <Dialog open={props.signupOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            <b>REGISTER</b>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                  {...register("firstName", {
                    required: "First Name is Required",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "First Name must contain only alphabets",
                    },
                    maxLength: {
                      value: 40,
                      message: "First Name cannot exceed 40 characters",
                    },
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  margin="normal"
                  {...register("lastName", {
                    required: "Last Name is Required",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "Last Name must contain only alphabets",
                    },
                    maxLength: {
                      value: 40,
                      message: "Last Name cannot exceed 40 characters",
                    },
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="community"
                  control={control}
                  rules={{ required: "Community is Required" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.community}>
                      <InputLabel id="community-label">Community</InputLabel>
                      <Select
                        labelId="community-label"
                        id="community"
                        label="Community"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setSelectedCommunity(e.target.value);
                        }}
                      >
                        {community.map((com) => (
                          <MenuItem key={com.id} value={com.id}>
                            {com.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.community?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} style={{ marginTop: "inherit" }}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  variant="outlined"
                  label="Phone Number"
                  type="tel"
                  id="phoneNumber"
                  margin="normal"
                  {...register("phoneNumber", {
                    required: "Phone Number is Required",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Phone Number must contain only numbers",
                    },
                    maxLength: {
                      value: 10,
                      message: "Phone Number cannot exceed 10 digits",
                    },
                  })}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  onKeyPress={applyOnlyNumbers}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email Id"
                  type="email"
                  id="email"
                  margin="normal"
                  {...register("email", {
                    required: "Email Id is Required",
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px", width: "15%" }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
          <DevTool control={control} />
        </DialogContent>
      </Dialog>
      <DevTool control={control} />
    </>
  );
}

export default Registration;



