let util = require("../../Utilities/util"),
  user_dao = require("../../dao/v2/user"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  // uploadCloud = require('../../middleware/cloudinary'),
  uploadCloud = require('../../middleware/fileUploaderS3'),
  multiparty = require('multiparty');

const MAX_IMG_SIZE = 12000000; // 12 MB

const knex = require("../../db/knex");

const userCheck = util.errHandler(async (req, res) => {
  user_dao.checkUser(req.body.email, (err, result) => { });
});

const login = async (req, res) => {
  let code = util.statusCode.FOUR_ZERO_ONE;
  let message = util.statusMessage.ERROR;
  let result = {};
  try {
    let criteria = { email: req.body.email }
    let user = await user_dao.checkUser(criteria);

    if(!user){

      res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: util.statusMessage.USER_NOT_EXITS });

    }else{
        let match = await bcrypt.compare(req.body.password, user.password);

          if (match) {

            let menus=await user_dao.getMenus(user.id)

            code = util.statusCode.OK;
            message = util.statusMessage.LOGIN_SUCCESSFULLY;
            // let token = jwt.sign({ user }, util.LOGIN_SECRET);
            let token = jwt.sign({ user }, util.LOGIN_SECRET);

            result.token = token;
            result.id = user.id;

            // // console.log("req.body",req.body.webToken.length)
            res.send({ code, message, result,menus:menus });

          } else {

            code = util.statusCode.FOUR_ZERO_ONE
            message = util.statusMessage.INVALID_PASS
            res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: util.statusMessage.INVALID_PASS });
          }
    }
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ONE, message: error })
  }
};

let changePassword = util.errHandler(async (req, res) => {
  let { newPassword, oldPassword } = req.body;

  let user = await user_dao.findUser({ userId: req.user.id });
  let match = await bcrypt.compare(oldPassword, user.password);
  let newHash = await bcrypt.hash(newPassword, util.saltRounds());

  if (!match) {
    res.status(util.statusCode.FOUR_ZERO_ONE).send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.ERROR,
    });
    return;
  }

  await user_dao.changePassword({ newHash, userId: req.user.id });

  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  res.send({ code, message });
});

let uploads = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  res.send({ code, message });
});

let gallery = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  res.send({ code, message });
});

let otp = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  res.send({ code, message });
});

let options = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  const type = req.query.type;

  let result = await user_dao.options({ type });

  res.send({ code, message, result });
});

let states = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  let result = await user_dao.states();

  res.send({ code, message, result });
});

let addCart = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  const userId = req.user.id;
  await user_dao.addCart({ ...req.body, userId });

  res.send({ code, message });
});

let cart = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  const userId = req.user.id;
  let result = await user_dao.cart({ userId });

  res.send({ code, message, result });
});

let addEnquiry = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  const userId = req.user.id;
  let result = await user_dao.addEnquiry({ ...req.body, userId });

  res.send({ code, message, result });
});

let addCard = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  const userId = req.user.id;
  let result = await user_dao.addCard({ ...req.body, userId });

  res.send({ code, message, result });
});

let addAddress = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  const userId = req.user.id;
  let result = await user_dao.addAddress({ ...req.body, userId });

  res.send({ code, message, result });
});

let changeStatus = util.errHandler(async (req, res) => {
  const { userId, status } = req.body;
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  await user_dao.changeStatus({ userId, status });

  res.send({ code, message });
});

let deleteUser = util.errHandler(async (req, res) => {
  const { userId } = req.body;
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  await user_dao.deleteUser({ userId });

  res.send({ code, message });
});



let addNewsfeed = util.errHandler(async (req, res) => {

  try {

    const form = new multiparty.Form();
    let uploadedFiles, criteria = {};

    form.parse(req, async function (err, fields, files) {

      let { id, description, title, type, url } = fields

      criteria['description'] = description[0]
      criteria['title'] = title[0]
      criteria['type'] = type[0]
      criteria['url'] = url[0]

      if (fields.id)
        criteria['id'] = id[0]

      if (files.newsfeed && files.newsfeed.length > 0) {

        const fileSize=files.newsfeed[0].size;
        if(Number(fileSize) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image2(files.newsfeed)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.newsfeed, resolve, reject));
        criteria['image'] = uploadedFiles[0]
      }
      criteria['isActive'] = criteria['isPublished'] = 1

      // console.log("criteria",criteria)

      await user_dao.addNewsfeed(criteria);

      res.send({ code: 201, message: 'Newsfeed added successfully' });
    })
  } catch (error) {
    res.send({ code: 401, message: "error" });
  }
});


let getNewsfeed = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  const result = await user_dao.getNewsfeed(req.query);
  res.send({ code, message, result });
});



let addCMS = util.errHandler(async (req, res) => {

  try {
    const criteria = { ...req.body };
    await user_dao.addCMS(criteria);

    res.send({ code: 200, message: 'Content added successfully' });
  } catch (error) {
    res.send({ code: 401, message: error });
  }
});


let getCMS = util.errHandler(async (req, res) => {
  let result = {}

  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  result = await user_dao.getCMS();
  res.send({ code, message, result });
});


