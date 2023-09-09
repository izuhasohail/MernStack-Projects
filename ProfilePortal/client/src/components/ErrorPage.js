import React from 'react'
import { NavLink } from 'react-router-dom'
const ErrorPage = () => {
  return (
    <div className='not-found'>
    <div className='not-fount '>
        <div className='notfound_404'>
            <h1>404</h1>
        </div>
        <h2 className='_errormessage'>we are sorry, page not found</h2>
        <NavLink to='/'><button className='btn btn-primary _button'>Back to Homepage</button></NavLink>
    </div>
      
    </div>
  )
}

export default ErrorPage
