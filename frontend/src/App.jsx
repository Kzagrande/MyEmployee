import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ListEmployee from "./components/EmployeeList/ListEmployee";
import RestrictEmployee from "./components/RestrictEmployee";
import Settings from "./components/Settings";
import EmployeeForm from "./components/AddEmployee/EmployeeForm";
import Start from "./components/Start";
import PlanningLogin from "./components/PlanningLogin";
import PlanningDash from "./components/PlanningDash";
import AgencyDash from "./components/Agency/AgencyDash";
import AgencyLogin from "./components/Agency/AgencyLogin";
import AddAgencyEmployee from "./components/Agency/AddAgencyEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/" element={<Login />}></Route>

        <Route path="/adminlogin" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="addemployee" element={<EmployeeForm />}></Route>
          <Route path="listemployee" element={<ListEmployee />}></Route>
          <Route path="restrictlist" element={<RestrictEmployee />}></Route>
          <Route path="settings" element={<Settings />}></Route>
        </Route>

        <Route path="/planning_login" element={<PlanningLogin />}></Route>
        <Route path="/planning_dashboard" element={<PlanningDash />}></Route>

        <Route path="/agency_login" element={<AgencyLogin />}></Route>
        <Route path="/agency_dashboard" element={<AgencyDash />}>
          <Route path="add_agency_employee" element={<AddAgencyEmployee />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
