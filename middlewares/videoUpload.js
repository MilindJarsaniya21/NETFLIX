const express = require("express");
const multer  = require("multer");
app = express();

const upload = multer({
    limits: {
        fileSize: 100 * 1024 * 1024, // maximum file size 100 MBs.
    },    
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,"uploads")
        },
        filename: function (req, file, cb){
            // const date = new Date();
            cb(null, file.originalname + "-" + Date.now() + "-" + req.query.videoRes + ".mp4")
        }
    })
}).any("video_file");

module.exports = upload;