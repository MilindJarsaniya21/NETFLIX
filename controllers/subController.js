require("../config/db.config");
const { createTokens } = require("../middlewares/JWT");
const bcrypt = require("bcrypt");
const user = require("../schemas/user");
const plan = require("../schemas/plans");
const sub = require("../schemas/subscriptions");
const { subData } = require("../middlewares/JWT");
const express = require("express");
const app = express();
app.use(express.json());

// Add subscription
exports.addSub = async (req, res) => {
  try {
    const userId = req.userId; // | -> accessed from req object where subData(JWT) stored userId in req obj.
    const uName = req.uName; //   | -> accessed from req object where subData(JWT) stored uName in req obj.
    const planId = req.body.planId;
    const existingUser = await user.findById({ _id: userId });
    const existingPlan = await plan.findById({ _id: planId });
    const pName = existingPlan.planName;
    const months = existingPlan.duration;
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + months);
    if (!existingUser) {
      return res
        .status(400)
        .json({ statuscode: 404, message: "User does not exist", data: {} });
    }
    if (!existingPlan) {
      return res
        .status(400)
        .json({ statuscode: 404, message: "Plan does not exist", data: {} });
    }
    const subData = new sub({
      userId: userId,
      planId: planId,
      userName: uName,
      planName: pName,
      dueDate: dueDate,
    });
    const result = subData.save();
    return res
      .status(200)
      .json({ statuscode: 200, message: "Subscription added", data: subData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// Retrieve subscription data
exports.findSub = async (req, res) => {
  try {
    const subData = await sub.find({ _id: req.body.subId })
    .populate({
      path: "userId",
      match: {},
      select: "-uPassword -role"
    }).populate({
      path: "planId",
      match: {},
    })
    if(!subData){
      return res
      .status(400)
      .json({ statuscode: 404, message: "No subscriber data found", data: {} });  
    }
    return res.status(500).json({ statuscode: 200, message: "Subscriber Data", data: subData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};