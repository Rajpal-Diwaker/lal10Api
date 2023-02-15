const Artisan = require('../../models/artisan'),
    Users = require('../../models/users'),
    Options = require('../../models/options')

const knex = require('../../db/knex')

const add = async (criteria, cb) => {
    let { kycImage, artisanImage, state, craft, product, material, userId, name, id, email, mobile } = criteria

    try {
        // // console.log(criteria)
        if (id && id != 'null') {

            res = await Artisan.query().where('id', '=', id)

            let user_Id = res[0].userId

            await Users.query().update({ email: email, mobile: mobile }).where({ id: user_Id })

            await Artisan.query().update({ kycImage: kycImage, artisanImage: artisanImage, state: state, name: name }).where({ userId: user_Id })

            await craftChoose({ userId: user_Id, craft: craft })
            await materialChoose({ userId: user_Id, material: material })
            await productChoose({ userId: user_Id, product: product })

        } else {
            await Artisan.query()
                // .insert({ kycImage, artisanImage, state, craft, product, material, userId, name });
                .insert({ kycImage, artisanImage, state, userId, name })

            await craftChoose({ userId, craft })
            await materialChoose({ userId, material })
            await productChoose({ userId, product })

        }

        cb(null, 'success')
    } catch (e) {
        await Users.query()
            .where('id', '=', userId)
            .del()

        cb(msg, null)
    }
}

// old code chnages by 14 may
// const getArtisan = (criteria,data) => {
//     // let limit  = criteria.pageNumber;
//     let limit  = data;

//     // console.log("limit",limit)
//     let offset,row_count,limits;

//     if (limit){
//         offset = (limit - 1) * 10;
//         row_count = 10;
//         limits = `limit ${offset}, ${row_count}`
//     }

//     try {
//         return new Promise((resolve) => {
//             if (limit) {

//                 let condition = 'and 1=1 '
//                 let query ='';

//                 if (criteria.state)
//                     condition += ' AND stateName2 LIKE '+ "'%" +criteria.state+ "%'"

//                 if(criteria.craft)
//                     condition += ' and FIND_IN_SET('+"'" + criteria.craft + "'" +', UserCraft '+')'

//                 if(criteria.material)
//                     condition += ' and FIND_IN_SET('+"'" + criteria.material + "'" +', UserMaterial '+')'

//                 if(criteria.product)
//                     condition += ' and FIND_IN_SET('+"'" + criteria.product + "'" +', Userproducts '+')'

//                 if(criteria.search)
//                     condition += ' and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR mobile LIKE '+ "'%" +criteria.search+ "%'" +' OR LOWER(email) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

//                 if(criteria.subAdmintotalArtisan)
//                     condition += ' and FIND_IN_SET( userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

//                 // let query = `SELECT ad.id, ad.name, ad.artisanImage, u.mobile, ad.state AS stateName, u.email, u.isActive, ad.userId,
//                 //             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,
//                 //             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
//                 //             FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId ORDER BY ad.userId DESC limit ${limit} offset ${offset}`;

//                 if(criteria.group_id)
//                     query += `select * from (SELECT ad.id, ad.userId, ad.name, ad.artisanImage,ad.kycImage, u.mobile, ad.state AS stateName2, u.email, u.isActive,role,
//                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
//                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='UserProducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
//                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
//                             (SELECT name FROM options WHERE  id = ad.state) AS stateName,is_verified,
//                             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
//                             FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1'
//                             and role='${util.role('artisan')}') as t1  where FIND_IN_SET(userId,(SELECT total_artisan FROM artisan_group WHERE id='${criteria.group_id}'))
//                             ${condition} union `

//                 query += ` SELECT * FROM (SELECT ad.id, ad.userId, ad.name, ad.artisanImage,ad.kycImage, u.mobile, ad.state AS stateName2, u.email, u.isActive,role,
//                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
//                              (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='UserProducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
//                              (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
//                              (SELECT name FROM options WHERE  id = ad.state) AS stateName,is_verified,
//                              (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
//                              FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1' ) AS t1
//                              WHERE role='${util.role('artisan')}' ${condition} `

