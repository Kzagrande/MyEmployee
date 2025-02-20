import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import CSVReader from "react-csv-reader";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";

const TerminatedAgencyEmployee = () => {
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
        dbTable: "agency_input_terminateds",
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
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <h2>Importar base de Desligados</h2>
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

export default TerminatedAgencyEmployee;
