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

const HrAddForm = forwardRef(({ updateMode, employeeData, onClose, openFormModal }, ref) => {
  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    cpf: employeeData ? employeeData.cpf : "",
    employee_id: employeeData ? employeeData.employee_id : null,
    role_: employeeData ? employeeData.role_ : "",
    bu: employeeData ? employeeData.bu : "",
    shift: employeeData ? employeeData.shift : "",
    schedule_time: employeeData ? employeeData.schedule_time : "",
    company: employeeData ? employeeData.company : "",
    status: employeeData ? employeeData.status : "",
    hire_date: employeeData ? employeeData.hire_date : "",
    date_of_birth: employeeData ? employeeData.date_of_birth : "",
    ethnicity: employeeData ? employeeData.ethnicity : "",
    gender: employeeData ? employeeData.gender : "",
    neighborhood: employeeData ? employeeData.neighborhood : "",
    city: employeeData ? employeeData.city : "",
    email: employeeData ? employeeData.email : "",
    integration_date: employeeData ? employeeData.integration_date : "",
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
    } catch (error) {
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleHttpRequest("/hr/add_hr_employees", "Registros inseridos com sucesso");
  };

  const handleUpdate = () => {
    handleHttpRequest("/hr/update_hr_employee", "Informações alteradas com sucesso!");
    window.location.reload();
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
    {
      name: "role_",
      label: "Role",
      size: "small",
      selectItems: [
        "ANALISTA DE INVENTARIO",
        "ANALISTA DE PLANEJAMENTO",
        "ANALISTA EXCELENCIA OPERACIONAL JR",
        "ANALISTA EXCELENCIA OPERACIONAL SR",
        "ANALISTA FACILITIES JR",
        "ANALISTA FINANCEIRO SR",
        "ANALISTA INVENTARIO JR",
        "ANALISTA INVENTARIO PL",
        "ANALISTA INVENTARIO SR",
        "ANALISTA LOGISTICO JR",
        "ANALISTA LOGISTICO SR",
        "ANALISTA PLANEJAMENTO JR",
        "ANALISTA PLANEJAMENTO PL",
        "ANALISTA PLANEJAMENTO SR",
        "ANALISTA PREVENCAO PERDAS PL",
        "ANALISTA PREVENCAO PERDAS SR",
        "ANALISTA RECURSOS HUMANOS JR",
        "ANALISTA RECURSOS HUMANOS PL",
        "ANALISTA RECURSOS HUMANOS SR",
        "ANALISTA SUPORTE JR",
        "ANALISTA TREINAMENTO OPERACIONAL JR",
        "ASSISTENTE ADMINISTRATIVO",
        "ASSISTENTE INVENTARIO",
        "ASSISTENTE PLANEJAMENTO",
        "ASSISTENTE RECURSOS HUMANOS",
        "ASSISTENTE TREINAMENTO OPERACIONAL",
        "AUX APOIO LOGISTICO",
        "AUXILIAR ADMINISTRATIVO",
        "AUXILIAR PREVENCAO PERDAS",
        "COMPRADOR JR",
        "CONFERENTE MATERIAIS",
        "COORDENADOR CONTRATO",
        "COORDENADOR CONTRATO ECOM",
        "COORDENADOR INVENTARIO",
        "COORDENADOR MANUTENCAO",
        "COORDENADOR PLANEJAMENTO",
        "COORDENADOR PREVENCAO PERDAS",
        "COORDENADOR RECURSOS HUMANOS",
        "DIRETOR OPERACOES CL",
        "ENFERMEIRO TRABALHO",
        "ENGENHEIRO SEGURANCA TRABALHO",
        "ESPECIALISTA DADOS I",
        "ESPECIALISTA PROJETOS",
        "ESTAGIARIO",
        "GERENTE CONTRATO ECOM",
        "GERENTE EXCELENCIA OPERACIONAL",
        "GERENTE INVENTARIO",
        "GERENTE OPERACOES CL SR",
        "GERENTE RECURSOS HUMANOS",
        "INSTRUTOR TECNICO",
        "OPERADOR CENTRAL MONITORAMENTO",
        "OPERADOR LOGISTICO",
        "SUPERVISOR CONTRATO ECOM",
        "SUPERVISOR EXCELENCIA OPERACIONAL",
        "SUPERVISOR MANUTENCAO",
        "SUPERVISOR PLANEJAMENTO",
        "SUPERVISOR PREVENCAO PERDAS",
        "TECNICO DE ENFERMAGEM DO TRABALHO",
        "TECNICO ENFERMAGEM TRABALHO",
        "TECNICO SEGURANCA TRABALHO",
      ],
    },
    {
      name: "bu",
      label: "BU",
      size: "small",
      selectItems: ["55476 - BLOCO B ", "55480 - NAVE D"],
    },
    {
      name: "shift",
      label: "Shift",
      size: "small",
      selectItems: [
        "1ST SHIFT",
        "2ND SHIFT",
        "3RD SHIFT",
        "4TH SHIFT",
        "5TH SHIFT",
        "6TH SHIFT",
        "ADM",
      ],
    },
    {
      name: "schedule_time",
      label: "Schedule Time",
      size: "small",
      selectItems: [
        "06:00 as 14:20 Segunda a Sabado",
        "14:20 as 22:35 Segunda a Sabado",
        "22:35 as 06:00 Segunda a Sabado",
        "06:00 as 14:20 Terca a Domingo",
        "14:20 as 22:35 Terca a Domingo",
        "22:35 as 06:00 Domingo a Sexta",
        "08:00 as 17:48 Segunda a Sexta",
      ],
    },
    {
      name: "company",
      label: "Company",
      size: "small",
       
    },
    {
      name: "status",
      label: "Status",
      size: "small",
      selectItems: ["ATIVO", "DESLIGADO", "AFASTADO", "NO SHOW"],
    },
    { name: "hire_date", label: "Hire Date", size: "small" },
    { name: "date_of_birth", label: "Date of Birth", size: "small" },
    {
      name: "ethnicity",
      label: "Etinicity",
      size: "small",
      selectItems: ["Parda", "Branca", "Preta/Negra", "Amarela", "Indigena"],
    },
    {
      name: "gender",
      label: "Gender",
      size: "small",
      selectItems: ["MASCULINO", "FEMININO"],
    },
    { name: "neighborhood", label: "Neighborhood", size: "small" },
    { name: "city", label: "City", size: "small" },
    { name: "email", label: "Email", size: "small" },
    { name: "phone", label: "Phone", size: "small" },
    { name: "integration_date", label: "Integration Date", size: "small" },
  ];

  const renderSelectField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel sx={{ marginBottom: "8px",fontWeight:'bold' }} htmlFor={field.name}>
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
      <InputLabel sx={{ marginBottom: "8px",fontWeight:'bold' }} htmlFor={field.name}>
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
    if (
      [
        "employee_id",
        "cpf",
        "name",
        "hire_date",
        "date_of_birth",
        "email",
        "phone",
        "neighborhood",
        "city",
        "integration_date"
        
      ].includes(field.name)
    ) {
      return renderTextField(field);
    } else {
      return renderSelectField(field);
    }
  };

  return (
    <Modal
    sx={{
      margin: "1em",
      padding: "1em",
      maxHeight: "95vh",  // Defina a altura máxima desejada
      overflowY: "auto", 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Adiciona rolagem vertical
    }}
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
            {formFields.map(renderFormFields)}
          </Grid>
          <Box sx={{}}>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={updateMode ? handleUpdate : handleSubmit}
              sx={{ marginRight: "1em" }}
            >
              {updateMode ? "Update" : "Save"}
            </LoadingButton>
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
});

HrAddForm.displayName = 'HrForm';

export default HrAddForm;
