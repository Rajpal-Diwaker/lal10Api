const util = require("../../Utilities/util"),
  app_dao = require("../../dao/v2/appdao"),
  jwt = require("jsonwebtoken"),
  // uploadCloud = require('../../middleware/cloudinary'),
  uploadCloud = require('../../middleware/fileUploaderS3'),
  multiparty = require('multiparty'),
  product_dao= require("../../dao/v2/product");

const knex = require('../../db/knex')
let _ = require('lodash');
const MAX_IMG_SIZE = 12000000; // 12 MB

const userCheck = util.errHandler(async (req) => {
  app_dao.checkUser(req.body.email, () => { });
});


// ****   login   **** //
const login = util.errHandler(async (req, res) => {
  try{
  let result = {}
  let checkuser = await app_dao.checkUserMobile(req.body);

  if (checkuser.length) {

          let checkDeletedStatus = await app_dao.checkUserDeletedStatus(req.body);

          if(checkDeletedStatus.length){

            let message = util.statusMessage.LOGIN_SUCCESSFULLY;

            const user_datails = await app_dao.findUser({ userId: checkuser[0].id })
            await app_dao.addDeviceToken({ device_token: req.body.device_token, userId: checkuser[0].id });

            let token = jwt.sign({ checkuser }, util.LOGIN_SECRET);

              result["authorization"] = token;
              result["userId"] = checkuser[0].id;

              if(user_datails.length){

                result["state"] = user_datails[0].state?user_datails[0].state:'';
                result["name"] = user_datails[0].name?user_datails[0].name:'';
                result["artisanImage"] = user_datails[0].artisanImage?user_datails[0].artisanImage:'';
                result["kycImage"] = user_datails[0].kycImage?user_datails[0].kycImage:'';

            }else{

                result["state"] = '';
                result["name"] = '';
                result["artisanImage"] = '';
                result["kycImage"] = '';

            }

              result["UserCraft"] = await app_dao.getUserCMPDetails({ userId: checkuser[0].id, type: 'UserCraft' })
              result["UserMaterial"] = await app_dao.getUserCMPDetails({ userId: checkuser[0].id, type: 'UserMaterial' })
              result["Userproduct"] = await app_dao.getUserCMPDetails({ userId: checkuser[0].id, type: 'UserProducts' })

              code = util.statusCode.OK;
              res.send({ code, message, result });

          }else{
            return res.send({"code":"502", "message":"Admin has deleted your account. Please contact admin for further queries."})
          }
    // }
  } else {
        return res.send({"code":"501", "message":"Admin has deactivated your account. Please contact admin for further queries"})
  }
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }

});


// ****   checkMobile   **** //
const checkMobile = util.errHandler(async (req, res) => {
  // try{
  const checkuser = await app_dao.checkUserMobile2(req.body)
  // console.log("checkuser",checkuser)
  if (checkuser.length) {
    const code = util.statusCode.FOUR_ZERO_ONE;
    const message = util.statusMessage.MOBILE_EXIST;
    res.status(util.statusCode.OK).send({ code, message });

  } else {

    code = util.statusCode.OK;
    message = util.statusMessage.SUCCESS;

    res.status(util.statusCode.OK).send({ code, message });
  }
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

});

// ****   checkEmail   **** //
const checkEmail = util.errHandler(async (req, res) => {
  //  try{
  const checkuser = await app_dao.checkUser(req.body)
  if (checkuser.length) {

    let code = util.statusCode.FOUR_ZERO_ONE;
    let message = util.statusMessage.EMAIL_EXIST;
    res.status(code).send({ code, message });

  } else {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.status(code).send({ code, message });
  }
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});


// ****   chooseLanguages   **** //
const chooseLanguages = util.errHandler(async (req, res) => {
  // try{
  await app_dao.chooseLanguages({ userId: req.body.userId, type: 'lang', name: util.lang(req.body.lang) })
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  res.status(code).send({ code, message });
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});



// ****  signUp  **** //
const signUp = util.errHandler(async (req, res) => {
  // try{
  let result = {}
  if (req.body.mobile) {
    // let user = await app_dao.checkUserMobile(req.body);

    let checkuser = await app_dao.checkUserMobile(req.body);

    if (!checkuser.length) {

      // console.log("req.body==",req.body)

      let userdata = await app_dao.addUser(req.body);

      // console.log("userdata",userdata)

      await app_dao.addArtisan({name:req.body.name,userId:userdata[0]});

      let checkuser2 = await app_dao.checkUserMobile(req.body);

      let code = util.statusCode.OK;
      let message = util.statusMessage.USER_ADDED;

      // let token = jwt.sign({ checkuser }, util.LOGIN_SECRET || 'lal10$#$#$@#%loginsecret%$#%$^$%^');

      let token = jwt.sign({ checkuser:checkuser2 }, util.LOGIN_SECRET);

      // console.log("token",token)

      // console.log("checkuser",checkuser2)

      result["authorization"] = token;
      result['userId'] = userdata[0];
      result['mobile'] = req.body.mobile;
      result['name'] = req.body.name;

      res.status(code).send({ code, message, result });

    } else {

      let code = util.statusCode.FOUR_ZERO_ONE;
      let message = util.statusMessage.USER_ALREADY_EXITS;
      res.status(code).send({ code, message, result });

    }
  } else {

    let code = util.statusCode.FOUR_ZERO_ONE;
    let message = util.statusMessage.USER_NOT_EXITS;
    res.status(code).send({ code, message, result });
  }
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});

