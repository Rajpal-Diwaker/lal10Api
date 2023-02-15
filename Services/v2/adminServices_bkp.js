
const util = require('../../Utilities/util'),
  admin_dao = require('../../dao/v2/admindao'),
  uploadCloud = require('../../middleware/fileUploaderS3'),
  multiparty = require('multiparty'),
  product_dao = require('../../dao/v2/product'),
  appChat_dao = require('../../dao/v2/appChat'),
  web_dao = require('../../dao/v2/webdao'),
  bcrypt = require("bcrypt");

let randomstring = require("randomstring");
let fs = require("fs");
let request = require('request');
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let zlib = require('zlib');
const knex = require("../../db/knex");
const { functions } = require('underscore');
const cron = require('node-cron');
const _ = require("lodash");

const MAX_IMG_SIZE = 12000000; // 12 MB
const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });


// const MAX_IMG_SIZE = 1200; // 12 MB

// const BaseUrl = 'http://15.207.157.139:5656/';


// ***********   dashboard  ************/
const dashboard = util.errHandler(async (req, res) => {
  try {
    let result = await admin_dao.dashboard()
    res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS, result })
  } catch (error) {
    // console.log(error, "dashboard api error")
    res.status(util.statusCode.FOUR_ZERO_ONE).send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Some error while fecthing dashboard data" })
  }
})


// ***********   getCategory  ************/
const getCategory = util.errHandler(async (req, res) => {

  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  let result={}

  let criteria = {
    isBestSelling: 1
  }
  if (+req.query.isBestSelling == 1) {
    criteria['isBestSelling'] = 1
  } else {
    criteria['isBestSelling'] = 1
  }

  client.get('AdmingetCategory', async (err, resData) => {
    if (resData) {
        console.log("Cache DATA AdmingetCategory")
        let data=JSON.parse(resData);
        res.send({ code,message,result:data.result})
    } else {
        result = await admin_dao.getCategory(criteria);
        client.setex('AdmingetCategory',6000,JSON.stringify({result}));
        console.log("DB DATA AdmingetCategory")
        res.send({code,message,result});
    }
  })
});


// ***********   getSubCategory  ************/
const getSubCategory = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.getSubCategory(req.query.id);
    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   getSubSubCategory  ************/
const getSubSubCategory = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.getSubSubCategory(req.query.id);
    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});



// ***********   getEnquiries  ************/
const getEnquiries = util.errHandler(async (req, res) => {

  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  // let { type } = req.query

  let criteria = req.query
  criteria.adminId=req.admin.id;
  criteria.roleId=req.admin.role;
  const resp = await util.subAdmintotalArtisan(req.admin.id);
  if(resp){
      criteria.subAdmintotalArtisan=resp;
  }

  let result = await admin_dao.getEnquiries(criteria);
  let total = await admin_dao.getTotalEnquiries(criteria);

  res.send({ code, message, total, result });
});


// ***********   getEnquiriesById  ************/
const getEnquiryById = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  let { id } = req.query
  let result = await admin_dao.getEnquiryById(id);
  res.send({ code, message, result });
});


// ***********   editEnquiry  ************/
const editEnquiry = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.ENQUIRY_GEN;
  // let { id,craftId,requestTo,type } = req.body
  let result = await admin_dao.editEnquiry(req.body);
  res.send({ code, message, result });
});


// ***********   getWebUser  ************/
const getWebUser = util.errHandler(async (req, res) => {

  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.getWebUser(req.body);

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   getWebUserById  ************/
const getWebUserById = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let { id } = req.query
    let result = await admin_dao.getWebUserById(id);
    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   GroupListing  ************/
const GroupListing = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.GroupListing();
    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});



