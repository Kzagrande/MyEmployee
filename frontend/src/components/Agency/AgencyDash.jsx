import React, { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const AgencyDash = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .get("http://localhost:3001/agency/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div
          className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 "
          style={{ backgroundColor: "#1d4289" }}
        >
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a
              href="/"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Admin Dashboard
              </span>
            </a>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start "
              id="menu"
            >
              <li>
                <Link
                  to="/agency_dashboard/add_agency_employee"
                  data-bs-toggle="collapse"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-person-fill "></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Novos colaboradores
                  </span>{" "}
                </Link>
              </li>
              <li>
                <Link
                  to="/agency_dashboard/terminated_agency_employee"
                  data-bs-toggle="collapse"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-person-x"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Desligamento</span>{" "}
                </Link>
              </li>
              <li>
                <Link
                  to="/agency_dashboard/agency_new_employee"
                  data-bs-toggle="collapse"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-person-fill "></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Adicionar Colaborador
                  </span>{" "}
                </Link>
              </li>
              <li>
                <Link
                  to="/agency_dashboard/agency_list_employee"
                  data-bs-toggle="collapse"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-table"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Listar Colaboradores
                  </span>{" "}
                </Link>
              </li>

              <li onClick={handleLogout}>
                <a href="#" className="nav-link px-0 align-middle text-white">
                  <i className="bi bi-box-arrow-left"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Sair</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div
            className="p-2 d-flex justify-content-center shadow text-white"
            style={{ backgroundColor: "#1d4289" }}
          >
            <h4>Agency Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AgencyDash;
