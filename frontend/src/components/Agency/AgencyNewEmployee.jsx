import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Box, Card,OutlinedInput,CardHeader,CardContent,InputLabel   } from '@mui/material';
import axios from 'axios'

const AgencyNewEmployee = () => {
    const [formData, setFormData] = useState({
      employee_id: '',
      name: '',
      cpf: '',
      role_: '',
      bu: '',
      shift: '',
      schedule_time: '',
      company: '',
      status: '',
      hire_date: '',
      date_of_biate: '',
      termination: '',
      reason: '',
      ethnicity: '',
      gender: '',
      neighborhood: '',
      city: '',
      email: '',
      phone: '',
    });

  const handleInputChange = (id) => (event) => {
    setFormData({ ...formData, [id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Realiza a requisição POST usando Axios
      const response = await axios.post('http://localhost:3001/auth/add_employee', formData);
  
      console.log('Success:', response.data);
      // Lide com o sucesso, por exemplo, exiba uma mensagem de sucesso ou redirecione
    } catch (error) {
      console.error('Error:', error);
      // Lide com o erro, por exemplo, exiba uma mensagem de erro
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card variant="outlined" sx={{ width: '100%', marginTop: 2, padding: 2 }} style={{ background: '#f0eef1' }}>
          <CardHeader title="Employee Form" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                {fields.map((field) => (
                  <Grid item xs={6} key={field.id}>
                    <InputLabel htmlFor={field.id}>{field.label}</InputLabel>
                    <OutlinedInput
                    
                      fullWidth
                      margin="normal"
                      id={field.id}
                      value={formData[field.id] || ''}
                      onChange={handleInputChange(field.id)}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

const fields = [
    { id: 'employee_id', label: 'Employee ID' },
    { id: 'name', label: 'Name' },
    { id: 'cpf', label: 'CPF' },
    { id: 'role_', label: 'Role' },
    { id: 'bu', label: 'Business Unit' },
    { id: 'shift', label: 'Shift' },
    { id: 'schedule_time', label: 'Schedule Time' },
    { id: 'company', label: 'Company' },
    { id: 'status', label: 'Status' },
    { id: 'hire_date', label: 'Hire Date' },
    { id: 'date_of_biate', label: 'Date of BI/ATE' },
    { id: 'termination', label: 'Termination' },
    { id: 'reason', label: 'Reason' },
    { id: 'ethnicity', label: 'Ethnicity' },
    { id: 'gender', label: 'Gender' },
    { id: 'neighborhood', label: 'Neighborhood' },
    { id: 'city', label: 'City' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
  ];

export default AgencyNewEmployee;
