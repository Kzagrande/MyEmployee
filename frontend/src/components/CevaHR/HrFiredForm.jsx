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

const HrFiredForm = ({ updateMode, employeeData, onClose, openFormModal }) => {
  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    employee_id: employeeData ? employeeData.employee_id : null,
    name: employeeData ? employeeData.name : null,
    // status: employeeData ? employeeData.status : "",
    dismissal_date: employeeData ? employeeData.dismissal_date : "",
    termination_type: employeeData ? employeeData.termination_type : "",
    reason: employeeData ? employeeData.reason : "",
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
    {
      name: "employee_id",
      label: "Matrícula",
      size: "small",
      disabled: updateMode ? true : false,
    },
    { name: "name", label: "Name", size: "small", disabled: true },

    // {
    //   name: "status",
    //   label: "Status",
    //   size: "small",
    //   selectItems: ["ACTIVE", "AWAY", "TO BE FIRED", "FIRED", "NO SHOW"],
    //   disabled: true,
    // },
    {
      name: "termination_type",
      label: "Natureza",
      size: "small",
      selectItems: ["VOLUNTARIO", "INVOLUNTARIO", "DESISTENCIA", "EFETIVACAO"],
    },
    {
      name: "reason",
      label: "Motivo",
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
        "NAO CONTABILIZAR TO",
        "NOVA OPORTUNIDADE PROFISSIONAL",
        "READQUACAO DE QUADRO",
        "REESTRUTURACAO ORGANIZACIONAL",
      ],
    },
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
    if ([ "termination_type", "reason"].includes(field.name)) {
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
