require("../config/db.config");

require('dotenv').config();
const nodemailer = require("nodemailer");
// const cron = require("node-cron");

const JsonWebToken = require("jsonwebtoken");
const { createTokens } = require("../middlewares/JWT");
const bcrypt = require('bcrypt');
const user = require("../schemas/user");
const express = require("express");
const app = express();
app.use(express.json());

// Register new user
exports.addUser = async (req, res) => {
  try {
    const {uName, uEmail, uPassword, role} = req.body;
    const hashedPassword = await bcrypt.hash(uPassword, 10);
    
    const data = new user({uName, uEmail, uPassword: hashedPassword, role});
    const result = await data.save();
    if (!data) {
      return res  
        .status(400)
        .json({ statuscode: 404, message: "Nothing to add!", data: {} });
    }
    return res
      .status(200)
      .json({ statuscode: 200, message: "User created", data: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const {uName, uPassword} = req.body;
    const existingUser = await user.findOne({uName: uName});
    if(!req.body){
      return res.status(400).json({statuscode: 400, message: "Body can't be empty", data: {}});
    }
    if(!existingUser){
      return res.status(400).json({statuscode: 404, message: "User doesn't exist", data: {}});
    }
    const dbPassword = existingUser.uPassword;
    bcrypt.compare(uPassword, dbPassword)
    .then((match) => {
      if(!match){
      return res.status(400).json({statuscode: 400, message: "Wrong username and password combination.", data: {}});
      }
      const accessToken = createTokens(existingUser);
      res.cookie("access-token", accessToken, {
        maxAge: 60*60*1000
      })
      return res.status(400).json({statuscode: 400, message: "LOGGED IN!", data: {}});
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
}

//  userinfo
exports.userInfo = async (req, res) => {
  try {
    const name = req.params.name;
    const data = await user.findOne({ uName: req.params.name });
    if (!data) {
      return res
        .status(400)
        .json({ statuscode: 404, message: "User not found", data: {} });
    }
    return res
      .status(200)
      .json({ statuscode: 200, message: "User details retrieved", data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};