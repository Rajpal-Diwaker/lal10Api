const Product = require("../../models/product");
const productImageModel = require("../../models/ProductImage");
const knex = require('../../db/knex')
const ProductImage=require('../../models/ProductImage');
const { update } = require("../../db/knex");


const add = async (criteria) => {
  // // console.log("criteria=== assss ",criteria)

  try {
    if (criteria.id && criteria.id != "null") {
      const id = criteria.id;
      delete criteria.id;

      if (!criteria.image) {
          delete criteria.image;
      }

      let checkProductPublish=await knex('products').where({isActive:'1',deleted:'1',id:id,userId:'1'})
      if(checkProductPublish.length){
        await knex('products').update(criteria).where({id:id})
        // console.log("Admin Product is update")
        return id
      }else{
        let checkProductPublish2=await knex('products').where({isActive:'1',deleted:'1',publish:1,id:id})
        if(checkProductPublish2.length){
          await knex('products').update(criteria).where({id:id})
          // console.log("Admin Product is update with publish data...")
        }else{
          await knex('products_log').where({id:id}).del()
          await prductLog(id,criteria);
          // console.log("Admin Product is update Log data with unpublish data.....")
        }
        return id
      }

    } else {

      delete criteria.id;
        const SKU = await util.getUniqueCode("PRODUCT-","products","sku");
        criteria.sku=SKU;
        const response=await Product.query().insert(criteria)
      return response

    }

  } catch (e) {
    return Promise.reject(e.toString())
  }
};


const prductLog = async (id,criteria) => {
  try{
   return new Promise((resolve, reject) => {

        let query = `INSERT INTO products_log (id,name,amount,inventoryQty,material,description,userId,isActive,created_at,doableQty,craft,searchTags,plive,categoryId,subcategoryId,publish,addingBestselling,addingBestsellingComment,deleted,verified,ideal,sku,productId)
        SELECT id,name,amount,inventoryQty,material,description,userId,isActive,created_at,doableQty,craft,searchTags,plive,categoryId,subcategoryId,publish,addingBestselling,addingBestsellingComment,deleted,verified,ideal,sku,id
        FROM products WHERE id='${id}'`;
        // console.log("query",query)
        knex.raw(query).then(async (res) => {
          await knex('products_log').update(criteria).where({productId:id})
          resolve()
        })
    })
  } catch (e) {
    return Promise.reject(e.toString())
  }
}

