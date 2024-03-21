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

const HrDismissalForm = (
  ({ updateMode, employeeData, onClose, openFormModal }) => {
    const [formData, setFormData] = useState({
      name: employeeData ? employeeData.name : "",
      cpf: employeeData ? employeeData.cpf : "",
      employee_id: employeeData ? employeeData.employee_id : null,
      role_: employeeData ? employeeData.role_ : "",
      status: employeeData ? employeeData.status : "",
      company: employeeData ? employeeData.company : "",
      hire_date: employeeData ? employeeData.hire_date : "",
      phone: employeeData ? employeeData.phone : "",
      email: employeeData ? employeeData.email : "",
      integration_date: employeeData ? employeeData.integration_date : "",
      dismissal_date: employeeData ? employeeData.dismissal_date : "",
      termination_type: employeeData ? employeeData.termination_type : "",
      reason:   employeeData? employeeData.reason: "",
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
      handleHttpRequest(
        "/hr/update_dismissal_employee",
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
      { name: "name", label: "Name", size: "small",disabled:true },
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
        disabled:true
      },

      {
        name: "status",
        label: "Status",
        size: "small",
        selectItems: ["ACTIVE", "AWAY", "TO BE FIRED", "FIRED", "NO SHOW"],
        disabled:true
      },

      {
        name: "company",
        label: "Company",
        size: "small",
        selectItems: ["AMERICA RH", "CEVA", "RH NOSSA", "VALOR RH"],
        disabled:true
      },
      { name: "hire_date", label: "Hire Date", size: "small" ,disabled:true},
      { name: "email", label: "Email", size: "small" ,disabled:true},
      { name: "phone", label: "Phone", size: "small" ,disabled:true},
      { name: "dismissal_date", label: "Dia da demissão", size: "small", },
      { name: "termination_type", label: "Natureza", size: "small" },
      { name: "reason", label: "Motivo", size: "small" },
      { name: "communication_date", label: "Data da comunicação", size: "small" },
    ];

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
        return renderTextField(field);
}

    return (
      <Modal
        sx={{
          overflowY: "auto",
          marginY:'2em'

        }}
        open={isModalOpen}
        aria-labelledby="add-employee-modal"
        aria-describedby="form-for-adding-employee"
      >
        <Container
          sx={{ backgroundColor: "white",paddingY:'1em'}}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold" }}
            style={{ fontFamily: "Libre Baskerville, sans-serif" }}
          >
            Edit Employee
          </Typography>
          <form >
            <Grid
              container
              spacing={1}
              sx={{ marginBottom: "1em" }}
            >
              {formFields.map(renderFormFields)}
            </Grid>
            <Box sx={{}}>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                onClick={ handleUpdate}
                sx={{ marginRight: "1em" }}
              >
                Update
              </LoadingButton>
              <LoadingButton color="error" variant="contained" onClick={handleCloseModal}>
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
  }
);

HrDismissalForm.displayName = "HrForm";

export default HrDismissalForm;
