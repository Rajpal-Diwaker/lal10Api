const Shop = require('../../models/shop')

const add = async (criteria, cb) => {
    let { productId, userId, amount, qty, material } = criteria

    try {
        const shop = await Shop.query()
        .insert({ productId, userId, amount, qty, material });
                     
        cb(null, shop)
    } catch (e) {
       msg = "Some error in db query in shop"
       console.log(msg, e)
       cb(msg, null)
    }
}

module.exports = {
    add
}