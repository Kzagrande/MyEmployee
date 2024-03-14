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
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import PlanningForm from "./PlanningIntForm";
import http from "@config/http.js";

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msgEP, msgEPData] = useState("");
  const [uniqueStatus, setUiiniqueStatus] = useState([]);
  const [uniqueSector, setUniqueSector] = useState([]);
  const [uniqueBu, setUniqueBu] = useState([]);
  const [uniqueShift, setUniqueShift] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [buFilter, setBuFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (employeeId) => {
    const selectedEmployeeData = data.find(
      (employee) => employee.employee_id === employeeId
    );
    setSelectedEmployee(selectedEmployeeData);
    setOpenModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await http.get("/planning/list_employee?dbTable=active_hc"); // Get ep and return data from employee_register
      setData(response.data);

      const uniqueStatus = [...new Set(response.data.map((row) => row.status))];
      setUiiniqueStatus(uniqueStatus);

      const uniqueSector = [...new Set(response.data.map((row) => row.sector))];
      const filteredSector = uniqueSector.filter(sector => sector !== '');
      setUniqueSector(filteredSector);

      const uniqueBu = [...new Set(response.data.map((row) => row.bu))];
      const filteredBu = uniqueBu.filter(bu => bu !== '');
      setUniqueBu(filteredBu);

      const uniqueShift = [...new Set(response.data.map((row) => row.shift))];
      const filterShift = uniqueShift.filter(bu => bu !== '');
      setUniqueShift(filterShift);
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
    { id: "status", numeric: false, disablePadding: false, label: "Status" },
    { id: "role_", numeric: false, disablePadding: false, label: "Role" },
    { id: "sector", numeric: false, disablePadding: false, label: "Setor" },
    {
      id: "manager_1",
      numeric: false,
      disablePadding: false,
      label: "Responsável",
    },
    ,
    { id: "bu", numeric: false, disablePadding: false, label: "Business Unit" },
    { id: "shift", numeric: false, disablePadding: false, label: "Shift" },
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

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
  
  const filteredData = visibleRows.filter(row =>
    (row.name && row.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
    (row.employee_id.toString().includes(searchTerm)) &&
    (statusFilter === "" || (row.status && row.status.toLowerCase().includes(statusFilter.toLowerCase()))) &&
    (sectorFilter === "" || (row.sector && row.sector.toLowerCase().includes(sectorFilter.toLowerCase()))) &&
    (buFilter === "" || (row.bu && row.bu.toLowerCase().includes(buFilter.toLowerCase()))) &&
    (shiftFilter === "" || (row.shift && row.shift.toLowerCase().includes(shiftFilter.toLowerCase())))
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "baseline",
            gap: "1em",
          }}
        >
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
          <Select
            displayEmpty
            size="small"
            name="test"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Stauts"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ marginLeft: "1em", minWidth: "150px" }}
          >
            <MenuItem value="">Status...</MenuItem>
            {uniqueStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          <Select
            displayEmpty
            size="small"
            name="test"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Stauts"
            value={buFilter}
            onChange={(e) => setBuFilter(e.target.value)}
            sx={{ marginLeft: "1em", minWidth: "150px" }}
          >
            <MenuItem value="">Nave...</MenuItem>
            {uniqueBu.map((bu) => (
              <MenuItem key={bu} value={bu}>
                {bu}
              </MenuItem>
            ))}
          </Select>
          <Select
            displayEmpty
            size="small"
            name="test"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Setor"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            sx={{ marginLeft: "1em", minWidth: "150px" }}
          >
            <MenuItem value="">Setor...</MenuItem>
            {uniqueSector.map((sector) => (
              <MenuItem key={sector} value={sector}>
                {sector}
              </MenuItem>
            ))}
          </Select>
          <Select
            displayEmpty
            size="small"
            name="test"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Shift"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            sx={{ marginLeft: "1em", minWidth: "150px" }}
          >
            <MenuItem value="">Turno</MenuItem>
            {uniqueShift.map((shift) => (
              <MenuItem key={shift} value={shift}>
                {shift}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TableContainer sx={{ paddingX: "1em", marginTop: "1em" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0eef1" }}>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={"center"}
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
              {filteredData.map((row) => {
                return (
                  <TableRow>
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
            rowsPerPageOptions={[5, 10, 25, 50, 100, 5000]}
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
            openFormModal={openModal}
          />
        </Modal>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="edit-modal"
          aria-describedby="form-for-editing"
        >
          <PlanningForm
            employeeData={selectedEmployee}
            onClose={() => setOpenModal(false)}
            openFormModal={openModal}
          />
        </Modal>
      </Grid>
    </Grid>
  );
};

export default PlanningTable;
