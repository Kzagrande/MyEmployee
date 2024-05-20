import React, { useState } from "react";
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
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import http from "@config/http";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const PlanningDIsmissal = () => {
  const [formData, setformData] = useState({
    requesting_manager: "",
    manager_id: "",
    employee_id: "",
    employee_name: "",
    bu: "",
    reason: "",
    termination_type:"",
    observation_disconnection: "",
    fit_for_hiring: false,
    fit_for_hiring_reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [msgEP, setMsgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (field, value) => {
    setformData({ ...formData, [field]: value });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const manager_id = decoded.employee_id;
      const user_name = decoded.user_name;
      setformData((prevFormData) => ({
        ...prevFormData,
        manager_id: manager_id,
        requesting_manager: user_name,
      }));
    }
  }, []); // Executar apenas uma vez, quando o componente é montado

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formData.employee_id) {
          const response = await http.get(
            `planning/find_employee/${formData.employee_id}`
          );
          setformData({
            ...formData,
            employee_name: response.data.name,
            bu: response.data.bu,
          });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await http.post(
        "/planning/dismissal_employees",
        formData
      );
      console.log("ok passei pelo ep", response);
      setMsgEPData(response.data.Message);
      console.log(response.data.Message);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
      setformData(createEmptyformData());
    } catch (error) {
      console.error("erro", error);
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
    }
  };

  const createEmptyformData = () => {
    const emptyformData = {};
    Object.keys(formData).forEach((key) => {
      if (key === 'manager_id' || key === 'requesting_manager') {
        emptyformData[key] = formData[key];
      } else {
        emptyformData[key] = "";
      }
    });
    return emptyformData;
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
        <form>
          <Box style={{ display: "flex", gap: 15, marginBottom: 15 }}>
            <TextField
              label="Gerente solicitante"
              fullWidth
              required
              disabled={true}

              value={formData.requesting_manager}
              onChange={(e) =>
                handleChange("requesting_manager", e.target.value)
              }
            />
            <TextField
              label="Matrícula do Solicitante"
              fullWidth
              required
              disabled={true}
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
            disabled={true}
            value={formData.employee_name}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Nave"
            fullWidth
            disabled={true}
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
              <MenuItem value="IVOLUNTARIO">
                Ivoluntário
              </MenuItem>
              <MenuItem value="ABANDONO">
                Abandono
              </MenuItem>
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
            onClick={handleSubmit}
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
      </Paper>
    </Container>
  );
};

export default PlanningDIsmissal;
