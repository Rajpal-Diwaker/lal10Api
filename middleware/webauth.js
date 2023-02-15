const jwt = require('jsonwebtoken');
const util = require('../Utilities/util');
const Users = require('../models/users')

const LOGIN_SECRET="lal10$#$#$@#%loginsecret%$#%$^$%^"

const auth = {
    verifyToken: (req, res, next) => {
        if (!req.headers.authorization) {
           return res.send({"code":util.statusCode.FOUR_ZERO_ONE, "message":"Invalid token !!"})
        }
        jwt.verify(req.headers.authorization, LOGIN_SECRET, (err, decoded) => {
            if (err) {
                res.send({"code":"401", "message":"Invalid token !!", "error":err})
            } else {

                // console.log("decoded==",decoded)

                req.user=decoded.checkuser;
                next();
            }
        })
    }
}

module.exports = auth;