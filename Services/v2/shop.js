
let util = require('../../Utilities/util'),
shop_dao = require('../../dao/v2/shop'),
jwt = require('jsonwebtoken');

let add = util.errHandler(async (req, res) => {
    try {
        let criteria = { ...req.body }

        if(req.files && req.files[0].image){
            criteria['image'] = req.files[0].image
        }

        await shop_dao.add(criteria)
        
    } catch (error) {
        res.status(401).send({ code: 401 , message: "Some error while adding products" }) 
    }
})

module.exports = {
    add
};
