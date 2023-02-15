const Users = require('../../models/users')
const Artisan = require('../../models/artisan')
const OtpVerified = require('../../models/OtpVerification')
const Uploads = require('../../models/uplods')
const Options = require('../../models/options')
const SubType = require('../../models/subType')
const Category = require('../../models/category')
const Cart = require('../../models/cart')
const CartRelation = require('../../models/CartRelation')
const Card = require('../../models/card')
const Address = require('../../models/address')
const util = require("../../Utilities/util")
const UsersDetails = require('../../models/UserDetails')
const Store = require('../../models/store')
const AboutusUser = require('../../models/AboutusUser')
const UserProductSell = require('../../models/UserProductSell')
const TypeOfStore = require('../../models/TypeOfStore')
const AboutusSample = require('../../models/AboutusSample')
const Product = require('../../models/product')
const Enquiries = require('../../models/Enquiries')
const ProductImage = require('../../models/ProductImage')

const knex = require('../../db/knex')
const { listeners } = require('../../logger/logger')

let msg;

const checkUser = async (criteria) => {
    const { email } = criteria
    try {
        const res = await Users.query()
            .where('email', '=', email)
            .where('role', '=', util.role('enduser'))
            .where('isActive', '=', 1)
        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const checkUserMobile = async (criteria) => {
    const { mobile } = criteria
    try {
        const res = await Users.query()
            .select('id', 'mobile')
            .where('mobile', '=', mobile)
            .where('role', '=', util.role('enduser'))
            .where('isActive', '=', 1)
            .where('isOtpVerified', '=', 1)

        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const checkUserId = async (criteria) => {
    const { userId } = criteria

    try {
        const user = await Users.query()
            .where('id', '=', userId)
            .where('isActive', '=', 1)
        return user;
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getStore = async (userId) => {
    try {
        const res = await Store.query()
            .alias('s')
            .join('user_details as ud', 's.userId', 'ud.userId')
            .select('s.store', 'ud.*')
            .where('s.userId', userId)

        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}



const typeOfStore = async () => {
    try {
        const res = await TypeOfStore.query()
            .where('isActive', '=', 1)
        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const addWebUser = async (criteria) => {
    let { email, password, role, isActive, mobile, verifyLink, countryCode } = criteria
    try {
        const res = await Users.query()
            .select('id')
            .where('email', email)
            .where('mobile',mobile)
            .where('role',role)
            .where('isActive','1')

        if (res.length) {
            return Promise.resolve(res[0])
        } else {
            const user = await Users.query()
                .insert({ countryCode, role, isActive, mobile, email, password, isOtpVerified: '1', verifyLink, verifyLinkUsed: '0' })

            return Promise.resolve(user)
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const addEditUserAdditionalDetails = async (criteria) => {
    let { userId, name, name2, country, phone } = criteria
    try {
        const check = await UsersDetails.query()
            .select('id')
            .where('userId', '=', userId)

        if (check.length) {
            await UsersDetails.query()
                .update({ name: name, name2: name2, country: country, phone: phone }).where({ id: check[0].id })
            return
        } else {
            const res = await UsersDetails.query()
                .insert({ name, name2, country, phone, userId })
            return Promise.resolve(res)
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}



const editUserStore = async (criteria) => {
    let { type, store, year, bussiness, postalCode, websiteUrl, userId, description } = criteria

    try {
        const check = await Store.query()
            .select('id')
            .where('userId', '=', userId)

        if (check.length) {

            await Store.query()
                .update({
                    type: type, store: store, year: year,
                    postalCode: postalCode, websiteUrl: websiteUrl, description: description
                })
                .where({ userId: userId })


            return
        } else {

            const res = await Store.query()
                .insert({ type, store, year, bussiness, postalCode, websiteUrl, userId })

            return Promise.resolve(res)
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const editStoreAboutus = async (criteria) => {
    let { type, userId } = criteria
    var typeArr = type.split(',')
    var typeId;

    try {
        await AboutusUser.query().delete().where({ userId })

        for (index = 0; index < typeArr.length; index++) {
            typeId = typeArr[index]
            await AboutusUser.query().insert({ typeId, userId })
        }
        return
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const editStoreProduct = async (criteria) => {
    let { category, userId } = criteria
    var categoryArr = category.split(',')
    var categoryId;

    try {
        await UserProductSell.query().delete().where({ userId })

        // const craftPromises = idsArr.map(recordId => knex('productionFiles').where({id:recordId}).del())
        // await Promise.all(craftPromises)


        for (index = 0; index < categoryArr.length; index++) {
            categoryId = categoryArr[index]
            await UserProductSell.query().insert({ categoryId, userId })
        }
        return
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const editUserStoreImportant = async (criteria) => {
    let { customerImportant, userId } = criteria

    try {
        await Store.query()
            .update({ customerImportant: customerImportant })
            .where({ userId: userId })

        return
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const hearAboutUs = async () => {
    try {
        const res = await AboutusSample.query()
        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getProductList = async () => {

    try {

        const productList = await Options.query()
            .select('id', 'name as title', 'image')
            .where('isActive', '=', 1)
            .where('userId', '=', 1)
            .where('type', '=', 'products')

        return productList;

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const forgotToken = async (criteria, cb) => {
    let { newHash, userId } = criteria

    // // console.log('criteria',criteria)

    try {
        await Users.query()
            .update({ forgotToken: newHash, forgotTokenUsed: '0' })
            .where({ id: userId })

        return
    } catch (e) {
        return Promise.reject(e.toString())
    }
}



const checkPwdToken = async (criteria) => {
    const { token } = criteria
    try {
        const user = await Users.query()
            .select('id','password')
            .where('forgotToken', token)
            .where('forgotTokenUsed','0')
            .where('role', util.role('enduser'))
            .where('isActive','1')

        return user;
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const changePassword = async (criteria, cb) => {
    let { newHash, userId } = criteria

    // // console.log('criteria',criteria)

    try {
        await Users.query()
            .update({ password: newHash ,forgotTokenUsed:'1'})
            // .update({ password: newHash})
            .where({ id: userId })

        return
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


// const getCategory = async () => {
//     try {
//         let result = await Category.query()
//             .select('id', 'title', 'parentId', 'image')
//             .where('isActive', '1')
//             .where('deleted', '1')
//             .where('parentId', '1')
//             .where('title', '!=', '')
//             .where('verified','1')
//             .orderBy('priority')
//         // .limit(1)

//         for (index = 0; index < result.length; index++) {
//             result[index]['subcategory'] = await getSubCategory(result[index].id);
//         }

//         for (index2 = 0; index2 < result.length; index2++) {
//             for (index3 = 0; index3 < result[index2]['subcategory'].length; index3++) {
//                 result[index2]['subcategory'][index3]['subsubcategory'] = await getSubSubCategory(result[index2]['subcategory'][index3].id);
//             }
//         }

//         for (index4 = 0; index4 < result.length; index4++) {
//             for (index5 = 0; index5 < result[index4]['subcategory'].length; index5++) {
//                 for (index6 = 0; index6 < result[index4]['subcategory'][index5]['subsubcategory'].length; index6++) {
//                     // console.log("result[index2]['subcategory'][index3]==", result[index4]['subcategory'][index5]['subsubcategory'][index6].id)
//                     result[index4]['subcategory'][index5]['subsubcategory'][index6]['subsubsubcategory'] = await getSubSubCategory(result[index4]['subcategory'][index5]['subsubcategory'][index6].id);
//                 }
//             }
//         }
//         // return result;
//         return util.nullRemove(result);
//     } catch (e) {
//         return Promise.reject(e.toString())
//     }
// }



const getCategory = async () => {
    try {
        let result = await Category.query()
            .select('id', 'title', 'parentId', 'image')
            .where('isActive', '1')
            .where('deleted', '1')
            .where('parentId', '1')
            .where('title', '!=', '')
            .where('verified','1')
            .orderBy('priority')
        // .limit(1)

            await Promise.all(result.map((res, ix1) => {
            return getSubCategory(res.id)
                .then(rows => {
                result[ix1].subcategory = rows;
                return result[ix1]
            })
            .then(catSubCat => {
                return Promise.all(catSubCat.subcategory.map((subCat, ix2) => {
                    return getSubCategory(subCat.id)
                .then(rows => {
                    catSubCat.subcategory[ix2].subsubcategory = rows;
                    return Promise.all(catSubCat.subcategory[ix2].subsubcategory.map((sssCat, ix3) => {
                        return getSubCategory(sssCat.id)
                        .then(rows => {
                            return catSubCat.subcategory[ix2].subsubcategory[ix3].subsubsubcategory = rows;
                            })
                        }))
                    })
                }))
                })
            }));
            return util.nullRemove(result);
        // for (index = 0; index < result.length; index++) {
        //     result[index]['subcategory'] = await getSubCategory(result[index].id);
        // }
        //
        // for (index2 = 0; index2 < result.length; index2++) {
        //     for (index3 = 0; index3 < result[index2]['subcategory'].length; index3++) {
        //         result[index2]['subcategory'][index3]['subsubcategory'] = await getSubSubCategory(result[index2]['subcategory'][index3].id);
        //     }
        // }
        //
        // for (index4 = 0; index4 < result.length; index4++) {
        //     for (index5 = 0; index5 < result[index4]['subcategory'].length; index5++) {
        //         for (index6 = 0; index6 < result[index4]['subcategory'][index5]['subsubcategory'].length; index6++) {
        //             // console.log("result[index2]['subcategory'][index3]==", result[index4]['subcategory'][index5]['subsubcategory'][index6].id)
        //             result[index4]['subcategory'][index5]['subsubcategory'][index6]['subsubsubcategory'] = await getSubSubCategory(result[index4]['subcategory'][index5]['subsubcategory'][index6].id);
        //         }
        //     }
        // }
        // return result;
        return util.nullRemove(result);
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getSubCategory = async (menuId) => {
    try {
        let res = await Category.query()
            .select('id', 'title', 'parentId', 'image')
            .where('isActive', '1')
            .where('parentId', '!=', 1)
            .where('deleted', '1')
            .where('parentId', '=', menuId)
            .where('title', '!=', '')
            .where('verified','1')

        return util.nullRemove(res);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getSubSubCategory = async (menuId) => {
    try {
        const res = await Category.query()
            .select('id', 'title', 'parentId', 'image')
            .where('isActive', '=', 1)
            .where('parentId', '!=', 1)
            .where('parentId', '=', menuId)
            .where('title', '!=', '')
            .where('verified','1')

        return util.nullRemove(res);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getCategoryProduct = async (criteria, plive) => {

    // console.log("criteria===", criteria)

    if (!criteria.limit) criteria.limit = 10
    if (!criteria.offset) criteria.offset = 0

    try {

        let condition = ' and categoryId=' + "'" + criteria.categoryId + "'"

        if (criteria.subcategoryId)
            condition += ' and find_in_set (subcategoryId ,' + "'" + criteria.subcategoryId + "')"

        if (criteria.craftId)
            condition += ' and find_in_set (craft ,' + "'" + criteria.craftId + "')"

        if (criteria.materialId)
            condition += ' and find_in_set (material ,' + "'" + criteria.materialId + "')"

        if (criteria.price) {
            let priceArr = {}
            priceArr = criteria.price.split(',')
            condition += ' and amount between ' + "'" + priceArr[0] + "'" + 'and' + "'" + priceArr[1] + "'"
        }

        if (criteria.subsubcategoryId)
            condition += ' and find_in_set (subsubcategoryId ,' + "'" + criteria.subsubcategoryId + "')"

        if (criteria.sortBy) {
            if (criteria.sortBy === '1')
                condition += 'order by amount '

            if (criteria.sortBy === '2')
                condition += 'order by amount desc'
        }

        // getting live product
        if (criteria.plive === '1') {
            return new Promise((resolve, reject) => {
                const query = `select id,name,amount,description,plive,inventoryQty,ideal,subsubcategoryId,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty>'0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

                // console.log("query===", query)

                knex.raw(query).then((res) => {
                    const res2 = util.nullRemove(res[0]);
                    resolve(res2)
                }).catch((err) => reject(err));
            })
        }

        // getting Non-live product
        if (criteria.plive === '0') {
            return new Promise((resolve, reject) => {
                const query = `select id,name,amount,description,plive,inventoryQty,ideal,subsubcategoryId,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty='0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

                // console.log("query==",query)

                knex.raw(query).then((res) => {
                    const res2 = util.nullRemove(res[0]);
                    resolve(res2)
                }).catch((err) => reject(err));
            })
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

// const getCategoryProduct = async (criteria, plive) => {

//     // console.log("criteria===", criteria)

//     if (!criteria.limit) criteria.limit = 10
//     if (!criteria.offset) criteria.offset = 0

//     try {

//         let condition = ' and categoryId=' + "'" + criteria.categoryId + "'"

//         if (criteria.subcategoryId)
//             condition += ' and find_in_set (subcategoryId ,' + "'" + criteria.subcategoryId + "')"

//         if (criteria.craftId)
//             condition += ' and find_in_set (craft ,' + "'" + criteria.craftId + "')"

//         if (criteria.materialId)
//             condition += ' and find_in_set (material ,' + "'" + criteria.materialId + "')"

//         if (criteria.price) {
//             let priceArr = {}
//             priceArr = criteria.price.split(',')
//             condition += ' and amount between ' + "'" + priceArr[0] + "'" + 'and' + "'" + priceArr[1] + "'"
//         }

//         if (criteria.sortBy) {
//             if (criteria.sortBy === '1')
//                 condition += 'order by amount '

//             if (criteria.sortBy === '2')
//                 condition += 'order by amount desc'
//         }

//         // getting live product
//         if (plive === '1') {
//             return new Promise((resolve, reject) => {
//                 const query = `select id,name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty>'0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

//                 // console.log("query===", query)

//                 knex.raw(query).then((res) => {
//                     const res2 = util.nullRemove(res[0]);
//                     resolve(res2)
//                 }).catch((err) => reject(err));
//             })
//         }

//         // getting Non-live product
//         if (plive === '0') {
//             return new Promise((resolve, reject) => {
//                 const query = `select id,name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty='0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

//                 // // console.log("query==",query)

//                 knex.raw(query).then((res) => {
//                     const res2 = util.nullRemove(res[0]);
//                     resolve(res2)
//                 }).catch((err) => reject(err));
//             })
//         }
//     } catch (e) {
//         return Promise.reject(e.toString())
//     }
// }
const getProductDetails = async (productId) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `select id,name as productName,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,
            (CASE WHEN vendorName IS NULL THEN (SELECT NAME FROM artisan_details WHERE userId=p.userId) ELSE vendorName END) AS ArtisanName,categoryId,subcategoryId,doableQty
                        from products as p where deleted='1' and publish='1' and id='${productId}' and verified='1'`;
            knex.raw(query).then((res) => {
                // const res2 = util.nullRemove(res[0]);
                const res2 = res[0];
                resolve(res2[0])
            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getCategoryBanner = async (criteria) => {
    try {
        if (criteria.categoryId) {
            if (criteria.subcategoryId) {
                const res = await knex('category').select('title', 'banner_image as banner')
                    .where('isActive', '=', 1)
                    .where('id', '=', criteria.subcategoryId)
                return util.nullRemove(res[0]);
            } else {
                const res = await knex('category').select('title', 'banner_image as banner')
                    .where('isActive', '=', 1)
                    .where('id', '=', criteria.categoryId)
                return util.nullRemove(res[0]);
            }
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getProductImages = async (productId, limit) => {
    try {
        if (limit === 1) {
            const res = await ProductImage.query()
                .select('id', 'image')
                .where('isActive', '1')
                .where('productId', productId)
                .limit(limit)
            if(res.length)
                return res[0]['image'];
            else
                return "";
        } else {

            const res = await ProductImage.query()
                .select('id', 'image')
                .where('isActive', '1')
                .where('productId', productId)

            return util.nullRemove(res);
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getEnquiry = async (userId) => {

    try {

        const res = await Enquiries.query()
            .alias('c')
            .join('products as p', 'c.productId', 'p.id')
            .select('c.id', 'c.uniqueId', 'p.name', 'c.description', 'c.qty', 'c.expPrice', 'p.image')
            .where('c.isActive', '=', 1)
            .where('p.isActive', '=', 1)
            .where('c.userId', '=', userId)

        return Promise.resolve(res)
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getonBoarding = async () => {
    try {
        var res = await knex('onboarding').where({ isActive: 1 }).where({ type: 'web' }).orderBy('id', 'desc')
        //   // console.log("res===",res)
        return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const subscribe = async (data) => {
    try {

        await knex('subscribe').insert({ email: data.email })

        // let sendData={};
        // sendData['email']=data.email;
        // sendData['subject']='Thank You For Subscribing! Lal10 Newsletter';
        // sendData['html']="Dear User,<br> Thank You For Subscribing! Lal10 Newsletter";
        // util.sendReceiptMail(sendData);


        // let userData=await web_dao.getUserdetails(user[0].id);
        // // console.log("userData",userData)
        let sendData={};
        // sendData['email']="rajpaltechugo@gmail.com";
        sendData['email']=data.email;
        sendData['subject']='Thank you for subscribing to Lal10 Newsletter!';
        sendData['html']='<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
        sendData['html']+='<div><table><tr><br><br></tr><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /><tr><td></center>';
        sendData['html']+='<center>Thank you for subscribing to our periodic newsletter,<br> ';
        sendData['html']+='<br>You will be the first to know about our new product collections, website updates, and all our best offers and promotions.<br>';
        sendData['html']+='<br><a href="https://lal10.com/products/liveshop"><input type="button" class="button" value="Shop Now"></a><br><br>Happy Sourcing!</center></table></div></body></html>';

        util.sendReceiptMail(sendData);

        return

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getBrand = async (data) => {
    try {
        let res = await knex('brand').where({ isActive: 1 })
        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getBanner = async (data) => {
    try {
        let res = await knex('cms').where({ isActive: 1 }).where({ viewType: 'web' }).where({ type: 'Banner' })
        return util.nullRemove(res);
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const gettingOptions = async (type) => {
    // // console.log("type==",type)
    try {
        const res = await Options.query()
            .select('id', 'name as title', 'image')
            .where('isActive', '1')
            .where('type', type)
        return util.nullRemove(res);
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const sendEnquiryWithoutLogin = async (criteria) => {
    try {

        let ids;
        const checkEmail = await knex('users').where('isActive', '1').where('email', criteria.email)

        if (checkEmail.length) {

            const checkMobile = await knex('users').where('isActive', '1').where('mobile', criteria.mobile)

            if (checkMobile.length){
                await enquiryCommonMethod(criteria, checkMobile[0].id)
            }else{
                await enquiryCommonMethod(criteria, checkEmail[0].id)
            }

        }

        // else {
        //     const checkMobile = await knex('users')
        //         .where('isActive', '1')
        //         .where('mobile', criteria.mobile)
        //     if (checkMobile.length)
        //         await enquiryCommonMethod(criteria, checkMobile[0].id)
        //     else {
        //         const newUserId = await knex('users').insert({ email: criteria.email, mobile: criteria.mobile, type: 'website', isActive: '1' })
        //         await knex('user_details').insert({ name: criteria.name,name2: criteria.name2, userId: newUserId[0] })
        //         await knex('store').insert({ store: criteria.store, userId: newUserId[0] })
        //         await enquiryCommonMethod(criteria, newUserId[0])
        //     }
        // }

        ids=checkEmail[0].id;

        let userData=await getUserdetails(ids);
        let sendData={};
        sendData['email']=userData.email;
        sendData['subject']='Thank you for placing an enquiry on Lal10!';
        sendData['html']='<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
        sendData['html']+='<div><table><tr><br><br></tr><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /><tr><td></center>';
        sendData['html']+='<center><h2>Hi '+ userData.name + ' ' + userData.name2 +'<br><br>Thank you for placing an enquiry on Lal10!</h2><h3>You can check the status of your enquiry in the <a href="https://lal10.com/sendEnquiry">My Enquiries section</a> of your account.</h3><h3>Make sure to subscribe to our email newsletter to keep receiving regular updates on our newproduct collections, offers, and promotions<br><br>';
        sendData['html']+='<a href="https://lal10.com/api/v2/web/subscribe2?email='+userData.email+'"><input type="button" class="button" value="Subscribe"></a><br><br>Happy Sourcing!</h3></center></table></div></body></html>';
        util.sendReceiptMail(sendData);

        return ;

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const enquiryCommonMethod = async (criteria, userId) => {
    try {
        const uniqueId = await util.getUniqueCode('ENQUIRY-', 'enquiries', 'uniqueId');

        const enqId = await knex('enquiries').insert({
            title: criteria.productName, description: criteria.description,
            typeOfEnquiry: '3', userId: userId, uniqueId: uniqueId
        })

        if (criteria.attachment) {
            const updateImageQuery = []
            for (i = 0; i < criteria.attachment.length; i++) {
                let temp = {
                    enqId: enqId,
                    attachment: criteria.attachment[i],
                }
                updateImageQuery.push(temp)
            }
            await knex('enquiry_attachment').insert(updateImageQuery)
        }

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const masterSearch = async (criteria, plive) => {

    // // console.log("criteria==",criteria)

    if (!criteria.limit) criteria.limit = 10
    if (!criteria.offset) criteria.offset = 0
    try {

        // let condition ='and categoryId=' + "'" + criteria.categoryId + "'"
        // let condition='AND (p.name LIKE '+ "'%" +criteria.search  + "%'COLLATE utf8_general_ci " +' OR title LIKE '+ "'%" +criteria.search+ "%'COLLATE utf8_general_ci"+')'

        let condition = 'AND (LOWER(p.name) LIKE LOWER(' + "'%" + criteria.search + "%')" + ' OR title LIKE LOWER(' + "'%" + criteria.search + "%')" + ' OR searchTags LIKE LOWER(' + "'%" + criteria.search + "%')" + ')'

        // getting live product
        if (plive === '1') {
            return new Promise((resolve, reject) => {
                const query = `SELECT p.id,p.name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,
        craft,material,(SELECT image FROM productImage WHERE isActive='1' AND productId=p.id LIMIT 1) AS image,categoryId,subcategoryId ,
        title AS categoryName FROM products AS p  JOIN category AS c ON p.categoryId=c.id WHERE p.deleted='1' AND c.deleted='1'  AND publish='1' AND p.verified='1'
        AND inventoryQty>'0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

                // console.log("query==plive", query)
                knex.raw(query).then((res) => {
                    const res2 = util.nullRemove(res[0]);
                    resolve(res2)
                }).catch((err) => reject(err));
            })
        }

        // getting Non-live product
        if (plive === '0') {
            return new Promise((resolve, reject) => {
                const query = `SELECT p.id,p.name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,
            craft,material,(SELECT image FROM productImage WHERE isActive='1' AND productId=p.id LIMIT 1) AS image,categoryId,subcategoryId ,
            title AS categoryName FROM products AS p  JOIN category AS c ON p.categoryId=c.id WHERE p.deleted='1' AND c.deleted='1'  AND publish='1' AND p.verified='1' AND inventoryQty='0'
            ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

                // // console.log("query=NON=plive",query)

                knex.raw(query).then((res) => {
                    const res2 = util.nullRemove(res[0]);
                    resolve(res2)
                }).catch((err) => reject(err));
            })
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const addToCart = async (criteria) => {
    // // console.log("criteria===",criteria)
    try {
        const productGlobalQtyCheck = await knex('products')
            .select('id', 'name', 'amount', 'inventoryQty')
            .where('isActive', '1')
            .where('deleted', '1')
            .where('verified', '1')
            .where('publish', '1')
            .where('id', criteria.productId)

        // console.log("productGlobalQtyCheck==", productGlobalQtyCheck)
        // checking  given qty less than global qty
        if (criteria.qty < productGlobalQtyCheck[0].inventoryQty){

            // live cart check
            const productCartQtyCheck = await knex('cart').select('id', 'qty')
                        .where('isActive', '1')
                        .where('deleted', '1')
                        .where('type', '0')
                        .where('userId', criteria.userId)
                        .where('productId', criteria.productId)
            //

            // console.log("productCartQtyCheck==", productCartQtyCheck)

            // checking given product Id exist in Cart or not
            if (productCartQtyCheck.length) {

                // adding Cart live qty + given qty
                const qty = Number(productCartQtyCheck[0].qty) + Number(criteria.qty);

                // console.log("(qty", qty)
                // compare
                if (qty <= productGlobalQtyCheck[0].inventoryQty) {

                    // console.log("live Cart Update if condition")

                    // live cart update
                    await knex('cart').update({ qty: qty }).where({ id: productCartQtyCheck[0].id })

                } else {

                    const remingQty = Number(qty) - Number(productGlobalQtyCheck[0].inventoryQty);

                    // console.log(" live Cart Update else condition ",remingQty)

                    // live cart update
                    await knex('cart').update({ qty: productGlobalQtyCheck[0].inventoryQty }).where({ id: productCartQtyCheck[0].id })

                    // Enq cart add
                    const productCartQtyCheck2 = await knex('cart')
                        .select('id', 'qty')
                        .where('isActive', '1')
                        .where('deleted', '1')
                        .where('type', '1')
                        .where('userId', criteria.userId)
                        .where('productId', criteria.productId)


                    if (productCartQtyCheck2.length) {

                        // console.log("productCartQtyCheck2==", productCartQtyCheck2)

                        const qty2 = Number(remingQty) + Number(productCartQtyCheck2[0].qty);

                        // Enq cart update
                        await knex('cart').update({ qty: qty2 }).where({ id: productCartQtyCheck2[0].id })

                    } else {
                        // Enquiry cart add
                        const uniqueId = await util.getUniqueCode('CART-', 'cart', 'uniqueId');

                        await knex('cart').insert({
                            uniqueId: uniqueId, userId: criteria.userId, qty: remingQty,
                            productId: criteria.productId, type: '1'
                        })
                    }
                }

            } else {

                // console.log("LIVECart Data save")

                const uniqueId = await util.getUniqueCode('CART-', 'cart', 'uniqueId');
                await knex('cart').insert({
                    uniqueId: uniqueId, userId: criteria.userId, qty: criteria.qty,
                    productId: criteria.productId, type: '0'
                })
            }

        } else {

            await saveEnqCartData(criteria, productGlobalQtyCheck)

        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const saveEnqCartData = async (criteria, productGlobalQtyCheck) => {

    try {
        // live cart check
        const productCartQtyCheck = await knex('cart').select('id', 'qty')
            .where('isActive', '1')
            .where('deleted', '1')
            .where('type', '0')
            .where('userId', criteria.userId)
            .where('productId', criteria.productId)


        // console.log("productCartQtyCheck== saveEnqCartData", productCartQtyCheck)

        // checking given product exist in live Cart or not
        if (productCartQtyCheck.length) {

            // adding Cart live qty + given qty
            const qty = Number(productCartQtyCheck[0].qty) + Number(criteria.qty);

            // console.log("(qty", qty)

            // compare
            if (qty <= productGlobalQtyCheck[0].inventoryQty) {

                // console.log("live Cart Update if condition saveEnqCartData")

                // live cart update
                await knex('cart').update({ qty: qty }).where({ id: productCartQtyCheck[0].id })

            } else {

                const remingQty = Number(qty) - Number(productGlobalQtyCheck[0].inventoryQty);

                // console.log(" live Cart Update else condition saveEnqCartData")

                // live cart update
                await knex('cart').update({ qty: productGlobalQtyCheck[0].inventoryQty }).where({ id: productCartQtyCheck[0].id })

                // Enq cart add
                const productCartQtyCheck2 = await knex('cart')
                    .select('id', 'qty')
                    .where('isActive', '1')
                    .where('deleted', '1')
                    .where('type', '1')
                    .where('userId', criteria.userId)
                    .where('productId', criteria.productId)


                if (productCartQtyCheck2.length) {

                    // console.log("productCartQtyCheck2== saveEnqCartData", productCartQtyCheck2)

                    const qty2 = Number(remingQty) + Number(productCartQtyCheck2[0].qty);

                    // Enq cart update
                    await knex('cart').update({ qty: qty2 }).where({ id: productCartQtyCheck2[0].id })

                } else {

                    // Enquiry cart add
                    if (remingQty > 0) {
                        const uniqueId = await util.getUniqueCode('CART-', 'cart', 'uniqueId');

                        await knex('cart').insert({
                            uniqueId: uniqueId, userId: criteria.userId, qty: remingQty,
                            productId: criteria.productId, type: '1'
                        })
                    }
                }
            }

        } else {

            const remingQty = Number(criteria.qty) - Number(productGlobalQtyCheck[0].inventoryQty);

            // console.log("LIVECart Data save")

            if (productGlobalQtyCheck[0].inventoryQty > 0) {

                const uniqueId = await util.getUniqueCode('CART-', 'cart', 'uniqueId');
                await knex('cart').insert({
                    uniqueId: uniqueId, userId: criteria.userId, qty: productGlobalQtyCheck[0].inventoryQty,
                    productId: criteria.productId, type: '0'
                })
            }

            // Enq cart add
            const productCartQtyCheck2 = await knex('cart')
                .select('id', 'qty')
                .where('isActive', '1')
                .where('deleted', '1')
                .where('type', '1')
                .where('userId', criteria.userId)
                .where('productId', criteria.productId)


            if (productCartQtyCheck2.length) {

                // console.log("productCartQtyCheck2==", productCartQtyCheck2)

                const qty2 = Number(remingQty) + Number(productCartQtyCheck2[0].qty);

                // Enq cart update
                await knex('cart').update({ qty: qty2 }).where({ id: productCartQtyCheck2[0].id })

            } else {

                if (remingQty > 0) {
                // Enquiry cart add
                        const uniqueId = await util.getUniqueCode('CART-', 'cart', 'uniqueId');

                        await knex('cart').insert({
                            uniqueId: uniqueId, userId: criteria.userId, qty: remingQty,
                            productId: criteria.productId, type: '1'
                        })
                    }
            }

        }

    } catch (e) {
        return Promise.reject(e.toString())
    }
}



const saveEnqLiveCartData = async (criteria, remingQty) => {

    try {
        // Enq cart add
        const productCartQtyCheck2 = await knex('cart').select('id', 'qty')
            .where('isActive', '1')
            .where('deleted', '1')
            .where('userId', criteria.userId)
            .where('productId', criteria.productId)


        // console.log("productCartQtyCheck2==", productCartQtyCheck2)

        if (productCartQtyCheck2.length) {

            const qty = productCartQtyCheck2[0].qty + criteria.qty;

            // live cart update
            await knex('cart').update({ qty: qty }).where({ id: productCartQtyCheck[0].id })

        } else {

            // Enquiry cart add
            const uniqueId = await util.getUniqueCode('CART-', 'cart', 'uniqueId');

            await knex('cart').insert({
                uniqueId: uniqueId, userId: criteria.userId, qty: remingQty,
                productId: criteria.productId, type: '1'
            })

        }

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getCartData = async (userId, type) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT c.id,c.productId,p.name,c.qty,p.amount,c.uniqueId,c.description,IFNULL(c.expPrice,0) AS expPrice,p.doableQty,
            (SELECT image FROM productImage WHERE isActive='1' AND productId=p.id LIMIT 1) AS image
            FROM cart AS c  JOIN products AS p ON c.productId=p.id
            WHERE p.deleted='1' AND c.deleted='1' AND c.isActive='1' AND p.isActive='1' AND publish='1' AND verified='1' and c.userId='${userId}' and c.type='${type}'`;

            knex.raw(query).then((res) => {
                const res2 = res[0];
                // const res2 = util.nullRemove(res[0]);
                resolve(res2)
            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const removeCartData = async (criteria) => {
    let { id } = criteria
    // // console.log('criteria',criteria)
    try {
        await knex('cart')
            .update({ isActive: '0', deleted: '0' })
            .where({ id: id })
        return
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getProductInCart = async (criteria) => {
    let { id, userId } = criteria
    try {
        let res = await knex('cart').where('isActive', '1').where({ productId: id, userId: userId })

        // console.log("res======", res, "res.length==", res.length)

        return res.length;
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const updateCartData = async (criteria) => {
    let id = criteria.id
    delete criteria.id;

    try {
        // await knex('cart').update({qty: qty,description:description,expPrice:expPrice}).where('isActive','1').where({ id: id })

        await knex('cart').update(criteria).where({ 'isActive': '1', id: id, 'deleted': '1' })

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getUserdetails = async (userId) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT t1.id,t1.email,t1.mobile,t2.name, t2.name2 FROM users AS t1 JOIN user_details AS t2 ON t1.id=t2.userId WHERE t1.id='${userId}'`;
            knex.raw(query).then((res) => {
                const res2 = res[0];
                resolve(res2[0])
            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const sendEnquiry = async (criteria) => {
    try {

        const productsEnq = criteria.productsEnq;

        for(i=0;i<productsEnq.length;i++){

            const data =productsEnq[i];
            const postdata = {};

            let uniqueId = await util.getUniqueCode('ENQUIRY-','enquiries','uniqueId');

            let productData = await knex("products").select("name","sku","userId").where({id:data.productId})

            // console.log("productData",productData)

            postdata.productId = data.productId;
            postdata.title = productData[0].name;
            postdata.productSku = productData[0].sku;
            postdata.productSkuArtisanId = productData[0].userId;
            postdata.description = data.description;
            postdata.userId = criteria.userId;
            postdata.qty = data.qty;
            postdata.uniqueId = uniqueId;
            postdata.typeOfEnquiry = '3';

            if (data.expPrice)
                postdata.expPrice = data.expPrice;

            let EnqId=await Enquiries.query().insert(postdata)

            let images = await getProductImages(data.productId,2);

            if (images.length) {

                const updateImageQuery = []

                for (j = 0; j < images.length; j++) {
                    let temp = {
                        enqId: EnqId.id,
                        attachment: images[j].image,
                    }
                    updateImageQuery.push(temp)
                }

                await knex('enquiry_attachment').insert(updateImageQuery)
            }

            // console.log("data",EnqId)

            await knex('cart').update({ isActive: '0', deleted: '0' }).where({ id: data.id })

            let userData=await getUserdetails(criteria.userId);
            // console.log("userData",userData)
            let sendData={};
            // sendData['email']="rajpaltechugo@gmail.com";
            sendData['email']=userData.email;
            sendData['subject']='Thank you for placing an enquiry on Lal10!';
             sendData['html']='<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
            sendData['html']+='<div><table><tr><br><br></tr><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /><tr><td></center>';
            sendData['html']+='<center><h2>Hi '+ userData.name + ' ' + userData.name2 +'<br><br>Thank you for placing an enquiry on Lal10!</h2><h3>You can check the status of your enquiry in the <a href="https://lal10.com/sendEnquiry">My Enquiries</a> section of your account.</h3><h3>Make sure to subscribe to our email newsletter to keep receiving regular updates on our newproduct collections, offers, and promotions<br><br>';
            sendData['html']+='<a href="https://lal10.com/api/v2/web/subscribe2?email='+userData.email+'"><input type="button" class="button" value="Subscribe"></a><br><br>Happy Sourcing!</h3></center></table></div></body></html>';
            util.sendReceiptMail(sendData);

        }

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const checkUserCart = async (criteria) => {

    try {

        const res = await knex('cart')
            .where('isActive', '1')
            .where('deleted', '1')
            .where({ userId: criteria.userId })


        if (res.length) {
            // redirect to cart page
            const redirect = '1'
            return redirect
        } else {
            // redirect to home page
            const redirect = '0'
            return redirect
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getLastEnquiry = async (criteria) => {
    try {
        const res = await knex('enquiries')
            .select('uniqueId')
            .where('isActive', '1')
            .where('deleted', '1')
            .where({ userId: criteria.userId })
            .orderBy('id', 'desc')


        return res[0].uniqueId

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

// const addAddress = async (criteria) => {
//     try {

//         const res=await knex('address').where({userId:criteria.userId,addressType:criteria.addressType})

//         if(res.length)
//             await knex('address').update(criteria).where({id:res[0].id})
//         else
//             await knex('address').insert(criteria)

//     } catch (e) {
//     return Promise.reject(e.toString())
//     }
// }


const addAddress = async (criteria) => {
    try {
        if (criteria.id) {
            await knex('address').update(criteria).where({ id: criteria.id })
        } else {
            await knex('address').insert(criteria)
        }


    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getAddress = async (userId) => {
    try {

        let result = await knex('address').where({ userId: userId });
        return util.nullRemove(result);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const addCardData = async (criteria) => {
    try {

        const res = await knex('card').where({ userId: criteria.userId, cardNo: criteria.cardNo })

        if (res.length)
            await knex('card').update(criteria).where({ id: res[0].id })
        else
            await knex('card').insert(criteria)

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getCardData = async (userId) => {
    try {

        let result = await knex('card').join('products').where({ userId: userId });

        return util.nullRemove(result);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const removeData = async (criteria) => {

    try {

        if (criteria.type === 'address')
            await knex('address').where({ id: criteria.id, userId: criteria.userId }).del();

        if (criteria.type === 'card')
            await knex('card').where({ id: criteria.id, userId: criteria.userId }).del();

    } catch (e) {

        return Promise.reject(e.toString())

    }
}

const editPersonalDetails = async (criteria, userId) => {
    try {

        await knex('user_details').update({ name: criteria.name, name2: criteria.name2 }).where({ userId: userId })

        return Promise.resolve("success")
    } catch (e) {

        return Promise.reject(e.toString())

    }
}

const editBussinessDetails = async (criteria, userId) => {
    try {

        if (criteria.store)
            await knex('store').update({ store: criteria.store }).where({ userId: userId })

    } catch (e) {

        return Promise.reject(e.toString())

    }
}


const viewProfileDetails = async (userId) => {
    try {

        let result = await knex('users as u')
            .join('user_details as ud', 'u.id', 'ud.userId')
            .join('store as s', 'u.id', 's.userId')
            .select('s.store', 'ud.name', 'ud.name2', 'u.id', 'mobile', 'email', 'profileImage')
            .where('u.id', userId)
            .where('isActive', '1')
            .where('deleted', '1')
        return util.nullRemove(result);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const profileImage = async (criteria) => {

    try {
        await knex('user_details').update({ profileImage: criteria.profileImage }).where({ userId: criteria.userId })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getliveShop = async (criteria) => {

    if (!criteria.limit) criteria.limit = 10
    if (!criteria.offset) criteria.offset = 0

    try {

        let condition = ' and 1=1 ';

        if (criteria.categoryId)
                condition += ' and find_in_set (categoryId ,' + "'" + criteria.categoryId + "')"
                // condition += ' and categoryId=' + "'" + criteria.categoryId + "'"

        if (criteria.subcategoryId)
            condition += ' and find_in_set (subcategoryId ,' + "'" + criteria.subcategoryId + "')"

        if (criteria.craftId)
            condition += ' and find_in_set (craft ,' + "'" + criteria.craftId + "')"

        if (criteria.materialId)
            condition += ' and find_in_set (material ,' + "'" + criteria.materialId + "')"

        if (criteria.price) {
            let priceArr = {}
            priceArr = criteria.price.split(',')
            condition += ' and amount between ' + "'" + priceArr[0] + "'" + 'and' + "'" + priceArr[1] + "'"
        }

        if (criteria.sortBy) {
            if (criteria.sortBy === '1')
                condition += 'order by amount '

            if (criteria.sortBy === '2')
                condition += 'order by amount desc'
        }

        return new Promise((resolve, reject) => {

            const query = `select id,name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty>'0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;
            // console.log("query==",query)
            knex.raw(query).then((res) => {
                const res2 = util.nullRemove(res[0]);
                resolve(res2)
            }).catch((err) => reject(err));
        })

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


// const getCategoryProduct = async (criteria, plive) => {

//     // console.log("criteria===", criteria)

//     if (!criteria.limit) criteria.limit = 10
//     if (!criteria.offset) criteria.offset = 0

//     try {

//         let condition = ' and categoryId=' + "'" + criteria.categoryId + "'"

//         if (criteria.subcategoryId)
//             condition += ' and find_in_set (subcategoryId ,' + "'" + criteria.subcategoryId + "')"

//         if (criteria.craftId)
//             condition += ' and find_in_set (craft ,' + "'" + criteria.craftId + "')"

//         if (criteria.materialId)
//             condition += ' and find_in_set (material ,' + "'" + criteria.materialId + "')"

//         if (criteria.price) {
//             let priceArr = {}
//             priceArr = criteria.price.split(',')
//             condition += ' and amount between ' + "'" + priceArr[0] + "'" + 'and' + "'" + priceArr[1] + "'"
//         }

//         if (criteria.sortBy) {
//             if (criteria.sortBy === '1')
//                 condition += 'order by amount '

//             if (criteria.sortBy === '2')
//                 condition += 'order by amount desc'
//         }

//         // getting live product
//         if (criteria.plive === '1') {
//             return new Promise((resolve, reject) => {
//                 const query = `select id,name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty>'0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

//                 // console.log("query===", query)

//                 knex.raw(query).then((res) => {
//                     const res2 = util.nullRemove(res[0]);
//                     resolve(res2)
//                 }).catch((err) => reject(err));
//             })
//         }

//         // getting Non-live product
//         if (criteria.plive === '0') {
//             return new Promise((resolve, reject) => {
//                 const query = `select id,name,amount,description,plive,inventoryQty,ideal,(CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive,craft,material,(select image from productImage where isActive='1' and productId=p.id limit 1) as image,categoryId,subcategoryId from products as p where deleted='1' and publish='1' and verified='1' and inventoryQty='0' ${condition} limit ${criteria.limit} offset ${criteria.offset}`;

//                 // // console.log("query==",query)

//                 knex.raw(query).then((res) => {
//                     const res2 = util.nullRemove(res[0]);
//                     resolve(res2)
//                 }).catch((err) => reject(err));
//             })
//         }
//     } catch (e) {
//         return Promise.reject(e.toString())
//     }
// }

const getEnquiryList = async (userId) => {

    try {
        return new Promise((resolve, reject) => {
            const query = `select id,uniqueId,productId,update_status,
            (SELECT name FROM products WHERE isActive='1' AND id=enquiries.productId) as title,description,qty,expPrice,isGenrate, (SELECT image FROM productImage WHERE isActive='1' AND productId=enquiries.productId LIMIT 1) AS image,created_at from enquiries where deleted='1' and isActive='1' and status='0' and productId!='' and userId='${userId}'`;

            // console.log("query===", query)

            knex.raw(query).then((res) => {
                const res2 = util.nullRemove(res[0]);
                resolve(res2)
            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const trackEnquiry = async (criteria) => {

    try {
        return new Promise((resolve, reject) => {

            const query = `select id,uniqueId,productId,(SELECT name FROM products WHERE isActive='1' AND id=enquiries.productId) as title,
            description,qty,expPrice,isGenrate, update_status,
            (SELECT image FROM productImage WHERE isActive='1' AND productId=enquiries.productId LIMIT 1) AS image,created_at as created_at2,
            created_at from enquiries where deleted='1' and isActive='1' and status='0' and productId!='' and userId='${criteria.userId}' and id='${criteria.EnqId}'`;

            // console.log("query===", query)

            knex.raw(query).then((res) => {
                const res2 = util.nullRemove(res[0]);

                if (res2.length)
                    resolve(res2[0])
                else
                    resolve()
            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const userVerify = async (link) => {
    try {

        const check = await knex('users').where('verifyLink', link).where('verifyLinkUsed', '0').where('deleted', '1')

        if (check.length) {
            await knex('users').update({ verifyLinkUsed: '1',is_verified:'1' }).where({ id: check[0].id })
            return 1;  // success
        } else {
            return 0; //expire
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getOrderList = async (userId) => {

    try {
        return new Promise((resolve, reject) => {
            let condition = " "
            if(userId){
                condition = ` AND t1.userId='${userId}' `
            }

            // const query = `SELECT razorpayOrderId,razorpayPaymentId,addressId,productName,productPrice as expPrice,productQty,orderUserId,orderUserName,
            // t2.id,t2.uniqueId,(SELECT name from user_details WHERE userId=t1.userId ORDER BY id DESC LIMIT 1) AS userName,
            // productId,orderStatus AS update_status,t2.name  AS title,description,qty,price AS expPrice,
            // (SELECT image FROM productImage WHERE isActive='1' AND productId=t1.productId LIMIT 1) AS image,t1.created_at,
            // FROM enquiries AS e JOIN enquiry_order AS eo ON e.id=eo.enqId  WHERE e.isActive='1' AND e.isGenrate='1'
            // AND eo.isActive='1' AND eo.orderAccept='1' AND orderType='1' and orderUserId=${userId}`;

            const query = `SELECT t1.id,t1.uniqueId,
            (SELECT name from products WHERE id=t1.productId) AS productName,
            (SELECT name from user_details WHERE userId=t1.userId ORDER BY id DESC LIMIT 1) AS userName,
            productId,orderStatus AS update_status,t2.name  AS title,description,qty,price AS expPrice,
            (SELECT image FROM productImage WHERE isActive='1' AND productId=t1.productId LIMIT 1) AS image,t1.created_at
            FROM websiteOrder  AS t1 JOIN products AS t2 ON t1.productId=t2.id WHERE t1.isActive='1'
            AND t2.isActive='1' AND t2.deleted='1' AND publish='1' AND verified='1' ${condition}`;


            // console.log("query===", query)

            knex.raw(query).then((res) => {
                const res2 = util.nullRemove(res[0]);

                resolve(res2)

            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const trackOrder = async (criteria) => {

    try {

        return new Promise((resolve, reject) => {

            const query = `SELECT t1.id,t1.uniqueId,productId,orderStatus AS update_status,t2.name  AS title,description,qty,price AS expPrice,
            (SELECT image FROM productImage WHERE isActive='1' AND productId=t1.productId LIMIT 1) AS image,t1.created_at,t1.created_at as  created_at2
            FROM websiteOrder  AS t1 JOIN products AS t2 ON t1.productId=t2.id WHERE t1.isActive='1'   AND t2.isActive='1' AND t2.deleted='1' AND publish='1' AND verified='1'
            AND t1.userId='${criteria.userId}' and t1.id='${criteria.EnqId}'`;

            // const query = `SELECT t1.id,t1.uniqueId,productId,orderStatus AS update_status,t2.name  AS title,description,qty,price AS expPrice,
            // (SELECT image FROM productImage WHERE isActive='1' AND productId=t1.productId LIMIT 1) AS image,t1.created_at,t1.created_at as  created_at2
            // FROM websiteOrder  AS t1 JOIN products AS t2 ON t1.productId=t2.id WHERE t1.isActive='1'   AND t2.isActive='1' AND t2.deleted='1' AND publish='1' AND verified='1'
            // and t1.id='${criteria.EnqId}'`;


            // console.log("query===", query)

            knex.raw(query).then((res) => {
                const res2 = util.nullRemove(res[0]);

                if (res2.length)
                    resolve(res2[0])
                else
                    resolve()
            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getFaq = async (criteria) => {

    try {

        let responce = await knex('cms')
            .select('id','description', 'title','link','name')
            .where({ type: 'Faq', viewType: 'web' })

        return util.nullRemove(responce);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const checkOut = async (criteria) => {
    // console.log("criteria===",criteria)
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT * from cart where isActive='1' and type='0' AND userId='${criteria.userId}' and find_in_set(id,'${criteria.ids}')`;
            knex.raw(query).then(async (res) => {
            const res2 = util.nullRemove(res[0]);
            if(res2.length === 1 ){
                let responce=[];
                let data=await checkProductGlobalQTY(res2[0]);
                responce.push(data)
                resolve(responce);

            }else{

                let promiseArr = [];
                    res2.forEach((element, i) => {
                        promiseArr.push(
                            new Promise(async (resolve, reject) => {
                                let responce=await checkProductGlobalQTY(element);
                                resolve(responce);
                            })
                        );
                    });

                Promise.all(promiseArr).then((values) => { resolve(values); });
            }

            }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const checkProductGlobalQTY = async (element) => {
    try {
        let data={},CheckGlobalQty;

        CheckGlobalQty = await knex('products')
            .where('isActive', '1')
            .where('deleted', '1')
            .where('verified', '1')
            .where('publish', '1')
            .where('id', element.productId)


        if(element.qty <= CheckGlobalQty[0].inventoryQty){
        // Cart product QTY less then or Equal to global invertry qty
            data.code=1;
            data.id=element.id;
            data.ProductName=CheckGlobalQty[0].name;
            return data;

        }else{

            // Cart product QTY exceed to global invertry qty
            data.code=0;
            data.id=element.id;
            data.ProductName=CheckGlobalQty[0].name;
            return data;
        }

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const OrderPlace = async (criteria) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT * from cart where isActive='1' and type='0' AND userId='${criteria.userId}' and find_in_set(id,'${criteria.ids}')`;

            knex.raw(query).then(async (res) => {
            const res2 = util.nullRemove(res[0]);

            if(res2.length === 1 ){

                let responce=[];
                let data=await saveWebsiteOrder(res2[0],criteria);
                responce.push(data)
                resolve(responce);

            }else{

                for(i=0;i<res2.length;i++){
                    let responce=await saveWebsiteOrder(res2[i],criteria);
                    resolve(responce);
                }
            }

        let userData=await getUserdetails(criteria.userId);
        let sendData={};
        sendData['email']=userData.email;
        sendData['subject']='Thank you for ordering on Lal10!';
         sendData['html']='<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
        sendData['html']+='<div><table><tr><br><br></tr><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /><tr><td></center>';
        sendData['html']+='<center><h2>Hi '+ userData.name + ' ' + userData.name2 +'<br><br>Thank you for placing your order on Lal10!</h2><h3>You can check the status of your order in the <a href="https://lal10.com/sendEnquiry">My Orders</a> section of your account.We have also attached the invoice for your order along with this email.</h3>';
        sendData['html']+='Make sure to subscribe to our email newsletter to keep receiving regular updates on our new product collections, offers, and promotions<br><br>';
        sendData['html']+='<a href="https://lal10.com/api/v2/web/subscribe2?email='+userData.email+'"><button class="button">Subscribe</button></a><br><br>Happy Sourcing!</center></table></div></body></html>';
        util.sendReceiptMail(sendData);

           }).catch((err) => reject(err));
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const saveWebsiteOrder = async (data,request) => {
    try {

        let saveOrderData={},checkproductId,uniqueId;
        checkproductId = await knex('products').where({ id:data.productId})

        if(checkproductId.length){

            // uniqueId = await util.getUniqueCode("ORDER-","websiteOrder","uniqueId");
            let uniqueId = await util.getUniqueCode('ORDERID-','enquiry_order','uniqueId');

            data.uniqueId=uniqueId;

            saveOrderData.productId=data.productId;
            saveOrderData.userId=request.userId;
            saveOrderData.uniqueId = uniqueId;
            saveOrderData.addressId=request.addressId;
            saveOrderData.qty=data.qty;
            saveOrderData.price=(data.qty)*(checkproductId[0].amount);
            saveOrderData.razorpayOrderId=request.razorpayOrderId;
            saveOrderData.razorpayPaymentId=request.razorpayPaymentId;
            saveOrderData.signature=request.signature;


            await knex('websiteOrder').insert(saveOrderData)

            let checkproductQTY=await knex('products').where({id:data.productId})

            if(checkproductQTY.length){
                    let qty=checkproductQTY[0].inventoryQty-data.qty
                    await knex('products').update({inventoryQty:qty}).where({id:data.productId})
                }
            await knex('cart').update({isActive:'0',deleted:'0',orderPlace:'1'}).where({id:data.id})
            await orderPlaceEnquiry(data,request,checkproductQTY)
            saveOrderData.totalOrderPrice=request.totalPrice;
        }
        return saveOrderData;
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const orderPlaceEnquiry = async (data,request,checkproductId) => {
    try{

        // console.log("checkproductId",checkproductId)

        let postdata={};

        let EnquniqueId = await util.getUniqueCode('ENQUIRY-','enquiries','uniqueId');

        postdata.productId = data.productId;
        postdata.userId = request.userId;
        postdata.qty = data.qty;
        postdata.uniqueId = EnquniqueId;
        postdata.typeOfEnquiry = '3';
        postdata.isGenrate = '1';
        postdata.expPrice = data.expPrice;

        let EnqId=await knex('enquiries').insert(postdata)
        let images = await getProductImages(data.productId,2);

        if (images.length){
            const updateImageQuery = []
            for (j = 0; j < images.length; j++) {
                let temp = {
                    enqId: EnqId[0],
                    attachment: images[j].image,
                }
                updateImageQuery.push(temp)
            }
            await knex('enquiry_attachment').insert(updateImageQuery)
        }

    let userDetails=await knex('user_details').where({userId:request.userId})

    let postdata2={}
       // let orderuniqueId = await util.getUniqueCode('ORDERID-','enquiry_order','uniqueId');
        postdata2.enqId = EnqId[0];
        postdata2.assignUserId = checkproductId[0].userId;
        postdata2.adminAssign = '1';
        postdata2.uniqueId = data.uniqueId;
        postdata2.orderAccept = '1';
        postdata2.created_by = checkproductId[0].userId;
        postdata2.orderType='1'
        postdata2.productPrice=(data.qty)*(checkproductId[0].amount);
        postdata2.razorpayOrderId=request.razorpayOrderId;
        postdata2.razorpayPaymentId=request.razorpayPaymentId;
        postdata2.signature=request.signature;
        postdata2.productName=checkproductId[0].name;
        postdata2.productQty=data.qty;
        postdata2.addressId=request.addressId;
        postdata2.orderUserId=request.addressId;
        postdata2.orderUserName=(userDetails[0].name + ' ' +userDetails[0].name2);

        // console.log("postdata2",postdata2)
        await knex('enquiry_order').insert(postdata2)

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getNewsFeed = async () => {
    try {
        let responce = await knex('newsfeed')
            .select('id', 'description', 'title', 'image','url')
            .where({ type: 'web',isActive:'1',isPublished:'1'})

        return util.nullRemove(responce);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getExhibitionBanner = async () => {
    try {
        let responce = await knex('cms')
            .select('id', 'description', 'title','link','subtitle')
            .where({ type: 'Exhibition', isActive:'1', deleted:'1'})


        return util.nullRemove(responce);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const bestsellingProduct = async () => {
    try {
        let responce = await knex('products')
            .select('*')
            .where({ addingBestselling: 1, isActive: '1', deleted: '1', verified: '1',publish:'1'}).limit(40)

            if(responce.length){
                for(i=0;i<responce.length;i++){
                    responce[i].image=await getProductImages(responce[i].id,1);
                }
            }
            // getProductImages
        return util.nullRemove(responce);

    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const worldManufacturing = async (data) => {
    try {
        let res = await knex('infographics').where({ isActive: 1,type:'Country'})
        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const servicingIndia = async (data) => {
    try {
        let res = await knex('infographics').where({ isActive: 1,type:'India'})
        return res
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const customerFeedback = async (data) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT name as customerName,link as image,description as feedback,title from cms where type='Testimonial'`;
                knex.raw(query).then(async (res) => {
                const res2 = util.nullRemove(res[0]);
                resolve(res2);
            })
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const serviceSector = async (data) => {
    try {
        // let res = await knex('cms').where({ isActive: 1 })
        // return res
        return new Promise((resolve, reject) => {
            const query = `SELECT title as industryName,description from cms where type='Industries'`;
                knex.raw(query).then(async (res) => {
                const res2 = util.nullRemove(res[0]);
                resolve(res2);
            })
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const exhibitionUserPost = async (data) => {
    try {
        await knex('user_exhibition').insert(data);

        let getdata=await knex('cms').where({id:data.exhibitionId});

        // console.log("getdata",getdata)

        // let sendData={};
        // sendData['email']=data.email;
        // sendData['subject']='Thank you for registering Lal10 Exhibition ';
        // sendData['html']="Dear " + data.name + ",<br> <br> Thank you for registering for Lal10 Exhibition : "  + getdata[0].title +"<br><br> About Exhibition:- <br> "+getdata[0].description;
        // util.sendReceiptMail(sendData);

        //  let userData=await web_dao.getUserdetails(user[0].id);
        //  // console.log("userData",userData)
         let sendData={};
         sendData['email']=data.email;
         sendData['subject']='Thank you for registering for Lal10’s Next Showcase!';
          sendData['html']='<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
         sendData['html']+='<table><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /></center>';
         sendData['html']+='<center>Thank you for registering for our next product showcase exhibition,' + data.name +'<br>';
         sendData['html']+='<br>We will be sending you the web conference link shortly on this email id.Make sure to subscribe to our email newsletter to keep receiving regular updates on our next product showcase, new collections, promotions, and offers.';
         sendData['html']+='<br>Make sure to subscribe to our email newsletter to keep receiving regular updates on our newproduct collections, offers, and promotions<br><br></br><a href="https://lal10.com/api/v2/web/subscribe2?email='+data.email+'"><input type="button" class="button" value="Subscribe"></a><br><br>Happy Sourcing!</center></table></body></html>';
         util.sendReceiptMail(sendData);


    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const updateLiveCartQty = async (criteria) => {
    let id = criteria.id
    delete criteria.id;

    try {
        await knex('cart').update(criteria).where({ 'isActive': '1', id: id, 'deleted': '1',type:'0' })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const aboutUs = async () => {
    try {
        let res=await knex('aboutUs').where({ 'isActive': '1'}).limit(1)
        if(res.length)
            return util.nullRemove(res[0]);
        else
        return {};
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getTeam = async () => {
    try {
        let res=await knex('ourTeam').where({ 'isActive': '1'})
        return util.nullRemove(res);
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const getBlogs = async () => {
    try {
        let res=await knex('blogs').where({ 'isActive': '1'})
        return util.nullRemove(res);
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const careers = async () => {
    try {
        let res=await knex('carrer').where({ 'isActive': '1'})
        return util.nullRemove(res);
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const returnPolicy = async () => {
    try {
        let res=await knex('refundPolicy').where({ 'isActive': '1'}).limit(1)
        if(res.length)
            return util.nullRemove(res[0]);
        else
            return {}
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const privacyPolicy = async () => {
    try {
        let res=await knex('privacyPolicy').where({ 'isActive': '1'}).limit(1)
        if(res.length)
            return util.nullRemove(res[0]);
        else
        return {}
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const sendResume = async (data) => {
    try {
        await knex('Resumes').insert(data)
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const indiaMap = async (data) => {
    try {
        let res=await knex('infographics').where({isActive:'1',type:'India'})
        if(res.length)
            return util.nullRemove(res);
        else
            return {}
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getCustomerImportant = async (data) => {
    try {
        let res=await knex('customer_important_sample')
        if(res.length)
            return util.nullRemove(res);
        else
            return {}
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getAllsubcategory = async () => {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT id,title,image FROM category WHERE parentId!='1' and deleted='1' and isActive='1'`;
                knex.raw(query).then(async (res) => {
                const res2 = util.nullRemove(res[0]);
                resolve(res2);
            })
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

module.exports = {
    getAllsubcategory,
    getCustomerImportant,
    indiaMap,
    sendResume,
    privacyPolicy,
    returnPolicy,
    careers,
    getBlogs,
    aboutUs,
    getTeam,
    updateLiveCartQty,
    exhibitionUserPost,
    serviceSector,
    customerFeedback,
    servicingIndia,
    worldManufacturing,
    bestsellingProduct,
    checkUser,
    checkUserMobile,
    checkUserId,
    typeOfStore,
    addWebUser,
    getStore,
    addEditUserAdditionalDetails,
    editUserStore,
    editStoreAboutus,
    editStoreProduct,
    editUserStoreImportant,
    hearAboutUs,
    getProductList,
    forgotToken,
    checkPwdToken,
    changePassword,
    getCategory,
    getSubCategory,
    getSubSubCategory,
    getCategoryProduct,
    getProductDetails,
    getProductImages,
    getEnquiry,
    getonBoarding,
    subscribe,
    getBrand,
    getBanner,
    getCategoryBanner,
    gettingOptions,
    sendEnquiryWithoutLogin,
    enquiryCommonMethod,
    masterSearch,
    addToCart,
    sendEnquiry,
    getCartData,
    removeCartData,
    updateCartData,
    checkUserCart,
    getLastEnquiry,
    addAddress,
    getAddress,
    addCardData,
    getCardData,
    removeData,
    editPersonalDetails,
    editBussinessDetails,
    viewProfileDetails,
    profileImage,
    getProductInCart,
    getliveShop,
    getEnquiryList,
    trackEnquiry,
    userVerify,
    getOrderList,
    trackOrder,
    getFaq,
    checkOut,
    checkProductGlobalQTY,
    OrderPlace,
    saveWebsiteOrder,
    getNewsFeed,
    getExhibitionBanner,
    getUserdetails
}