// ****   artisanPicuploads   ****
const artisanPicuploads = util.errHandler(async (req, res) => {
  //  try{

  let result = {}
  const form = new multiparty.Form();

  form.parse(req, async function (err, fields, files) {

    const fileSize=files.artisanImage[0].size;
    if(Number(fileSize) > Number(MAX_IMG_SIZE)){
      res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
      return
    }

    // let uploadedFiles = await uploadCloud.upload_image2(files.artisanImage);
    let uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.artisanImage, resolve, reject));
    await app_dao.artisanPicuploads({ userId: fields.userId, artisanProfile: uploadedFiles[0] })
    code = util.statusCode.OK;
    message = util.statusMessage.IMAGE_UPLOAD;
    result = uploadedFiles

    res.status(code).send({ code, message, result });
  })
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});



// ****   states   **** //
const states = util.errHandler(async (req, res) => {
  try{

  let result = {}, code = util.statusCode.OK, message = util.statusMessage.SUCCESS;

  result = await app_dao.states(req.headers.lang);

  // if (result.length) {
  //   code = util.statusCode.OK;
  //   message = util.statusMessage.SUCCESS;
  // }
  // for (index = 0; index < result.length; index++) {
  //   result[index]['image'] = result[index]['image'];
  // }

  res.status(code).send({ code, message, result });
    } catch (error) {
  res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});

// ****   getCraftList   **** //
const getCraftList = util.errHandler(async (req, res) => {
  try{
  let result = {}, code = util.statusCode.OK, message = util.statusMessage.SUCCESS;
    result = await app_dao.getCraftList(req.headers.lang,req.headers.state);

  // if (result.length) {
  //   for (index = 0; index < result.length; index++) {
  //     result[index]['image'] = result[index]['image'];
  //   }
  //   code = util.statusCode.OK;
  //   message = util.statusMessage.SUCCESS;
  // }

    res.status(code).send({ code, message, result });
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});


// ****   getMatrialList   **** //
const getMatrialList = util.errHandler(async (req, res) => {

  try{
  let result = {}, code = util.statusCode.OK, message = util.statusMessage.SUCCESS;
    result = await app_dao.getMatrialList(req.headers.lang,req.headers.state);

  // if (result.length) {
  //   for (index = 0; index < result.length; index++) {
  //     result[index]['image'] = result[index]['image'];
  //   }
  //   code = util.statusCode.OK;
  //   message = util.statusMessage.SUCCESS;
  // }

      res.status(code).send({ code, message, result });
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
});


// ****   getProductList   **** //
const getProductList = util.errHandler(async (req, res) => {
   try{

  let result = {}, code = util.statusCode.OK,message = util.statusMessage.SUCCESS;
    result = await app_dao.getProductList(req.headers.lang,req.headers.state);

  // if (result.length) {
  //   for (index = 0; index < result.length; index++) {
  //     result[index]['image'] = result[index]['image'];
  //   }
  //   code = util.statusCode.OK;
  //   message = util.statusMessage.SUCCESS;
  // }

    res.status(code).send({ code, message, result });
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }

});


// // ****   signUpStep2   **** //
// const signUpStep2 = util.errHandler(async (req, res) => {
//   // try{

//   const form = new multiparty.Form();
//    let filename;
//    form.parse(req, async function (err, fields, files) {

//    let user = await app_dao.findUser({ userId: fields.userId[0] })

//      if (user.length) {

//         if(fields.email)
//         {
//           const checkEmail=await app_dao.editArtisan({ userId: fields.userId[0], email: fields.email[0] })

//           if(checkEmail==='exist'){
//             res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: util.statusMessage.EMAIL_EXIST });
//           }
//           // console.log("checkEmail",checkEmail)
//         }

//         if (files.artisanImage && files.artisanImage.length > 0) {
//           filename = await uploadCloud.upload_image2(files.artisanImage)

//           await app_dao.editArtisanDetails({ userId: fields.userId[0], artisanImage: filename[0] })
//         }

//        const code = util.statusCode.OK;
//        const message = util.statusMessage.UPDATED;

//        res.status(code).send({ code, message });
//    }
//  });
// });




// ****   signUpStep2   **** //
const signUpStep2 = util.errHandler(async (req, res) => {
  // try{

  const form = new multiparty.Form();
  let uploadedFiles;
  let filename;
  form.parse(req, async function (err, fields, files) {

    if (files.kycImage && files.kycImage.length > 0) {

      const fileSize=files.kycImage[0].size;
      if(Number(fileSize) > Number(MAX_IMG_SIZE)){
        res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
        return
      }


          // uploadedFiles = await uploadCloud.upload_image2(files.kycImage)
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.kycImage, resolve, reject));
          filename = uploadedFiles[0];
    }

    let {userId,state,material,product,craft } = fields;

    // state=Array.from(fields.state);
    // craft=Array.from(fields.craft);
    // product=Array.from(fields.product);
    // material=Array.from(fields.material);

    // console.log("fields===",fields)
    // console.log("fields===",state)
    // console.log("fields===",typeof fields.state ,"value==",fields.state)

      // await app_dao.signUpStep2({ userId: userId, kycImage: filename, state: state });

    if(state && state.length)
      {
        // console.log("state inside")
        await app_dao.signUpStep2({ userId: userId[0], state: state[0] });
      }

    if(filename)
      await app_dao.signUpStep2({ userId: userId[0], kycImage: filename });

    if(craft && craft.length)
      await app_dao.craftChoose({ userId: userId[0], craft: craft[0] });

    if(material && material.length)
        await app_dao.materialChoose({ userId: userId[0], material: material[0] });

    if(product && product.length)
        await app_dao.productChoose({ userId: userId[0], product: product[0] });

    let code = util.statusCode.OK;
    let message = util.statusMessage.UPDATED;

    res.status(code).send({ code, message });
  });

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

});

// ****   viewProfile   **** //
const viewProfile = util.errHandler(async (req, res) => {

  // try{
  let result = {}
  const checkuser = await app_dao.findUser({ userId: req.body.userId });

  // console.log("checkuser",checkuser)

  if (checkuser.length) {

    // console.log("checkuser",checkuser)

    result["userId"] = checkuser[0].userId;
    result["email"] = checkuser[0].email;
    result["mobile"] = checkuser[0].mobile;
    result["state"] = checkuser[0].state;
    result["name"] = checkuser[0].name;
    result["artisanImage"] = checkuser[0].artisanImage;
    result["kycImage"] = checkuser[0].kycImage;
    let stateName=await knex('options').select('name').where('id',checkuser[0].state).where('type','state').debug()
    result['stateName']=stateName[0]?stateName[0].name:"";
    result["UserCraft"] = await app_dao.getUserCMPDetails({ userId: checkuser[0].userId, type: 'UserCraft' })
    result["UserMaterial"] = await app_dao.getUserCMPDetails({ userId: checkuser[0].userId, type: 'UserMaterial' })
    result["Userproduct"] = await app_dao.getUserCMPDetails({ userId: checkuser[0].userId, type: 'UserProducts' })

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.status(code).send({ code, message, result });

  } else {

    result = {}
    code = util.statusCode.FOUR_ZERO_ONE;
    message = util.statusMessage.ERROR;
    res.status(code).send({ code, message, result });
    return;
  }

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

});


// ****   editProfile   **** //
const editProfile = util.errHandler(async (req, res) => {
  // try{
  const form = new multiparty.Form();
  let filename;
  form.parse(req, async function (err, fields, files) {

   let user = await app_dao.findUser({ userId: fields.userId[0] })

    if (user.length) {

      // // console.log("fields.emai",fields.email)
      // if(fields.email[0].length > 0 ){

        const checkEmail=await app_dao.editArtisan({ userId: fields.userId[0], email: fields.email[0] })
        // console.log("checkEmail",checkEmail)

        if(checkEmail===1){
          res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: util.statusMessage.EMAIL_EXIST });
          return
        }

      // }

      let {state,material,product,craft } = fields;


      if (files.artisanImage && files.artisanImage.length > 0) {
        // filename = await uploadCloud.upload_image2(files.artisanImage)
        filename = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.artisanImage, resolve, reject));
        // artisanImage = filename[0]
        await app_dao.editArtisanDetails({ userId: fields.userId[0], artisanImage: filename[0] })
      }

      if(state && state.length)
      {
        // console.log("state inside")
        await app_dao.signUpStep2({ userId: fields.userId[0], state: state[0] });
      }

    if(craft && craft.length)
      await app_dao.craftChoose({ userId: fields.userId[0], craft: craft[0] });

    if(material && material.length)
        await app_dao.materialChoose({ userId: fields.userId[0], material: material[0] });

    if(product && product.length)
        await app_dao.productChoose({ userId: fields.userId[0], product: product[0] });

      const code = util.statusCode.OK;
      const message = util.statusMessage.UPDATED;
      res.status(code).send({ code, message });

    } else {

      code = util.statusCode.FOUR_ZERO_ONE
      message = util.statusMessage.ERROR
      res.status(code).send({ code, message });
    }
  })
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

});

