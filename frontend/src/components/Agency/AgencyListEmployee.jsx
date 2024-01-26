import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";

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

const AgencyListEmployee = () => {
  //Return componente jsx

  const [data, setData] = useState([]); // States
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employee_id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msgEP, msgEPData] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchData(); //When components start apply this function
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/agency/list_employee"
      ); // Get ep and return data from agency_input_activies
      setData(response.data);
    } catch (error) {
      console.error("Error in the request:", error);
    }
  };

  const createData = (rowData) => ({
    id: rowData.employee_id,
    ...rowData,
  });

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

  const handleSavePresence = () => {
    setLoading(true);
    console.log('selected-->',selected);
    axios
      .post("http://localhost:3001/agency/set_presence", {
        ids: selected
      })
      .then((response) => {
        console.log('response.data-->', response.data);
        msgEPData(response.data.message);
        setSnackbarOpen(true); // Open the Snackbar on success
        setLoading(false);
        fetchData()
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


  return (
    <Grid container>
      <Grid item xs={4}>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          onClick={handleSavePresence}
          sx={{ marginX: "1em", marginTop: "1em" }}
        >
          <span>Salvar no banco de dados</span>
        </LoadingButton>
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
              {visibleRows.map((row, index) => {
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
            rowsPerPageOptions={[5, 10, 25]}
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

export default AgencyListEmployee;