// change by rajpal on 14 may doing sorting dynamic
const listing = (criteria) => {
  var { page, search } = criteria

  let query;
  let offset,row_count,limits;

  if (page){
    offset = (page - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`
  }

   return new Promise((resolve, reject) => {

    if(page){

      let condition=' 1=1 ';
      let sorting='';

      if(criteria.price){
        let priceArr = {}
        priceArr=criteria.price.split(',')
        condition += 'and amount between ' + "'" +priceArr[0]+ "'" +' and '+ "'" +priceArr[1]+ "'"
      }

      if(criteria.plive==='1')
          condition += 'and inventoryQty >' + "'" + criteria.plive + "'" ;

      if(criteria.plive==='0')
          condition += 'and inventoryQty =' + "'" + criteria.plive + "'" ;

      // if(criteria.userId)
      //     condition ='and userId =' + "'" + criteria.userId + "'" ;

      if(criteria.search)
          condition +='and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(searchTags) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(sku) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(artisanName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(categoryName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(subcategoryName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(material) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
              +' OR LOWER(description) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

      if(criteria.subAdmintotalArtisan)
          condition += ' and FIND_IN_SET(u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

      if(criteria.sort){
            sorting=criteria.sort +' '+criteria.order
        }else{
            sorting="id DESC"
        }
      // console.log("condition",condition)

        query = `select * from (SELECT p.doableQty, (SELECT count(*) FROM enquiries WHERE productId=p.id) AS totalEnquiry,
        (SELECT max(amount) FROM products where deleted ='1' AND isActive = 1 and verified ='1' ORDER BY id desc LIMIT 1 ) AS maxAmount, p.id,p.name,amount,inventoryQty,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
        (CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive, (SELECT NAME FROM roles WHERE id=u.role ) AS roleName,0 as noOfOrder,publish,
        (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=p.material) AS material,
        (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName,
        (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,sku,
        (SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName
        FROM products AS p JOIN users AS u ON p.userId=u.id where p.deleted ='1' AND u.isActive = 1 and verified ='1' ) as tt
        WHERE ${condition} ORDER BY ${sorting} ${limits}`;

        console.log("query===listing",query)

        knex.raw(query).then((res) => {

            let res2=util.nullRemove(res[0]);
            let promiseArr = []
            res2.forEach((element, i) => {
            promiseArr.push( new Promise(async (resolve, reject) => {
                          element['image'] = await getProductImages(element.id)
                          resolve(element)
                          })
                )
            });
            Promise.all(promiseArr).then(values => { resolve(values)});
        })

    }else{

      let condition=' 1=1 ';
      let sorting='';

      if(criteria.price){
        let priceArr = {}
        priceArr=criteria.price.split(',')
        condition += ' and amount between ' + "'" +priceArr[0]+ "'" +' and '+ "'" +priceArr[1]+ "'"
      }

      // if(criteria.search)
      //     condition +='and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR LOWER(searchTags) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR LOWER(description) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'
      if(criteria.search)
        condition +='and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(searchTags) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(sku) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(artisanName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(categoryName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(subcategoryName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(material) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
            +' OR LOWER(description) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

      if(criteria.plive==='1')
          condition += 'and inventoryQty >' + "'" + criteria.plive + "'" ;

      if(criteria.plive==='0')
          condition += 'and inventoryQty =' + "'" + criteria.plive + "'" ;

      if(criteria.subAdmintotalArtisan)
          condition += ' and FIND_IN_SET(u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

        if(criteria.sort){
            sorting=criteria.sort +' '+criteria.order
        }else{
            sorting="id DESC"
        }
          query = `select * from (SELECT p.doableQty, (SELECT max(amount) FROM products where deleted ='1' AND isActive = 1 and verified ='1' ORDER BY id desc LIMIT 1) AS maxAmount, (SELECT count(*) FROM enquiries WHERE productId=p.id) AS totalEnquiry, p.id,p.name,amount,inventoryQty,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
          (CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive, (SELECT NAME FROM roles WHERE id=u.role ) AS roleName,0 as noOfOrder,publish,
          (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=p.material) AS material,
          (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName,sku,
          (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,(SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName
          FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.deleted ='1' AND u.isActive = 1 and verified ='1') as tt
          WHERE ${condition} ORDER BY ${sorting}`;

          // console.log("query===listingalll",query)


          knex.raw(query).then((res) => {

          result=util.nullRemove(res[0]);
            let res2=util.nullRemove(res[0]);
            let promiseArr = []
            res2.forEach((element, i) => {
            promiseArr.push( new Promise(async (resolve, reject) => {
                          element['image'] = await getProductImages(element.id)
                          resolve(element)
                          })
                )
            });
            Promise.all(promiseArr).then(values => { resolve(values)});
        })
     }
   })
  }


const totalProduct = (criteria) => {

  let condition=' 1=1 ';

  if(criteria.price){
    let priceArr = {}
    priceArr=criteria.price.split(',')
    condition += 'and amount between ' + "'" +priceArr[0]+ "'" +' and '+ "'" +priceArr[1]+ "'"
  }

  if(criteria.plive==='1')
      condition += 'and inventoryQty >' + "'" + criteria.plive + "'";

  if(criteria.plive==='0')
      condition += 'and inventoryQty =' + "'" + criteria.plive + "'" ;

  // if(criteria.userId)
  //     condition ='and userId =' + "'" + criteria.userId + "'" ;

  // if(criteria.search)
  //   condition +='and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR LOWER(searchTags) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'" +' OR LOWER(description) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'

  if(criteria.search)
    condition +='and (LOWER(name) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(searchTags) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(sku) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(artisanName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(categoryName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(subcategoryName) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(material) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"
        +' OR LOWER(description) LIKE '+ "'%" +criteria.search.toLowerCase()+ "%'"+')'


  if(criteria.subAdmintotalArtisan)
    condition += ' and FIND_IN_SET(u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

   return new Promise((resolve, reject) => {

      query = `select * from (SELECT p.id,p.name,amount,inventoryQty,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
      (CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive, (SELECT NAME FROM roles WHERE id=u.role ) AS roleName,0 as noOfOrder,publish,
      (SELECT name FROM options WHERE TYPE='material' AND isActive='1' AND id=p.material) AS material,
      (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName,sku,
      (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,(SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName
      FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.deleted ='1' AND u.isActive = 1
      and verified ='1' ) as tp WHERE ${condition} `;

      // // console.log("query===totalProduct",query)

      knex.raw(query).then((res) => {
          result=util.nullRemove(res[0]);
          resolve(result.length)
      })
   })
  }

const changeStatus = async (criteria) => {
  try {
    let id = criteria.id;
    delete criteria.id;
    await Product.query().findById(id).patch(criteria);
  } catch (e) {
    return Promise.reject(e.toString())
  }
};

const uploadImage = async (criteria) => {

  // console.log("criteria==",criteria)

  try {

    // var response=await productImageModel.query().insert(criteria);
    var response=await knex('productImage').insert(criteria)

    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e.toString())
  }
};

const removeImage = async (productId) => {
  var Arr = productId[0]
  var idsArr = Arr.split(',');
  try {

    const removeImagePromises = idsArr.map(element => ProductImage.query().where('id',element).del())
      await Promise.all(removeImagePromises)

        // for(index=0;index<idsArr.length;index++){
        //     // await ProductImage.query().update({isActive:0}).where('id',idsArr[index])
        //     await ProductImage.query().where('id',idsArr[index]).del()
        // }

      return;
    } catch (e) {
      return Promise.reject(e.toString())
    }
};


const getProductImages = async (productId) => {
  try {
        const res = await ProductImage.query()
                              .select('id','image')
                              .where('isActive', '=', 1)
                              .where('productId', '=', productId)

        return res
    } catch (e) {
      return Promise.reject(e.toString())
    }
}

const ProductChangeStatus = async (criteria) => {
  try {
    let id = criteria.id;
    delete criteria.id;
    await Product.query().findById(id).patch(criteria);
  } catch (e) {
    return Promise.reject(e.toString())
  }
};


module.exports = {
  add,
  listing,
  changeStatus,
  uploadImage,
  getProductImages,
  removeImage,
  ProductChangeStatus,
  totalProduct,
};
