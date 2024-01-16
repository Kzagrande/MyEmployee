import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Button, TextField, Snackbar, Alert } from '@mui/material';
import CSVReader from 'react-csv-reader';
import axios from 'axios';

const AddAgencyEmployee = () => {
  const [msgEP, msgEPData] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCsvData = (data) => {
    setCsvData(data);
  };



  const handleSaveToDatabase = () => {
    axios
      .post('http://localhost:3001/agency/upload_agency', { csvFile: csvData })
      .then((response) => {
        msgEPData(response.data)
        console.log(response.data);
        setSnackbarOpen(true); // Open the Snackbar on success
      })
      .catch((error) => {
        console.error(error.response.data);
        msgEPData(error.response.data)
        setSnackbarOpen(true); // Open the Snackbar on success
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{backgroundColor:'#f5f5f5'}}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <h2>Importar tabela de funcionários</h2>
              <form style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label="CSV File"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <CSVReader
                        onFileLoaded={handleCsvData}
                        cssClass="custom-csv-input"
                      />
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveToDatabase}
                  style={{ marginTop: '16px' }}
                >
                  Salvar no Banco de Dados
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={handleSnackbarClose}
>
  <Alert
    onClose={handleSnackbarClose}
    severity={msgEP === 'Registros inseridos com sucesso' ? 'success' : 'error'}
  >
    {msgEP}
  </Alert>
</Snackbar>
      
    </Container>
  );
};

export default AddAgencyEmployee;
