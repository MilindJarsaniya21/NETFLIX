const userAdmin = require("../controllers/userAdmin");
const plansController = require("../controllers/plansController");
const subController = require("../controllers/subController");
const videoController = require("../controllers/videoController");

const userAuth = require("../middlewares/userAuth");
const videoUpload = require("../middlewares/videoUpload");
const { validateToken } = require("../middlewares/JWT");
const { authAdminToken } = require("../middlewares/JWT");
const { authUserToken } = require("../middlewares/JWT");
const { authSubLogIn } = require("../middlewares/JWT");
const { subData } = require("../middlewares/JWT");
const { authSubUserLogin } = require("../middlewares/JWT");
const express = require('express');
const router = express.Router();

// Middleware
app.use(express.json()); // Example middleware for JSON parsing
app.use(express.urlencoded({ extended: true })); // Example middleware for URL-encoded form data parsing

module.exports = (app) => {

    // USER
    // userinfo
    router.get("/userinfo/:name", validateToken, userAdmin.userInfo);
    // register new user
    router.post("/adduser", userAdmin.addUser);
    // login
    router.post("/login", userAdmin.login);

    // PLANS
    // create plan
    router.post("/addplan/:name", validateToken, authAdminToken, plansController.addPlan);
    // find all plans
    router.get("/findallplans", plansController.findall);
    // find plan by name
    router.get("/findoneplan/:name", plansController.findone);
    // update plan
    router.put("/updateplan/:pname/:name", validateToken, authAdminToken, plansController.updatePlan);
    // delete plan
    router.delete("/deleteplan/:pname/:name", validateToken, authAdminToken, plansController.deletePlan);

    // SUBSCRIPTIONS
    // Add subData
    router.post("/addsub/:name", validateToken, authUserToken, subData, subController.addSub);
    // Find subData
    router.get("/findsub/:name", validateToken, authSubLogIn, subController.findSub);

    // VIDEOS
    // upload video
    router.post("/uploadvideo/:name", validateToken, authAdminToken, videoUpload, videoController.uploadVideo)
    // retrieve videos
    router.get("/watch/:name", validateToken, authUserToken, authSubUserLogin, videoController.retrieveVideos);
    // retrieve videos by title
    router.get("/watchbytitle/:name", validateToken, authUserToken, authSubUserLogin, videoController.retrieveVideosByTitle);
    app.use("/", router);
}