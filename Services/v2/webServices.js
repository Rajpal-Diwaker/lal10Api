let util = require("../../Utilities/util"),
  web_dao = require("../../dao/v2/webdao"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  // uploadCloud = require('../../middleware/cloudinary'),
  uploadCloud = require("../../middleware/fileUploaderS3"),
  multiparty = require("multiparty"),
  // worldMapData = require('city-state-country'),
  randomstring = require("randomstring"),
  knex = require("../../db/knex");

const MAX_IMG_SIZE = 12000000; // 12 MB

const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });

// ****   login   **** //
const login = util.errHandler(async (req, res) => {
  try {
    let result = {};
    const checkuser = await web_dao.checkUser(req.body);

    if (checkuser.length) {
      const match = await bcrypt.compare(
        req.body.password,
        checkuser[0].password
      );
      if (match) {
        let code = util.statusCode.OK;
        let message = util.statusMessage.LOGIN_SUCCESSFULLY;

        delete checkuser[0].password;

        const token = jwt.sign({ checkuser }, util.LOGIN_SECRET);

        const store = await web_dao.getStore(checkuser[0].id);

        result.authorization = token;
        result.userId = checkuser[0].id ? checkuser[0].id : "";
        result.storeName = store[0].store ? store[0].store : "";
        result.fullName = store[0].name ? store[0].name : "";
        result.firstName = store[0].name ? store[0].name : "";
        result.lastName = store[0].name2 ? store[0].name2 : "";
        result.profileImage = store[0].profileImage
          ? store[0].profileImage
          : "https://res.cloudinary.com/techugonew/image/upload/v1598615923/KgnWAAxF1umdtWGKCs-TbDcG.png";
        result.email = checkuser[0].email ? checkuser[0].email : "";
        result.mobile = checkuser[0].mobile ? checkuser[0].mobile : "";
        result.countryCode = checkuser[0].countryCode
          ? checkuser[0].countryCode
          : "";
        result.is_verified = checkuser[0].is_verified
          ? checkuser[0].is_verified
          : "";

        res.send({ code, message, result });
      } else {
        code = util.statusCode.FOUR_ZERO_ONE;
        message = util.statusMessage.INVALID_PASS;
        res.send({ code, message, result });
      }
    } else {
      code = util.statusCode.FOUR_ZERO_ONE;
      message = util.statusMessage.USER_NOT_EXITS;
      res.send({ code, message, result });
    }
  } catch (error) {
    res.send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.USER_NOT_EXITS,
    });
  }
});

// ****  typeOfStore  **** //
const typeOfStore = util.errHandler(async (req, res) => {
  code = util.statusCode.OK;
  message = util.statusMessage.SUCCESS;
  result = await web_dao.typeOfStore();

  res.send({ code, message, result });
});

