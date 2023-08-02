require("../config/db.config");
const plans = require("../schemas/plans");
const express = require("express");
const app = express();
app.use(express.json());

// add new plan
exports.addPlan = async (req, res) => {
  try {
    const data = plans(req.body);
    const result = data.save();
    if (!data) {
      return res
        .status(400)
        .json({ statuscode: 404, message: "Body can't be empty", data: {} });
    }
    if (!result) {
      return res.status(400).json({
        statuscode: 404,
        message: "Data is not in the right format",
        data: {},
      });
    }
    return res.status(200).json({
      statuscode: 200,
      message: "Plan has been stored to database",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// retrieve all plans
exports.findall = async (req, res) => {
  try {
    const data = await plans.find({});
    if (!data) {
      return res
        .status(400)
        .json({ statuscode: 404, message: "No plans to show!", data: {} });
    }
    return res
      .status(200)
      .json({ statuscode: 200, message: "All plans: ", data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// retrieve plan by name  
exports.findone = async (req, res) => {
  try {
    const name = req.params.name;
    const existingPlan = await plans.findOne({ planName: name });
    if (!name) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Name is required!", data: {} });
    }
    if (!existingPlan) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Plan not found!", data: {} });
    }
    return res
      .status(200)
      .json({ statuscode: 200, message: "Plan: ", data: existingPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// update plan
exports.updatePlan = async (req, res) => {
  try {
    // const filter = req.params;
    const update = req.body;
    const updatedPlan = await plans.findOneAndUpdate({planName: req.params.pname}, update, {
      new: true,
    });
    return res.status(200).json({
      statuscode: 200,
      message: "Plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// delete plan
exports.deletePlan = async (req, res) => {
  try {
    const name = req.params.pname;
    const existingPlan = await plans.findOne({ planName: name });
    if (!name) {
      return res
        .status(400)
        .json({ statuscode: 404, message: "Plan name is required", data: {} });
    }
    if (!existingPlan) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Plan doesn't exist", data: {} });
    }
    const result = await plans.deleteOne(existingPlan);
    return res.status(200).json({
      statuscode: 200,
      message: "Plan deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};
