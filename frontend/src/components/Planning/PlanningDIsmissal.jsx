import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import http from '@config/http'



const PlanningDIsmissal = () => {


  const [formState, setFormState] = useState({
    gerenteSolicitante: 'Yan',
    matriculaColaborador: '123456',
    nomeColaborador: 'teste',
    naveColaborador: 'D',
    motivoDesligamento: 'teste',
    observacaoDesligamento: 'teste',
    aptoContratacao: false,
    observacaoAptoContratacao: 'teste',
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
    event.preventDefault()
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
          <TextField
            label="Gerente solicitante"
            fullWidth
            required
            value={formState.gerenteSolicitante}
            onChange={(e) => handleChange('gerenteSolicitante', e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Matrícula Colaborador a ser desligado"
            fullWidth
            required
            type="number"
            value={formState.matriculaColaborador}
            onChange={(e) => handleChange('matriculaColaborador', e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Nome Colaborador"
            fullWidth
            required
            value={formState.nomeColaborador}
            onChange={(e) => handleChange('nomeColaborador', e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel>Nave Colaborador</InputLabel>
            <Select
              value={formState.naveColaborador}
              onChange={(e) => handleChange('naveColaborador', e.target.value)}
            >
              <MenuItem value="B">Nave B</MenuItem>
              <MenuItem value="D">Nave D</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Motivo do desligamento"
            fullWidth
            required
            value={formState.motivoDesligamento}
            onChange={(e) => handleChange('motivoDesligamento', e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Observação do desligamento"
            fullWidth
            required
            multiline
            rows={4}
            value={formState.observacaoDesligamento}
            onChange={(e) => handleChange('observacaoDesligamento', e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.aptoContratacao}
                onChange={(e) => handleChange('aptoContratacao', e.target.checked)}
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
            value={formState.observacaoAptoContratacao}
            onChange={(e) => handleChange('observacaoAptoContratacao', e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <LoadingButton loading={loading} type="submit" variant="contained" color="primary" onClick={handleSubmit}>
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
