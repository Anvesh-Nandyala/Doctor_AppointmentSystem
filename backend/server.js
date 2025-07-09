import express from 'express';
import cors from 'cors';
import 'dotenv/config';

//app config

const app = express();
const port = process.env.PORT || 4000;

//middleware 
app.use(cors()); //connects frontend and backend
app.use(express.json()); 

//api routes
app.get('/', (req, res) => {
  res.send('Api is running');
});


app.listen(port,()=>(
    console.log(`Server is running on port ${port}`)
))
