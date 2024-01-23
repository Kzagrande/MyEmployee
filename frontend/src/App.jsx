import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HrLogin from "./components/CevaHR/HrLogin";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/CevaHR/Dashboard";
import ListEmployee from "./components/CevaHR/ListEmployee";
import RestrictEmployee from "./components/RestrictEmployee";
import Settings from "./components/Settings";
import EmployeeForm from "./components/CevaHR/EmployeeForm";
import Start from "./components/Start";
import PlanningLogin from "./components/Planning/PlanningLogin";
import PlanningDash from "./components/Planning/PlanningDash";
import AgencyDash from "./components/Agency/AgencyDash";
import AgencyLogin from "./components/Agency/AgencyLogin";
import AgencyAddEmployee from "./components/Agency/AgencyInputEmployee";
import TerminatedAgencyEmployee from "./components/Agency/TerminatedAgencyEmployee";
import AgencyNewEmployee from "./components/Agency/AgencyNewEmployee";
import AgencyListEmployee from "./components/Agency/AgencyListEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/" element={<HrLogin />}></Route>

        <Route path="/adminlogin" element={<HrLogin />}></Route>
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
          <Route path="add_agency_employee" element={<AgencyAddEmployee/>}></Route>
          <Route path="terminated_agency_employee" element={<TerminatedAgencyEmployee/>}></Route>
          <Route path="agency_new_employee" element={<AgencyNewEmployee/>}></Route>
          <Route path="agency_list_employee" element={<AgencyListEmployee/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
