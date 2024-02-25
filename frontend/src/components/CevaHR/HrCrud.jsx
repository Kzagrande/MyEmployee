import React, { useState } from "react";
import {
  Grid,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LoadingButton from "@mui/lab/LoadingButton";
import HrEmployeeTable from "./HrEmployeeTable";
import HrAddForm from "./HrAddFomr";


const HrCrud = () => {
  const [msgEP, msgEPData] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // const handleCsvData = (data) => {
  //   setCsvData(data);
  // };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleExportAgency = (event) => {
    event.preventDefault();

    // Criar um link temporário
    const link = document.createElement("a");
    link.href = "http://localhost:3001/hr/export_activities_hc";
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
            Quadro de funcionários
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'baseline', gap: '1em' }}>
            <LoadingButton
              size="small"
              loading={loading}
              loadingPosition="start"
              startIcon={<PersonAddIcon />}
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{}}
            >
              <span>Adicionar colaborador</span>
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
        <HrEmployeeTable />
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
        <HrAddForm
          employeeData={selectedEmployee}
          onClose={handleCloseModal}
          openFormModal={openModal}
          
        />

    </Box>
  );
};

export default HrCrud;
