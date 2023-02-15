const Users = require('../../models/users')
const Uploads = require('../../models/uplods')
const Options = require('../../models/options')
const Cart = require('../../models/cart')
const CartRelation = require('../../models/CartRelation')
const Enquiry = require('../../models/Enquiries')
const Card = require('../../models/card')
const Address = require('../../models/address')
const Newsfeed = require('../../models/newsfeed')
const CMS = require('../../models/cms')
const Onboarding = require('../../models/onboarding')

const knex = require('../../db/knex')

const checkUser = async (criteria) => {
    const { email } = criteria
    try {
        const user = await Users.query()
                        .where('email', '=', email)
                        .where('isActive', '=', 1)
                        .whereIn('role',[util.role('admin'),util.role('subadmin')])


         return user[0]
    } catch (e) {
       msg = "Some error in db query in users"
    //    // // console.log(msg, e)
       return null
    }
}


const uniqueUser = async (criteria) => {
    const { email, mobile } = criteria
    try {
        let user = []
        if(email){
            user = await Users.query()
                            .select('id','email')
                            .where('email', '=', email)
                            .where('isActive', '=', 1)
                            .where('isOtpVerified', '=', 1)
        }else if(mobile){
            user = await Users.query()
                            .select('id','email')
                            .where('mobile', '=', mobile)
                            .where('isActive', '=', 1)
                            .where('isOtpVerified', '=', 1)
        }

        return user
    } catch (e) {
       return []
    }
}

const addUser = async (criteria) => {
    let { email, password, role, isActive, token, mobile } = criteria

    isActive = isActive>=0 ? isActive : 1
    let isOtpVerified=1

    try {
        const user = await Users.query()
        .insert({ email, password, role, isActive, token, mobile,isOtpVerified })

        return Promise.resolve(user)
    } catch (e) {
       msg = "Some error in db query in users"
    //    // console.log(msg)
       return Promise.reject(e.UniqueViolationError? 'User already exists' : 'Some error while adding user')
    }
}


const editUser = async (criteria) => {
    let { email, password, role, isActive, token, mobile } = criteria

    isActive = isActive>=0 ? isActive : 1
    let isOtpVerified=1

    try {
        const user = await Users.query()
        .insert({ email, password, role, isActive, token, mobile,isOtpVerified })

        return Promise.resolve(user)
    } catch (e) {
       msg = "Some error in db query in users"
       // console.log(msg)
       return Promise.reject(e.UniqueViolationError? 'User already exists' : 'Some error while adding user')
    }
}

