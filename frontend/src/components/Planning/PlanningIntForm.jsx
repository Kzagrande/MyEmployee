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

const PlanningIntForm = forwardRef(({employeeData, onClose, openFormModal,ids }, ref) => {
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

  const handleHttpRequest = async () => {
    setLoading(true);
    // console.log('selected-->', selected);
    http
      .post("/planning/update_planning_group", {
        ids: ids,
        updates:formData
      })
      .then((response) => {
        // console.log('response.data-->', response.data);
        setMsgEPData(response.data.message);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
        fetchData();
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
    { name: "bu", label: "BU", size: "small",selectItems: ["55476 - BLOCO B ", "55480 - NAVE D"], },
    { name: "shift", label: "Shift", size: "small",      selectItems: [
      "1ST SHIFT",
      "2ND SHIFT",
      "3RD SHIFT",
      "4TH SHIFT",
      "5TH SHIFT",
      "6TH SHIFT",
      "ADM",
    ], },
    { name: "sector", label: "Sector", size: "small",selectItems:["INBOUND","PUTAWAY","PICKING","SORTING(OUT)", "PACKING","BOXING", "LOSS PREVENTION", "QUALITY HEALTH SECURITY ENVIRONMENT", "PLANNING", "FINANCE", "FACILITIES", "HUMAN RESOURCES", "BUSINESS PROCESS EXCELLENCE", "ADM", "INFORMATION TECHNOLOGY"]},
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
    { name: "manager_1", label: "Responsável", size: "small" },
    { name: "manager_2", label: "Responsáve2", size: "small" },
    { name: "manager_3", label: "Responsáve3", size: "small" },
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
        "company",
        "status",
        "manager_1",
        "manager_2",
        "manager_3"
        
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
              onClick={handleUpdate}
              sx={{ marginRight: "1em" }}
            >
              Update
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

PlanningIntForm.displayName = 'PlanningIntForm';

export default PlanningIntForm;