// ****  signUp  **** //
const signUp = util.errHandler(async (req, res) => {
  let result = {};

  const checkemail = await web_dao.checkUser(req.body);

  if (!checkemail.length) {
    const checkmobile = await web_dao.checkUserMobile(req.body);

    if (!checkmobile.length) {

      await knex.raw("START TRANSACTION")

      let hashPassword = await bcrypt.hash(
        req.body.password,
        util.saltRounds()
      );
      let verifyLink = randomstring.generate();

      const userdata = await web_dao.addWebUser({
        email: req.body.email,
        password: hashPassword,
        countryCode: req.body.countryCode,
        mobile: req.body.mobile,
        isActive: 1,
        role: util.role("enduser"),
        verifyLink: verifyLink,
      });

      await web_dao.addEditUserAdditionalDetails({
        userId: userdata.id,
        name: req.body.name,
        name2: req.body.name2,
        country: req.body.country,
        phone: req.body.phone,
      });

      await web_dao.editUserStore({
        userId: userdata.id,
        type: req.body.typeofstore,
        store: req.body.store,
        year: req.body.year,
        bussiness: req.body.bussiness,
        postalCode: req.body.postalCode,
        websiteUrl: req.body.websiteUrl,
        description: req.body.description,
      });

      await web_dao.editStoreAboutus({
        userId: userdata.id,
        type: req.body.hearabout,
      });

      await web_dao.editStoreProduct({
        userId: userdata.id,
        category: req.body.category,
      });

      await web_dao.editUserStoreImportant({
        userId: userdata.id,
        customerImportant: req.body.customerImportant,
      });
      await knex.raw("COMMIT")

      code = util.statusCode.OK;
      message = util.statusMessage.USER_ADDED;

      const checkuser = await web_dao.checkUser(req.body);

      delete checkuser[0].password;

      const token = jwt.sign({ checkuser }, util.LOGIN_SECRET);

      const store = await web_dao.getStore(checkuser[0].id);

      result.authorization = token;
      result.userId = checkuser[0].id ? checkuser[0].id : "";
      result.storeName = store[0].store ? store[0].store : "";
      result.fullName = store[0].name ? store[0].name : "";
      result.firstName = store[0].name ? store[0].name : "";
      result.lastName = store[0].name2 ? store[0].name2 : "";
      result.profileImage = store[0].profileImage
        ? store[0].profileImage
        : "https://res.cloudinary.com/techugonew/image/upload/v1598615923/KgnWAAxF1umdtWGKCs-TbDcG.png";
      result.email = checkuser[0].email ? checkuser[0].email : "";
      result.mobile = checkuser[0].mobile ? checkuser[0].mobile : "";
      result.is_verified = checkuser[0].is_verified
        ? checkuser[0].is_verified
        : "";

      res.send({ code, message, result });

      // let sendData={};
      // sendData['email']=req.body.email;
      // sendData['subject']='Welcome for Lal10';
      // sendData['html']="Dear " + req.body.name  + ' ' + req.body.name2 + "<br> Welcome To lal10 Website please verify your account click for blow link : " + process.env.BaseUrl2 + 'lal10website/#/user/emailVerify?link=' + verifyLink;
      // util.sendReceiptMail(sendData);

      let userData = await web_dao.getUserdetails(result.userId);
      // console.log("userData", userData);
      let sendData = {};
      // sendData['email']="rajpaltechugo@gmail.com";
      sendData["email"] = userData.email;
      sendData["subject"] = "Lal10 Customer Account Verification";
      sendData["html"] =
        '<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
      sendData["html"] +=
        '<div><table width="100%"><tr><br><br></tr><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /><tr><td></center>';
      sendData["html"] +=
        "<center><h2>Hi " +
        userData.name +
        " " +
        userData.name2 +
        '<br><br>We would like to welcome you to Lal10.</h2><h3>We have created a customer account for you. All you have to do is verify your email by clicking on <br> ‘Activate’. <br><br><a href="' +
        'https://lal10.com/' +"user/emailVerify?link=" +
        verifyLink +
        '"><input type="button" class="button" value="Activate"></a> ';
      sendData["html"] +=
        '<br>Make sure to subscribe to our email newsletter to keep receiving regular updates on our newproduct collections, offers, and promotions<br><br></br><a href="' +
        'https://lal10.com' +
        "/user/subscribe-email?email=" +
        userData.email +
        '"><button class="button">Subscribe</button></a><br><br>Happy Sourcing!</h3></center></table></div></body></html>';
      util.sendReceiptMail(sendData);
    } else {
      code = util.statusCode.FOUR_ZERO_ONE;
      message = util.statusMessage.MOBILE_EXIST;
      result = {};

      res.send({ code, message, result });
    }
  } else {
    result = {};
    code = util.statusCode.FOUR_ZERO_ONE;
    message = util.statusMessage.EMAIL_EXIST;

    res.send({ code, message, result });
  }
});

// ****   checkemail   **** //
const checkemail = util.errHandler(async (req, res) => {
  const user = await web_dao.checkUser(req.body);

  if (!user.length) {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message });
  } else {
    const code = util.statusCode.FOUR_ZERO_ONE;
    const message = util.statusMessage.EMAIL_EXIST;

    res.send({ code, message });
  }
});

// ****   checkUserMobile   **** //
const checkUserMobile = util.errHandler(async (req, res) => {
  const user = await web_dao.checkUserMobile(req.body);

  if (!user.length) {
    code = util.statusCode.OK;
    message = util.statusMessage.SUCCESS;

    res.send({ code, message });
  } else {
    code = util.statusCode.FOUR_ZERO_ONE;
    message = util.statusMessage.MOBILE_EXIST;

    res.send({ code, message });
  }
});

// ****   hearAboutUs   **** //
const hearAboutUs = util.errHandler(async (req, res) => {
  result = await web_dao.hearAboutUs();

  if (result.length) {
    code = util.statusCode.OK;
    message = util.statusMessage.SUCCESS;
  }

  res.send({ code, message, result });
});

// ****   getProductList   **** //
const getProductList = util.errHandler(async (req, res) => {
  const result = await web_dao.getProductList();

  if (result.length) {
    code = util.statusCode.OK;
    message = util.statusMessage.SUCCESS;
  }

  res.send({ code, message, result });
});

// ****   forgotPassword   **** //
const forgotPassword = util.errHandler(async (req, res) => {
  const user = await web_dao.checkUser({ email: req.body.email });

  if (!user.length) {
    res.status(util.statusCode.FOUR_ZERO_ONE).send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.INVALID_EMAIL,
    });
    return;
  } else {
    const userDetails = await web_dao.getStore(user[0].id);

    const newHash = randomstring.generate();
    await web_dao.forgotToken({ newHash, userId: user[0].id });

    // let sendData={};
    // sendData['email']=req.body.email;
    // sendData['subject']='Lal10 Reset Password link';
    // sendData['html']="Dear " + userDetails[0].name  + ' ' + userDetails[0].name2 + "<br> Your lal10 reset passsword link. <br> please click for blow link for changed password link : " + process.env.BaseUrl2 + 'lal10website/#/user/resetPassword?link=' + newHash;
    // util.sendReceiptMail(sendData);

    let userData = await web_dao.getUserdetails(user[0].id);
    // console.log("userData", userData);
    let sendData = {};
    // sendData['email']="rajpaltechugo@gmail.com";
    sendData["email"] = userData.email;
    sendData["subject"] = "Reset your Lal10 Password";
    sendData["html"] =
      '<html><head><meta charset="utf-8"><title>Lal10</title><meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>.button {background-color: #873f3f;;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}</style></head><body style="margin:0; padding:0;">';
    sendData["html"] +=
      '<div><table width="100%"><tr><br><br></tr><center><img src="https://res.cloudinary.com/techugonew/image/upload/v1596048332/2BtseqfXTubd1B-yzvuvp4K_.png" /><tr><td></center>';
    sendData["html"] +=
      "<center><h2>Hi " +
      userData.name +
      " " +
      userData.name2 +
      '<br><br>Looks like you tried to reset your Lal10 password.</h2><h3>If it was you who initiated this request, click on ‘Reset Password’ <br><br><a href="' +
      'https://lal10.com/' +
      "user/resetPassword?link=" +
      newHash +
      '"><button class="button">Reset Password</button></a> ';
    sendData["html"] +=
      '<br>Make sure to subscribe to our email newsletter to keep receiving regular updates on our newproduct collections, offers, and promotions<br><br></br><a href="' +
      'https://lal10.com/' +
      "user/subscribe-email?email=" +
      userData.email +
      '"><button class="button">Subscribe</button></a><br><br>Happy Sourcing!</h3></center></table></div></body></html>';
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
  const user = await web_dao.checkPwdToken({ token: req.body.link });

  if (!user.length) {
    res.status(util.statusCode.FOUR_ZERO_ONE).send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.LINK_EXPIRE,
    });
    return;
  }

  const match = await bcrypt.compare(req.body.newPassword, user[0].password);

  if (match) {
    res.send({
      code: util.statusCode.TWO_ZERO_ONE,
      message: "This password is old try something new",
    });
  } else {
    const newHash = await bcrypt.hash(req.body.newPassword, util.saltRounds());
    await web_dao.changePassword({ newHash, userId: user[0].id });
    res.send({ code, message });
  }
});

// ****   changePassword   **** //
const changePassword = util.errHandler(async (req, res) => {
  const user = await web_dao.checkUserId({ userId: req.user[0].id });
  const match = await bcrypt.compare(req.body.oldPassword, user[0].password);
  const newHash = await bcrypt.hash(req.body.newPassword, util.saltRounds());

  if (!match) {
    res.status(util.statusCode.FOUR_ZERO_ONE).send({
      code: util.statusCode.FOUR_ZERO_ONE,
      message: util.statusMessage.INVALID_OLD_PASS,
    });
    return;
  }

  const match2 = await bcrypt.compare(req.body.newPassword, user[0].password);

  if (match2) {
    res.send({
      code: util.statusCode.TWO_ZERO_ONE,
      message: "This password is old try something new",
    });
  } else {
    await web_dao.changePassword({ newHash, userId: user[0].id });
    res.send({ code, message });
  }

  // await web_dao.changePassword({ newHash, userId: req.user[0].id });

  // const code = util.statusCode.OK;
  // const message = util.statusMessage.PASSWORD_CHNAGED;
  // res.send({ code, message });
});

// ****   getCategory   **** //
const getCategory = util.errHandler(async (req, res) => {
  let result = {};
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;

  // client.get('getCategory', async (err, resData) => {
  //   if (resData) {
  //       let data=JSON.parse(resData);
  //       res.send({ code,message,result:data.result})
  //   } else {
        result = await web_dao.getCategory();
        // client.setex('getCategory',6000,JSON.stringify({result}));
        res.send({code,message,result});
    // }
  // });
});


// // ****   getCategory   **** //
// const getCategory = util.errHandler(async (req, res) => {
//   let result={}
//    result = await web_dao.getCategory();
//    code = util.statusCode.OK;
//    message = util.statusMessage.SUCCESS;
//    res.send({ code, message, result });
// });

// ****   getSubCategory   **** //
const getSubCategory = util.errHandler(async (req, res) => {
  result = await web_dao.getSubCategory(req.body.categoryId);
  code = util.statusCode.OK;
  message = util.statusMessage.SUCCESS;

  res.send({ code, message, result });
});

