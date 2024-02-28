import React, { useState } from 'react';
import { encryptWithPublicKey, getPublicEncryptionKey, importPublicKey } from "../utilities/security";
import { Button, TextField, Grid, Container, Card, CardContent, Typography } from '@mui/material';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        npiNumber: '',
        businessAddress: '',
        telephoneNumber: '',
        emailAddress: '',
    });

    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        npiNumber: false,
        businessAddress: false,
        telephoneNumber: false,
        emailAddress: false,
    });

    const [formState, setFormState] = useState('editing'); // 'editing', 'submitting', 'submitted'

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            newErrors[key] = formData[key] === '';
        });
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: false,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent weird form submission behaviors

        if (!validateForm()) {
            console.error('Please fill out all fields.');
            return;
        }

        setFormState('submitting');

        try {
            const publicKey = await importPublicKey(await getPublicEncryptionKey());
            const piiData = {};
            for (const [key, value] of Object.entries(formData)) {
                piiData[key] = await encryptWithPublicKey(value, publicKey);
            }
            console.log(`Unencrypted Form Data: `, formData);
            console.log(`Encrypted Form Data: `, piiData);
            // Here, you would typically send the piiData to your server
            console.log("fetch post the encrypted data across to the HTTPS server which has the private key to decrypt it");

            // Simulate successful submission, by waiting for fetch post call for 2 seconds
            setTimeout(() => {
                setFormState('submitted');
            }, 2000);
        } catch (error) {
            console.error("Failed to submit the form:", error);
            // Handle the error state appropriately
            // For instance, you might want to set the form state to 'error' and display a message to the user
            setFormState('error'); // Assuming 'error' is a new state you'll handle
        }
    };


    const handleClose = () => {
        // Reset form or close modal/dialog here
        // For simplicity, we're just logging to the console
        console.log("Form closed");
        // Reset form state if needed
        // setFormState('editing');
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card>
                <CardContent>
                    {formState === 'editing' && (
                        <>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Healthcare Provider Registration
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} direction="column">
                                    {Object.keys(formData).map((field, index) => (
                                        <Grid item key={index}>
                                            <TextField
                                                fullWidth
                                                error={errors[field]}
                                                helperText={errors[field] ? 'This field is required' : ''}
                                                name={field}
                                                label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                                placeholder={`Enter ${field}`}
                                                onChange={handleChange}
                                                value={formData[field]}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item>
                                        <Button type="submit" variant="contained" color="primary">
                                            Register
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </>
                    )}
                    {formState === 'submitting' && (
                        <Typography variant="h5" component="h2" gutterBottom>
                            Submitting...
                        </Typography>
                    )}
                    {formState === 'submitted' && (
                        <>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Registration successful!
                            </Typography>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                Close
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default RegistrationForm;
