import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Container,
  InputLabel,
  Box,
  Snackbar,
  Alert,
  Modal,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { useEffect } from "react";

const HrAddForm = ({ employeeData, updateMode, onClose, openFormModal }) => {
  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    cpf: employeeData ? employeeData.cpf : "",
    rg: employeeData ? employeeData.rg : "",
    employee_id: employeeData ? employeeData.employee_id : null,
    role_: employeeData ? employeeData.role_ : "",
    bu: employeeData ? employeeData.bu : "",
    shift: employeeData ? employeeData.shift : "",
    schedule_time: employeeData
      ? employeeData.schedule_time
      : "",
    company: employeeData ? employeeData.company : "",
    status: employeeData ? employeeData.status : "",
    hire_date: employeeData ? employeeData.hire_date : "",
    date_of_birth: employeeData ? employeeData.date_of_birth : "",
    ethnicity: employeeData ? employeeData.ethnicity : "",
    gender: employeeData ? employeeData.gender : "",
    neighborhood: employeeData ? employeeData.neighborhood : "",
    city: employeeData ? employeeData.city : "",
    email: employeeData ? employeeData.email : "",
    integration_date: employeeData
      ? employeeData.integration_date
      : "",
    phone: employeeData ? employeeData.phone : "",
    // Add other form fields as needed
  });
  const [loading, setLoading] = useState(false);
  const [msgEP, setMsgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(openFormModal);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/hr/add_hr_employees",
        formData
      );
      console.log("ok passei pelo ep", response);
      setMsgEPData(response.data.Message);
      console.log(response.data.Message);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
      setTimeout(() => {
        handleCloseModal()
        setSnackbarOpen(false);
      }, 1000);
      setFormData(createEmptyFormData());
      
    } catch (error) {
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/hr/update_hr_employee",
        formData
      );
      console.log("ok passei pelo ep", response);
      setMsgEPData(response.data.Message);
      console.log(response.data.Message);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
      setTimeout(() => {
        handleCloseModal()
        setSnackbarOpen(false);
      }, 1000);
      setFormData(createEmptyFormData());
      
    } catch (error) {
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true); // Open the Snackbar on success
      setLoading(false);
    }
  };

  const createEmptyFormData = () => {
    const emptyFormData = {};
    Object.keys(formData).forEach((key) => {
      emptyFormData[key] = "";
    });
    return emptyFormData;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const formFields = [
    {
      name: "employee_id",
      label: "Matrícula",
      size: "small",
      disabled: updateMode ? true : false,
    },
    { name: "cpf", label: "CPF", size: "small" },
    { name: "name", label: "Name", size: "small" },
    { name: "rg", label: "RG", size: "small" },
    { name: "role_", label: "Role", size: "small" },
    { name: "bu", label: "BU", size: "small" },
    { name: "shift", label: "Shift", size: "small" },
    { name: "schedule_time", label: "Schedule Time", size: "small" },
    { name: "company", label: "Company", size: "small" },
    { name: "status", label: "Status", size: "small" },
    { name: "hire_date", label: "Hire Date", size: "small" },
    { name: "date_of_birth", label: "Date of Birth", size: "small" },
    { name: "ethnicity", label: "Etinicity", size: "small" },
    { name: "gender", label: "Gender", size: "small" },
    { name: "neighborhood", label: "Neighborhood", size: "small" },
    { name: "city", label: "City", size: "small" },
    { name: "email", label: "Email", size: "small" },
    { name: "phone", label: "Phone", size: "small" },
    { name: "integration_date", label: "Integration Date", size: "small" },
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
    <Modal
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
      open={isModalOpen}
      aria-labelledby="add-employee-modal"
      aria-describedby="form-for-adding-employee"
    >
      <Container
        sx={{ backgroundColor: "white", margin: "1em", padding: "1em" }}
      >
        <Typography variant="h6">Edit Employee</Typography>
        <form>
          <Grid container spacing={0.5} sx={{ marginBottom: "1em" }}>
            {formFields.map(renderTextField)}
          </Grid>
          <Box sx={{}}>
            {updateMode ? (
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{ marginRight: "1em" }}
              >
                Update
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ marginRight: "1em" }}
              >
                Save
              </LoadingButton>
            )}
            <LoadingButton variant="contained" onClick={handleCloseModal}>
              Cancel
            </LoadingButton>
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
    </Modal>
  );
};

export default HrAddForm;
