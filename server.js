const express=require('express');
const cors=require('cors');
const app=express();
const mysql=require('mysql2');


app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'ttgtsyx9dm',
    database:'demo'
})

db.connect((err)=>{
    if(err){
        console.log("error connecting to database");
        return;
    }
    console.log("connected with database")
})

app.get('/',(req,res)=>{
    console.log("default");
    db.query('select * from demo',(err,result)=>{
        if(err){
            console.log("error ocuured ",err);
            return;
        }
        console.log("data successfully",result);
        res.send(result);
        
    })
})


app.post('/add-item',(req,res)=>{
    console.log(req.body);
    
    db.query(`insert into demo(itemDescription) values('${req.body.text}');`,(err,result)=>{
        if(err){
            console.log("error ocuured ",err);
            return;
        }
        console.log("created successfully");
    })
    res.send("added successfully");
})

app.listen(3000,()=>{
    console.log("server started on port 3000");
})