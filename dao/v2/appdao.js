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
const Enquiries=require('../../models/Enquiries')
const ProductImage=require('../../models/ProductImage')
const Chat=require('../../models/Chat')
const moment= require('moment')
const _ = require("lodash");
const knex = require('../../db/knex')

const checkUser = async (criteria) => {
    const { email } = criteria
    try {
        const user = await Users.query()
                        .select('id','email')
                        .where('email', '=', email)
                        .where('role', '=', util.role('artisan'))
                        .where('isActive', '=', 1)
                        .where('isOtpVerified', '=', 1)
         return user
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const checkUserMobile = async (criteria) => {
    const { mobile } = criteria
    try {
        const user = await Users.query()
                        .select('id')
                        .where('mobile',mobile)
                        .where('role',util.role('artisan'))
                        .where('isActive','1')
                        .where('isOtpVerified','1')

         return user
    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const checkUserMobile2 = async (criteria) => {
    const { mobile } = criteria
    try {
        const user = await Users.query()
                        .select('id')
                        .where('mobile',mobile)
                        .where('role',util.role('artisan'))
                        .where('isOtpVerified','1')
                        .where('deleted','1')
         return user
    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const checkUserDeletedStatus= async (criteria) => {
    const { mobile } = criteria
    try {
        const user = await Users.query()
                        .select('id')
                        .where('mobile', mobile)
                        .where('role',util.role('artisan'))
                        .where('deleted','1')
         return user
    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const addDeviceToken = async (criteria) => {
    let { device_token,userId } = criteria

    try {
         await Users.query().update({appToken: device_token}).where({ id: userId });

         return
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

// const addUser = async (criteria) => {
//     let { role, isActive, mobile } = criteria
//     isActive =1
//     role=util.role('artisan')

//     try {
//         const user = await Users.query()
//                       .insert({ role, isActive, mobile,isOtpVerified:1 })

//         return Promise.resolve(user)

//     } catch (e) {
//          return Promise.reject(e.toString())
//     }
// }

// const addArtisan = async (criteria) => {
//     let { name, userId } = criteria

//     try {
//         const artisan = await Artisan.query()
//         .insert({ name,userId });

//         return Promise.resolve(artisan)
//     } catch (e) {
//        return Promise.reject(e.toString())
//     }
// }



const addUser = async (criteria) => {
    let { role, isActive, mobile } = criteria
    isActive =1
    role=util.role('artisan')

    try {
        const user = await knex('users').insert({ role, isActive, mobile,isOtpVerified:1 })

        return Promise.resolve(user)

    } catch (e) {
         return Promise.reject(e.toString())
    }
}

const addArtisan = async (criteria) => {
    let { name, userId } = criteria

    try {
        const artisan = await knex('artisan_details').insert(criteria)

        return Promise.resolve(artisan)
    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const chooseLanguages = async (criteria) => {
    let {userId,type,name }= criteria
    let isActive='1'
    try {
            await Options.query()
              .insert({ type, userId, name ,isActive });

       return;
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

            if(user!=''){
               return 1
            }else{
              return 0
            }
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const artisanPicuploads = async (criteria) => {
    let { userId, artisanProfile } = criteria


    try {
         await Artisan.query()
               .update({artisanImage: artisanProfile})
               .where({ userId: userId })

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const states = async (lang) => {
    try {
        let states;
        if(_.isEmpty(lang)){
            lang=""
        }

        if(lang==='en'||lang === "")
            states = await Options.query().select('id','name as title','image').where('isActive','1').where('type','state');

        if(lang==='bn')
            states = await Options.query().select('id','bangaliName as title','image').where('isActive','1').where('type','state');

        if(lang==='gu')
            states = await Options.query().select('id','gujratiName as title','image').where('isActive','1').where('type','state');

        if(lang==='hi')
            states = await Options.query().select('id','hindiName as title','image').where('isActive','1').where('type','state');

        return states;

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getCraftList = async (lang,stateId) => {
    try {

        if(_.isEmpty(lang)){
            lang=""
        }

        return new Promise((resolve, reject) => {
            let query;
            if(lang==='en'||lang === "")
               query = `SELECT id,name as title,image FROM options WHERE type='craft' AND isActive='1' AND find_in_set(${stateId},stateId)`;

               if(lang==='bn')
               query = `SELECT id,bangaliName as title,image FROM options WHERE type='craft' AND isActive='1' AND find_in_set(${stateId},stateId)`;

               if(lang==='gu')
               query = `SELECT id,gujratiName as title,image FROM options WHERE type='craft' AND isActive='1' AND find_in_set(${stateId},stateId)`;

               if(lang==='hi')
               query = `SELECT id,hindiName as title,image FROM options WHERE type='craft' AND isActive='1' AND find_in_set(${stateId},stateId)`;

            knex.raw(query).then((rows) => {

                resolve(rows[0])
            })
            .catch((err) => reject(err));
            });

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getMatrialList = async (lang,stateId) => {
    try {

        if(_.isEmpty(lang)){
            lang=""
        }

        return new Promise((resolve, reject) => {
            let query;
            if(lang==='en'||lang === "")
               query = `SELECT id,name as title,image FROM options WHERE type='material' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

               if(lang==='bn')
               query = `SELECT id,bangaliName as title,image FROM options WHERE type='material' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

               if(lang==='gu')
               query = `SELECT id,gujratiName as title,image FROM options WHERE type='material' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

               if(lang==='hi')
               query = `SELECT id,hindiName as title,image FROM options WHERE type='material' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

            knex.raw(query).then((rows) => {
                resolve(rows[0])
            })
            .catch((err) => reject(err));
            });

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getProductList = async (lang,stateId) => {

    try {

    if(_.isEmpty(lang)){
        lang=""
    }

    return new Promise((resolve, reject) => {
        let query;
        if(lang==='en'||lang === "")
           query = `SELECT id,name as title,image FROM options WHERE type='products' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

           if(lang==='bn')
           query = `SELECT id,bangaliName as title,image FROM options WHERE type='products' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

           if(lang==='gu')
           query = `SELECT id,gujratiName as title,image FROM options WHERE type='products' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

           if(lang==='hi')
           query = `SELECT id,hindiName as title,image FROM options WHERE type='products' AND isActive='1' AND find_in_set('${stateId}',stateId)`;

        knex.raw(query).then((rows) => {

            resolve(rows[0])
        })
        .catch((err) => reject(err));
        });

    } catch (e) {
      return Promise.reject(e.toString())
    }
}


const signUpStep2 = async (criteria) => {
    let { userId, kycImage,state } = criteria

    try {
         await Artisan.query()
             .update(criteria)
             .where({ userId: userId })

    } catch (e) {
       return Promise.reject(e.toString())
    }
}



// const signUpStep2 = async (criteria) => {
//     let { userId, kycImage,state } = criteria

//     try {
//          await Artisan.query()
//              .update({kycImage: kycImage,state:state})
//              .where({ userId: userId })

//     } catch (e) {
//        return Promise.reject(e.toString())
//     }
// }


const craftChoose = async (criteria) => {
    let userId = criteria.userId
    let craftArr = criteria.craft
    let type = 'UserCraft'
    let isActive='1'
    craftArr = craftArr.split(',');
    await Options.query().delete().where({ userId:userId,type:type })
    try {

        const craftPromises = craftArr.map(name => knex('options').insert({ type, userId, name ,isActive }))
        await Promise.all(craftPromises)
        // for(index=0;index<craftArr.length;index++){
        //     name=craftArr[index]
        //     await Options.query().insert({ type, userId, name ,isActive })
        // }

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const  materialChoose = async (criteria) => {
    let userId = criteria.userId
    let materialArr = criteria.material
    let type = 'UserMaterial'
    let isActive='1'
    materialArr = materialArr.split(',')

    await Options.query().delete().where({ userId:userId,type:type })
    try {

        const materialPromises = materialArr.map(name => knex('options').insert({ type, userId, name ,isActive }))
        await Promise.all(materialPromises)

        // for(index=0;index<materialArr.length;index++){
        //     name=materialArr[index]
        //     await Options.query().insert({ type, userId, name ,isActive })
        // }

    } catch (e) {
      return Promise.reject(e.toString())
    }
}


const productChoose = async (criteria) => {
    let userId = criteria.userId
    let productArr = criteria.product
    let type = 'UserProducts'
    let isActive='1'
    productArr = productArr.split(',');
    await Options.query().delete().where({ userId:userId,type:type })
    try {
        const productPromises = productArr.map(name => knex('options').insert({ type, userId, name ,isActive }))
        await Promise.all(productPromises)

        // for(index=0;index<productArr.length;index++){
        //     name=productArr[index]
        //     await Options.query().insert({ type, userId, name ,isActive })
        // }
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const findUser = async (criteria) => {
    let { userId } = criteria

    try {
        const res = await Users.query()
                    .alias('u')
                    .join('artisan_details as ad','u.id','userId')
                    .select('ad.userId','u.email','u.mobile','ad.artisanImage','kycImage','ad.state','ad.name')
                    .where('u.id','=',userId)
                    .where('u.isActive', '=',1)
                    .where('u.role', '=',util.role('artisan'))

        return util.nullRemove(res)
    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getUserCMPDetails =  (criteria, cb) => {
    let { userId ,type } = criteria
    try {
        return new Promise((resolve, reject) => {
            let query = `SELECT id,name as title FROM options WHERE  id IN( SELECT  name FROM options WHERE type='${type}'AND isActive='1' AND userId='${userId}')`;
            knex.raw(query).then((rows) => {
                resolve(rows[0])
            })
            .catch((err) => reject(err));
            });

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const editArtisanDetails = async (criteria) => {
    let { userId,artisanImage } = criteria
    try {
        await Artisan.query().update({artisanImage: artisanImage}).where({ userId: userId })
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const editArtisan = async (criteria) => {
    let { userId, email} = criteria

    try {

        // // console.log("emaicriterial",criteria)

        const res = await Users.query().select('id','email').where('email',email).where('id','!=',userId)
                               .where('isActive','1')
                            //    .where('role',util.role('artisan'))


        if(res.length){

            if(_.isEmpty(email)){
                await Users.query().update({email: email}).where({ id: userId })
                return 0;
            }else{
                return 1;
            }
        }else{
            await Users.query().update({email: email}).where({ id: userId })
             return 0;
        }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const deleteArtisanCMP = async (criteria) => {
     let userId = criteria.userId
    try {
        await Options.query()
            .delete()
            .where({ userId:userId })

    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const enquiryList = (criteria) => {
    let { userId, limit, offset, search, enqId } = criteria

    if (!limit) limit =10
    if (!offset) offset =0

    if(search){
        return new Promise((resolve, reject) => {
            let query = `SELECT (SELECT c3.message FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as last_msg2, c.id AS EnqId,
            coalesce((SELECT c3.fromId FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1), 0) as fromId,
            (SELECT c3.message FROM chat AS c3 WHERE c3.EnqId=c.id AND c3.isActive='1'
             AND ((c3.toId = '1' AND c3.fromId = '${userId}') OR (c3.toId = '${userId}' AND c3.fromId = '1')) ORDER BY c3.id DESC LIMIT 1) AS last_msg,
            (SELECT c3.type FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as type,
            c.uniqueId, c.title, c.description, c.qty, c.expPrice, c.productId,
            (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=c.id LIMIT 1) AS image,
            (SELECT COUNT(c2.id) AS Total  FROM chat  AS c2 WHERE c2.EnqId=c.id AND c2.isActive='1'  AND isRead IN ('1','0')
            AND c2.toId= (SELECT  assignUserId FROM enquiry_order WHERE isActive='1' AND EnqId=c.id AND adminAssign='0' AND assignUserId=eo.assignUserId)) AS unreadCount,
            IFNULL((CASE WHEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1)
            THEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1 )
            END), c.created_at) AS created_at, eo.created_by AS reciverId FROM enquiries AS c JOIN enquiry_order AS eo ON c.id = eo.enqId
            WHERE c.isActive = 1 and eo.isActive = 1  and (title like '%${search}%' or p.description like '%${search}%' or c.uniqueId like '%${search}%')  AND adminAssign='0'
            `;

            // if(enqId) {
            //     query += ` AND eo.enqId=${enqId} `
            // }

            query += ` ORDER BY created_at DESC `

            knex.raw(query).then((rows) => {
               const res2=util.nullRemove(rows[0])
              resolve(res2)
            })
            .catch((err) => reject(err));
          });

    }else{

        return new Promise((resolve, reject) => {

            let query = `SELECT (SELECT c3.message FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as last_msg2,
            (SELECT c3.type FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as type,
            coalesce((SELECT c3.fromId FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1), 0) as fromId,
            c.id AS EnqId, c.uniqueId, c.title, c.description, c.qty, c.expPrice, c.productId,
            (SELECT c3.message FROM chat AS c3 WHERE c3.EnqId=c.id AND c3.isActive='1'
     AND ((c3.toId = '1' AND c3.fromId = eo.assignUserId) OR (c3.toId = eo.assignUserId AND c3.fromId = '1')) ORDER BY c3.id DESC LIMIT 1) AS last_msg,
            (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=c.id LIMIT 1) AS image,
            (SELECT COUNT(c2.id)AS Total  FROM chat  AS c2 WHERE c2.EnqId=c.id AND c2.isActive='1'  AND isRead IN ('1','0')
            AND c2.toId= (SELECT  assignUserId FROM enquiry_order WHERE isActive='1' AND EnqId=c.id AND adminAssign='0' AND assignUserId=eo.assignUserId)) AS unreadCount,
            IFNULL((CASE WHEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1)
            THEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1 )
            END), c.created_at) AS created_at,eo.created_by AS reciverId FROM enquiries AS c JOIN enquiry_order AS eo ON c.id = eo.enqId
            WHERE c.isActive = 1 AND eo.isActive = 1 AND isGenrate='1' AND c.status = '0' AND eo.assignUserId = '${userId}'
            AND adminAssign='0' `;

            // if(enqId) {
            //     query += ` AND eo.enqId=${enqId} `
            // }

            query += ` ORDER BY created_at DESC `


            knex.raw(query)
            .then((rows) => {
                //// console.log(rows, "rowsrows")
                const res2 = util.nullRemove(rows[0])

                resolve(res2)
            })
            .catch((err) => reject(err));
          });

    }
}

const enquiryTotalCount = async (criteria,type) => {

    let { userId } = criteria

    return new Promise((resolve, reject) => {

        if(type ==='order')
        {

           query = `SELECT COUNT(distinct c.EnqId)as Total FROM chat AS c JOIN enquiry_order AS eo ON c.EnqId=eo.EnqId  AND c.isActive='1'
            AND eo.isActive='1' AND isRead IN ('1','0') AND adminAssign='1' AND orderAccept !='2'  AND assignUserId='${userId}' and
            toId='${userId}'`;

        }else{

            query = `SELECT COUNT(distinct c.EnqId) as Total FROM chat AS c JOIN enquiry_order AS eo ON c.EnqId=eo.EnqId  AND c.isActive='1'
            AND eo.isActive='1' AND isRead IN ('1','0') AND adminAssign='0' AND assignUserId='${userId}'AND toId='${userId}'`;

       }

        knex.raw(query).then((rows) => {

            // console.log("query==enquiryTotalCount",rows[0])

            // console.log("query==type",type)

            // console.log("query==query",query)

            const res2=util.nullRemove(rows[0])
            if(res2.length)
                resolve(res2[0].Total)
            else
                resolve(0)

          })
          .catch((err) => reject(err));
        });
}


const oderTotalCount = async (criteria) => {
}

const enquiryUnReadCount = async (criteria) => {

}


const getEnquryAttachemnet = async (EnqId,limit) => {

    try {

            const res = await knex('enquiry_attachment')
                                .select('attachment')
                                .where('isActive', '=', 1)
                                .where('EnqId', '=', EnqId)
                                .limit(limit)


                // // console.log("res====",res)

                if(res.length>0)
                    return res[0]['attachment'];
                 else
                    return "";

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getProductImages = async (productId,limit) => {

    try {

        if(limit==1){

            const res = await ProductImage.query()
                                .select('image')
                                .where('isActive', '=', 1)
                                .where('productId', '=', productId)
                                .limit(limit)
                if(res.length)
                    return res[0]['image'];
                 else
                    return "";
        }else{

            const res = await ProductImage.query()
                                .select('id','image')
                                .where('isActive', '=', 1)
                                .where('productId', '=', productId)
                return res;
        }
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const orderList = (criteria) => {
    let { userId,limit,offset,search } = criteria

    // console.log("")
    if (!limit) limit =10
    if (!offset) offset =0

    if(search){

        return new Promise((resolve, reject) => {
            let query = `SELECT eo.id as orderId,c.id AS EnqId, eo.uniqueId, c.title, c.qty, c.expPrice, c.productId,
            (SELECT c3.message FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as last_msg2,
            (SELECT c3.message FROM chat AS c3 WHERE c3.EnqId=c.id AND c3.isActive='1'
            AND ((c3.toId = '1' AND c3.fromId = '${userId}') OR (c3.toId = '${userId}' AND c3.fromId = '1')) ORDER BY c3.id DESC LIMIT 1) AS last_msg,
            (SELECT c3.type FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as type,
            (SELECT SUM(amount) FROM po WHERE assignUserId=eo.assignUserId) AS totalSale,
            coalesce((SELECT c3.fromId FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1), 0) as fromId,
            orderType,orderAccept as orderstatus,(SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=c.id LIMIT 1) AS image,(SELECT name  FROM options WHERE  id=c.materialId) AS material,
            (SELECT DATE_FORMAT(DATE(STR_TO_DATE(CONCAT(SUBSTRING(dueDate,1,4),' ,',SUBSTRING(dueDate,9,2),' ,',SUBSTRING(dueDate,6,2)), '%Y,%m,%d')),'%D %M %Y')  FROM po WHERE  isActive='1' AND enqId=c.id and assignUserId='${userId}' LIMIT 1)
            AS expDeliveryDate,c.description,
            (SELECT productName FROM po WHERE po.enqId=eo.enqId AND po.assignUserId=eo.assignUserId) AS title2,
            (SELECT price FROM po WHERE po.enqId=eo.enqId AND po.assignUserId=eo.assignUserId) AS expPrice,
            (SELECT COUNT(c2.id)AS Total  FROM chat  AS c2 WHERE c2.EnqId=c.id AND c2.isActive='1'  AND isRead IN ('1','0')
            AND c2.toId= (SELECT  assignUserId FROM enquiry_order WHERE isActive='1' AND EnqId=c.id AND adminAssign='1' AND assignUserId=eo.assignUserId)) AS unreadCount,
            IFNULL((CASE WHEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1)
            THEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1 )
            END), c.created_at) AS created_at, '1' AS reciverId FROM enquiries AS c JOIN enquiry_order AS eo ON c.id = eo.enqId WHERE eo.isActive=1 and isGenrate='1'
            and c.isActive=1 and eo.adminAssign='1' AND eo.assignUserId='${userId}' AND orderAccept !='2'
            and (title like '%${search}%' or c.description like '%${search}%' or uniqueId like '%${search}%') ORDER BY created_at DESC limit`;

            knex.raw(query).then((rows) => {
                const res2=util.nullRemove(rows[0])
                resolve(res2)
            }).catch((err) => reject(err));

          });

    }else{

        return new Promise((resolve, reject) => {

            let query = `SELECT (SELECT c3.message FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as last_msg2,
            (SELECT c3.message FROM chat AS c3 WHERE c3.EnqId=c.id AND c3.isActive='1'
     AND ((c3.toId = '1' AND c3.fromId = '${userId}') OR (c3.toId = '${userId}' AND c3.fromId = '1')) ORDER BY c3.id DESC LIMIT 1) AS last_msg,
            (SELECT c3.type FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1) as type,
            coalesce((SELECT c3.fromId FROM chat as c3 WHERE c3.EnqId=c.id AND c3.isActive='1' ORDER BY c3.id DESC LIMIT 1), 0) as fromId,
            eo.id as orderId,c.id AS EnqId, eo.uniqueId, c.title, c.productId,
            (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=c.id LIMIT 1) AS image,orderAccept as orderstatus,
            orderType,(SELECT name  FROM options WHERE  id=c.materialId) AS material,
            (SELECT SUM(amount) FROM po WHERE assignUserId=eo.assignUserId) AS totalSale,
            (select qty from po where po.enqId=eo.enqId and po.assignUserId=eo.assignUserId) as qty,
            (select amount from po where po.enqId=eo.enqId and po.assignUserId=eo.assignUserId) as expPrice,
            (SELECT productName FROM po WHERE po.enqId=eo.enqId AND po.assignUserId=eo.assignUserId) AS title2,
            (SELECT price FROM po WHERE po.enqId=eo.enqId AND po.assignUserId=eo.assignUserId) AS expPrice,
            (SELECT DATE_FORMAT(DATE(STR_TO_DATE(CONCAT(SUBSTRING(dueDate,1,4),' ,',SUBSTRING(dueDate,9,2),' ,',SUBSTRING(dueDate,6,2)), '%Y,%m,%d')),'%D %M %Y')  FROM po WHERE  isActive='1' AND enqId=c.id and assignUserId='${userId}' LIMIT 1)
             AS expDeliveryDate,c.description,
            (SELECT COUNT(c2.id)AS Total  FROM chat  AS c2 WHERE c2.EnqId=c.id AND c2.isActive='1'  AND isRead IN ('1','0')
            AND c2.toId= (SELECT  assignUserId FROM enquiry_order WHERE isActive='1' AND EnqId=c.id AND adminAssign='1' AND assignUserId=eo.assignUserId)) AS unreadCount,
            IFNULL((CASE WHEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1)
            THEN (SELECT created_at FROM chat WHERE  isActive='1' AND EnqId=c.id AND (toId=eo.assignUserId OR fromId=eo.assignUserId) ORDER BY id DESC LIMIT 1 )
            END), c.created_at) AS created_at, '1'  AS reciverId FROM enquiries AS c JOIN enquiry_order AS eo ON c.id = eo.enqId WHERE eo.isActive=1 and isGenrate='1'
            and c.isActive=1 and eo.adminAssign='1' AND eo.assignUserId='${userId}' AND orderAccept !='2'  ORDER BY created_at DESC`;

            // // console.log("hello User==------>orderList",query)
            knex.raw(query).then((rows) => {

                const res2=util.nullRemove(rows[0])
                // // console.log("hello res2==------>orderList",res2)

                resolve(res2)

            }).catch((err) => reject(err));

          });

    }
}

const orderAcceptorReject = async (criteria) => {
    let {orderId,userId,type}=criteria
    try {

        // console.log("criteria",criteria)

        //
        await knex('enquiry_order').update({orderAccept:type,update_status2:"Order confirmed"}).where({id:orderId}).where({assignUserId:userId}).debug()

        if(type === '1'){

            return new Promise((resolve, reject) => {
                let query = `SELECT t2.dueDate as dueDate FROM enquiry_order AS t1  JOIN  po AS t2 ON t1.enqId=t2.enqId
                WHERE t1.isActive='1' AND t2.isActive='1' AND deleted='1' AND t1.id='${orderId}' AND t1.assignUserId='${userId}'`;

                knex.raw(query).then(async (rows) => {
                    const res2=rows[0]
                    // console.log("res2",res2)
                    let checkrecord=await knex('production_tracker').where({userId:userId,orderId:orderId,isActive:'1'}).debug()

                    if(!checkrecord.length){

                        let dt=res2[0]['dueDate'];
                        let res22 = dt.split("-");
                        dt=res22[0]+'-'+res22[2]+'-'+res22[1]+'T00:00:00.000Z';
                        await knex('production_tracker').insert({userId:userId,orderId:orderId,deliveryDate:dt}).debug()
                    }
                    resolve()
                }).catch((err) => reject(err));
            });
      }
        // await knex('enquiry_order').update({orderAccept:type}).where({id:orderId}).where({assignUserId:userId})

    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const addlogisticDetails = async (criteria) => {
    let {userId,carrier,trackingNo,boxes,paymentMode,orderId}=criteria
    try {
            // let res=await getlogisticDetails({userId,orderId})
            let res=await knex('logistics_detail').where('userId',userId).where('isActive','1').where('orderId',orderId)

            if(res.length){

                await knex('logistics_detail')
                    .update({carrier:carrier,trackingNo:trackingNo,boxes:boxes,paymentMode:paymentMode})
                    .where({id:res[0].id})
            }else{
                await knex('logistics_detail').insert({userId,carrier,trackingNo,boxes,paymentMode,orderId})
            }
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const getlogisticDetails = async (criteria) => {
    let {userId,orderId}=criteria
    try {
        //  let res=await knex('logistics_detail').where({userId:userId}).where('isActive','1').where({orderId:orderId})
        //
        // if(res.length)
        //     return res[0];
        // else
        //     return {}

        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM logistics_detail WHERE isActive='1' AND userId='${userId}' AND orderId='${orderId}'`;

            knex.raw(query).then(async (rows) => {
                const res2=rows[0]

                // console.log("hello",res2)

                if(res2.length) resolve(res2[0]);

                else resolve({})

            }).catch((err) => reject(err));

        });
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const uploadGalleryPic = async (criteria) => {
    let {userId,EnqId,files,toId}=criteria
    try {
            await knex('chat').insert(criteria)
            // await knex('chat').insert({EnqId:EnqId,fromId:userId,toId:1,type:'image',files:files,toId:toId})
       } catch (e) {
       return Promise.reject(e.toString())
    }
}

const deleteGalleryPic = async (criteria) => {
    let {id}=criteria
    try {
            await knex('chat').update({isAtcive:0}).where({id:id})
       } catch (e) {
       return Promise.reject(e.toString())
    }
}

const getGalleryPic =  (criteria) => {
    let {userId,EnqId}=criteria
    try {

        return new Promise((resolve, reject) => {
            let query = `select * from chat where EnqId=${EnqId} and isActive='1' and  type IN ('image', 'general') and (fromId=${userId} or toId=${userId})`;
            knex.raw(query).then((rows) => {
                const res2=util.nullRemove(rows[0])
                resolve(res2)
            })
            .catch((err) => reject(err));
          });

       } catch (e) {
       return Promise.reject(e.toString())
    }
}

const addGalleryComment = async (criteria) => {
    let { EnqId, ids, comments } = criteria
    let idsArr = ids
    let commentsArr = comments
    let idArr = idsArr.split(',')
    let commentArr = commentsArr.split(',')

    try {
        for(index=0; index<idArr.length; index++){
         await knex('chat').update({comments: commentArr[index]}).where({id:idArr[index]}).where({EnqId:EnqId})
        }
    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const addGalleryPrice = async (criteria) => {
    let {EnqId,ids,prices}=criteria
    let idsArr=ids
    let pricesArr=prices
    let idArr = idsArr.split(',')
    let priceArr = pricesArr.split(',')

    try {
        for(index=0;index<idArr.length;index++){
            await knex('chat').update({ price:priceArr[index] }).where({id:idArr[index]}).where({EnqId:EnqId})
        }
       return
    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const addProductionTracker = async (criteria) => {

    // let {userId,EnqId,deliveryDate,productionStatus,paymentStatus,attach}=criteria

    try {

        // let res=await getProductionTracker({userId:criteria.userId,orderId:criteria.orderId})

        let res = await knex('production_tracker')
                    .select('id','productionStatus','paymentStatus','created_at','deliveryDate','orderId')
                    .where({userId:criteria.userId})
                    .where({isActive:1})
                    .where({orderId:criteria.orderId})



        if(res.length){
            await knex('production_tracker').update(criteria).where({orderId:criteria.orderId})
            return res[0].id;
        }else{
            let id = await knex('production_tracker').insert(criteria)
            return id;
        }

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getProductionTracker = async (criteria) => {

    let {userId,orderId}=criteria

    try {
         let res;
         res = await knex('production_tracker')
            .select('id','productionStatus','paymentStatus','created_at','deliveryDate','orderId')
            .where({userId:userId})
            .where({isActive:1})
            .where({orderId:orderId})

        // console.log("res=>>>>>>>>>>>>>>>>>>",res[0].id)
         if(res.length){

             let files=await knex('productionFiles').select("files").where('tracker_id',res[0].id)
             if(files.length)
                res[0].files=files;
             else
                res[0].files=[];
            return res[0];
         }else{
            return {};
         }

    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const getProductionTrackerFiles = async (criteria) => {

    let {tracker_id}=criteria

    try {
          let res= await knex('productionFiles')
            .select('id','files')
            .where({isActive:1})
            .where({tracker_id:tracker_id})


           return util.nullRemove(res)

    } catch (e) {
       return Promise.reject(e.toString())
    }
}


const uploadProductionTrackerFiles = async (criteria) => {

    try {

      // let response=await productImageModel.query().insert(criteria);
      let response=await knex('productionFiles').insert(criteria)
      return Promise.resolve(response);

    } catch (e) {
       return Promise.reject(e.toString())
    }
  };


const removeProductionTrackerFiles = async (productId) => {
    let Arr = productId[0]
    let idsArr = Arr.split(',');
    try {

        //   for(index=0;index<idsArr.length;index++){
        //       await knex('productionFiles').where('id',idsArr[index]).del()
        //   }

          const craftPromises = idsArr.map(recordId => knex('productionFiles').where({id:recordId}).del())
            await Promise.all(craftPromises)


        return;
      } catch (e) {
        return Promise.reject(e.toString())
      }
  };


const delGalleryPic = async (id) => {
    try {
        await knex('chat').update({isActive:0}).where({id:id})
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getOnboarding = async (lang) => {
    try {
         let res;
            if((lang==="en")||(lang==="")){
                res= await knex('onboarding')
                .select('id','image','isActive','created_at','url','title','description')
                .where({isActive:'1'}).where({type:'app'}) //.limit(2)
            }
            if(lang==="hi"){
                res= await knex('onboarding')
                .select('id','image','isActive','created_at','url','title','hindiDescription as description')
                .where({isActive:'1'}).where({type:'app'}) //.limit(2)
            }
            if(lang==="gu"){
                res= await knex('onboarding')
                .select('id','image','isActive','created_at','url','title','gujratiDescription as description')
                .where({isActive:'1'}).where({type:'app'}) //.limit(2)
            }
            if(lang==="bn"){
                res= await knex('onboarding')
                .select('id','image','isActive','created_at','url','title','bangaliDescription as description')
                .where({isActive:'1'}).where({type:'app'}) //.limit(2)
            }

           return util.nullRemove(res)
    } catch (e) {
       return Promise.reject(e.toString())
    }
}



const getMyShop = async (criteria) => {

    let {userId,limit}=criteria;

    let offset, row_count, limits,query;

    if (limit) {
        offset = (limit - 1) * 10;
        row_count = 10;
        limits = `limit ${offset}, ${row_count}`
    }

    try {

     if(limit)
     {
        return new Promise((resolve) => {

        query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal FROM products WHERE deleted='1' and isActive='1' and userId='${userId}' ORDER BY id DESC ${limits}`;

        knex.raw(query).then((res) => {
            // let res2=util.nullRemove(res[0]);
            let res2=res[0];
            let promiseArr = []
            res2.forEach((element, i) => {
            promiseArr.push( new Promise(async (resolve, reject) => {
                    element['image'] = await getProductImages(element.id,1)
                    resolve(element)
                  })
               )
            });
            Promise.all(promiseArr).then(values => { resolve(values)});
         })
       })
     }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getLiveProduct = async (criteria) => {

    let {userId,limit}=criteria;

    let offset, row_count, limits,query;

    if (limit) {
        offset = (limit - 1) * 10;
        row_count = 10;
        limits = `limit ${offset}, ${row_count}`
    }

    try {

     if(limit)
     {
        return new Promise((resolve) => {

        query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal FROM products WHERE deleted='1' and isActive='1' and userId='${userId}' and inventoryQty>0 ORDER BY id DESC ${limits}`;

        knex.raw(query).then((res) => {
            // let res2=util.nullRemove(res[0]);
            let res2=res[0];
            let promiseArr = []
            res2.forEach((element, i) => {
            promiseArr.push( new Promise(async (resolve, reject) => {
                    element['image'] = await getProductImages(element.id,1)
                    resolve(element)
                  })
               )
            });
            Promise.all(promiseArr).then(values => { resolve(values)});
         })
       })
     }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getProductTotal =  (criteria) => {
    let {userId,type}=criteria
    try {

        return new Promise((resolve, reject) => {

            let query;

            if(type === 0)
                query = `select * from products where isActive='1' and deleted='1' and userId='${userId}'`;

            if(type === 1)
                query = `select * from products where isActive='1' and deleted='1' and inventoryQty>0  and userId='${userId}'`;



            knex.raw(query).then((rows) => {
                const res2=util.nullRemove(rows[0])
                resolve(Math.ceil((res2.length/10)))
            })
            .catch((err) => reject(err));
          });

       } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getProductDetail =  (criteria) => {
    let {userId, productId, limit, offset}=criteria
    try {
        if(!offset){
            offset = 0
        }
        return new Promise(async (resolve) => {
            let data = []
            if(offset == 0){
                query1 = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,material,searchTags,pstateId,
                (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=products.material) AS materialName,
                (SELECT name FROM options WHERE TYPE='craft' AND isActive='1' AND id=products.craft) AS craftName
                 FROM products WHERE deleted='1' and isActive='1' and userId='${userId}' and id='${productId}'`;

                const ress = await knex.raw(query1);
                data = ress[0];
            }

            query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,material,searchTags,pstateId,
            (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=products.material) AS materialName,
            (SELECT name FROM options WHERE TYPE='craft' AND isActive='1' AND id=products.craft) AS craftName FROM products WHERE deleted='1' and isActive='1' and userId='${userId}' and id!='${productId}' limit ${limit || 10} offset ${(offset*(limit || 10))}`;


            knex.raw(query).then((res) => {

                // let ressss=util.nullRemove(res[0]);
                let ressss=res[0];

                let res2 = [...data, ...ressss]

                let promiseArr = []
                res2.forEach((element, i) => {
                promiseArr.push( new Promise(async (resolve, reject) => {
                        element['image'] = await getProductImages(element.id,2)
                        resolve(element)
                      })
                   )
                });
                Promise.all(promiseArr).then(values => { resolve(values)});
             })
           })

       } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getProductDetail2 =  (criteria) => {
    let {userId, productId, limit, offset}=criteria
    try {
        if(!offset){
            offset = 0
        }
        return new Promise(async (resolve) => {
            let data = []
            if(offset == 0){
                query1 = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,material,searchTags,pstateId,
                (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=products.material) AS materialName,
                (SELECT name FROM options WHERE TYPE='craft' AND isActive='1' AND id=products.craft) AS craftName
                 FROM products WHERE deleted='1' and isActive='1' and id='${productId}'`;

                const ress = await knex.raw(query1);
                data = ress[0];
            }

            query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,material,searchTags,pstateId,
            (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=products.material) AS materialName,
            (SELECT name FROM options WHERE TYPE='craft' AND isActive='1' AND id=products.craft) AS craftName FROM products WHERE deleted='1' and isActive='1' and userId='${userId}' and id!='${productId}' limit ${limit || 10} offset ${(offset*(limit || 10))}`;


            knex.raw(query).then((res) => {

                // let ressss=util.nullRemove(res[0]);
                let ressss=res[0];

                let res2 = [...data, ...ressss]

                let promiseArr = []
                res2.forEach((element, i) => {
                promiseArr.push( new Promise(async (resolve, reject) => {
                        element['image'] = await getProductImages(element.id,2)
                        resolve(element)
                      })
                   )
                });
                Promise.all(promiseArr).then(values => { resolve(values)});
             })
           })

       } catch (e) {
       return Promise.reject(e.toString())
    }
}
const addEditProduct = async (criteria) => {

    // // console.log("criteria=== assss ",criteria)

    try {
      if (criteria.id && criteria.id != "null") {
        const id = criteria.id;
        delete criteria.id;

        if (!criteria.image) {
            delete criteria.image;
        }
        await knex('products').update(criteria).where({id:id})
        return id[0];

      } else {

        delete criteria.id;
        const SKU = await util.getUniqueCode("PRODUCT-","products","sku");
        criteria.sku=SKU;
        const last_id=await knex('products').insert(criteria)
        return last_id[0];

      }

    } catch (e) {
      return Promise.reject(e.toString())
    }
  };


const getIdealShop = async (criteria) => {

    // console.log("criteria=>>>>>>",criteria)

    let {userId,limit,type}=criteria;

    let offset, row_count, limits,query;

    if (limit) {
        offset = (limit - 1) * 10;
        row_count = 10;
        limits = `limit ${offset}, ${row_count}`
    }

    try {

     if(limit)
     {
        return new Promise(async (resolve) => {

        let condition =' 1=1 ';

        //1->craft,2->material
        if(type==='1'){

            let q=await getUserCraftMaterial({type:1,userId})

            if(q)
                condition += ' and find_in_set (craft,'+"'"+q[0].ids+"')"

            if(criteria.search)
                condition += ' and find_in_set (craft ,' + "'" + criteria.search + "')"

            query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,craft,material,
            (select image from productImage where isActive='1' and productId=products.id limit 1) as image
            FROM products WHERE deleted='1' and isActive='1' and ideal='1' and ${condition} ORDER BY id DESC ${limits}`;

        }else{

            let q=await getUserCraftMaterial({type:2,userId})

            if(q)
                condition += ' and find_in_set (material,'+"'"+q[0].ids+"')"

            if(criteria.search)
                condition += ' and find_in_set (material ,' + "'" + criteria.search + "')"

            query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,craft,material,
            (select image from productImage where isActive='1' and productId=products.id limit 1) as image
            FROM products WHERE deleted='1' and isActive='1' and ideal='1' and ${condition} ORDER BY id DESC ${limits}`;
        }

        // // console.log("query===",query)
        knex.raw(query).then((res) => {
            // let res2=util.nullRemove(res[0]);
            let res2=res[0];
            resolve(res2);
         })
       })
     }
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getUserCraftMaterial =  (criteria) => {
    try {
        return new Promise((resolve, reject) => {
            let query;
            if(criteria.type==1){
                query = `SELECT GROUP_CONCAT(name) as ids FROM options WHERE type = 'UserCraft' AND userId ='${criteria.userId}' `;
            }else{
                query = `SELECT GROUP_CONCAT(name) as ids FROM options WHERE type = 'UserMaterial' AND userId ='${criteria.userId}' `;
            }
            // // console.log("query===getCraftMaterialList",query)
            knex.raw(query).then((rows) => {
                const res2=util.nullRemove(rows[0])
                resolve(res2)
            })
            .catch((err) => reject(err));
          });

       } catch (e) {
       return Promise.reject(e.toString())
    }
}

const getCraftMaterialList =  (criteria) => {
    // let {type}=criteria
    try {

        // console.log("query=criteria",criteria.type)

        return new Promise((resolve, reject) => {
            let query;

            if(criteria.type==1){
                // query = `select id,name from options where isActive='1' and type='craft'`;

                query = `select id,name from options where isActive='1' and type='craft'
                and id in (SELECT name FROM options WHERE type = 'UserCraft' AND userId ='${criteria.userId}')`;


            }else{

                query = `select id,name from options where isActive='1' and type='material'
                and id in (SELECT name FROM options WHERE type = 'UserMaterial' AND userId ='${criteria.userId}')`;

            }

            // console.log("query===getCraftMaterialListgetCraftMaterialList",query)

            knex.raw(query).then((rows) => {

                const res2=util.nullRemove(rows[0])

                resolve(res2)
            })
            .catch((err) => reject(err));
          });

       } catch (e) {
       return Promise.reject(e.toString())
    }
}

const getTotalIdealShop =  (criteria) => {
    let {userId,type}=criteria
    try {

        return new Promise((resolve, reject) => {

            let condition =' 1=1 ';

            //1->craft,2->material
            if(criteria.type === 1){

                if(criteria.search)
                    condition += ' and find_in_set (craft ,' + "'" + criteria.search + "')"

                query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,craft,material,
                (select image from productImage where isActive='1' and productId=products.id limit 1) as image
                FROM products WHERE deleted='1' and isActive='1' and ideal='1' and userId='${userId}' and ${condition}`;

            }else{


                if(criteria.search)
                    condition += ' and find_in_set (material ,' + "'" + criteria.search + "')"

                query = `SELECT id,name,amount,inventoryQty,doableQty,description,ideal,craft,material,
                (select image from productImage where isActive='1' and productId=products.id limit 1) as image
                FROM products WHERE deleted='1' and isActive='1' and ideal='1' and userId='${userId}' and ${condition}`;
            }

            knex.raw(query).then((rows) => {

                const res2=util.nullRemove(rows[0])

                resolve(Math.ceil((res2.length/10)))
            })
            .catch((err) => reject(err));
          });

       } catch (e) {
       return Promise.reject(e.toString())
    }
}

const addAwards = async (criteria) => {
    try {

      if (criteria.id && criteria.id != "null") {
        const id = criteria.id;
        delete criteria.id;

        if (!criteria.image) {
            delete criteria.image;
        }

        const response = await knex('awards').update(criteria).where({id:id})
        return response

      } else {

        delete criteria.id;

        const response = await knex('awards').insert(criteria)
        return response
      }

    } catch (e) {
      return Promise.reject(e.toString())
    }
  };


const getAwards = async (criteria) => {
    try {
        const response = await knex('awards')
        .where({userId: criteria.userId})
        .where({isActive: '1'})
        .orderBy("id", "desc");

        let result = [];

        if(response.length){
            response.forEach((ob, i) => {
                response[i].image = response[i].image? response[i].image.split(",")[0]: '';
            })

            result = response
        }

        return result
    } catch (e) {
      return Promise.reject(e.toString())
    }
  };


  const getAwardsDetails = async (criteria) => {
    try {
        let response=await knex('awards').where({ userId: criteria.userId, id:criteria.id})
        if(response.length){
            response[0].image = response[0].image? response[0].image.split(","): []
            return response[0];
        }
        else
            return {};
    } catch (e) {
      return Promise.reject(e.toString())
    }
  };

  const getNewsFeed = async (criteria) => {
    try {
        let response=await knex('newsfeed')
                .where({type:'app'})
                .orderBy('id','desc')


        // response =  util.nullRemove(response);
        if(response.length)
            return response;
        else
            return {};

    } catch (e) {
      return Promise.reject(e.toString())
    }
  };


  const viewInvoice = async (criteria) => {
    try {

        let response=await knex('invoice')
            .select('pdfUrl')
            .where({enqId:criteria.EnqId,userId:criteria.userId,isActive:'1'})


        response =  util.nullRemove(response);
        if(response.length){
            response[0].Number='1234567890';
            return response[0];
        }else
            return {};

    } catch (e) {
      return Promise.reject(e.toString())
    }
  };


  const addMyGallery = async (criteria) => {
    try {

      if (criteria.id && criteria.id != "null") {
        const id = criteria.id;
        delete criteria.id;

        const response=await knex('gallery').update(criteria).where({id:id})
        return response

      } else {

        delete criteria.id;
        const response=await knex('gallery').insert(criteria)
        return response
      }

    } catch (e) {
      return Promise.reject(e.toString())
    }
  };

  const uploadMyGalleryImage = async (criteria) => {

    try {
      await knex('galleryImage').insert(criteria)
    } catch (e) {
      return Promise.reject(e.toString())
    }
  };


const removeMyGalleryImage = async (productId) => {
    let Arr = productId[0]
    let idsArr = Arr.split(',');
    try {

            const craftPromises = idsArr.map(recordId => knex('galleryImage').where({id:recordId}).del())
            await Promise.all(craftPromises)

      } catch (e) {
        return Promise.reject(e.toString())
      }
  };


const getMyGalleryList =  (criteria) => {
    try {

        return new Promise((resolve) => {

            let query = `SELECT id,title,(SELECT images FROM galleryImage WHERE isActive='1' AND gallery_id=gallery.id LIMIT 1) as image FROM gallery WHERE isActive='1' and userId='${criteria.userId}'`;

            knex.raw(query).then((res) => {

                let res2=util.nullRemove(res[0]);
                resolve(res2)
             })
           })

       } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getMyGalleryDetails =  (criteria) => {


    try {

        return new Promise((resolve) => {
            let query = `SELECT id,title FROM gallery WHERE isActive='1' and userId='${criteria.userId}' and id='${criteria.id}'`;
            knex.raw(query).then((res) => {
                let res2=util.nullRemove(res[0]);

                let promiseArr = []
                res2.forEach((element, i) => {
                promiseArr.push( new Promise(async (resolve, reject) => {
                        element['image'] = await knex('galleryImage')
                                                .select('id','images')
                                                .where({userId:criteria.userId,isActive:'1',gallery_id:element.id})

                        resolve(element)
                      })
                   )
                });
                Promise.all(promiseArr).then(values => { resolve(values[0])});
             })
           })

       } catch (e) {
       return Promise.reject(e.toString())
    }
}


const getNotificationList = async (userId) => {
    try {

        return new Promise((resolve) => {

            let query = `SELECT *,(CASE
                WHEN DATE(created_at)=DATE(NOW()) THEN CONCAT('Today ', TIME_FORMAT(created_at, "%h:%I %p"))
                WHEN DATE(created_at)=DATE(NOW()-INTERVAL 1 DAY) THEN CONCAT('Yesterday ', TIME_FORMAT(created_at, "%h:%I %p"))
                ELSE CONCAT(DATEDIFF(NOW(),DATE(created_at)),' days ago')
                END) AS  notiDate,type
                FROM notifications WHERE isActive='1' and sendStatus='1' and userId='${userId}' order by id desc`;

            knex.raw(query).then((res) => {

                let res2=util.nullRemove(res[0]);
                resolve(res2)
             })
        })
      } catch (e) {
        return Promise.reject(e.toString())
      }
  };


const clearNotification = async (userId) => {
    try {
        await knex('notifications').update({isActive:'0'}).where({userId: userId});
      } catch (e) {
        return Promise.reject(e.toString())
      }
  };


const readNotification = async (userId) => {
    try {
        await knex('notifications').update({isRead:'1'}).where({userId: userId,isRead:'0'})
      } catch (e) {
        return Promise.reject(e.toString())
      }
};

const sendOTP = async (data) => {
    try {
        await knex('otp_verification').update({isUsed:'1'}).where({mobile: data.mobile,isUsed:'0'})

        await knex('otp_verification').insert({mobile:data.mobile,otp:data.otp,isUsed:'0'})

      } catch (e) {
        return Promise.reject(e.toString())
      }
};

const otpVerified = async (criteria) => {
    try {

        const res = await knex('otp_verification').where({otp:criteria.otp,mobile:criteria.mobile,isUsed:'0'})

        if(res.length){

                await knex('otp_verification').update({isUsed:'1'}).where({mobile: criteria.mobile,isUsed:'0',id:res[0].id})

                await knex('users').update({isOtpVerified:'1'}).where({mobile: criteria.mobile,isActive:'1',deleted:'1'})

            return 1; // otp verified

        }else{

            return 2; //otp wrong

        }

    } catch (e) {
       return Promise.reject(e.toString())
    }
}

const generateInvoicePost = async (criteria) => {
    try {
        await knex('order_invoice_url').insert(criteria);
        return
    } catch (e) {
      return Promise.reject(e.toString())
    }
  };

const invoiceGet = async (criteria) => {
    try {

        let response=await knex('order_invoice_url')
            .select('image')
            .where({orderId: criteria.orderId,isActive:'1'})
            .orderBy("id", "desc")
            .limit(1)

        return (response && response.length? response[0]: {})

    } catch (e) {
      return Promise.reject(e.toString())
    }
};

const dashboardGet = async (criteria) => {
    try {
        const { month, week, day, userId } = criteria;

        // console.log("dashboardGet")

        const yearlydata = await getYearlyDashboard(userId);
        const weeklydata = await getWeeklyDashboard(userId);

        const ob = {
            total_enquiry: 0,
            total_orders: 0,
            total_ordersPrice: 0,
            graph: {
                "yearly":yearlydata,
                "weekly":weeklydata,
            }
        }

        let Currentdate = new Date();
        let Currentdate22 = new Date();
        let Currentdate2 = new Date();
        Currentdate.setDate(Currentdate.getDate() - 7);
        // Currentdate22.setDate(Currentdate.getDate() - 6);
        Currentdate2.setDate(Currentdate.getDate() - 365);

        ob['start_date']=new Date().toISOString().slice(0,10);
        ob['end_date']=Currentdate2.toISOString().slice(0,10);

        ob['yearly_start_date']=new Date().toISOString().slice(0,10);
        ob['yearly_end_date']=Currentdate2.toISOString().slice(0,10);

        ob['totalLastMonth']=await getLastMonthTotal(userId);

        let total_enquiry_res = await enquiryList({userId:userId});

        ob['total_enquiry'] = total_enquiry_res && total_enquiry_res.length? total_enquiry_res.length: 0

        let total_orders_res = await orderList({userId:userId});
        let total_ordersPrice = await totalOrderAmmount(userId);

        // console.log("total_orders_res",total_orders_res)
        // ob['total_orders'] = 100
        ob['total_orders'] = total_orders_res && total_orders_res.length? total_orders_res.length: 0
        ob['total_ordersPrice'] = total_ordersPrice
        ob['total_enquiry']=ob['total_enquiry']+ob['total_orders'];
        return ob
    } catch (e) {
      return Promise.reject(e.toString())
    }
};


const getYearlyDashboard2 = async (userId) => {
    try {

        return new Promise((resolve) => {

            // let query = `SELECT ifnull(SUM(expPrice),0) AS amount,MONTH(t2.created_at) AS month FROM enquiries AS t1 JOIN enquiry_order AS t2  ON t1.id=t2.enqId
            // WHERE t1.deleted='1' AND t2.isActive='1' AND t1.isActive='1' and adminAssign='1' and orderAccept='1' and assignUserId='${userId}' GROUP BY MONTH(t2.created_at)`;

            let query=`SELECT IFNULL(SUM(po.amount),0) AS amount,MONTH(po.created_at) AS MONTH
                    FROM enquiries AS t1 JOIN enquiry_order AS t2  ON t1.id=t2.enqId
                    JOIN po  ON po.enqId=t2.enqId WHERE   po.assignUserId=t2.assignUserId AND
                    t1.deleted='1' AND t2.isActive='1' AND t1.isActive='1' AND adminAssign='1' AND orderAccept='1'
                    AND po.assignUserId='${userId}' GROUP BY MONTH(po.created_at)`;
            knex.raw(query).then((res) => {
                let res2=util.nullRemove(res[0]);
                // // console.log("res2",res2)
                resolve(res2)
             })
        })
      } catch (e) {
        return Promise.reject(e.toString())
      }
};

const totalOrderAmmount = async (userId) => {
    try {

        return new Promise((resolve) => {

            let query = `SELECT ifnull(SUM(amount),0) as totalSale FROM po WHERE enqId in (SELECT enqId FROM enquiry_order as eo2 WHERE eo2.orderAccept='1' AND eo2.assignUserId='${userId}'  )
            and po.assignUserId='${userId}'`;

            knex.raw(query).then((res) => {
                let res2=util.nullRemove(res[0]);
                    resolve(res2[0].totalSale)
             })
        })
      } catch (e) {
        return Promise.reject(e.toString())
      }
};


const getYearlyDashboard = async (userId) => {
    try {

        let d = new Date();
        let currentYear = d.getFullYear();
        let resDataA = await getYearlyDashboard2(userId);

        // yearly graph
        let graphArrMonth = [];
        let monthArr = {};
        monthArr[1] = 0;
        monthArr[2] = 1;
        monthArr[3] = 2;
        monthArr[4] = 3;
        monthArr[5] = 4;
        monthArr[6] = 5;
        monthArr[7] = 6;
        monthArr[8] = 7;
        monthArr[9] = 8;
        monthArr[10] = 9;
        monthArr[11] = 10;
        monthArr[12] = 11;

        let i =0;
        for (const [keyM, valueM] of Object.entries(monthArr)) {
            let newArr = {};
            if(resDataA.length > 0){
                for (const [key, value] of Object.entries(resDataA)) {

                // console.log("keyM",keyM,"value.month",value.MONTH);

                if(keyM == value.MONTH){
                    newArr['month'] = String(valueM);
                    newArr['amount'] = String(value.amount);
                    break;
                }else{
                    newArr['month'] = String(valueM);
                    newArr['amount'] = "0";
                }
              }
            }else{
                newArr['month'] = String(valueM);
                newArr['amount'] = "0";
            }
            graphArrMonth.push(newArr);
         i++;
        }
        return graphArrMonth;

      } catch (e) {
        return Promise.reject(e.toString())
      }
};

const getLastMonthTotal = async (userId) => {
    try {

        return new Promise((resolve) => {

            let query =`SELECT ifnull(SUM(expPrice),0) AS amount FROM enquiries AS t1 JOIN enquiry_order AS t2  ON t1.id=t2.enqId WHERE t1.deleted='1' AND t2.isActive='1' AND t1.isActive='1'
            AND MONTH(t2.created_at)=MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH)) and adminAssign='1' and orderAccept='1' and assignUserId='${userId}'`;

            knex.raw(query).then((res) => {
                let res2=res[0];
                if(res2.length)
                    resolve(res2[0].amount)
                else
                    resolve(0)
             })
        })
      } catch (e) {
        return Promise.reject(e.toString())
      }
};


const getWeeklyDashboard2 = async (userId) => {
    try {

        return new Promise((resolve) => {

            // let query = `SELECT  DAYNAME( po.created_at ) AS dayName ,
            // FIELD( WEEKDAY( po.created_at  ), 6, 0, 1, 2 ,3 ,4, 5 ) AS day ,
            // ifnull(SUM( po.amount ),0) AS amount FROM enquiries AS t1 JOIN enquiry_order AS t2  ON t1.id=t2.enqId
            // JOIN po  ON po.enqId=t2.enqId WHERE po.assignUserId=t2.assignUserId and t1.deleted='1' AND t2.isActive='1' AND t1.isActive='1' AND adminAssign='1' and orderAccept='1' and po.assignUserId='${userId}' and
            // po.created_at BETWEEN ( CURDATE() - INTERVAL 1 WEEK ) AND CURDATE() GROUP BY  1, 2 , FIELD( WEEKDAY( po.created_at  ), 6, 0, 1, 2 ,3 ,4, 5 ) `;


            let query = `SELECT  DAYNAME( po.created_at ) AS dayName ,
            FIELD( WEEKDAY( po.created_at  ), 6, 0, 1, 2 ,3 ,4, 5 ) AS day ,
            ifnull(SUM( po.amount ),0) AS amount from enquiry_order AS t2
            JOIN po  ON po.enqId=t2.enqId WHERE po.assignUserId=t2.assignUserId  AND t2.isActive='1' AND adminAssign='1' and orderAccept='1' and po.assignUserId='${userId}' and
            po.created_at BETWEEN ( CURDATE() - INTERVAL 1 WEEK ) AND CURDATE() GROUP BY  1, 2 , FIELD( WEEKDAY( po.created_at  ), 6, 0, 1, 2 ,3 ,4, 5 ) `;


            knex.raw(query).then((res) => {
                let res2=util.nullRemove(res[0]);
                resolve(res2)
             })
        })
      } catch (e) {
        return Promise.reject(e.toString())
      }
};



const getWeeklydash = async (userId,date) => {
    try {

        return new Promise((resolve) => {

            let query = `SELECT IFNULL(SUM( po.amount ),0) AS amount FROM enquiry_order AS t2
            JOIN po  ON po.enqId=t2.enqId WHERE po.assignUserId=t2.assignUserId  AND t2.isActive='1' AND adminAssign='1' AND orderAccept='1'
            AND po.assignUserId='${userId}' AND DATE(po.created_at) = DATE('${date}')`;

            // console.log("query",query)
            knex.raw(query).then((res) => {
                let res2=util.nullRemove(res[0]);

                // console.log("res2",res2)

                resolve(res2[0].amount)
             })
        })
      } catch (e) {
        return Promise.reject(e.toString())
      }
};

const getSavenDays = async () => {
    return new Promise((resolve) => {
        let query = `SELECT DATE(DATE_SUB(NOW(),INTERVAL 6 DAY)) AS day,SUBSTRING(DAYNAME(DATE(DATE_SUB(NOW(),INTERVAL 6 DAY))),1,3) AS dayName
        UNION  ALL
        SELECT DATE(DATE_SUB(NOW(),INTERVAL 5 DAY)) AS day,SUBSTRING(DAYNAME(DATE(DATE_SUB(NOW(),INTERVAL 5 DAY))),1,3) AS dayName
        UNION  ALL
        SELECT DATE(DATE_SUB(NOW(),INTERVAL 4 DAY)) AS day,SUBSTRING(DAYNAME(DATE(DATE_SUB(NOW(),INTERVAL 4 DAY))),1,3) AS dayName
        UNION  ALL
        SELECT DATE(DATE_SUB(NOW(),INTERVAL 3 DAY)) AS day,SUBSTRING(DAYNAME(DATE(DATE_SUB(NOW(),INTERVAL 3 DAY))),1,3) AS dayName
        UNION  ALL
        SELECT DATE(DATE_SUB(NOW(),INTERVAL 2 DAY)) AS day,SUBSTRING(DAYNAME(DATE(DATE_SUB(NOW(),INTERVAL 2 DAY))),1,3) AS dayName
        UNION  ALL
        SELECT DATE(DATE_SUB(NOW(),INTERVAL 1 DAY)) AS day,SUBSTRING(DAYNAME(DATE(DATE_SUB(NOW(),INTERVAL 1 DAY))),1,3) AS dayName
        UNION  ALL
        SELECT DATE(NOW()) AS day,SUBSTRING(DAYNAME(DATE(NOW())),1,3) AS dayName`;
        knex.raw(query).then((res) => {
            let res2=util.nullRemove(res[0]);
            resolve(res2)
         })
    })
}

const getWeeklyDashboard = async (userId) => {
    try {

        let graphArrWeekly = await getSavenDays();

        // // console.log(graphArrWeekly,"graphArrWeeklygraphArrWeekly")

        for(let i=0;i<7;i++){
            graphArrWeekly[i].dayColumn=i;
            graphArrWeekly[i].amount=await getWeeklydash(userId,graphArrWeekly[i].day);

        }
        // console.log(graphArrWeekly,"graphArrWeekly")

           return graphArrWeekly;
          } catch (e) {
            return Promise.reject(e.toString())
          }
    };


// const getWeeklyDashboard = async (userId) => {
// try {

//     let d = new Date();
//     // 5 for FriDay
//     let todayDay = d.getDay();
//     let weekStartDate = '';
//     let weekEndDate = '';
//     let weekData = [];

// // if(todayDay == 5){

// //     let today = moment().format('YYYY-MM-DD');
// //     let startD = moment().subtract(7, "days").format("YYYY-MM-DD");
// //     weekStartDate = startD;
// //     weekEndDate = today;
// //     weekData = await getWeeklyDashboard2(userId);

// // }else{

// //     let allDay = moment().day("Friday").format('YYYY-MM-DD');
// //     let endD = moment(allDay).subtract(7, "days").format("YYYY-MM-DD");
// //     let startD = moment(endD).subtract(6, "days").format("YYYY-MM-DD");
// //     weekStartDate = startD;
// //     weekEndDate = endD;
// //     weekData = await getWeeklyDashboard2(userId);
// //     // // console.log(weekData); return true;
// // }

//     let allDay = moment().day("Friday").format('YYYY-MM-DD');
//     let endD = moment(allDay).subtract(7, "days").format("YYYY-MM-DD");
//     let startD = moment(endD).subtract(6, "days").format("YYYY-MM-DD");
//     weekStartDate = startD;
//     weekEndDate = endD;
//     weekData = await getWeeklyDashboard2(userId);

//     // console.log("allDay",allDay,"endD",endD,"startD",startD,"weekData",weekData)

//     let graphArrWeekly = [];
//     let weekArr = {};
//     weekArr['Sunday'] = 0;
//     weekArr['Monday'] = 1;
//     weekArr['Tuesday'] = 2;
//     weekArr['Wednesday'] = 3;
//     weekArr['Thursday'] = 4;
//     weekArr['Friday'] = 5;
//     weekArr['Saturday'] = 6;
//     let i =  0;

//     for (const [keyM, valueM] of Object.entries(weekArr)) {
//         let newArr = {};
//         if(weekData.length > 0){
//             for (const [key, value] of Object.entries(weekData)) {
//                     if(keyM == value.dayName){
//                         newArr['day'] = String(valueM);
//                         newArr['dayName'] = String(value.dayName);
//                         newArr['amount'] = String(value.amount);
//                     break;
//                     }else{
//                         newArr['day'] = String(valueM);
//                         newArr['dayName'] = String(value.dayName);
//                         newArr['amount'] = String("0");
//                     }
//                  }
//                 }else{
//                     newArr['day'] = String(valueM);
//                     newArr['dayName'] = String(valueM.dayName);
//                     newArr['amount'] = "0";
//                 }
//             graphArrWeekly.push(newArr);
//             i++;
//        }

//        return graphArrWeekly;
//       } catch (e) {
//         return Promise.reject(e.toString())
//       }
// };

const productLogAccept = async (criteria) => {
    try {

        const { productId } = criteria
        let responce=await productLog(criteria)

        let updateData={};

            updateData.name=responce.name;
            updateData.amount=responce.amount;
            updateData.inventoryQty=responce.inventoryQty;
            updateData.material=responce.material;
            updateData.description=responce.description;
            updateData.doableQty=responce.doableQty;
            updateData.searchTags=responce.searchTags;
            updateData.craft=responce.craft;
            updateData.categoryId=responce.categoryId;
            updateData.subcategoryId=responce.subcategoryId;

        await knex('products').update(updateData).where({ id:productId })
        await knex('products_log').where({ productId }).del()

    } catch (e) {
      return Promise.reject(e.toString())
    }
};



const productLog = async (criteria) => {
    try {
        const { productId } = criteria
        let response=await knex('products_log')
            .select('*')
            .where({ productId })
            .orderBy("id", "desc")
            .limit(1)

        return response && response.length? response[0]: {}

    } catch (e) {
      return Promise.reject(e.toString())
    }
};

const  getSupportList = async (lang) => {
    try {
        let responce;

        if(_.isEmpty(lang)){
            lang=""
        }

        if(lang==='en'||lang === "")
            responce= await knex('support').select('id','title').where({ isActive:'1'})

        if(lang==='bn')
            responce= await knex('support').select('id','bangaliDescription as title').where({ isActive:'1'})

        if(lang==='gu')
            responce= await knex('support').select('id','gujratiDescription as title').where({ isActive:'1'})

        if(lang==='hi')
            responce= await knex('support').select('id','hindiDescription as title').where({ isActive:'1'})

        return responce;
    } catch (e) {
      return Promise.reject(e.toString())
    }
};


const saveSupportTicket = async (criteria) => {
    try {
        await knex('user_support').insert(criteria)
    } catch (e) {
      return Promise.reject(e.toString())
    }
};


const sendOfflineMsg = async (postdata) => {
    try {

        let artisan = await knex("users").select("id","appToken").where("isActive", "1")
                          .where("deleted", "1").where("id", postdata.toId)
                          .where("appToken","!=","")


        if(artisan.length){
            const notificationPayload = {}
            notificationPayload.title = 'Chat' || '';
            notificationPayload.description = postdata.msg  || '';
            notificationPayload.type = 'Chat';
            notificationPayload.userId = artisan[0].id || 0;
            notificationPayload.sendStatus = 1
            notificationPayload.isActive = 1
            notificationPayload.gcmId = artisan [0].appToken
            util.sendNotif(notificationPayload)
            await knex('notifications').insert(notificationPayload)
       }
    } catch (e) {
      return Promise.reject(e.toString());
    }
  };



const getManageListing = async (criteria) => {
    try {
      return new Promise((resolve) => {
        let query;

        // console.log("criteria,",criteria)

        if(criteria.stateId){
          let stateId=criteria.stateId.replace(/,/g,"|");
          if(criteria.craftId){

            let craftId=criteria.craftId.replace(/,/g,"|");

              if(criteria.materialId){

                let materialId=criteria.materialId.replace(/,/g,"|");

                if(criteria.lang==='en'||criteria.lang === "")
                    query = `select id,name,type,stateId,image from options where type='products' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and  CONCAT(",", craftId, ",") REGEXP ",(${craftId})," and CONCAT(",", materialId, ",") REGEXP ",(${materialId}),"`
                if(criteria.lang==='bn')
                    query = `select id,bangaliName as name,type,stateId,image from options where type='products' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and  CONCAT(",", craftId, ",") REGEXP ",(${craftId})," and CONCAT(",", materialId, ",") REGEXP ",(${materialId}),"`
                if(criteria.lang==='gu')
                    query = `select id,gujratiName as name,type,stateId,image from options where type='products' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and  CONCAT(",", craftId, ",") REGEXP ",(${craftId})," and CONCAT(",", materialId, ",") REGEXP ",(${materialId}),"`
                if(criteria.lang==='hi')
                    query = `select id,hindiName as name,type,stateId,image from options where type='products' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and  CONCAT(",", craftId, ",") REGEXP ",(${craftId})," and CONCAT(",", materialId, ",") REGEXP ",(${materialId}),"`

              }else{

                if(criteria.lang==='en'||criteria.lang === "")
                    query = `select id,name,type,stateId,image from options where type='material' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and CONCAT(",", craftId, ",") REGEXP ",(${craftId}),"`
                if(criteria.lang==='bn')
                    query = `select id,bangaliName as name,type,stateId,image from options where type='material' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and CONCAT(",", craftId, ",") REGEXP ",(${craftId}),"`
                if(criteria.lang==='gu')
                    query = `select id,gujratiName as name,type,stateId,image from options where type='material' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and CONCAT(",", craftId, ",") REGEXP ",(${craftId}),"`
                if(criteria.lang==='hi')
                    query = `select id,hindiName as name,type,stateId,image from options where type='material' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and CONCAT(",", craftId, ",") REGEXP ",(${craftId}),"`

              }
          }else{
                if(criteria.lang==='en'||criteria.lang === "")
                    query = `select id,name,type,stateId,image from options where CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and type='craft'`
                if(criteria.lang==='bn')
                    query = `select id,bangaliName as name,type,stateId,image from options where CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and type='craft'`
                if(criteria.lang==='gu')
                    query = `select id,gujratiName as name,type,stateId,image from options where CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and type='craft'`
                if(criteria.lang==='hi')
                    query = `select id,hindiName as name,type,stateId,image from options where CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and type='craft'`

          }
        }else{

            if(criteria.lang==='en'||criteria.lang === "")
                query = `select id,name,type,stateId,image from options where type='state'`
            if(criteria.lang==='bn')
                query = `select id,bangaliName as name,type,stateId,image from options where type='state'`
            if(criteria.lang==='gu')
                query = `select id,gujratiName as name,type,stateId,image from options where type='state'`
            if(criteria.lang==='hi')
                query = `select id,hindiName as name,type,stateId,image from options where type='state'`

        }
           // console.log("quesry==",query)

           knex
           .raw(query)
           .then( async(result) => {
            let res2 = util.nullRemove(result[0]);
            resolve(res2);
          });
      });
    } catch (e) {
       return Promise.reject(e.toString())
    }
  }
//   if(lang==='en'||lang === "")
//             states = await Options.query().select('id','name as title','image').where('isActive','1').where('type','state');

//         if(lang==='bn')
//             states = await Options.query().select('id','bangaliName as title','image').where('isActive','1').where('type','state');

//         if(lang==='gu')
//             states = await Options.query().select('id','gujratiName as title','image').where('isActive','1').where('type','state');

//         if(lang==='hi')
//             states = await Options.query().select('id','hindiName as title','image').where('isActive','1').where('type','state');



module.exports = {
    getProductDetail2,
    getManageListing,
    sendOfflineMsg,
    saveSupportTicket,
    getSupportList,
    productLogAccept,
    productLog,
    dashboardGet,
    invoiceGet,
    generateInvoicePost,
    checkUser,
    checkUserMobile,
    addUser,
    addDeviceToken,
    addArtisan,
    checkUserId,
    otpVerified,
    artisanPicuploads,
    states,
    getCraftList,
    getMatrialList,
    getProductList,
    signUpStep2,
    craftChoose,
    materialChoose,
    productChoose,
    findUser,
    getUserCMPDetails,
    editArtisanDetails,
    editArtisan,
    deleteArtisanCMP,
    chooseLanguages,
    enquiryList,
    getProductImages,
    getEnquryAttachemnet,
    enquiryTotalCount,
    oderTotalCount,
    enquiryUnReadCount,
    orderList,
    orderAcceptorReject,
    addlogisticDetails,
    getlogisticDetails,
    uploadGalleryPic,
    deleteGalleryPic,
    getGalleryPic,
    addGalleryComment,
    addGalleryPrice,
    addProductionTracker,
    getProductionTracker,
    getProductionTrackerFiles,
    removeProductionTrackerFiles,
    uploadProductionTrackerFiles,
    delGalleryPic,
    getOnboarding,
    checkUserDeletedStatus,
    checkUserMobile2,
    getMyShop,
    getLiveProduct,
    getProductTotal,
    getProductDetail,
    addEditProduct,
    getIdealShop,
    getTotalIdealShop,
    getCraftMaterialList,
    addAwards,
    getAwards,
    getAwardsDetails,
    getNewsFeed,
    viewInvoice,
    addMyGallery,
    uploadMyGalleryImage,
    removeMyGalleryImage,
    getMyGalleryList,
    getMyGalleryDetails,
    getNotificationList,
    clearNotification,
    readNotification,
    sendOTP
}