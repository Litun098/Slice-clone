const express = require('express');
const uuidv4 = require('uuidv4');
const helpUtils = require('../utils/helperUtils');
const DB = require('../database/dbConnection');

class UserController{
    static async createUser(req,res){
        const {firstname,lastname,address,email,password} = req.body;
        const hashedPassword = helpUtils.hashPassword(password);
        const query = `insert into users(id,firstname,lastname,address,email,password) values($1,$2,$3,$4,$5,$6) returning id,firstname,lastname,address,email,status,isAdmin`;
        const values = [uuidv4(),firstname,lastname,address,email,status,hashedPassword];

        try{
            const {rows} = await DB.query(query,values);
            const token = helpUtils.generateToken({rows});
            res.status(201).json({
                status:201,
                message:"Registration successfull",
                data:{token,...rows[0]}
            })
            return;
        }catch(err){
            console.log(err);
            if(err.routine === '_bt_check_unique'){
                res.status(409).json({
                    status:409,
                    error:"User with email already exist"
                })
                return;
            }
            res.status(500).json({
                status:500,
                error:"Something went wrong."
            })
        }
    }

    static login(req,res){
        const {id,firstname,lastname,address,email,isAdmin,status} = req.user;
        const token = helpUtils.generateToken({
            id,email,isAdmin,status
        });

        res.status(200).json({
            status:"Login successful",
            data:{
                id,
                token,
                email,
                firstname,
                lastname,
                address,
                status,
                isAdmin
            }
        })
    }

    static async getAllUsers(req,res){
        const query = `select id, fistname,lastname,email,address,status,isAdmin, from users`

        const rows = await DB.query(query);

        res.status(200).json({
            status:200,
            message:"Success",
            data:rows
        });
    }

    static async getUser(req,res){
        const {email}  = req.params;
        const query = `select id,firstname,lastname,address,status,email,isAdmin, from user where email = ${email}`

        const findUser = await DB.query(query);
        if(findUser.rowCount > 0){
            res.status(404).json({error:"user does not exists"});
        }

        res.status(200).json({
            status:200,
            message:"Success",
            data:[findUser.rows[0]]
        })
    }

    static async verifyUser(req,res){
        const email = req.params;
        const query = `select * from users where email = ${email}`;

        const update = `update users ser status verified where email = ${email}`;

        const findUser = await DB.query(query)
        if(findUser.rows.length){
            res.status(404).json({
                error:"User is already verified"
            });
        }
        if(findUser.rows[0].status == 'verified'){
            res.status(404).json({
                error:"User is already verified"
            });
        }
        const rows = await DB.query(update);
        res.status(201).json({
            message:"user successfully verified",
            data:{
                ...rows[0]
            }
        })
    }
}

module.exports = UserController;
