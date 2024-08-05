import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Registration from './Registration';
import { useAuth } from "../../ServiceHelper/AuthContext";
// import usePost from '../Services/usePost';

const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({ mode: 'onTouched' });
  const [open, setOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [triggerPost, setTriggerPost] = useState(false);
//   const { saveToken } = useAuth();
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const { response, loading, error } = usePost('/login', postData, triggerPost);

  const onSubmit = async (data) => {
    setTriggerPost(false); // Reset trigger
    setPostData({ email: data.email, password: data.password });
    setTriggerPost(true); // Trigger post request
  };

  useEffect(() => {
    if (response) {
      saveToken(response.token);
      navigate('/dashboard');
    }
  }, [response, navigate, saveToken]);

  useEffect(() => {
    if (error) {
      console.error('API error:', error);
    }
  }, [error]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);

  return (
    <div style={{
      backgroundSize: 'cover',
      backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSwEI15YPKGidtXzXZIxcTJ4IIqZIis5RLdbxLyjq-vZsymS0gp9oQtr0rBkCCXLJjto&usqp=CAU")`,
      height: '100vh'
    }}>
      <Container maxWidth="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Paper elevation={6} style={{ display: 'flex', minHeight: '370px', width: '670px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
              <Grid item xs={6} style={{ padding: '45px' }}>
                <Typography variant="h5" align="left" style={{ fontWeight: '550' }}>
                  Login
                </Typography>
                <Typography align="left" style={{ marginBottom: '5px', fontSize: '74%' }}>
                  Don't Have an Account? Create your Account
                </Typography>

                <Controller name="email" control={control} defaultValue=""
                  rules={{
                    required: "Email Id is Required",
                    pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: "Invalid email format" }
                  }}
                  render={({ field }) => (
                    <TextField fullWidth variant="outlined" label="Email Id" type="email" margin="normal" style={{ marginLeft: '0px' }}
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller name="password" control={control} defaultValue=""
                  rules={{ required: "Password is Required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Password"
                      type="password"
                      margin="normal"
                      {...field}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                {error && (
                  <Typography color="error" align="left" style={{ marginBottom: '16px' }}>
                    Login failed. Please check your email and password.
                  </Typography>
                )}

                <Grid container alignItems="center" style={{ marginTop: '16px', justifyContent: 'space-between', marginBottom: '21px' }}>
                  <Grid item>
                    <Link style={{ color: 'blue', cursor: 'pointer' }} onClick={handleClickOpen}>
                      Forgot Password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" type="submit" disabled={loading}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} style={{
                backgroundColor: '#1565c0', color: 'white', padding: '40px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', clipPath: 'polygon(100% 0, 0 0%, 100% 100%)'
              }}>
                <Typography variant="h4" align="right" gutterBottom style={{ fontSize: '1.5rem', color: 'white' }}>
                  Welcome Back
                </Typography>
                <Typography align="right" style={{ marginBottom: '30px', fontSize: '0.75rem', whiteSpace: 'normal', maxWidth: '80%' }}>
                  Simply create your account by clicking the Signup button
                </Typography>
                <Button variant="outlined" style={{ color: 'white', borderColor: 'white' }} onClick={handleSignupOpen}>
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <Registration signupOpen={signupOpen} handleSignupClose={handleSignupClose} />
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Forgot Password"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField fullWidth variant="outlined" label="Email Id" type="email" margin="normal" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
