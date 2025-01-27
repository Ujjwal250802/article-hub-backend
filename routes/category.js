const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.post("/addNewCategory",auth.autheticateToken,(req,res,next)=>{
    let category = req.body;
    selectQuery = "insert into category (name) values(?)";
    connection.query(selectQuery,[category.name],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Category Added Successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    });

});
router.get('/getAllCategory',auth.autheticateToken,(req,res,next)=>{
    var selectQuery = "select * from category order by name";
    connection.query(selectQuery,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    });

});

router.post('/updateCategory',auth.autheticateToken,(req,res,next)=>{
    let category = req.body;
    var selectQuery = "update category set name=? where id=?";
    connection.query(selectQuery,[category.name,category.id],(err,results)=>{
       if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"Category Id Does not found"});
        }
        return res.status(200).json({message:"Cataegory Updated Successfully"});
       }
       else{
        return res.status(500).json(err);
       } 
    });

});
router.get('/deleteCategory/:id',auth.autheticateToken,(req,res)=>{
    const id = req.params.id;
    var selectQuery = "delete from category where id=?";
    connection.query(selectQuery,[id],(err,results)=>{
       if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"Category Id Does not found"});
        }
        return res.status(200).json({message:"Category deleted Successfully"});
       }
       else{
        return res.status(500).json(err);
       } 
    });

});
module.exports = router;
