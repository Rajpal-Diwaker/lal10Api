const users = require('../../models/users')
const uploads = require('../../models/uplods')
const options = require('../../models/options')
const cart = require('../../models/cart')
const cartRelation = require('../../models/CartRelation')
const enquiry = require('../../models/Enquiries')
const card = require('../../models/card')
const address = require('../../models/address')
const newsfeed = require('../../models/newsfeed')
const cms = require('../../models/cms')
const onboarding = require('../../models/onboarding')
const products = require('../../models/product')
const artisan = require('../../models/artisan')
const productImage=require('../../models/ProductImage')

const knex = require('../../db/knex')

const models = {
    users, uploads, options, cart,
    cartRelation, enquiry, card, address,
    newsfeed, cms, onboarding, products, artisan
}

const editEntity = async (criteria) => {
    try {
        const { id, type } = criteria
        let identity = id, modelType = type

        delete criteria['id']
        delete criteria['type']

        await models[modelType].query()
        .findById(identity)
        .patch(criteria);

        return Promise.resolve('success')
    } catch (e) {
       msg = "Some error in db edit query"
    //    // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const deleteEntity = async (criteria) => {
    try {
        const { id, type } = criteria

        await models[type].query()
        .deleteById(id)

        return Promise.resolve('success')
    } catch (e) {
       msg = "Some error in db delete query"
    //    // console.log(msg, e)
       return Promise.reject(msg)
    }
}

const editData = async (criteria) => {
    // try {
        const { id, type } = criteria

        const result = await models[type].query()
        .findById(id)

        if(type=="options"){
              if(result){

                if(result.craftId)
                    result.craftArr=await getType(result.craftId,'craft')
                else
                    result.craftArr=[]

                if(result.materialId)
                    result.materialArr=await getType(result.materialId,'material')
                else
                    result.materialArr=[]

                if(result.stateId)
                    result.stateArr=await getType(result.stateId,'state')
                else
                    result.stateArr=[]
                // console.log("dt",result)

                return Promise.resolve(result)
              }
              return Promise.resolve(result)
        }else{
            return Promise.resolve(result)
        }

    // } catch (e) {
    //    msg = "Some error in db edit data query"
    // //    // console.log(msg, e)
    //    return Promise.reject([])
    // }
}


const getType = async (ids,types) => {
  try {
    return new Promise((resolve) => {
      let query;
      if(types==="craft"){
        // query = `select id,name,0 as isDisabled from options where CONCAT(",", id, ",") REGEXP ",(${id})," `
        query = `select id,name,0 as isDisabled from options where FIND_IN_SET(id,'${ids}')`
      }
      if(types==="material"){
            // query = `select id,name,0 as isDisabled from options where CONCAT(",", id, ",") REGEXP ",(${id}),"`
            query = `select id,name,0 as isDisabled from options where FIND_IN_SET(id,'${ids}')`
      }
      if(types==="state"){
        query = `select id,name,0 as isDisabled from options where FIND_IN_SET(id,'${ids}')`
     }
         // console.log("quesry==",query)

         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
          // console.log("res2",res2)
          resolve(res2);
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const addEntity = async (criteria) => {
    try {

        let type = criteria.modelType
        delete criteria.modelType

        if(criteria.type == 'Banner'){
            const res = await knex('cms').where({'isActive':'1','deleted':'1','type':'Banner'}).orderBy('seqId','desc').limit(1)
            if(res.length){
                let nextValue=res[0].seqId+1;
                criteria.seqId=nextValue;
            }

            // console.log("res",res)
        }

        await models[type].query().insert(criteria)

    } catch (e) {
       msg = "Some error in db add query"
       return Promise.reject('reject')
    }
}



const filterEntity = async (criteria) => {
    try {
        const { col, val, modelType } = criteria

        let filterOb = {
            [col]: val
        };
        let result = []
        if(val.split('-').length>1){
            const valArr = val.split('-')

            result = await models[modelType]
            .query()
            .where(col, '>=', valArr[0])
            .where(col, '<=', valArr[1])

        }else{
            result = await models[modelType]
            .query()
            .where(filterOb)
        }

        return result
    } catch (e) {
       msg = "Some error in db add query"
    //    // console.log(msg, e)
    return Promise.reject(e.toString())
    }
}

const getProductImages = async (productId) => {
    try {
            const res = await knex('productImage')
                        .select('image','id')
                        .where('isActive', '=', 1)
                        .where('productId', '=', productId)
       return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
}


const addInfographics = async (criteria) => {
    // console.log("criteria,",criteria)
    try {

        if (criteria.type[0]==='India'){
              let id

              let res=await knex('infographics').where('type',criteria.type);

                if(res.length){
                        id=res[0].id
                        await knex('infographics').update(criteria).where('id',id)
                }else
                    await knex('infographics').returning('id').insert(criteria)

                // console.log("id===",id)
        }

        if (criteria.type==='Country'){
            let id

            let res=await knex('infographics').where('type',criteria.type);
            if(res.length)
                {
                    id=res[0].id
                    await knex('infographics').update(criteria).where('id',id)
                }
            else
             await knex('infographics').returning('id').insert(criteria)
        }

    } catch (e) {
       msg = "Some error in db query in adding Infographics"
       // console.log(msg, e)
       return Promise.reject(msg)
    }
}

// const InfographicsState = async (state,totalArtisan,id,type) => {
//     try {

//         if(type=='India'){
//             // console.log("state==",state)
//             var stateArr2 = state.split(',');
//             var totalArtisan2 = totalArtisan.split(',');
//             await knex('infographics_states').where({info_id:id}).del()

//                 for(index=0;index<stateArr2.length;index++){
//                     await knex('infographics_states').insert({ state:stateArr2[index],totalArtisan:totalArtisan2[index],info_id:id})

//                     }
//         }

//         if(type!='India'){
//             // console.log("state==",state)
//             var stateArr2 = state.split(',');
//                 await knex('infographics_states').where({info_id:id}).del()
//                 for(index=0;index<stateArr2.length;index++){
//                     await knex('infographics_states').insert({ state:stateArr2[index],info_id:id})

//                     }
//         }

//        return
//     } catch (e) {
//        return msg = []
//     }
// }

const getInfographics = async (type) => {
    try {
         const res = await knex('infographics')
                          .where('type',type)

        let result=util.nullRemove(res);

       return result;
    } catch (e) {
       return msg = []
    }
}

const delInfographicsState = async (id) => {
    try {
            await knex('infographics_states')
                          .where('id',id).del()

       return
    } catch (e) {
       return msg = []
    }
}


module.exports = {
    deleteEntity,
    editEntity,
    editData,
    addEntity,
    filterEntity,
    getProductImages,
    addInfographics,
    getInfographics,
    delInfographicsState,
}