import React, { useState } from 'react';
import {Snackbar,Alert, Button, Container, Grid, Box, Card,OutlinedInput,CardHeader,CardContent,InputLabel   } from '@mui/material';
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from 'axios'

const AgencyNewEmployee = () => {

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
    { id: 'date_of_birth', label: 'Date of Birthday' },
    { id: 'ethnicity', label: 'Ethnicity' },
    { id: 'gender', label: 'Gender' },
    { id: 'neighborhood', label: 'Neighborhood' },
    { id: 'city', label: 'City' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
  ];

    const [formData, setFormData] = useState({
      employee_id: '123456',
      name: 'yan',
      cpf: '48007840850',
      role_: 'Data Specialist',
      bu: '55480 - NAVE D',
      shift: 'Admin',
      schedule_time: 'Comercial',
      company: 'CEVA',
      status: 'Ativo',
      hire_date: '2023-10-06',
      date_of_birth: '1970-06-18',
      ethnicity: 'Parda',
      gender: 'Masculino',
      neighborhood: 'Cocaia',
      city: 'Guarulhos',
      email: 'bortoletoyan@gmail.com',
      phone: '11958878432',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msgEP, msgEPData] = useState("");
  

  const handleInputChange = (id) => (event) => {
    setFormData({ ...formData, [id]: event.target.value });
  };

 const handleSubmit = () => {
    setLoading(true);

      axios
      .post(
        'http://localhost:3001/agency/add_new_employee',
        formData
      ).then((response) => {
        console.log('response.data-->',response.data);
        msgEPData(response.data.message);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
      })
      .catch((error) => {
        console.error('error.response.data -->',error.response.data);
        msgEPData(error.response.data.error);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
      });
    }

    const handleSnackbarClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbarOpen(false);
    };
  

  return (
    <Container component="main" maxWidth="lg" disableGutters>
      <Box
        sx={{
          
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card variant="outlined" sx={{ width: '100%', padding: 2 }} style={{ background: '#f0eef1' }}>
          <CardHeader title="Employee Form" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                {fields.map((field) => (
                  <Grid item xs={6} key={field.id}>
                    <InputLabel htmlFor={field.id}>{field.label}</InputLabel>
                    <OutlinedInput
                    
                      fullWidth
                      
                      id={field.id}
                      value={formData[field.id] || ''}
                      onChange={handleInputChange(field.id)}
                    />
                  </Grid>
                ))}
              </Grid>
              <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: "16px" }}
                >
                  <span>Salvar no banco de dados</span>
                </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            msgEP === "Registros inseridos com sucesso" ? "success" : "error"
          }
        >
          {msgEP}
        </Alert>
      </Snackbar>
    </Container>
  );
};



export default AgencyNewEmployee;