// ****   enquiryList   **** //
const enquiryList = util.errHandler(async (req, res) => {

      // try{
      let result = {};
      let totalCount;
      let responce;

      // console.log("req.",req.user)

      await app_dao.addDeviceToken({ device_token: req.body.device_token, userId: req.user[0].id });

      responce = await app_dao.enquiryList({userId:req.user[0].id});

      totalCount = await app_dao.enquiryTotalCount({userId:req.user[0].id},'enquiry');

      let code = util.statusCode.OK;
      let message = util.statusMessage.SUCCESS;

      result['totalCount'] = totalCount ? totalCount : 0
      result['res'] = responce;
      result['new'] = await getUserEnqCheck(req.user[0].id);

      res.status(code).send({ code, message, result });

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  //  }

});


const getUserEnqCheck = async (userId) => {
  try {
      let response=await knex('enquiry_order')
          .select('id')
          .where({assignUserId:userId })
      return response && response.length?1:0

  } catch (e) {
    return Promise.reject(e.toString())
  }
};

// ****   orderList   **** //
const orderList = util.errHandler(async (req, res) => {

  // try{

  let result = {}
  let totalCount;
  let responce;

  responce = await app_dao.orderList({userId:req.user[0].id});

  totalCount = await app_dao.enquiryTotalCount(req.body,'order');
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  // console.log("totalCount=>orderList=>",totalCount)

  result['totalCount'] = totalCount != "" ? totalCount : 0
  // result['res'] = _.orderBy(responce, ['unreadCount'],['desc']);
  result['res'] = responce;

  res.status(code).send({ code, message, result });

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
});

