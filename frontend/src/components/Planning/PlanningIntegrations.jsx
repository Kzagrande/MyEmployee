import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Snackbar,
  Alert,

} from "@mui/material";

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LoadingButton from "@mui/lab/LoadingButton";
import PlanningIntTable from "./PlanningIntTable";
import { Box } from "@mui/system";



const PlanningIntegrations = () => {
  const [msgEP, msgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      <Grid alignItems="center" >
        <Grid
          item
          xs={12}
          md={10}
          sx={{ display: "flex", flexDirection: "row", gap: "3em", placeContent: 'space-between', marginTop: '.5em', marginBottom: '4em' }}
        >
<Typography variant="h4" style={{ fontFamily: 'Libre Baskerville, sans-serif' }}>Integrações e Planejamento</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'baseline', gap: '1em' }}>

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
        <PlanningIntTable />
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

export default PlanningIntegrations;
