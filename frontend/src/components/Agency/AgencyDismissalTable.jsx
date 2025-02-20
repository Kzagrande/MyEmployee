import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
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
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import http from "@config/http";
import moment from "moment";

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

const AgencyDismissalTable = () => {
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

  useEffect(() => {
    fetchData(); //When components start apply this function
  }, []);

  const fetchData = async () => {
    try {
      const response = await http.get("/agency/dismissal_list"); // Get ep and return data from employee_register
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
      id: "manager_id",
      numeric: false,
      disablePadding: false,
      label: "Matrícula do requisitor",
    },
    {
      id: "requesting_manager",
      numeric: false,
      disablePadding: false,
      label: "Nome do requisitor",
    },
    {
      id: "employee_id",
      numeric: false,
      disablePadding: true,
      label: "Matrícula do colaborador",
    },
    {
      id: "employee_name",
      numeric: false,
      disablePadding: false,
      label: "Nome do colaborador",
    },
    { id: "bu", numeric: false, disablePadding: false, label: "Nave" },
    {
      id: "observation_disconnection",
      numeric: false,
      disablePadding: false,
      label: "Observação",
    },
    {
      id: "fit_for_hiring",
      numeric: false,
      disablePadding: false,
      label: "Apto para recontratação",
    },
    {
      id: "created_at",
      numeric: false,
      disablePadding: false,
      label: "Data do pedido",
    },
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

  const handleDismissal = () => {
    setLoading(true);
    // console.log('selected-->', selected);
    http
      .post("/agency/set_dismissal", {
        ids: selected,
      })
      .then((response) => {
        // console.log('response.data-->', response.data);
        msgEPData(response.data.message);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
        fetchData();
      })
      .catch((error) => {
        // console.error('error.response.data -->', error.response.data);
        msgEPData(response.data.message);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const formattedDateFilter = dateFilter; // Ajuste conforme necessário

  const filteredData = visibleRows.filter(
    (row) =>
      formattedDateFilter === "" ||
      (row.created_at &&
        row.created_at.substring(0, 10) ===
          moment(formattedDateFilter).format("DD/MM/YYYY"))
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
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          color="error"
          onClick={handleDismissal}
          sx={{}}
        >
          <span>Desligar Colaboradores</span>
        </LoadingButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "baseline",
            gap: "1em",
          }}
        >
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
                  <Checkbox
                    color="primary"
                    checked={selected.length === data.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all employee_id" }}
                  />
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
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id} align={"center"}>
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
      </Grid>
    </Grid>
  );
};

export default AgencyDismissalTable;
