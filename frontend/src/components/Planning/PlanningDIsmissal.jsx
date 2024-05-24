import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import http from "@config/http";
import { Box } from "@mui/system";
import { jwtDecode } from "jwt-decode";

const PlanningDismissal = () => {
  const [formData, setFormData] = useState({
    requesting_manager: "",
    manager_id: "",
    employee_id: "",
    employee_name: "",
    bu: "",
    reason: "",
    termination_type: "",
    observation_disconnection: "",
    fit_for_hiring: false? "NÃO":"SIM",
    fit_for_hiring_reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [msgEP, setMsgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const manager_id = decoded.employee_id;
      const user_name = decoded.user_name;
      setFormData((prevFormData) => ({
        ...prevFormData,
        manager_id: manager_id,
        requesting_manager: user_name,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formData.employee_id) {
          const response = await http.get(
            `planning/find_employee/${formData.employee_id}`
          );
          setFormData((prevData) => ({
            ...prevData,
            employee_name: response.data.name,
            bu: response.data.bu,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar informações do colaborador:", error);
      }
    };

    fetchData();
  }, [formData.employee_id]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleDialogOpen();
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      const response = await http.post(
        "/planning/dismissal_employees",
        formData
      );
      setMsgEPData(response.data.Message);
      setSnackbarOpen(true);
      setLoading(false);
      setFormData(createEmptyFormData());
    } catch (error) {
      console.error("Erro", error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true);
      setLoading(false);
    }
    handleDialogClose();
  };

  const createEmptyFormData = () => {
    const emptyFormData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = key === 'manager_id' || key === 'requesting_manager' ? formData[key] : "";
      return acc;
    }, {});
    return emptyFormData;
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Solicitação de desligamento Agência
        </Typography>
        <Typography variant="body1" paragraph>
          Este formulário registrará seu nome. Preencha-o.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box style={{ display: "flex", gap: 15, marginBottom: 15 }}>
            <TextField
              label="Gerente solicitante"
              fullWidth
              required
              disabled
              value={formData.requesting_manager}
              onChange={(e) =>
                handleChange("requesting_manager", e.target.value)
              }
            />
            <TextField
              label="Matrícula do Solicitante"
              fullWidth
              required
              disabled
              value={formData.manager_id}
              onChange={(e) => handleChange("manager_id", e.target.value)}
            />
          </Box>
          <TextField
            label="Matrícula Colaborador a ser desligado"
            fullWidth
            required
            type="number"
            value={formData.employee_id}
            onChange={(e) => handleChange("employee_id", e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Nome Colaborador"
            fullWidth
            disabled
            value={formData.employee_name}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Nave"
            fullWidth
            disabled
            value={formData.bu}
            style={{ marginBottom: 15 }}
          />

          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel>Motivo do desligamento</InputLabel>
            <Select
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
            >
              <MenuItem value="ATESTADIS">Atestados</MenuItem>
              <MenuItem value="ABANDONO DE EMPREGO">
                Abandono de emprego
              </MenuItem>
              <MenuItem value="ABASTENSEISMO ELEVADO">
                Absenteísmo elevado
              </MenuItem>
              <MenuItem value="BAIXA PERFORMANCE">Baixa performance</MenuItem>
              <MenuItem value="MA CONDUTA">Má conduta</MenuItem>
              <MenuItem value="PRODUTIVIDADE">Produtividade</MenuItem>
              <MenuItem value="CONFLITOS COM O GESTOR">
                Conflitos com o gestor
              </MenuItem>
              <MenuItem value="COLABORADOR SOLICITOU O DESLIGAMENTO">
                Colaborador solicitou o desligamento
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel>Natureza do Desligamento</InputLabel>
            <Select
              value={formData.termination_type}
              onChange={(e) => handleChange("termination_type", e.target.value)}
            >
              <MenuItem value="VOLUNTARIO">Voluntário</MenuItem>
              <MenuItem value="INVOLUNTARIO">Involuntário</MenuItem>
              <MenuItem value="ABANDONO">Abandono</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Observação do desligamento"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.observation_disconnection}
            onChange={(e) =>
              handleChange("observation_disconnection", e.target.value)
            }
            style={{ marginBottom: 15 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.fit_for_hiring}
                onChange={(e) =>
                  handleChange("fit_for_hiring", e.target.checked)
                }
                color="primary"
              />
            }
            label="Apto para futura contratação?"
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Observação"
            fullWidth
            multiline
            rows={4}
            value={formData.fit_for_hiring_reason}
            onChange={(e) =>
              handleChange("fit_for_hiring_reason", e.target.value)
            }
            style={{ marginBottom: 15 }}
          />
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Enviar
          </LoadingButton>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={
              msgEP === "Registros inseridos com sucesso"
                ? "success"
                : msgEP === "Informações alteradas com sucesso!"
                ? "info"
                : "error"
            }
          >
            {msgEP}
          </Alert>
        </Snackbar>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          
        >
          <DialogTitle sx={{backgroundColor:'#a33939',color:'white', marginBottom:'1em'}}>Confirmação de Envio</DialogTitle>
          <DialogContent >
            <DialogContentText>
              Você está prestes a enviar os seguintes dados:
              <br />
              Matrícula do Colaborador: <strong>{formData.employee_id}
              <br /></strong>
              Nome do Colaborador: <strong>{formData.employee_name}</strong>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={confirmSubmit} sx={{backgroundColor:'#ffffff',color:'red',fontWeight:'bold'}}  >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PlanningDismissal;
