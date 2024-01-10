import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import AddEmployee from './components/AddEmployee'
import ListEmployee from './components/ListEmployee'
import RestrictEmployee from './components/RestrictEmployee'
import Settings from './components/Settings'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/adminlogin' element={<Login/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}>
      <Route path='' element={<Home/>}></Route>
      <Route path='/dashboard/addemployee' element={<AddEmployee/>}></Route>
      <Route path='/dashboard/listemployee' element={<ListEmployee/>}></Route>
      <Route path='/dashboard/restrictlist' element={<RestrictEmployee/>}></Route>
      <Route path='/dashboard/settings' element={<Settings/>}></Route>

      </Route>
      
    </Routes>
    </BrowserRouter>

  )
}

export default App