// ***********   GroupListing2  ************/
const GroupListing2 = util.errHandler(async (req, res) => {
  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.GroupListing2(req.body);
    let total = await admin_dao.GroupListing2Total(req.body);

    // console.log("total",total)

    res.send({ code, message, total,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});



// ***********   checkGroupName  ************/
const checkGroupName = util.errHandler(async (req, res) => {

  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.checkGroupName(req.query.group_name);

    if (result.length) {
      code = util.statusCode.FOUR_ZERO_ONE;
      message = util.statusMessage.GROUP_NAME_EXIST;
    }
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   checkGroupName  ************/
const addGroup = util.errHandler(async (req, res) => {
  try {

    await admin_dao.addGroup(req.body);
    let code = util.statusCode.OK;
    let message = util.statusMessage.GROUP_ADD;
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   editGroup  ************/
const editGroup = util.errHandler(async (req, res) => {
  try {
    await admin_dao.editGroup(req.body);
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   deleteGroup  ************/
const deleteGroup = util.errHandler(async (req, res) => {
  try {
    await admin_dao.deleteGroup(req.query.id);
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   ProductGroupListing  ************/
const ProductGroupListing = util.errHandler(async (req, res) => {
  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.ProductGroupListing(req.body);

    let total = await admin_dao.totalProductGroup(req.body)

    // res.send({ code: util.statusCode.OK , message: util.statusMessage.SUCCESS,  })

    res.send({ code, message, total,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   checkGroupName  ************/
const checkProductGroupName = util.errHandler(async (req, res) => {

  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let result = await admin_dao.checkProductGroupName(req.query.group_name);

    if (result.length) {
      code = util.statusCode.FOUR_ZERO_ONE;
      message = util.statusMessage.GROUP_NAME_EXIST;
    }
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   checkGroupName  ************/
const addProductGroup = util.errHandler(async (req, res) => {
  try {

    await admin_dao.addProductGroup(req.body);
    let code = util.statusCode.OK;
    let message = util.statusMessage.GROUP_ADD;
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});

// ***********   editGroup  ************/
const editProductGroup = util.errHandler(async (req, res) => {
  try {
    await admin_dao.editProductGroup(req.body);
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});

// ***********   checkGroupName  ************/
const deleteProductGroup = util.errHandler(async (req, res) => {
  try {
    await admin_dao.deleteProductGroup(req.query.id);
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

});


// ***********   changeStatus  ************/
const changeStatus = util.errHandler(async (req, res) => {
  try {
    await admin_dao.changeStatus(req.body)
    res.send({ code: 200, message: "Status changed successfully" })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Some error while changing status" })
  }
})


// ****   checkMobile   **** //
const checkMobile = util.errHandler(async (req, res) => {
  try {
    let checkuser = await admin_dao.checkUserMobile(req.body)
    if (checkuser.length) {
      let code = util.statusCode.FOUR_ZERO_ONE;
      let message = util.statusMessage.MOBILE_EXIST;
      res.send({ code, message });
    } else {
      let code = util.statusCode.OK;
      let message = util.statusMessage.SUCCESS;
      res.send({ code, message });
    }

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ****   checkEmail   **** //
const checkEmail = util.errHandler(async (req, res) => {

  try {
    let checkuser = await admin_dao.checkUser(req.body)

    let code = util.statusCode.FOUR_ZERO_ONE;
    let message = util.statusMessage.EMAIL_EXIST;

    if (checkuser.length) {
      res.send({ code, message });
    } else {
      code = util.statusCode.OK;
      message = util.statusMessage.SUCCESS;
      res.send({ code, message });
    }

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

});


// ***********   addCategory  ************/
const addCategory = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles;
    let uploadedFiles2;
    let criteria = [];

    // console.log("req", req.admin.id);

    form.parse(req, async function (err, fields, files) {

      let { name } = fields
      criteria['name'] = name
      criteria['userId'] = req.admin.id

      let checkname = await admin_dao.checkCategoryName(criteria);

      if (checkname.length) {
        res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Category name exit please try something new" })
      } else {


        if (files.banner && files.banner.length > 0) {

          const fileSize=files.banner[0].size;
          if(Number(fileSize) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles = await uploadCloud.upload_image2(files.banner)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.banner, resolve, reject));
          criteria['banner_image'] = uploadedFiles[0]
        }

        if (files.image && files.image.length > 0) {

          const fileSize2=files.image[0].size;
          if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles2 = await uploadCloud.upload_image2(files.image)
          uploadedFiles2 = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
          criteria['image'] = uploadedFiles2[0]
        }
        // await admin_dao.addCategory(criteria);
        res.send({ code, message });

        // for removing chache
        client.keys("*", function (err, keys) {
          console.log("keys",keys)
            keys.forEach(function (key, pos) {
                // if(key.indexOf("m1")>=0){
                  client.del(key, () => {})
                // }
          })
        })
      }
    });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   editCategory  ************/
let editCategory = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    // const form = new multiparty.Form();
    let form = new multiparty.Form({}); //setting max size of image to 10MB
    let uploadedFiles, uploadedFiles2, criteria = [];

    form.parse(req, async function (err, fields, files) {

      const { name, id } = fields
      criteria['name'] = name
      criteria['id'] = id
      criteria['userId'] = req.admin.id


      console.log("files",files)

      if (files.banner && files.banner.length > 0) {
        const fileSize=files.banner[0].size;
        if(Number(fileSize) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }
        // uploadedFiles = await uploadCloud.upload_image2(files.banner)
        // uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.banner, resolve, reject));
        let fileExtension = files.banner[0].originalFilename.replace(/^.*\./, "");
        if(fileExtension==="webp"){
          uploadedFiles = await uploadCloud.upload_infographics(files.banner);
        }else{
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.banner, resolve, reject));
        }
        criteria['banner_image'] = uploadedFiles[0]
      }

      if (files.image && files.image.length > 0) {
        const fileSize2=files.image[0].size;

        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles2 = await uploadCloud.upload_image2(files.image)
        // uploadedFiles2 = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
        let fileExtension2 = files.image[0].originalFilename.replace(/^.*\./, "");
        if(fileExtension2==="webp"){
          uploadedFiles2 = await uploadCloud.upload_infographics(files.image);
        }else{
          uploadedFiles2 = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
        }
        criteria['image'] = uploadedFiles2[0]
      }

      await admin_dao.editCategory(criteria);

      res.send({ code, message });

      // for removing chache
      client.keys("*", function (err, keys) {
        console.log("keys",keys)
          keys.forEach(function (key, pos) {
              // if(key.indexOf("m1")>=0){
                client.del(key, () => {})
              // }
        })
      })

    });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})



// ***********   addSubCategory  ************/
const addSubCategory = util.errHandler(async (req, res) => {
  try {

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles, uploadedFiles2, criteria = {};

    form.parse(req, async (err, fields, files) => {

      let { name, parentId } = fields
      criteria['name'] = name
      criteria['parentId'] = parentId
      criteria['userId'] = req.admin.id

      checkname = await admin_dao.checkSubCategoryName(criteria);

      if (checkname && checkname.length) {
        res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Sub Category name exit please try something new" })
      } else {
        if (files.banner && files.banner.length > 0) {

          const fileSize=files.banner[0].size;
          if(Number(fileSize) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles = await uploadCloud.upload_image2(files.banner)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.banner, resolve, reject));
          criteria['banner_image'] = uploadedFiles[0]
        }

        if (files.image && files.image.length > 0) {

          const fileSize2=files.image[0].size;
          if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles2 = await uploadCloud.upload_image2(files.image)
          uploadedFiles2 = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
          criteria['image'] = uploadedFiles2[0]
        }
        await admin_dao.addSubCategory(criteria);
        res.send({ code, message });

        // for removing chache
        client.keys("*", function (err, keys) {
          console.log("keys",keys)
            keys.forEach(function (key, pos) {
                // if(key.indexOf("m1")>=0){
                  client.del(key, () => {})
                // }
          })
        })

      }
    });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   editSubCategory  ************/
const editSubCategory = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles, uploadedFiles2, criteria = [];

    form.parse(req, async function (err, fields, files) {

      let { name, id } = fields
      criteria['name'] = name
      criteria['id'] = id

      if (files.banner && files.banner.length > 0) {

        const fileSize=files.banner[0].size;
        if(Number(fileSize) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image2(files.banner)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.banner, resolve, reject));
        criteria['banner_image'] = uploadedFiles[0]
      }

      if (files.image && files.image.length > 0) {

        const fileSize2=files.image[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles2 = await uploadCloud.upload_image2(files.image)
        uploadedFiles2 = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
        criteria['image'] = uploadedFiles2[0]
      }

      await admin_dao.editSubCategory(criteria);

      res.send({ code, message });

      // for removing chache
      client.keys("*", function (err, keys) {
        console.log("keys",keys)
          keys.forEach(function (key, pos) {
              // if(key.indexOf("m1")>=0){
                client.del(key, () => {})
              // }
        })
      })
    });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   listingCms  ************/
const listingCms = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const result = await admin_dao.listingCms(req.body);
    res.send({ code, message, result });
    util.removeCache()
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   getshop  ************/
const getshop = util.errHandler(async (req, res) => {
  try {

    let criteria = req.query
    criteria.adminId=req.admin.id;
    criteria.roleId=req.admin.role;
    const resp = await util.subAdmintotalArtisan(req.admin.id);
    if(resp){
        criteria.subAdmintotalArtisan=resp;
    }
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    const result = await admin_dao.getshop(criteria)
    const total = await admin_dao.getTotalshopCount(criteria)

    res.send({ code, message, total, result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ***********   Add Shop Product  ************/
let addShopProduct = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    let form = new multiparty.Form();
    let uploadedFiles, criteria = {};
    form.parse(req, async function (err, fields, files) {

      let { name, amount, material, artisanId, inventoryQty, id, craft, verified, ideal } = fields;

      criteria.id = id;
      criteria.userId = artisanId;
      criteria.name = name;
      criteria.amount = amount;
      criteria.inventoryQty = inventoryQty;
      criteria.material = material;
      criteria.craft = craft;
      criteria.verified = verified;

      if(ideal)
        criteria.ideal = ideal;

      // console.log("criteria", criteria)
      // // console.log("files", files)

      let productInfo = await product_dao.add(criteria)

      if (files.files && files.files.length > 0) {

        const fileSize2=files.files[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image(files)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));
        let updateImageQuery = []
        for (const key in uploadedFiles) {
          let temp = {
            productId: productInfo.id ? productInfo.id : id,
            image: uploadedFiles[key],
            userId: req.admin.id
          }
          updateImageQuery.push(temp)
        }
        await product_dao.uploadImage(updateImageQuery)
      }
      res.send({ code, message })
      if (fields.image_ids) {
        await product_dao.removeImage(fields.image_ids)
      }
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})
// ***********   Add Shop Product  ************/


// ***********   getIdealshop  ************/
const getIdealshop = util.errHandler(async (req, res) => {

  try {

    let criteria = req.query
    criteria.adminId=req.admin.id;
    criteria.roleId=req.admin.role;
    const resp = await util.subAdmintotalArtisan(req.admin.id);
    if(resp){
        criteria.subAdmintotalArtisan=resp;
    }

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const result = await admin_dao.getIdealshop(criteria)

    const total = await admin_dao.getTotalIdealProduct(criteria)
    res.send({ code, message, total, result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ***********   getFromAllProduct  ************/
const getFromAllProduct = util.errHandler(async (req, res) => {
  try {

    let criteria = req.query
    criteria.adminId=req.admin.id;
    criteria.roleId=req.admin.role;
    const resp = await util.subAdmintotalArtisan(req.admin.id);
    if(resp){
        criteria.subAdmintotalArtisan=resp;
    }
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const result = await admin_dao.getFromAllProduct(criteria)
    const total = await admin_dao.getFromAllTotalProduct(criteria)
    res.send({ code, message, total, result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }

})

// ***********   makeIdealProduct  ************/
const makeIdealProduct = util.errHandler(async (req, res) => {
  try {

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;


    // // console.log("req.query.ids)",req.query)
    await admin_dao.makeIdealProduct(req.query.ids)
    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ***********   getGenrateEnquiryList  ************/
const getGenrateEnquiryList = util.errHandler(async (req, res) => {
  // try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    let criteria = req.body
      criteria.adminId=req.admin.id;
      criteria.roleId=req.admin.role;
      const resp = await util.subAdmintotalArtisan(req.admin.id);
      if(resp){
          criteria.subAdmintotalArtisan=resp;
      }

    console.log("criteria",criteria)


    const result = await admin_dao.getGenrateEnquiryList(criteria)
    const total = await admin_dao.getTotalsGenrateEnquiry(criteria)

    res.send({ code, message, total,result })
  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
})

// ***********   genrateEnquiry  ************/
const genrateEnquiry = util.errHandler(async (req, res) => {
  try {

    const criteria = { ...req.body }
    criteria.userId = req.admin.id

    await admin_dao.genrateEnquiry(criteria)

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   viewEnquiryArtisan  ************/
const viewEnquiryArtisan = util.errHandler(async (req, res) => {
  try {

    const adminId = req.admin.id;
    const result = await admin_dao.viewEnquiryArtisan(req.query, adminId)
    const total = await admin_dao.viewTotalEnquiryArtisan(req.query, adminId)

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, total,result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   genrateNewEnquiry  ************/
const genrateNewEnquiry = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles, criteria = {};

    form.parse(req, async function (err, fields, files) {
      criteria.title = fields.title && fields.title.length ? fields.title[0] : ''
      criteria.description = fields.description && fields.description.length ? fields.description[0] : ''

      if (fields.craftId && !fields.craftId.length) {
        throw new Error('Missing field craftId');
      }
      criteria.craftId = fields.craftId[0]

      criteria.pproductId = fields.pproductId?fields.pproductId:0

      if (fields.materialId && !fields.materialId.length) {
        throw new Error('Missing field materialId');
      }
      criteria.materialId = fields.materialId[0]


      if (fields.expectedPrice && !fields.expectedPrice.length) {
        throw new Error('Missing field expectedPrice');
      }

      criteria.expPrice = fields.expectedPrice[0]

      if (fields.requestTo && !fields.requestTo.length) {
        throw new Error('Missing field requestTo');
      }
      criteria.requestTo = fields.requestTo[0]
      criteria.update_status = fields.update_status ? fields.update_status : 'enquiry forwared to artisan'

      if (fields.id && fields.id.length)
        criteria.id = fields.id[0];

      if (fields.mailBody && fields.mailBody.length)
          criteria.mailBody = fields.mailBody[0];

      if (fields.mailBy && fields.mailBy.length)
          criteria.mailBy = fields.mailBy[0];

      if (fields.mailSubject && fields.mailSubject.length)
          criteria.mailSubject = fields.mailSubject[0];

      if (files.files && files.files.length > 0) {

        const fileSize2=files.files[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image(files)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));
        criteria['attachment'] = uploadedFiles
      }

      if (fields.qty && fields.qty.length)
        criteria.qty = fields.qty[0];

      if (fields.enquiryId && fields.enquiryId.length)
        criteria.uniqueId = fields.enquiryId[0];

        // let adminId=req.admin.id;
        let adminId='1';

        // pstateId
        criteria.estateId=fields.estateId[0]

      // await admin_dao.genrateNewEnquiry(criteria, req.admin.id);
      await admin_dao.genrateNewEnquiry(criteria, adminId);

      res.send({ code, message })

      if (fields.image_ids) {
        await admin_dao.removeImage(fields.image_ids)
      }

    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   editGenrateNewEnquiry  ************/
const editGenratedEnquiry = util.errHandler(async (req, res) => {
  try {
    const adminId = req.admin.id;
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles, criteria = {};

    form.parse(req, async function (err, fields, files) {

      criteria.title = fields.title[0]
      criteria.description = fields.description[0]
      criteria.craftId = fields.craftId[0]
      criteria.materialId = fields.materialId[0]
      criteria.id = fields.id[0]
      criteria.userId = adminId

      if (files.files && files.files.length > 0) {

        const fileSize2=files.files[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image(files)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));
        criteria['attachment'] = uploadedFiles
      }

      await admin_dao.editGenratedEnquiry(criteria);

      res.send({ code, message })
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// // ***********   genrateEstimate  ************/
// const genrateEstimate = util.errHandler(async (req, res) => {
//   try {
//     const adminId = req.admin.id;
//     const code = util.statusCode.TWO_ZERO_ONE;
//     const message = util.statusMessage.SUCCESS;
//     const criteria = { ...req.body }
//     criteria.created_by = adminId
//     await admin_dao.genrateEstimate(criteria);
//     res.send({ code, message })
//   } catch (error) {
//     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
//   }
// })



// ***********   importEnquiries  ************/
const importEnquiries = util.errHandler(async (req, res) => {

  try {
    const form = new multiparty.Form();

    form.parse(req, async function (err, fields, files) {

      const code = util.statusCode.OK;
      const message = util.statusMessage.CSV_UPLOAD;

      if (files.files && files.files.length > 0) {
        // res.send({ code, message});
        await admin_dao.importEnquiries(files.files[0].path, fields.type[0]);
      } else {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: util.statusMessage.CSV_FILE_CHOOSE });
      }
      res.send({ code, message });
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});

const sleep=(ms)=>{
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ***********   importArtisan  ************/
const importArtisan = util.errHandler(async (req, res) => {

  try {
    const form = new multiparty.Form();
    const converter = require('json-2-csv');
    form.parse(req, async function (err, fields, files) {

      let code = util.statusCode.OK;
      let message = util.statusMessage.CSV_UPLOAD;

      if (files.files && files.files.length > 0) {

        let dt=await admin_dao.importArtisan(files.files[0].path);
        await sleep(1000);
        let fileName = Date.now() +"Artisan.csv";
        let filePath=path.join(__dirname, './../../public/userpic/', fileName);

        if(_.isEmpty(dt))
          res.send({ code, message });
        else{
          converter.json2csv(dt, (err, csv) => {
            if (err) throw err;
            fs.writeFileSync(filePath, csv)
            console.log(csv);
          })

         let url = process.env.BaseUrl2 + fileName;
          res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message:"Csv uploaded with with error",result:dt,url:url });
        }
      } else {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: util.statusMessage.CSV_FILE_CHOOSE });
      }

    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});

// ********** import product size measurement

const importProductSizeMeasurementCSV = util.errHandler(async (req, res) => {
  try{
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      const code = util.statusCode.OK;
      const message = util.statusMessage.CSV_UPLOAD; 9

      if (files.files && files.files.length > 0) {
        // res.send({ code, message});

        // // // console.log("req.admin",files)
        await admin_dao.importProductSizeMeasurement(files.files[0].path);
      } else {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: util.statusMessage.CSV_FILE_CHOOSE });
      }
      res.send({ code, message });
    })
  } catch(err) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});

// ***********   importProduct  ************/
const importProduct = util.errHandler(async (req, res) => {

  try {

    const form = new multiparty.Form();

    form.parse(req, async function (err, fields, files) {

      const code = util.statusCode.OK;
      const message = util.statusMessage.CSV_UPLOAD; 9

      if (files.files && files.files.length > 0) {
        // res.send({ code, message});

        // // // console.log("req.admin",files)
        await admin_dao.importProduct(files.files[0].path, 1/*req.admin.id*/ );
      } else {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: util.statusMessage.CSV_FILE_CHOOSE });
      }
      res.send({ code, message });
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   getOrderList  ************/
const getOrderList = util.errHandler(async (req, res) => {
  try {
    const adminId = req.admin.id;

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    const result = await admin_dao.getOrderList(req.query, adminId);
    const total = result.length;
    res.send({ code, message, total, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});



// ***********   givePurchaseOrder  ************/
const givePurchaseOrder = util.errHandler(async (req, res) => {
  try {

    const adminId = req.admin.id;

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    const criteria = { ...req.body }

    criteria.created_by = adminId

    await admin_dao.givePurchaseOrder(criteria);

    res.send({ code, message });

  } catch (error) {

    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})

// ***********   genrateEstimate  ************/
const genrateEstimate = util.errHandler(async (req, res) => {
  try {

    const adminId = req.admin.id;
    let criteria = { ...req.body }
    criteria.created_by = adminId

    await admin_dao.genrateEstimate(criteria);

    criteria.IGST = Math.round((5 / criteria.amount) * 100);
    criteria.TOTAL = Number(criteria.amount) + Number(criteria.IGST)

    ejs.renderFile(path.join(__dirname, './../../templates/', "estimate.ejs"),
      { estimate: criteria }, (err, data) => {
        if (err) {
          // // console.log('error', err)
        } else {

          let options = {
            "height": "11.25in", "width": "8.5in",
            "header": { "height": "20mm", },
            "footer": { "height": "20mm", },
          };

          let uuid = Date.now()
          pdf.create(data, options).toFile(path.join(__dirname, './../../public/userpic/', uuid + "estimate.pdf"),
            async function (err, data) {

              // we will do it for aws or clundnary later

              let pdf = data.filename;
              const segments = pdf.split('/');
              const last = segments.pop() || segments.pop();

              let criteria = {};
              criteria.table = 'estimate';
              // criteria.pdf = BaseUrl + last;
              criteria.pdf = process.env.BaseUrl2 + last;
              await admin_dao.updatePdf(criteria);
            });
        }
      });

    const code = util.statusCode.TWO_ZERO_ONE;
    const message = util.statusMessage.SUCCESS;

    const result = await admin_dao.getLastPdfUniqueId({ 'table': 'estimate' });

    res.send({ code, message, result });

  } catch (error) {

    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})


// ***********   genratePurchaseorder  ************/
const genratePurchaseOrder = util.errHandler(async (req, res) => {
  // try {
    let moment = require('moment');
    const adminId = req.admin.id;
    const code = util.statusCode.TWO_ZERO_ZERO;
    const message = util.statusMessage.SUCCESS;
    const criteria = { ...req.body }
    criteria.created_by = adminId

    // const dateObj = new Date(criteria.dueDate);
    // const month = dateObj.getMonth()+1;
    // const day = String(dateObj.getDate()).padStart(2,'0');
    // const year = dateObj.getFullYear();
    // const output = month +'/'+ day  + '/' + year;

    // console.log("output",output);
    // criteria.dueDate = output;

    // var dt = new Date(criteria.dueDate).toLocaleDateString();
    // var res22 = dt.split("/");
    // criteria.dueDate = res22[2]+'-'+res22[1]+'-'+res22[0];
    console.log("criteria",criteria)

    await admin_dao.genratePurchaseOrder(criteria);
    criteria.IGST = Math.round((5 / criteria.amount) * 100);
    criteria.TOTAL = Number(criteria.amount) + Number(criteria.IGST)


    ejs.renderFile(path.join(__dirname, './../../templates/', "purchaseOrder.ejs"),
      { order: criteria }, (err, data) => {
        if (err) {
          // // console.log('error', err)
        } else {

          let options = {
            "height": "11.25in", "width": "8.5in",
            "header": { "height": "20mm", },
            "footer": { "height": "20mm", },
          };

          let uuid = Date.now()
          // let uuid = 1
          pdf.create(data, options).toFile(path.join(__dirname, './../../public/userpic/', uuid + "PurchaseOrder.pdf"),

            async function (err, data) {

              // we will do it for aws or clundnary later
              let pdf = data.filename;
              const segments = pdf.split('/');
              const last = segments.pop() || segments.pop();

              let criteria = {};
              criteria.table = 'po';
              criteria.pdf = process.env.BaseUrl2 + last;
              await admin_dao.updatePdf(criteria);
            });
        }
      });

     await sleep(2000);

    // const result = await admin_dao.getLastPdfUniqueId({ 'table': 'po' });
    const result = await knex('po').select('pdfUrl').orderBy("id", "desc").limit(1).debug()

    console.log("result",result)


    res.send({ code:201, message, result:result[0].pdfUrl })
  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
})



// ***********   generateInvoice  ************/
const generateInvoice = util.errHandler(async (req, res) => {
  try {

    const adminId = req.admin.id;
    const code = util.statusCode.TWO_ZERO_ONE;
    const message = util.statusMessage.SUCCESS;
    const criteria = { ...req.body }
    criteria.created_by = adminId

    await admin_dao.generateInvoice(criteria);

    criteria.IGST = Math.round((5 / criteria.amount) * 100);
    criteria.TOTAL = Number(criteria.amount)
    // criteria.TOTAL = Number(criteria.amount) + Number(criteria.IGST)

    ejs.renderFile(path.join(__dirname, './../../templates/', "invoice.ejs"),
      { invoice: criteria }, (err, data) => {
        if (err) {
          // // console.log('error', err)
        } else {

          let options = {
            "height": "11.25in", "width": "8.5in",
            "header": { "height": "20mm", },
            "footer": { "height": "20mm", },
          };

          let uuid = Date.now()

          pdf.create(data, options).toFile(path.join(__dirname, './../../public/userpic/', uuid + "Invoice.pdf"),

            async function (err, data) {

              // we will do it for aws or clundnary later

              let pdf = data.filename;
              const segments = pdf.split('/');
              const last = segments.pop() || segments.pop();

              let criteria = {};
              criteria.table = 'invoice';
              criteria.pdf = process.env.BaseUrl2 + last;

              // // console.log("criteria==",criteria)

              await admin_dao.updatePdf(criteria);
            });
        }
      });

    const result = await admin_dao.getLastPdfUniqueId({ 'table': 'invoice' });

    res.send({ code, message, result });

  } catch (error) {

    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})


// ***********   getPDF  ************/
const getPDF = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    let result = await admin_dao.getPDF(req.query);

    res.send({ code, message, result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   checkPDF  ************/
const checkPDF = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result = await admin_dao.checkPDF(req.body);

    res.send({ code, message, result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Edit clients  ************/
const clientUpdatePost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles, criteria = [];

    form.parse(req, async (err, fields, files) => {
      const imgs = files.imgs

          const fileSize2=files.imgs[0].size;
          if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

      if (imgs && imgs.length > 0) {
        // uploadedFiles = await uploadCloud.upload_image2(imgs)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(imgs, resolve, reject))
        criteria['clientImgs'] = uploadedFiles[0]
      } else {
        throw new Error('Missing images')
      }

      let { isLogo } = fields
      isLogo = (isLogo == 0 || isLogo == 1) ? isLogo : 0

      criteria['isLogo'] = isLogo

      await admin_dao.clientUpdatePost(criteria);
      res.send({ code, message });
    });

    res.send({ code, message, result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   Edit Content  ************/
const updateContentPost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { isCmsContent, type, description } = req.body;

    if (!type) {
      throw new Error('Missing field type')
    }

    if (!description) {
      throw new Error('Missing field description')
    }

    isCmsContent = (isCmsContent == 0 || isCmsContent == 1) ? isCmsContent : 0

    const criteria = { isCmsContent, type, description }

    await admin_dao.updateContent(criteria);

    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   Edit testimonials  ************/
const updateTestimonialsPost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles, criteria = [];

    form.parse(req, async (err, fields, files) => {
      let { id, isTestimonial, name, title, description } = fields
      isTestimonial = (isTestimonial == 0 || isTestimonial == 1) ? isTestimonial : 0

      if (!id) {
        throw new Error('Missing field id')
      }

      if (!name) {
        throw new Error('Missing field name')
      }

      if (!title) {
        throw new Error('Missing field title')
      }

      criteria = { name, title, description ,id}

      const imgs = files.imgs

      if (imgs && imgs.length > 0) {

        const fileSize2=files.imgs[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image2(imgs)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(imgs, resolve, reject));
        criteria['testimonialImg'] = uploadedFiles[0]
      }
      // console.log("criteria",criteria)

      await admin_dao.updateTestimonials(criteria);
      res.send({ code, message });
      util.removeCache();
    });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   Edit FAQs  ************/
const updateFaqsPost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { id, isFaq, question, description } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    if (!question) {
      throw new Error('Missing field question')
    }

    if (!description) {
      throw new Error('Missing field description')
    }

    isFaq = (isFaq == 0 || isFaq == 1) ? isFaq : 0

    const criteria = { id, isFaq, question, description }

    await admin_dao.updateFaqs(criteria);
    res.send({ code, message })
    util.removeCache();
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Delete FAQs  ************/
const deleteFaqsDelete = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { id } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    const criteria = { id }
    await admin_dao.deleteCms(criteria);

    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Get message for testing  ************/
const getMessage = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const result = await appChat_dao.getMessage(req.body);

    res.send({ code, message, result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Delete FAQs  ************/
const deleteCmsDelete = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { id } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    const criteria = { id }
    await admin_dao.deleteCms(criteria);

    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Edit Message Post  ************/
const editMessagePost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { id, isCms, title, link } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    if (!title) {
      throw new Error('Missing field title')
    }

    if (!link) {
      throw new Error('Missing field link')
    }

    isCms = (isCms == 0 || isCms == 1) ? isCms : 0

    const criteria = { id, isCms, title, link }

    await admin_dao.updateCms(criteria);
    res.send({ code, message })
    util.removeCache()
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   Patch Message Status  ************/
const statusMessagePatch = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { isCms, id } = req.body;

    isCms = (isCms == 0 || isCms == 1) ? isCms : 0

    if (!id) {
      throw new Error('Missing field id')
    }
    const criteria = { id, isCms }

    await admin_dao.patchCms(criteria);
    res.send({ code, message })

    util.removeCache();

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Get CMS list  ************/
const cmsListGet = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { type } = req.query;

    if (!type) {
      throw new Error('Missing field type')
    }

    const validTypes = [
      'About us', 'Patch-message', 'Banner', 'USP', 'Testimonial', 'Industries'
    ]

    if (validTypes.indexOf(type) == -1) {
      throw new Error('Valid types are ' + validTypes.join(", "))
    }

    const criteria = { type }

    let result= await admin_dao.cmsList(criteria);
    res.send({ code, message ,result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   Get Website Order list  ************/
const websiteOrdersGet = util.errHandler(async (req, res) => {
  // try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const result = await admin_dao.websiteOrdersGet(req.admin.id);
    res.send({ code, message, result })
  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
})

// ***********   Post generate invoice  ************/
const generateInvoicePost = util.errHandler(async (req, res) => {
  // try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    const adminId = req.admin.id;
    const criteria = { ...req.body }
    criteria.created_by = adminId
    delete criteria.type;

    // console.log("eq.admin",req.admin)
    await admin_dao.generateInvoice(criteria);

    criteria.IGST = Math.round((5 / criteria.amount) * 100);
    criteria.TOTAL = Number(criteria.amount) + Number(criteria.IGST)

    ejs.renderFile(path.join(__dirname, './../../templates/', "invoice.ejs"),
    { invoice: criteria }, (err, data) => {
      if (err) {
        // console.log('error', err)
      } else {

        let options = {
          "height": "11.25in", "width": "8.5in",
          "header": { "height": "20mm", },
          "footer": { "height": "20mm", },
        };

        let uuid = Date.now()

        pdf.create(data, options).toFile(path.join(__dirname, './../../public/userpic/', uuid + "Invoice.pdf"),

          async function (err, data) {

            // we will do it for aws or clundnary later

            let pdf = data.filename;
            const segments = pdf.split('/');
            const last = segments.pop() || segments.pop();

            let criteria = {};
            criteria.table = 'invoice';
            criteria.pdf = process.env.BaseUrl2 + last;

            // console.log("criteria==",criteria)

            await admin_dao.updatePdf(criteria);
          });
      }
    });

  const result = await admin_dao.getLastPdfUniqueId({ 'table': 'invoice' });

  res.send({ code, message, result });

    // res.send({ code, message })
  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
})



// // ***********   generateInvoice  ************/
// const generateInvoice = util.errHandler(async (req, res) => {
//   try {

//     const adminId = req.admin.id;
//     const code = util.statusCode.TWO_ZERO_ONE;
//     const message = util.statusMessage.SUCCESS;
//     const criteria = { ...req.body }
//     criteria.created_by = adminId

//     await admin_dao.generateInvoice(criteria);



//   } catch (error) {

//     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

//   }
// })


// ***********   Put website orders  ************/
const editWebsiteOrdersPut = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    await admin_dao.editWebsiteOrders(req.body);
    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Get Stories Order list  ************/
const storiesGet = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    client.get('storiesGet', async (err, resData) => {
      if (resData) {
          console.log("Cache DATA storiesGet")
          let data=JSON.parse(resData);
          res.send({ code,message,result:data.result})
      } else {
          result = await admin_dao.getStories();
          client.setex('storiesGet',6000,JSON.stringify({result}));
          console.log("DB DATA storiesGet")
          res.send({code,message,result});
      }
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Post Stories  ************/
const addStoriesPost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = {};

    form.parse(req, async function (err, fields, files) {
      let { title, description, isActive,url, name,subtitle } = fields
      criteria['title'] = title[0]
      criteria['description'] = description[0]
      criteria['url'] = url && url.length && url ? url : ''
      criteria['name'] = name
      criteria['subtitle'] = subtitle
      criteria['isActive'] = isActive && isActive.length && (isActive[0] == 0 || isActive[0] == 1) ? isActive[0] : 1

      if (files.image && files.image.length > 0) {

        const fileSize2=files.image[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }
        // uploadedFiles = await uploadCloud.upload_image2(files.image)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
        criteria['image'] = uploadedFiles[0]
      }

      await admin_dao.addStoriesPost(criteria);
      res.send({ code, message });
    });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Put Stories  ************/
const editStoriesPut = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = {};

    form.parse(req, async function (err, fields, files) {
      let { title, description,name,subtitle, isActive,url, id } = fields

      if (id && !id[0]) {
        throw new Error('Missing field id')
      }

      criteria['id'] = id[0]
      criteria['title'] = title[0]
      criteria['name'] = name[0]
      criteria['url'] = url[0]
      criteria['subtitle'] = subtitle[0]
      criteria['description'] = description[0]

      if (files.image && files.image.length > 0) {

        const fileSize2=files.image[0].size;
        if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image2(files.image)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
        criteria['image'] = uploadedFiles[0]
      }

      console.log("criteria",criteria)

      await admin_dao.editStoriesPut(criteria);
      res.send({ code, message });
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Get gallery zip  ************/
const galleryZipGet = util.errHandler(async (req, res) => {
  try {

  const fetch = require('node-fetch')
  const JSZip = require('jszip')
  const micro = require('micro')
  // to serve them

    let files = await admin_dao.gallery();

      let zip = new JSZip();
      const request = async () => {
          for (const { file, url } of files) {
          const response = await fetch(url);
          const buffer = await response.buffer();
          zip.file(file, buffer);
        }
      }

      request()
          .then(() => {
            // res.setHeader('Content-Disposition', 'attachment; filename="gallery.zip"')
            res.setHeader('Content-Disposition', 'attachment; filename="LAL10Gallery.zip"')
            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
              .pipe(res).on('finish', function() {
                  // console.log("out.zip written.");
              })
          })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})



// const galleryZipGet = util.errHandler(async (req, res) => {
//   try {
//       let code = util.statusCode.OK;
//       let message = util.statusMessage.SUCCESS;

//       let result = await admin_dao.gallery();

//       res.send({ code, message ,result})

//     } catch (error) {
//     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
//     }
// })

// ***********   Get awards list  ************/
const awardsGet = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const result = await admin_dao.awards();
    res.send({ code, message, result })
  } catch (error) {
    // console.log(error, "awardsget")
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Delete Stories  ************/
const storiesDelete = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { id } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    const criteria = { id }
    await admin_dao.storiesDelete(criteria);

    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Delete Notifications  ************/
const notifDelete = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let { id } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    const criteria = { id }
    await admin_dao.notifDelete(criteria);

    res.send({ code, message })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   Get Notification list  ************/
const notifGet = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const result = await admin_dao.notif();
    res.send({ code, message, result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

const addNotifPost = util.errHandler(async (req, res) => {
  // try {
    let code = util.statusCode.OK;
    let messagee = util.statusMessage.SUCCESS;

    console.log("req.body",req.body)

    const { message, sendType, type, userIds, group } = req.body;

    if (userIds && !Array.isArray(userIds) && !userIds.length) {
      throw new Error('Not a valid userIds value')
    }

    if (sendType == "push") {
      // await admin_dao.addNotif({ message, sendType, type, userIds, group })
      await admin_dao.addNotif(req.body)
    }

    res.send({ code, message: messagee })

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
})

const getNotificationList = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result = await admin_dao.getNotificationList()

    // console.log("result==", result)

    res.send({ code, message, result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


const repeatNotifPost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let messagee = util.statusMessage.SUCCESS;

    const { id } = req.body;

    if (!id) {
      throw new Error('Missing field id')
    }

    // console.log("reqoo", req.body)
    await admin_dao.repeatNotification(req.body.id);

    res.send({ code, message: messagee })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

const getlogisticDetails = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let messagee = util.statusMessage.SUCCESS;

    const { id } = req.query;

    if (!id) {
      throw new Error('Missing field id')
    }

    let result = await admin_dao.getlogisticDetails(req.query.id)

    // console.log("result==", result)

    res.send({ code, message: messagee, result })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ****   getProductionTracker   **** //
const getProductionTracker = util.errHandler(async (req, res) => {
  try {

    let result = {}

    result = await admin_dao.getProductionTracker(req.query.id);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   editProductionTracker   **** //
const editProductionTracker = util.errHandler(async (req, res) => {
  try {

    let criteria;

    criteria = { ...req.body };

    // console.log("criteria===", criteria)

    await admin_dao.editProductionTracker(criteria);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   websiteOrderEdit   **** //
const websiteOrderEdit = util.errHandler(async (req, res) => {
  try {

    let criteria;

    criteria = { ...req.body };

    // console.log("criteria===", criteria)

    await admin_dao.websiteOrderEdit(criteria);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ****   addSubAdmin   **** //
const addSubAdmin = util.errHandler(async (req, res) => {
  try {
    let criteria = { ...req.body };

    let emailCheck = await knex('users').where({ email: criteria.email, deleted: '1',role:'4' })
    // console.log("emailCheck===", emailCheck)

    if (emailCheck.length) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: util.statusMessage.EMAIL_EXIST })
      return
    }

    let mobileCheck = await knex('users').where({ mobile: criteria.mobile, deleted: '1',role:'4' }).debug()
    // console.log("mobileCheck===", mobileCheck)

    if (mobileCheck.length) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: util.statusMessage.MOBILE_EXIST })
      return
    }

    await admin_dao.addSubAdmin(criteria);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ****   getSubAdminRole   **** //
const getSubAdminRole = util.errHandler(async (req, res) => {
  try {

    let result = await admin_dao.getSubAdminRole();

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   getSubAdminList   **** //
const getSubAdminList = util.errHandler(async (req, res) => {
  try {

    let result = await admin_dao.getSubAdminList();

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ****   createSubAdminGroup   **** //
const createSubAdminGroup = util.errHandler(async (req, res) => {
  try {

    let criteria = { ...req.body };

    let groupNameCheck = await knex('subAdminRoleType').where({groupName:criteria.groupName }).where('id', '!=',criteria.id)

    if (groupNameCheck.length) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Group name already exist" })
      return
    }

    let getUserId = await knex('subAdminRoleType').where('id', criteria.id).debug()

    if(getUserId.length)
      criteria['userId']=getUserId[0].userId;

    // let checkMobile = await knex('users').where('mobile',criteria.mobile).where('id','!=',getUserId[0].userId).debug()

    // if (checkMobile.length) {
    //   res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Mobile No Exist" })
    //   return
    // }

    let checkEmail = await knex('users').where('email',criteria.email).where('id','!=',getUserId[0].userId).debug()

    if (checkEmail.length) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: "Email Exist" })
      return
    }

    // console.log("groupNameCheck==",getUserId)

    let result = await admin_dao.createSubAdminGroup(criteria);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   viewSubAdminCategorylist   **** //
const viewSubAdminCategorylist = util.errHandler(async (req, res) => {
  try {

    let result = await admin_dao.viewSubAdminCategorylist();

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   subAdminCategoryAction   **** //
const subAdminCategoryAction = util.errHandler(async (req, res) => {
  try {

    let criteria = { ...req.body };

    let result = await admin_dao.subAdminCategoryAction(criteria);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ****   getGroupUser   **** //
const getGroupUser = util.errHandler(async (req, res) => {
  try {

    let result = await admin_dao.getGroupUser(req.query.id);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   getSubAdminDetails   **** //
const getSubAdminDetails = util.errHandler(async (req, res) => {
  try {

    let result = await admin_dao.getSubAdminDetails(req.query.id);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})



// ****   getGalleryList   **** //
const getGalleryList = util.errHandler(async (req, res) => {
  try {
    let result = await admin_dao.getGalleryList();

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ****   getGalleryDetails   **** //
const getGalleryDetails = util.errHandler(async (req, res) => {
  try {
    let result = await admin_dao.getGalleryDetails(req.query.id);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// **** CONEJOB *** inCompleteProfileNotification   **** //
const inCompleteProfileNotification = async () => {
  await admin_dao.inCompleteProfileNotification();
}

// ****  CONEJOB ****** inCompleteProfileNotification   **** //
const order25Done = async () => {
  await admin_dao.order25Done();
}

// **** CONEJOB ******  liveShopPanelFreeze   **** //
const liveShopPanelFreeze = async () => {
  await admin_dao.liveShopPanelFreeze();
}

cron.schedule('0 */24 * * *', () => {
  if (cluster.isMaster) {
    inCompleteProfileNotification();
    order25Done();
    liveShopPanelFreeze();
    console.log("<------ cron JOb run---->")
  }
});


// ****   changePassword   **** //
const changePassword = util.errHandler(async (req, res) => {

  const user = await web_dao.checkUserId({ userId: req.admin.id });
  const match = await bcrypt.compare(req.body.oldPassword, user[0].password);
  const newHash = await bcrypt.hash(req.body.newPassword, util.saltRounds());


  if (!match) {
    res.send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.INVALID_OLD_PASS,
    });
    return;
  }

  const match2 = await bcrypt.compare(req.body.newPassword,user[0].password);

  if(match2){

      res.send({code: util.statusCode.TWO_ZERO_ONE,message: "This password is old try something new"});
      return

  }else{

      await web_dao.changePassword({ newHash, userId: req.admin.id });
      res.send({ code, message });
  }

  // await web_dao.changePassword({ newHash, userId: req.admin.id });

  const code = util.statusCode.OK;
  const message = util.statusMessage.PASSWORD_CHNAGED;

  res.send({ code, message });

});



// ****   getProfile   **** //
const getProfile = util.errHandler(async (req, res) => {
  try {

    let result = await admin_dao.getProfile(req.admin.id);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   profileUpdate   **** //
const profileUpdate = util.errHandler(async (req, res) => {
  try {
    let postdata={...req.body}

    postdata.userId=req.admin.id

    await admin_dao.profileUpdate(postdata);

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   forgotPassword   **** //
const forgotPassword = util.errHandler(async (req, res) => {

  const user = await admin_dao.checkUser2({ email:req.body.email });

  if (!user.length) {
    res.status(util.statusCode.FOUR_ZERO_ONE).send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.INVALID_EMAIL,
    });
    return;

  }else{

      const userDetails = await admin_dao.getProfile(user[0].id);

      const newHash = randomstring.generate();
      await web_dao.forgotToken({ newHash, userId: user[0].id });

      let sendData={};
      sendData['email']=req.body.email;
      sendData['subject']='Lal10 Reset Password link';
      sendData['html']="Dear " + userDetails[0].name  + ' ' + userDetails[0].name2 + "<br> Your lal10 reset passsword link. <br> please click for blow link for changed password link : " + process.env.BaseUrl2 + 'lal10admin/#/user/resetPassword?link=' + newHash;
      util.sendReceiptMail(sendData);

      code = util.statusCode.OK;
      message = util.statusMessage.EMAIL_SENT;

      res.send({ code, message });
  }
});

// ****   resetPassword   **** //
const resetPassword = util.errHandler(async (req, res) => {

  let code = util.statusCode.OK;
  let message = util.statusMessage.PASSWORD_CHNAGED;
  const user = await admin_dao.checkPwdToken({ token:req.body.link });

 if (!user.length) {
    res.status(util.statusCode.FOUR_ZERO_ONE).send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.LINK_EXPIRE,
    });
    return;
  }

  const match = await bcrypt.compare(req.body.newPassword,user[0].password);

  if(match){
      res.send({code: util.statusCode.TWO_ZERO_ONE,message: "This password is old try something new"});
  }else{
      const newHash = await bcrypt.hash(req.body.newPassword, util.saltRounds());
      await web_dao.changePassword({ newHash, userId: user[0].id });
      res.send({ code, message });
  }
});

// ****   bannerSequenceChanged   **** //
const bannerSequenceChanged = util.errHandler(async (req, res) => {

  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  await admin_dao.bannerSequenceChanged(req.query.id);
  res.send({ code, message });
});

// ****   getExhibannerList   **** //
const getExhibannerList = util.errHandler(async (req, res) => {
  try{
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result=await admin_dao.getExhibannerList();
    res.send({ code, message,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});

// ****   getSupportList   **** //
const getSupportList = util.errHandler(async (req, res) => {
  try{
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result=await admin_dao.getSupportList();
    res.send({ code, message,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});


// ****   addEditSupport   **** //
const addEditSupport = util.errHandler(async (req, res) => {
  try{
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result=await admin_dao.addEditSupport(req.body);
    res.send({ code, message,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});


// ****   deleteSupport   **** //
const deleteSupport = util.errHandler(async (req, res) => {
  try{
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result=await admin_dao.deleteSupport(req.body.id);
    res.send({ code, message,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});


// ****   getExhibannerUserList   **** //
const getExhibannerUserList = util.errHandler(async (req, res) => {
  // try{"

  // // console.log(")
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let result=await admin_dao.getExhibannerUserList(req.query.id);
    res.send({ code, message,result });

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});



// ****   getGalleryPic   **** //
const getGalleryPic = util.errHandler(async (req, res) => {
  //  try{
  let result = {}
  result = await admin_dao.getGalleryPic({EnqId:req.body.EnqId,userId:req.body.userId})
  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  // console.log("gellery", result)

  res.send({ code, message, result })

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

})



// ****   publishAwardToNewsFeed   **** //
const publishAwardToNewsFeed = util.errHandler(async (req, res) => {
  //  try{
  let result = {}
  // console.log("criteria",req.body)
  result = await admin_dao.publishAwardToNewsFeed(req.body)
  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  res.send({ code, message, result })

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

})

// ****   addAdminBussinessDetails   **** //
const addAdminBussinessDetails = util.errHandler(async (req, res) => {
   try{

        // console.log("criteria",req.body)

        let code = util.statusCode.OK
        let message = util.statusMessage.SUCCESS

        await admin_dao.addAdminBussinessDetails(req.body)
        res.send({ code, message })

    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }

})

// ****   getAdminBussinessDetails   **** //
const getAdminBussinessDetails = util.errHandler(async (req, res) => {
  try{

       let code = util.statusCode.OK
       let message = util.statusMessage.SUCCESS

       let result=await admin_dao.getAdminBussinessDetails(req.body)
       res.send({ code, message, result })

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   addWebToken   **** //
const addWebToken = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS


    if(req.body.webToken.length){

      await knex("AdminWebToken").where({webToken:req.body.webToken}).del().debug();

      await knex("AdminWebToken").insert({userId:req.admin.id,webToken:req.body.webToken}).debug();

    }

    res.send({ code, message, })

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})



// ****   removeWebToken   **** //
const removeWebToken = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS


    if(req.body.webToken.length){

      await knex("AdminWebToken").where({webToken:req.body.webToken}).del().debug();
    }

    res.send({ code, message, })

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})


// ****   senWebNotifi   **** //
const senWebNotifi = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    await admin_dao.senWebNotifi()

    res.send({ code, message, })

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   editAboustUs   **** //
const editAboustUs = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    await admin_dao.editAboustUs(req.body)

    res.send({ code, message, })

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})


// ****   uploadBrand   **** //
const uploadBrand = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = [];
    form.parse(req, async function (err, fields, files) {

        if (files.logo && files.logo.length > 0) {

          const fileSize2=files.logo[0].size;
          if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles = await uploadCloud.upload_image2(files.logo)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.logo, resolve, reject));
          criteria['logo'] = uploadedFiles[0];
          criteria['userId'] = req.admin.id;
          // console.log("req", req.admin.id);
            await admin_dao.uploadBrand(criteria)
        }
        res.send({ code, message, })
    });
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getBrand   **** //
const getBrand = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getBrand();
    res.send({ code, message,result })
    util.removeCache()

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})


// ****   addTeam   **** //
const addTeam = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = [];
    form.parse(req, async function (err, fields, files) {

        if (files.image && files.image.length > 0) {

          const fileSize2=files.image[0].size;
          if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles = await uploadCloud.upload_image2(files.image)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
          criteria['image'] = uploadedFiles[0];
          criteria['name'] = fields.name;
          criteria['designation'] = fields.designation;
          // console.log("req", req.admin.id);
            await admin_dao.addTeam(criteria)
        }
        res.send({ code, message, })
    });
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getTeam   **** //
const getTeam = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getTeam();
    res.send({ code, message,result })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})


// ****   addCarrer   **** //
const addCarrer = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    // let criteria={...req.body};
      await admin_dao.addCarrer(req.body)
        res.send({ code, message, })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getCarrer   **** //
const getCarrer = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getCarrer();
    res.send({ code, message,result })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})

const addPrivacyPolicy = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
      await admin_dao.addPrivacyPolicy(req.body)
        res.send({ code, message, })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getPrivacyPolicy   **** //
const getPrivacyPolicy = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getPrivacyPolicy();
    res.send({ code, message,result })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})


// ****   addReturnPolicy   **** //
const addReturnPolicy = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
      await admin_dao.addReturnPolicy(req.body)
        res.send({ code, message, })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getReturnPolicy   **** //
const getReturnPolicy = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getReturnPolicy();
    res.send({ code, message,result })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})



// ****   addCatalouge   **** //
const addCatalouge = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = [];
    form.parse(req, async function (err, fields, files) {

        if (files.link && files.link.length > 0) {

          const fileSize2=files.link[0].size;
          if(Number(fileSize2) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles = await uploadCloud.upload_image2(files.link)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.link, resolve, reject));
          criteria['link'] = uploadedFiles[0];
        }
          criteria['title'] = fields.title;
          criteria['description'] = fields.description;

        await admin_dao.addCatalouge(criteria)
        res.send({ code, message })
    });
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getCatalouge   **** //
const getCatalouge = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getCatalouge();
    res.send({ code, message,result })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})



// ****   addBlogs   **** //
const addBlogs = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = [];
    form.parse(req, async function (err, fields, files) {

        if (files.image && files.image.length > 0) {

          const fileSize=files.image[0].size;
          if(Number(fileSize) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

          // uploadedFiles = await uploadCloud.upload_image2(files.image)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
          criteria['image'] = uploadedFiles[0];
        }
          criteria['title'] = fields.title;
          criteria['description'] = fields.description;
          criteria['link'] = fields.link;

        await admin_dao.addBlogs(criteria)
        res.send({ code, message })
    });
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})

// ****   getBlogs   **** //
const getBlogs = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    let result=await admin_dao.getBlogs();
    res.send({ code, message,result })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})

// ****   deleteData   **** //
const deleteData = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS
    await admin_dao.deleteData(req.body);
    res.send({ code, message })
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})

let getManageListing = util.errHandler(async (req, res) => {
  let result=[],craftList=[],materialList=[],productList=[];
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  let postdata={...req.body}
  result = await admin_dao.getManageListing(postdata);
  craftList = await admin_dao.getManageListing({stateId:req.body.stateId});
  materialList = await admin_dao.getManageListingCraft({stateId:req.body.stateId});
  productList = await admin_dao.getManageListingProduct({stateId:req.body.stateId});

  res.status(code).send({ code, message, result,craftList,materialList,productList });
});

let deleteEnquiry = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  await admin_dao.deleteEnquiry(req.body);
  res.send({ code, message });
});

// ****   editBanner   **** //
const editBanner = util.errHandler(async (req, res) => {
  try{

    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    const form = new multiparty.Form();
    let uploadedFiles;
    let criteria = [];
    form.parse(req, async function (err, fields, files) {

        if (files.link && files.link.length > 0) {

          const fileSize=files.link[0].size;
          if(Number(fileSize) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.link, resolve, reject));
          criteria['link'] = uploadedFiles[0];
        }
          criteria['id'] = fields.id[0];
          criteria['title'] = fields.title[0];
          criteria['name'] = fields.name[0];
          criteria['description'] = fields.description[0];

          console.log("criteria",criteria)

        await admin_dao.editBanner(criteria)
        res.send({ code, message })
    });
   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }

})



// ***********   importListing  ************/
const importListing = util.errHandler(async (req, res) => {

  try {
    const form = new multiparty.Form();

    form.parse(req, async function (err, fields, files) {

      let code = util.statusCode.OK;
      let message = util.statusMessage.CSV_UPLOAD;

      if (files.files && files.files.length > 0) {

          let dt=await admin_dao.importListing(files.files[0].path);
          await sleep(1000);
          res.send({ code, message });
      } else {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: util.statusMessage.CSV_FILE_CHOOSE });
      }

    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});



// ***********   deleteArtisan  ************/
const deleteArtisan = util.errHandler(async (req, res) => {
  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

      const resp = await knex.raw(`select distinct id from chat where fromId='${req.body.id}'`);

      if(resp[0].length){
        res.send({ code:util.statusCode.FOUR_ZERO_ZERO, message:"Artisan enquiry exist we can't delete"});
      }else{

      const resp2 = await knex.raw(`select distinct id from products where userId='${req.body.id}' and isActive='1' and deleted='1'`);

      if(resp2[0].length){
        res.send({ code:util.statusCode.FOUR_ZERO_ZERO, message:"Artisan product exist we can't delete"});
      }else{
        await knex.raw(`update users set isActive='0',deleted='0' where id='${req.body.id}'`);
        await knex.raw(`update products set isActive='0',deleted='0' where userId='${req.body.id}'`);
        await knex.raw(`update productImage set isActive='0' where userId='${req.body.id}'`);
        await knex.raw(`update chat set isActive='0' where fromId='${req.body.id}'`);
        await knex.raw(`update chat set isActive='0' where toId='${req.body.id}'`);
        await knex.raw(`update enquiry_order set isActive='0' where assignUserId='${req.body.id}'`);
        await knex.raw(`update options set deleted='0' where userId='${req.body.id}'`);

        res.send({ code,message});
        }
      }
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});


// ***********   deleteProduct  ************/
const deleteProduct = util.errHandler(async (req, res) => {
  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

      const resp = await knex.raw(`select distinct id from enquiries where productId='${req.body.id}'`);

      if(resp[0].length){
        res.send({ code:util.statusCode.FOUR_ZERO_ZERO, message:"Product enquiry exist we can't delete"});
      }else{

        await knex.raw(`update products set isActive='0',deleted='0' where id='${req.body.id}'`);
        await knex.raw(`update productImage set isActive='0' where id='${req.body.id}'`);

        res.send({ code,message});
      }
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});



module.exports = {
  deleteProduct,
  deleteArtisan,
  importListing,
  editBanner,
  deleteEnquiry,
  getManageListing,
  deleteData,
  getBlogs,
  addBlogs,
  getCatalouge,
  addCatalouge,
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
  addWebToken,
  removeWebToken,
  getAdminBussinessDetails,
  addAdminBussinessDetails,
  publishAwardToNewsFeed,
  getGalleryPic,
  getExhibannerUserList,
  deleteSupport,
  addEditSupport,
  getSupportList,
  getExhibannerList,
  bannerSequenceChanged,
  forgotPassword,
  resetPassword,
  profileUpdate,
  getProfile,
  changePassword,
  liveShopPanelFreeze,
  order25Done,
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
  getProductionTracker,
  getlogisticDetails,
  repeatNotifPost,
  getNotificationList,
  addNotifPost,
  notifDelete,
  notifGet,
  storiesDelete,
  awardsGet,
  galleryZipGet,
  storiesGet,
  addStoriesPost,
  editStoriesPut,
  editWebsiteOrdersPut,
  generateInvoicePost,
  websiteOrdersGet,
  cmsListGet,
  statusMessagePatch,
  editMessagePost,
  deleteCmsDelete,
  getMessage,
  updateContentPost,
  updateTestimonialsPost,
  updateFaqsPost,
  deleteFaqsDelete,
  dashboard,
  getCategory,
  getEnquiries,
  getWebUser,
  getWebUserById,
  getEnquiryById,
  editEnquiry,
  GroupListing,
  GroupListing2,
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
  checkMobile,
  checkEmail,
  getSubCategory,
  getSubSubCategory,
  addCategory,
  editCategory,
  addSubCategory,
  editSubCategory,
  listingCms,
  getshop,
  getIdealshop,
  addShopProduct,
  makeIdealProduct,
  getGenrateEnquiryList,
  genrateEnquiry,
  viewEnquiryArtisan,
  genrateNewEnquiry,
  editGenratedEnquiry,
  genrateEstimate,
  genratePurchaseOrder,
  getOrderList,
  generateInvoice,
  importEnquiries,
  importArtisan,
  importProduct,
  getFromAllProduct,
  givePurchaseOrder,
  getPDF,
  checkPDF,
  clientUpdatePost,
  editAboustUs,
  importProductSizeMeasurementCSV
};
