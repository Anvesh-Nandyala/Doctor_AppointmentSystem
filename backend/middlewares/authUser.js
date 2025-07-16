import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    if (typeof req.body !== 'object' || req.body === null) {
      req.body = {};
    }


    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default authUser;