const changePassword = async (criteria, cb) => {
    let { newHash, userId } = criteria

    try {
        await Users.query()
        .update({password: newHash})
        .where({ id: userId });

        cb(null, "Success")
    } catch (e) {
       msg = "Some error in db update query in users"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const findUser = async (criteria, cb) => {
    let { userId } = criteria

    try {
        const user = await Users.query()
        .where({ id: userId });

        cb(null, user.result)
    } catch (e) {
       msg = "Some error in db query in users"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const uploads = async (criteria, cb) => {
    let { userId, uploadsArr, type } = criteria

    type = type? type: 'gallery'

    try {

        uploadsArr.forEach(async element => {
            await Uploads.query()
            .insert({
                type, userId, uri
            })
        });

        cb(null, "Success")
    } catch (e) {
       msg = "Some error in db query in uploads"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const options = async (criteria) => {
    let { type } = criteria
    let isActive = 1
    try {
        const options = await Options.query()
        .select(['id', 'name'])
        .where({ type, isActive });

        return Promise.resolve(options)
    } catch (e) {
       msg = "Some error in db query in options"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const states = async (cb) => {
    try {
        let stateSchema = require('country-state-picker');
        let states = stateSchema.getStates('in');

        cb(null, states)
    } catch (e) {
       msg = "Some error in query in states"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const cart = async (criteria, cb) => {
    let { userId } = criteria

    try {
        const cart = await Cart.query()
        .join('cart_relation as cr', 'c.id', 'cr.cartId')
        .select('cr.qty', 'c.id as cartId')
        .where({ userId });

        cb(null, cart.result)
    } catch (e) {
       msg = "Some error in db query in cart"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const addCart = async (criteria, cb) => {
    let { productQtyArr, userId } = criteria

    try {
        const cart = await Cart.query()
                        insert({userId})

        const cartId = cart.id

        productQtyArr.forEach(async (ob) => {
            const { productId, qty } = ob
            await CartRelation.query()
                        insert({cartId, productId, qty})
        })

        cb(null, 'success')
    } catch (e) {
       msg = "Some error in db query in add to cart"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const addEnquiry = async (criteria, cb) => {
    try {
        await Enquiry.query()
            .insert(criteria)

        cb(null, 'success')
    } catch (e) {
       msg = "Some error in db query in enquiry addition"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const addCard = async (criteria, cb) => {
    try {
        await Card.query()
            .insert(criteria)

        cb(null, 'success')
    } catch (e) {
       msg = "Some error in db query in card addition"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const addAddress = async (criteria, cb) => {
    try {
        await Address.query()
            .update({defaultAdd: 0})
            .where({userId: criteria['userId']})

        criteria['defaultAdd'] = 1
        await Address.query()
            .insert(criteria)

        cb(null, 'success')
    } catch (e) {
       msg = "Some error in db query in address addition"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const changeStatus = async (criteria) => {
    try {
        const { userId, status } = criteria
        await Users.query()
            .update({isActive: status? 1: 0})
            .where({ id: userId })

        return Promise.resolve('success')
    } catch (e) {
       msg = "Some error in db query in changing user status"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const deleteUser = async (criteria, cb) => {
    try {
        const { userId } = criteria
        await Users.query()
            .delete()
            .where({ userId })

        cb(null, 'success')
    } catch (e) {
       msg = "Some error in db query in deleting user"
    //    // // console.log(msg, e)
       cb(msg, null)
    }
}

const addNewsfeed = async (criteria) => {
    // // console.log("addNewsfeed======",criteria)
    try {
        const id = criteria.id
        delete criteria.id
        if(id && id!='null'){

            await Newsfeed.query()
            .patch(criteria)
            .where({id})


        }else{
            await Newsfeed.query()
            .insert(criteria)
        }

        // return Promise.resolve('success')
    } catch (e) {
       msg = "Some error in db query in newsfeed addition"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const getNewsfeed = async (criteria) => {
    try {
        const result = await Newsfeed.query().where({type:criteria.type}).orderBy('id','desc')

        return Promise.resolve(result)
    } catch (e) {
       msg = "Some error in db query in newsfeed"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const addCMS = async (criteria) => {
    try {
        await CMS.query()
        .insert(criteria)

        return Promise.resolve('success')
    } catch (e) {
       msg = "Some error in db query in cms addition"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const getCMS = async () => {
    try {
        const result = await CMS.query()

        return Promise.resolve(result)
    } catch (e) {
       msg = "Some error in db query in get cms"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const addOnboarding = async (criteria) => {
    try {

        // console.log("criteria  addOnboarding",criteria)

        const id = criteria.id
        delete criteria.id

        if(id && id!='null'){

            if(!criteria.image){
                delete criteria.image
            }

            await Onboarding.query().patch(criteria).where({id})

        }else{

            await Onboarding.query().insert(criteria)

        }

        return
    } catch (e) {
       msg = "Some error in db query in Onboarding addition"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}


const statusOnboarding = async (criteria) => {
    try {
        const id = criteria.id
        delete criteria.id

        await Onboarding.query()
        .patch(criteria)
        .where({id})

        return Promise.resolve('success')
    } catch (e) {
       return Promise.reject(msg)
    }
}

const listingOnboarding = async (criteria) => {
    try {
        // const result = await Onboarding.query()
        let result;

        if(criteria.type=='web'){

            result = await Onboarding.query()
            .alias('t1')
            .select('t1.*')
            .where('t1.type','=',criteria.type)
            .orderBy('t1.id','desc').debug()

        }else{

            result = await Onboarding.query()
                                .alias('t1')
                                .join('options as t2','t1.language','t2.id')
                                .select('t1.*','t2.name as language')
                                // .where('t1.isActive', '=',1)
                                .where('t2.isActive', '=',1)
                                .where('t2.type','=','language')
                                .where('t1.type','=',criteria.type)
                                .orderBy('t1.id','desc').debug()

        }

        return Promise.resolve(result)
    } catch (e) {
       msg = "Some error in db query in Onboarding addition"
       return Promise.reject(msg)
    }
}

const getOnboarding = async () => {
    try {
        const result = await Onboarding.query()

        return Promise.resolve(result)
    } catch (e) {
       msg = "Some error in db query in Onboarding"
    //    // // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const addLoginOnboarding = async (criteria) => {
    try {
        const table = criteria.table
        const id = criteria.id

        delete criteria.id
        delete criteria.table

        if(id && id!='null'){
            await knex(table).update(criteria).where({id})
        }else{
            await knex(table).insert(criteria)
        }

        return Promise.resolve('success')
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const listingLoginOnboarding = async (criteria) => {
    try {
        const result = await knex(criteria.table)

        return Promise.resolve(result)
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const delLoginOnboarding = async (criteria) => {
    try {

        await knex(criteria.table).where({id:criteria.id}).del()

        return Promise.resolve("success")
    } catch (e) {
       msg = "Some error in db query in Onboarding"
       // // console.log(msg, e)
       return Promise.reject(msg)
    }
}


const getMenus = async (userId) => {
    try {
      return new Promise((resolve) => {
        let query;
        if(userId === 1)
            query = `SELECT * FROM subAdminRole WHERE isActive='1'`
        else
            query = `SELECT * FROM subAdminRole WHERE isActive='1' AND FIND_IN_SET(id,( SELECT subAdminRoleId FROM subAdminRoleType WHERE userId='${userId}'))`

           knex
           .raw(query)
           .then( async(result) => {
            const res2 = result[0];
            resolve(res2);
        })
      })
    } catch (e) {
       return Promise.reject(e.toString())
    }
  }


module.exports = {
    getMenus,
    checkUser,
    addUser,
    editUser,
    changePassword,
    findUser,
    uploads,
    options,
    states,
    cart,
    addCart,
    addEnquiry,
    addCard,
    addAddress,
    changeStatus,
    deleteUser,
    getNewsfeed,
    addNewsfeed,
    addCMS,
    getCMS,
    addOnboarding,
    listingOnboarding,
    getOnboarding,
    addLoginOnboarding,
    listingLoginOnboarding,
    statusOnboarding,
    delLoginOnboarding,
}