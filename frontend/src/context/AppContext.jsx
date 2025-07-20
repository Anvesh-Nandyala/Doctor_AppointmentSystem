import { createContext,useState,useEffect, use } from "react";
import axios from "axios";
export const AppContext=createContext();
import { toast } from "react-toastify";

const AppContextProvider =(props)=>{

    const currencySymbol='$'
    const backendUrl=import.meta.env.VITE_BACKEND_URL


    const [doctors, setDoctors] = useState([]);
    const [token,setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token'):false )

    const [userData, setUserData] = useState(false)


    const getDoctorsData=async()=>{
        try{

            const {data} =await axios.get(backendUrl+'/api/doctor/list');

            if(data.success){
                setDoctors(data.doctors);
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }

    const loadUserProfiledata = async () =>{
        try{

            const {data}= await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})

            if(data.success){
                setUserData(data.user)
            }else{

                toast.error(data.message)
            }

        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }

    const value={
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfiledata
    }


    useEffect(()=>{
        getDoctorsData();
    },[])

    useEffect(()=>{
        if(token){
            loadUserProfiledata();
        }else{
            setUserData(false)
        }
    },[token])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )


}

export default AppContextProvider
