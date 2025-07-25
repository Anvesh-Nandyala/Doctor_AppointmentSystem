import validator from 'validator';
import bycrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';



//Api for adding doctor

const addDoctor = async(req,res)=>{

    try{

        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body;
        const imageFile = req.file;

        //console.log({name, email, password, speciality, degree, experience, about, fees, address}, imageFile);

        //check if all required fields are present
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.status(400).json({successs:false,message: "Please fill all the fields"});
        }

        //validate email format
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message: "Invalid email format"});
        }

        //validate password length
        if(password.length < 8){
            return res.status(400).json({success:false, message: "Password must be at least 8 characters long"});
        }

        //hashing the password
        const salt=await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);


        //uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});

        const imageUrl = imageUpload.secure_url;


        //create doctor object
        const doctorData={
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address), //parse address to object
            image: imageUrl,
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        res.status(201).json({success:true, message: "Doctor added successfully", doctor:newDoctor});

    }catch(error){
        console.error("Error adding doctor:", error);
        res.status(500).json({success:false, message: "Internal server error"});
    }
}


//API for admin login

const loginAdmin = async(req, res) => {
    try{

        const {email, password} = req.body;

        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            // Generate JWT token
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.status(200).json({success:true, message: "Login successful", token});
        }else{
            res.status(401).json({success:false, message: "Invalid email or password"});
        }
    }catch(error){
        console.error("Error logging in admin:", error);
        res.status(500).json({success:false, message: "Internal server error"});
    }
}

//API to get all doctors (optional, not in original request but useful for admin)
const allDoctors = async(req, res) => {
    try{

        const doctors=await doctorModel.find({}).select("-password"); // Exclude password from the response);
        res.status(200).json({success:true, doctors});

    }catch(error){
        console.error(error);
        res.status(500).json({success:false, message: "Internal server error"});

    }
}

//API to get all apointments
 const appointmentsAdmin =async (req,res) =>{

    try {

        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})
        
    } catch (error) {

        console.error(error);
        res.status(500).json({success:false, message: "Internal server error"});
        
    }

 }

 //API for appointment cancellation

 const appointmentCancel = async (req, res) => {
    try {

        const {appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // Verify that appointmentData exists
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //updating doctor slot

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })



        res.json({ success: true, message: 'Appointment cancelled successfully' })




    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get Dashboard data for admin panel

const adminDashboard = async (req, res) =>{

    try {

        const doctors = await doctorModel.find({})
        const patients = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData= {
            doctors: doctors.length,
            patients: patients.length,
            appointments: appointments.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData})
        
    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard};