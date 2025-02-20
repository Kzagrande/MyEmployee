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
import { jwtDecode } from "jwt-decode";

const HrAddForm = ({ updateMode, employeeData, onClose, openFormModal }) => {
  const [formData, setFormData] = useState({
    name: employeeData ? employeeData.name : "",
    cpf: employeeData ? employeeData.cpf : "",
    employee_id: employeeData ? employeeData.employee_id : null,
    role_: employeeData ? employeeData.role_ : "",
    bu: employeeData ? employeeData.bu : "",
    status: employeeData ? employeeData.status : "",
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
    editor_id: "",
    // Add other form fields as needed
  });
  const [originalFormData, setOriginalFormData] = useState({ ...formData });
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
    setOriginalFormData((prevOriginalData) => ({
      ...prevOriginalData,
      [name]: employeeData ? employeeData[name] : "", // Se não houver dados do funcionário, defina o valor como vazio
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const editor_id = decoded.employee_id;
      setFormData((prevFormData) => ({
        ...prevFormData,
        editor_id: editor_id,
      }));
    }
  }, []); // Executar apenas uma vez, quando o componente é montado

  const handleHttpRequest = async (endpoint, successMessage) => {
    setLoading(true);
    try {
      const modifiedFields = {};
      const newData = {}; // Novo objeto para conter apenas os campos modificados

      // Comparar os valores antigos com os novos e adicionar apenas os modificados ao objeto modifiedFields
      for (const key in formData) {
        if (formData[key] !== originalFormData[key]) {
          if (key !== "editor_id") {
            // Exclua o editor_id dos campos modificados
            modifiedFields[key] = originalFormData[key];
            newData[key] = formData[key]; // Adicione os campos modificados ao newData
          }
        }
      }

      const requestData = {
        oldData: modifiedFields,
        newData: newData,
        data: formData,
        ids: {editor_id:formData.editor_id,employee_id:formData.employee_id}
      };

      const response = await http.post(endpoint, requestData);
      setMsgEPData(response.data.Message);
      setSnackbarOpen(true);
      setLoading(false);
      setTimeout(() => {
        handleCloseModal();
        setSnackbarOpen(false);
      }, 1000);
      setFormData(createEmptyFormData());
      setOriginalFormData(createEmptyFormData());
    } catch (error) {
      console.error(error.response.data.Error);
      setMsgEPData(error.response.data.Error);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleHttpRequest(
      "/hr/add_hr_employees",
      "Registros inseridos com sucesso"
    );
  };

  const handleUpdate = () => {
    handleHttpRequest(
      "/hr/update_hr_employee",
      "Informações alteradas com sucesso!"
    );
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
    { name: "email", label: "Email", size: "small" },
    { name: "phone", label: "Phone", size: "small" },
    { name: "integration_date", label: "Integration Date", size: "small" },
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
              onClick={updateMode ? handleUpdate : handleSubmit}
              sx={{ marginRight: "1em" }}
            >
              {updateMode ? "Update" : "Save"}
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

HrAddForm.displayName = "HrForm";

export default HrAddForm;
