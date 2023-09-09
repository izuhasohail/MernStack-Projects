import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../images/logo.png'
import _logo from '../images/animation_lm86zfmz_small.gif'
import { UserContext } from '../App'

const Navbar = () => {
  const{state,dispatch}=useContext(UserContext);
   
  
  return (
    <>
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <NavLink className="navbar-brand" to="/">
    <img src={_logo} alt='logo' className='col-5 bg-light navlogo
    '/>
  </NavLink>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav  ms-auto">
      <li className="nav-item active _options_margin">
        <NavLink className="nav-link " to="/">Home</NavLink>
      </li>
      <li className="nav-item _options_margin">
        <NavLink className="nav-link " to="/about">AboutMe</NavLink>
      </li>
      <li className="nav-item _options_margin">
        <NavLink className="nav-link" to="/contact">Contact</NavLink>
      </li>
      { !state &&(
        <>
        <li className="nav-item _options_margin">
        <NavLink className="nav-link" to="/login">Login</NavLink>
      </li>
      <li className="nav-item _options_margin">
        <NavLink className="nav-link" to="/signup">Signup</NavLink>
      </li>
      </>)}

      {
        state && (<li className="nav-item _options_margin">
        <NavLink className="nav-link" to="/logout">Logout</NavLink>
      </li>)}
    </ul>
  </div>
</nav>
    </>
  )
}

export default Navbar