// ****   uploadChatMedia   **** //
const uploadChatMedia = util.errHandler(async (req, res) => {
  try{

  const result = {}
  const form = new multiparty.Form();
  form.parse(req, async function (err, fields, files) {

    let fileSize=files.files[0].size;
    if(Number(fileSize) > Number(MAX_IMG_SIZE)){
      res.send({code:"402", message:"Maximum 12 Mb file can be uploaded",files})
    }else{
      // result['filename'] = await uploadCloud.upload_image(files)
      let fileExtension = files.files[0].originalFilename.replace(/^.*\./, "");
      // // console.log("files.files[0]",files.files[0].originalFilename,"fileExtension",fileExtension)
      if(fileExtension==="webp"){
        result['filename'] = await uploadCloud.upload_infographics(files.files);
      }else{
        result['filename'] = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));
      }

      // result['filename'] = await new Promise((resolve, reject) => uploadCloud.upload_infographics(files.files));

    // result['filename'] = await uploadCloud.upload_pdf(files)
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    res.status(code).send({ code, message, result });
    }
  })
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   orderAcceptorReject   **** //
const orderAcceptorReject = util.errHandler(async (req, res) => {
  //  try{

      let result = {}
      result = await app_dao.orderAcceptorReject(req.body);
      let code = util.statusCode.OK;
      let message = util.statusMessage.SUCCESS;
      res.send({ code, message, result });

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});

// ****   uploadGalleryPic   **** //
const uploadGalleryPic = util.errHandler(async (req, res) => {

  try{
  let result = {}
  const form = new multiparty.Form();
  let uploadedFiles;
        form.parse(req, async function (err, fields, files) {
          let { userId, EnqId, toId } = fields

          if (files.files && files.files.length > 0){

                  // uploadedFiles = await uploadCloud.upload_image2(files.files)
                  uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.files, resolve, reject));

                  let updateImageQuery = []

                  for (const key in uploadedFiles) {

                      let temp = {
                          fromId: userId[0],
                          EnqId: EnqId[0],
                          files: uploadedFiles[key],
                          toId: toId[0],
                          type:'image'
                      }
                      updateImageQuery.push(temp)
                  }
                  await app_dao.uploadGalleryPic(updateImageQuery)
              }
            // await app_dao.uploadGalleryPic({ userId: userId[0], EnqId: EnqId[0], files: uploadedFiles[0], toId: toId[0] })
          result = await app_dao.getGalleryPic({ userId: userId[0], EnqId: EnqId[0] })
          let code = util.statusCode.OK;
          let message = util.statusMessage.SUCCESS;
          res.send({ code, message, result });
        })
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})


// ****   getGalleryPic   **** //
const getGalleryPic = util.errHandler(async (req, res) => {
  //  try{
  let result = {}
  result = await app_dao.getGalleryPic(req.body)
  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  // console.log("gellery", result)

  res.send({ code, message, result })

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

})


