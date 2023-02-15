const Users = require('../../models/users')
const Artisan = require("../../models/artisan");
const Category = require("../../models/category");
const knex = require("../../db/knex");
const util = require("../../Utilities/util");
const Enquiries = require("../../models/Enquiries");
const app_dao = require("../../dao/v2/appdao");
const csv = require("csv-parser");
const fs = require("fs");
const csvToJson = require("csvtojson");
const { execFileSync } = require("child_process");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { del } = require('../../db/knex');

const dashboard = async () => {
  try {
    const ob = {
      artisan: 0,
      enquiry: 0,
      order: 0,
      shop: 0,
      product: 0,
      barLabel: [],
      barData: []
    };


    const productsRes = await knex('products as p').join("users as u", "p.userId","u.id")
    .select(knex.raw('YEAR(p.created_at) AS yr'))
    .count(`p.id AS cnt`)
    .where("p.deleted", "1")
    .where("u.deleted", "1")
    .groupByRaw(`YEAR(p.created_at)`)


    //product array
    const productData = [], barLabel = []
    productsRes.forEach(ob => {
      const {cnt, yr} = ob

      barLabel.push(yr)
      productData.push(cnt)
    })

    ob.barData.push({
      data: productData, label: 'Product'
    })

    //material array

    const materialRes = await knex('options')
    .select(knex.raw('YEAR(created_at) AS yr'))
    .count(`id AS cnt`)
    .where({'type': 'material'})
    .groupByRaw(`YEAR(created_at)`);


    const materialData = []
    materialRes.forEach(ob => {
      const {cnt, yr} = ob

      barLabel.push(yr)
      materialData.push(cnt)
    })

    ob.barData.push({
      data: materialData, label: 'Material'
    })

    // Craft array
    const craftRes = await knex('options')
    .select(knex.raw('YEAR(created_at) AS yr'))
    .count(`id AS cnt`)
    .where({'type': 'craft'})
    .groupByRaw(`YEAR(created_at)`);


    const craftData = []
    craftRes.forEach(ob => {
      const {cnt, yr} = ob

      barLabel.push(yr)
      craftData.push(cnt)
    })

    ob.barData.push({
      data: craftData, label: 'Craft'
    })

    ob.barLabel = Array.from(new Set(barLabel))

    ob.artisan = await totalArtisan();
    ob.shop = await totalShop();
    ob.product = await totalProduct();
    ob.enquiry = await totalEnquiry();
    ob.order = await totalOrder();

    return ob;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const totalArtisan = () => {
  try {
    return new Promise((resolve, reject) => {
      let query = `SELECT count(t1.id) as total FROM users as t1 join artisan_details as t2 on t1.id=t2.userId where t1.deleted='1' and role='2'`;
      knex
        .raw(query)
        .then((res) => {
          const res2 = util.nullRemove(res[0]);
          resolve(res2[0].total);
        })

        .catch((err) => reject(err));
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const totalOrder = () => {
  try {
    return new Promise((resolve, reject) => {
      let query = `select count(t2.id) as total from enquiries as t1 join enquiry_order as t2 on t1.id=t2.enqId where t1.deleted='1' and t2.orderAccept='1'`;
      knex
        .raw(query)
        .then((res) => {
          const res2 = util.nullRemove(res[0]);
          resolve(res2[0].total);
        })

        .catch((err) => reject(err));
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const totalProduct = () => {
  try {
    return new Promise((resolve, reject) => {
      // let query = `SELECT count(id) as total FROM products WHERE isActive = 1`;
      let query=`SELECT count(p.id) as total FROM products AS p JOIN users AS u ON p.userId=u.id WHERE  p.deleted ='1' AND u.deleted = '1'`;
      knex.raw(query).then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2[0].total);
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const totalShop = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT count(p.id) as total FROM products AS p JOIN users AS u ON p.userId=u.id WHERE  p.deleted ='1' AND u.deleted = '1' and verified='1' and inventoryQty>0`;
    knex.raw(query).then((rows) => {
      let res = util.nullRemove(rows[0]);
      resolve(res[0].total);
    });
  });
};

const totalEnquiry = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT count(id) as total FROM enquiries WHERE isActive = 1 and deleted='1'`;
    knex.raw(query).then((rows) => {
      let res = util.nullRemove(rows[0]);
      resolve(res[0].total);
    });
  });
};

const getCategory = (criteria) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT c.* ,(SELECT COUNT(id) FROM products WHERE deleted='1' AND c.id=categoryId) AS totalProduct,
    (SELECT COUNT(id) FROM category  AS cc WHERE deleted='1' AND c.id=cc.parentId) AS totalsubCategoryId
    FROM category  AS c WHERE isBestSelling=${criteria.isBestSelling} AND deleted='1' AND parentId='1' order by id desc`;

    // // console.log("rows[0]",query)

    knex
      .raw(query)
      .then((rows) => {
        // // console.log("rows[0]",rows[0])
        resolve(rows[0]);
      })
      .catch((err) => reject(err));
  });
};

const getSubCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT c.* ,(SELECT COUNT(id) FROM products WHERE deleted='1' AND c.id=subcategoryId) AS totalProduct,
    (SELECT COUNT(id) FROM category  AS cc WHERE deleted='1' AND cc.parentId=c.id) AS totalsubCategoryId
    FROM category  AS c WHERE deleted='1' AND parentId=${categoryId} order by id desc`;

    knex
      .raw(query)
      .then((rows) => {
        resolve(rows[0]);
      })
      .catch((err) => reject(err));
  });
};


const getSubSubCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT c.* ,(SELECT COUNT(id) FROM products WHERE deleted='1' AND subsubcategoryId=c.id) AS totalProduct,
      (SELECT COUNT(id) FROM category  AS cc WHERE deleted='1' AND cc.parentId=c.id) AS totalsubCategoryId
      FROM category  AS c WHERE deleted='1' AND parentId=${categoryId} order by id desc`;

      knex
        .raw(query)
        .then((rows) => {
          resolve(rows[0]);
        })
        .catch((err) => reject(err));
    });
};

// old code change by rajpal date 14 may
// const getEnquiries = async (criteria) => {
//   try {

//     var { type, page } = criteria

//     let offset,row_count,limits;

//     if (page){
//       offset = (page - 1) * 10;
//       row_count = 10;
//       limits = `limit ${offset}, ${row_count}`
//     }

//     return new Promise((resolve, reject) => {
//       query = `SELECT e.id,uniqueId,productId,title,description,typeofEnquiry,isGenrate,ud.name,u.email,pproductId,
//             mailBy,mailSubject,mailBody,CONCAT(date(e.created_at),'T00:00:00.000Z')  as created_at  from enquiries as e
//             join users as u on e.userId=u.id
//             join user_details as ud on u.id=ud.userId
//             where u.isActive='1' and e.isActive='1'
//             and e.typeofEnquiry='${type}' and  e.deleted='1' and isGenrate='0'
//             order by id desc ${limits}`;
//             // order by id desc ${limits}`;

//             console.log("query",query)

//       knex.raw(query).then((res) => {
//         let dt=util.nullRemove(res[0]);

//         console.log("dt=><<>",dt)

//         resolve(dt);
//       })
//  });

//     // let res = await knex("enquiries as e")
//     //   .join("users as u", "e.userId", "u.id")
//     //   .join("user_details as ud", "u.id", "ud.userId")
//     //   .where("u.isActive", "1")
//     //   .where("e.isActive", "1")
//     //   .where("e.typeofEnquiry", type)
//     //   .where("e.deleted", "1")
//     //   .where("e.isGenrate", "0")
//     //   .select(
//     //     "e.id",
//     //     "uniqueId",
//     //     "productId",
//     //     "title",
//     //     "description",
//     //     "typeofEnquiry",
//     //     "isGenrate",
//     //     "ud.name",
//     //     "u.email",
//     //     "mailBy",
//     //     "mailSubject",
//     //     "mailBody",
//     //     "e.created_at"
//     //   ).limit(limits).offset(offset)

//     // // console.log("res===", res);
//     // res = util.nullRemove(res);

//     // return res;
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };



// change by rajpal on 14 may doing sorting dynamic
const getEnquiries = async (criteria) => {
  try {

    var { type, page } = criteria

    let offset,row_count,limits;
    let sorting=""

    if (page){
      offset = (page - 1) * 10;
      row_count = 10;
      limits = `limit ${offset}, ${row_count}`
    }

    if(criteria.sort){
      sorting=criteria.sort +' '+criteria.order
    }else{
        sorting="id DESC"
    }

    return new Promise((resolve, reject) => {
      query = `select * from (SELECT e.id,uniqueId,productId,title,description,typeofEnquiry,isGenrate,ud.name,u.email,pproductId,ud.name as artisanName,
            mailBy,mailSubject,mailBody,CONCAT(date(e.created_at),'T00:00:00.000Z')  as created_at  from enquiries as e
            join users as u on e.userId=u.id
            join user_details as ud on u.id=ud.userId
            where u.isActive='1' and e.isActive='1'
            and e.typeofEnquiry='${type}' and  e.deleted='1' and isGenrate='0') as tmp
            order by ${sorting} ${limits}`;
            // order by id desc ${limits}`;
            console.log("query",query)

      knex.raw(query).then((res) => {
        let dt=util.nullRemove(res[0]);
        // console.log("dt=><<>",dt)
        resolve(dt);
      })
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const getTotalEnquiries = async (type) => {
  try {
    const res = await knex("enquiries as e")
      .join("users as u", "e.userId", "u.id")
      .join("user_details as ud", "u.id", "ud.userId")
      .where("u.isActive", "1")
      .where("u.deleted", "1")
      .where("e.isActive", "1")
      .where("e.typeofEnquiry", type.type)
      .where("e.deleted", "1")
      .where("e.isGenrate", "0")
      .select(
        "e.id",
        "uniqueId",
        "productId",
        "title",
        "description",
        "isGenrate",
        "ud.name",
        "u.email",
        "mailBy",
        "mailSubject",
        "mailBody",
        "e.created_at","pproductId"
      )
    return res.length;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getEnquiryById = async (id) => {
  try {
    const res = await knex("enquiries as e")
      .join("users as u", "e.userId", "u.id")
      .join("user_details as ud", "u.id", "ud.userId")
      .where("u.isActive", "1")
      .where("u.deleted", "1")
      .where("e.isActive", "1")
      .where("e.deleted", "1")
      .where({ "e.id": id })
      .select(
        "e.id",
        "uniqueId",
        "productId",
        "title",
        "description",
        "isGenrate",
        "ud.name",
        "u.email",
        "mailBy",
        "mailSubject",
        "mailBody",
        "e.created_at",
        "craftId",
        "materialId",
        "update_status",
        "requestTo",
        "e.qty",
        "e.expPrice","pproductId","estateId"
      );

    let responce = util.nullRemove(res);
    responce[0]["mailBody"]=responce[0]["mailBody"].replace( /(<([^>]+)>)/ig, '').replace(/\n\s*\n/g, '\n');
    responce[0]["mailBody"]=responce[0]["mailBody"].replace(/<style.*<\/style>/g, '').replace( /(<([^>]+)>)/ig, '').replace(/\n\s*\n/g, '\n');

    responce[0]["attachment"] = await getEnquiriesAtachment(id);
    responce[0]["requestTo2"] = await getrequestTo2GroupName(responce[0]['requestTo']);
    return responce[0];
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getrequestTo2GroupName = async (id) => {
  try {

    if(id.length){

      let dta=id.split(",");
      let allDta = dta.indexOf("All");

      if(allDta>-1){

        // console.log("All Exist")
        // return [{"requestTo":"All"}];
        return [{"id":0,"group_name":"All"}];
      }else{
        // console.log("All not exist")
        let query =`select id,group_name from artisan_group where id in (${dta})`;
        let responces = await knex.raw(query);
        return responces[0];
      }
    }else{
      return [];
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getEnquiriesAtachment = async (id) => {
  try {
    res = await knex("enquiry_attachment")
      .select("id", "attachment")
      .where({ enqId: id });

    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editEnquiry = async (criteria) => {
  // const { id,craftId,requestTo,type,mailBy,mailSubject,mailBody } = criteria
  try {
    if (criteria.type == "3") {
      res = await knex("enquiries")
        .update({ craftId: criteria.craftId, isGenrate: criteria.requestTo })
        .where({ id: criteria.id });
    }

    if (criteria.type == "2") {
      res = await knex("enquiries")
        .update({
          craftId: criteria.craftId,
          isGenrate: criteria.requestTo,
          mailBy: criteria.mailBy,
          mailSubject: criteria.mailSubject,
          mailBody: criteria.mailBody,
        })
        .where({ id: criteria.id });
    }

    if (criteria.type == "1") {
      res = await knex("enquiries")
        .update({ craftId: criteria.craftId, isGenrate: criteria.requestTo })
        .where({ id: criteria.id });
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getWebUser = (criteria) => {
  try {
    if (!criteria.limit) criteria.limit = 10;

    if (!criteria.offset) criteria.offset = 0;

    let condition = " and 1=1 ";

    if (criteria.typeofstore)
      condition += "and type=" + "'" + criteria.typeofstore + "'";

    if (criteria.customerImportant)
      condition +=
        "and customerImportant=" + "'" + criteria.customerImportant + "'";

    if (criteria.categoryId)
      condition +=
        "and FIND_IN_SET(" +
        "'" +
        criteria.categoryId +
        "'" +
        " ,categroyId " +
        ")";

    if (criteria.search)
      condition +=
        "AND (mobile LIKE" +
        "'%" +
        criteria.search +
        "%'" +
        "OR email LIKE" +
        "'%" +
        criteria.search +
        "%'" +
        "OR artisanName LIKE" +
        "'%" +
        criteria.search +
        "%'" +
        "OR postalCode LIKE" +
        "'%" +
        criteria.search +
        "%'" +
        ")";

    // condition += " limit " + criteria.limit + " offset " + criteria.offset;

    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM (SELECT u.id AS userId,mobile,email,isActive,NAME AS artisanName,s.type,
        postalCode,customerImportant,is_verified,role,deleted,(SELECT GROUP_CONCAT(categoryId )
        FROM user_product_sell WHERE userId=u.id) AS categroyId FROM users AS u  JOIN user_details AS
        ud ON u.id=ud.userId  JOIN store s ON u.id=s.userId order by u.id desc ) AS t1 where deleted='1'
        and isActive='1' and role='${util.role("enduser")}' and is_verified='1' ${condition}`;


      knex.raw(query).then((res) => {
        let res2 = util.nullRemove(res[0]);

        let promiseArr = [];

        res2.forEach((element, i) => {
          promiseArr.push(
            new Promise(async (resolve, reject) => {
              element["category"] = await getWebUserCategory(element.userId);
              resolve(element);
            })
          );
        });
        Promise.all(promiseArr).then((values) => {
          resolve(values);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getWebUserById = async (id) => {
  let res;
  try {
    res = await knex("users as u")
      .join("user_details as ud", "u.id", "ud.userId")
      .join("store as s", "u.id", "s.userId")
      .where({ isActive: 1 })
      .where("u.id", id)
      .select(
        "u.id as userId",
        "name as artisanName",
        "email",
        "mobile",
        "country",
        "s.type as typeofstore",
        "store as storeName"
      )
      .select("year", "annualSale", "customerImportant");
    // .groupBy('u.id')

    res[0]["sellcategories"] = await getWebUserCategory(res[0].userId);
    res[0]["hearaboutus"] = await getWebUserHearAboutUs(res[0].userId);

    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getWebUserCategory = async (id) => {
  try {
    let res = await knex("user_product_sell as up")
      .join("category as c", "up.categoryId", "c.id")
      .where({ isActive: 1 })
      .where("up.userId", id)
      .select("categoryId", "title as categoryName")
    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getWebUserHearAboutUs = async (id) => {
  try {
    let res = await knex("aboutus_user as au")
      .join("aboutus_sample as as", "au.typeId", "as.id")
      .where("au.userId", id)
      .select("as.id", "type as title");
    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const GroupListing = async (id) => {
  try {
    let res = await knex("artisan_group as au").orderBy("id", "desc");

    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const GroupListing2 = (criteria) => {
  var { page } = criteria

  let query;
  let offset,row_count,limits;

  if (page){
    offset = (page - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`
  }

   return new Promise((resolve, reject) => {
        query = `SELECT * from artisan_group order by id desc ${limits}`;
        knex.raw(query).then((res) => {
          let dt=util.nullRemove(res[0]);
          resolve(dt);
        })
   })
  }



const GroupListing2Total = (criteria) => {
   return new Promise((resolve, reject) => {
        query = `SELECT * from artisan_group`;
        knex.raw(query).then((res) => {
          let dt=util.nullRemove(res[0]);
          resolve(dt.length);
        })
   })
  }

const checkGroupName = async (group_name) => {
  try {
    let res = await knex("artisan_group")
      .where("isActive", 1)
      .where("group_name", group_name);
    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const addGroup = async (criteria) => {
  try {
    let res = await knex("artisan_group").insert({
      group_name: criteria.group_name,
      total_artisan: criteria.total_artisan,
      craft: criteria.craft,
      created_by: criteria.userId,
    });
    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editGroup = async (criteria) => {
  // // console.log("criteria==",criteria)
  try {
    await knex("artisan_group")
      .update({
        group_name: criteria.group_name,
        total_artisan: criteria.total_artisan,
        craft: criteria.craft,
        created_by: criteria.userId,
      })
      .where({ id: criteria.id });

    return;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const deleteGroup = async (id) => {
  try {
    await knex("artisan_group").where({ id: id }).del();
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

// const ProductGroupListing = async (id) => {
//   try {
//     // let res = await knex("product_group as au");
//     // return util.nullRemove(res);
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };

const ProductGroupListing = (criteria) => {
  var { page } = criteria

  let query;
  let offset,row_count,limits;

  if (page){
    offset = (page - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`
  }

   return new Promise((resolve, reject) => {
        query = `SELECT * from product_group ${limits}`;
        console.log(query)
        knex.raw(query).then((res) => {
          let dt=util.nullRemove(res[0]);
          resolve(dt);
        })
   })
  }


  // resolve(result.length)

  const totalProductGroup = (criteria) => {

     return new Promise((resolve, reject) => {

          query = `SELECT * from product_group `;

          knex.raw(query).then((res) => {
            let result=util.nullRemove(res[0]);
            resolve(result.length)
          })
      })
    }


const checkProductGroupName = async (group_name) => {
  try {
    let res = await knex("product_group")
      .where("isActive", 1)
      .where("group_name", group_name);
    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const addProductGroup = async (criteria) => {
  try {
    let res = await knex("product_group").insert({
      group_name: criteria.group_name,
      total_product: criteria.total_product,
      craft: criteria.craft,
      created_by: criteria.userId,
    });
    return util.nullRemove(res);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editProductGroup = async (criteria) => {
  // // console.log("criteria==",criteria)
  try {
    await knex("product_group")
      .update({
        group_name: criteria.group_name,
        total_product: criteria.total_product,
        craft: criteria.craft,
        created_by: criteria.userId,
      })
      .where({ id: criteria.id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const deleteProductGroup = async (id) => {
  try {
    await knex("product_group").update({ isActive: 0 }).where({ id: id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const changeStatus = async (criteria) => {
  try {
    let id = criteria.id;
    let type = criteria.type;

    delete criteria.type;
    delete criteria.id;

    await knex(`${type}`).update(criteria).where({ id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const checkUserMobile = async (criteria) => {
  let { mobile, type } = criteria;
  let user;
  try {
    if (type == "artisan") {
      user = await knex("users")
        .where("mobile", "=", mobile)
        .where("role", "=", util.role("artisan"))
        .where("isActive", "=", 1)
        .where("deleted", "!=", 1)
    } else {
      user = await knex("users")
        .select("id")
        .where("mobile", "=", mobile)
        .where("role", "=", util.role("enduser"))
        .where("isActive", "=", 1)
        .where("deleted", "!=", 1)
    }
    return user;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const checkUser = async (criteria) => {
  let { email, type } = criteria;
  let user;
  try {
    if (type == "artisan") {
      user = await knex("users")
        .where("email", "=", email)
        // .where("role", "=", util.role("artisan"))
        .where("isActive", "=", 1)
        .where("deleted", "!=", 1)
    } else {
      user = await knex("users")
        .where("email", "=", email)
        // .where("role", "=", util.role("enduser"))
        .where("isActive", "=", 1)
        .where("deleted", "!=", 1)
    }

    return user;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const checkCategoryName = async (criteria) => {
  try {
    let res = await Category.query()
      .where("title", criteria.name)
      .where("isActive", 1);
    //  // console.log("res==",res)
    return res;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const addCategory = async (criteria) => {
  try {

    if(criteria.userId === util.role('admin'))
      criteria.verified='1';
    else
      criteria.verified='0';

    await Category.query().insert({
      title: criteria.name,
      userId: criteria.userId,
      verified: criteria.verified,
      image: criteria.image,
      banner_image: criteria.banner_image,
      parentId: 1,
    })

  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editCategory = async (criteria) => {
  try {
    await Category.query()
      .update({
        title: criteria.name,
        image: criteria.image,
        banner_image: criteria.banner_image,
      })
      .where({ id: criteria.id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const checkSubCategoryName = async (criteria) => {
  try {
    let res = await Category.query()
      .where("title", criteria.name)
      .where("isActive", 1)
      .where("parentId", criteria.parentId);

    return res;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const addSubCategory = async (criteria) => {
  try {
    // await Category.query().insert({
    //   title: criteria.name,
    //   image: criteria.image,
    //   banner_image: criteria.banner_image,
    //   parentId: criteria.parentId,
    // });

    if(criteria.userId === util.role('admin'))
    criteria.verified='1';
  else
    criteria.verified='0';

  await Category.query().insert({
    title: criteria.name,
    userId: criteria.userId,
    verified: criteria.verified,
    image: criteria.image,
    banner_image: criteria.banner_image,
    parentId: criteria.parentId,
  })


  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editSubCategory = async (criteria) => {
  try {
    await Category.query()
      .update({
        title: criteria.name,
        image: criteria.image,
        banner_image: criteria.banner_image,
      })
      .where({ id: criteria.id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const listingCms = async (criteria) => {
  try {
      let res;
      if(criteria.type=="Banner"){
          res = await knex("cms")
          .where({ type: criteria.type })
          .where({ viewType: criteria.viewType })
          .orderBy('seqId')


      }else{

        res = await knex("cms")
        .where({ type: criteria.type })
        .where({ viewType: criteria.viewType })


      }


    return res;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getshop = (criteria) => {
  let { limit } = criteria;

  let offset, row_count, limits;

  if (limit) {
    offset = (limit - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`;
  }

  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET( u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

    return new Promise((resolve) => {
      if (limit) {
        const query = `SELECT  p.id,p.name,amount,material,inventoryQty,material,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
                        (CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive, (SELECT NAME FROM roles WHERE id=u.role ) AS roleName,0 as noOfOrder,publish,
                        (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,(SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName,
                        (SELECT name FROM options WHERE TYPE='material' AND id=p.material) AS material,(SELECT image FROM productImage WHERE productId=p.id AND isActive='1' LIMIT 1) AS image,
                        (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName, 'Admin' AS uploadedBy
                        FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.deleted = '1' AND u.deleted = '1'  and verified ='0'
                        ${condition} ORDER BY id DESC ${limits}`;

        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);

          resolve(res2);
        });
      } else {
        const query = `SELECT  p.id,p.name,amount,material,inventoryQty,material,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
                    (CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive, (SELECT NAME FROM roles WHERE id=u.role ) AS roleName,0 as noOfOrder,publish,
                    (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,(SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName,
                    (SELECT name FROM options WHERE TYPE='material' AND id=p.material) AS material,(SELECT image FROM productImage WHERE productId=p.id AND isActive='1' LIMIT 1) AS image,
                    (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName, 'Admin' AS uploadedBy
                    FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.deleted = '1' AND u.deleted = '1'
                    and verified='0' ${condition} ORDER BY id DESC`;
        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);
          // console.log("asaaaaaaaaaa",query)
          resolve(res2);
        });
      }
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getTotalshopCount = (criteria) => {
  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET(u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

    return new Promise((resolve) => {
      const query = `SELECT  p.id FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.isActive = 1
      AND u.isActive = 1 and verified='0'  ${condition}`;

      // console.log("asaaaaaaaaaa",query)

      knex.raw(query).then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2.length);
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getIdealshop = (criteria) => {
  let { limit } = criteria;

  // if (limit){
  //   limit = 10*limit
  //   offset = limit-10
  // }

  let offset, row_count, limits;

  if (limit) {
    offset = (limit - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`;
  }

  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET( u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

    return new Promise((resolve) => {
      if (limit) {
        const query = `SELECT  p.id,p.name,amount,material,inventoryQty,material,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
                (CASE WHEN inventoryQty>0 THEN 1  ELSE 0 END) AS plive, (SELECT NAME FROM roles WHERE id=u.role ) AS roleName,0 as noOfOrder,publish,doableQty,
                (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,(SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName,
                (SELECT name FROM options WHERE TYPE='material' AND id=p.material) AS material,(SELECT image FROM productImage WHERE productId=p.id AND isActive='1' LIMIT 1) AS image,
                (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.isActive = 1 AND u.isActive = 1
                and ideal ='1' ${condition} ORDER BY id DESC ${limits}`;
        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);

          // console.log("query",query)

          resolve(res2);
        });
      } else {
        const query = `SELECT  p.id,p.name,amount,material,inventoryQty,material,description,p.isActive,searchTags,categoryId,subcategoryId,addingBestselling,addingBestsellingComment,
                    (SELECT title FROM category WHERE id=p.categoryId) AS categoryName,(SELECT title FROM category WHERE id=p.subcategoryId) AS subcategoryName,doableQty,
                    (SELECT name FROM options WHERE TYPE='material' AND id=p.material) AS material,(SELECT image FROM productImage WHERE productId=p.id AND isActive='1' LIMIT 1) AS image,
                    (SELECT name FROM artisan_details WHERE userId=p.userId) AS artisanName
                    FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.isActive = 1 AND u.isActive = 1 and ideal ='1'
                    ${condition} ORDER BY id DESC`;
        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);

          // console.log("querygetIdealshop",query)

          resolve(res2);
        });
      }
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getTotalIdealProduct = (criteria) => {
  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET( u.id,'+"'" + criteria.subAdmintotalArtisan + "'"+')'


    return new Promise((resolve) => {
      const query = `SELECT  p.id FROM products AS p JOIN users AS u ON p.userId=u.id WHERE p.isActive = 1
      AND u.isActive = 1 and ideal ='1' ${condition}`;
      knex.raw(query).then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2.length);
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const makeIdealProduct = async (ids) => {
  let idsArr = ids;
  let idArr = idsArr.split(",");

  try {
    for (index = 0; index < idArr.length; index++) {
      await knex("products")
        .update({ ideal: "1" })
        .where({ id: idArr[index] })

    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getFromAllProduct = (criteria) => {
  let { limit } = criteria;

  // if (limit){
  //   limit = 10*limit
  //   offset = limit-10
  // }

  let offset, row_count, limits;

  if (limit) {
    offset = (limit - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`;
  }

  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET(userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

    return new Promise((resolve) => {
      if (limit) {
        const query = `SELECT  id,name,0 AS websiteView,(SELECT COUNT(id) FROM enquiries WHERE productId=products.id AND deleted='1') AS totalEnqCount,
                (SELECT COUNT(e.id) FROM enquiries AS e JOIN enquiry_order  AS eo ON  e.id=eo.EnqId  WHERE productId=products.id AND adminAssign='1') AS noOfOrder,
                (SELECT name FROM artisan_details WHERE userId=products.userId) AS artisanName,(SELECT image FROM productImage WHERE productId=products.id AND isActive='1' LIMIT 1) AS image
                  FROM products  WHERE isActive = 1  AND verified ='1' AND ideal ='0' ${condition} ORDER BY id DESC ${limits}`;
        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);

          // console.log("getFromAllProduct",query)

          resolve(res2);
        });
      } else {

        const query = `SELECT  id,name,0 AS websiteView,(SELECT COUNT(id) FROM enquiries WHERE productId=products.id AND deleted='1') AS totalEnqCount,
                    (SELECT COUNT(e.id) FROM enquiries AS e JOIN enquiry_order  AS eo ON  e.id=eo.EnqId  WHERE productId=products.id AND adminAssign='1') AS noOfOrder,
                    (SELECT name FROM artisan_details WHERE userId=products.userId) AS artisanName,
                    (SELECT image FROM productImage WHERE productId=products.id AND isActive='1' LIMIT 1) AS image  FROM products
                    WHERE isActive = 1 AND verified ='1' AND ideal ='0' ${condition} ORDER BY id DESC`;
        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);
          // console.log("getFromAllProduct",query)
          resolve(res2);
        });
      }
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getFromAllTotalProduct = (criteria) => {
  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET(userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

    return new Promise((resolve) => {
      const query = `SELECT id FROM products WHERE isActive = 1  AND verified ='1' AND ideal ='0' ${condition} `;

      // console.log("getFromAllTotalProduct",query)
      knex.raw(query).then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2.length);
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

// old code change on 14 may
// const getGenrateEnquiryList = async (criteria) => {
//   let { page } = criteria;
//   let offset, row_count, limits, query;

//   if (page) {
//     offset = (page - 1) * 10;
//     row_count = 10;
//     limits = `limit ${offset}, ${row_count}`;
//   }

//   try {
//     return new Promise((resolve, reject) => {

//       let condition = 'and 1=1 '

//       if(criteria.subAdmintotalArtisan)
//         condition += ' and FIND_IN_SET( p.userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

//       if (page) {

//         // query = `select e.id,uniqueId,title,isGenrate,e.created_at,u.id as assignUserId,
//         //         (select sku from products where id=e.productId )as sku,
//         //         (select name from artisan_details where userid=e.userId )as artisanName,
//         //         (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND enqId=e.id AND assignUserId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1')) AS totalArtisan,
//         //         (select attachment from enquiry_attachment where isActive='1' and enqId=e.id limit 1) as attachment
//         //         from enquiries as e join users as u on e.userId=u.id where u.isActive='1' and e.isActive='1'
//         //         and e.deleted='1' and u.deleted='1' and e.isGenrate='1' ${condition} order by id desc ${limits} `;

//         query=`SELECT e.id,uniqueId,title,isGenrate,e.created_at,p.userId AS assignUserId,productId,sku,productSkuArtisanId,
//         (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1' AND c3.toId = '1' AND isRead!='2') AS chatCount,
//                 ifnull((SELECT NAME FROM artisan_details WHERE userid=p.userId ),"ADMIN") AS artisanName,(CASE WHEN typeOfEnquiry='1' THEN 'Lead'  WHEN typeOfEnquiry='2' THEN 'Email' ELSE 'Website' END) AS typeOfEnquiry ,
//                 (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND enqId=e.id AND assignUserId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1') ) AS totalArtisan,
//                 (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=e.id LIMIT 1) AS attachment
//                 FROM enquiries AS e left JOIN products AS p ON e.productId=p.id WHERE e.isActive='1'
//                 AND e.isGenrate='1' ${condition} ORDER BY updated_at DESC ${limits}`;
//       } else {
//         query = `SELECT e.id,uniqueId,title,isGenrate,e.created_at,p.userId AS assignUserId,productId,sku,
//             (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1' AND c3.toId = '1' AND isRead!='2') AS chatCount,
//               ifnull((SELECT NAME FROM artisan_details WHERE userid=p.userId ),"ADMIN") AS artisanName,(CASE WHEN typeOfEnquiry='1' THEN 'Lead'  WHEN typeOfEnquiry='2' THEN 'Email' ELSE 'Website' END) AS typeOfEnquiry ,
//               (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND enqId=e.id AND assignUserId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1') ) AS totalArtisan,
//               (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=e.id LIMIT 1) AS attachment
//               FROM enquiries AS e left JOIN products AS p ON e.productId=p.id WHERE e.isActive='1'
//               AND e.isGenrate='1' ${condition} ORDER BY updated_at DESC `;
//       }

//       knex
//         .raw(query)
//         .then((res) => {
//           let res2 = util.nullRemove(res[0]);

//           // console.log("query",query)

//           let promiseArr = [];

//           res2.forEach((element, i) => {
//             promiseArr.push(
//               new Promise(async (resolve, reject) => {
//                 element["totalResponce"] = await getEnquiryResponceBy(
//                   element.id
//                 );
//                 resolve(element);
//               })
//             );
//           });
//           Promise.all(promiseArr).then((values) => {
//             resolve(values);
//           });
//         })
//         .catch((err) => reject(err));
//     });
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };


// change by rajpal on 14 may doing sorting dynamic
const getGenrateEnquiryList = async (criteria) => {
  let { page } = criteria;
  let offset, row_count, limits, query;
  let sorting="";

  if (page) {
    offset = (page - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`;
  }

  if(criteria.sort){
    sorting=criteria.sort +' '+criteria.order
  }else{
      sorting="updated_at DESC"
  }

  try {
    return new Promise((resolve, reject) => {

      let condition = 'and 1=1 '

      if(criteria.subAdmintotalArtisan)
        condition += ' and FIND_IN_SET( p.userId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

      if (page) {

        query=`select * from (SELECT e.id,uniqueId,title,isGenrate,e.created_at,p.userId AS assignUserId,productId,sku,productSkuArtisanId,
                (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1' AND c3.toId = '1' AND isRead!='2') AS chatCount,
                ifnull((SELECT NAME FROM artisan_details WHERE userid=p.userId ),"ADMIN") AS artisanName,
                (CASE WHEN typeOfEnquiry='1' THEN 'Lead'  WHEN typeOfEnquiry='2' THEN 'Email' ELSE 'Website' END) AS typeOfEnquiry ,
                (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND enqId=e.id AND assignUserId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1') ) AS totalArtisan,
                (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=e.id LIMIT 1) AS attachment,
                (SELECT count(DISTINCT fromId) FROM chat WHERE isActive='1' AND EnqId=e.id AND fromId NOT IN(SELECT id FROM users WHERE isActive='1' AND deleted='1'
                AND role IN (1,4)) AND fromId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1')) as totalResponce,
                e.updated_at
                FROM enquiries AS e left JOIN products AS p ON e.productId=p.id WHERE e.isActive='1'
                AND e.isGenrate='1' ${condition} ) as tmp ORDER BY ${sorting} ${limits}`;
      } else {
        query = `select * from (SELECT e.id,uniqueId,title,isGenrate,e.created_at,p.userId AS assignUserId,productId,sku,
              (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1' AND c3.toId = '1' AND isRead!='2') AS chatCount,
              ifnull((SELECT NAME FROM artisan_details WHERE userid=p.userId ),"ADMIN") AS artisanName,
              (CASE WHEN typeOfEnquiry='1' THEN 'Lead'  WHEN typeOfEnquiry='2' THEN 'Email' ELSE 'Website' END) AS typeOfEnquiry ,
              (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND enqId=e.id AND assignUserId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1') ) AS totalArtisan,
              (SELECT attachment FROM enquiry_attachment WHERE isActive='1' AND enqId=e.id LIMIT 1) AS attachment,
              (SELECT count(DISTINCT fromId) FROM chat WHERE isActive='1' AND EnqId=e.id AND fromId NOT IN (SELECT
                 id FROM users WHERE isActive='1' AND deleted='1'
              AND role IN (1,4)) AND fromId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1')) as totalResponce,
              e.updated_at
              FROM enquiries AS e left JOIN products AS p ON e.productId=p.id WHERE e.isActive='1'
              AND e.isGenrate='1' ${condition}) as tmp ORDER BY ${sorting} `;
      }

      knex
        .raw(query)
        .then((res) => {
          let res2 = util.nullRemove(res[0]);

          // console.log("query",query)

          let promiseArr = [];

          res2.forEach((element, i) => {
            promiseArr.push(
              new Promise(async (resolve, reject) => {
                element["totalResponce2"] = await getEnquiryResponceBy(
                  element.id
                );
                resolve(element);
              })
            );
          });
          Promise.all(promiseArr).then((values) => {
            resolve(values);
          });
        })
        .catch((err) => reject(err));
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const getTotalsGenrateEnquiry = async (criteria) => {
  try {

    let condition = 'and 1=1 '

    if(criteria.subAdmintotalArtisan)
      condition += ' and FIND_IN_SET( e.productSkuArtisanId,'+"'" + criteria.subAdmintotalArtisan + "'"+')'

    return new Promise((resolve) => {
      query = `select * from enquiries as e where e.isActive='1'
                  and e.deleted='1' and e.isGenrate='1' ${condition}`;

      knex.raw(query).then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2.length);
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const getEnquiryResponceBy = async (EnqId) => {
  try {
    return new Promise((resolve) => {
      // const query = `SELECT DISTINCT fromId FROM chat WHERE isActive='1' AND EnqId='${EnqId}' AND fromId NOT IN(SELECT id FROM users WHERE isActive='1' AND deleted='1'  AND role IN (SELECT id FROM roles WHERE NAME='admin')) AND fromId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1' )`;
      const query = `SELECT DISTINCT fromId FROM chat WHERE isActive='1' AND EnqId='${EnqId}' AND fromId NOT IN(SELECT id FROM users WHERE isActive='1' AND deleted='1'  AND role IN (1,4)) AND fromId IN (SELECT id FROM users WHERE isActive='1' AND deleted='1' )`;

      knex.raw(query).then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2.length);
      });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const genrateEnquiry = async(criteria) => {

  try {
    await knex("enquiries")
      .update({
        materialId: criteria.materialId,
        craftId: criteria.craftId,
        isGenrate: "1",
      }).where({ id: criteria.id });

    await broadCastEnquiry(criteria);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const viewEnquiryArtisan = async (criteria, adminId) => {
  // criteria.type===[ex->0->totalArtisan,1->ResponedArtisanBy]

  let { page } = criteria;
  let offset, row_count, limits, query;

  if (page) {
    offset = (page - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`;
  }

  try {
    if (criteria.type === "0") {
      return new Promise((resolve, reject) => {
        if (page) {
          query = `SELECT e.enqId as EnqId,u.mobile,u.id as userId,artisanImage,ad.name,'${adminId}' as adminId2,
          (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id) AS totalEnquiry,
                    (SELECT name FROM options WHERE  id = ad.state) AS state,'1' as adminId,
                    (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id AND adminAssign='1') AS totalOrder
                    FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
                    WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' and orderAccept!="2" AND e.enqId='${criteria.id}' ${limits}`;
                    // GROUP BY userId  `;
        } else {
          query = `SELECT e.enqId as EnqId ,u.mobile,u.id as userId,ad.name,artisanImage,'${adminId}' as adminId2,
          (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id) AS totalEnquiry,
          (SELECT name FROM options WHERE  id = ad.state) AS state,'1' as adminId,
                    (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id AND adminAssign='1') AS totalOrder
                    FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
                    WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' and  orderAccept!="2"AND e.enqId='${criteria.id}'`;
                    // GROUP BY userId`;
        }

        knex
          .raw(query)
          .then((res) => {
            const res2 = util.nullRemove(res[0]);
            resolve(res2);
          })
          .catch((err) => reject(err));
      });
    }

    if (criteria.type === "1") {
      return new Promise((resolve, reject) => {
        if (page) {
          query = `SELECT e.enqId as EnqId,ad.name,u.mobile,u.id as userId,artisanImage,'${adminId}' as adminId2,'1' as adminId,
          (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.EnqId AND c3.isActive='1'
            AND c3.fromId = e.assignUserId AND c3.toId = '1' AND isRead!='2') AS chatCount,
                  (SELECT name FROM options WHERE  id = ad.state) AS state, (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id) AS totalEnquiry,
                    (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id AND adminAssign='1') AS totalOrder,orderAccept
                    FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
                    WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' AND e.enqId='${criteria.id}' AND role NOT IN (SELECT id FROM roles WHERE NAME='admin')
                    AND  assignUserId IN (SELECT DISTINCT fromId FROM chat WHERE isActive='1' AND EnqId='${criteria.id}' AND fromId NOT IN(SELECT id FROM users WHERE isActive='1'
                    AND deleted='1' AND role IN (SELECT id FROM roles WHERE NAME='admin'))) ${limits}`;
        } else {
          query = `SELECT e.enqId as EnqId,ad.name,u.mobile,u.id as userId,
          (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.EnqId AND c3.isActive='1'
            AND c3.fromId = e.assignUserId AND c3.toId = '1' AND isRead!='2') AS chatCount,
               (SELECT name FROM options WHERE  id = ad.state) AS state,artisanImage,'${adminId}' as adminId2,'1' as adminId, (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id) AS totalEnquiry,
                    (SELECT COUNT(id) FROM enquiry_order WHERE isActive='1' AND assignUserId=u.id AND adminAssign='1') AS totalOrder,orderAccept
                    FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
                    WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' AND e.enqId='${criteria.id}' AND role NOT IN (SELECT id FROM roles WHERE NAME='admin')
                    AND  assignUserId IN (SELECT DISTINCT fromId FROM chat WHERE isActive='1' AND EnqId='${criteria.id}' AND fromId NOT IN(SELECT id FROM users WHERE isActive='1'
                    AND deleted='1' AND role IN (SELECT id FROM roles WHERE NAME='admin')))`;
        }

        knex
          .raw(query)
          .then((res) => {
            const res2 = util.nullRemove(res[0]);
            resolve(res2);
          })
          .catch((err) => reject(err));
      });
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};



const viewTotalEnquiryArtisan = async (criteria, adminId) => {
  // criteria.type===[ex->0->totalArtisan,1->ResponedArtisanBy]

  let { page } = criteria;
  let offset, row_count, limits, query;

  // if (page) {
  //   offset = (page - 1) * 10;
  //   row_count = 10;
  //   limits = `limit ${offset}, ${row_count}`;
  // }

  try {
    if (criteria.type === "0") {
      return new Promise((resolve, reject) => {
        // if (page) {
        //   query = `SELECT e.enqId as EnqId
        //             FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
        //             WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' AND e.enqId='${criteria.id}' ${limits}`;
        //             // GROUP BY userId  `;
        // } else {
          query = `SELECT e.enqId as EnqId
                    FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
                    WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' AND e.enqId='${criteria.id}'`;
                    // GROUP BY userId`;
        // }


        knex
          .raw(query)
          .then((res) => {
            const res2 = util.nullRemove(res[0]);
            resolve(res2.length);
          })
          .catch((err) => reject(err));
      });
    }

    if (criteria.type === "1") {
      return new Promise((resolve, reject) => {
        // if (page) {
        //   query = `SELECT e.enqId as EnqId
        //             FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
        //             WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' AND e.enqId='${criteria.id}' AND role NOT IN (SELECT id FROM roles WHERE NAME='admin')
        //             AND  assignUserId IN (SELECT DISTINCT fromId FROM chat WHERE isActive='1' AND EnqId='${criteria.id}' AND fromId NOT IN(SELECT id FROM users WHERE isActive='1'
        //             AND deleted='1' AND role IN (SELECT id FROM roles WHERE NAME='admin'))) ${limits}`;
        // } else {

          query = `SELECT e.enqId as EnqId
                    FROM enquiry_order AS e JOIN users AS u ON e.assignUserId=u.id JOIN artisan_details AS ad ON u.id=ad.userId
                    WHERE u.isActive='1' AND e.isActive='1' AND u.deleted='1' AND e.enqId='${criteria.id}' AND role NOT IN (SELECT id FROM roles WHERE NAME='admin')
                    AND  assignUserId IN (SELECT DISTINCT fromId FROM chat WHERE isActive='1' AND EnqId='${criteria.id}' AND fromId NOT IN(SELECT id FROM users WHERE isActive='1'
                    AND deleted='1' AND role IN (SELECT id FROM roles WHERE NAME='admin')))`;
        // }


        knex
          .raw(query)
          .then((res) => {
            const res2 = util.nullRemove(res[0]);
            resolve(res2.length);
          })
          .catch((err) => reject(err));
      });
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

// const genrateNewEnquiry = async (criteria, adminId) => {
//   // try {
//     if (criteria.id && criteria.id != "null") {

//       const files = criteria.attachment;

//       const id = criteria.id;
//       delete criteria.id;

//       if (criteria.attachment) {
//         delete criteria.attachment;
//       }

//       criteria.isGenrate = "1";
//       criteria.updated_at = new Date();

//       let chk=await knex("enquiries as e").where("id",id)

//       await Enquiries.query().findById(id).patch(criteria);

//       criteria.NewrequestTo=chk[0].requestTo;

//       if (files) {
//         const updateImageQuery = [];

//         for (i = 0; i < files.length; i++) {
//           let temp = {
//             enqId: id,
//             attachment: files[i],
//           };
//           updateImageQuery.push(temp);
//         }
//         await knex("enquiry_attachment").insert(updateImageQuery);
//       }

//       const res = await knex("enquiries").where({ id: id });

//       criteria.userId = res[0].userId;
//       criteria.id = id;

//       const res2 = await knex("enquiry_order").where({ EnqId: id })

//       if (!res2.length) {
//         criteria['files'] = files
//         criteria.adminId = adminId;
//         await broadCastEnquiry(criteria);
//       }else{
//         await broadCastEnquiry2(criteria);
//       }

//     } else {

//       criteria.updated_at = new Date();
//       const files = criteria.attachment;

//       if (criteria.attachment) {
//         delete criteria.attachment;
//       }

//       criteria.userId = adminId;

//       const uniqueId = await util.getUniqueCode(
//         "ENQUIRY-",
//         "enquiries",
//         "uniqueId"
//       );

//       criteria.uniqueId = uniqueId;
//       criteria.isGenrate = "1";

//       const res = await knex("enquiries").insert(criteria)
//       criteria.id = res[0];

//       if (files) {
//         const updateImageQuery = [];
//         for (i = 0; i < files.length; i++) {
//           let temp = {
//             enqId: criteria.id,
//             attachment: files[i],
//           };
//           updateImageQuery.push(temp);
//         }

//         await knex("enquiry_attachment").insert(updateImageQuery)
//       }

//       criteria['files'] = files
//       criteria.adminId = adminId;
//       await broadCastEnquiry(criteria);
//     }
//   // } catch (e) {
//   //   return Promise.reject(e.toString());
//   // }
// };
const genrateNewEnquiry = async (criteria, adminId) => {
  // try {
    if (criteria.id && criteria.id != "null") {

      const files = criteria.attachment;

      const id = criteria.id;
      delete criteria.id;

      if (criteria.attachment) {
        delete criteria.attachment;
      }

      criteria.isGenrate = "1";
      criteria.updated_at = new Date();

      let chk=await knex("enquiries as e").where("id",id)

      await Enquiries.query().findById(id).patch(criteria);

      criteria.NewrequestTo=chk[0].requestTo;

      if (files) {
        const updateImageQuery = [];

        for (i = 0; i < files.length; i++) {
          let temp = {
            enqId: id,
            attachment: files[i],
          };
          updateImageQuery.push(temp);
        }
        await knex("enquiry_attachment").insert(updateImageQuery);
      }

      const res = await knex("enquiries").where({ id: id });

      criteria.userId = res[0].userId;
      criteria.id = id;

      const res2 = await knex("enquiry_order").where({ EnqId: id })

      if (!res2.length) {
        criteria['files'] = files
        criteria.adminId = adminId;
        // await broadCastEnquiry(criteria);
      }else{
        // await broadCastEnquiry2(criteria);
      }

    } else {

      criteria.updated_at = new Date();
      const files = criteria.attachment;

      if (criteria.attachment) {
        delete criteria.attachment;
      }

      criteria.userId = adminId;

      const uniqueId = await util.getUniqueCode(
        "ENQUIRY-",
        "enquiries",
        "uniqueId"
      );

      criteria.uniqueId = uniqueId;
      criteria.isGenrate = "1";

      const res = await knex("enquiries").insert(criteria).debug()
      criteria.id = res[0];

      if (files) {
        const updateImageQuery = [];
        for (i = 0; i < files.length; i++) {
          let temp = {
            enqId: criteria.id,
            attachment: files[i],
          };
          updateImageQuery.push(temp);
        }

        await knex("enquiry_attachment").insert(updateImageQuery)
      }

      criteria['files'] = files
      criteria.adminId = adminId;
      // await broadCastEnquiry(criteria);
    }
  // } catch (e) {
  //   return Promise.reject(e.toString());
  // }
};

const emitSocket = (type = 'receiveEnquiry', socketResponse, userId) => {

  if(!global.ioConn || !global.users || !global.users.users || !global.users.users.length) return

  const socketIds = global.users.users.filter(ob => ob.room == userId)
  socketIds.forEach( ob => {
    const { id } = ob

    global.ioConn.sockets.to(id).emit(type, socketResponse);
  })
}

const enquiryService = async (ob) => {
  const { userId, enqId } = ob

  let result = {};
  let totalCount;
  let responce;

  responce = await app_dao.enquiryList({ userId, enqId });
  totalCount = await app_dao.enquiryTotalCount({ userId, enqId }, 'enquiry');

  result['totalCount'] = totalCount ? totalCount : 0
  result['res'] = responce;

  return result
}

const broadCastEnquiry = async (criteria) => {

  criteria['files'] = await knex("enquiry_attachment").select("attachment").where({enqId:criteria.id});

  let artisan;
  let adminId = await knex("users")
  .select("id")
  .where("isActive", "1")
  .where("deleted", "1")
  .where("role", "1")

  adminId=1;
  try {

    let pt=criteria.requestTo
    let res2 = pt.split(",");
    let allDta = res2.indexOf("All");

    // console.log("broadCastEnquiry")

    if (allDta >-1 ) {

      // console.log("broadCastEnquiry ALLL")

      // console.log("ALL DATA ",criteria)

      artisan = await knex("users")
        .select("id","appToken")
        .where("isActive", "1")
        .where("deleted", "1")
        .where("role", "2")
        .where("is_verified","1")

      artisan.map(async (artisanData) => {

        const socketResponse = await enquiryService({
          userId: artisanData.id,
          enqId: criteria.id
        })

        emitSocket('receiveEnquiry', socketResponse, artisanData.id)

        let descr= "Title:" + criteria.title
            + "\n Description:" + criteria.description
            +"\n QTY:" + criteria.qty
            + "\n ExpectedPrice:" + criteria.expPrice;

        const chatOb = {
          EnqId: criteria.id,
          fromId: adminId,
          toId: artisanData.id,
          message: descr,
          type: "description",
          files: ""
        }

      await knex("chat").insert(chatOb)

        criteria['files'].forEach(async (file) => {

            const chatOb = {
                EnqId: criteria.id,
                fromId: adminId,
                toId: artisanData.id,
                message: "",
                type: "general",
                files: file.attachment
            }

            await knex("chat").insert(chatOb)
        })

        await knex("enquiry_order")
          .insert({
            enqId: criteria.id,
            assignUserId: artisanData.id,
            created_by: adminId,
            update_status2:"enquiry forwared to artisan"
          })

          const notificationPayload = {}
          notificationPayload.type = 'Enquiry' || '';
          notificationPayload.description = "An Enquiry has been generated ";
          notificationPayload.title = 'New Enquiry :'+criteria.title;
          notificationPayload.userId = artisanData.id;
          notificationPayload.sendStatus = 1
          notificationPayload.isActive = 1
          notificationPayload.gcmId = artisanData.appToken
          util.sendNotif(notificationPayload)
          await knex('notifications').insert(notificationPayload)
      });

    } else {

      // console.log("broadCastEnquiry Specfiv group")

      let userIdArr=[];
      let query =`select GROUP_CONCAT(DISTINCT total_artisan) as ids from artisan_group where id in (${res2})`;
      let artisan2 = await knex.raw(query);
      artisan2=artisan2[0]
      userIdArr = artisan2[0].ids;

      let query2 =`select id,appToken from users where isActive='1' and deleted='1'
                  and role='2' and is_verified='1' and id in (${userIdArr})`;

      let artisanArr = await knex.raw(query2);
          artisanArr=artisanArr[0]

      // console.log("UserId ",artisanArr)

      if (artisanArr) {

        artisanArr.map(async (ele) => {

          let checkUser=await knex("users").where({id:ele.id}).where("is_verified","1").where('appToken',"!=","");

          if(!_.isEmpty(checkUser)){

          const socketResponse = await enquiryService({
            userId: ele.id,
            enqId: criteria.id
          })

          let descr= "Title: " + criteria.title
          + "\n Description:" + criteria.description
          +"\n QTY:"+criteria.qty
          + "\n ExpectedPrice:" + criteria.expPrice;

          const chatOb = {
            EnqId: criteria.id,
            fromId: adminId,
            toId: ele.id,
            message: descr,
            type: "description",
            files: ""
          }

          await knex("chat").insert(chatOb)

          criteria['files'].forEach(async (file) => {
            const chatOb = {
                EnqId: criteria.id,
                fromId: adminId,
                toId: ele.id,
                message: "",
                type: "general",
                files: file.attachment
            }

            await knex("chat").insert(chatOb)
        })

          await knex("enquiry_order").insert({
            enqId: criteria.id,
            assignUserId: ele.id,
            created_by: adminId,
          });

          let token=await knex("users").where({id:ele.id}).where("is_verified", "1")

          if(!_.isEmpty(checkUser)){

              const notificationPayload = {}
              notificationPayload.type = 'Enquiry' || '';
              notificationPayload.description = "An Enquiry has been generated ";
              notificationPayload.title = 'New Enquiry :'+ criteria.title;
              notificationPayload.userId = ele.id;
              notificationPayload.sendStatus = 1
              notificationPayload.isActive = 1
              notificationPayload.gcmId = token[0].appToken
              util.sendNotif(notificationPayload)
              await knex('notifications').insert(notificationPayload)
              emitSocket('receiveEnquiry', socketResponse, ele.id)
            }
          }
        });
      }
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const broadCastNewGroupEnquiry = async (criteria) => {

    let pt=criteria.requestTo
    let res2 = pt.split(",");
    let allDta = res2.indexOf("All");

    criteria['files'] = await knex("enquiry_attachment").select("attachment").where({enqId:criteria.id});

    // console.log("broadCastNewGroupEnquiry ")

    if(allDta > -1){

      // console.log("broadCastNewGroupEnquiry ALL CASE")

      let userIdArr=[];
      let artisanArr = await knex("enquiry_order").select("assignUserId").where("enqId",criteria.id)
      artisanArr.forEach(async(element)=>{userIdArr.push(element.assignUserId)})

      let query =`select id,appToken from users where isActive='1' and deleted='1'
                  and role='2' and is_verified='1' and id not in (${userIdArr})`;

      let artisan = await knex.raw(query);
      artisan=artisan[0]

      artisan.map(async (artisanData) => {

        const socketResponse = await enquiryService({
          userId: artisanData.id,
          enqId: criteria.id
        })

        emitSocket('receiveEnquiry', socketResponse, artisanData.id)

        let descr= "Title: " + criteria.title
            + "\n Description :" + criteria.description
            +"\n QTY :" + criteria.qty
            + "\n ExpectedPrice :" + criteria.expPrice;

        const chatOb = {
          EnqId: criteria.id,
          fromId: adminId,
          toId: artisanData.id,
          message: descr,
          type: "description",
          files: ""
        }

      await knex("chat").insert(chatOb)

      if(criteria['files']){

          criteria['files'].forEach(async (file) => {
            const chatOb = {
                EnqId: criteria.id,
                fromId: adminId,
                toId: artisanData.id,
                message: "",
                type: "general",
                files: file.attachment
            }
            await knex("chat").insert(chatOb)
        })
      }

        await knex("enquiry_order").insert({
            enqId: criteria.id,
            assignUserId: artisanData.id,
            created_by: adminId,
            update_status2:"enquiry forwared to artisan"
          })

          const notificationPayload = {}
          notificationPayload.type = 'Enquiry' || '';
          notificationPayload.description = "An Enquiry has been generated ";
          notificationPayload.title = 'New Enquiry :'+criteria.title;
          notificationPayload.userId = artisanData.id;
          notificationPayload.sendStatus = 1
          notificationPayload.isActive = 1
          notificationPayload.gcmId = artisanData.appToken
          util.sendNotif(notificationPayload)
          await knex('notifications').insert(notificationPayload)
      });

    }else{

      // console.log("broadCastNewGroupEnquiry Spefic GroupSSSSSSSS",res2)

      let userIdArr=[];
      let artisanArr = await knex("enquiry_order").select("assignUserId").where("enqId",criteria.id)
      artisanArr.forEach(async(element)=>{userIdArr.push(element.assignUserId)})

      let query =`select GROUP_CONCAT(DISTINCT total_artisan) as ids from artisan_group where id in (${res2})`;
      let artisan2 = await knex.raw(query);


      artisan2=artisan2[0][0].ids
      artisan2=artisan2.split(",");

      artisan2 = artisan2.map(function (x) {return parseInt(x, 10);});
      userIdArr=artisan2.filter(function(n) { return userIdArr.indexOf(n) == -1;})

     if(userIdArr.length){

      let query2 =`select id,appToken from users where isActive='1' and deleted='1'
                  and role='2' and is_verified='1' and id in (${userIdArr})`;

      let artisan = await knex.raw(query2);
      artisan=artisan[0]

      // console.log("userIdArrr",userIdArr,"res2",res2,"query",query)

      if(artisan.length){

      artisan.map(async (artisanData) => {
        const socketResponse = await enquiryService({
          userId: artisanData.id,
          enqId: criteria.id
        })

        emitSocket('receiveEnquiry', socketResponse, artisanData.id)

        let descr= "Title: " + criteria.title
            + "\n Description :" + criteria.description
            +"\n QTY :" + criteria.qty
            + "\n ExpectedPrice :" + criteria.expPrice;

        const chatOb = {
          EnqId: criteria.id,
          fromId: adminId,
          toId: artisanData.id,
          message: descr,
          type: "description",
          files: ""
        }

      await knex("chat").insert(chatOb)

      if(criteria['files']){

          criteria['files'].forEach(async (file) => {
            const chatOb = {
                EnqId: criteria.id,
                fromId: adminId,
                toId: artisanData.id,
                message: "",
                type: "general",
                files: file.attachment
            }
            await knex("chat").insert(chatOb)
        })
      }

        await knex("enquiry_order").insert({
            enqId: criteria.id,
            assignUserId: artisanData.id,
            created_by: adminId,
            update_status2:"enquiry forwared to artisan"
          })

          const notificationPayload = {}
          notificationPayload.type = 'Enquiry' || '';
          notificationPayload.description = "An Enquiry has been generated ";
          notificationPayload.title = 'New Enquiry :'+criteria.title;
          notificationPayload.userId = artisanData.id;
          notificationPayload.sendStatus = 1
          notificationPayload.isActive = 1
          notificationPayload.gcmId = artisanData.appToken
          util.sendNotif(notificationPayload)
          await knex('notifications').insert(notificationPayload)
      });
     }
    }
  }
}

const broadCastEnquiry2 = async (criteria) => {
  try {

    // console.log("broadCastEnquiry2 ")

    let artisan;
    adminId=1;

    if(criteria.NewrequestTo===criteria.requestTo){

      let enqUniqueId = await knex("enquiries").where("id", criteria.id)
      criteria.uniqueId=enqUniqueId[0].uniqueId;

      // console.log("broadCastEnquiry2 SAME OUTPUST ",criteria,"enqUniqueId=>>",enqUniqueId)

      artisan = await knex("enquiry_order as eo")
        .join("users as u", "eo.assignUserId", "u.id")
        .select("u.id","u.appToken")
        .where("eo.isActive", "1")
        .where("u.isActive", "1")
        .where("deleted", "1")
        .where("role", "2")
        .where("EnqId", criteria.id)
        .where("is_verified","1")

      artisan.map(async (artisanData) => {
        const socketResponse = await enquiryService({
          userId: artisanData.id,
          enqId: criteria.id
        })

        emitSocket('receiveEnquiry', socketResponse, artisanData.id)

        let descr= "Title : " + criteria.title + "\n Description : " + criteria.description + "\n QTY : " + criteria.qty + "\n ExpectedPrice :" + criteria.expPrice;

        const chatOb = {
          EnqId: criteria.id,
          fromId: adminId,
          toId: artisanData.id,
          message: descr,
          type: "description",
          files: ""
        }

      await knex("chat").insert(chatOb)

          const notificationPayload = {}
          notificationPayload.type = 'Chat' || '';
          notificationPayload.description = "New message for Enquiry ID : "+criteria.uniqueId;
          notificationPayload.title = 'Chat';
          notificationPayload.userId = artisanData.id;
          notificationPayload.sendStatus = 1
          notificationPayload.isActive = 1
          notificationPayload.gcmId = artisanData.appToken
          util.sendNotif(notificationPayload)
          await knex('notifications').insert(notificationPayload)

      });
    }else{
      await broadCastNewGroupEnquiry(criteria)

    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};
const removeImage = async (ids) => {
  var Arr = ids[0];
  var idsArr = Arr.split(",");
  try {
    /*
            const craftPromises = craftArr.map(name => Options.query().insert({type, userId, name, isActive}))
            await Promise.all(craftPromises)
          * */

    for (index = 0; index < idsArr.length; index++) {
      await knex("enquiry_attachment").where("id", idsArr[index]).del();
    }
    return;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editGenratedEnquiry = async (criteria) => {
  try {
    const id = criteria.id;
    const files = criteria.attachment;
    delete criteria.id;

    if (criteria.attachment) {
      delete criteria.attachment;
    }
    await knex("enquiries").update(criteria).where({ id })

    if (files) {
      const updateImageQuery = [];
      for (i = 0; i < files.length; i++) {
        let temp = {
          enqId: id,
          attachment: files[i],
        };
        updateImageQuery.push(temp);
      }
      await knex("enquiry_attachment").insert(updateImageQuery)
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const genrateEstimate = async (criteria) => {
  try {
    await knex("estimate")
      .update({ isActive: "0", deleted: "0" })
      .where("enqId", criteria.enqId)
      .where("assignUserId", criteria.assignUserId)


    const uniqueId = await util.getUniqueCode(
      "ESTIMATE-",
      "estimate",
      "uniqueId"
    );
    criteria.uniqueId = uniqueId;
    await knex("estimate").insert(criteria);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const genratePurchaseOrder = async (criteria) => {
  try {

    await knex("po")
      .update({ isActive: "0", deleted: "0" })
      .where("enqId", criteria.enqId)
      .where("assignUserId", criteria.assignUserId)

    const uniqueId = await util.getUniqueCode("ORDER-", "po", "uniqueId");
    criteria.uniqueId = uniqueId;
    await knex("po").insert(criteria);
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const generateInvoice = async (criteria) => {
  try {
    await knex("invoice")
      .update({ isActive: "0", deleted: "0" })
      .where("enqId", criteria.enqId)


    const uniqueId = await util.getUniqueCode(
      "INVOICE-",
      "invoice",
      "uniqueId"
    );
    criteria.uniqueId = uniqueId;
    criteria.assignUserId = criteria.userId;
    // // console.log("hello===",criteria)
    await knex("invoice").insert(criteria);
    return;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

// old code change by rajpal date 14 may
// const getOrderList = async (criteria, adminId) => {
//   let { page } = criteria;
//   let offset, row_count, limits, query;

//   if (page) {
//     offset = (page - 1) * 10;
//     row_count = 10;
//     limits = `limit ${offset}, ${row_count}`;
//   }

//   try {
//     return new Promise((resolve) => {
//       if (page) {
//         query = `SELECT  e.id AS EnqId, e.title,(SELECT amount FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS expPrice,
//         (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1'
//         AND c3.fromId = eo.assignUserId AND c3.toId = '1' AND isRead!='2') AS chatCount,
//                 (SELECT dueDate FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS place_on,eo.uniqueId AS orderId,eo.id ,${adminId} AS adminId,
//                               (SELECT attachment FROM enquiry_attachment WHERE enqId=e.id limit 1) AS image,assignUserId as userId,
//                               (SELECT kycImage FROM artisan_details WHERE userId=eo.assignUserId) AS artisanPic,eo.update_status2 as update_status,
//                               (SELECT mobile FROM users WHERE id=eo.assignUserId) AS mobile ,
//                               (SELECT NAME FROM products WHERE id=e.productId) AS  productName,
//                               e.description,(SELECT name  FROM options WHERE  id=e.materialId) AS materialId,(SELECT name  FROM options WHERE  id=e.craftId) AS craftId,
//                               (SELECT NAME FROM artisan_details WHERE userId=eo.assignUserId) AS artisanName FROM  enquiries AS e JOIN enquiry_order AS eo
//                             ON e.id=eo.enqId  WHERE e.isActive='1' AND e.isGenrate='1' AND eo.isActive='1' AND eo.orderAccept='1' ORDER BY id DESC  ${limits}`;

//         knex.raw(query).then((res) => {
//           const res2 = util.nullRemove(res[0]);
//           // console.log("quesry=",query)
//           resolve(res2);
//         });
//       } else {
//         query = `SELECT  e.id AS EnqId, e.title,(SELECT amount FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS expPrice,
//                 (SELECT dueDate FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS place_on,eo.uniqueId AS orderId,eo.id ,${adminId} AS adminId,
//                     (SELECT attachment FROM enquiry_attachment WHERE enqId=e.id limit 1) AS image,assignUserId as userId,
//                     (SELECT kycImage FROM artisan_details WHERE userId=eo.assignUserId) AS artisanPic,eo.update_status2 as update_status,
//                     (SELECT mobile FROM users WHERE id=eo.assignUserId) AS mobile ,
//                     (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1'
//                     AND c3.fromId = eo.assignUserId AND c3.toId = '1' AND isRead!='2') AS chatCount,
//                     (SELECT NAME FROM products WHERE id=e.productId) AS  productName,
//                     e.description,(SELECT name  FROM options WHERE  id=e.materialId) AS materialId,(SELECT name  FROM options WHERE  id=e.craftId) AS craftId,
//                     (SELECT NAME FROM artisan_details WHERE userId=eo.assignUserId) AS artisanName FROM  enquiries AS e JOIN enquiry_order AS eo
//                     ON e.id=eo.enqId  WHERE e.isActive='1' AND e.isGenrate='1' AND eo.isActive='1' AND eo.orderAccept='1' ORDER BY id  DESC `;


//         knex.raw(query).then((res) => {
//           const res2 = util.nullRemove(res[0]);
//           resolve(res2);
//         });
//       }
//     });
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };

// change by rajpal on 14 may doing sorting dynamic
const getOrderList = async (criteria, adminId) => {
  let { page } = criteria;
  let offset, row_count, limits, query;

  if (page) {
    offset = (page - 1) * 10;
    row_count = 10;
    limits = `limit ${offset}, ${row_count}`;
  }

  let sorting='';

  if(criteria.sort){
    sorting=criteria.sort +' '+criteria.order
  }else{
      sorting="id DESC"
  }

  try {
    return new Promise((resolve) => {
      if (page) {
        query = `select * from (SELECT  e.id AS EnqId, e.title,(SELECT amount FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS expPrice,
        (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1' AND c3.fromId = eo.assignUserId AND c3.toId = '1' AND isRead!='2') AS chatCount,
        (SELECT dueDate FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS place_on,eo.uniqueId AS orderId,eo.id ,${adminId} AS adminId,
        (SELECT attachment FROM enquiry_attachment WHERE enqId=e.id limit 1) AS image,assignUserId as userId,
        (SELECT kycImage FROM artisan_details WHERE userId=eo.assignUserId) AS artisanPic,eo.update_status2 as update_status,
        (SELECT mobile FROM users WHERE id=eo.assignUserId) AS mobile ,(SELECT NAME FROM products WHERE id=e.productId) AS  productName,e.description,(SELECT name  FROM options WHERE  id=e.materialId) AS materialId,(SELECT name  FROM options WHERE  id=e.craftId) AS craftId,
        (SELECT NAME FROM artisan_details WHERE userId=eo.assignUserId) AS artisanName FROM  enquiries AS e JOIN enquiry_order AS eo
         ON e.id=eo.enqId  WHERE e.isActive='1' AND e.isGenrate='1' AND eo.isActive='1'
         AND eo.orderAccept='1')tmp ORDER BY ${sorting} ${limits}`;

        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);
          // console.log("quesry=",query)
          resolve(res2);
        });
      } else {
        query = `select * from (SELECT  e.id AS EnqId, e.title,(SELECT amount FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS expPrice,
                (SELECT dueDate FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS place_on,eo.uniqueId AS orderId,eo.id ,${adminId} AS adminId,
                    (SELECT attachment FROM enquiry_attachment WHERE enqId=e.id limit 1) AS image,assignUserId as userId,
                    (SELECT kycImage FROM artisan_details WHERE userId=eo.assignUserId) AS artisanPic,eo.update_status2 as update_status,
                    (SELECT mobile FROM users WHERE id=eo.assignUserId) AS mobile ,
                    (SELECT COUNT(c3.message) FROM chat AS c3 WHERE c3.EnqId=e.id AND c3.isActive='1'
                    AND c3.fromId = eo.assignUserId AND c3.toId = '1' AND isRead!='2') AS chatCount,
                    (SELECT NAME FROM products WHERE id=e.productId) AS  productName,
                    e.description,(SELECT name  FROM options WHERE  id=e.materialId) AS materialId,(SELECT name  FROM options WHERE  id=e.craftId) AS craftId,
                    (SELECT NAME FROM artisan_details WHERE userId=eo.assignUserId) AS artisanName FROM  enquiries AS e JOIN enquiry_order AS eo
                    ON e.id=eo.enqId  WHERE e.isActive='1' AND e.isGenrate='1'
                    AND eo.isActive='1' AND eo.orderAccept='1') tmp ORDER BY ${sorting} `;

        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);
          resolve(res2);
        });
      }
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getUniqueCode = async () => {
  let query = `SELECT concat('ENQUIRY',RIGHT(CONCAT('00000',IFNULL(uniquecode,10000)+1),6)) as uniqueCode FROM (SELECT MAX(CAST(RIGHT(uniqueId,6) AS UNSIGNED)) AS 'uniquecode' FROM enquiries) uniqueCode`;
  let uniqueId=await knex.raw(query)
  return Promise.resolve(uniqueId[0][0].uniqueCode)
}

const importEnquiries = (filePath, type) => {
  try {

    const csvData = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        csvData.push(row);
      })
      .on("end", async () => {

        for(i=0;i<csvData.length;i++){
          row=csvData[i];

        let checkEmail = await knex("users").where("isActive", "1").where("email", row.Email);
        let uniqueId=await util.getUniqueCode("ENQUIRY-","enquiries","uniqueId");
    if (checkEmail.length) {
      // email exist
      let checkMobile = await knex("users").where("isActive", "1").where("mobile", row.Mobile);
      if (checkMobile.length){
        // mobile already exist

        if (row.mailBy) {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,mailBy: row.MailBy,
            mailSubject: row.MailSubject,mailBody: row.MailBody,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: checkMobile[0].id,uniqueId:uniqueId,
          }).debug()

        } else {
          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: checkMobile[0].id,uniqueId:uniqueId,
          }).debug()
        }
      }else {
        // mobile not exist
        if (row.mailBy) {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,mailBy: row.MailBy,
            mailSubject: row.MailSubject,mailBody: row.MailBody,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: checkEmail[0].id,uniqueId:uniqueId,
          }).debug()
        } else {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: checkEmail[0].id,uniqueId:uniqueId,
          }).debug()
        }
      }
    } else {
      // email not exist
      let checkMobile = await knex("users").where("isActive", "1").where("mobile", row.Mobile);
      if (checkMobile.length){
        // mobile exist
        if (row.mailBy) {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,mailBy: row.MailBy,
            mailSubject: row.MailSubject,mailBody: row.MailBody,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: checkMobile[0].id,uniqueId:uniqueId,
          }).debug()
        } else {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: checkMobile[0].id,uniqueId:uniqueId,
          }).debug()
        }
      }else {
        let userType;
        if (type === "1") userType = "lead";
        if (type === "2") userType = "email";

        // console.log("row=<>>",row)

        // mobile not exist
        let newUserId = await knex("users").insert({email:row.Email,mobile:row.Mobile,type:userType,
          role:"3",isActive:"1"}).debug();

        await knex("user_details").insert({name:row.Name,userId:newUserId[0]});
        await knex("store").insert({store:row.StoreName,userId:newUserId[0]});
        // await importEnquiryInsert(criteria,newUserId[0]);

        if (row.mailBy) {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,mailBy: row.MailBy,
            mailSubject: row.MailSubject,mailBody: row.MailBody,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: newUserId[0],uniqueId:uniqueId,
          }).debug()
        } else {

          await knex("enquiries").insert({
            title: row.Title,description: row.Description,qty: row.Qty,expPrice: row.ExpPrice,
            typeOfEnquiry: type,craftId: await getUserCMPDetails({type:'craft',name:row.Craft}),
            materialId: await getUserCMPDetails({type:'material',name:row.Material}),
            userId: newUserId[0],uniqueId:uniqueId,
          }).debug()
        }
      }
    }
    }
   })
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


// const importEnquiries = (filePath, type) => {
//   try {

//     const csvData = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", async (row) => {
//         csvData["name"] = row.Name;
//         csvData["mobile"] = row.Mobile;
//         csvData["store"] = row.StoreName;
//         csvData["email"] = row.Email;
//         csvData["title"] = row.Title;
//         csvData["description"] = row.Description;
//         csvData["qty"] = row.Qty;
//         csvData["expPrice"] = row.ExpPrice;
//         csvData["craft"] = await getUserCMPDetails({type:'craft',name:row.Craft});
//         csvData["material"] = await getUserCMPDetails({type:'material',name:row.Material});
//         // csvData["product"] = await getUserCMPDetails({type:'products',name:criteria.Product});
//         if (type === "1") csvData["userType"] = "lead";

//         if (type === "2") {
//           csvData["userType"] = "email";
//           csvData["mailBy"] = row.MailBy;
//           csvData["mailSubject"] = row.MailSubject;
//           csvData["mailBody"] = row.MailBody;
//         }
//         csvData["type"] = type;

//         console.log("csvData",csvData)
//         console.log("row=<>>",row)

//         // await importEnquiryUserCheck(csvData);
//       })
//       .on("end", () => {});
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };

const importEnquiryUserCheck = async (criteria) => {
  try {

    const checkEmail = await knex("users")
      .where("isActive", "1")
      .where("email", criteria.email);

    if (checkEmail.length) {
      const checkMobile = await knex("users")
        .where("isActive", "1")
        .where("mobile", criteria.mobile);

      // // console.log("checkMobile",checkMobile)
      if (checkMobile.length)
        await importEnquiryInsert(criteria, checkMobile[0].id);
      else await importEnquiryInsert(criteria, checkEmail[0].id);
    } else {
      const checkMobile = await knex("users")
        .where("isActive", "1")
        .where("mobile", criteria.mobile);

      //  // console.log("checkMobilecheckMobilecheckMobile",checkMobile)
      if (checkMobile.length)
        await importEnquiryInsert(criteria, checkMobile[0].id);
      else {
        const newUserId = await knex("users").insert({
          email: criteria.email,
          mobile: criteria.mobile,
          type: criteria.userType,
          // password: md5("LAL10"),
          role: "3",
          isActive: "1",
        });
        await knex("user_details").insert({
          name: criteria.name,
          userId: newUserId[0],
        });
        await knex("store").insert({
          store: criteria.store,
          userId: newUserId[0],
        });
        await importEnquiryInsert(criteria, newUserId[0]);
      }
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const importEnquiryInsert = async (criteria, userId) => {
  try {
    const uniqueId = await util.getUniqueCode(
      "ENQUIRY-",
      "enquiries",
      "uniqueId"
    );
    if (criteria.mailBy) {
      await knex("enquiries").insert({
        title: criteria.title,
        description: criteria.description,
        qty: criteria.qty,
        mailBy: criteria.mailBy,
        mailSubject: criteria.mailSubject,
        mailBody: criteria.mailBody,
        expPrice: criteria.expPrice,
        typeOfEnquiry: criteria.type,
        craftId: criteria.craft,
        materialId: criteria.material,
        userId: userId,
        uniqueId: uniqueId,
      })
    } else {
      await knex("enquiries").insert({
        title: criteria.title,
        description: criteria.description,
        qty: criteria.qty,
        expPrice: criteria.expPrice,
        typeOfEnquiry: criteria.type,
        craftId: criteria.craft,
        materialId: criteria.material,
        userId: userId,
        uniqueId: uniqueId,
      })
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const importArtisan = async (filePath) => {
  try {

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const phoneno = /^\d{10}$/;
    const recipients = await csvToJson({ trim: true }).fromFile(filePath);

    let existData=[];
    let existDataArr=[];

    // recipients.forEach(async (criteria) => {
      for(i=0;i<recipients.length;i++){
        criteria=recipients[i];

      let validMobile=phoneno.test(criteria.Mobile);


      let validEmail=emailRegexp.test(criteria.Email);


      if(criteria.Email.length>0){

        if(!validEmail){

          existData.push(criteria.Email)

          existDataArr.push({
            "ArtisanName":criteria.ArtisanName,
            "Mobile":criteria.Mobile,
            "Email":criteria.Email,
            "State":criteria.State,
            "Craft":criteria.Craft,
            "Material":criteria.Material,
            "Product":criteria.Product,
            "KycImage":criteria.KycImage,
            "ArtisanImage":criteria.ArtisanImage,
            "Error":"Invalid Email Address",
          })

          // console.log("existDataArr validEmail",existDataArr)
          continue;

        }
        // console.log("criteria.Email",criteria.Email)
      }

      if(!validMobile){
        existData.push(criteria.Email)

        existDataArr.push({
          "ArtisanName":criteria.ArtisanName,
          "Mobile":criteria.Mobile,
          "Email":criteria.Email,
          "State":criteria.State,
          "Craft":criteria.Craft,
          "Material":criteria.Material,
          "Product":criteria.Product,
          "KycImage":criteria.KycImage,
          "ArtisanImage":criteria.ArtisanImage,
          "Error":"Invalid Mobile Number",
        })

        // console.log("existDataArrvalidMobile",existDataArr)

        continue
      }

      const checkMobile = await knex("users").where("isActive", "1").where("role","2").where("mobile", criteria.Mobile)
      const checkEmail = await knex("users").where("isActive", "1").where("role","2").where("email", criteria.Email)

      if (!checkMobile.length) {

        if(criteria.Email.length<1){

          const newUserId = await knex("users").insert({
            email: criteria.Email,
            mobile: criteria.Mobile,
            isActive: "1",
            role: "2"
          })


          await knex("artisan_details").insert({
              name: criteria.ArtisanName,
              // state: criteria.State?criteria.State:"",
              state: await getUserCMPDetails({type:'state',name:criteria.State}),
              kycImage: criteria.KycImage?criteria.KycImage:"",
              artisanImage: criteria.ArtisanImage ? criteria.ArtisanImage:"",
              userId: newUserId[0]
          })

          // for craft
          await knex("options").insert({
            name: await getUserCMPDetails({type:'craft',name:criteria.Craft}),
            type: "UserCraft",
            isActive:"1",
            userId: newUserId[0]
          })

           // for material
          await knex("options").insert({
            name: await getUserCMPDetails({type:'material',name:criteria.Material}),
            type: "UserMaterial",
            isActive:"1",
            userId: newUserId[0]
          })

          // for products
          await knex("options").insert({
            name: await getUserCMPDetails({type:'products',name:criteria.Product}),
            type: "UserProducts",
            isActive:"1",
            userId: newUserId[0]
          })
        }else{
        if (!checkEmail.length) {

         const newUserId = await knex("users").insert({
            email: criteria.Email,
            mobile: criteria.Mobile,
            isActive: "1",
            role: "2"
          })


          await knex("artisan_details").insert({
              name: criteria.ArtisanName,
              // state: criteria.State?criteria.State:"",
              state: await getUserCMPDetails({type:'state',name:criteria.State}),
              kycImage: criteria.KycImage?criteria.KycImage:"",
              artisanImage: criteria.ArtisanImage ? criteria.ArtisanImage:"",
              userId: newUserId[0]
          })

          // for craft
          await knex("options").insert({
            name: await getUserCMPDetails({type:'craft',name:criteria.Craft}),
            type: "UserCraft",
            isActive:"1",
            userId: newUserId[0]
          })

           // for material
          await knex("options").insert({
            name: await getUserCMPDetails({type:'material',name:criteria.Material}),
            type: "UserMaterial",
            isActive:"1",
            userId: newUserId[0]
          })

          // for products
          await knex("options").insert({
            name: await getUserCMPDetails({type:'products',name:criteria.Product}),
            type: "UserProducts",
            isActive:"1",
            userId: newUserId[0]
          })

        }else{
          existData.push(criteria.Email)
          existDataArr.push({
            "ArtisanName":criteria.ArtisanName,
            "Mobile":criteria.Mobile,
            "Email":criteria.Email,
            "State":criteria.State,
            "Craft":criteria.Craft,
            "Material":criteria.Material,
            "Product":criteria.Product,
            "KycImage":criteria.KycImage,
            "ArtisanImage":criteria.ArtisanImage,
            "Error":"Email already exist !!!",
          })
        }
      }
      }else{
          existData.push(criteria.Email)
          existDataArr.push({
            "ArtisanName":criteria.ArtisanName,
            "Mobile":criteria.Mobile,
            "Email":criteria.Email,
            "State":criteria.State,
            "Craft":criteria.Craft,
            "Material":criteria.Material,
            "Product":criteria.Product,
            "KycImage":criteria.KycImage,
            "ArtisanImage":criteria.ArtisanImage,
            "Error":"Mobile Number already exist !!!",
          })
      }
    };
    // console.log("existDataArr",existDataArr)
      return existDataArr

  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const getUserCMPDetails =  (criteria) => {
  let { name ,type } = criteria
  try {
      return new Promise((resolve, reject) => {
          let query = `SELECT id FROM options WHERE type='${type}' and name='${name}'`;
          knex.raw(query).then((rows) => {
              if(rows[0].length)
                resolve(rows[0][0].id)
              else
                resolve(0)
          })
          .catch((err) => reject(err));
          });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const importArtisanUserCheck = async (criteria) => {
  try {

    const checkEmail = await knex("users")
      .where("isActive", "1")
      .where("role", "2")
      .where("email", criteria.email)


    if (checkEmail.length) {
      const checkMobile = await knex("users")
        .where("isActive", "1")
        .where("role", "2")
        .where("mobile", criteria.mobile)


      if (!checkMobile.length) {
        const newUserId = await knex("users")
          .insert({
            email: criteria.email,
            mobile: criteria.mobile,
            isActive: "1",
            role: "2",
          })

        await knex("artisan_details")
          .insert({
            name: criteria.name,
            state: criteria.state,
            userId: newUserId[0],
          })

      } else {
        const newUserId = await knex("users")
          .insert({
            email: criteria.email,
            mobile: criteria.mobile,
            isActive: "1",
            role: "2",
          })

        await knex("artisan_details")
          .insert({
            name: criteria.name,
            state: criteria.state,
            userId: newUserId[0],
          })

      }
    }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const importProduct = async (filePath, userId) => {
  try {

    let csvData = {};
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {

        let checkUser=await knex("products").where({'sku':row.SKU})
        let lastId;
        if(!_.isEmpty(checkUser)){

		    const categoryId = row.CategoryName ? await getCatgoryId(row.CategoryName):2,
                  subCategoryId = row.SubCategoryName ? await getSubCategoryId(row.SubCategoryName, categoryId) :"0",
                  subSubCategoryId = row.SubSubCategoryName ?
                      await getSubCategoryId(row.SubSubCategoryName, subCategoryId) : "0";

              row.Description=row.Description.replace(/\n/g, '<br/>').replace(/'/g, '');
             // for ul and li tag start
              let drr2=row.Description.split("#");
              for (let i = 0; i < drr2.length; i++) {
                  if(i%2!=0) drr2[i]="<li>"+drr2[i]+"</li>";
              }
              drr2 = drr2.filter(function (el) { return el; });
              drr2=drr2.toString();
              drr2=drr2.replace(/,/g,'');
              drr2=drr2.replace('<br/>**<br/>','<ul>')
              drr2=drr2.replace('<br/>**','</ul>')
              // for ul and li tag End
              // for bold text Start
                let dr=drr2.split("*");
                for (var i = 0; i < dr.length; i++) {
                    if(i%2!=0) dr[i]="<b>"+dr[i]+"</b>";
                }
                let dr2=dr.toString();
                dr2=dr2.replace(/,/g,'');
                // for bold text End
              row.Description=dr2;

              await knex("products").update({
              "name":String(row.ProductName),
              "amount":row.Amount ? String(row.Amount):"0",
              "inventoryQty":row.InventoryQty ? String(row.InventoryQty):"0",
              "doableQty":row.MinQty ? String(row.MinQty):"0",
              "searchTags":row.Tags ? String(row.Tags):"0",
              "description":row.Description ? String(row.Description):"0",
              "userId":userId,
              "isActive":"1",
              "verified":"1",
              "vendorName":row.VendorName ? row.VendorName:"0",
              "categoryId": categoryId,
              "subcategoryId": subCategoryId,
              "subsubcategoryId": subSubCategoryId,
              "addingBestselling":row.addingBestselling ? String(row.addingBestselling):"0",
              "deleted":"1",
              "isActive":"1",
            }).where({"sku":row.SKU}).debug()


          lastId=checkUser[0].id
        }else{
		const categoryId = row.CategoryName ? await getCatgoryId(row.CategoryName):2,
                  subCategoryId = row.SubCategoryName ? await getSubCategoryId(row.SubCategoryName, categoryId) :"0",
                  subSubCategoryId = row.SubSubCategoryName ?
                      await getSubCategoryId(row.SubSubCategoryName, subCategoryId) : "0";

            row.Description=row.Description.replace(/\n/g, '<br/>').replace(/'/g, '');
             // for ul and li tag start
             let drr2=row.Description.split("#");
             for (let i = 0; i < drr2.length; i++) {
                 if(i%2!=0) drr2[i]="<li>"+drr2[i]+"</li>";
             }
             drr2 = drr2.filter(function (el) { return el; });
             drr2=drr2.toString();
             drr2=drr2.replace(/,/g,'');
             drr2=drr2.replace('<br/>**<br/>','<ul>')
             drr2=drr2.replace('<br/>**','</ul>')
             // for ul and li tag End
             //for bold text Start
               let dr=drr2.split("*");
               for (var i = 0; i < dr.length; i++) {
                   if(i%2!=0) dr[i]="<b>"+dr[i]+"</b>";
               }
               let dr2=dr.toString();
               dr2=dr2.replace(/,/g,'');
               // for bold text End
              row.Description=dr2;

        lastId=await knex("products").insert({
            "name":String(row.ProductName),
            "amount":row.Amount ? String(row.Amount):"0",
            "inventoryQty":row.InventoryQty ? String(row.InventoryQty):"0",
            "doableQty":row.MinQty ? String(row.MinQty):"0",
            "searchTags":row.Tags ? String(row.Tags):"0",
            "description":row.Description ? String(row.Description):"0",
            "userId":userId,
            "isActive":"1",
            "verified":"1",
            "vendorName":row.VendorName ? String(row.VendorName):"0",
            "sku":row.SKU ? String(row.SKU):"0",
            "categoryId": categoryId,
            "subcategoryId": subCategoryId,
            "subsubcategoryId": subSubCategoryId,
            "addingBestselling":row.addingBestselling ? String(row.addingBestselling):"0",
            "deleted":"1",
            "isActive":"1",
          }).debug()

          lastId=lastId[0];
      }

        let uploadedFiles=row.main_image_url+','+row.other_image_url;
        if(!_.isEmpty(uploadedFiles)){

            let uploadedFiles2 = uploadedFiles.split(",");
            let updateImageQuery = []

            for (const key in uploadedFiles2) {
              if(!_.isEmpty(uploadedFiles2[key])){
                  let temp = {
                    productId: lastId,
                    image: uploadedFiles2[key],
                    userId: userId
                }
                updateImageQuery.push(temp)
              }
            }
            await knex("productImage").where({ productId:lastId }).del();
            await uploadImage(updateImageQuery)
        }
      })
      .on("end", () => {});
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


// // change by rajpal on 14 may doing sorting dynamic
// const importProduct = async (filePath, userId) => {
//   try {
//   let resData = [];
//   let csvData = [];

//   return new Promise(function(resolve, reject) {
//    fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', row => csvData.push(row))
//       .on("end", async () => {

//       console.log("csvData.length",csvData.length)

//       for(i=0;i<csvData.length;i++){

//         row=csvData[i];

//         categoryId = await getCatgoryId(row.CategoryName);
//         subCategoryId = await getSubCategoryId(row.SubCategoryName, categoryId);
//         subSubCategoryId =await getSubCategoryId(row.SubSubCategoryName, subCategoryId);

//         console.log("categoryId",categoryId,"subCategoryId",subCategoryId,"subSubCategoryId",subSubCategoryId)

//         // Invalid category check
//         if(categoryId<1){
//           row.Error="Invalid category"
//           resData.push(row);
//           console.log("categoryId",categoryId,"row.CategoryName",row.CategoryName,"Invalid category")
//           continue;
//         }
//         // Invalid subcategory check
//         if(subCategoryId<1){
//           row.Error="Invalid Subcategory"
//           resData.push(row);
//           console.log("subCategoryId",subCategoryId,"row.SubCategoryName",row.SubCategoryName,"Invalid Subcategory")
//           continue;
//         }
//         // Invalid subsubcategory check
//         if(subSubCategoryId<1){
//           row.Error="Invalid Subsubcategory"
//           resData.push(row);
//           console.log("subSubCategoryId",subSubCategoryId,"row.SubSubCategoryName",row.SubSubCategoryName,"Invalid Subsubcategory")
//           continue;
//         }

//         // console.log("row",i,"<=>",row)

//         let checkUser=await knex("products").where({'sku':row.SKU})
//         let lastId;

//               if(!_.isEmpty(checkUser)){

//                   row.Description=row.Description.replace(/\n/g, '<br/>').replace(/'/g, '');
//                   // for ul and li tag start
//                     let drr2=row.Description.split("#");
//                     for (let i = 0; i < drr2.length; i++) {
//                         if(i%2!=0) drr2[i]="<li>"+drr2[i]+"</li>";
//                     }
//                     drr2 = drr2.filter(function (el) { return el; });
//                     drr2=drr2.toString();
//                     drr2=drr2.replace(/,/g,'');
//                     drr2=drr2.replace('<br/>**<br/>','<ul>')
//                     drr2=drr2.replace('<br/>**','</ul>')
//                     //for ul and li tag End

//                     // for bold text Start
//                       let dr=drr2.split("*");
//                       for (var i = 0; i < dr.length; i++) {
//                           if(i%2!=0) dr[i]="<b>"+dr[i]+"</b>";
//                       }
//                       let dr2=dr.toString();
//                       dr2=dr2.replace(/,/g,'');
//                       // for bold text End
//                     row.Description=dr2;

//                 await knex("products").update({
//                     "name":String(row.ProductName),
//                     "amount":row.Amount ? String(row.Amount):"0",
//                     "inventoryQty":row.InventoryQty ? String(row.InventoryQty):"0",
//                     "doableQty":row.MinQty ? String(row.MinQty):"0",
//                     "searchTags":row.Tags ? String(row.Tags):"0",
//                     "description":row.Description ? String(row.Description):"0",
//                     "userId":userId,
//                     "isActive":"1",
//                     "verified":"1",
//                     "vendorName":row.VendorName ? row.VendorName:"0",
//                     "categoryId": categoryId,
//                     "subcategoryId": subCategoryId,
//                     "subsubcategoryId": subSubCategoryId,
//                     "addingBestselling":row.addingBestselling ? String(row.addingBestselling):"0",
//                     "deleted":"1",
//                     "isActive":"1",
//                   }).where({"sku":row.SKU}).debug()

//                 lastId=checkUser[0].id

//               }else{

//                   row.Description=row.Description.replace(/\n/g, '<br/>').replace(/'/g, '');

//                   // for ul and li tag start
//                   let drr2=row.Description.split("#");
//                   for (let i = 0; i < drr2.length; i++) {
//                       if(i%2!=0) drr2[i]="<li>"+drr2[i]+"</li>";
//                   }
//                   drr2 = drr2.filter(function (el) { return el; });
//                   drr2=drr2.toString();
//                   drr2=drr2.replace(/,/g,'');
//                   drr2=drr2.replace('<br/>**<br/>','<ul>')
//                   drr2=drr2.replace('<br/>**','</ul>')
//                   // // for ul and li tag End

//                   // for bold text Start
//                     let dr=drr2.split("*");
//                     for (var i = 0; i < dr.length; i++) {
//                         if(i%2!=0) dr[i]="<b>"+dr[i]+"</b>";
//                     }
//                     let dr2=dr.toString();
//                     dr2=dr2.replace(/,/g,'');
//                     // for bold text End
//                     row.Description=dr2;

//               lastId=await knex("products").insert({
//                   "name":String(row.ProductName),
//                   "amount":row.Amount ? String(row.Amount):"0",
//                   "inventoryQty":row.InventoryQty ? String(row.InventoryQty):"0",
//                   "doableQty":row.MinQty ? String(row.MinQty):"0",
//                   "searchTags":row.Tags ? String(row.Tags):"0",
//                   "description":row.Description ? String(row.Description):"0",
//                   "userId":userId,
//                   "isActive":"1",
//                   "verified":"1",
//                   "vendorName":row.VendorName ? String(row.VendorName):"0",
//                   "sku":row.SKU ? String(row.SKU):"0",
//                   "categoryId": categoryId,
//                   "subcategoryId": subCategoryId,
//                   "subsubcategoryId": subSubCategoryId,
//                   "addingBestselling":row.addingBestselling ? String(row.addingBestselling):"0",
//                   "deleted":"1",
//                   "isActive":"1",
//                 }).debug();
//                 lastId=lastId[0];
//             }

//           let uploadedFiles=row.main_image_url+','+row.other_image_url;
//           if(!_.isEmpty(uploadedFiles)){
//               let uploadedFiles2 = uploadedFiles.split(",");
//               let updateImageQuery = []
//               for (const key in uploadedFiles2) {
//                 if(!_.isEmpty(uploadedFiles2[key])){
//                     let temp = {
//                       productId: lastId,
//                       image: uploadedFiles2[key],
//                       userId: userId
//                   }
//                   updateImageQuery.push(temp)
//                 }
//               }
//               await knex("productImage").where({ productId:lastId }).del();
//              await uploadImage(updateImageQuery)
//           }
//       }
//       resolve(resData);
//     });
//    })
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };

const uploadImage = async (criteria) => {
  try {
    await knex('productImage').insert(criteria)
  } catch (e) {
    return Promise.reject(e.toString())
  }
};


const getCatgoryId = async (categoryName) => {
  try {
    return new Promise((resolve, reject) => {
        let query = `SELECT id FROM category WHERE LOWER(title)=LOWER('${categoryName}')`;
        knex.raw(query).then(async (rows) => {
          let res = util.nullRemove(rows[0]);
          // console.log("query",query)
          // console.log("res===>",res)
          if (res.length)
              resolve(res[0].id)
          else
              resolve(0)
        });
    });
  } catch (e) {
    return Promise.reject(e.toString())
  }
};

const getSubCategoryId = async (subCategoryName, parentId) => {
  const query = `SELECT id FROM category WHERE LOWER(title)=LOWER('${subCategoryName}') AND parentId=${parentId}`;
  try{
    return await new Promise((resolve, reject) => {
      knex.raw(query)
          .then(rows => {
            const res = util.nullRemove((rows[0]));
            if(res.length){
              resolve(res[0].id);
            } else {
              resolve(0);
            }
          });
    });
  } catch(error) {
    return Promise.reject(error.toString());
  }
};

const givePurchaseOrder = async (criteria) => {
  try {
    const uniqueId = await util.getUniqueCode(
      "ORDERID-",
      "enquiry_order",
      "uniqueId"
    );

    let res = await knex("enquiry_order")
      .where("isActive", "1")
      .where({
        enqId: criteria.enqId,
        assignUserId: criteria.userId,
        orderAccept: "1",
      })

    let ids = await knex("enquiry_order").where("isActive", "1").where({enqId: criteria.enqId,assignUserId: criteria.userId});

    // Enquiry converted to order
    if (res.length){
      await knex("enquiry_order")
      .update({ adminAssign: "1", uniqueId: uniqueId, orderAccept: "1",update_status2:"Enquiry converted to order" })
      .where({ enqId: criteria.enqId, assignUserId: criteria.userId })
    }else{
     let id=await knex("enquiry_order").update({ adminAssign: "1", uniqueId: uniqueId, orderAccept: "0",
     update_status2:"Enquiry converted to order" })
      .where({ enqId: criteria.enqId, assignUserId: criteria.userId })
    }

        let token=await knex("users").where({id:criteria.userId})
        const notificationPayload = {}
        notificationPayload.title = "Purchase Order";
        notificationPayload.description = "Order Id: " +ids[0].id;
        notificationPayload.type = "ORDER";
        notificationPayload.userId = criteria.userId || 0;
        notificationPayload.sendStatus = 1
        notificationPayload.isActive = 1
        notificationPayload.gcmId = token[0].appToken

        util.sendNotif(notificationPayload)
        await knex('notifications').insert(notificationPayload)

  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const updatePdf = async (criteria) => {
  try {
    let res = await knex(criteria.table)
      .where("isActive", "1")
      .orderBy("id", "desc")
      .limit(1);

    await knex(criteria.table)
      .update({ pdfUrl: criteria.pdf })
      .where({ id: res[0].id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getLastPdfUniqueId = async (criteria) => {
  try {
    let res = await knex(criteria.table)
      .where("isActive", "1")
      .orderBy("id", "desc")
      .limit(1)

    if (res.length) return util.nullRemove(res[0].uniqueId);
    else return "";
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getPDF = async (criteria) => {
  try {
    let res = await knex(criteria.table)
      .where("isActive", "1")
      .where("uniqueId", criteria.id)

    if (res.length) return util.nullRemove(res[0].pdfUrl);
    else return "";
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const checkPDF = async (criteria) => {
  try {
    let res;

    if(criteria.table==="invoice"){
      res = await knex(criteria.table)
      .where("isActive", "1")
      .where("enqId", criteria.id)
    }else{
      res = await knex(criteria.table)
      .where("isActive", "1")
      .where("enqId", criteria.id)
      .where("assignUserId", criteria.assignUserId)
    }

    // // console.log("res===", res);
    if (res.length) return util.nullRemove(res[0].pdfUrl);
    else return "";
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const clientUpdatePost = async (criteria) => {
  try {
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const updateContent = async (criteria) => {
  try {
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const updateTestimonials = async (criteria) => {
  // // console.log("criteriaMODELS",criteria)
  try {
    const {id,testimonialImg,name,title,description} = criteria;

    await knex("cms").update({
        title:criteria.title,
        name:criteria.name,
        description:criteria.description,
        link:criteria.testimonialImg})
        .where({ id:criteria.id })


  } catch (e) {
    // // console.log("e.toString()",e.toString())
    return Promise.reject(e.toString());
  }
};

const updateFaqs = async (criteria) => {
  try {
    const { id, isFaq, question, description } = criteria;

    await knex("cms")
      .update({ isActive: isFaq, title: question, description })
      .where({ id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const deleteCms = async (criteria) => {
  try {
    const { id } = criteria;

    await knex("cms").where({ id }).del();
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const updateCms = async (criteria) => {
  try {
    const { id, isCms, title, link } = criteria;

    await knex("cms").update({ isActive: isCms, title, link }).where({ id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const patchCms = async (criteria) => {
  try {
    const { id, isCms } = criteria;

    await knex("cms").update({ isActive: isCms }).where({ id });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const cmsList = async (criteria) => {
  try {
    const { type } = criteria;

    const cms = await knex("cms").select(`*`).where({ type });
    return cms
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const orderInvoice = async (criteria) => {
  delete criteria.type
  try {
    await knex("invoice")
    .insert(criteria)
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editWebsiteOrders = async (criteria) => {
  try {
    await knex("websiteOrder")
    .update(criteria)
    .where({ id: criteria.id })
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getStories = async () => {
  try {
    const stories = await knex("stories").select(`*`);
    return stories
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const addStoriesPost = async (criteria) => {
  try {
    // // console.log(criteria, "criteria")
    await knex("stories")
    .insert(criteria);

    return Promise.resolve("Success")
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const editStoriesPut = async (criteria) => {
  try {
    const { title, description, image,url } = criteria

    const payload = {
      title, description,url
    }

    if(image){
      payload['image'] = image
    }

    await knex("stories")
    .update(payload)
    .where({ id: criteria.id }).debug()
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const gallery = async () => {
  try {
    return new Promise((resolve, reject) => {
      let query = `SELECT images AS url,SUBSTRING_INDEX(images,"/",-1) AS file FROM galleryImage WHERE isActive='1'`;
      knex.raw(query).then(async (rows) => {
        let res = util.nullRemove(rows[0]);
            resolve(res)
          })
        })
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const awards = async () => {
  try {
    return new Promise((resolve, reject) => {
      let query = `SELECT a.id,image,title,a.isActive,isPublished,a.created_at, ad.name ,a.userId,(SELECT COUNT(id)  FROM awards WHERE id=a.id )AS totalAwards
      FROM awards AS a LEFT JOIN users AS u ON u.id = a.userId LEFT JOIN artisan_details AS ad ON ad.userId = u.id`;

      knex.raw(query).then(async (rows) => {
        let res = util.nullRemove(rows[0]);
            resolve(res)
          })
        })
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const storiesDelete = async (criteria) => {
  try {
    await knex("stories")
    .where({ id: criteria.id })
    .del()
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const notif = async () => {
  try{
      let responce=await knex("notificationList")
                        .select('id','type','to','description','isActive','createdAt as created_at', 'groupName')
                        .where({ isActive:'1' })

    return responce;
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const notifDelete = async (criteria) => {
  try {
    await knex("notificationList")
    .where({ id: criteria.id })
    .del()
  } catch (e) {
    return Promise.reject(e.toString());
  }
};


const repeatNotification = async (id) => {
  try {

    const result=await knex("notificationList").where({ id })

    if(result.length){

      if(result[0].to === "All"){

        let artisan = await knex("users").select("id","appToken").where("isActive", "1")
                        .where("deleted", "1").where("role", "2").where("appToken","!=","")//

          artisan.map(async (artisanData) => {

            const notificationPayload = {}

            notificationPayload.title = result[0].description || '';
            notificationPayload.description = result[0].description || '';
            notificationPayload.type = result[0].type;
            notificationPayload.userId = artisanData.id || 0;
            notificationPayload.sendStatus = 1
            notificationPayload.isActive = 1
            notificationPayload.gcmId = artisanData.appToken

            util.sendNotif(notificationPayload)
            await knex('notifications').insert(notificationPayload)
          });

      }else{
        // // console.log("result=== SPEFIC GROUP",result)

      return new Promise((resolve, reject) => {

        let query = `SELECT GROUP_CONCAT(DISTINCT total_artisan) AS  total_artisan,GROUP_CONCAT( group_name) AS  group_name
        FROM  artisan_group WHERE id IN(${result[0].to})`;

        knex.raw(query).then(async (rows) => {
          let res = util.nullRemove(rows[0]);
              if(res.length){

                    const artisanArr = [ ...new Set(res[0]["total_artisan"].split(","))];

                    const artisan = await knex("users")
                          .select("id","appToken")
                          .where("isActive", "1")
                          .where("deleted", "1")
                          .where("role", "2")
                          .whereIn('id',(artisanArr))
                          .where("appToken","!=","")
                          // .toString()
                          //

                    artisan.map(async (artisanData) => {

                          const notificationPayload = {}

                            notificationPayload.title = result[0].description || '';
                            notificationPayload.description = result[0].description || '';
                            notificationPayload.type = result[0].type;
                            notificationPayload.userId = artisanData.id || 0;
                            notificationPayload.sendStatus = 1
                            notificationPayload.isActive = 1
                            notificationPayload.gcmId = artisanData.appToken

                            util.sendNotif(notificationPayload)
                            await knex('notifications').insert(notificationPayload)
                    });
                resolve();
              }else{
                resolve();
            }
         });
      });
    }
   }
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

// const addNotif = async (criteria) => {
//   try {
//     if (criteria.userIds === "All") {
//       const artisan = await knex("users")
//         .select("id","appToken")
//         .where("isActive", "1")
//         .where("deleted", "1")
//         .where("role", "2")
//         .where("appToken","!=","")
//         // .toString()

//         await knex("notificationList").insert({
//           type:criteria.type,
//           to:criteria.userIds,
//           description:criteria.message,
//           groupName:"All Artisan"
//         })

//       artisan.map(async (artisanData) => {

//         const notificationPayload = {}

//         notificationPayload.title = criteria.message || '';
//         notificationPayload.description = criteria.message || '';
//         notificationPayload.type = criteria.type;
//         notificationPayload.userId = artisanData.id || 0;
//         notificationPayload.sendStatus = 1
//         notificationPayload.isActive = 1
//         notificationPayload.gcmId = artisanData.appToken

//         util.sendNotif(notificationPayload)

//         await knex('notifications').insert(notificationPayload);

//       });
//     } else {

//       return new Promise((resolve, reject) => {
//         let query = `SELECT GROUP_CONCAT(DISTINCT total_artisan) AS  total_artisan,GROUP_CONCAT( group_name) AS  group_name
//         FROM  artisan_group WHERE id IN(${criteria.userIds})`;

//         knex.raw(query).then(async (rows) => {
//           let res = util.nullRemove(rows[0]);
//               if(res.length){

//                   await knex("notificationList").insert({
//                       type:criteria.type,
//                       to:criteria.userIds,
//                       description:criteria.message,
//                       groupName:res[0].group_name
//                     })

//                     const artisanArr = [ ...new Set(res[0]["total_artisan"].split(","))];

//                     const artisan = await knex("users")
//                           .select("id","appToken")
//                           .where("isActive", "1")
//                           .where("deleted", "1")
//                           .where("role", "2")
//                           .whereIn('id',(artisanArr))
//                           .where("appToken","!=","")
//                           // .toString()
//                           //

//                     artisan.map(async (artisanData) => {

//                           const notificationPayload = {}

//                             notificationPayload.title = criteria.message;
//                             notificationPayload.description = criteria.message || '';
//                             notificationPayload.type = criteria.type;
//                             notificationPayload.userId = artisanData.id || 0;
//                             notificationPayload.sendStatus = 1
//                             notificationPayload.isActive = 1
//                             notificationPayload.gcmId = artisanData.appToken

//                             util.sendNotif(notificationPayload)
//                             await knex('notifications').insert(notificationPayload)
//                     });
//                 resolve();
//               }else{
//                 resolve();
//               }

//         });
//       });
//     }
//   } catch (error) {
//     // console.log(error)
//     return Promise.reject(e.toString());
//   }
// }

const addNotif = async (criteria) => {
  try {

    return new Promise((resolve, reject) => {
              let query = `SELECT id,appToken from users WHERE isActive='1' and deleted='1' and role='2' and
              appToken!='' and find_in_set(id,'${criteria.userIds}')`;

              // console.log("query==",query)
              knex.raw(query).then(async (rows) => {
                let res = util.nullRemove(rows[0]);
                if(res.length){

                    await knex("notificationList").insert({
                        type:criteria.type,
                        to:criteria.group,
                        description:criteria.message,
                        groupName:"All Artisan"
                      })

                      res.map(async (artisanData) => {
                          const notificationPayload = {}
                          notificationPayload.title = criteria.message || '';
                          if(criteria.type=="URL"){

                            notificationPayload.title = criteria.message;
                            notificationPayload.title=notificationPayload.title.replace(criteria.URL, '')
                            notificationPayload.description = criteria.URL || '';

                          }else{
                            notificationPayload.title = criteria.message || '';
                            notificationPayload.description = criteria.message || '';
                          }

                          notificationPayload.type = criteria.type;
                          notificationPayload.userId = artisanData.id || 0;
                          notificationPayload.sendStatus = 1
                          notificationPayload.isActive = 1
                          notificationPayload.gcmId = artisanData.appToken

                          // console.log("notificationPayload",notificationPayload)
                          util.sendNotif(notificationPayload)
                          await knex('notifications').insert(notificationPayload)
                        });
                }
            resolve(res)
        })
      })
  } catch (error) {
    // // console.log(error)
    return Promise.reject(e.toString());
  }
}


const getNotificationList = async () => {
  try {
    return new Promise((resolve, reject) => {

      let query = `SELECT t1.*,t2.name as ArtisanName from notifications as t1 join artisan_details as t2 on t1.userId=t2.userId`;

      knex.raw(query).then(async (rows) => {
            let res = util.nullRemove(rows[0]);
          resolve(res)
      })
    })
  } catch (error) {
    // // console.log(error)
    return Promise.reject(e.toString());
  }
}

const getlogisticDetails = async (id) => {
  try {
       let res=await knex('logistics_detail').where('isActive','1').where('orderId',id)

      //  // console.log("res==",res)
      if(res.length)
          return res[0];
      else
          return {}
  } catch (e) {
     return Promise.reject(e.toString())
  }
}


const getProductionTracker = async (id) => {
  try {

       let res,files;

       res = await knex('production_tracker')
              .select('id','productionStatus','paymentStatus','created_at','deliveryDate','orderId')
              .where({isActive:1})
              .where({orderId:id})

       res = util.nullRemove(res);
       if(res.length){
          let dt=res[0].created_at;
          let resDate = dt.substring(0,10)+"T00:00:00.000Z";
          res[0].created_at=resDate;
          files = await getProductionTrackerFiles({tracker_id:res[0].id});
          res[0].files=files;
          res=res[0]
          // // console.log("hello",res)
       }else{
          res={}
       }

    return res;
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

const editProductionTracker = async (criteria) => {
  let {id}=criteria;
  delete criteria.id;

  try {
        await knex('production_tracker').update(criteria).where({orderId:id})
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const websiteOrderEdit = async (criteria) => {
  let {EnqId}=criteria;
  // delete criteria.EnqId;
  try {
        let datetime = new Date();
        await knex('enquiries').update({update_status:criteria.update_status,updated_at:datetime}).where({id:EnqId})
  } catch (e) {
     return Promise.reject(e.toString())
  }
}


const addSubAdmin = async (criteria) => {
  try {

      let hashPassword = await bcrypt.hash(criteria.password, util.saltRounds())

        let lastId=await knex('users').insert(
          { email:criteria.email,
            mobile:criteria.mobile,
            password:hashPassword,
            role:'4',
            isActive:'1',
          })


        await knex('user_details').insert({name:criteria.name,userId:lastId[0]})

        await knex('subAdminRoleType').insert({subAdminRoleId:criteria.roleIds,userId:lastId[0]})

      // // console.log("lastId",lastId)
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getSubAdminRole = async () => {
  try {
        let res=await knex('subAdminRole').where({isActive:'1'})
        return res;
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getSubAdminList = async () => {
  try {
  return new Promise((resolve) => {
    let query = `SELECT u.mobile,u.email,st.id, u.email, u.isActive,profileImage,name,groupName as groupName,subAdminRoleId,
      (select count(id) from subAdminRoleType where u.id = userId ) as totalGroup,(LENGTH(totalArtisan) - LENGTH(REPLACE(totalArtisan, ',', '')) + 1) as totalArtisan,u.id as userId
       FROM users AS u  LEFT JOIN user_details AS ud ON u.id = ud.userId LEFT JOIN subAdminRoleType AS st ON u.id = st.userId
       WHERE role='4' and deleted='1'`

       knex
       .raw(query)
       .then((res) => {
        const res2 = util.nullRemove(res[0]);
        resolve(res2);
     })
   })
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const createSubAdminGroup = async (criteria) => {
  let {id,email,name,userId}=criteria;

  delete criteria.id;
  delete criteria.userId;
  delete criteria.email;
  delete criteria.name;

  try {
        await knex('subAdminRoleType').update(criteria).where({id:id})
        await knex('users').update({email:email}).where({id:userId})
        await knex('user_details').update({name:name}).where({userId:userId})
        // await addSubAdminCategory(id);
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const addSubAdminCategory = async (id) => {
  try {
        let res=await knex('subAdminRoleType').where({id:id})
        if(res.length){
          return new Promise((resolve) => {
            let query = `SELECT id,parentId FROM category WHERE deleted = '1' AND title != '' AND parentId IN( SELECT id FROM category WHERE deleted = '1' AND title != '' AND parentId='1')`

               knex
               .raw(query)
               .then( async(result) => {
                const res2 = result[0];

              let checkCategory=await knex('subAdminCategory').where({userId:res[0].userId})
                if(!checkCategory.length){
                  res2.forEach(async (element, i) => {
                    await knex('subAdminCategory').insert(
                          { categoryId:element.parentId,
                            subcategoryId:element.id,
                            userId:res[0].userId
                          })
                        resolve(element);
                      })
                }
             resolve(res2);
           })
        })
      }
  } catch (e) {
     return Promise.reject(e.toString())
  }
}


const viewSubAdminCategorylist = async () => {
  try {
    return new Promise((resolve) => {
      let query = `SELECT t1.id, t1.id AS categoryId,(SELECT id FROM category WHERE isActive='1' AND deleted='1'  AND id=t1.parentId) AS subcategoryId,
                t1.image, t1.title AS categoryName,t1.isActive,(SELECT title FROM category WHERE isActive='1' AND deleted='1'  AND id=t1.parentId) AS subcategoryName,
                mobile,email, (SELECT NAME FROM user_details WHERE userId=t1.userId) AS subAdminName,verified
                FROM category AS t1  JOIN users AS t2 ON t1.userId=t2.id
                WHERE t1.isActive='1' AND t1.deleted='1'  AND userId!='1'`

      // let query=`SELECT id, t1.id AS categoryId,(SELECT id FROM category WHERE isActive='1' AND deleted='1'  AND id=t1.parentId) AS subcategoryId,
      //           t1.image, t1.title AS categoryName,t1.isActive,(SELECT title FROM category WHERE isActive='1' AND deleted='1'  AND id=t1.parentId) AS subcategoryName,
      //         (SELECT mobile FROM users WHERE isActive='1' AND deleted='1'  AND id=t1.userId) AS mobile,
      //         (SELECT NAME FROM user_details WHERE userId=t1.userId) AS subAdminName,verified
      //         FROM category AS t1  WHERE t1.isActive='1' AND t1.deleted='1' AND userId!='1' `;
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

const subAdminCategoryAction = async (criteria) => {
  try {
        await knex('subAdminCategory').update({isActive:criteria.isActive}).where({id:criteria.id})
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getGroupUser = async (id) => {
  try {

  if(id === 'All'){

    return new Promise((resolve) => {
      let query = `SELECT ad.userId as id, ad.name, ad.artisanImage, u.mobile, ad.state AS stateName, u.email, u.isActive,
          ad.userId,role,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,
         (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
         FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId
         WHERE  role='${util.role('artisan')}'`

         knex
         .raw(query)
         .then( async(result) => {
          const res2 = util.nullRemove(result[0]);
          resolve(res2);
      })
    })
  }else{
    return new Promise((resolve, reject) => {
      let query = `SELECT GROUP_CONCAT(DISTINCT total_artisan) AS  total_artisan,GROUP_CONCAT( group_name) AS  group_name
      FROM  artisan_group WHERE id IN(${id})`;

      // // console.log("query",query)

      knex.raw(query).then(async (rows) => {
        let res = util.nullRemove(rows[0]);
        if(res.length){
                  const artisanArr = [ ...new Set(res[0]["total_artisan"].split(","))];
                  const artisan = await getArtisanList(artisanArr)
                  resolve(artisan);
                }
              })
        })
      }
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getArtisanList = async (artisanArr) => {
  try {
    return new Promise((resolve) => {
      let query = `SELECT ad.userId as id, ad.name, ad.artisanImage, u.mobile, ad.state AS stateName, u.email, u.isActive,
          ad.userId,role,(SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id) AS totalEnq,
         (SELECT COUNT(id) FROM enquiry_order WHERE  isActive='1' AND assignUserId=u.id AND orderAccept='1') AS totalOrders
         FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId
         WHERE  role='${util.role('artisan')}' and u.id in (${artisanArr})`

         knex
         .raw(query)
         .then( async(result) => {
          const res2 = util.nullRemove(result[0]);
          resolve(res2);
      })
    })
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getSubAdminDetails = async (id) => {
  try {

    return new Promise((resolve) => {

      let query = `SELECT u.mobile,u.email,st.id, u.email, u.isActive,profileImage,name,groupName as groupName,subAdminRoleId,
      (select count(id) from subAdminRoleType where u.id = userId ) as totalGroup,totalArtisan as totalArtisan ,
      groupId
       FROM users AS u  LEFT JOIN user_details AS ud ON u.id = ud.userId LEFT JOIN subAdminRoleType AS st ON u.id = st.userId
       WHERE role='4' and deleted='1'and st.id='${id}'`

         knex
         .raw(query)
         .then( async(result) => {
          const res2 = util.nullRemove(result[0]);

          if(res2.length){

                let Roles=await getRoles(res2[0].subAdminRoleId)
                res2[0].subAdminRoleList=Roles;
                // // console.log("Roles",Roles)
          }

          resolve(res2);
      });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getRoles = async (id) => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT id,title from subAdminRole where isActive='1' and find_in_set (id,'${id}')`

         knex
         .raw(query)
         .then( async(result) => {
          const res2 = util.nullRemove(result[0]);
           resolve(res2);
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getGalleryList = async () => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT t1.id,t1.title,(SELECT artisanImage FROM artisan_details  WHERE userId=t1.userId) AS artisanImage,
      (SELECT NAME FROM artisan_details WHERE userId=t1.userId) AS artisanName,(SELECT COUNT(id) FROM galleryImage WHERE gallery_id=t1.id) AS totalImage
      FROM gallery AS  t1 JOIN galleryImage AS t2 ON t1.id=t2.gallery_id WHERE t1.isActive='1' AND t2.isActive='1' GROUP BY t1.id`

         knex
         .raw(query)
         .then( async(result) => {

          let res2 = util.nullRemove(result[0]);
          resolve(res2)
        });
     });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}


const getGalleryDetails = async (id) => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT t1.id,t1.title,(SELECT artisanImage FROM artisan_details  WHERE userId=t1.userId) AS artisanImage,
      (SELECT NAME FROM artisan_details WHERE userId=t1.userId) AS artisanName,(SELECT COUNT(id) FROM galleryImage WHERE gallery_id=t1.id) AS totalImage
      FROM gallery AS  t1 JOIN galleryImage AS t2 ON t1.id=t2.gallery_id WHERE t1.isActive='1' AND t2.isActive='1' and t1.id='${id}' GROUP BY t1.id`

         knex
         .raw(query)
         .then( async(result) => {

          let res2 = util.nullRemove(result[0]);
          let promiseArr = [];
              res2.forEach((element, i) => {
                promiseArr.push(
                  new Promise(async (resolve, reject) => {
                    element["Images"] = await knex('galleryImage').select('id','images').where({gallery_id:element.id});
                    resolve(element);
                  })
                );
              });
              Promise.all(promiseArr).then((values) => { resolve(values); });
          });
     });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

// const inCompleteProfileNotification = async () => {
//   try {
//     return new Promise((resolve) => {

//       let query = `SELECT ad.name, ad.artisanImage, ad.state,ad.userId,ad.kycImage,appToken
//          FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId
//          WHERE  role='${util.role('artisan')}' and deleted='1' and appToken is not NULL`

//          knex
//          .raw(query)
//          .then( async(result) => {

//           let res2 = util.nullRemove(result[0]);
//           res2.forEach(async (element, i) => {
//               let notificationPayload = {}
//                 if(_.isEmpty(element.state)){

//                   notificationPayload.title = "Your Profile incomplete " || '';
//                   notificationPayload.description = "Your Profile incomplete " || '';
//                   notificationPayload.type = "Profile";
//                   notificationPayload.userId = element.userId || 0;
//                   notificationPayload.sendStatus = 1
//                   notificationPayload.isActive = 1
//                   notificationPayload.gcmId = element.appToken

//                   util.sendNotif(notificationPayload)
//                   await knex('notifications').insert(notificationPayload)

//                 }else if(_.isEmpty(element.artisanImage)){

//                   notificationPayload.title = "Your Profile incomplete " || '';
//                   notificationPayload.description = "Your Profile incomplete " || '';
//                   notificationPayload.type = "Profile";
//                   notificationPayload.userId = element.userId || 0;
//                   notificationPayload.sendStatus = 1
//                   notificationPayload.isActive = 1
//                   notificationPayload.gcmId = element.appToken

//                   util.sendNotif(notificationPayload)
//                   await knex('notifications').insert(notificationPayload)

//                 }
//               });
//               resolve();
//         });
//     });
//   } catch (e) {
//      return Promise.reject(e.toString())
//   }
// }

const inCompleteProfileNotification = async () => {
  try {
    return new Promise(async (resolve) => {
      await sleep(3000)
      let query = `SELECT ad.name, ad.artisanImage, ad.state,ad.userId,ad.kycImage,appToken
         FROM artisan_details AS ad  LEFT JOIN users AS u ON u.id = ad.userId
         WHERE  role='${util.role('artisan')}' and deleted='1' and appToken is not NULL`

         // console.log("query==>",query)

         knex
         .raw(query)
         .then( async(result) => {

          await sleep(3000)

          let res2 = util.nullRemove(result[0]);
          // res2.forEach(async (element, i) => {
            for(let i=0;i<res2.length;i++){
              let element=res2[i];

              if(!_.isEmpty(element)){

              // console.log("element",element)
              let notificationPayload = {}

                if(_.isEmpty(element.state)){
                  // console.log("state==>")
                  notificationPayload.title = "Your Profile incomplete " || '';
                  notificationPayload.description = "Your Profile incomplete " || '';
                  notificationPayload.type = "Profile";
                  notificationPayload.userId = element.userId || 0;
                  notificationPayload.sendStatus = 1
                  notificationPayload.isActive = 1
                  notificationPayload.gcmId = element.appToken

                  let resp = await knex.raw(`select * from notifications where title='${notificationPayload.title}' AND DATE(created_at)=DATE(NOW()) and description='${notificationPayload.description}' and type='${notificationPayload.type}' and sendStatus='${notificationPayload.sendStatus}' and isActive='${notificationPayload.isActive}' and gcmId='${notificationPayload.gcmId}'`)
                  // await sleep(3000)
                  if(resp[0].length){
                    // console.log("exist")
                  }else{
                  // console.log("not exist->>>>>>>>>>>")
                  util.sendNotif(notificationPayload)
                  await knex('notifications').insert(notificationPayload)
                  }
                }else
                if(_.isEmpty(element.artisanImage)){

                  // console.log("artisanImage==>")
                  notificationPayload.title = "Your Profile incomplete " || '';
                  notificationPayload.description = "Your Profile incomplete " || '';
                  notificationPayload.type = "Profile";
                  notificationPayload.userId = element.userId || 0;
                  notificationPayload.sendStatus = 1
                  notificationPayload.isActive = 1
                  notificationPayload.gcmId = element.appToken

                  let resp = await knex.raw(`select * from notifications where title='${notificationPayload.title}' AND DATE(created_at)=DATE(NOW()) and description='${notificationPayload.description}' and type='${notificationPayload.type}' and sendStatus='${notificationPayload.sendStatus}' and isActive='${notificationPayload.isActive}' and gcmId='${notificationPayload.gcmId}'`)
                  // await sleep(3000)
                  if(resp[0].length){
                    // console.log("exist")
                  }else{
                    // console.log("not exist->>>>>>>>>>>")
                  util.sendNotif(notificationPayload)
                  await knex('notifications').insert(notificationPayload)
                  }
                }
               }
              };
              resolve();
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}
const order25Done = async () => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT *  FROM ( SELECT DATEDIFF(DATE(po.dueDate ),DATE(po.created_at)) AS totaldays ,DATEDIFF(DATE(po.dueDate ),DATE(NOW())) AS daysLeft,
        ROUND(DATEDIFF(DATE(po.dueDate ),DATE(NOW()))*100/DATEDIFF(DATE(po.dueDate ),DATE(po.created_at)))  AS perOfTotal ,
        eo.id AS orderId,c.id AS EnqId, eo.assignUserId,eo.uniqueId,DATE(po.dueDate )AS deliveryDate,  DATE(po.created_at)AS orderDate,  DATE(NOW()) AS Today ,
        (SELECT appToken FROM users WHERE isActive='1' AND deleted='1' AND id=eo.assignUserId)AS appToken
        FROM enquiries AS c  JOIN enquiry_order AS eo ON c.id = eo.enqId  JOIN po ON c.id=po.enqId
        WHERE eo.isActive=1 AND isGenrate='1' AND c.isActive='1' AND orderAccept='1' AND eo.adminAssign='1'  AND  po.isActive='1' ) t1
        WHERE deliveryDate IS NOT NULL AND DATE(deliveryDate)>DATE(NOW()) AND perOfTotal IN (24,25,26,49,50,51,74,75,76)
        and appToken IS NOT NULL`

         knex
         .raw(query)
         .then( async(result) => {

          let res2 = util.nullRemove(result[0]);

          res2.forEach(async (element, i) => {

            let notificationPayload = {}
                  notificationPayload.title = `Your Order ${element.uniqueId} delivery date ${element.deliveryDate} .` || '';
                  notificationPayload.description = `Your Order ${element.uniqueId} delivery date ${element.deliveryDate} .` || '';
                  notificationPayload.type = "Order";
                  notificationPayload.userId = element.assignUserId || 0;
                  notificationPayload.sendStatus = 1
                  notificationPayload.isActive = 1
                  notificationPayload.gcmId = element.appToken

                  util.sendNotif(notificationPayload)
                  await knex('notifications').insert(notificationPayload)

              });
              resolve();
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const liveShopPanelFreeze = async () => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT t1.id,t1.userId,DATE(t1.created_at) AS productCreatedDate ,t2.appToken,t1.name,t1.sku
      FROM products AS t1 JOIN users AS t2 ON t1.userId=t2.id WHERE t1.isActive='1' AND t1.deleted='1' AND t2.isActive='1'
      AND t2.deleted='1' AND inventoryQty=0  AND DATE_ADD(DATE(t1.created_at),INTERVAL 3 DAY)=DATE(NOW())`

         knex
         .raw(query)
         .then( async(result) => {

          let res2 = util.nullRemove(result[0]);

          res2.forEach(async (element, i) => {

            let notificationPayload = {}
                  notificationPayload.title = `Please update your product ${element.sku} stock quantity .` || '';
                  notificationPayload.description = `Please update your product ${element.sku} stock quantity .` || '';
                  notificationPayload.type = "Product";
                  notificationPayload.userId = element.userId || 0;
                  notificationPayload.sendStatus = 1
                  notificationPayload.isActive = 1
                  notificationPayload.gcmId = element.appToken

                  util.sendNotif(notificationPayload)
                  await knex('notifications').insert(notificationPayload)

              });
              resolve();
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const getProfile = async (userId) => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT t1.email,t1.mobile,t2.name,t2.name2 from users AS t1  join user_details as t2
          ON t1.id=t2.userId WHERE t1.isActive='1' AND t1.deleted='1' and t1.id='${userId}'`

          // // console.log("query",query)
         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
          // // console.log("query=>>>>>>res2",res2)
          resolve(res2);
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const profileUpdate = async (criteria) => {
  try {

    let id = criteria.userId;
    delete criteria.userId;

    await knex('user_details').update({name:criteria.name,name2:criteria.name2}).where({ userId:id });

  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const checkUser2 = async (criteria) => {
  const { email } = criteria
  try {
      const res = await Users.query()
          .where('email', '=', email)
          .whereIn('role', [util.role('admin'),util.role('subadmin')])
          .where('isActive', '=', 1)
      return res
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
          .whereIn('role', [util.role('admin'),util.role('subadmin')])
          .where('isActive','1')

      return user;
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const bannerSequenceChanged = async (ids) => {
  try {

      let ar = ids.split(',')

      const seq1 = await knex('cms').where({'isActive':'1','deleted':'1','type':'Banner','seqId':ar[0]})
      const seq2 = await knex('cms').where({'isActive':'1','deleted':'1','type':'Banner','seqId':ar[1]})

      await knex('cms').update({'seqId':ar[1]}).where({'id':seq1[0].id})
      await knex('cms').update({'seqId':ar[0]}).where({'id':seq2[0].id})

  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const getExhibannerList = async (userId) => {
  try {
    return new Promise((resolve) => {

      let query = `SELECT id,type,description,title,subtitle,link,created_at,isActive,(select count(id) from user_exhibition where exhibitionId=cms.id) as totalUser,name FROM cms WHERE type = 'Exhibition'`

          // // console.log("query",query)
         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
          // // console.log("query=>>>>>>res2",res2)
          resolve(res2);
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const websiteOrdersGet = async (adminId) => {
  try {
    return new Promise((resolve) => {
        let query = `SELECT  e.id AS EnqId, e.title,razorpayOrderId,razorpayPaymentId,addressId,productName,productPrice as expPrice,productQty,orderUserId,orderUserName,
                    (SELECT dueDate FROM po WHERE isActive='1' AND deleted='1' AND enqId=e.id LIMIT 1) AS place_on,eo.uniqueId,eo.id ,${adminId} AS adminId,
                    (SELECT attachment FROM enquiry_attachment WHERE enqId=e.id limit 1) AS image,assignUserId as userId,0 as chatCount,
                    (SELECT kycImage FROM artisan_details WHERE userId=eo.assignUserId) AS artisanPic,update_status2 as update_status,eo.created_at, e.updated_at AS created_at2,
                    e.description,(SELECT name  FROM options WHERE  id=e.materialId) AS materialId,(SELECT name  FROM options WHERE  id=e.craftId) AS craftId,
                    (SELECT NAME FROM artisan_details WHERE userId=eo.assignUserId) AS artisanName FROM  enquiries AS e JOIN enquiry_order AS eo
                    ON e.id=eo.enqId  WHERE e.isActive='1' AND e.isGenrate='1' AND eo.isActive='1' AND eo.orderAccept='1' AND orderType='1'`;

        // // console.log("query===", query);

        knex.raw(query).then((res) => {
          const res2 = util.nullRemove(res[0]);
          resolve(res2);
        });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const getSupportList = async () => {
  try {

      const res = await knex('support').where('isActive','1')
      return res;
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const addEditSupport = async (criteria) => {
  try {
        if(criteria.id){
          let id=criteria.id;
          delete criteria.id;
          await knex('support').update(criteria).where({id:id})
        }else{
          await knex('support').insert(criteria)
        }
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const deleteSupport = async (id) => {
  try {
        await knex('support').where({id:id}).del()
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const getExhibannerUserList = async (id) => {
  try {
       let res = await knex('user_exhibition').where({exhibitionId:id})
       return res;
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const getGalleryPic =  (criteria) => {
  let {EnqId,userId}=criteria
  try {

      return new Promise((resolve, reject) => {
          let query = `select * from chat where EnqId=${EnqId} and isActive='1' and  type IN ('image', 'general') AND ((fromId='${userId}' AND toId='1') OR (fromId='1' AND toId='${userId}'))`;
          // console.log("query",query)
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



const publishAwardToNewsFeed =  async(criteria) => {
  let {id,isPublished}=criteria
  // // console.log("criteria",criteria)
  try {
        await knex('awards').update({isPublished:isPublished}).where({id:id})
        let res = await knex('awards').where({id:id})
        // // console.log("res==",res)

      if(isPublished==='1'){
        if(res.length)
          await knex('newsfeed').insert({image:res[0].image,isPublished:'1',title:res[0].title,type:'app'})
      }

     } catch (e) {
     return Promise.reject(e.toString())
  }
}

const addAdminBussinessDetails = async (data) => {
  try {
      let res=await knex('adminBusiness')
      if(res.length)
        await knex('adminBusiness').update(data).where({id:res[0].id})
      else
       await knex('adminBusiness').insert(data)

  } catch (e) {
      return Promise.reject(e.toString())
  }
}


const getAdminBussinessDetails = async () => {
  try {
      let res=await knex('adminBusiness')
      return res;
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const senWebNotifi = async () => {
  try {
    let notificationPayload={};

    notificationPayload.title = "LAL10TEST_title";
    notificationPayload.description = "LAL10TEST_description";
    notificationPayload.type = "result[0].type";
    notificationPayload.userId = "artisanData.id || 0";
    notificationPayload.sendStatus = 1
    notificationPayload.isActive = 1

    notificationPayload.gcmId ="d67WIE5RYnFdC0kI2xdNZq:APA91bH8UigsbnnghPXsmAsa_cC3RRoOqdEHqx3ElyRW8uE2iZk6N7Acq_XdKL-txpl3sGvCa7zGMrmyovVq1EsadWDRD9yF1G1NIPzWAHFwFEcVHJsrH3VqZsCcfdcbI1djHR2t-rvA"
    // notificationPayload.gcmId ="T0rwwI2vS6GkhrakRfzaMXnjlNtgBDAQZLxUsZJ"
    util.sendNotif(notificationPayload)

  } catch (e) {
      return Promise.reject(e.toString())
  }
}

  const editAboustUs = async (data) => {
    try {
          await knex('aboutUs').update({description:data.description})
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const uploadBrand = async (data) => {
    try {
          await knex('brand').insert({logo:data.logo,userId:data.userId})
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getBrand = async () => {
    try {
         let res=await knex('brand')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const addTeam = async (data) => {
    //
    try {
      await knex('ourTeam').insert({name:data.name,image:data.image,designation:data.designation})
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getTeam = async () => {
    try {
         let res=await knex('ourTeam')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const addCarrer = async (data) => {

    try {
      await knex('carrer').insert({title:data.title,description:data.description,position:data.position,totalOpening:data.totalOpening})
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getCarrer = async () => {
    try {
         let res=await knex('carrer')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }
  //

  const addPrivacyPolicy = async (data) => {

    try {
      await knex('privacyPolicy').del();
      await knex('privacyPolicy').insert({title:data.title,description:data.description})
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getPrivacyPolicy = async () => {
    try {
         let res=await knex('privacyPolicy')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const addReturnPolicy = async (data) => {

    try {
      await knex('refundPolicy').del();
      await knex('refundPolicy').insert({title:data.title,description:data.description})
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getReturnPolicy = async () => {
    try {
         let res=await knex('refundPolicy')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const addCatalouge = async (data) => {
    try {
      await knex('catalogue').insert({title:data.title,description:data.description,link:data.link})
      return ;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getCatalouge = async () => {
    try {
         let res=await knex('catalogue')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const addBlogs = async (data) => {
    try {
      await knex('blogs').insert({title:data.title,description:data.description,link:data.link,image:data.image})
      return ;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const getBlogs = async () => {
    try {
         let res=await knex('blogs')
         return res;
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

  const deleteData = async (data) => {

    try {
         await knex(data.type).where({id:data.id}).del()
    } catch (e) {
        return Promise.reject(e.toString())
    }
  }

// const getManageListing = async (criteria) => {
//   try {
//     return new Promise((resolve) => {
//       let query;
//       // console.log("criteria,",criteria)
//       if(criteria.stateId){
//         if(criteria.craftId){
//             if(criteria.materialId){
//               query = `select id,name,type,stateId from options where type='products' and find_in_set(stateId,'${criteria.stateId}') and find_in_set(craftId,'${criteria.craftId}') and find_in_set(materialId,'${criteria.materialId}')`
//             }else{
//               query = `select id,name,type,stateId from options where type='material' and find_in_set(stateId,'${criteria.stateId}') and find_in_set(craftId,'${criteria.craftId}')`
//             }
//         }else{
//           query = `select id,name,type,stateId from options where find_in_set(stateId,'${criteria.stateId}') and type='craft'`
//         }
//       }else{
//         query = `select id,name,type,stateId from options where type='state'`
//       }
//          // console.log("quesry==",query)

//          knex
//          .raw(query)
//          .then( async(result) => {
//           let res2 = util.nullRemove(result[0]);
//           resolve(res2);
//         });
//     });
//   } catch (e) {
//      return Promise.reject(e.toString())
//   }
// }


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

              query = `select id,name,type,stateId from options where type='products' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and  CONCAT(",", craftId, ",") REGEXP ",(${craftId})," and CONCAT(",", materialId, ",") REGEXP ",(${materialId}),"`
            }else{
              query = `select id,name,type,stateId from options where type='material' and CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and CONCAT(",", craftId, ",") REGEXP ",(${craftId}),"`
            }
        }else{
          query = `select id,name,type,stateId from options where CONCAT(",", stateId, ",") REGEXP ",(${stateId})," and type='craft'`
        }
      }else{
        query = `select id,name,type,stateId from options where type='state'`
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


const getManageListingCraft = async (criteria) => {
  try {
    return new Promise((resolve) => {
      let query;

      // console.log("criteria,",criteria)

      if(criteria.stateId){
        let stateId=criteria.stateId.replace(/,/g,"|");
        query = `select id,name,type,stateId from options where type='material' and CONCAT(",", stateId, ",") REGEXP ",(${stateId}),"`
         // console.log("quesry==",query)

         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
          resolve(res2);
        });
      }
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}


const getManageListingProduct = async (criteria) => {
  try {
    return new Promise((resolve) => {
      let query;

      // console.log("criteria,",criteria)

      if(criteria.stateId){
        let stateId=criteria.stateId.replace(/,/g,"|");
        query = `select id,name,type,stateId from options where type='products' and CONCAT(",", stateId, ",") REGEXP ",(${stateId}),"`
         // console.log("quesry==",query)

         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
          resolve(res2);
        });
      }
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const deleteEnquiry = async (criteria) => {
  try {
    await knex("enquiries").update({ status:'0', isActive: '0',deleted:'0' }).where({ id: criteria.id });
    await knex("enquiry_order").update({ isActive: '0'}).where({ enqId: criteria.id });
    await knex("chat").update({ isActive: '0'}).where({ EnqId: criteria.id });
    await knex("estimate").update({ isActive: '0',deleted:'0' }).where({ enqId: criteria.id });
    await knex("po").update({isActive: '0',deleted:'0' }).where({ enqId: criteria.id });
    await knex("invoice").update({  isActive: '0',deleted:'0' }).where({ enqId: criteria.id });
    return;
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const editBanner = async (criteria) => {
  try {
      let id=criteria.id;
      delete criteria.id;
    // await knex("cms").update({ link:criteria.link, title: criteria.title,description: criteria.description })
        await knex("cms").update(criteria)
      .where({ id:id });
    return;
  } catch (e) {
      return Promise.reject(e.toString())
  }
}

const sleep=(ms)=>{
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


const importListing = async (filePath) => {
  try {
    const csvData = {};

    const recipients = await csvToJson({ trim: true }).fromFile(filePath);

    const existData=[];
    let stateId,craftId,materialId,productId,craftCheck,materialCheck,productCheck,
    materialCheck2,productCheck2,productCheck3;
    let i=0;

      for(i=0;i<recipients.length;i++){
        criteria=recipients[i];

      //////////////// state check and adding ///////////////////////////
      stateId=await checkType({"type":"state","name":criteria.State,
        "ImagURL":criteria.StateImagURL,"Hindi":criteria.StateHindi,
        "Bengali":criteria.StateBengali,"Gujrati":criteria.StateGujrati});

      /////////////// craft check and adding //////////////////////
      craftId=await checkType({"type":"craft","name":criteria.Craft,
        "ImagURL":criteria.CraftImageURL,"Hindi":criteria.CraftHindi,
        "Bengali":criteria.CraftBengali,"Gujrati":criteria.CraftGujrati});

      ////////////////// material check and adding /////////////////////////
      materialId=await checkType({"type":"material","name":criteria.Material,
        "ImagURL":criteria.MaterialImgURL,"Hindi":criteria.MaterialHindi,
        "Bengali":criteria.MaterialBengali,"Gujrati":criteria.MaterialGujrati});

      ////////////////// product check and adding /////////////////////////
      productId=await checkType({"type":"products","name":criteria.Product,
        "ImagURL":criteria.ProductURL,"Hindi":criteria.ProductHindi,
        "Bengali":criteria.ProductBengali,"Gujrati":criteria.ProductGujrati});

      ////////////////////// adding craft State dependency /////////////////
      craftCheck=await knex('options').select('id','stateId').where({id:craftId,"type":"craft"})
      craftCheck=craftCheck[0].stateId + "," + stateId;
      craftCheck=craftCheck.split(',');
      craftCheck = _.without(craftCheck, '0')
      craftCheck=_.uniq(craftCheck)
      await updateData({"type":"craft","craftId":craftId,"stateIdArr":craftCheck});
      // // console.log("craftCheck",craftCheck)

      ///////////////// adding material State dependency ///////////////////////
      materialCheck=await knex('options').select('id','stateId').where({id:materialId,"type":"material"})
      materialCheck=materialCheck[0].stateId + "," + stateId;
      materialCheck=materialCheck.split(',');
      materialCheck = _.without(materialCheck, '0')
      materialCheck=_.uniq(materialCheck)
      await updateData({"type":"material","materialId":materialId,"materialIdArr":materialCheck});
      // // console.log("craftCheck",materialCheck)

      ///////////////////// adding product State dependency ///////////////////////
      productCheck=await knex('options').select('id','stateId').where({id:productId,"type":"products"})
      productCheck=productCheck[0].stateId + "," + stateId;
      productCheck=productCheck.split(',');
      productCheck = _.without(productCheck, '0')
      productCheck=_.uniq(productCheck)
      await updateData({"type":"products","productId":productId,"productIdArr":productCheck});
      // // console.log("productCheck",productCheck)

      ////////////////////// adding material craft dependency /////////////////
      materialCheck2=await knex('options').select('id','craftId').where({id:materialId,"type":"material"})
      materialCheck2=materialCheck2[0].craftId + "," + craftId;
      materialCheck2=materialCheck2.split(',');
      materialCheck2 = _.without(materialCheck2, '0')
      materialCheck2=_.uniq(materialCheck2)
      await updateData({"type":"craftId","materialId":materialId,"craftIdArr":materialCheck2});
      // // console.log("materialCheck2",materialCheck2)

      ////////////////////// adding product craft dependency /////////////////
      productCheck2=await knex('options').select('id','craftId').where({id:productId,"type":"products"})
      productCheck2=productCheck2[0].craftId + "," + craftId;
      productCheck2=productCheck2.split(',');
      productCheck2 = _.without(productCheck2, '0')
      productCheck2=_.uniq(productCheck2)
      await updateData({"type":"craftId2","productId":productId,"productIdArr":productCheck2});
      // // console.log("productCheck2",productCheck2)

      ////////////////////// adding product material dependency /////////////////
      productCheck3=await knex('options').select('id','materialId').where({id:productId,"type":"products"})
      productCheck3=productCheck3[0].materialId + "," + materialId;
      productCheck3=productCheck3.split(',');
      productCheck3 = _.without(productCheck3, '0')
      productCheck3=_.uniq(productCheck3)
      await updateData({"type":"material2","productId":productId,"materialIdArr":productCheck3});
      // // console.log("productCheck3",productCheck3)

      // console.log("craftId",craftId,"materialId",materialId,"productId",productId,"stateId",stateId)

    };

  } catch (e) {
    return Promise.reject(e.toString());
  }
};

const updateData = async (valArr) => {
  try {
    return new Promise((resolve) => {
      let query;
      if(valArr.type==="craft"){
        query = `update options set stateId='${valArr.stateIdArr}' where id='${valArr.craftId}'`
      }
      if(valArr.type==="material"){
        query = `update options set stateId='${valArr.materialIdArr}' where id='${valArr.materialId}'`
      }
      if(valArr.type==="products"){
        query = `update options set stateId='${valArr.productIdArr}' where id='${valArr.productId}'`
      }
      if(valArr.type==="craftId"){
        query = `update options set craftId='${valArr.craftIdArr}' where id='${valArr.materialId}'`
      }
      if(valArr.type==="craftId2"){
        query = `update options set craftId='${valArr.productIdArr}' where id='${valArr.productId}'`
      }
      if(valArr.type==="material2"){
        query = `update options set materialId='${valArr.materialIdArr}' where id='${valArr.productId}'`
      }

      // console.log("query,",query)
         knex
         .raw(query)
         .then( async(result) => {
            resolve();
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}

const addType = async (valArr) => {
  try {
    return new Promise((resolve) => {
      let query;
      if(valArr.type==="craft"){
        query = `insert into options (name,type,isActive,image,userId,hindiName,bangaliName,gujratiName)
        values ('${valArr.name}','${valArr.type}','1','${valArr.ImagURL}','1','${valArr.Hindi}',
        '${valArr.Bengali}','${valArr.Gujrati}')`
      }

      if(valArr.type==="material"){
        query = `insert into options (name,type,isActive,image,userId,hindiName,bangaliName,gujratiName)
        values ('${valArr.name}','${valArr.type}','1','${valArr.ImagURL}','1','${valArr.Hindi}',
        '${valArr.Bengali}','${valArr.Gujrati}')`
      }

      if(valArr.type==="products"){
        query = `insert into options (name,type,isActive,image,userId,hindiName,bangaliName,gujratiName)
        values ('${valArr.name}','${valArr.type}','1','${valArr.ImagURL}','1','${valArr.Hindi}',
        '${valArr.Bengali}','${valArr.Gujrati}')`
      }

      if(valArr.type==="state"){
        query = `insert into options (name,type,isActive,image,userId,hindiName,bangaliName,gujratiName)
        values ('${valArr.name}','${valArr.type}','1','${valArr.ImagURL}','1','${valArr.Hindi}',
        '${valArr.Bengali}','${valArr.Gujrati}')`
     }
         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
            resolve(res2.insertId);
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}


const checkType = async (valArr) => {
  try {

    return new Promise((resolve) => {
      let query;
      if(valArr.type==="craft"){
        query = `select id from options where type="craft" and LOWER(name) like LOWER('${valArr.name}')`
      }
      if(valArr.type==="material"){
        query = `select id from options where type="material" and LOWER(name) like LOWER('${valArr.name}')`
      }
      if(valArr.type==="products"){
        query = `select id from options where type="products" and LOWER(name) like LOWER('${valArr.name}')`
      }
      if(valArr.type==="state"){
        query = `select id from options where type="state" and LOWER(name) like LOWER('${valArr.name}')`
     }

         knex
         .raw(query)
         .then( async(result) => {
          let res2 = util.nullRemove(result[0]);
          if(res2.length){
            resolve(res2[0].id);
          }else{
            resolve(await addType(valArr));
          }
        });
    });
  } catch (e) {
     return Promise.reject(e.toString())
  }
}



module.exports = {
  getManageListingCraft,
  getManageListingProduct,
  addType,
  checkType,
  importListing,
  editBanner,
  deleteEnquiry,
  getManageListing,
  getTotalsGenrateEnquiry,
  GroupListing2Total,
  GroupListing2,
  totalProductGroup,
  deleteData,
  addBlogs,
  getBlogs,
  addCatalouge,
  getCatalouge,
  getReturnPolicy,
  addReturnPolicy,
  getPrivacyPolicy,
  addPrivacyPolicy,
  getCarrer,
  addCarrer,
  getTeam,
  addTeam,
  getBrand,
  uploadBrand,
  senWebNotifi,
  getAdminBussinessDetails,
  addAdminBussinessDetails,
  publishAwardToNewsFeed,
  getGalleryPic,
  getExhibannerUserList,
  deleteSupport,
  addEditSupport,
  getSupportList,
  websiteOrdersGet,
  getExhibannerList,
  bannerSequenceChanged,
  checkPwdToken,
  checkUser2,
  profileUpdate,
  getProfile,
  liveShopPanelFreeze,
  order25Done,
  getNotificationList,
  getGalleryDetails,
  getGalleryList,
  getSubAdminDetails,
  inCompleteProfileNotification,
  getGroupUser,
  subAdminCategoryAction,
  viewSubAdminCategorylist,
  createSubAdminGroup,
  getSubAdminList,
  getSubAdminRole,
  addSubAdmin,
  websiteOrderEdit,
  editProductionTracker,
  getProductionTrackerFiles,
  getProductionTracker,
  getlogisticDetails,
  addNotif,
  repeatNotification,
  notifDelete,
  notif,
  storiesDelete,
  awards,
  gallery,
  getStories,
  addStoriesPost,
  editStoriesPut,
  editWebsiteOrders,
  orderInvoice,
  cmsList,
  patchCms,
  updateCms,
  deleteCms,
  updateFaqs,
  updateTestimonials,
  updateContent,
  dashboard,
  totalArtisan,
  totalProduct,
  totalShop,
  totalEnquiry,
  getCategory,
  getSubCategory,
  getSubSubCategory,
  getEnquiries,
  getTotalEnquiries,
  getWebUser,
  getWebUserById,
  getEnquiryById,
  getEnquiriesAtachment,
  editEnquiry,
  getWebUserCategory,
  getWebUserHearAboutUs,
  GroupListing,
  checkGroupName,
  addGroup,
  deleteGroup,
  editGroup,
  ProductGroupListing,
  checkProductGroupName,
  addProductGroup,
  deleteProductGroup,
  editProductGroup,
  changeStatus,
  checkUserMobile,
  checkUser,
  checkCategoryName,
  addCategory,
  editCategory,
  checkSubCategoryName,
  addSubCategory,
  editSubCategory,
  listingCms,
  getshop,
  getTotalshopCount,
  getIdealshop,
  makeIdealProduct,
  getGenrateEnquiryList,
  genrateEnquiry,
  broadCastEnquiry,
  viewEnquiryArtisan,
  genrateNewEnquiry,
  editGenratedEnquiry,
  genrateEstimate,
  genratePurchaseOrder,
  getOrderList,
  generateInvoice,
  importEnquiries,
  importEnquiryUserCheck,
  importEnquiryInsert,
  importArtisan,
  importArtisanUserCheck,
  importProduct,
  getFromAllProduct,
  getFromAllTotalProduct,
  getTotalIdealProduct,
  givePurchaseOrder,
  updatePdf,
  getPDF,
  getLastPdfUniqueId,
  checkPDF,
  getEnquiryResponceBy,
  removeImage,
  clientUpdatePost,
  editAboustUs,
  viewTotalEnquiryArtisan,
};


