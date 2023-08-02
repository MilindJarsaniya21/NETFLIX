const user = require("../schemas/user");

function checkRole(role) {
    return (req, res, next) => {
        if(req.user.role === role){
            next();
        }
        else{
            res.status(400).json({statuscode: 401, message: "Unauthorized", data: {}});
        }
    }
}

module.exports = checkRole;