// ****   getCategoryProduct   **** //
const getCategoryProduct = util.errHandler(async (req, res) => {
  // try{

  let result = await web_dao.getCategoryProduct(req.body, "1");
  // result.Nonliveproduct = await web_dao.getCategoryProduct(req.body,'0');

  const code = util.statusCode.OK;
  const message = util.statusMessage.SUCCESS;
  const banner = await web_dao.getCategoryBanner(req.body);

  res.send({ code, message, banner, result });

  // } catch (error) {
  //   res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
});

// ****   getProductDetails   **** //
const getProductDetails = util.errHandler(async (req, res) => {
  try {
    let result = {},
      addedToCart = 0,
      is_verified = 0;

    result = await web_dao.getProductDetails(req.query.productId);

    if (req.headers.authorization) {
      const decoded = await jwt.verify(
        req.headers.authorization,
        util.LOGIN_SECRET
      );
      req.user = decoded.checkuser;
      const userId = req.user[0].id;
      addedToCart = await web_dao.getProductInCart({
        id: req.query.productId,
        userId,
      });

      let userdetails = await web_dao.checkUserId({ userId: req.user[0].id });

      if (userdetails.length) {
        is_verified = userdetails[0].is_verified;
        //   if(userdetails[0].is_verified !=='1'){
        //       res.send({ code: util.statusCode.TWO_ZERO_ONE, message: "Please verify your email first !" })
        //     // console.log("userdetails==",userdetails)
        //  }
      }
    }

    if (result)
      result.images = await web_dao.getProductImages(req.query.productId, 2);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    if (result) result.Cart = addedToCart ? addedToCart : 0;

    result.is_verified = is_verified ? is_verified : 0;
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getonBoarding   **** //
const getonBoarding = util.errHandler(async (req, res) => {
  const data = await web_dao.getonBoarding();

  // console.log("data===", data);
  const result = util.nullRemove(data);

  code = util.statusCode.OK;
  message = util.statusMessage.SUCCESS;
  res.send({ code, message, result });
});

// ****   subscribe   **** //
const subscribe = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  let email = req.body.email;

  let checkEmail = (await knex("subscribe").where("email", email)).toString();

  if (checkEmail.length) {
    code = util.statusCode.TWO_ZERO_ONE;
    message = "already subscribe";
  } else {
    await web_dao.subscribe(req.body);
  }

  res.send({ code, message });
});

// ****   getBrand   **** //
const getBrand = util.errHandler(async (req, res) => {
  let result = {};
  const code = util.statusCode.OK;
  const message = util.statusMessage.SUCCESS;

  client.get('getBrand', async (err, resData) => {
    if (resData) {
        // console.log("Cache DATA getBrand")
        let data=JSON.parse(resData);
        res.send({ code,message,result:data.result})
    } else {
        result = await web_dao.getBrand();
        client.setex('getBrand',6000,JSON.stringify({result}));
        // console.log("DB DATA getBrand")
        res.send({code,message,result});
    }
  })
  // res.send({ code, message, result });
});

// ****   getBanner   **** //
let getBanner = util.errHandler(async (req, res) => {

  // // console.log("data===", result);
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  let result={}

  client.get('getBanner', async (err, resData) => {
    if (resData) {
        // console.log("Cache DATA getBanner")
        let data=JSON.parse(resData);
        res.send({ code,message,result:data.result})
    } else {
        result = await web_dao.getBanner();
        client.setex('getBanner',6000,JSON.stringify({result}));
        // console.log("DB DATA getBanner")
        res.send({code,message,result});
    }
  });

  // res.send({ code, message, result });
});

// ****   getCraftMatrialList   **** //
const getCraftMatrialList = util.errHandler(async (req, res) => {
  try {
    const result = await web_dao.gettingOptions(req.query.type);
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.status(code).send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ***********   sendEnquiryWithoutLogin  ************/
const sendEnquiryWithoutLogin = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    if (req.headers.authorization) {
      const decoded = await jwt.verify(
        req.headers.authorization,
        util.LOGIN_SECRET
      );
      req.user = decoded.checkuser;
      let userdetails = await web_dao.checkUserId({ userId: req.user[0].id });

      if (userdetails.length) {
        if (userdetails[0].is_verified !== "1") {
          res.send({
            code: util.statusCode.TWO_ZERO_ONE,
            message: "Please verify your email first !",
          });
          // console.log("userdetails==", userdetails);
        }
      }
    }

    const form = new multiparty.Form();
    let uploadedFiles,
      criteria = {};

    form.parse(req, async function (err, fields, files) {
      criteria.name = fields.name[0];
      criteria.name2 = fields.name2[0];
      criteria.mobile = fields.mobile[0];
      criteria.store = fields.store[0];
      criteria.email = fields.email[0];
      criteria.productName = fields.productName[0];
      criteria.description = fields.description[0];

      if (files.files && files.files.length > 0) {
        const fileSize = files.files[0].size;
        if (Number(fileSize) > Number(MAX_IMG_SIZE)) {
          res.send({
            code: "402",
            message: "Maximum 12 Mb file can be uploaded",
          });
          return;
        }

        // uploadedFiles = await uploadCloud.upload_image(files)
        uploadedFiles = await new Promise((resolve, reject) =>
          uploadCloud.upload_image(files, resolve, reject)
        );
        criteria["attachment"] = uploadedFiles;
      }

      // // console.log("criteria",criteria)

      await web_dao.sendEnquiryWithoutLogin(criteria);

      res.send({ code, message });
    });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   masterSearch   **** //
const masterSearch = util.errHandler(async (req, res) => {
  const result = {};

  try {
    result.Liveproduct = await web_dao.masterSearch(req.query, "1");
    result.Nonliveproduct = await web_dao.masterSearch(req.query, "0");
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   addToCart   **** //
const addToCart = util.errHandler(async (req, res) => {
  const criteria = { ...req.body };
  criteria.userId = req.user[0].id;
  try {
    await web_dao.addToCart(criteria);
    const code = util.statusCode.OK;
    const message = "Product added to cart";
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getCartData   **** //
const getCartData = util.errHandler(async (req, res) => {
  // try{

  const result = {};
  const checkuser = await web_dao.checkUserId({ userId: req.user[0].id });
  result.getliveShopCart = await web_dao.getCartData(req.user[0].id, "0");
  result.EnquiryCart = await web_dao.getCartData(req.user[0].id, "1");

  result.isEmailVerified = checkuser[0].is_verified;

  const code = util.statusCode.OK;
  const message = util.statusMessage.SUCCESS;

  res.send({ code, message, result });

  // } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
});

// ****   removeCartData   **** //
const removeCartData = util.errHandler(async (req, res) => {
  try {
    const criteria = { ...req.body };
    criteria.userId = req.user[0].id;

    await web_dao.removeCartData(criteria);
    const code = util.statusCode.OK;
    const message = "Successfully removed from cart";
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   updateCartData   **** //
const updateCartData = util.errHandler(async (req, res) => {
  try {
    const criteria = { ...req.body };

    criteria.userId = req.user[0].id;
    // console.log("hello", req.user);

    await web_dao.updateCartData(criteria);
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   sendEnquiry   **** //
const sendEnquiry = util.errHandler(async (req, res) => {
  // try{
  const criteria = { ...req.body };

  criteria.userId = req.user[0].id;

  // // console.log("criteria===",criteria)

  await web_dao.sendEnquiry(criteria);

  const result = await web_dao.checkUserCart(criteria);
  const uniqueId = await web_dao.getLastEnquiry(criteria);

  const code = util.statusCode.OK;
  const message = util.statusMessage.SUCCESS;

  res.send({ code, message, result, uniqueId });

  // } catch (error) {
  //     res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  // }
});

// ****   addAddress   **** //
const addAddress = util.errHandler(async (req, res) => {
  try {
    const criteria = { ...req.body };
    criteria.userId = req.user[0].id;

    await web_dao.addAddress(criteria);
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getAddress   **** //
const getAddress = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.getAddress(req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   addCardData   **** //
const addCardData = util.errHandler(async (req, res) => {
  try {
    const criteria = { ...req.body };
    criteria.userId = req.user[0].id;

    await web_dao.addCardData(criteria);
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getCardData   **** //
const getCardData = util.errHandler(async (req, res) => {
  try {
    let result = {},
      data;
    result = await web_dao.getCardData(req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message, result, data });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   removeData   **** //
const removeData = util.errHandler(async (req, res) => {
  try {
    let criteria = { ...req.body };
    criteria.userId = req.user[0].id;

    await web_dao.removeData(criteria);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   editPersonalDetails   **** //
const editPersonalDetails = util.errHandler(async (req, res) => {
  try {
    let criteria = { ...req.body };

    // console.log("criteria,", criteria);

    await web_dao.editPersonalDetails(criteria, req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   editBussinessDetails   **** //
const editBussinessDetails = util.errHandler(async (req, res) => {
  try {
    let criteria = { ...req.body };

    // console.log("criteria,", criteria);

    await web_dao.editBussinessDetails(criteria, req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   viewProfileDetails   **** //
const viewProfileDetails = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.viewProfileDetails(req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ***********   profileImage  ************/
const profileImage = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = {};
    const form = new multiparty.Form();
    let uploadedFiles;

    form.parse(req, async function (err, fields, files) {
      if (files.profileImage && files.profileImage.length > 0) {
        const fileSize = files.profileImage[0].size;
        if (Number(fileSize) > Number(MAX_IMG_SIZE)) {
          res.send({
            code: "401",
            message: "Maximum 12 Mb file can be uploaded",
          });
          return;
        }

        // uploadedFiles = await uploadCloud.upload_image2(files.profileImage)
        uploadedFiles = await new Promise((resolve, reject) =>
          uploadCloud.upload_image2(files.profileImage, resolve, reject)
        );
        await web_dao.profileImage({
          profileImage: uploadedFiles[0],
          userId: req.user[0].id,
        });
      }

      result.image = uploadedFiles[0];

      res.send({ code, message, result });
    });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getliveShop   **** //
const getliveShop = util.errHandler(async (req, res) => {
  try {
    let result = {};

    result = await web_dao.getliveShop(req.body);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getEnquiryList   **** //
const getEnquiryList = util.errHandler(async (req, res) => {
  try {
    let result = {};
    result = await web_dao.getEnquiryList(req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   trackEnquiry   **** //
const trackEnquiry = util.errHandler(async (req, res) => {
  try {
    let result = {};
    result = await web_dao.trackEnquiry({
      userId: req.user[0].id,
      EnqId: req.query.id,
    });

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getCountry   **** //
const getCountry = util.errHandler(async (req, res) => {
  try {
    let result = {};
    result = await knex("tbl_countries").debug();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getState   **** //
const getState = util.errHandler(async (req, res) => {
  try {
    let result = {};

    result = await knex("tbl_states as t1")
      .join("tbl_countries as t2", "t1.country_id", "t2.id")
      .select("t1.*")
      .where("t2.name", req.query.country)
      .debug();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getCity   **** //
const getCity = util.errHandler(async (req, res) => {
  try {
    let result = {};

    result = await knex("tbl_cities as t1")
      .join("tbl_states as t2", "t1.state_id", "t2.id")
      .select("t1.*")
      .where("t2.name", req.query.state)
      .debug();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   userVerify   **** //
const userVerify = util.errHandler(async (req, res) => {
  try {
    let result = {};
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    result = await web_dao.userVerify(req.query.link);
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getOrderList   **** //
const getOrderList = util.errHandler(async (req, res) => {
  try {
    let result = {};
    result = await web_dao.getOrderList(req.user[0].id);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   trackOrder   **** //
const trackOrder = util.errHandler(async (req, res) => {
  try {
    let result = {};
    result = await web_dao.trackOrder({
      userId: req.user[0].id,
      EnqId: req.query.id,
    });

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getFaq   **** //
const getFaq = util.errHandler(async (req, res) => {
  try {
    let result = {};

    result = await web_dao.getFaq();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   checkOut   **** //
const checkOut = util.errHandler(async (req, res) => {
  try {
    let result = {};

    result = await web_dao.checkOut({
      userId: req.user[0].id,
      ids: req.query.id,
    });

    // // console.log("result==",result)
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   OrderPlace   **** //
const OrderPlace = util.errHandler(async (req, res) => {
  try {
    let result = {};

    let criteria = { ...req.body };
    criteria.userId = req.user[0].id;
    // console.log("criteria,", criteria);

    result = await web_dao.OrderPlace(criteria);
    const redirect = await web_dao.checkUserCart(criteria);

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result, redirect });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getNewsFeed   **** //
const getNewsFeed = util.errHandler(async (req, res) => {
  try {

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    client.get('getNewsFeed', async (err, resData) => {
      if (resData) {
          // console.log("Cache DATA getNewsFeed")
          let data=JSON.parse(resData);
          res.send({ code,message,result:data.result})
      } else {
          result = await web_dao.getNewsFeed();
          client.setex('getNewsFeed',6000,JSON.stringify({result}));
          // console.log("DB DATA getNewsFeed")
          res.send({code,message,result});
      }
    })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getExhibitionBanner   **** //
const getExhibitionBanner = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.getExhibitionBanner();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   bestsellingProduct   **** //
const bestsellingProduct = util.errHandler(async (req, res) => {
  try{
  const code = util.statusCode.OK;
  const message = util.statusMessage.SUCCESS;

  // client.get('bestsellingProduct', async (err, resData) => {
  //   if (resData) {
  //       // console.log("Cache DATA bestsellingProduct")
  //       let data=JSON.parse(resData);
  //       res.send({ code,message,result:data.result})
  //   } else {
        result = await web_dao.bestsellingProduct();
        // client.setex('bestsellingProduct',6000,JSON.stringify({result}));
        // console.log("DB DATA bestsellingProduct")
        res.send({code,message,result});
    // }
  // })

  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
  }
});

// ****   worldManufacturing   **** //
const worldManufacturing = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.worldManufacturing();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

    // res.send({ code, message,result: [
    //   {
    //     countries:1, industriesServed:350, projects:300, clients:290
    //   }
    // ] });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   servicingIndia   **** //
const servicingIndia = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.servicingIndia();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

    // res.send({ code, message,result: [
    //   {
    //     artisansWorked:100,productCategories:100,packagingDelivered:200,countriesExported:1
    //   }
    // ] });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   customerFeedback   **** //
const customerFeedback = util.errHandler(async (req, res) => {
  try {
    let result = {};
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    client.get('customerFeedback', async (err, resData) => {
      if (resData) {
          // console.log("Cache DATA customerFeedback")
          let data=JSON.parse(resData);
          res.send({ code,message,result:data.result})
      } else {
          result = await web_dao.customerFeedback();
          client.setex('customerFeedback',6000,JSON.stringify({result}));
          // console.log("DB DATA customerFeedback")
          res.send({code,message,result});
      }
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   serviceSector   **** //
const serviceSector = util.errHandler(async (req, res) => {
  try {
    let result={};
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    client.get('serviceSector', async (err, resData) => {
      if (resData) {
          // console.log("Cache DATA serviceSector")
          let data=JSON.parse(resData);
          res.send({ code,message,result:data.result})
      } else {
          result = await web_dao.serviceSector();
          client.setex('serviceSector',6000,JSON.stringify({result}));
          // console.log("DB DATA serviceSector")
          res.send({code,message,result});
      }
    })
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   exhibitionUserPost   **** //
const exhibitionUserPost = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    let { name, email, mobile, exhibitionId } = req.body;

    if (!name) {
      throw new Error("Missing field name");
    }

    if (!email) {
      throw new Error("Missing field email");
    }

    if (!mobile) {
      throw new Error("Missing field mobile");
    }

    if (!exhibitionId) {
      throw new Error("Missing field exhibitionId");
    }

    let checkexhibitionId = await knex("user_exhibition").where("id", req.body.exhibitionId)

    console.log("checkexhibitionId",checkexhibitionId)

    if (!checkexhibitionId.length) {
      code = util.statusCode.TWO_ZERO_ONE;
      message = "Invalid checkexhibitionId";

    } else {

    let checkRecord = await knex("user_exhibition").where("email", req.body.email)
    if (checkRecord.length) {
      code = util.statusCode.TWO_ZERO_ONE;
      message = "already registred";

    } else {
      await web_dao.exhibitionUserPost({
        name,
        email,
        mobile,
        exhibitionId,
      });
    }
   }
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   indiaMap   **** //
const indiaMap = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.indiaMap();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({ code, message, result });

    // res.send({ code, message, result: [
    //   { lat: "28.5355", lng: "77.3910", placeName: "Noida" },
    //   { lat: "28.6692", lng: "77.4538", placeName: "Ghaziabad" },
    //   { lat: "17.3850", lng: "78.4867", placeName: "Hyderabad" },
    //   { lat: "10.8505", lng: "76.2711", placeName: "Kerala" },
    // ] });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   countryMap   **** //
const countryMap = util.errHandler(async (req, res) => {
  try {
    let result = await web_dao.bestsellingProduct();

    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;

    res.send({
      code,
      message,
      result: [
        { lat: "20.5937", lng: "78.9629", placeName: "India" },
        { lat: "25.2744", lng: "133.7751", placeName: "Australia" },
        { lat: "7.8731", lng: "80.7718", placeName: "Srilanka" },
        { lat: "30.3753", lng: "69.3451", placeName: "Pakistan" },
      ],
    });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   aboutUs   **** //
const aboutUs = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.aboutUs();
    let team = await web_dao.getTeam();

    res.send({ code, message, result, team });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getBlogs   **** //
const getBlogs = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.getBlogs();
    let tranding = await web_dao.getBlogs();

    res.send({ code, message, result, tranding });

    // res.send({ code, message, result:[{id:1,title:"admin",link:"abcd.com"}] });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   careers   **** //
const careers = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.careers();

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getCatalogue   **** //
const getCatalogue = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await knex("catalogue").debug();

    res.send({ code, message, result });

    // res.send({ code, message, result:[{id:1,title:"admin",link:"https://lal10bucketiam.s3-ap-south-1.amazonaws.com/LAL10_1601032908058.jpg"}] });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   returnPolicy   **** //
const returnPolicy = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.returnPolicy();

    // res.send({ code, message, result:[{id:1,title:"admin",link:"abcd.com"}] });
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   privacyPolicy   **** //
const privacyPolicy = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.privacyPolicy();

    // res.send({ code, message, result:[{id:1,title:"admin",link:"abcd.com"}] });
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   updateCartData   **** //
const updateLiveCartQty = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const criteria = { ...req.body };
    let checkRecord = await knex("cart").where({ id: req.body.id }).debug();

    if (checkRecord.length) {
      let checkProductQty = await knex("products")
        .where({ id: checkRecord[0].productId, isActive: "1", deleted: "1" })
        .debug();
      if (checkProductQty.length) {
        if (req.body.qty > checkProductQty[0].inventoryQty) {
          // console.log("value greater then==", checkProductQty[0].inventoryQty);
          // console.log("req.body.qty==", req.body.qty);

          res.send({
            code: util.statusCode.TWO_ZERO_ONE,
            message: "Given quanlity not in Inventory",
          });
        }
      }
    }
    criteria.userId = req.user[0].id;
    await web_dao.updateLiveCartQty(criteria);
    res.send({ code, message });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   sendResume   **** //
const sendResume = util.errHandler(async (req, res) => {
  try {
    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;
    const form = new multiparty.Form();
    let uploadedFiles,
      criteria = {};

    form.parse(req, async function (err, fields, files) {
      criteria.fullName = fields.fullName;
      criteria.mobile = fields.mobile;
      criteria.email = fields.email;
      criteria.subject = fields.subject;
      // if(fields.description.length)
      criteria.description = fields.description;

      if (files.files && files.files.length > 0) {
        const fileSize = files.files[0].size;
        if (Number(fileSize) > Number(MAX_IMG_SIZE)) {
          res.send({
            code: "402",
            message: "Maximum 12 Mb file can be uploaded",
          });
          return;
        }

        uploadedFiles = await uploadCloud.upload_infographics(files.files);
        // uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_infographics(files.files, resolve, reject));
        criteria["resume"] = uploadedFiles;
      }

      await web_dao.sendResume(criteria);

      res.send({ code, message });
    });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   getCustomerImportant   **** //
const getCustomerImportant = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.getCustomerImportant();

    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// ****   subscribe2   **** //
const subscribe2 = util.errHandler(async (req, res) => {
  let code = util.statusCode.OK;
  let message = util.statusMessage.SUCCESS;
  let email = req.query.email;

  // console.log("req.query", req.query);
  let checkEmail = (await knex("subscribe").where("email", email)).toString();

  if (checkEmail.length) {
    code = util.statusCode.TWO_ZERO_ONE;
    message = "already subscribe";
  } else {
    await web_dao.subscribe(req.query);
  }

  res.send({ code, message });
});

// ****   getAllsubcategory   **** //
const getAllsubcategory = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result = await web_dao.getAllsubcategory();
    res.send({ code, message, result });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});



// ****   rajpal   **** //
const rajpal = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    let result={};

    client.get(redis_key, async (err, resData) => {

      if (resData) {

        let data=JSON.parse(resData);
        // console.log("resData=><<<>Cahche Data")

        res.send({ code,message,result:data.result})

      } else {

        result = await knex("blogs").select('id','title');
        // console.log("result DB data")
        client.setex(redis_key,600,JSON.stringify({result}));

        res.send({code,message,result});
      }
      client.keys("*", function (err, keys) {
        // console.log("rajpal-><<<<>>>>keys",keys)
      })
    });
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});


// ****   clearChache   **** //
const clearChache = util.errHandler(async (req, res) => {
  try {
    const code = util.statusCode.OK;
    const message = util.statusMessage.SUCCESS;
    await util.removeCache();
    res.send({code,message});
  } catch (error) {
    res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error });
  }
});

// getAllsubcategory
module.exports = {
  clearChache,
  rajpal,
  getAllsubcategory,
  subscribe2,
  getCustomerImportant,
  sendResume,
  updateLiveCartQty,
  privacyPolicy,
  returnPolicy,
  getCatalogue,
  careers,
  getBlogs,
  aboutUs,
  login,
  typeOfStore,
  signUp,
  checkemail,
  checkUserMobile,
  hearAboutUs,
  getProductList,
  forgotPassword,
  resetPassword,
  changePassword,
  getCategory,
  getSubCategory,
  getCategoryProduct,
  getProductDetails,
  sendEnquiry,
  getCartData,
  removeCartData,
  updateCartData,
  getonBoarding,
  subscribe,
  getBrand,
  getBanner,
  getCraftMatrialList,
  sendEnquiryWithoutLogin,
  masterSearch,
  addToCart,
  addAddress,
  getAddress,
  addCardData,
  getCardData,
  removeData,
  editPersonalDetails,
  editBussinessDetails,
  viewProfileDetails,
  profileImage,
  getliveShop,
  getEnquiryList,
  trackEnquiry,
  getCountry,
  getState,
  getCity,
  userVerify,
  getOrderList,
  trackOrder,
  getFaq,
  checkOut,
  OrderPlace,
  getNewsFeed,
  getExhibitionBanner,
  bestsellingProduct,
  worldManufacturing,
  servicingIndia,
  customerFeedback,
  serviceSector,
  exhibitionUserPost,
  indiaMap,
  countryMap,
};
