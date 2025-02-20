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
  Checkbox,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect } from "react";
import http from "@config/http";
import { jwtDecode } from "jwt-decode";

const PlanningIntForm = forwardRef(
  ({ employeeData, onClose, openFormModal, ids }, ref) => {
    const [formData, setFormData] = useState({
      bu: employeeData ? employeeData.bu : "",
      shift: employeeData ? employeeData.shift : "",
      sector: employeeData ? employeeData.sector : "",
      work_schedule: employeeData ? employeeData.work_schedule : "",
      type_: employeeData ? employeeData.type_ : "",
      schedule_time: employeeData ? employeeData.schedule_time : "",
      manager_1: employeeData ? employeeData.manager_1 : "",
      manager_2: employeeData ? employeeData.manager_2 : "",
      manager_3: employeeData ? employeeData.manager_3 : "",
      status: employeeData ? employeeData.status : "",
      editor_id: "",
      // Add other form fields as needed
    });
    const [originalFormData, setOriginalFormData] = useState({ ...formData });
    const [loading, setLoading] = useState(false);
    const [msgEP, setMsgEPData] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(openFormModal);
    const [checkIntegration, setCheckIntegration] = useState(false);

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

    useEffect(() => {
      setIsModalOpen(openFormModal);
    }, [openFormModal]);

    useEffect(() => {
      if (checkIntegration == true) {
        setFormData(prevFormData => ({
          ...prevFormData,
          status: 'ACTIVE'
        }));
      }
    }, [checkIntegration]);

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

    const handleHttpRequest = async () => {
      setLoading(true);

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
        ids: {
          editor_id: formData.editor_id,
          employee_id: ids,
        },
      };

      // console.log('selected-->', selected);
      http
        .post("/planning/update_planning_group", {
          ids: ids,
          updates: requestData,
        })
        .then((response) => {
          // console.log('response.data-->', response.data);
          setMsgEPData(response.data.message);
          setSnackbarOpen(true); // Open the Snackbar on success
          setLoading(false);
        })
        .catch((error) => {
          // console.error('error.response.data -->', error.response.data);
          setMsgEPData(response.data.message);
          setSnackbarOpen(true); // Open the Snackbar on success
          setLoading(false);
        });
    };

    const handleUpdate = () => {
      handleHttpRequest("/planning/update_planning_group");
      window.location.reload();
    };

    const handleSetNoShow = () => {
      setLoading(true);
      // console.log('selected-->', selected);
      http
        .post("/planning/set_no_show", {
          ids: ids,
        })
        .then((response) => {
          // console.log('response.data-->', response.data);
          setMsgEPData(response.data.message);
          setLoading(false);
          setTimeout(() => {
            handleCloseModal();
            setSnackbarOpen(false);
          }, 1000);
          window.location.reload()
        })
        .catch((error) => {
          // console.error('error.response.data -->', error.response.data);
          setMsgEPData(response.data.message);
          setSnackbarOpen(true); // Open the Snackbar on success
          setLoading(false);
        });
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

    const handleCheck = (event) => {
      setCheckIntegration(event.target.checked); // Atualiza o estado com o valor do checkbox
      formData.status
    };

    const formFields = [
      { name: "employee_id", label: "Matrícula", size: "small", disabled: true },
      { name: "name", label: "Name", size: "small", disabled: true, disabled: true },
      { name: "bu", label: "BU", size: "small", selectItems: ["5500476 - NAVE B", "5500480 - NAVE D"], },
      {
        name: "shift", label: "Shift", size: "small", selectItems: [
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
        name: "sector", label: "Sector", size: "small", selectItems: [
          "INVENTORY", "LOSS PREVENTION", "QUALITY HEALTH SECURITY ENVIRONMENT",
          "PLANNING", "FINANCE", "FACILITIES", "HUMAN RESOURCES",
          "BUSINESS PROCESS EXCELLENCE", "ADM", "INFORMATION TECHNOLOGY", "INBOUND", "PUTAWAY", "PACKING", "SORTING (OUT)", "PACKING", "BOXING"]
      },

      {
        name: "role_", label: "Role", size: "small", selectItems: [
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
        ],
      },
      { name: "work_schedule", label: "Work Schedule", size: "small", selectItems: ["A", "B", "C", "D", "E"], },
      { name: "type_", label: "Type", size: "small", selectItems: ["DIRECT", "INDIRECT"], },
      {
        name: "schedule_time", label: "Schedule Time", size: "small", selectItems: [
          "06:00 as 14:20 Segunda a Sabado",
          "14:20 as 22:35 Segunda a Sabado",
          "22:35 as 06:00 Segunda a Sabado",
          "06:00 as 14:20 Terca a Domingo",
          "14:20 as 22:35 Terca a Domingo",
          "22:35 as 06:00 Domingo a Sexta",
          "08:00 as 17:48 Segunda a Sexta",
        ],
      },
      { name: "manager_1", label: "Responsável", size: "small" },
      { name: "manager_2", label: "Responsável 2", size: "small" },
      { name: "manager_3", label: "Responsável 3", size: "small" },

    ];


    const renderSelectField = (field) => (
      <Grid item xs={6} key={field.name}>
        <InputLabel
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
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
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
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
        ["company", "status", "manager_1", "manager_2", "manager_3"].includes(
          field.name
        )
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
        <Container
          sx={{ backgroundColor: "white", margin: "1em", padding: "1em" }}
        >
          <Box sx={{ display: 'flex', gap: '1em', justifyContent: 'space-between' }}>
            <Typography variant="h6">Edit Employee</Typography>
            <LoadingButton variant="contained" color="warning" onClick={handleSetNoShow}>
              AUSENTES
            </LoadingButton>
          </Box>
          <form>
            <Grid container spacing={0.5} sx={{ marginBottom: "1em" }}>
              {formFields.map(renderFormFields)}
            </Grid>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: ".5em",
              }}
            >
              <Checkbox
                checked={checkIntegration}
                onChange={handleCheck}
                sx={{ color: "#b3261e" }}
              ></Checkbox>
              <Typography sx={{ fontWeight: "bold", color: "#b3261e" }}>
                Colaboradores de integração?
              </Typography>
            </Box>
            <Box sx={{}}>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{ marginRight: "1em" }}
              >
                Atualizar dados
              </LoadingButton>
              <LoadingButton sx={{ marginRight: "2em" }} color="error" variant="contained" onClick={handleCloseModal}>
                Cancelar
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

PlanningIntForm.displayName = "PlanningIntForm";

export default PlanningIntForm;