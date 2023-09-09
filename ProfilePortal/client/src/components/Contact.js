import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const Contact = () => {
  const[userData,setUserData]=useState({
    name:"",email:"",phone:"",message:""
  })
  const navigate=useNavigate();


  const contactForm=async(e)=>{
    e.preventDefault()

    const{name,email,phone,message}=userData;

    const response=await axios.post('http://localhost:4000/message',{
      name,email,phone,message
    },{
      withCredentials:true
    })

    if(!response.data){
      console.log('Message not send')
    }
    else{
      alert('Message sent')
      console.log('Message sent successfully',response.data)
      setUserData({
        ...userData,
        message:""
      })
    }

  }

  const handleInputs=(e)=>{
    const {name,value}=e.target

    setUserData({
      ...userData,
      [name]:value
    })

  }

  const callContactPage=async()=>{
      try{

        const response=await axios.get('http://localhost:4000/contact',{
          withCredentials:true
        })
        

        if(!response.status==200){
          const error=new Error(response.error);
          navigate('/login')
          throw error
      }
      setUserData( {...userData,
        name:userData.name,
        email:userData.email,
        phone:userData.phone});

      }
      catch(err){
        console.log(err);
        navigate('/login')
      }
  }

  useEffect(()=>{
   callContactPage()
  },[])
  return (
   <>
    <div className='contact_info'>
      <div className='container_fluid'>
        <div className='row'>
          <div className='col-lg-10 offset-lg-1 _row'>

            <div className='contact_info_item '>
            <FontAwesomeIcon icon={faPhone} />
            <div className='contact_info_content'>
              <div className='contact_info_title'>
                Phone
              </div>
              <div className='contact_info_text'>
                {userData.phone}
              </div>
            </div>

            </div>


            <div className='contact_info_item '>
            <FontAwesomeIcon icon={faEnvelope} />
            <div className='contact_info_content'>
              <div className='contact_info_title'>
                Email
              </div>
              <div className='contact_info_text'>
                {userData.email}
              </div>
            </div>

            </div>

            <div className='contact_info_item '>
            <FontAwesomeIcon icon={faMapMarker} />
            <div className='contact_info_content'>
              <div className='contact_info_title'>
                Address
              </div>
              <div className='contact_info_text'>
                Rawalpindi, Pakistan
              </div>
            </div>

            </div>

            


          </div>
        </div>
      </div>
    </div>


    <div className='contact_form '>
      <div className='_container'>
           <div className='row'>
            <div className='col-lg-10 offset-lg-1'>
              <div className='contact_form_container py-5'>
                <h2 className='contact_form_title'>
                  Get in Touch
                </h2>
                <form id='contact_form'>
                  <div className='contact_form_name d-flex justify-content-between align-items-between'>
                    <input type='text' id='contact_form_name' 
                    className='contact_form_name input_field'
                     onChange={handleInputs}
                    name='name'
                     placeholder='Your Name' required value={userData.name}>
                     
                    </input>

                    <input type='email' id='contact_form_email' 
                    className='contact_form_email input_field'
                     onChange={handleInputs}
                    name='email'
                     placeholder='Your Email' required
                     value={userData.email}></input>


                    <input type='number' id='contact_form_number' 
                    className='contact_form_number input_field'
                     onChange={handleInputs}
                    name='phone'
                     placeholder='Your Phone Number' required
                     value={userData.phone}></input>

                
                  </div>

                  <div className='contact_form_text d-flex justify-content-start pt-4'>
                    <textarea className='text_field contact_form_message' 
                    value={userData.message}
                    onChange={handleInputs}
                   name='message'
                    placeholder='Message' cols='30' rows='10'></textarea>
                  </div>

                  <div className='contact_form_button'>
                    <button onClick={contactForm} type='submit' className='btn btn-primary'>Send Message</button>
                  </div>


                </form>
              </div>
            </div>
           </div>
      </div>
    </div>
   </>
  )
}

export default Contact
