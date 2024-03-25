// middleware/verifyUser.js
import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  // console.log('token',token)

  if (token) {
    // console.log('tem token')
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(401).json({ Status: false, Error: "Invalid Token" });
      }

      // console.log('---> decoded', decoded);
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    // console.log('n tem token')
    return res.status(401).json({ Status: false, Error: "Authentication required" });
  }
};

export default verifyUser;
