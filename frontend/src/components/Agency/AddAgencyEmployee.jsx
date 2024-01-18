import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Snackbar,
  Alert,
  CardHeader,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import CSVReader from "react-csv-reader";
import axios from "axios";

const AddAgencyEmployee = () => {
  const [msgEP, msgEPData] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCsvData = (data) => {
    setCsvData(data);
  };

  const handleSaveToDatabase = () => {
    setLoading(true);
    axios
      .post("http://localhost:3001/agency/upload_agency", {
        csvFile: csvData,
        dbTable: "agency_input_activies",
      })
      .then((response) => {
        msgEPData(response.data);
        console.log(response.data);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        msgEPData(error.response.data);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
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
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ backgroundColor: "#f5f5f5" }}>
            <CardHeader title="Importar base novos ativos" />

          
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <form style={{ display: "flex", flexDirection: "column" }}>
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
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleSaveToDatabase}
                  style={{ marginTop: "16px" }}
                >
                  <span>Salvar no banco de dados</span>
                </LoadingButton>
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

export default AddAgencyEmployee;
