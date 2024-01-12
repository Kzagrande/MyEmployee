import express from "express"
import cors from 'cors'
import { adminRouter } from "./routes/AdminRoute.js"
import { PlanningRouter } from "./routes/PlanningRoute.js"
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
    origin: ["http://localhost:5173"],
    methods:['GET','POST','PUT'],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth',adminRouter)
app.use('/planning',PlanningRouter)

const verifyUser = (req,res,next) =>{
    const token = req.cookies.token;
    if(token){
        Jwt.verify(token,"jwt_secret_key",(err,decoded)=>{
            if(err) return res.json({Status: false, Error: "Wrong Token"})
            console.log('---> decoded',decoded)
             req.id = decoded.id;
             req.role = decoded.role;
            next()
        })
    }else{
        return res.json({Status:false,Error:"Not authenticated"})
    }
}
app.use('/verify',verifyUser,(req,res)=>{
    return res.json({Status:true, role:req.role, id:req.id})
})

app.listen(3001 ,() =>{
    console.log("Server is running!")
}) 