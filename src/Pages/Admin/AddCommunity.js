import React, { useState } from 'react';
import { Dialog, Button, DialogContent, DialogActions, DialogContentText, Grid, TextField, Typography } from '@mui/material';
import { useForm } from "react-hook-form";

function AddCommunities(props) {
    const { register, handleSubmit, formState } = useForm({
        mode: "onTouched",
    });
    const { errors } = formState;
    const handleClose = () => {
        props.handleSignupClose();
    };

    const onSubmit = async (data) => {
        const token = localStorage.getItem('token');
        const url = 'http://172.17.15.253:3002/lookup/addCommunity';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${errorText}`);
            }
            const result = await response.json();
            if (props.signupOpen) {
                props.handleSignupClose(false)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Dialog
            keepMounted
            open={props.signupOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            aria-describedby="alert-dialog-slide-description">
            <Typography variant="h5" component="div" align="center" gutterBottom>
                <b>Add Community</b>
            </Typography>
            <DialogContent>
                <DialogContentText>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="label"
                                    label="Label"
                                    variant="outlined"
                                    margin="normal"
                                    {...register("label", {
                                        required: "Label is Required",
                                        pattern: {
                                            value: /^[A-Za-z]+$/,
                                            message: "Label must contain only alphabets",
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Label cannot exceed 20 characters",
                                        },
                                    })}
                                    error={!!errors.label}
                                    helperText={errors.label?.message}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="tag"
                                    label="Tag"
                                    variant="outlined"
                                    margin="normal"
                                    {...register("tag", {
                                        required: "Tag is Required",
                                        pattern: {
                                            value: /^[A-Za-z]+$/,
                                            message: "Tag must contain only alphabets",
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Tag cannot exceed 20 characters",
                                        },
                                    })}
                                    error={!!errors.tag}
                                    helperText={errors.tag?.message}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="value"
                                    label="Value"
                                    variant="outlined"
                                    margin="normal"
                                    {...register("value", {
                                        required: "Value is Required",
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "Value must contain only numbers",
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Value cannot exceed 20 characters",
                                        },
                                    })}
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="description"
                                    label="Description"
                                    variant="outlined"
                                    margin="normal"
                                    {...register("description", {
                                        required: "Description is Required",
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: "Description must contain only alphabets and spaces",
                                        },
                                        maxLength: {
                                            value: 40,
                                            message: "Description cannot exceed 40 characters",
                                        },
                                    })}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Grid>
                            <Grid item style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button variant="contained" type="submit">
                                    Add Details
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default AddCommunities;