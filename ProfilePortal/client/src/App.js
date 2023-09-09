import React, { createContext, useContext, useReducer } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import About from './components/About'
import Contact from './components/Contact'
import 'bootstrap/dist/css/bootstrap.css'
import { Route,Routes } from 'react-router-dom';
import './App.css'
import ErrorPage from './components/ErrorPage'
import Logout from './components/Logout'
import { initialState } from './reducer/UseReducer'
import { reducer } from './reducer/UseReducer'
export const UserContext=createContext();

const App = () => {

  const [state,dispatch]=useReducer(reducer,initialState);

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <div className='app'>
    <Navbar/>
      <Routes>
      
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={ <Signup />} />
        
        <Route path='/logout' element={ <Logout />} />
        <Route path='*' element={<ErrorPage/>}/>
  

      </Routes>
    </div>
    </UserContext.Provider>
  )
}

export default App
