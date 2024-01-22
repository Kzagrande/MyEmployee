import React, { useState } from 'react';
import { TextField, Button, Container, Grid } from '@mui/material';

const AddEmployeeForm = () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform POST request to http://localhost:3001/auth/add_employee with formData
    // You can use a library like axios or fetch for making the POST request
    // Example using fetch:
    fetch('http://localhost:3001/auth/add_employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // Handle success, e.g., show a success message or redirect
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error, e.g., show an error message
      });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={6} key={field.id}>
              <TextField
                className="input-field"
                id={field.id}
                label={field.label}
                variant="outlined"
                fullWidth
                value={formData[field.id]}
                onChange={handleInputChange(field.id)}
              />
            </Grid>
          ))}
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
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

export default AddEmployeeForm;