// ****   deleteGalleryPic   **** //
const deleteGalleryPic = util.errHandler(async (req, res) => {
  // try{
  const result = {}
  result = await app_dao.deleteGalleryPic(req.body)
  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  res.send({ code, message, result })
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }

})


// ****   addGalleryComment   **** //
const addGalleryComment = util.errHandler(async (req, res) => {
  //  try{

  let result = {}

  // const checkPermission=await knex('chat').where({id:req.body.ids,fromId:req.body.userId}).debug()

  // // console.log("checkPermission==",checkPermission)

  // if(!checkPermission.length){
  //   res.send({ code:util.statusCode.FOUR_ZERO_ONE, message:"permission not allowed" })
  // }

  result = await app_dao.addGalleryComment(req.body)

  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS
  res.send({ code, message, result })

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
})


// ****   getGalleryComment   **** //
const getGalleryComment = util.errHandler(async (req, res) => {
  // try{

  let result = {}
  result = await app_dao.getGalleryPic(req.body)

  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  res.send({ code, message, result })
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
})

// ****   addGalleryPrice   **** //
const addGalleryPrice = util.errHandler(async (req, res) => {
  try{
    // console.log(req)
    let result = {}

    result = await app_dao.addGalleryPrice(req.body)
    let code = util.statusCode.OK
    let message = util.statusMessage.SUCCESS

    res.send({ code, message, result })
  } catch (error) {
    // console.log("error", error)
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   getGalleryPrice   **** //
const getGalleryPrice = util.errHandler(async (req, res) => {
  // try{
  let result = {}
  result = await app_dao.getGalleryPic(req.body)

  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  // console.log("result===", result)

  res.send({ code, message, result })
  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
})


// ****   addlogisticDetails   **** //
const addlogisticDetails = util.errHandler(async (req, res) => {
  try{

     let criteria={ ...req.body}
     criteria.userId=req.user[0].id;

     await app_dao.addlogisticDetails(criteria);

     let code = util.statusCode.OK;
     let message = util.statusMessage.SUCCESS;
     res.send({ code, message });

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
 }
})

// ****   getlogisticDetails   **** //
const getlogisticDetails = util.errHandler(async (req, res) => {
 try{

     let result = {}

     result = await app_dao.getlogisticDetails({userId:req.user[0].id,orderId:req.query.orderId});

     let code = util.statusCode.OK;
     let message = util.statusMessage.SUCCESS;

     res.send({ code, message, result });

   } catch (error) {
     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
})

// ****   addProductionTracker   **** //
const addProductionTracker = util.errHandler(async (req, res) => {
  try{

      let result = {},criteria={};
      const form = new multiparty.Form();
      let uploadedFiles;

      form.parse(req, async function (err, fields, files) {

        let { orderId, deliveryDate, productionStatus, paymentStatus } = fields

        criteria['userId'] = req.user[0].id;
        criteria['orderId'] = orderId;
        // criteria['deliveryDate'] = deliveryDate;
        criteria['productionStatus'] = productionStatus;
        criteria['paymentStatus'] = paymentStatus;

        result = await app_dao.addProductionTracker(criteria)

        // console.log("hello",result)

        if (files.files && files.files.length > 0)
                {

                  const fileSize=files.files[0].size;
                  if(Number(fileSize) > Number(MAX_IMG_SIZE)){
                    res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
                    return
                  }

                    // uploadedFiles = await uploadCloud.upload_image(files)
                    uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));

                    let updateImageQuery = []
                    for (const key in uploadedFiles) {
                        let temp = {
                            tracker_id: result,
                            files: uploadedFiles[key],
                        }
                        updateImageQuery.push(temp)
                    }
                    await app_dao.uploadProductionTrackerFiles(updateImageQuery)
            }

        let code = util.statusCode.OK;
        let message = util.statusMessage.SUCCESS;

        res.send({ code, message });

        if(fields.image_ids)
            {
                await app_dao.removeProductionTrackerFiles(fields.image_ids)
            }

      })

    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }

})


// ****   getProductionTracker   **** //
const getProductionTracker = util.errHandler(async (req, res) => {
  // try{

      let result = {}

      result = await app_dao.getProductionTracker({userId:req.user[0].id,orderId:req.query.orderId});

      // console.log("req.user",req.user)

      // console.log("result=>>>>>.getProductionTracker",result)

      let code = util.statusCode.OK;
      let message = util.statusMessage.SUCCESS;

      res.send({ code, message, result });

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
 })



// ****   delGalleryPic   **** //
const delGalleryPic = util.errHandler(async (req, res) => {
  await app_dao.delGalleryPic(req.body.id)

  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  res.send({ code, message })
})



// ****   getOnboarding   **** //
const getOnboarding = util.errHandler(async (req, res) => {

  let result = {}

  result = await app_dao.getOnboarding(req.headers.lang)

  // // console.log("===",result)

  let code = util.statusCode.OK
  let message = util.statusMessage.SUCCESS

  res.send({ code, message, result })

})


// ***********   getMyShop  ************/
const getMyShop = util.errHandler(async (req, res) => {
  try {

    let result={}

    let code = util.statusCode.OK;

    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getMyShop({userId:req.user[0].id,limit:req.query.limit});

    let total = await app_dao.getProductTotal({userId:req.user[0].id,type:0});

    res.send({ code, message,total,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   getLiveProduct  ************/
const getLiveProduct = util.errHandler(async (req, res) => {

  try {

     let result={}

     let code = util.statusCode.OK;

     let message = util.statusMessage.SUCCESS;

     result= await app_dao.getLiveProduct({userId:req.user[0].id,limit:req.query.limit});

     let total = await app_dao.getProductTotal({userId:req.user[0].id,type:1});

     res.send({ code, message ,total,result})

  } catch (error) {

     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})


// ***********   getProductDetail  ************/
const getProductDetail = util.errHandler(async (req, res) => {

  try {

     let result={}

     let code = util.statusCode.OK;

     let message = util.statusMessage.SUCCESS;

     let limit = +req.query.limit;
     let offset = +req.query.offset;

     result = await app_dao.getProductDetail({userId:req.user[0].id, productId:+req.query.id, limit, offset });

     res.send({ code, message ,result})

  } catch (error) {

     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})


// ***********   getProductDetail  ************/
const getProductDetail2 = util.errHandler(async (req, res) => {

  try {

     let result={}

     let code = util.statusCode.OK;

     let message = util.statusMessage.SUCCESS;

     let limit = +req.query.limit;
     let offset = +req.query.offset;

     result = await app_dao.getProductDetail2({userId:req.user[0].id, productId:+req.query.id, limit, offset });

     res.send({ code, message ,result})

  } catch (error) {

     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})

// ***********   addEditProduct  ************/
let addEditProduct = util.errHandler(async (req, res) => {
  try {
      var form = new multiparty.Form();
      let uploadedFiles,criteria={};
      form.parse(req, async function (err, fields, files) {

          let { name, amount, inventoryQty, doableQty, searchTags, material, description,id,craft,pstateId } = fields;

          if(fields.id)
            criteria['id'] = id;

          criteria['userId'] = req.user[0].id;
          criteria['name'] = name;
          criteria['amount'] = amount;
          criteria['inventoryQty'] = inventoryQty;
          criteria['doableQty'] = doableQty;
          criteria['searchTags'] = searchTags;
          criteria['material'] = material;
          criteria['description'] = description;
          criteria['craft'] = craft;
          criteria['pstateId'] = pstateId?pstateId:0;

          // console.log("criteria",criteria)

          let productInfo = await app_dao.addEditProduct(criteria)

          if (files.files && files.files.length > 0){

            const fileSize=files.files[0].size;
            if(Number(fileSize) > Number(MAX_IMG_SIZE)){
              res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
              return
            }

                  // uploadedFiles = await uploadCloud.upload_image(files)
                  uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));
                  // uploadedFiles = await uploadCloud.upload_infographics(files.files)

                  let updateImageQuery = []
                  for (const key in uploadedFiles) {
                      let temp = {
                          productId: productInfo ? productInfo:id,
                          image: uploadedFiles[key],
                          userId: req.user[0].id
                      }
                      updateImageQuery.push(temp)
                  }
                  await product_dao.uploadImage(updateImageQuery)
          }

      res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS })

          if(fields.image_ids)
              {
                  await product_dao.removeImage(fields.image_ids)
              }

      })
  } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   getTermsAndCondition  ************/
const getTermsAndCondition = util.errHandler(async (req, res) => {

  try {

     let result={}

     let code = util.statusCode.OK;

     let message = util.statusMessage.SUCCESS;

     result = 'http://www.lal10.com/about-us/';

     res.send({ code, message ,result})

  } catch (error) {

     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })

  }
})


// ***********   getIdealShop  ************/
const getIdealShop = util.errHandler(async (req, res) => {
  try {

    let result={},total,list,criteria;

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    criteria={ ...req.body}
    criteria.userId=req.user[0].id;

    // // console.log("criteria=>>>>>>getIdealShopgetIdealShopgetIdealShop",criteria)

    result = await app_dao.getIdealShop(criteria);
    list = await app_dao.getCraftMaterialList(criteria);
    total = await app_dao.getTotalIdealShop(criteria);

    res.send({ code, message,total,list,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})


// ***********   addAwards  ************/
let addAwards = util.errHandler(async (req, res) => {
  try {
      var form = new multiparty.Form();
      let uploadedFiles, criteria={};

      form.parse(req, async function (err, fields, files) {
          let { title, id } = fields;

          if(id && id.length)
            criteria['id'] = id[0];

          criteria['userId'] = req.user[0].id;
          criteria['title'] = title[0];
          criteria['isActive'] = '1';

          if (files.image && files.image.length > 0){

            const fileSize=files.image[0].size;
            if(Number(fileSize) > Number(MAX_IMG_SIZE)){
              res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
              return
            }

            // uploadedFiles = await uploadCloud.upload_image2(files.image) ;
            uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.image, resolve, reject));
            // console.log(uploadedFiles, "uploadedFilesuploadedFilesuploadedFiles");
            criteria['image'] = uploadedFiles.join(",");
          }
        await app_dao.addAwards(criteria)

        res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS })

      })
  } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   getAwards  ************/
const getAwards = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getAwards({userId:req.user[0].id});

    res.send({ code, message,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})


// ***********   getAwardsDetails  ************/
const getAwardsDetails = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    // console.log("req.u",req.user)
    result = await app_dao.getAwardsDetails({userId:req.user[0].id, id:req.query.id});

    res.send({ code, message,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})


// ***********   getNewsFeed  ************/
const getNewsFeed = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getNewsFeed({userId:req.user[0].id});

    res.send({ code, message,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})


// ***********   viewInvoice  ************/
const viewInvoice = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.viewInvoice({userId:req.user[0].id,EnqId:req.query.EnqId});

    res.send({ code, message,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   addMyGallery  ************/
let addMyGallery = util.errHandler(async (req, res) => {
  try {
      var form = new multiparty.Form();
      let uploadedFiles,criteria={};
      form.parse(req, async function (err, fields, files) {

          let { title,id } = fields;

          // console.log("fields==",fields)

          if(id && id[0]!=="")
            criteria['id'] = id;

          criteria['userId'] = req.user[0].id;
          criteria['title'] = title;

          // console.log("criteria==",fields)

          // console.log("criteria==id",id[0])

          let gallery_id = await app_dao.addMyGallery(criteria)

          if (files.files && files.files.length > 0){

            const fileSize=files.files[0].size;
            if(Number(fileSize) > Number(MAX_IMG_SIZE)){
              res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
              return
            }

                  // uploadedFiles = await uploadCloud.upload_image(files)
                  uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));

                  let updateImageQuery = []
                  for (const key in uploadedFiles) {
                      let temp = {
                          gallery_id: gallery_id ? gallery_id:id,
                          images: uploadedFiles[key],
                          userId: req.user[0].id
                      }
                      updateImageQuery.push(temp)
                  }

                  // console.log("updateImageQuery",updateImageQuery)

                  await app_dao.uploadMyGalleryImage(updateImageQuery)
          }

      res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS })

          if(fields.image_ids){
                  await app_dao.removeMyGalleryImage(fields.image_ids)
              }

      })
  } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   getMyGalleryList  ************/
const getMyGalleryList = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getMyGalleryList({userId:req.user[0].id});

    res.send({ code, message,result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   getMyGalleryDetails  ************/
const getMyGalleryDetails = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getMyGalleryDetails({userId:req.user[0].id,id:req.query.id});

    res.send({ code, message,result})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})


// ***********   getNotificationList  ************/
const getNotificationList = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getNotificationList(req.user[0].id);

    res.send({ code, message,result})

    await app_dao.readNotification(req.user[0].id);

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})

// ***********   clearNotification  ************/
const clearNotification = util.errHandler(async (req, res) => {
  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    await app_dao.clearNotification(req.user[0].id);

    res.send({ code, message})

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }

})

// ***********   sendOTP  ************/
const sendOTP = util.errHandler(async (req, res) => {
  // try {

    let data={}
    let code = util.statusCode.OK;
    let message = util.statusMessage.OTP_SEND;

    data.mobile=req.body.mobile;
    data.otp=Math.floor(100000 + Math.random() * 900000);

    await app_dao.sendOTP(data);
    await util.sendOTP(data);

    res.send({ code, message})

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }

})



// ****   otpVerified   **** //
const otpVerified = util.errHandler(async (req, res) => {

  // try{

      let checkUser;

      checkUser = await app_dao.otpVerified(req.body);

      // console.log("checkUser==",checkUser)

      if(checkUser === 1)
        res.send({ code:util.statusCode.OK, message:util.statusMessage.OTP_SUCCESS});
      else
        res.send({ code:util.statusCode.FOUR_ZERO_ONE, message:util.statusMessage.INVALID_OTP});

  //   } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  // }
});

// ***********   generateInvoicePost  ************/
let generateInvoicePost = util.errHandler(async (req, res) => {
  try {
      var form = new multiparty.Form();
      let uploadedFiles, criteria={};

      form.parse(req, async function (err, fields, files) {
          let { orderId } = fields;

          if(orderId && !orderId.length)
            throw new Error("Missing field orderId");

          criteria['orderId'] = orderId[0];
          criteria['isActive'] = '1';

          if (files.image && files.image.length > 0){

            const fileSize=files.image[0].size;
            if(Number(fileSize) > Number(MAX_IMG_SIZE)){
              res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
              return
            }

            uploadedFiles = await uploadCloud.upload_pdf(files);
            criteria['image'] = uploadedFiles[0];
          }
        await app_dao.generateInvoicePost(criteria)

        res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS })

      })
  } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   invoiceGet  ************/
const invoiceGet = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let orderId = +req.query.orderId

    if(!orderId){
      throw new Error("Missing field orderId");
    }

    result = await app_dao.invoiceGet({ orderId });

    res.send({ code, message, result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   dashboardGet  ************/
const dashboardGet = util.errHandler(async (req, res) => {
  // try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let monthName = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec'
    ]

    let month = ""+req.query.month
    let week = ""+req.query.week
    let day = ""+req.query.day

    result = await app_dao.dashboardGet({ month, week, day, userId: req.user[0].id });

    res.send({ code, message, result })

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
})

// ***********   productLogGet  ************/
const productLogGet = util.errHandler(async (req, res) => {
  try {

    let result={};

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let productId = +req.query.productId

    if(!productId){
      throw new Error("Missing field productId");
    }

    result = await app_dao.productLog({ productId });

    // console.log("result==",Object.keys(result).length)

    if(Object.keys(result).length > 0){
      code = util.statusCode.OK
    }else{
      code = util.statusCode.TWO_ZERO_TWO;
    }

    res.send({ code, message, result })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

// ***********   productLogAcceptGet  ************/
const productLogAcceptGet = util.errHandler(async (req, res) => {
  try {

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    let productId = +req.query.productId

    if(!productId){
      throw new Error("Missing field productId");
    }

    await app_dao.productLogAccept({ productId });

    res.send({ code, message })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   getSupportList  ************/
const getSupportList = util.errHandler(async (req, res) => {
  try {

    let result={}
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await app_dao.getSupportList(req.headers.lang)

    res.send({ code, message,result });

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   saveSupportTicket  ************/
const saveSupportTicket = util.errHandler(async (req, res) => {
  try {

    let criteria=req.body

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    criteria['userId'] = req.user[0].id;

    await app_dao.saveSupportTicket(criteria)

    res.send({ code, message});

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})


// ***********   sendOfflineMsg  ************/
const sendOfflineMsg = util.errHandler(async (req, res) => {
  // try {

    let criteria=req.body

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

   let result = await app_dao.sendOfflineMsg(criteria)
    res.send({ code, message,result});

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
})



// ***********   logout  ************/
const logout = util.errHandler(async (req, res) => {
  try {

    const userId=req.user[0].id
    let query = `update users set appToken=NULL where id=${userId}`;
    await knex.raw(query).debug();

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    res.send({ code, message});

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
})

let getManageListing = util.errHandler(async (req, res) => {
  let resul={}
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  let postdata={...req.body}
  postdata.lang=req.headers.lang;
  const result = await app_dao.getManageListing(postdata);
  res.status(code).send({ code, message, result });
});



module.exports = {
  getProductDetail2,
  getManageListing,
  logout,
  sendOfflineMsg,
  saveSupportTicket,
  getSupportList,
  productLogAcceptGet,
  productLogGet,
  dashboardGet,
  invoiceGet,
  generateInvoicePost,
  userCheck,
  login,
  chooseLanguages,
  signUp,
  otpVerified,
  states,
  getCraftList,
  getMatrialList,
  getProductList,
  artisanPicuploads,
  signUpStep2,
  viewProfile,
  editProfile,
  checkMobile,
  checkEmail,
  enquiryList,
  orderList,
  uploadChatMedia,
  orderAcceptorReject,
  addlogisticDetails,
  getlogisticDetails,
  uploadGalleryPic,
  deleteGalleryPic,
  getGalleryPic,
  addGalleryComment,
  getGalleryComment,
  addGalleryPrice,
  getGalleryPrice,
  addProductionTracker,
  delGalleryPic,
  getOnboarding,
  getMyShop,
  getLiveProduct,
  getProductDetail,
  addEditProduct,
  getProductionTracker,
  getTermsAndCondition,
  getIdealShop,
  addAwards,
  getAwards,
  getAwardsDetails,
  getNewsFeed,
  viewInvoice,
  addMyGallery,
  getMyGalleryList,
  getMyGalleryDetails,
  getNotificationList,
  clearNotification,
  sendOTP
};
