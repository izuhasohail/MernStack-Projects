import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './Navbar';
import { UserContext } from '../App';
const Home = () => {

  const [userData,setUserData]=useState({name:""});
  const [show,setShow]=useState(false);

  const {state,dispatch}=useContext(UserContext);
  


  const getUserData=async()=>{
    try{
      console.log("State in home",state)
       const response=await axios.get('http://localhost:4000/home',{
        withCredentials:true
       });

       if(!response.status===200){
        const error=new Error(response.error);
        throw error
       }

       setUserData({
        ...userData,
        name:response.data.name
       })
       setShow(true)

    }
    catch(err){
 
      console.log(err)
    }
  }

  useEffect(()=>{
    getUserData()
  },[])


  return (
    <>
    
      <div className='home-page' style={{ background: 'linear-gradient(to right, #66A2AA, #EDF0D0)' }}>
        <div className='home-div d-block mb-5 justify-content-center pb-5'>
          <p className='pt-5'>WELCOME</p>
          <h3 className='user_name'>{userData.name}</h3>
          <h1>{show?'Happy to see you back':'We Are The MERN HUNTER'}</h1>
        </div>
      </div>
    </>
  )
}

export default Home
