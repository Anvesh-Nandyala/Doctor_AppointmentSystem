import express from "express";
import { addDoctor,loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin  from "../middlewares/authAdmin.js";
import { allDoctors } from "../controllers/adminController.js"; // Importing the allDoctors function
import { changeAvailability } from "../controllers/doctorController.js"; // Importing the changeAvailability function



const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors', authAdmin, allDoctors); // Optional route to get all doctors
adminRouter.post('/change-availability',authAdmin, changeAvailability); // Importing and using the changeAvailability function
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)




export default adminRouter;