//                 if(criteria.group_id)
//                     query += `${limits}`
//                 else
//                     query+=`ORDER BY userId DESC ${limits}`;

//                 // console.log("query==limit",query)

//                 knex.raw(query).then((res) => {
//                     const res2 = util.nullRemove(res[0]);

//                     let promiseArr = []

//                     res2.forEach((element, i) => {
//                         promiseArr.push(
//                             new Promise(async (resolve, reject) => {
//                                 element['craft'] = await getUserCMPDetails({ userId: element.userId, type: 'UserCraft' })
//                                 element['material'] = await getUserCMPDetails({ userId: element.userId, type: 'UserMaterial' })
//                                 element['product'] = await getUserCMPDetails({ userId: element.userId, type: 'UserProducts' })
//                                 resolve(element)
//                             })
//                         )
//                     });

//                     Promise.all(promiseArr).then(values => { resolve(values) });
//                 })

//             } else {

//                 let condition = ' and 1=1 '

//                 if (criteria.state)
//                     condition += ' AND stateName LIKE '+ "'%" +criteria.state+ "%'"

//                 if(criteria.craft)
//                     condition += ' and FIND_IN_SET('+"'" + criteria.craft + "'" +', UserCraft '+')'

//                 if(criteria.material)
//                     condition += ' and FIND_IN_SET('+"'" + criteria.material + "'" +', UserMaterial '+')'

//                 if(criteria.product)
//                     condition += ' and FIND_IN_SET('+"'" + criteria.product + "'" +', Userproducts '+')'

//                 if(criteria.search)
//                     condition += ' and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR mobile LIKE '+ "'%" +criteria.search+ "%'" +' OR LOWER(email) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

//                 if(criteria.subAdmintotalArtisan)
//                     condition += ' and FIND_IN_SET( userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

//                 let query = `SELECT * FROM (SELECT ad.id, ad.name, ad.artisanImage,ad.kycImage, u.mobile, ad.state AS stateName2, u.email, u.isActive, ad.userId,role,
//                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
//                              (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='UserProducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
//                              (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
//                              (SELECT name FROM options WHERE  id = ad.state) AS stateName,is_verified,
//                              (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
//                              FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1'  ) AS t1
//                              WHERE role='2' ${condition} ORDER BY userId DESC`;

//                 // console.log("query==ALl",query)

//                 knex.raw(query).then((res) => {

//                     const res2 = util.nullRemove(res[0]);

//                     let promiseArr = []
//                     res2.forEach((element, i) => {
//                         promiseArr.push(
//                             new Promise(async (resolve, reject) => {
//                                 element['craft'] = await getUserCMPDetails({ userId: element.userId, type: 'UserCraft' })
//                                 element['material'] = await getUserCMPDetails({ userId: element.userId, type: 'UserMaterial' })
//                                 element['product'] = await getUserCMPDetails({ userId: element.userId, type: 'UserProducts' })
//                                 resolve(element)
//                             })
//                         )
//                     });

//                     Promise.all(promiseArr).then(values => { resolve(values) });
//                 })
//             }
//         })
//     } catch (e) {
//         return Promise.reject(e.toString())
//     }
// }

