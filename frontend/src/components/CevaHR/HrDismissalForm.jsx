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

const HrDismissalForm = ({ employeeData, onClose, openFormModal }) => {
  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    cpf: employeeData ? employeeData.cpf : "",
    employee_id: employeeData ? employeeData.employee_id : null,
    role_: employeeData ? employeeData.role_ : "",
    bu: employeeData ? employeeData.bu : "",
    status: employeeData ? employeeData.status : "",
    shift: employeeData ? employeeData.shift : "",
    sector: employeeData ? employeeData.sector : "",
    bu: employeeData ? employeeData.bu : "",
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
    integration_date: employeeData ? employeeData.integration_date : "",
    dismissal_date: employeeData ? employeeData.dismissal_date : "",
    termination_type: employeeData ? employeeData.termination_type : "",
    reason: employeeData ? employeeData.reason : "",
    communication_date: employeeData ? employeeData.communication_date : "",
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

  const prepareData = () => {
    const employee_register = {
      cpf:formData.cpf,
      employee_id:formData.employee_id,
      name : formData.name,
      role_ : formData.role_,
      bu : formData.bu,
      status : formData.status,
      shift : formData.shift,
      schedule_time : formData.schedule_time,
      company : formData.company,
      hire_date : formData.hire_date,
      date_of_birth : formData.date_of_birth,
      ethnicity : formData.ethnicity,
      gender : formData.gender,
      neighborhood : formData.neighborhood,
      city : formData.city,
      email : formData.email,
      phone : formData.phone,
      integration_date:formData.integration_date 
    };
  
    const company_infos = {
      sector: formData.sector,
      employee_id:formData.employee_id
      // Adicione outros campos de informações da empresa conforme necessário
    };
  
    const dismissal_infos = {
      dismissal_date: formData.dismissal_date,
      termination_type: formData.termination_type,
      reason: formData.reason,
      communication_date: formData.communication_date,
      employee_id:formData.employee_id
      // Adicione outros campos de informações de demissão conforme necessário
    };
  
    return { employee_register, company_infos, dismissal_infos };
  };
  
  const handleHttpRequest = async (endpoint, successMessage) => {
    setLoading(true);
    try {
      const data = prepareData();
      const response = await http.post(endpoint, data);
      setMsgEPData(response.data.Message);
      setSnackbarOpen(true);
      setLoading(false);
      window.location.reload();
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
    handleHttpRequest(
      "/hr/update_dismissal_employee",
      "Informações alteradas com sucesso!"
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
      disabled: true,
    },
    { name: "cpf", label: "CPF", size: "small" },
    { name: "name", label: "Name", size: "small" },
    {
      name: "role_",
      label: "Role",
      size: "small",
      selectItems: [
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
        "ANALISTA DE INVENTARIO",
      ],
    },
    {
      name: "bu",
      label: "BU",
      size: "small",
      selectItems: ["5500476 - NAVE B", "5500480 - NAVE D"],
    },
    {
      name: "status",
      label: "Status",
      size: "small",
      selectItems: ["ACTIVE", "AWAY", "TO BE FIRED", "FIRED", "NO SHOW"],
      disabled: true,
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
      name: "sector",
      label: "Sector",
      size: "small",
      selectItems: [
        "INVENTORY",
        "LOSS PREVENTION",
        "QUALITY HEALTH SECURITY ENVIRONMENT",
        "PLANNING",
        "FINANCE",
        "FACILITIES",
        "HUMAN RESOURCES",
        "BUSINESS PROCESS EXCELLENCE",
        "ADM",
        "INFORMATION TECHNOLOGY",
        "INBOUND",
        "PUTAWAY",
        "PACKING",
        "SORTING (OUT)",
        "PACKING",
        "BOXING",
      ],
    },
    {
      name: "schedule_time",
      label: "Schedule Time",
      size: "small",
      selectItems: [
        "06:00 AS 14:20 SEGUNDA A SABADO",
        "14:20 AS 22:35 SEGUNDA A SABADO",
        "22:35 AS 06:00 SEGUNDA A SABADO",
        "06:00 AS 14:20 TERCA A DOMINGO",
        "14:20 AS 22:35 TERCA A DOMINGO",
        "22:35 AS 06:00 DOMINGO A SEXTA",
        "08:00 AS 17:48 SEGUNDA A SEXTA",
      ],
    },
    {
      name: "company",
      label: "Company",
      size: "small",
      selectItems: ["AMERICA RH", "CEVA", "RH NOSSA", "VALOR RH"],
    },

    { name: "hire_date", label: "Hire Date", size: "small" },
    { name: "date_of_birth", label: "Date of Birth", size: "small" },
    {
      name: "ethnicity",
      label: "Etinicity",
      size: "small",
      selectItems: ["PARDA", "BRANCA", "PRETA/NEGRA", "AMARELA", "INDIGENA"],
    },
    {
      name: "gender",
      label: "Gender",
      size: "small",
      selectItems: ["FEMININO", "MASCULINO"],
    },
    { name: "neighborhood", label: "Neighborhood", size: "small" },
    { name: "city", label: "City", size: "small" },
    { name: "integration_date", label: "Integration Date", size: "small" },
    { name: "email", label: "Email", size: "small" },
    { name: "phone", label: "Phone", size: "small" },
    { name: "dismissal_date", label: "Dia da demissão", size: "small" },
    { name: "termination_type", label: "Natureza", size: "small" },
    { name: "reason", label: "Motivo", size: "small" },
    { name: "communication_date", label: "Data da comunicação", size: "small" },
  ];

  const renderSelectField = (field) => (
    <Grid item xs={6} key={field.name}>
      <InputLabel
        sx={{ fontWeight: "bold", color: "#a53333" }}
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
        "integration_date",
        "dismissal_date",
        "termination_type",
        "reason",
        "communication_date",
        "status",
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
          Edit Employee
        </Typography>
        <form>
          <Grid container spacing={1} sx={{ marginBottom: "1em" }}>
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
            <LoadingButton
              color="error"
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

HrDismissalForm.displayName = "HrForm";

export default HrDismissalForm;
