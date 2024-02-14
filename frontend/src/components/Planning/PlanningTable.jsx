import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Snackbar,
  Alert,
  TableSortLabel,
  Grid,
  InputAdornment,
  Select,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import PlanningForm from "./PlanningForm";

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: "0",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  border: "0",
};

const PlanningTable = () => {
  //Return componente jsx

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]); // States
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employee_id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msgEP, msgEPData] = useState("");
  const [loading, setLoading] = useState(false);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // fetchData(); //When components start apply this function
    const mockData = [
      { employee_id: '123456', name: 'Yan', cpf: '480-078-408-50', role_: 'bpe' },
      { employee_id: '789012', name: 'João', cpf: '123-456-789-10', role_: 'developer' },
      // Adicione mais dados conforme necessário
    ];

    // Atualizando o estado com os dados mockados
    setData(mockData);

    // Atualizando a lista única de empresas com os dados mockados
    const uniqueCompanies = [...new Set(mockData.map((row) => row.company))];
    setUniqueCompanies(uniqueCompanies);
  }, []);


  const handleEditClick = (employeeId) => {
    const selectedEmployeeData = data.find((employee) => employee.employee_id === employeeId);
    setSelectedEmployee(selectedEmployeeData);
    setOpenModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/agency/list_employee"
      ); // Get ep and return data from employee_register
      setData(response.data);

      const uniqueCompanies = [
        ...new Set(response.data.map((row) => row.company)),
      ];
      setUniqueCompanies(uniqueCompanies);
    } catch (error) {
      console.error("Error in the request:", error);
    }
  };


  const headCells = [
    // Define columns
    {
      id: "employee_id",
      numeric: false,
      disablePadding: true,
      label: "Employee ID",
    },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "cpf", numeric: false, disablePadding: false, label: "CPF" },
    { id: "role_", numeric: false, disablePadding: false, label: "Role" },
    { id: "bu", numeric: false, disablePadding: false, label: "Business Unit" },
    { id: "shift", numeric: false, disablePadding: false, label: "Shift" },
    { id: "company", numeric: false, disablePadding: false, label: "Company" },
  ];

  const descendingComparator = (a, b, orderBy) =>
    b[orderBy].localeCompare(a[orderBy]); //sorting functions
  const getComparator = (order, orderBy) => (a, b) =>
    (order === "desc" ? -1 : 1) * descendingComparator(a, b, orderBy);

  const stableSort = (array, comparator) => {
    // console.log('sla',[...array].sort(comparator))
    return [...array].sort(comparator);
  };

  const handleRequestSort = (property) => {
    // pagination
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.employee_id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => {
    // console.log('id', id)
    return selected.includes(id);
  }; // verifica true or false se os id existem no selected;

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - data.length);

  const visibleRows = stableSort(data, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const formattedDateFilter = dateFilter; // Ajuste conforme necessário

  const filteredData = visibleRows.filter(
    (row) =>
      row.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      row.employee_id.toString().includes(searchTerm) &&
      (companyFilter === "" ||
        row.company.toLowerCase().includes(companyFilter.toLowerCase())) &&
      (formattedDateFilter === "" ||
        (row.integration_date &&
          row.integration_date.substring(0, 10) === formattedDateFilter))
  );

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignContent: "center",
          marginX: "1em",
          marginTop: "1em",
          justifyContent: "space-between",
        }}
      >

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'baseline', gap: '1em' }}>

          <TextField
            label="Search by Name"
            variant="outlined"
            size="small"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            sx={{}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Search by Employee ID"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginLeft: "1em" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Select
            label="Filter by Company"
            variant="outlined"
            size="small"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            sx={{ marginLeft: "1em", minWidth: "150px" }}
          >
            <MenuItem value="">All Companies</MenuItem>
            {uniqueCompanies.map((company) => (
              <MenuItem key={company} value={company}>
                {company}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Filter by Integration Day"
            type="date"
            variant="outlined"
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ marginLeft: "1em" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TableContainer sx={{ paddingX: "1em", marginTop: "1em" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0eef1" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  {/* <Checkbox
                    color="primary"
                    checked={selected.length === data.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all employee_id" }}
                  /> */}
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.id === "employee_id" ? "left" : "right"}
                    sx={{
                      fontSize: "14x", // Adjust font size as needed
                      padding: "10px", // Adjust padding between columns
                      fontWeight: "bold",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span style={{ ...visuallyHidden }}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => {
                const isItemSelected = isSelected(row.employee_id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.employee_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <EditIcon
                        color="primary"
                        onClick={() => handleEditClick(row.employee_id)}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.id === "employee_id" ? "left" : "right"}
                      >
                        {row[headCell.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => handleChangePage(event, newPage)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

        </TableContainer>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={
              msgEP === "Registros inseridos com sucesso" ? "success" : "error"
            }
          >
            {msgEP}
          </Alert>
        </Snackbar>
        <Modal
       
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="edit-modal"
          aria-describedby="form-for-editing"
        >
          <PlanningForm
            employeeData={selectedEmployee}
            onClose={() => setOpenModal(false)}
          />
        </Modal>
      </Grid>
    </Grid>
  );
};

export default PlanningTable;
