// DataTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    // Substitua a URL abaixo pela sua API
    axios.get('http://localhost:3001/auth/list_employee')
      .then(response => {
        console.log('list_employee_ep', response.data)
        setData(response.data.data);
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>ID Employee</th>
              <th>Admission Date</th>
              <th>Company</th>
              <th>Warehouse</th>
              <th>BZ</th>
              <th>Collar</th>
              <th>Category</th>
              <th>Sector</th>
              <th>Role 1</th>
              <th>Shift</th>
              <th>Schedule</th>
              <th>Manager 1</th>
              <th>Manager 2</th>
              <th>Manager 3</th>
              <th>Status</th>
              <th>Role 2</th>
              <th>User</th>
              {/* Adicione mais colunas conforme necessário */}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.id_employee}</td>
                <td>{item.admission_dt}</td>
                <td>{item.company}</td>
                <td>{item.warehouse}</td>
                <td>{item.bz}</td>
                <td>{item.collar}</td>
                <td>{item.category}</td>
                <td>{item.sector}</td>
                <td>{item.role_1}</td>
                <td>{item.shift}</td>
                <td>{item.schedule}</td>
                <td>{item.manager_1}</td>
                <td>{item.manager_2}</td>
                <td>{item.manager_3}</td>
                <td>{item.status}</td>
                <td>{item.role_2}</td>
                <td>{item.user_}</td>
                {/* Adicione mais colunas conforme necessário */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
