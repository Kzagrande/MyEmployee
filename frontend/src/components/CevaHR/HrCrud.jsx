import React, { useState } from "react";
import {
  Grid,
  Typography,
  Snackbar,
  Alert,
  Box,
  TextField,
  Modal,
  Container,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LoadingButton from "@mui/lab/LoadingButton";
import HrEmployeeTable from "./HrEmployeeTable";
import HrAddForm from "./HrAddFomr";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import CSVReader from "react-csv-reader";
import http from '@config/http'

const HrCrud = () => {
  const [msgEP, msgEPData] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dismissalModal, setDismissalModal] = useState(false);
  const handleCsvData = (data) => {
    setCsvData(data);
  };

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
    link.href = "https://myemployee.com.br/api/hr/export_activities_hc";
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

  const handleDismissalGroup = () => {
    setLoading(true);
    http
      .post("/hr/update_dismissal_group", {
        csvFile: csvData,
      })
      .then((response) => {
        msgEPData(response.data);
        console.log(response.data);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
        setDismissalModal(false)
      })
      .catch((error) => {
        console.error(error.response.data);
        msgEPData(error.response.data);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
      });
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
          <Typography variant="h4">Quadro de funcionários</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "baseline",
              gap: "1em",
            }}
          >
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

            <LoadingButton
              size="small"
              loading={loading}
              loadingPosition="start"
              startIcon={<GroupRemoveIcon />}
              variant="contained"
              color="error"
              onClick={() => setDismissalModal(true)}
              sx={{}}
            >
              <span>Desligar em lote</span>
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

      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "100vh",
          overflowY: "auto",
        }}
        open={dismissalModal}
        aria-labelledby="add-employee-modal"
        aria-describedby="form-for-adding-employee"
      >
        <Container
          sx={{ backgroundColor: "white", margin: "1em", padding: "1em" }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "1em" }}
          >
            Adicione o arquivo csv{" "}
          </Typography>
          <form>
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
            <Box sx={{ marginY: ".5em" }}>
              <LoadingButton variant="contained" color="primary" onClick={handleDismissalGroup}>
                Enviar CSV
              </LoadingButton>
              <LoadingButton
                sx={{ marginLeft: "1em" }}
                variant="contained"
                color="error"
                onClick={() => setDismissalModal(false)}
              >
                Cancelar
              </LoadingButton>
            </Box>
          </form>
        </Container>
      </Modal>
      <HrAddForm
        employeeData={selectedEmployee}
        onClose={handleCloseModal}
        openFormModal={openModal}
      />
    </Box>
  );
};

export default HrCrud;
