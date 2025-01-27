const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth = require('../services/authentication');
router.post('/addnewAppuser',auth.autheticateToken, (req, res) => {
    let user = req.body;
    var selectQuery = "SELECT email, password, status FROM appuser WHERE email=?";
    connection.query(selectQuery, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                var insertQuery = "INSERT INTO appuser (name, email, password, status, isDeletable) VALUES (?, ?, ?, 'false', 'true')";
                connection.query(insertQuery, [user.name, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully registered" });
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: "Email already exists" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/login',(req,res)=>{
    const user = req.body;
    selectQuery = "SELECT email, password, status , isDeletable FROM appuser WHERE email=?";
    connection.query(selectQuery,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0 || results[0].password != user.password){
                return res.status(401).json({message:"Incorect email or Password"});

            }
            else if(results[0].status === 'false'){
                return res.status(401).json({message:"Wait for admin approval"});
            }
            else if(results[0].password == user.password){
                const response = {email:results[0].email,isDeletable:results[0].isDeletable};
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'});
                res.status(200).json({token: accessToken});

            }
            else{
                return res.status(400).json({message:"Something went Wrong.Please Try again later"});

            }

        }
        else{
            return res.status(500).json(err);

        }

    });


});
router.get('/getAllAppuser',auth.autheticateToken,(req,res)=>{
    const tokenPayload = res.locals;
    var selectQuery;
    if(tokenPayload.isDeletable === 'false'){
        selectQuery= "select id,name,email,status from appuser where isDeletable='true'";
        
    }
    else{
        selectQuery = "select id,name,email,status from appuser where isDeletable='true' and email !=?"
    }
    connection.query(selectQuery,[tokenPayload.email],(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);

        }

    });


});

router.post('/updateUserStatus',auth.autheticateToken,(req,res)=>{
    let user = req.body;
    var selectQuery = "update appuser set status=? where id=? and isDeletable='true'";
    connection.query(selectQuery,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"User ID does not Exist"});
            }
            return res.status(200).json({message:"User Updates Sucessfully"});
        }
        else{
            return res.status(500).json(err);

        }
    });

});
router.post('/updateUser',auth.autheticateToken,(req,res)=>{
    let user = req.body;
    var selectQuery = "update appuser set name=?,email=? where id=?";
    connection.query(selectQuery,[user.name,user.email,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"User ID does not Exist"});
            }
            return res.status(200).json({message:"User Updates Sucessfully"});
        }
        else{
            return res.status(500).json(err);

        }
    });
    
});

router.get('/checkToken',auth.autheticateToken,(req,res)=>{
    return res.status(200).json({message:"true"});
});



module.exports = router;
