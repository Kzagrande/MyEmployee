import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
useEffect

const Start = () => {
  const navigate = useNavigate()
axios.defaults.withCredentials = true;
useEffect(() => {
  axios.get('http://localhost:3001/verify')
  .then(result => {
    if(result.data.Status) {
      console.log('result',result.data)
      if(result.data.role === "admin") {
        navigate('/dashboard')
      } if (result.data.role === "planning") {
        navigate('/planning_dashboard')
      } else {
        navigate('/agency_dashboard')
      } {
    
      }
    }
  }).catch(err =>console.log(err))
}, [])


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded border loginForm text-center">
        <h2 className="text-center mb-5">Login As</h2>
        <div className="d-flex justify-content-between ">
          <button className="btn btn-primary btn-lg mx-4" onClick={()=> {navigate('/planning_login')}}>Planejamento</button>
          <button className="btn btn-success btn-lg px-5 mx-4"onClick={()=> {navigate('/adminlogin')}}>RH</button>
          <button className="btn btn- btn-lg mx-4 text-white bg-warning"onClick={()=> {navigate('/agency_login')}}>Agência</button>
        </div>
      </div>
    </div>
  );
}

export default Start;
