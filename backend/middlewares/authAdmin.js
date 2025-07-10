import jwt from 'jsonwebtoken';

//admin authentication middleware

const authAdmin = async(req,res,next)=>{
    try{

        const {atoken}=req.headers;
        if(!atoken){
            return res.status(401).json({success:false, message: "Not Authorized"});
        }
        //verify token
        const tokendecoded=jwt.verify(atoken, process.env.JWT_SECRET);

        if(tokendecoded!== (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)){
            return res.status(403).json({success:false, message: "Forbidden: Invalid token"});
        }

        next();

    }catch(error){
        console.error("Error in authAdmin middleware:", error);
        res.status(500).json({success:false, message: "Internal server error"});
    }
}

export default authAdmin;