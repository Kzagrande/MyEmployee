import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  InputLabel,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import http from '@config/http.js'

const PlanningForm = ({ employeeData, onClose,openFormModal }) => {
  const [formData, setFormData] = useState({
    employee_id: employeeData ? employeeData.employee_id : "",
    name: employeeData ? employeeData.name : "",
    role_: employeeData ? employeeData.role_ : "",
    bu: employeeData ? employeeData.bu : "",
    shift: employeeData ? employeeData.shift : "",
    sector: employeeData ? employeeData.sector : "",
    collar: employeeData ? employeeData.collar : "",
    work_schedule: employeeData ? employeeData.work_schedule : "",
    type_: employeeData ? employeeData.type_ : "",
    status_op: employeeData ? employeeData.status_op : "",
    schedule_time: employeeData ? employeeData.schedule_time : "",
    activity_p: employeeData ? employeeData.activity_p : "",
    company: employeeData ? employeeData.company : "",
    manager_1: employeeData ? employeeData.manager_1 : "",
    status: employeeData ? employeeData.status : "",
    presence_integration: employeeData ? employeeData.presence_integration : "",
    hire_date: employeeData ? employeeData.hire_date : "",
    date_of_birth: employeeData ? employeeData.date_of_birth : "",
    integration_date: employeeData ? employeeData.integration_date : "",
    // Add other form fields as needed
  });

  const [msgEP, setMsgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(openFormModal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsModalOpen(openFormModal);
  }, [openFormModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  



  const handleUpdate = async () => {
    try {
      const response = await http.post(
        "/planning/update_planning_employee",
        formData
      );
      console.log("ok passei pelo ep", response);
      setMsgEPData(response.data.Message);
      console.log(response.data.Message);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
      setTimeout(() => {
        handleCloseModal();
        setSnackbarOpen(false);
        console.log('formModal',openFormModal)
      }, 1000);
    } catch (error) {
      console.log(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const formFields = [
    { name: "employee_id", label: "Matrícula", size: "small", disabled: true },
    { name: "name", label: "Name", size: "small", disabled: true },
    { name: "role_", label: "Role", size: "small" },
    { name: "bu", label: "BU", size: "small" },
    { name: "shift", label: "Shift", size: "small" },
    { name: "sector", label: "Sector", size: "small" },
    { name: "collar", label: "Collar", size: "small" },
    { name: "work_schedule", label: "Work Schedule", size: "small" },
    { name: "type_", label: "Type", size: "small" },
    { name: "status_op", label: "Status Op", size: "small" },
    { name: "schedule_time", label: "Schedule Time", size: "small" },
    { name: "activity_p", label: "Activity P", size: "small" },
    { name: "company", label: "Company", size: "small", disabled: true },
    { name: "manager_1", label: "Responsável", size: "small" },
    { name: "status", label: "Status", size: "small", disabled: true },
    {
      name: "presence_integration",
      label: "presence integration Date",
      size: "small",
      disabled: true,
    },
  ];

  const renderTextField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
      <TextField
        size={field.size}
        name={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
        fullWidth
        disabled={field.disabled}
      />
    </Grid>
  );
  return (
    <Container       sx={{
      backgroundColor: "white",
      margin: "1em",
      padding: "1em",
      maxHeight: "95vh",  // Defina a altura máxima desejada
      overflowY: "auto",  // Adiciona rolagem vertical
    }}>
      <Typography variant="h6">Edit Employee</Typography>
      <form>
        <Grid container spacing={0.5} sx={{ marginBottom: "1em" }}>
          {formFields.map(renderTextField)}
        </Grid>
        <Box sx={{}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ marginRight: "1em" }}
          >
            Update
          </Button>
          <Button variant="contained" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
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
    </Container>
  );
};

export default PlanningForm;
