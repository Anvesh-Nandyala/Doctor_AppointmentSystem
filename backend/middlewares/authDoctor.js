import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.docId = token_decode.id;
    if (typeof req.body !== 'object' || req.body === null) {
      req.body = {};
    }


    req.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default authDoctor;
