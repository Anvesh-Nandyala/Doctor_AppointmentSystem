import validator from 'validator'

import bycrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary' 
dotenv.config();

// API to register

const registerUser=async(req,res)=>{
    try{

        const {name,email,password}=req.body

        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email"})
        }

        if(password.length < 8){
            return res.json({success:false,message:"enter strong password"})
        }

        //hashing password
        const salt= await bycrypt.genSalt(10)
        const hashedPassword=await bycrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)

        const user=await newUser.save()


        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})





    }catch(error){

        console.log(error);
        res.status(500).json({success:false, message: error.message});

    }
}


//API for user login

const loginUser = async(req,res)=>{
    try{

        const {email,password}=req.body
        const user=await userModel.findOne({email})

        if(!user){
            return res.status(500).json({success:false, message: 'User does not exist'});
        }

        const isMatch = await bycrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }

    }catch(error){
        console.log(error);
        res.status(500).json({success:false, message: error.message});
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

const updateProfile = async (req,res)=>{
    try{

        const {userId, name, phone, address, dob, gender} = req.body
        const imageFile=req.imageFile
        if(!name || !phone || !dob || !gender){
            return res.json({success:false, message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile){

            //upload image to cloud
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})

            const imageURL = imageUpload.secure_url


            await userModel.findByIdAndUpdate(userId,{image:imageURL})

        }

        res.json({success:true,message:"Profile Updated"})

    }catch{
        console.error("Error in getProfile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export {registerUser, loginUser, getProfile, updateProfile}