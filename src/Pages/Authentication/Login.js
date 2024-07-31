import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, TextField, Button, Typography, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Registration from './Registration';

const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onTouched'
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('http://172.17.15.253:3002/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const responseData = await response.json();
      console.log('API response:', responseData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('API error:', error);
      setErrorMessage('Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignupOpen = () => {
    setSignupOpen(true);
  };

  const handleSignupClose = () => {
    setSignupOpen(false);
  };

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
              <Grid container item xs={6} style={{ padding: '24px' }}>
                <Typography variant="h4" align="left" style={{ fontWeight: '600' }}>
                  Login
                </Typography>
                <Typography variant="body2" align="left" style={{ marginBottom: '16px' }}>
                  Don't Have an Account? Create your Account
                </Typography>

                <Controller name="email" control={control} defaultValue=""
                  rules={{
                    required: "Email Id is Required",
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "Invalid email format"
                    }
                  }}
                  render={({ field }) => (
                    <TextField fullWidth variant="outlined" label="Email Id" type="email" margin="normal"
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Controller name="password" control={control} defaultValue=""
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

                {errorMessage && (
                  <Typography variant="body2" color="error" align="left" style={{ marginBottom: '16px' }}>
                    {errorMessage}
                  </Typography>
                )}

                <Grid container alignItems="center" style={{ marginTop: '16px', justifyContent: 'space-between' }}>
                  <Grid item>
                    <Link variant="body2" style={{ color: 'blue', cursor: 'pointer' }} onClick={handleClickOpen}>
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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Forgot Password"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              fullWidth
              variant="outlined"
              label="Email Id"
              type="email"
              margin="normal"
            />
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
