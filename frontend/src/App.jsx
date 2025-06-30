import { useState } from 'react'
import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Myprofile from './pages/Myprofile'
import Myappointments from './pages/Myappointments'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Appointment from './pages/appointments'
import Navbar from './components/Navbar'


function App() {
  
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/doctors' element={<Doctors/>} />
        <Route path='/doctors/:speciality' element={<Doctors/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/my-profile' element={<Myprofile/>} />
        <Route path='/my-appointments' element={<Myappointments/>} />
        <Route path='/appointments/:docId' element={<Appointment/>} />
      </Routes>
    </div>
  )
}

export default App
