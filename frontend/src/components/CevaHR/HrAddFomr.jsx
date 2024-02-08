import React, { useState } from "react";
import { Button, Grid, TextField, Typography, Container, InputLabel,Box } from "@mui/material";
import axios from 'axios'

const HrAddForm = ({ employeeData, onClose }) => {
  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    cpf: employeeData ? employeeData.cpf : "",
    // Add other form fields as needed
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Implement logic to submit the form data
      // For example, send a POST request to the server

      const response = await axios.post("http://localhost:3001/hr/add_hr_employees", formData);

      // Handle the response as needed
      console.log("Server response:", response.data);

      // After submitting, close the modal
      // onClose();
    } catch (error) {
      // Handle errors, log or show error messages to the user
      console.error("Error submitting form:", error);
    }
  };

  const formFields = [
    { name: "employee_id", label: "Matrícula", size: "small" },
    { name: "cpf", label: "CPF", size: "small" },
    { name: "name", label: "Name", size: "small" },
    { name: "role_", label: "Role", size: "small" },
    { name: "bu", label: "BU", size: "small" },
    { name: "shift", label: "Shift", size: "small" },
    { name: "schedule_time", label: "Schedule Time", size: "small" },
    { name: "company", label: "Company", size: "small" },
    { name: "status", label: "Status", size: "small" },
    { name: "hire_date", label: "Hire Date", size: "small" },
    { name: "date_of_birth", label: "Date of Birth", size: "small" },
    { name: "termination_date", label: "Terminion Date", size: "small" },
    { name: "reason", label: "Reason", size: "small" },
    { name: "ethnicity", label: "Etinicity", size: "small" },
    { name: "gender", label: "Gender", size: "small" },
    { name: "neighborhood", label: "Neighborhood", size: "small" },
    { name: "city", label: "City", size: "small" },
    { name: "email", label: "Email", size: "small" },
    { name: "phone", label: "Phone", size: "small" },
    { name: "presence_integration", label: "Presention Integration", size: "small" },
    { name: "integration_date", label: "Integration Date", size: "small" },
  ];

  const renderTextField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
      <TextField
        size={field.size}
        name={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid>
  );
  return (
    <Container sx={{ backgroundColor: 'white', margin: '1em', padding: '1em' }}>
      <Typography variant="h6">Edit Employee</Typography>
      <form>
        <Grid container spacing={0.5} sx={{marginBottom:'1em'}}>
          {formFields.map(renderTextField) }
        </Grid>
        <Box sx={{}}>       
           <Button variant="contained" color="primary" onClick={handleSubmit} sx={{marginRight:'1em'}} >
          Save
        </Button>
        <Button variant="contained" onClick={onClose} >
          Cancel
        </Button>
        </Box>
      </form>
    </Container>
  );
};

export default HrAddForm;
