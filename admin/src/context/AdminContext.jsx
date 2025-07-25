import React, { useState, useEffect, createContext } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';




export const AdminContext = createContext();

const AdminContextProvider = (props) =>{

    const [aToken ,setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : null);
    
    const backendUrl = "https://daps-backend.onrender.com";

    const [doctors, setDoctors] = useState([]);

    const [appointments, setAppointments] = useState([])

    const [dashData, setDashData] = useState(false)

    const getAllDoctors = async () => {
        try{

            const {data} =await axios.post(backendUrl+'/api/admin/all-doctors', {},{headers:{aToken}})

            if(data.success){
                setDoctors(data.doctors);
                console.log(data.doctors);
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message)
        }
    }

    const changeDoctorAvailability = async (docId) => {
        try{

            const {data} = await axios.post(backendUrl+'/api/admin/change-availability', {docId}, {headers:{aToken}});

            if(data.success){
                toast.success(data.message);
                getAllDoctors(); // Refresh the list after changing availability
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }

    const getAllAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}})

            if(data.success){
                setAppointments(data.appointments);
                console.log(data.appointments);
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
            
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment', {appointmentId}, {headers:{aToken}})

            if(data.success){
                toast.success(data.message);
                getAllAppointments();
            }else{
                toast.error(data.message);
            }


            
        } catch (error) {

            toast.error(error.message)
            
        }
    }

    const getDashData = async () =>{
        try {

            const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})

            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData);
            }else{
                toast.error(data.message);
            }


            
        } catch (error) {
            toast.error(error.message);
            
        }
    }

    const value={
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeDoctorAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
