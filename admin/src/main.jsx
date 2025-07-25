import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'
import AdminContextProvider from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <DoctorContextProvider>
        <AppContextProvider>
          <AdminContextProvider>
             <App />
          </AdminContextProvider>
        </AppContextProvider>
      </DoctorContextProvider>
    </BrowserRouter>
)
