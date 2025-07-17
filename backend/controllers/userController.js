import validator from 'validator'

import bycrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'


dotenv.config();

// API to register

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "enter strong password" })
        }

        //hashing password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)

        const user = await newUser.save()


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })





    } catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: error.message });

    }
}


//API for user login

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(500).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bycrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//API to get user data

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        console.log("User ID from body:", userId); // Add this for debug

        // Now safely use userId
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//API to update User profile

const updateProfile = async (req, res) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            //upload image to cloud
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

            const imageURL = imageUpload.secure_url


            await userModel.findByIdAndUpdate(userId, { image: imageURL })

        }

        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log("Error in getProfile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// API to book appointment

const bookAppointment = async (req, res) => {
    try {

        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData.availability) {
            return res.json({ success: false, message: 'Doctor is not available at the moment' })
        }

        let slots_booked = docData.slots_booked || {};

        //checking slots avail

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot already booked' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        }
        else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password");

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()

        }

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        //save new slots data in docdata

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment booked successfully' })


    } catch (error) {
        console.log("Error in booking Appointment:", error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


//API to get user appointments for frontend

const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body

        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })



    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to cancel the appointment

const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // Verify that appointmentData exists
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'You are not authorized to cancel this appointment' })

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

//API for payment

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


const paymentRazorpay = async (req, res) => {

    try {


        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment not found' })

        }

        // creating options for payment

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        //creation of an order

        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })




    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }




}

//API to verify payment

const verifyPayment = async (req, res) =>{
    try {

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        console.log(orderInfo)

        if(orderInfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
            res.json({success:true, message:"Payment Successful"})
        }else{
            res.json({success:false, message:"Payment Failed"})
        }

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyPayment }