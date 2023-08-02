const docs = require('./docs');
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 8081;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const customCron = require("./cron");
customCron.sendMailAllUser();

// Step 1: Add the Swagger setup
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

  // Step 2: Replace the below path with the correct path to your routes file
//   apis: ["./routes/db.routes.js"],
// apis: ["./routes/db.routes"],


// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
// End of Swagger setup

// app.use('/api', dbRoutes);
require('./routes/db.routes')(app);

app.listen(PORT, () => {
    console.log(`App is listening at mongodb://0.0.0.0:${PORT}`);
})

// 2024-07-07T07:21:39.710+00:00