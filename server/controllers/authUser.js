//Imports
const { MongoClient, ObjectId} = require("mongodb");
const { connection } = require("../models/connection");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();


//Mongo credentials
const uri = process.env.URI;
const dataBaseName = process.env.DB;
const collectionName = process.env.COLLECTION2;
const client = new MongoClient(uri);
const SECRET_KEY = process.env.SECRET_KEY;
//console.log(SECRET_KEY);



async function authenticateUser(req, res) {
    try {
        const { collection } = await connection(client, dataBaseName, collectionName);
        const { userName, password } = req.body;
        const user = await collection.find({userName}).toArray();
        console.log(user[0]);
        if(!user || /* !await bcrypt.compare(password, user.password) */  password !== user[0].password) {
            return res.status(400).json({ success : false , message: "Invalid credentials" });
        }

        const token = jwt.sign({username : user[0].userName, role : user[0].role}, SECRET_KEY, {expiresIn : "1h"});
        return res.status(200).json({success:true, token, role : user[0].role});
    }
    catch(error) {
        return res.status(500).json({success : false, message : "Internal databse error."});
    }
}


module.exports = { authenticateUser };