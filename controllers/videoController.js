require("../config/db.config");
const video = require("../schemas/videos");
const sub = require("../schemas/subscriptions");
const plan = require("../schemas/plans");
const express = require("express");
const app = express();
app.use(express.json());

// Upload videos
exports.uploadVideo = async (req, res) => {
  try {
    const file = req.files;
    const videoData = new video({
      videoTitle: req.body.videoTitle,
      videoName: file[0].filename,
      videoRes: req.query.videoRes,
      planId: req.body.planId,
    });
    const result = await videoData.save();
    if(!videoData){
        return res.status(400).json({statuscode: 400, message: "videoName or videoRes not uploaded properly", data: {}});
    }
    return res.status(200).json({statuscode: 200, message: "Video uploaded!", data: videoData});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// retrieve videos
exports.retrieveVideos = async (req, res) => {
  try {
    // const videoName = req.body.videoName;
    const planId = req.planId;
    // const existingPlan = await plan.findById({_id: planId});
    // const planName = existingPlan.planName;
    const videoData = await video.find({planId: planId})
    .populate({
      path: 'planId',
    })
    console.log(videoData);
    if(!videoData){
      return res.status(400).json({statuscode: 404, message: "Videos for selected plan not found", data: {}});
    }
    return res.status(200).json({statuscode: 200, message: "Watch here: ", data: videoData});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
}

// retrieve videos by title
exports.retrieveVideosByTitle = async (req, res) => {
  try {
    const videoTitle = req.body.videoTitle;
    const planId = req.planId;
    if(!videoTitle){
      return res.status(400).json({statuscode: 400, message: "Video name is required", data: {}});
    }
    const videoData = await video.find({planId: planId, videoTitle: videoTitle})
    .populate({
      path: 'planId',
      select: '_id',
    })
    console.log(videoData);
    if(!videoData){
      return res.status(400).json({statuscode: 404, message: "Video doesn't exist!", data: {}});
    }
    return res.status(200).json({statuscode: 200, message: "Watch here: ", data: videoData});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
}