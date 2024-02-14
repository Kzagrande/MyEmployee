import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HrLogin from "./components/CevaHR/HrLogin";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Settings from "./components/Settings";
import Start from "./components/Start";
import PlanningLogin from "./components/Planning/PlanningLogin";
import PlanningDash from "./components/Planning/PlanningDash";
import AgencyDash from "./components/Agency/AgencyDash";
import AgencyLogin from "./components/Agency/AgencyLogin";
import AgencyInputEmployee from "./components/Agency/AgencyInputEmployee";
import TerminatedAgencyEmployee from "./components/Agency/TerminatedAgencyEmployee";
import AgencyNewEmployee from "./components/Agency/AgencyNewEmployee";
import AgencyListEmployee from "./components/Agency/AgencyListEmployee";
import HrCrud from "./components/CevaHR/HrCrud";
import HrDash from "./components/CevaHR/HrDashboard";
import HrEmployeeTable from "./components/CevaHR/HrEmployeeTable";
import PlanningCrud from "./components/Planning/PlanningCrud";
import PlanningTable from "./components/Planning/PlanningTable";
import PlanningForm from "./components/Planning/PlanningForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/" element={<HrLogin />}></Route>

        <Route path="/adminlogin" element={<HrLogin />}></Route>
        <Route path="/hr_dashboard" element={<HrDash />}>
          <Route path="hr_crud" element={<HrCrud />}></Route>
          <Route path="hr_employee_table" element={<HrEmployeeTable />}></Route>
          <Route path="settings" element={<Settings />}></Route>
        </Route>

        <Route path="/planning_login" element={<PlanningLogin />}></Route>
        <Route path="/planning_dashboard" element={<PlanningDash />}>
          <Route path="planning_crud" element={<PlanningCrud />}></Route>
          <Route path="planning_table" element={<PlanningTable />}></Route>
          <Route path="planning_form" element={<PlanningForm />}></Route>
        </Route>

        <Route path="/agency_login" element={<AgencyLogin />}></Route>
        <Route path="/agency_dashboard" element={<AgencyDash />}>
          <Route path="add_agency_employee" element={<AgencyInputEmployee/>}></Route>
          <Route path="terminated_agency_employee" element={<TerminatedAgencyEmployee/>}></Route>
          <Route path="agency_new_employee" element={<AgencyNewEmployee/>}></Route>
          <Route path="agency_list_employee" element={<AgencyListEmployee/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
