import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const EmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    id_employee: "",
    admission_dt: "",
    company: "",
    warehouse: "",
    bz: "",
    collar: "",
    category: "",
    sector: "",
    role_1: "",
    shift: "",
    schedule: "",
    manager_1: "",
    manager_2: "",
    manager_3: "",
    status: "",
    role_2: "",
    user_: "",
  });


  const handleSubmit = (e) => {
    e.preventDefault()
    // const formData = new FormData();
    // formData.append('name', employeeData.name);
    // formData.append('id_employee', employeeData.id_employee);
    // formData.append('admission_dt', employeeData.admission_dt);
    // formData.append('warehouse', employeeData.warehouse);
    // formData.append('bz', employeeData.bz);
    // formData.append('collar', employeeData.collar);
    // formData.append('category', employeeData.category);
    // formData.append('sector', employeeData.sector);
    // formData.append('role_1', employeeData.role_1);
    // formData.append('shift', employeeData.shift);
    // formData.append('schedule', employeeData.schedule);
    // formData.append('manager_1', employeeData.manager_1);
    // formData.append('manager_2', employeeData.manager_2);
    // formData.append('manager_3', employeeData.manager_3);
    // formData.append('status', employeeData.status);
    // formData.append('role_2', employeeData.role_2);
    // formData.append('user_', employeeData.user_);

    console.log('formdata',employeeData)
    axios.post('http://localhost:3001/auth/add_employee', employeeData)
    .then(result => {
        if(result.data.Status) {
           console.log('dados inseridos com sucesso',values)
        } else {
            alert(result.data.Error)
        }
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="container p-5 ">
      <h1>Cadastro de Funcionários</h1>
      <div className="d-flex justify-content-center align-items-center vh-100 ">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputName" className="form-label fw-bold ">
                Nome:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputName"
                name="name"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, name: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputIdEmlpoyee" className="form-label fw-bold">
                Número de matrícula:
              </label>
              <input
                type="number"
                className="form-control"
                id="InputIdEmployee"
                name="employee_id"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, id_employee: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputAdmissionDt" className="form-label fw-bold">
                Data de adimissão:
              </label>
              <input
                type="date"
                className="form-control"
                id="inputAdmissionDt"
                name="admission_dt"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, admission_dt: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputCompany" className="form-label fw-bold">
                Empresa/Compania:
              </label>
              <input
                type="tel"
                className="form-control"
                id="inputCompany"
                name="company"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, company: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputWarehouse" className="form-label fw-bold">
                Nave:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputWarehouse"
                name="warehouse"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, warehouse: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputBz" className="form-label fw-bold">
                BZ:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputBz"
                name="bz"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, bz: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputCollar" className="form-label fw-bold ">
                Collar:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputCollar"
                name="collar"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, collar: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputCategory" className="form-label fw-bold">
                Categoria:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputCategory"
                name="category"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, category: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputSector" className="form-label fw-bold">
                Setor:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputSector"
                name="sector"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, sector: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputRole1" className="form-label fw-bold">
                Função 1:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputRole1"
                name="role_1"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, role_1: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputShift" className="form-label fw-bold">
                Turno:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputShift"
                name="shift"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, shift: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputSchedule" className="form-label fw-bold">
                Escala:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputSchedule"
                name="schedule"
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, schedule: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="inputManager1" className="form-label fw-bold">
                  Gestor 1 :
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputManager1"
                  name="manager_1"
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, manager_1: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="inputManager2" className="form-label fw-bold">
                  Gestor 2:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputManager2"
                  name="manager_2"
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, manager_2: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-4 justify-content">
              <div className="mb-3">
                <label htmlFor="inputManager3" className="form-label fw-bold">
                  Gestor 3:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputManager3"
                  name="manager_3"
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, manager_3: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="inputStatus" className="form-label fw-bold">
                  Status :
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputStatus"
                  name="status"
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, status: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="inputRole2" className="form-label fw-bold">
                  Função 2:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputRole2"
                  name="role_2"
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, role_2: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="inputUser" className="form-label fw-bold">
                  Usuário/Login:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputUser"
                  name="user_"
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, user_: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
      </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
