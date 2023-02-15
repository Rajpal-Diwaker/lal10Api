const jwt = require('jsonwebtoken');
const util = require('../Utilities/util');
const Users = require('../models/users')

const auth = {
    verifyToken: (req, res, next) => {
        if (!req.headers.authorization) {
           return res.send({"code":util.statusCode.FOUR_ZERO_ONE, "message":"Invalid token !!"})
        }
        jwt.verify(req.headers.authorization, util.LOGIN_SECRET, (err, decoded) => {
            if (err) {
                res.send({"code":"401", "message":"Invalid token !!", "error":err})
            } else {

                console.log("token===",req.headers.authorization)

                req.user=decoded.checkuser;

                console.log("req.user==",decoded)

                next();
            }
        })
    },

    userCheck: async (req, res, next) => {

        jwt.verify(req.headers.authorization, util.LOGIN_SECRET, async (err, decoded) => {
            if (err) {
                res.send({"code":"401", "message":"Invalid token !!", "error":err})
            } else {

                // req.user=decoded.checkuser[0];
                let userId=decoded.checkuser[0].id;

                const user = await Users.query().select('id','isActive','deleted').where('id',userId).where('isActive','1').debug()

                    if(user.length){
                        const user2 = await Users.query().select('id','isActive','deleted').where('id',userId).where('deleted','1').debug()
                        if(user2.length)
                            next();
                        else
                            return res.send({"code":"502", "message":"Admin has deleted your account. Please contact admin for further queries."})
                    }else{
                            return res.send({"code":"501", "message":"Admin has deactivated your account. Please contact admin for further queries"})
                    }
               }
          })
        }
}

module.exports = auth;