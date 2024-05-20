import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  styled,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import http from "@config/http";

const StyledContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const FormContainer = styled("div")({
  width: "600px",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  border: "1px solid",
});

const Register = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    password: "",
    confirmPassword: "",
    status: 0, // valor padrão para o status
  });

  const [passwordError, setPasswordError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setGeneratedPassword(randomPassword);
    setFormData((prevData) => ({
      ...prevData,
      password: randomPassword,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("As senhas não correspondem");
    } else {
      // Senhas correspondem, então prossegue com a lógica de envio do formulário
      console.log(formData);
      const userToSend = {
        employee_id: formData.employee_id,
        name: formData.name,
        password_: formData.password,
        status_: formData.status,
      };

      try {
        const response = await http.post("hr/register_user", userToSend);
        if (response.status >= 200 && response.status <= 500) {
          setSnackbarOpen(true);
          setFormData({
            employee_id: "",
            password: "",
            confirmPassword: "",
            status: 1,
          });
        } else {
          throw new Error("Erro ao registrar usuário");
        }
      } catch (error) {
        console.error("Erro ao fazer o POST:", error);
        setErrorSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };
  return (
    <StyledContainer>
      <FormContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Registrar Usuário
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Id do usuário"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Nome do usuário"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <Box
            mt={2}
            sx={{ display: "flex", alignItems: "center", gap: "1em" }}
          >
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={generateRandomPassword}
            >
              Gerar
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            error={!!passwordError}
            helperText={passwordError}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              {[...Array(15)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {generatedPassword && (
            <Box mt={2}>
              <Typography variant="body1" align="center" gutterBottom>
                Senha Aleatória Gerada: <strong>{generatedPassword}</strong>
              </Typography>
            </Box>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="success" fullWidth>
              Enviar
            </Button>
          </Box>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity="success"
          >
            Formulário enviado com sucesso!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleErrorSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleErrorSnackbarClose}
            severity="error"
          >
            Erro ao enviar o formulário. Por favor, tente novamente.
          </MuiAlert>
        </Snackbar>
      </FormContainer>
    </StyledContainer>
  );
};

export default Register;
