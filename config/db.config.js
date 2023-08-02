const mongoose = require("mongoose");

mongoose.connect('mongodb://0.0.0.0:27017/netflix')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });