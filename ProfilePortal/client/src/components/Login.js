import React, { useContext, useState } from 'react'
import login from '../images/animation_lm7r6npr_small.gif'
import { Link, useNavigate } from 'react-router-dom';
import img from '../images/Contact-us.gif'
import axios from 'axios'
import { UserContext } from '../App';
import Navbar from './Navbar';
const Login = () => {


  const {state,dispatch}=useContext(UserContext)
  //console.log("state",state)
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const navigate=useNavigate();

  //console.log('LOGIN State',state)


  const loginUser=async(e)=>{
      e.preventDefault();

     try{

      const response= await axios.post('http://localhost:4000/signin',{
        email,password
      },{
        withCredentials:true
      });

      if(response.status===200){
         dispatch({
          type:'USER',
          payload:true
        })
       
        window.alert('SIgned in Successfully')
        navigate('/')
        console.log('LOGIN',state);
      }
      

     }
     catch(err){
      if(err.response && (err.response.status===400)){
        window.alert('Inavlid Credentails')
      }
      else{
        console.log('AN ERROR OCCURED: ',err)
        
      }
     }

  }

  return (
   <>
    
    <section className="vh-100" style={{backgroundColor:"#eee"}}>
  <div className="container-fluid h-custom">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src={img}
          className="img-fluid" alt="Sample image" />
      </div>
      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form method='POST'>
         
          <div className="form-outline mb-4">
            <input type="email" id="email" name='email'
            value={email} onChange={(e)=>setEmail(e.target.value)}
            autoComplete='off'
             className="form-control form-control-lg"
              placeholder="Enter a valid email address" />
          </div>

         
          <div className="form-outline mb-3">
            <input type="password" id="password" name='password'
            value={password} onChange={(e)=>setPassword(e.target.value)}
             className="form-control form-control-lg"
              placeholder="Enter password" autoComplete='off' />
          </div>

          <div className="d-flex justify-content-between align-items-center">
           
            <div className="form-check mb-0">
              <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
              <label className="form-check-label" htmlFor="form2Example3">
                Remember me
              </label>
            </div>
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            <button type="submit" className="btn btn-primary btn-lg custom-padding" name='signin' id='signin'
             onClick={loginUser}>Login</button>
            <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <Link to="/signup"
                className="link-danger">Register</Link></p>
          </div>

        </form>
      </div>
    </div>
  </div>
  <div
    className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
 
    <div className="text-white mb-md-0">
      Copyright © 2020. All rights reserved.
    </div>
    
  </div>
</section>
   </>
  )
}

export default Login
