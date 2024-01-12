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
      } else {
        navigate('/planning_dashboard')
      }
    }
  }).catch(err =>console.log(err))
}, [])


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm text-center">
        <h2 className="text-center">Login As</h2>
        <div className="d-flex justify-content-between mt-5">
          <button className="btn btn-primary btn-lg" onClick={()=> {navigate('/planning_login')}}>Planejamento</button>
          <button className="btn btn-success btn-lg px-5"onClick={()=> {navigate('/adminlogin')}}>RH</button>
        </div>
      </div>
    </div>
  );
}

export default Start;
