const user = require("../schemas/user");
const sub = require("../schemas/subscriptions");
const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    {
      _id: user._id,
      uName: user.uName,
      role: user.role,
    },
    "secret!"
  );
  return accessToken;
};

// MIDDLEWARE
const validateToken = async (req, res, next) => {
  // const accessToken = req.headers.authorization.split(' ')[1];
  // const accessToken = req.headers["access-token"];
  const accessToken = req.cookies["access-token"]; // Passing cookies directly
  if (!accessToken) {
    return res
      .status(400)
      .json({ statuscode: 400, message: "User is not Authenticated!" });
  }
  try {
    const validateToken = verify(accessToken, "secret!");
    if (validateToken) {
      req.authenticated = true;
      const userId = validateToken._id;
      const existingUser = await user.findOne({ uName: req.params.name });
      const paramsId = existingUser._id;
      if (userId == paramsId) {
        req.user = {
          _id: validateToken._id,
          uName: validateToken.uName,
          role: validateToken.role,
        };
        return next();
      } else {
        return res
          .status(400)
          .json({ statuscode: 400, message: "User not logged in!", data: {} });
      }
      // const user = await user.findById(userId);

      // if (!user) {
      //   return res
      //     .status(400)
      //     .json({ statuscode: 400, message: "User not found!" });
      // }

      // req.user = user;
      // console.log(user.uEmail);
      // return next();
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// Admin Authentication
const authAdminToken = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      next();
    } else {
      return res
        .status(400)
        .json({ statuscode: 401, message: "Unauthorized", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// User Authentication
const authUserToken = async (req, res, next) => {
  try {
    if (req.user.role == "User") {
      next();
    } else {
      return res
        .status(400)
        .json({ statuscode: 401, message: "Unauthorized", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// Subscriber data
const subData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const uName = req.user.uName;
    req.userId = userId;
    req.uName = uName;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

// Subscriber logged in while retrieving data
const authSubLogIn = async (req, res, next) => {
  try {
    const subId = req.body.subId;
    const existingSub = await sub.findById({ _id: subId });
    const userId = existingSub.userId;
    console.log(req.user._id +" - "+ userId);
    if (req.user._id == userId) {
      next();
    }
    else{
      return res.status(400).json({statuscode: 400, message: "Subscriber not logged in!", data: {}})
    }
  } catch (error) {
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
};

const authSubUserLogin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const existingSub = await sub.findOne({userId: userId});
    if(!existingSub){
      return res.status(400).json({statuscode: 400, message: "User has not subscribed!", data: {}});   
    }
    const subId = existingSub._id;
    const planId = existingSub.planId;
    const subUserId = existingSub.userId;
    const isActive = existingSub.isActive;
    if(subUserId == userId && isActive){
      req.subId = subId;
      req.planId = planId;
      next();
    }
    else{
      return res.status(400).json({statuscode: 401, message: "Renew your subscription!", data: {}})
    }
  } catch (error) {
    return res
      .status(500)
      .json({ statuscode: 500, message: "It's not you, it's us", data: {} });
  }
}

module.exports = {
  createTokens,
  validateToken,
  authAdminToken,
  authUserToken,
  subData,
  authSubLogIn,
  authSubUserLogin
};