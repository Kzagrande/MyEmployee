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

const PlanningDIsmissal = () => {
  const [formState, setFormState] = useState({
    requesting_manager: "Yan",
    manager_id: "456789",
    employee_id: "123456",
    employee_name: "teste",
    bu: "D",
    reason: "teste",
    observation_disconnection: "teste",
    fit_for_hiring: false,
    fit_for_hiring_reason: "teste",
  });

  const [loading, setLoading] = useState(false);
  const [msgEP, setMsgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

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
        formState
      );
      console.log("ok passei pelo ep", response);
      setMsgEPData(response.data.Message);
      console.log(response.data.Message);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
      setFormData(createEmptyFormData());
    } catch (error) {
      console.error("erro", error);
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
    }
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
              value={formState.requesting_manager}
              onChange={(e) =>
                handleChange("requesting_manager", e.target.value)
              }
            />
            <TextField
              label="Matrícula do Solicitante"
              fullWidth
              required
              value={formState.manager_id}
              onChange={(e) =>
                handleChange("manager_id", e.target.value)
              }
            />
          </Box>
          <TextField
            label="Matrícula Colaborador a ser desligado"
            fullWidth
            required
            type="number"
            value={formState.employee_id}
            onChange={(e) => handleChange("employee_id", e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Nome Colaborador"
            fullWidth
            required
            value={formState.employee_name}
            onChange={(e) => handleChange("employee_name", e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel>Nave Colaborador</InputLabel>
            <Select
              value={formState.bu}
              onChange={(e) => handleChange("bu", e.target.value)}
            >
              <MenuItem value="B">Nave B</MenuItem>
              <MenuItem value="D">Nave D</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Motivo do desligamento"
            fullWidth
            required
            value={formState.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Observação do desligamento"
            fullWidth
            required
            multiline
            rows={4}
            value={formState.observation_disconnection}
            onChange={(e) =>
              handleChange("observation_disconnection", e.target.value)
            }
            style={{ marginBottom: 15 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.fit_for_hiring}
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
            value={formState.fit_for_hiring_reason}
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
