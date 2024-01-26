import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Toolbar,
  TableSortLabel,
} from '@mui/material';
import axios from 'axios';

const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: '0',
};

const EnhancedTable = () => { //Return componente jsx

  const [data, setData] = useState([]); // States 
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('employee_id');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  useEffect(() => {
    fetchData(); //When components start apply this function
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/list_employee'); // Get ep and return data from agency_input_activies
      setData(response.data);
    } catch (error) {
      console.error('Error in the request:', error);
    }
  };

  const createData = (rowData) => ({
    id: rowData.employee_id,
    ...rowData,
  });

  const headCells = [ // Define columns 
    { id: 'employee_id', numeric: false, disablePadding: true, label: 'Employee ID' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'cpf', numeric: false, disablePadding: false, label: 'CPF' },
    { id: 'role_', numeric: false, disablePadding: false, label: 'Role' },
    { id: 'bu', numeric: false, disablePadding: false, label: 'Business Unit' },
    { id: 'shift', numeric: false, disablePadding: false, label: 'Shift' },

    { id: 'company', numeric: false, disablePadding: false, label: 'Company' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'hire_date', numeric: false, disablePadding: false, label: 'Hire Date' },
    { id: 'date_of_biate', numeric: false, disablePadding: false, label: 'Date of BI/ATE' },
    { id: 'termination', numeric: false, disablePadding: false, label: 'Termination' },
    { id: 'reason', numeric: false, disablePadding: false, label: 'Reason' },
    { id: 'ethnicity', numeric: false, disablePadding: false, label: 'Ethnicity' },
    { id: 'gender', numeric: false, disablePadding: false, label: 'Gender' },
    { id: 'neighborhood', numeric: false, disablePadding: false, label: 'Neighborhood' },
    { id: 'city', numeric: false, disablePadding: false, label: 'City' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  ];

  const descendingComparator = (a, b, orderBy) => b[orderBy].localeCompare(a[orderBy]); //sorting functions
  const getComparator = (order, orderBy) => (a, b) => (order === 'desc' ? -1 : 1) * descendingComparator(a, b, orderBy);

  const stableSort = (array, comparator) => {
    // console.log('sla',[...array].sort(comparator))
    return [...array].sort(comparator)
  };

  const handleRequestSort = (property) => { // pagination
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
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
    console.log('id', id)
    return selected.includes(id)
  } // verifica true or false se os id existem no selected;

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - data.length);

  const visibleRows = stableSort(data, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  return (

    <Paper sx={{ width: '100%' }}>
      {/* Conteúdo da Toolbar */}
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selected.length === data.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all employee_id' }}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.id === 'employee_id' ? 'left' : 'right'}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span style={{ ...visuallyHidden }}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </TableCell>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.id === 'employee_id' ? 'left' : 'right'}
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
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => handleChangePage(event, newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EnhancedTable;
