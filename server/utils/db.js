import mysql from 'mysql2'
import dotenv from "dotenv";


dotenv.config();
const con = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: process.env.DB_PSW,
    database:'employees'
})

con.connect(function(err){
    if(err){
        console.log("connection error",err)
    }else{
        console.log("Connected") 
    }
})


export default con;