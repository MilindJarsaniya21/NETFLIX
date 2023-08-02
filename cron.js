const user = require("./schemas/user");
const sub = require("./schemas/subscriptions");
const config = require("./config/db.emailConfig");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const sendMailToAll = (emailObj) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword,
        }
    })

    const mailOptions = { 
        from: 'Node Project',
        to: emailObj,
        subject: 'Cron test mail',
        html: '<p>Hello!</p>',
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }
        else{
            console.log("Mail has been sent to ", emailObj, info.response);
        }
    })
}

const sendMailAllUser = async () => {
    try {
      cron.schedule("* * * * * *", async () => {
        const range1 = new Date();
        range1.setDate(range1.getDate() + 1);
        range1.setHours(0, 0, 0, 0);
  
        const range2 = new Date();
        range2.setDate(range2.getDate() + 1);
        range2.setHours(23, 59, 59, 999);
  
        const subscribers = await sub.find({
          dueDate: {
            $gte: range1,
            $lt: range2
          }
        });
  
        if (subscribers.length > 0) {
          const userIds = subscribers.map(subscriber => subscriber.userId);
          const userData = await user.find({ _id: { $in: userIds } });
  
          const emails = userData.map(user => user.uEmail);
  
          sendMailToAll(emails);
        }
      });
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

module.exports = {
    sendMailAllUser
}