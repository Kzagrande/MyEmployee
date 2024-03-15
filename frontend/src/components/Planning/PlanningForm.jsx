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

const PlanningForm = forwardRef(({employeeData, onClose, openFormModal }, ref) => {
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
    schedule_time: employeeData ? employeeData.schedule_time : "",
    company: employeeData ? employeeData.company : "",
    manager_1: employeeData ? employeeData.manager_1 : "",
    status: employeeData ? employeeData.status : "",
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

  const handleUpdate = () => {
    handleHttpRequest("/planning/update_planning_employee");
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
    { name: "employee_id", label: "Matrícula", size: "small", disabled: true },
    { name: "name", label: "Name", size: "small", disabled: true,disabled: true },
    { name: "bu", label: "BU", size: "small",selectItems: ["5500476 - NAVE B", "5500480 - NAVE D"], },
    { name: "shift", label: "Shift", size: "small",      selectItems: [
      "1ST SHIFT",
      "2ND SHIFT",
      "3RD SHIFT",
      "4TH SHIFT",
      "5TH SHIFT",
      "6TH SHIFT",
      "ADM",
    ], },
    { name: "sector", label: "Sector", size: "small",selectItems:[
    "INVENTORY", "LOSS PREVENTION", "QUALITY HEALTH SECURITY ENVIRONMENT", 
    "PLANNING", "FINANCE", "FACILITIES", "HUMAN RESOURCES",
     "BUSINESS PROCESS EXCELLENCE", "ADM", "INFORMATION TECHNOLOGY","INBOUND","PUTAWAY","PACKING","SORTING (OUT)","PACKING","BOXING"]},

    { name: "role_", label: "Role", size: "small" ,  selectItems: [
      "AUX. APOIO LOGISTICO",
      "CONFERENTE MATERIAIS",
      "COORDENADOR CONTRATO",
      "ANALISTA LOGISTICO SR.",
      "TECNICO DE ENFERMAGEM DO TRABALHO",
      "OPERADOR CENTRAL MONITORAMENTO",
      "ASSISTENTE ADMINISTRATIVO",
      "AUXILIAR PREVENCAO PERDAS",
      "OPERADOR LOGISTICO",
      "ASSISTENTE RECURSOS HUMANOS",
      "ANALISTA RECURSOS HUMANOS JR.",
      "GERENTE INVENTARIO",
      "GERENTE CONTRATO ECOM",
      "GERENTE OPERACOES CL SR",
      "ANALISTA INVENTARIO PL.",
      "COORDENADOR CONTRATO ECOM",
      "COORDENADOR RECURSOS HUMANOS",
      "SUPERVISOR MANUTENCAO",
      "GERENTE EXCELENCIA OPERACIONAL",
      "ANALISTA PREVENCAO PERDAS PL.",
      "GERENTE RECURSOS HUMANOS",
      "COORDENADOR PREVENCAO PERDAS",
      "COORDENADOR INVENTARIO",
      "ANALISTA INVENTARIO SR.",
      "SUPERVISOR CONTRATO ECOM",
      "ANALISTA EXCELENCIA OPERACIONAL SR",
      "ANALISTA EXCELENCIA OPERACIONAL JR",
      "ASSISTENTE INVENTARIO",
      "ANALISTA PLANEJAMENTO JR",
      "ASSISTENTE TREINAMENTO OPERACIONAL",
      "ANALISTA TREINAMENTO OPERACIONAL JR",
      "ANALISTA PLANEJAMENTO PL",
      "ANALISTA PLANEJAMENTO SR.",
      "ANALISTA INVENTARIO JR.",
      "ANALISTA FACILITIES JR",
      "ENGENHEIRO SEGURANCA TRABALHO",
      "ANALISTA RECURSOS HUMANOS SR.",
      "ANALISTA RECURSOS HUMANOS PL.",
      "ANALISTA SUPORTE JR.",
      "ENFERMEIRO TRABALHO",
      "TECNICO ENFERMAGEM TRABALHO",
      "COORDENADOR PLANEJAMENTO",
      "SUPERVISOR PLANEJAMENTO",
      "COMPRADOR JR.",
      "ANALISTA LOGISTICO JR.",
      "ESTAGIARIO",
      "TECNICO SEGURANCA TRABALHO",
      "ESPECIALISTA PROJETOS",
      "ESPECIALISTA DADOS I",
      "DIRETOR OPERACOES CL",
      "SUPERVISOR PREVENCAO PERDAS",
      "SUPERVISOR EXCELENCIA OPERACIONAL",
      "ANALISTA PREVENCAO PERDAS SR.",
      "ASSISTENTE PLANEJAMENTO",
      "ANALISTA FINANCEIRO SR",
      "ANALISTA DE INVENTARIO"
      ],},
    { name: "collar", label: "Collar", size: "small",selectItems: ["WHITE", "BLUE"], },
    { name: "work_schedule", label: "Work Schedule", size: "small",selectItems: ["A", "B","C","D","E"], },
    { name: "type_", label: "Type", size: "small",selectItems: ["DIRECT", "INDIRECT"], },
    { name: "schedule_time", label: "Schedule Time", size: "small",      selectItems: [
      "06:00 as 14:20 Segunda a Sabado",
      "14:20 as 22:35 Segunda a Sabado",
      "22:35 as 06:00 Segunda a Sabado",
      "06:00 as 14:20 Terca a Domingo",
      "14:20 as 22:35 Terca a Domingo",
      "22:35 as 06:00 Domingo a Sexta",
      "08:00 as 17:48 Segunda a Sexta",
    ], },
    { name: "company", label: "Company", size: "small", disabled: true },
    { name: "manager_1", label: "Responsável", size: "small" },
    { name: "status", label: "Status", size: "small", disabled: true },
  ];

  const renderSelectField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel sx={{ marginBottom: "8px",fontWeight:'bold',color:'#a53333' }} htmlFor={field.name}>
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
      <InputLabel sx={{ marginBottom: "8px",fontWeight:'bold',color:'#a53333' }} htmlFor={field.name}>
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
        "name",
        "company",
        "status",
        "manager_1"
        
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
        <Typography variant="h6" sx={{fontWeight:'bold',marginBottom:'.5em'}} style={{ fontFamily: 'Libre Baskerville, sans-serif' }}>Edit Employee</Typography>
        <form>
          <Grid container spacing={2} sx={{ marginBottom: "1em" }}>
            {formFields.map(renderFormFields)}
          </Grid>
          <Box sx={{}}>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{ marginRight: "1em" }}
            >
              Update
            </LoadingButton>
            <LoadingButton color='error' variant="contained" onClick={handleCloseModal}>
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

PlanningForm.displayName = 'PlanningForm';

export default PlanningForm;
