import React, { useState } from 'react';
import './style.css'; // Corrigindo o nome do arquivo de estilo
import axios from 'axios'

const Login = () => {
    const [values,SetValues] = useState ({
        id:'',
        password:''
    });

    const handleSubmit = (event)=>{
        event.preventDefault()
        axios.post('http://localhost:3001/auth/adminlogin')
        .then(result => console.log(result))
        .catch(err => console.log(err))
    }

    return (
        
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='id'><strong>ID:</strong></label>
                        <input type='text' name='id_employee' autoComplete='off' placeholder='Digite o Id'
                           onChange={(e)=> SetValues({...values,id: e.target.value})} className='form-control rounded-0' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password:</strong></label>
                        <input type='text' name='password' autoComplete='off' placeholder='Digite sua senha'
                           onChange={(e)=> SetValues({...values,password: e.target.value})} className='form-control rounded-0' />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mt-3'>Enviar</button>
                    <div className='mb-1'>
                        <p>
                            <a href='' className='text-white'>I forgot my password</a>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login;