let addOnboarding = util.errHandler(async (req, res) => {
  try {

    const form = new multiparty.Form();
    let uploadedFiles, criteria = {};

    form.parse(req, async function (err, fields, files) {

      let { id, description, language, type, url } = fields

      criteria['language'] = language[0]
      criteria['description'] = description[0]
      criteria['type'] = type[0]
      criteria['url'] = url[0]

      if (fields.id)
        criteria['id'] = id[0]

      if (files.onboarding && files.onboarding.length > 0) {

        const fileSize=files.onboarding[0].size;
        if(Number(fileSize) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        let fileExtension = files.onboarding[0].originalFilename.replace(/^.*\./, "");
        // // console.log("files.files[0]",files.files[0].originalFilename,"fileExtension",fileExtension)
        if(fileExtension==="webp"){
          uploadedFiles = await uploadCloud.upload_infographics(files.onboarding);
        }else{
          uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.onboarding, resolve, reject));
        }

        // uploadedFiles = await uploadCloud.upload_image2(files.onboarding)
        // uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.onboarding, resolve, reject));
        criteria['image'] = uploadedFiles[0]
      }

      criteria['isActive'] = 1
      criteria['ranking'] = 0

      if(fields.type[0] === "app"){
        criteria['hindiDescription'] = fields.hindiDescription[0];
        criteria['bangaliDescription'] = fields.bangaliDescription[0];
        criteria['gujratiDescription'] = fields.gujratiDescription[0];
     }

      await user_dao.addOnboarding(criteria);
      res.send({ code: 200, message: 'onboarding added successfully' });

    })
  } catch (error) {
    res.send({ code: 401, message: error });
  }
});


let listingOnboarding = util.errHandler(async (req, res) => {
  let result = {}
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  result = await user_dao.listingOnboarding(req.query);
  res.send({ code, message, result });
});


let addLoginOnboarding = util.errHandler(async (req, res) => {
  try {
    const form = new multiparty.Form();
    let uploadedFiles, criteria = {};

    form.parse(req, async function (err, fields, files) {
      if (files.loginOnboarding && files.loginOnboarding.length > 0) {

        const fileSize=files.loginOnboarding[0].size;
        if(Number(fileSize) > Number(MAX_IMG_SIZE)){
          res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
          return
        }

        // uploadedFiles = await uploadCloud.upload_image2(files.loginOnboarding)
        uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.loginOnboarding, resolve, reject));
      }

      let { id, type, country, table, name } = fields

      // console.log("fields===", fields)
      // console.log("uploadedFiles===", uploadedFiles)

      criteria['table'] = table[0]
      if(type && !type.length){
        throw new Error('type is required');
      }

      if (criteria['table'] === "customer_important_sample") {
        criteria['country'] = country && country.length > 0? country[0]: ''
        criteria['type'] = type[0]
        criteria['icon'] = uploadedFiles && uploadedFiles.length > 0? uploadedFiles[0]: ''
      }

      if (criteria['table'] === "type_of_store") {
        criteria['name'] = type[0]
        criteria['icon'] = uploadedFiles && uploadedFiles.length > 0? uploadedFiles[0]: ''
      }

      if (criteria['table'] === "aboutus_sample") {
        criteria['type'] = type[0];
      }

      if (fields.id){
        if(id && !id.length){
          throw new Error('id is required')
        }
        criteria['id'] = id[0]
      }
      // console.log("fields===",criteria)

      await user_dao.addLoginOnboarding(criteria);
      res.send({ code: 200, message: 'onboarding added successfully' });
    })

  } catch (error) {
    res.send({ code: 401, message: error });
  }
});



// let addLoginOnboarding = util.errHandler(async (req, res) => {

//   try {

//     const form = new multiparty.Form();
//     let uploadedFiles, criteria = {};

//     form.parse(req, async function (err, fields, files) {

//       if (files.loginOnboarding && files.loginOnboarding.length > 0) {
//         uploadedFiles = await uploadCloud.upload_image2(files.loginOnboarding)
//       }

//       let { id, type, country, table, name } = fields

//       // console.log("fields===",fields)

//       // console.log("uploadedFiles===",uploadedFiles)

//       criteria['table'] = table[0]

//       if (criteria['table'] === "customer_important_sample") {
//         criteria['country'] = country[0]
//         criteria['type'] = type[0]
//         criteria['icon'] = uploadedFiles[0]
//       }

//       if (criteria['table'] === "type_of_store") {
//         criteria['name'] = name[0]
//         criteria['icon'] = uploadedFiles[0]
//       }

//       if (criteria['table'] === "aboutus_sample") {
//         criteria['type'] = type[0]
//       }

//       if (fields.id)
//         criteria['id'] = id[0]

//       // console.log("fields===",criteria)

//       await user_dao.addLoginOnboarding(criteria);
//       res.send({ code: 200, message: 'onboarding added successfully' });
//     })

//   } catch (error) {
//     res.send({ code: 401, message: error });
//   }
// });

const listingLoginOnboarding = util.errHandler(async (req, res) => {
  let result = {}
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  result = await user_dao.listingLoginOnboarding(req.query);
  res.send({ code, message, result });
});


const statusOnboarding = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  let criteria = { ...req.body }

  await user_dao.statusOnboarding(criteria);
  res.send({ code, message });
});

const delLoginOnboarding = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  await user_dao.delLoginOnboarding(req.query);
  res.send({ code, message });
});




module.exports = {
  userCheck,
  login,
  changePassword,
  uploads,
  gallery,
  otp,
  options,
  states,
  cart,
  addCart,
  addEnquiry,
  addCard,
  addAddress,
  changeStatus,
  deleteUser,
  addNewsfeed,
  getNewsfeed,
  addCMS,
  getCMS,
  listingOnboarding,
  addOnboarding,
  addLoginOnboarding,
  listingLoginOnboarding,
  statusOnboarding,
  delLoginOnboarding
};
