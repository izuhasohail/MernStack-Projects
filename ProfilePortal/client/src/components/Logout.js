import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import Navbar from './Navbar'
const Logout = () => {
    const navigate=useNavigate();

    const {state,dispatch}=useContext(UserContext);

    const logoutftn=async()=>{
      try{

      const response=await axios.get('http://localhost:4000/logout',{
        withCredentials:true
      });

      if(response.status===200){
        dispatch({
         type:'USER',
         payload:false
       })
      
       
       navigate('/login')
       console.log('LOGOUT',state);
     }
        // await axios.get('http://localhost:4000/logout',{
        //     withCredentials:true
        // })
        // .then((res)=>{
        //      dispatch({
        //       type: 'USER',
        //       payload:false
        //      })
            
        //      navigate('/login')
        //      if(!res.status===200){
        //         const error = new Error(res.error)
        //         throw error
        //      }
        //      console.log('Logout',state)
        // })
        // .catch((error)=>{
        //     console.log(error)
        // })
    }
    catch(error){
      console.log(error)
    }
    }
    useEffect(()=>{
        logoutftn();
    },[state])
  return (
    <div>
      
    </div>
  )
}

export default Logout
