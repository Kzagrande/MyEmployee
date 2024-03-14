import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HrLogin from "./components/CevaHR/HrLogin";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Start from "./components/Start";
import PlanningLogin from "./components/Planning/PlanningLogin";
import PlanningDash from "./components/Planning/PlanningDash";
import AgencyDash from "./components/Agency/AgencyDash";
import AgencyLogin from "./components/Agency/AgencyLogin";
import AgencyInputEmployee from "./components/Agency/AgencyInputEmployee";
import AgencyListEmployee from "./components/Agency/AgencyListEmployee";
import HrCrud from "./components/CevaHR/HrCrud";
import HrDash from "./components/CevaHR/HrDashboard";
import HrEmployeeTable from "./components/CevaHR/HrEmployeeTable";
import PlanningTable from "./components/Planning/PlanningIntTable";
import PlanningForm from "./components/Planning/PlanningIntForm";
import PlanningDIsmissal from "./components/Planning/PlanningDIsmissal";
import AgencyDismissal from "./components/Agency/AgencyDismissal";
import PlanningManage from "./components/Planning/PlanningManage";
import PlanningIntegrations from "./components/Planning/PlanningIntegrations";
import PlanningIntTable from "./components/Planning/PlanningTable";
import PlanningIntForm from "./components/Planning/PlanningIntForm";


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
        </Route>

        <Route path="/planning_login" element={<PlanningLogin />}></Route>
        <Route path="/planning_dashboard" element={<PlanningDash />}>
          <Route path="planning_manage" element={< PlanningManage/>}></Route>
          <Route path="planning_table" element={<PlanningTable />}></Route>
          <Route path="planning_form" element={<PlanningForm />}></Route>
          <Route path="planning_integration" element={<PlanningIntegrations />}></Route>
          <Route path="planning_int_table" element={<PlanningIntTable />}></Route>
          <Route path="planning_int_form" element={<PlanningIntForm />}></Route>
          <Route path="planning_dismissal" element={<PlanningDIsmissal/>}></Route>
        </Route>

        <Route path="/agency_login" element={<AgencyLogin />}></Route>
        <Route path="/agency_dashboard" element={<AgencyDash />}>
          <Route path="add_agency_employee" element={<AgencyInputEmployee/>}></Route>
          <Route path="agency_list_employee" element={<AgencyListEmployee/>}></Route>
          <Route path="agency_dismissal_list" element={<AgencyDismissal/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
