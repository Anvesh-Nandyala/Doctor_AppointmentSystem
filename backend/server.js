import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import geminiRouter from './routes/geminiRoute.js'; 
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv';
dotenv.config();


//app config

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

//middleware 
app.use(cors()); //connects frontend and backend
app.use(express.json()); 

//api routes

app.use('/api/admin', adminRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/', (req, res) => {
  res.send('Api is Running');
});


app.listen(port,()=>(
    console.log(`Server is Running on port ${port}`)
))
