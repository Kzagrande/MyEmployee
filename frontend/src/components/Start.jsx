import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "./style.css"
import http from '@config/http'



const Start = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    http.get('/verify')
      .then(result => {
        if (result.data.Status) {
          console.log('result', result.data);
          if (result.data.role === "users_sys") {
            navigate('/dashboard');
          } else if (result.data.role === "planning") {
            navigate('/planning_dashboard');
          } else {
            navigate('/agency_dashboard');
          }
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  return (
    <div className="vh-100  loginPage">
    <Container className="d-flex justify-content-center align-items-center vh-100 ">
      <Box p={6.} borderRadius="border" className="loginForm text-center">
        <Typography variant="h4" gutterBottom>
          Login As
        </Typography>
        <Box display="flex" justifyContent="between" my={6}  className="gap-5">
          <Button  variant="contained" color="primary" size="large" className="btnLogin"   onClick={() => { navigate('/planning_login') }}>
            <span className="btnLoginFont">Planejamento</span>
          </Button>
          <Button variant="contained" color="success" size="large"  className="btnLogin"  onClick={() => { navigate('/adminlogin') }}>
            RH
          </Button>
          <Button variant="contained" color="warning" size="large"  className="btnLogin"   onClick={() => { navigate('/agency_login') }}>
            Agência
          </Button>
        </Box>
      </Box>
    </Container>
    </div>
  );
}

export default Start;
