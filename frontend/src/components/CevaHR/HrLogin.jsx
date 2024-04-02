import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
import http from '@config/http'


const HrLogin = () => {
  const [values, setValues] = useState({
    id_employee: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    http
      .post("/hr/adminlogin", values)
      .then((result) => {
        if (result.data.loginStatus) {
          navigate("/hr_dashboard/hr_crud");
          localStorage.setItem('token',result.data.token)
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="vh-100 loginPage">
      <Container
        className="d-flex justify-content-center align-items-center vh-100  "
        maxWidth="xs"
      >
        <div className="p-3 rounded border loginForm">
          <Typography mb={5} variant="h5" align="center" gutterBottom>
            Digite seus dados
          </Typography>
          {error && (
            <Typography variant="body1" align="center" color="error">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="ID Employee"
              name="id_employee"
              autoComplete="off"
              placeholder="Digite o Id"
              value={values.id_employee}
              onChange={(e) => setValues({ ...values, id_employee: e.target.value })}
              className="mb-3 white"
              sx={{ background: "white" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              autoComplete="off"
              placeholder="Digite sua senha"
              type="password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className="mb-3 "
              sx={{ background: "white" }} s
            />
            <Box className="d-flex gap-2">
              <Button
                startIcon={<ReplyIcon />}
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
                type="submit"
                className="mb-3"
                onClick={() => { navigate('/') }}
                
              >
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="success"
                type="submit"
                className="mb-3"
              >
                Enviar
              </Button>
            </Box>
            <Typography variant="body2" align="center">
              <a href="#" className="text-white">
                I forgot my password
              </a>
            </Typography>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default HrLogin;
