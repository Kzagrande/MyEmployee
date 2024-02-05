import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Typography,Box } from "@mui/material";

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

  const handleSubmit = () => {
    // Implement logic to submit the form data
    // For example, send a request to update the employee data
    // You can use axios or your preferred method for making API calls

    // After submitting, close the modal
    onClose();
  };

  return (
    <Box sx={{backgroundColor:'white',margin:'1em',padding:'1em'}}>
      <Typography variant="h6">Edit Employee</Typography>
      <form>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          {/* Add other form fields as needed */}
          {/* Example fields */}
          <Grid item xs={6}>
            <TextField
              label="Field 3"
              name="field3"
              value={formData.field3}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 4"
              name="field4"
              value={formData.field4}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 5"
              name="field5"
              value={formData.field5}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 6"
              name="field6"
              value={formData.field6}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 7"
              name="field7"
              value={formData.field7}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 8"
              name="field8"
              value={formData.field8}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 9"
              name="field9"
              value={formData.field9}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Field 10"
              name="field10"
              value={formData.field10}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button variant="contained" onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </form>
    </Box>
  );
};

export default HrAddForm;