// change by rajpal on 14 may doing sorting dynamic
const getArtisan = (criteria,data) => {
    // let limit  = criteria.pageNumber;
    let limit  = data;

    // console.log("limit",limit)
    let offset,row_count,limits;

    if (limit){
        offset = (limit - 1) * 10;
        row_count = 10;
        limits = `limit ${offset}, ${row_count}`
    }

    try {
        return new Promise((resolve) => {
            if (limit) {

                let condition = 'and 1=1 '
                let query ='';
                let sorting ='';

                if (criteria.state)
                    condition += ' AND stateName2 LIKE '+ "'%" +criteria.state+ "%'"

                if(criteria.craft)
                    condition += ' and FIND_IN_SET('+"'" + criteria.craft + "'" +', UserCraft '+')'

                if(criteria.material)
                    condition += ' and FIND_IN_SET('+"'" + criteria.material + "'" +', UserMaterial '+')'

                if(criteria.product)
                    condition += ' and FIND_IN_SET('+"'" + criteria.product + "'" +', Userproducts '+')'

                if(criteria.search)
                    condition += ' and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR mobile LIKE '+ "'%" +criteria.search+ "%'" +' OR LOWER(email) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

                if(criteria.subAdmintotalArtisan)
                    condition += ' and FIND_IN_SET( userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

                if(criteria.sort){
                    sorting=criteria.sort +' '+criteria.order
                }else{
                    sorting="userId DESC"
                }

                // let query = `SELECT ad.id, ad.name, ad.artisanImage, u.mobile, ad.state AS stateName, u.email, u.isActive, ad.userId,
                //             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,
                //             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
                //             FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId ORDER BY ad.userId DESC limit ${limit} offset ${offset}`;

                if(criteria.group_id)
                    query += `select * from (SELECT ad.id, ad.userId, ad.name, ad.artisanImage,ad.kycImage, u.mobile, ad.state AS stateName2, u.email, u.isActive,role,
                            (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
                            (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='UserProducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
                            (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
                            (SELECT name FROM options WHERE  id = ad.state) AS stateName,is_verified,
                            (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
                            FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1'
                            and role='${util.role('artisan')}') as t1  where FIND_IN_SET(userId,(SELECT total_artisan FROM artisan_group WHERE id='${criteria.group_id}'))
                            ${condition} union `

                query += ` SELECT * FROM (SELECT ad.id, ad.userId, ad.name, ad.artisanImage,ad.kycImage, u.mobile, ad.state AS stateName2, u.email, u.isActive,role,
                            (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='UserProducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
                             (SELECT name FROM options WHERE  id = ad.state) AS stateName,is_verified,
                             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
                             FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1' ) AS t1
                             WHERE role='${util.role('artisan')}' ${condition} `

                if(criteria.group_id)
                    query += `${limits}`
                else
                    query+=`ORDER BY ${sorting} ${limits}`;
                    // query+=`ORDER BY userId DESC ${limits}`;

                console.log("query==limit",query)

                knex.raw(query).then((res) => {
                    const res2 = util.nullRemove(res[0]);

                    let promiseArr = []

                    res2.forEach((element, i) => {
                        promiseArr.push(
                            new Promise(async (resolve, reject) => {
                                element['craft'] = await getUserCMPDetails({ userId: element.userId, type: 'UserCraft' })
                                element['material'] = await getUserCMPDetails({ userId: element.userId, type: 'UserMaterial' })
                                element['product'] = await getUserCMPDetails({ userId: element.userId, type: 'UserProducts' })
                                resolve(element)
                            })
                        )
                    });

                    Promise.all(promiseArr).then(values => { resolve(values) });
                })

            } else {

                let condition = ' and 1=1 '
                let sorting ='';

                if (criteria.state)
                    condition += ' AND stateName LIKE '+ "'%" +criteria.state+ "%'"

                if(criteria.craft)
                    condition += ' and FIND_IN_SET('+"'" + criteria.craft + "'" +', UserCraft '+')'

                if(criteria.material)
                    condition += ' and FIND_IN_SET('+"'" + criteria.material + "'" +', UserMaterial '+')'

                if(criteria.product)
                    condition += ' and FIND_IN_SET('+"'" + criteria.product + "'" +', Userproducts '+')'

                if(criteria.search)
                    condition += ' and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR mobile LIKE '+ "'%" +criteria.search+ "%'" +' OR LOWER(email) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

                if(criteria.subAdmintotalArtisan)
                    condition += ' and FIND_IN_SET( userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

                if(criteria.sort){
                    sorting=criteria.sort +' '+criteria.order
                }else{
                    sorting="userId DESC"
                }

                let query = `SELECT * FROM (SELECT ad.id, ad.name, ad.artisanImage,ad.kycImage, u.mobile, ad.state AS stateName2, u.email, u.isActive, ad.userId,role,
                            (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='UserProducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
                             (SELECT name FROM options WHERE  id = ad.state) AS stateName,is_verified,
                             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
                             FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1'  ) AS t1
                             WHERE role='2' ${condition} ORDER BY ${sorting}`;

                // console.log("query==ALl",query)

                knex.raw(query).then((res) => {

                    const res2 = util.nullRemove(res[0]);

                    let promiseArr = []
                    res2.forEach((element, i) => {
                        promiseArr.push(
                            new Promise(async (resolve, reject) => {
                                element['craft'] = await getUserCMPDetails({ userId: element.userId, type: 'UserCraft' })
                                element['material'] = await getUserCMPDetails({ userId: element.userId, type: 'UserMaterial' })
                                element['product'] = await getUserCMPDetails({ userId: element.userId, type: 'UserProducts' })
                                resolve(element)
                            })
                        )
                    });

                    Promise.all(promiseArr).then(values => { resolve(values) });
                })
            }
        })
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const totalArtisan = async (criteria) => {
    try {

        let condition = 'and 1=1 '

        if (criteria.state)
            condition += ' AND stateName LIKE '+ "'%" +criteria.state+ "%'"

        if(criteria.craft)
            condition += ' and FIND_IN_SET('+"'" + criteria.craft + "'" +', UserCraft '+')'

        if(criteria.material)
            condition += ' and FIND_IN_SET('+"'" + criteria.material + "'" +', UserMaterial '+')'

        if(criteria.product)
            condition += ' and FIND_IN_SET('+"'" + criteria.product + "'" +', Userproducts '+')'

        if(criteria.search)
            condition += ' and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR mobile LIKE '+ "'%" +criteria.search+ "%'" +' OR LOWER(email) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

        if(criteria.subAdmintotalArtisan)
            condition += ' and FIND_IN_SET( userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM (SELECT ad.id, ad.name, ad.artisanImage, u.mobile, ad.state AS stateName, u.email, u.isActive, ad.userId,role,
                            (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserCraft' AND isActive='1' AND userId=u.id)) AS UserCraft,
                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN (SELECT  name FROM options WHERE type='Userproducts' AND isActive='1' AND userId=u.id)) AS Userproducts,
                             (SELECT GROUP_CONCAT(id) AS title FROM options WHERE  id IN  (SELECT  name FROM options WHERE type='UserMaterial' AND isActive='1' AND userId=u.id)) AS UserMaterial,
                             (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
                             FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId where u.deleted='1'  ORDER BY ad.userId DESC ) AS t1
                             WHERE role='${util.role('artisan')}' ${condition}`;

            // // console.log("query==",query)
            knex.raw(query).then((rows) => {
                let res = util.nullRemove(rows[0])
                resolve(res.length)
            })
                .catch((err) => reject(err));
        });
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const getArtisanById = async (criteria) => {
    let { id } = criteria

    try {

        let artisan = await Artisan.query()
            .alias('ad')
            .select('ad.id', 'ad.name', 'ad.artisanImage', 'ad.kycImage', 'o.name as stateName',
               'ad.state as stateId', `u.mobile`, `u.email`, `u.isActive`, `ad.userId`)
            .leftJoin('users as u', 'u.id', 'ad.userId')
            .leftJoin('options as o', 'ad.state', 'o.id')
            .where('u.isActive', '1')
            .where({ 'ad.id': id })

        let userId = artisan[0].userId

        artisan[0].craft = await getUserCMPDetails({ userId: userId, type: 'UserCraft' })
        artisan[0].material = await getUserCMPDetails({ userId: userId, type: 'UserMaterial' })
        artisan[0].product = await getUserCMPDetails({ userId: userId, type: 'UserProducts' })

        return artisan[0];
    } catch (e) {
        return Promise.reject(e.toString())
    }
}

const addManageListing = async (criteria) => {
    try {
        const id = criteria.id

        delete criteria.id

        // // console.log(criteria)

        if (id && id != 'null') {
            if (!criteria.image) {
                delete criteria.image
            }

            await Options.query()
                .findById(id)
                .patch(criteria)

        } else {
            await Options.query()
                .insert(criteria)

        }

        return Promise.resolve('success')
    } catch (e) {
        msg = "Some error in db query in manage listing addition"
        //    // console.log(msg, e)
        return Promise.reject(msg)
    }
}

const getManageListing = async (criteria) => {
    try {
        const { type } = criteria
        const listing = await Options.query()
            .where({ type })
            .orderBy('id', 'desc')

        return Promise.resolve(listing)
    } catch (e) {
        msg = "Some error in db query in manage listing fetching"
        //    // console.log(msg, e)
        return Promise.reject(msg)
    }
}


const craftChoose = async (criteria) => {
    let userId = criteria.userId
    var craftArr = criteria.craft
    let type = 'UserCraft'
    let isActive = '1'

    var craftArr = craftArr.split(',');
    var name;


    try {
        let res = await Options.query().where('isActive', 1).where('userId', userId).where('type', type)

        if (res.length) {
            await Options.query().where({ userId: userId }).where('type', type).del()
        }

        const craftPromises = craftArr.map(name => knex('options')
        .insert({ type, userId, name ,isActive }))
        await Promise.all(craftPromises)

        // for (index = 0; index < craftArr.length; index++) {
        //     name = craftArr[index]
        //     await Options.query().insert({ type, userId, name, isActive })
        // }

        return
    } catch (e) {
        return msg = []
    }
}


const materialChoose = async (criteria) => {
    let userId = criteria.userId
    var materialArr = criteria.material
    let type = 'UserMaterial'
    let isActive = '1'

    var materialArr = materialArr.split(',')
    var name


    try {
        let res = await Options.query().where('isActive', 1).where('userId', userId).where('type', type)

        if (res.length) {
            await Options.query().where({ userId: userId }).where('type', type).del()
        }

        const materialPromises = materialArr.map(name => knex('options').insert({ type, userId, name ,isActive }))
        await Promise.all(materialPromises)

        // for (index = 0; index < materialArr.length; index++) {
        //     name = materialArr[index]
        //     await Options.query().insert({ type, userId, name, isActive })
        // }
        return
    } catch (e) {
        return msg = []
    }
}


const productChoose = async (criteria) => {
    let userId = criteria.userId
    var productArr = criteria.product
    let type = 'UserProducts'
    let isActive = '1'

    var productArr = productArr.split(',')
    var name


    try {
        let res = await Options.query().where('isActive', 1).where('userId', userId).where('type', type)

        if (res.length) {
            await Options.query().where({ userId: userId }).where('type', type).del()
        }

        const productPromises = productArr.map(name => knex('options').insert({ type, userId, name ,isActive }))
        await Promise.all(productPromises)

        // for (index = 0; index < productArr.length; index++) {
        //     name = productArr[index]
        //     await Options.query().insert({ type, userId, name, isActive })
        // }
        return
    } catch (e) {
        return msg = []
    }
}


const getUserCMPDetails = async (criteria, cb) => {
    let { userId, type } = criteria

    return new Promise((resolve, reject) => {
        let query = `SELECT  id,name FROM options WHERE  id IN (SELECT  NAME FROM options WHERE isActive=1 and userId=${userId} AND TYPE='${type}')`;
        knex.raw(query).then((rows) => {
            resolve(rows[0])
        })
            .catch((err) => reject(err));
    });

}


module.exports = {
    add,
    getArtisan,
    addManageListing,
    getManageListing,
    getArtisanById,
    craftChoose,
    materialChoose,
    productChoose,
    getUserCMPDetails,
    totalArtisan,

}