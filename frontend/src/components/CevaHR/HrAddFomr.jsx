import React, { useState } from "react";
import { Button, Grid, TextField, Typography, Container, InputLabel,Box } from "@mui/material";
import axios from 'axios'

const HrAddForm = ({ employeeData, onClose,updateMode }) => {

  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    cpf: employeeData ? employeeData.cpf : "",
    employee_id: employeeData ? employeeData.employee_id : "",
    role_: employeeData ? employeeData.role_ : "",
    bu: employeeData ? employeeData.bu : "",
    shift: employeeData ? employeeData.shift : "",
    schedule_time: employeeData ? employeeData.schedule_time : "",
    company: employeeData ? employeeData.company : "",
    status: employeeData ? employeeData.status : "",
    hire_date: employeeData ? employeeData.hire_date : "",
    date_of_birth: employeeData ? employeeData.date_of_birth : "",
    ethnicity: employeeData ? employeeData.ethnicity : "",
    gender: employeeData ? employeeData.gender : "",
    neighborhood: employeeData ? employeeData.neighborhood : "",
    city: employeeData ? employeeData.city : "",
    email: employeeData ? employeeData.email : "",
    integration_date: employeeData ? employeeData.integration_date : "",
    phone: employeeData ? employeeData.phone : "",
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
  const handleUpdate = async () => {
    try {
      // Implement logic to submit the form data
      // For example, send a POST request to the server

      const response = await axios.post("http://localhost:3001/hr/update_hr_employee", formData);

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
    { name: "ethnicity", label: "Etinicity", size: "small" },
    { name: "gender", label: "Gender", size: "small" },
    { name: "neighborhood", label: "Neighborhood", size: "small" },
    { name: "city", label: "City", size: "small" },
    { name: "email", label: "Email", size: "small" },
    { name: "phone", label: "Phone", size: "small" },
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
          {updateMode ? (
            <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ marginRight: '1em' }} >
              Update
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: '1em' }} >
              Save
            </Button>
          )}
          <Button variant="contained" onClick={onClose} >
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default HrAddForm;
