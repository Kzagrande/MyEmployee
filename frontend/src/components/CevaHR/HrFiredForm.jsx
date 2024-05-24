import React, { useState, forwardRef, useImperativeHandle } from "react";
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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect } from "react";
import http from "@config/http";

const HrFiredForm = ({ updateMode, employeeData, onClose, openFormModal,requester_infos }) => {
  const [formData, setFormData] = useState({
    requester_id: requester_infos.requester_name,
    requester_name: requester_infos.requester_id,
    employee_id: employeeData ? employeeData.employee_id : null,
    employee_name: employeeData ? employeeData.name : "",
    termination_type: employeeData ? employeeData.termination_type : "",
    reason: employeeData ? employeeData.reason : "",
    observation: employeeData ? employeeData.observation : "",
    fit_for_hiring: employeeData ? employeeData.fit_for_hiring : "",
    fit_for_hiring_reason: employeeData ? employeeData.fit_for_hiring_reason : "",
    dismissal_date: employeeData ? employeeData.dismissal_date : "",
    // Add other form fields as needed
  });
  const [loading, setLoading] = useState(false);
  const [msgEP, setMsgEPData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(openFormModal);

  useEffect(() => {
    setIsModalOpen(openFormModal);
  }, [openFormModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHttpRequest = async (endpoint, successMessage) => {
    setLoading(true);
    try {
      const response = await http.post(endpoint, formData);
      setMsgEPData(response.data.Message);
      setSnackbarOpen(true);
      setLoading(false);
      setTimeout(() => {
        handleCloseModal();
        setSnackbarOpen(false);
      }, 1000);
      setFormData(createEmptyFormData());
      window.location.reload()
    } catch (error) {
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleHttpRequest(
      "/hr/fire_employee",
      "Registros inseridos com sucesso"
    );

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
    { name: "requester_id", label: "Matrícula do requisitor", size: "small", disabled: true },
    { name: "requester_name", label: "Nome do requisitor", size: "small", disabled: true },
    {
      name: "employee_id",
      label: "Matrícula do colaborador",
      size: "small",
      disabled: updateMode ? true : false,
    },
    { name: "employee_name", label: "Nome do colaborador", size: "small", disabled: true },

    {
      name: "termination_type",
      label: "Natureza do desligamento",
      size: "small",
      selectItems: ["VOLUNTARIO", "INVOLUNTARIO", "DESISTENCIA", "EFETIVACAO"],
    },
    {
      name: "reason",
      label: "Motivo do desligamento",
      size: "small",
      selectItems: [
        "ABANDONO DE TRABALHO",
        "ABSENTEISMO ELEVADO",
        "BAIXA PERFORMANCE",
        "COMPORTAMENTO",
        "CONFLITOS COM O GESTOR",
        "DESISTENCIA",
        "EFETIVACAO",
        "EX-COLABORADOR CEVA",
        "HORARIO INCOMPATIVEL",
        "MA CONDUTA",
        "MOTIVOS PESSOAIS/FAMILIAR",
        "NAO CONTABILIZAR",
        "NOVA OPORTUNIDADE PROFISSIONAL",
        "READQUACAO DE QUADRO",
        "REESTRUTURACAO ORGANIZACIONAL",
      ],
    },
    { name: "fit_for_hiring", label: "Apto a futura contratação", size: "small" ,
    selectItems: [
      "SIM",
      "NAO"],
    },
    { name: "fit_for_hiring_reason", label: "Motivo para não contratar", size: "small" },
    { name: "observation", label: "Observação", size: "small" },
    { name: "dismissal_date", label: "Dia da demissão", size: "small" },

  ];

  const renderSelectField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel
        sx={{ marginBottom: "8px", fontWeight: "bold", color: "#a53333" }}
        htmlFor={field.name}
      >
        {field.label}
      </InputLabel>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {formData[field.name]}
        </InputLabel>
        <Select
          displayEmpty
          size={field.size}
          name={field.name}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData[field.name]}
          label="Age"
          onChange={handleChange}
        >
          {field.selectItems && Array.isArray(field.selectItems)
            ? field.selectItems.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
    </Grid>
  );

  const renderTextField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel
        sx={{ marginBottom: "8px", fontWeight: "bold", color: "#a53333" }}
        htmlFor={field.name}
      >
        {field.label}
      </InputLabel>
      <TextField
        size={field.size}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        fullWidth
        disabled={field.disabled}
      />
    </Grid>
  );

  const renderFormFields = (field) => {
    if ([ "termination_type", "reason","fit_for_hiring"].includes(field.name)) {
      return renderSelectField(field);
    } else {
      return renderTextField(field);
    }
  };

  return (
    <Modal
      sx={{
        overflowY: "auto",
        marginY: "2em",
      }}
      open={isModalOpen}
      aria-labelledby="add-employee-modal"
      aria-describedby="form-for-adding-employee"
    >
      <Container sx={{ backgroundColor: "white", paddingY: "1em" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ fontFamily: "Libre Baskerville, sans-serif" }}
        >
          Desligar colaborador
        </Typography>
        <form>
          <Grid container spacing={1} sx={{ marginBottom: "1em" }}>
            {formFields.map(renderFormFields)}
            
          </Grid>
          <Box sx={{}}>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="error"
              onClick={handleSubmit}
              sx={{ marginRight: "1em" }}
            >
              DESLIGAR COLABORADOR
            </LoadingButton>
            <LoadingButton
           
              variant="contained"
              onClick={handleCloseModal}
            >
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

HrFiredForm.displayName = "HrFiredForm";

export default HrFiredForm;
