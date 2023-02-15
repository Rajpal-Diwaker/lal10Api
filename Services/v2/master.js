
let util = require('../../Utilities/util'),
masterDao = require('../../dao/v2/master')

let addCategory = util.errHandler(async (req, res) => {
    try {
       await masterDao.addCategory({...req.body}) 
       res.status(200).send({ code: 200 , message: "Success" })  
    } catch (error) {
        res.status(401).send({ code: 401 , message: "Some error while adding category" }) 
    }
})

let getCategory = util.errHandler(async (req, res) => {
    try {
       let result = await masterDao.addCategory({...req.body}) 
       res.status(200).send({ code: 200 , message: "Success", result })  
    } catch (error) {
        res.status(401).send({ code: 401 , message: "Some error while getting category" }) 
    }
})

module.exports = {
    addCategory,
    getCategory
};
