import { useState } from 'react'
import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Myprofile from './pages/Myprofile'
import MyAppointments from './pages/MyAppointments'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Navbar from './components/Navbar'
import Store from './pages/Store'
import GeminiChat from './components/GeminiChat'
import Footer from './components/Footer'
import Appointments from './pages/Appointments'

function App() {

  const [showChat, setShowChat] = useState(false)
  
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
        <Route path='/my-appointments' element={<MyAppointments/>} />
        <Route path='/appointment/:docId' element={<Appointments/>} />
        <Route path='/store' element={<Store/>}/>
      </Routes>
      <Footer/>
      {showChat && <GeminiChat />}
      <button onClick={() => setShowChat(prev => !prev)} className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50">
        {showChat ? 'Close Chat' : 'Chat'}
      </button>
    </div>
  )
}

export default App
