import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Box,
  Typography,
  Container,
  styled
} from '@mui/material';

const StyledContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const FormContainer = styled('div')({
  width: '300px',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <StyledContainer>
      <FormContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign Up
            </Button>
          </Box>
        </form>
      </FormContainer>
    </StyledContainer>
  );
};

export default Register;
