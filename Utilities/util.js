let fs = require("fs"),
  mustache = require("mustache"),
  nodemailer = require("nodemailer"),
  templates = require("../Utilities/templates"),
  crypto = require("crypto"),
  path = require('path'),
  ThumbnailGenerator = require('video-thumbnail-generator').default;
  const _ = require("lodash");
const knex = require('../db/knex')

const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });

const baseUrl='http://15.207.157.139:5656/';
const LOGIN_SECRET="lal10$#$#$@#%loginsecret%$#%$^$%^"

let uploadFolder = "/let/www/html/tpm/uploads/";
let usersImageUrl = uploadFolder + "users/";

let role = name => {
  const role = [
    {id: 1, name: 'admin'},
    {id: 2, name: 'artisan'},
    {id: 3, name: 'enduser'},
    {id: 4, name: 'subadmin'}
  ]

  return role.filter(ob => ob.name == name)[0].id
}

let type = name => {
  const type = [
    {id: 1, name: 'craft'},
    {id: 2, name: 'material'},
    {id: 3, name: 'product'}
  ]

  return type.filter(ob => ob.name == name)[0].id
}

let lang = name => {
  const lang = [
    {id: 1, name: 'en'}, //english
    {id: 2, name: 'hi'}, //hindi
    {id: 3, name: 'bn'}  //bangla
  ]
  return lang.filter(ob => ob.name == name)[0].id
}


let saltRounds = _ => {
  const saltRounds = 10
  return saltRounds
}

const errHandler = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(err => {
        console.log(err)
        // res.send({ "message": "something went wrong" })
      });
  };

let send_notification = (registration_token, title, body, msg) => {
  let FCM = require('fcm-node');
  let serverKey = process.env.FCM_SERVER_KEY
  let fcm = new FCM(serverKey);

  let message = {
    to: registration_token,
    collapse_key: 'your_collapse_key',

    notification: {
      title: title,
      body: body
    },

    data: {
      title: title,
      msg: body,
      body: body
    }
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
}

let randomValueBase64 = len => {
  return crypto
    .randomBytes(Math.ceil((len * 3) / 4))
    .toString("base64") // convert to base64 format
    .slice(0, len) // return required number of characters
    .replace(/\+/g, "0") // replace '+' with '0'
    .replace(/\//g, "0"); // replace '/' with '0'
};

// Define Error Codes
let statusCode = {
  OK: 200,
  FOUR_ZERO_ONE: 401,
  TWO_ZERO_ONE: 201,
  TWO_ZERO_TWO: 202,
  INTERNAL_SERVER_ERROR: 400,
  FOUR_ZERO_ZERO: 400,
  BAD_REQUEST: 404,
  FIVE_ZERO_ZERO: 500,
  THREE_ZERO_ZERO: 300,
  THREE_ZERO_ONE: 301,
  THREE_THREE_THREE: 333,
  DELERROR: 999
};

// Define Error Messages
let statusMessage = {
  PARAMS_MISSING: "Mandatory Fields Missing",
  SERVER_BUSY: "Our Servers are busy. Please try again later.",
  PAGE_NOT_FOUND: "Page not found",
  SUCCESS: "Success.",
  ERROR: "Error",
  REMOVED: "Removed.",
  USER_ALREADY_EXITS: "User already exists.",
  USER_NOT_EXITS: "User does not exists.",
  ITEM_NOT_EXITS: "Item does not exists.",
  INVALID_TOKEN: "User authentication failed.",
  OLD_TOKEN: "Please provide new token",
  INVALID_PASS: "Invalid password.",
  TABLE_NOT_EXISTS: "table not exists please add new table.",
  VERIFY_NUMBER: "Please verify your mobile number.",
  STATUS_UPDATED: "User profile updated successfully.",
  UPDATED: "Updated successfully.",
  PASSWORD_CHNAGED: "User password changed successfully.",
  DB_ERROR: "Database related error.",
  EMAIL_SENT: "An email with generate new password link has been sent on registered email.",
  USER_ADDED: "User signup successfully.",
  LOGIN_SUCCESSFULLY: 'Login successfully',
  PWD_NOT_MATCH: 'Passwords do not match',
  GET_BACK_SOON: 'We will get back to you soon',
  UNABLETOSEND: "Unable to send OTP, please try after sometime.",
  OTP_SEND: 'OTP send successfully',
  INVALID_OTP: "Invalid OTP for mobile :",
  RESEND_OTP: "Please resend OTP.",
  OTP_SUCCESS: 'OTP verified successfully',
  IMAGE_UPLOAD: 'Image upload successfully',
  MOBILE_EXIST: "This mobile no exist please try again.",
  EMAIL_EXIST: "This email exist please try again.",
  INVALID_OLD_PASS: "Invalid old password.",
  INVALID_EMAIL: "Invalid email.",
  INVALID_PWD_TOKEN: "Invalid forgot token ",
  ENQUIRY_GEN: "Enquiry generate successfully.",
  GROUP_NAME_EXIST: "Group name exist please try again.",
  GROUP_ADD: "Group add successfully.",
  CSV_UPLOAD:"CSV file successfully processed." ,
  CSV_FILE_CHOOSE :"Please choose file." ,
  PRODUCT_FETCH :"Product list fetched successfully" ,
  LINK_EXPIRE:"This link has been Expire",

};

let mailModule = process.env.EMAIL_CONFIG? nodemailer.createTransport(process.env.EMAIL_CONFIG): null;

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // ignoreTLS: false,
  // secure: true, // true for 465, false for other ports
  auth: {
    user: 'contact@lal10.com',
    pass: 'reachus@Lal10' // generated ethereal password YL5r2h>&
    // pass: 'contactpasswordtemp@lal10' // generated ethereal password YL5r2h>&


    // user: 'hello.lalten@gmail.com',
    // pass: 'Techugo@123' // generated ethereal password
    // albinjose.lal10@gmail.com
    // albin@lal10.com
  }
})

