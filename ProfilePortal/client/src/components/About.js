import React, { useEffect, useState } from 'react'
import pic from '../images/person1.jpg'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const About = () => {

  const navigate=useNavigate();
  const [userData,setUserData]=useState({})


  const callAboutPage=async()=>{
    try{
         const response=await axios.get('http://localhost:4000/about',{
          withCredentials:true
         }) ;

         
         console.log('Data received: ',response.data);
         setUserData(response?.data)

         if(!response.status==200){
                 navigate('/login')
                 const error=new Error(response.error)
                 throw error
         }
    }
    catch(err){
       console.log(err)
       navigate('/login')
    }
  }

  useEffect(()=>{
    callAboutPage();
  },[])

  return (
   <>
         
         <div className='container emp-profile'>
          <form method='GET'>
          <div className='row'>
                 <div className='col-md-4'>
                  <img src={pic} alt='mernhunter' className='person-img'></img>
                 </div>

                 <div className='col-md-6 p1'>
                  <div className='profile-head'>
                    <h5>
                      {userData.name}
                    </h5>
                    <h6>{userData.work}</h6>
                    <p className='profile-rating mt-3 mb-5'>
                      RATING: <span>1/10</span>
                    </p>

                    <ul className='nav nav-tabs' role='tablist'>
                      <li className='nav-item item1'>
                        <a className='nav-link active' id='home-tab' data-toggle='tab' href='#home' role='tab'> 
                          About
                        </a>
                      </li>

                      <li className='nav-item item2' >
                      <a className='nav-link' id='profile-tab' data-toggle='tab' href='#profile' role='tab'> 
                          Timeline
                        </a>
                      </li>
                </ul>


                  </div>
                 </div>



                 <div className='col-md-2'>
                  <input type='button' className='prodile-edit-btn' name='profile-edit' value='Edit Profile'/>
                 </div>



          </div>

          <div className='row'>
            <div className='col-md-4'>
              <div className='profile-work'>
                <p>WORK LINK</p>
                <a href='https://www.youtube.com' target='_mern'>Youtube</a><br/>
                <a href='https://www.youtube.com' target='_mern'>Instagram</a><br/>
                <a href='https://www.youtube.com' target='_mern'>Figma</a><br/>
                <a href='https://www.youtube.com' target='_mern'>Web Developer</a><br/>
                <a href='https://www.youtube.com' target='_mern'>Software Engineer</a><br/>
              </div>
            </div>

            <div className='col-md-8  about-info'>
              <div className='tab-content profile-tab' id='myTabContent'>
                <div className='tab-pane fade show active ' id='home' role='tabpanel' aria-labelledby='home-tab'>
                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>User ID</label>
                    </div>

                    <div className='col-md-6 information'>
                      <p>{userData._id}</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>Name</label>
                    </div>

                    <div className='col-md-6 information'>
                      <p>{userData.name}</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>Email</label>
                    </div>

                    <div className='col-md-6 information'>
                      <p>{userData.email}</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>Phone</label>
                    </div>

                    <div className='col-md-6 information'>
                      <p>{userData.phone}</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>Profession</label>
                    </div>

                    <div className='col-md-6 information'>
                      <p>{userData.work}</p>
                    </div>
                  </div>


                </div>

                <div className='tab-pane fade' id='profile' role='tabpanel'
                aria-labelledby='profile-tab'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <label>Experience</label>
                    </div>
                    <div className='col-md-6 information'>
                      <p>Expert</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>Hourly Rate</label>
                    </div>
                    <div className='col-md-6 information'>
                      <p>10$/hr</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>Total Projects</label>
                    </div>
                    <div className='col-md-6 information'>
                      <p>230</p>
                    </div>
                  </div>

                  <div className='row mt-1'>
                    <div className='col-md-6'>
                      <label>English Level</label>
                    </div>
                    <div className='col-md-6 information'>
                      <p>Expert</p>
                    </div>
                  </div>


                  <div className='row'>
                    <div className='col-md-6'>
                      <label>Availability</label>
                    </div>
                    <div className='col-md-6 information'>
                      <p>6 months</p>
                    </div>
                  </div>


                </div>



              </div>
            </div>


          </div>



          </form>
         </div>
   </>
  )
}

export default About
