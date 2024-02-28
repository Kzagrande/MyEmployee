import React, { useState } from "react";
import { Grid, Typography, TextField, Snackbar, Alert } from "@mui/material";

import AgencyDismissalTable from "./AgencyDismissalTable";
import { Box } from "@mui/system";
import http from "@config/http";

const AgencyInputEmployee = () => {
  const [msgEP, msgEPData] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCsvData = (data) => {
    setCsvData(data);
  };

  const handleSaveToDatabase = () => {
    setLoading(true);
    http
      .post("/agency/upload_agency", {
        csvFile: csvData,
        dbTable: "employee_register",
      })
      .then((response) => {
        msgEPData(response.data);
        console.log(response.data);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
        window.location.reload();
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
    link.href = "https://myemployee.com.br/api/agency/export_agency";
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
      <Grid alignItems="center">
        <Grid
          item
          xs={12}
          md={10}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "3em",
            placeContent: "space-between",
            marginTop: ".5em",
            marginBottom: "4em",
          }}
        >
          <Typography variant="h4">Desligados</Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        md={10}
        sx={{ display: "flex", flexDirection: "row", gap: "3em" }}
      >
        <AgencyDismissalTable />
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

export default AgencyInputEmployee;