//send mail
let sendEmail = (data) => {
  let mailOptions = {
    from: templates.forgetpassword.from,
    to: data.email,
    subject: templates.forgetpassword.subject,
    html: templates.forgetpassword.text
  };
  mailModule.sendMail(mailOptions);
}

let validateEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

let im_forgetpassword = data => {
  let mailOptions = {
    from: templates.im_forgetpassword.from,
    to: data.email,
    subject: templates.im_forgetpassword.subject,
    html: mustache.render(templates.im_forgetpassword.text, data)
  };
  mailModule.sendMail(mailOptions);
};

let generateToken = () => {
  return Date.now() + Math.floor(Math.random() * 99999) + 1000;
};

let generateUid = () => {
  const Chance = require("chance");
  const chance = new Chance(Date.now() + Math.random());
  let randomStr = chance.string({
    length: 25,
    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  });
  return randomStr;
};

let entryDirectory = function (x) {
  let dir = usersImageUrl + x;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
};

let daysInThisMonth = function () {
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

let daysOverInThisMonth = function () {
  let now = new Date();
  let then = new Date(now.getFullYear(), now.getMonth(), 01);
  return Math.round((now - then) / (1000 * 60 * 60 * 24));
};

let createThumbnail = (type, videoFile) => {
  let videoPath = {};
  if (type == 'image') {

    videoPath['sourcePath'] = path.join(__dirname, '..', 'public', 'student_talent_images', videoFile);
    videoPath['thumbnailPath'] = path.join(__dirname, '..', 'public', 'student_talent_images');
  }
  if (type == 'video') {

    videoPath['sourcePath'] = path.join(__dirname, '..', 'video', videoFile);
    videoPath['thumbnailPath'] = path.join(__dirname, '..', 'thumbnail');
  }

  return new Promise((resolve, reject) => {
    const tg = new ThumbnailGenerator(videoPath);
    tg.generateOneByPercentCb(90, (err, result) => {
      resolve(result)
    });
  })
}

// let sendReceiptMail = (data) => {
//   let mailOptions = {
//     from: templates.ic_forgetpassword.from,
//     to: data.email,
//     subject: data.subject
//     html: data.html
//   };
//   mailModule.sendMail(mailOptions);
// }


let sendReceiptMail = (data) => {
  let mailOptions = {
    from: "hello.lalten@gmail.com",
    to: data.email,
    subject: data.subject,
    html: data.html
  };

  console.log('mailOptions',mailOptions)

  mailTransporter(mailOptions);
}

mailTransporter=(mailDetails)=>{
    transporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs',err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

let transform_image = async (image, name) => {
  let filename = name
  let typeMatch = image.match(/\.([^.]*)$/);
  let imageType = typeMatch[1].toLowerCase();
  let gm = require('gm')
    .subClass({ imageMagick: true });
  let MAX_WIDTH = 50
  let MAX_HEIGHT = 50
  gm(image).size(function (err, size) {
    let scalingFactor = Math.min(
      MAX_WIDTH / size.width,
      MAX_HEIGHT / size.height
    );
    let width = 500;
    let height = 500;
    this.resize(width, height)
      .toBuffer('png', function (err, buffer) {
        if (err) {
          console.log(err)
        } else {
          gm(buffer, 'image.png')
            .noise('laplacian')
            .write(path.join(__dirname, '..', 'thumbnail', `${filename}`), function (err) {
              if (err) {
                console.log(err);
              } else {
                return `${filename}`
              }
            });

        }
      })
  })
}

let messageSince = (dt) => {
  let startDate = new Date();
  let endDate = new Date(dt)
  let seconds = (startDate.getTime() - endDate.getTime()) / 1000;

  let minute = seconds / 60
  let txt = ""
  if (seconds < 60) {
    //just now
    txt = "Just now"
  } else if (minute > 60) {
    //hr
    let hr = Math.round(minute / 60)
    txt = hr + " hr"
    if (hr > 24) {
      // days
      let day = Math.round(hr / 24)
      txt = day + " day"
      if (day > 7) {
        let week = Math.round(day / 7)
        txt = week + " week"
        if (week > 1) {
          txt = week + " weeks"
        }
      }
    }

  } else {
    // min
    txt = Math.round(minute) + " min"
  }
  return txt
}

let gettime = (x) => {
  let today = new Date()
  let startYesterday = today.setDate(today.getDate() - x)

  let startFinal1 = new Date(startYesterday);
  let res = startFinal1.toISOString().split('T')
  let startFinal = res[0]
  let endFinal1 = new Date().toISOString().split('T')
  let endFinal = endFinal1[0] + ' 23:59:59'
  return { start_time: startFinal, end_time: endFinal };
}

let shorten_url = async url => {
  let TinyURL = require('tinyurl');
  const tiny_url = await TinyURL.shorten(url)
  return tiny_url
}

let onlyDate = () => {
  let dt = new Date().toISOString().split("T")[0]
  return dt
}

let dateDiff = (diff = 1) => {
  let dateObj = new Date();
  dateObj.setDate(dateObj.getDate() - diff);
  return dateObj
}

let htmlPdf = obj => {
  const { html } = obj

  let pdf = require('html-pdf');
  let options = { format: 'Letter' };

  return new Promise((resolve, reject) => {
    pdf.create(html, options).toBuffer( function(err, buffer) {
      if (err) reject(err);
      resolve(buffer);
    });
  })
}

let getRandomInt=(min, max)=>{
  return Math.floor(Math.random() * (max - min) + min)
}


let getUniqueCode=(type,table,columnName)=>{
  	return new Promise((resolve, reject) => {
    let query = `SELECT concat('${type}',RIGHT(CONCAT('00000',IFNULL(uniquecode,10000)+1),6)) as uniqueCode FROM (SELECT MAX(CAST(RIGHT(${columnName},6) AS UNSIGNED)) AS 'uniquecode' FROM ${table}) uniqueCode`;
    knex.raw(query).then((rows) => {
      let string=JSON.stringify(rows[0]);
      let code =  JSON.parse(string);
      resolve(code[0].uniqueCode)
    })
    .catch((err) => reject(err));
  });
}


let nullRemove=(result)=>{
    let result2=JSON.stringify(result, function(key, value) {
        if(value === null) return "";
          return value;
          });
      return JSON.parse(result2);
}


let sendOTP = (data) => {
  const request = require('request');

  const authkey ="335426AuT0vGnY5f0aba08P1";
  //amandeep
  const template_id2="5f6da09263732232f1132696"
  //ishu
  const template_id = "5f87f1b3647ed551335a3a1b";

	// const authkey =process.env.authkey;
  // const template_id = process.env.template_id;

  const mobile = data.mobile;
  const otp=data.otp;
  // const otp ="<#> OTP :" + data.otp" + for verification. LAL10 family welcomes you! eK1T98gNuVA "

  console.log("otp",otp)

  request(`https://api.msg91.com/api/v5/otp?authkey=${authkey}&template_id=${template_id}&mobile=91${mobile}&otp=${otp}`,
    { json: true }, (err, res, body) => {

      console.log("body",body)

		if (err) {
			return 0;
		} else {
      // if (res.body['status'] === 'success') return 1;
      return 1;
    }
	});
}


let subAdmintotalArtisan=(adminId)=>{
	return new Promise((resolve, reject) => {
    let query = `SELECT totalArtisan FROM subAdminRoleType WHERE isActive = 1 AND userId = '${adminId}'`;
    knex.raw(query).then((rows) => {
      let string=rows[0];
      if(Object.keys(string).length === 0){
        resolve();
      }else{
        resolve(string[0].totalArtisan)
      }
    })
    .catch((err) => reject(err));
  });
}

const sendNotif = (criteria) => {
  var FCM = require('fcm-node');
  //old server Key
  // var serverKey = `AAAAB7qgR9I:APA91bE6oDy03gPffSco5O3SbphQ1qvXU4xIw03m4OQmRXPwDOMeKQpIHorPdKsS_AJYYa88sQo-75jWYj-_EtFXSqJPbXb6yJ9sezVC7qodCjYgnbqajqZZ1MMQpSVKyiJKKHIL7-LY`

  // new Server Key 29-04-21
  var serverKey=`AAAA0hsXtBQ:APA91bHv-K0T8YMl67gnTGG0Zny5l6-3nNO7I5oSXP50YzA1zDNAgMBa_3kl3sGXoNJ_tLcVYlDs9cppd2fAhv8UAmVyvGlg5RCPbAZtcFnYsy4vhcH6E3BVtc2nfmx9dR44SqnRMXn_`;
  var fcm = new FCM(serverKey);

      if(criteria.gcmId){
      var message = {
        "to": criteria.gcmId,
        "data": {
        "is_incoming": "no",
        "sender": "admin",
        "time": new Date(),
        "body": criteria.description,
        "msg":criteria.description,
        "type":criteria.type,
        "title":criteria.title,
        },
        "priority": "high"
        };

      // console.log("message",message)

      fcm.send(message, function (err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
    }
 }

 let removeCache=()=>{
  client.keys("*", function (err, keys) {
    console.log("keys",keys)
      keys.forEach(function (key, pos) {
          // if(key.indexOf("m1")>=0){
            client.del(key, () => {})
          // }
    })
  });
}

module.exports = {
  removeCache:removeCache,
  subAdmintotalArtisan:subAdmintotalArtisan,
  sendNotif:sendNotif,
  messageSince: messageSince,
  gettime: gettime,
  transform_image: transform_image,
  sendEmail: sendEmail,
  createThumbnail: createThumbnail,
  statusCode: statusCode,
  statusMessage: statusMessage,
  generateToken: generateToken,
  generateUid: generateUid,
  entryDirectory: entryDirectory,
  randomValueBase64: randomValueBase64,
  daysInThisMonth: daysInThisMonth,
  daysOverInThisMonth: daysOverInThisMonth,
  errHandler: errHandler,
  validateEmail: validateEmail,
  sendReceiptMail: sendReceiptMail,
  send_notification: send_notification,
  shorten_url: shorten_url,
  onlyDate: onlyDate,
  dateDiff: dateDiff,
  htmlPdf: htmlPdf,
  role: role,
  type:type,
  lang:lang,
  saltRounds: saltRounds,
  im_forgetpassword: im_forgetpassword,
  getRandomInt:getRandomInt,
  getUniqueCode:getUniqueCode,
  nullRemove:nullRemove,
  baseUrl:baseUrl,
  sendOTP:sendOTP,
  LOGIN_SECRET:LOGIN_SECRET
};