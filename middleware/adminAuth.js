const jwt = require('jsonwebtoken');
const util = require('../Utilities/util');

const adminAuth = {
    verifyToken: (req, res, next) => {
        if (!req.headers.authorization) {
           return res.send({"code":util.statusCode.FOUR_ZERO_ONE, "message":"Invalid token !!"})
        }
        jwt.verify(req.headers.authorization, util.LOGIN_SECRET, (err, decoded) => {
            if (err) {
                res.send({"code":"401", "message":"Invalid token !!", "error":err})
            } else {
                req.admin=decoded.user;
                next();
            }
        })
    }
}

module.exports = adminAuth;