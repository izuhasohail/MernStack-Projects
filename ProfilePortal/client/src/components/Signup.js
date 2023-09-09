import React,{useState} from 'react'
import signup from '../images/liz-gross-signup.gif'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
const Signup = () => {

  const navigate=useNavigate();

  const [user,setUser]=useState({
    name:"",email:"",phone:"",work:"",password:"",cpassword:""
  })

  const handleInputs=(e)=>{
    const {name,value}=e.target;
    setUser({
      ...user,
      [name]:value//to fill dynamic data, we used square brackets 
    })
  }

  const postData=async(e)=>{
      e.preventDefault();
      await axios.post('http://localhost:4000/register',user)
      .then(res=>{
        if(res.status===201){
          window.alert('Registaion successful');
          console.log('Registration Successful')
          navigate('/login')
        }
      }
       )
      .catch(err=>{
        if(err.response.status===422){
          window.alert('Invalid Registration')
        }
      })
  }


  return (
    <>
     
    
  <div className='signup'>
  <section className="vh-50 mt-1" style={{backgroundColor:"#eee"}}>
  <div className="container vh-10 ">
    <div className="row d-flex justify-content-center align-items-center h-10" style={{backgroundColor:"#eee",
    boxShadow:"rgba(0,0,0,0)"}}>
      <div className="col-lg-12 col-xl-11">
        <div className="card text-black" style={{borderRadius:"25px"}}>
          <div className="card-body p-md-3">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                <p className="text-center h1 fw-bold mb-3 mx-1 mx-md-4 mt-2">Sign up</p>

                <form className="mx-1 mx-md-4" id='register-form' method='POST'>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="name" className="form-control"
                      value={user.name}
                      onChange={handleInputs}
                       name='name' autoComplete='off' placeholder='Your Name'/>
                      
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="email" id="email" className="form-control"
                      value={user.email} onChange={handleInputs}
                       name='email' autoComplete='off' placeholder='Your Email' />
                     
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="password" id="password" name='password' 
                      value={user.password} onChange={handleInputs}
                      className="form-control" autoComplete='off' placeholder='Your Password'/>
                      
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="password" id="cpassword"  
                      value={user.cpassword} onChange={handleInputs}
                      name='cpassword' className="form-control" autoComplete='off' placeholder='Confirm Password'/>
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="number" id="phone" name='phone'
                      value={user.phone} onChange={handleInputs}
                       className="form-control" autoComplete='off' placeholder='Your Phone No'/>
                      
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="work" name='work' className="form-control" 
                      value={user.work} onChange={handleInputs}
                      autoComplete='off' placeholder='Your Profession'/>
                      
                    </div>
                  </div>

                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="submit" className="form-submit btn btn-primary btn-lg"
                    onClick={postData} name='signup'>Register</button>
                  </div>

                </form>

              </div>
              <div className="col-md-4 col-lg-4 col-xl-4 d-flex flex-column align-items-center order-1 order-lg-2">

              <div className="mb-1 mt-5 ms-5 pt-5 td-none">
                      <img src={signup} className="img-fluid" alt="Sample image" />
                    </div>
                    <div>
                    <NavLink to='/login' className='navlink-text'>I am Already registered</NavLink>
                    </div>
              </div>
           


              
            </div>
          </div>
        </div>
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
</div>
</>
    
  )
}

export default Signup
