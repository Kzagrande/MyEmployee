import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const router = express.Router()

router.post("/planning_login", (req, res) => {
    const sql =
      "SELECT * from employees.users_sys Where id_employee = ? and password_ = ? and status = 1";
    con.query(sql, [req.body.id_employee, req.body.password], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const id_employee = result[0].id_employee;
        const token = jwt.sign(
          { role: "planning", id_employee: id_employee, id: result[0].id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
      } else {
        return res.json({
          loginStatus: false,
          Error: "wrong id_employee or password",
        });
      }
    });
  });

  router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({Status:true})
})


  export {router as PlanningRouter}

 

