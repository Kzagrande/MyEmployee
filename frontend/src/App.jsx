import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ListEmployee from './components/EmployeeList/ListEmployee'
import RestrictEmployee from './components/RestrictEmployee'
import Settings from './components/Settings'
import EmployeeForm from './components/AddEmployee/EmployeeForm'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/adminlogin' element={<Login/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}>
      <Route path='/dashboard/addemployee' element={<EmployeeForm/>}></Route>
      <Route path='/dashboard/listemployee' element={<ListEmployee/>}></Route>
      <Route path='/dashboard/restrictlist' element={<RestrictEmployee/>}></Route>
      <Route path='/dashboard/settings' element={<Settings/>}></Route>
      </Route>
      
    </Routes>
    </BrowserRouter>

  )
}

export default App
