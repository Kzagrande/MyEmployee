import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Snackbar,
  Alert,

} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LoadingButton from "@mui/lab/LoadingButton";
import CSVReader from "react-csv-reader";
import axios from "axios";
import PlanningTable from "./PlanningTable";
import { Box } from "@mui/system";


const PlanningForm = () => {
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
        dbTable: "employee_register",
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

  const handleExportAgency = (event) => {
    event.preventDefault();

    // Criar um link temporário
    const link = document.createElement("a");
    link.href = "http://localhost:3001/agency/export_agency";
    link.download = "agency_data.csv";

    // Adicionar o link à página
    document.body.appendChild(link);

    // Disparar o clique no link
    link.click();

    // Remover o link após o download iniciar
    document.body.removeChild(link);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Grid alignItems="center" >
        <Grid
          item
          xs={12}
          md={10}
          sx={{ display: "flex", flexDirection: "row", gap: "3em", placeContent: 'space-between', marginTop: '.5em', marginBottom: '4em' }}
        >
          <Typography variant="h4" >
            Integrações
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'baseline', gap: '1em' }}>
            <form style={{}}>
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

            </form>
            <LoadingButton
              size="small"
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={handleSaveToDatabase}
              sx={{}}
            >
              <span>Salvar no banco de dados</span>
            </LoadingButton>
            <LoadingButton
              size="small"
              loadingPosition="start"
              startIcon={<FileDownloadIcon />}
              variant="contained"
              color="primary"
              onClick={handleExportAgency}
              sx={{}}
            >
              <span>Export</span>
            </LoadingButton>
          </Box>


        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        md={10}
        sx={{ display: "flex", flexDirection: "row", gap: "3em" }}
      >
        <PlanningTable />
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
    </Box>
  );
};

export default PlanningForm;
