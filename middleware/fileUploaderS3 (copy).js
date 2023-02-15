// LAL10
const AWS_BUCKET_NAME = `lal10bucketiam`;
const AWS_REGION = `mumbai`;
const AWS_ACCES_ID = `AKIAVVF5FAEJD5EZGD6Z`;
const AWS_SECRET_KEY = `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`;
const FILEURL = `https://lal10bucketiam.s3-ap-south-1.amazonaws.com/`;

// const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
// const AWS_REGION = process.env.AWS_REGION
// const AWS_ACCES_ID = process.env.AWS_ACCES_ID
// const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
// const FILEURL=process.env.AWS_FILEURL
// console.log("AWS_BUCKET_NAME===",process.env)

//S3 Bucket
const AWS = require("aws-sdk");
let s3 = new AWS.S3();
let Jimp = require("jimp");
let zlib = require("zlib");
let path = require("path");
let s3Stream = require("s3-upload-stream")(s3);

s3.config.update({
  accessKeyId: AWS_ACCES_ID,
  secretAccessKey: AWS_SECRET_KEY,
});

s3.config.region = AWS_REGION;
let fs = require("fs");

// //Multiple Image upload
// let upload_image = async (files, res) => {
//   let res_promises = files.files.map(
//     (file) =>
//       new Promise(async (resolve, reject) => {
//         let fileExtension;
//         fileExtension = file.originalFilename.replace(/^.*\./,"");
//         let fileName = "LAL10_" + new Date().getTime() + fileExtension;

//         const img = await Jimp.read(file.path);
//         img
//           .quality(50)
//           .write(file.path);

// 		    let read = fs.createReadStream(file.path);
//         let upload = s3Stream.upload({
//           Bucket: AWS_BUCKET_NAME,
//           Key: fileName,
//           ACL: "public-read",
//           ContentType: file.type,
//           CacheControl: "max-age=31536000,immutable",
//           Expires: 300,
//         });

//         upload.maxPartSize(20971520); // 20 MB
//         upload.concurrentParts(5);

//         upload.on("error", function (error) {
//           // console.log(error);
//         });

//         upload.on("part", function (details) {
//           // console.log(details);
//         });

//         upload.on("uploaded", async (details) => {
//           console.log(details.Location);
//           resolve(details.Location);
//         });

//         read.pipe(upload);
//       })
//   );
//   return Promise.all(res_promises);
//   // process.exit(0);
// };

//Multiple Image upload
let upload_image = async (files, res) => {
	let res_promises = files.files.map(
		file => new Promise((resolve, reject) => {
         Jimp.read(file.path, function (err, data) {
           if (err) resolve(err);

          //  data.resize(400,400, Jimp.AUTO).quality(50).write(file.path,()=>{
           data.resize(500,500, Jimp.AUTO)
          data.write(file.path,()=>{
           var stream = fs.createReadStream(file.path);
           let fileName = 'LAL10_' + new Date().getTime()+ '.jpg';
           s3.putObject({
               Bucket: AWS_BUCKET_NAME,
               Key: `${fileName}`,
               ContentType: 'image/jpg',
               Body: stream,
               ACL: 'public-read',
               Metadata: {
                 'Content-Type': 'image/jpeg'
               }
             }, function (resp) {
              let url = FILEURL+`${fileName}`;
        			console.log("url===",url);
              resolve(url)
           });
        });
      });
	}))
	return Promise.all(res_promises);
	// process.exit(0);
}


// //single image upload
// let upload_image2 = async (files, res) => {
//   console.log("files  ===>>", files);
//   let res_promises = files.map(
//     (file) =>
// 	new Promise(async (resolve, reject) => {
//         let fileExtension;
//         fileExtension = file.originalFilename.replace(/^.*\./, "");
//         let fileName = "LAL10_" + new Date().getTime() + fileExtension;

//         const img = await Jimp.read(file.path);
//         img
//           .quality(50) // set JPEG quality
//           .write(file.path);

// 		   var read = fs.createReadStream(file.path);
//         var upload = s3Stream.upload({
//           Bucket: AWS_BUCKET_NAME,
//           Key: fileName,
//           ACL: "public-read",
//           ContentType: file.type,
//           CacheControl: "max-age=31536000,immutable",
//           Expires: 300,
//         });

//         upload.maxPartSize(20971520); // 20 MB
//         upload.concurrentParts(5);

//         upload.on("error", function (error) {
//           // console.log(error);
//         });

//         upload.on("part", function (details) {
//           // console.log(details);
//         });

//         upload.on("uploaded", async (details) => {
//           console.log(details.Location);
//           resolve(details.Location);
//         });

//         read.pipe(upload);
//       })
//   );
//   return Promise.all(res_promises);
//   // process.exit(0);
// };

//single image upload
let upload_image2 = async (files, res) => {
  console.log("files  ===>>", files);
  let res_promises = files.map(
    (file) =>
	new Promise(async (resolve, reject) => {

        Jimp.read(file.path, function (err, data) {
          if (err) resolve(err);

          // data.resize(400,400, Jimp.AUTO).quality(100).write(file.path,()=>{
          data.resize(500,500, Jimp.AUTO)
          data.write(file.path,()=>{
          var stream = fs.createReadStream(file.path);
          let fileName = 'LAL10_' + new Date().getTime()+ '.jpg';

          s3.putObject({
              Bucket: AWS_BUCKET_NAME,
              Key: `${fileName}`,
              ContentType: 'image/jpg',
              Body: stream,
              ACL: 'public-read',
              Metadata: {
                'Content-Type': 'image/jpeg'
              }
            }, function (resp) {
             let url = FILEURL+`${fileName}`;
             console.log("url===",url);
             resolve(url)
          });
       });
     });
   })
  )
  return Promise.all(res_promises);
  // process.exit(0);
};


// //upload PDF
// let upload_pdf = async (files, res) => {
//   let res_promises = files.image.map(
//     (file) =>
//       new Promise(async (resolve, reject) => {
//         let fileExtension;
//         fileExtension = file.originalFilename.replace(/^.*\./, "");
//         fileExtension = fileExtension;

//         let fileData = await fs.readFile(file.path, "utf8", () => {});

//         fileData = fs.readFileSync(file.path);
//         let fileName = "LAL10_" + new Date().getTime();

//         let params = {
//           Bucket: AWS_BUCKET_NAME,
//           Key: `${fileName}.${fileExtension}`,
//           Body: fileData,
//           ContentType: file.type,
//           ACL: "public-read",
//         };

//         s3.putObject(params, function (err, pres) {
//           let url = FILEURL + `${fileName}.${fileExtension}`;
//           if (err) resolve(err);
//           else resolve(url);
//         });
//     })
//   );
//   return Promise.all(res_promises);
// };


//upload PDF
let upload_pdf = async (files, res) => {
  let res_promises = files.image.map(
    (file) =>
      new Promise(async (resolve, reject) => {
        let fileExtension;
        fileExtension = file.originalFilename.replace(/^.*\./, "");
        fileExtension = fileExtension;

        let fileData = fs.createReadStream(file.path);
        let fileName = "LAL10_" + new Date().getTime();

        let params = {
          Bucket: AWS_BUCKET_NAME,
          Key: `${fileName}.${fileExtension}`,
          Body: fileData,
          ContentType: file.type,
          ACL: "public-read",
        };
        s3.putObject(params, function (err, pres) {
          let url = FILEURL + `${fileName}.${fileExtension}`;
          if (err) resolve(err);
          else resolve(url);
        });
    })
  );
  return Promise.all(res_promises);
};

//single image upload
let upload_infographics = async (files, res) => {
  console.log("files  ===>>", files);

  let res_promises = files.map(
    (file) =>
      new Promise(async (resolve, reject) => {
        let fileExtension;
        fileExtension = file.originalFilename.replace(/^.*\./, "");
        fileExtension = fileExtension;

        let fileData = fs.createReadStream(file.path);
        let fileName = "LAL10_" + new Date().getTime();

        let params = {
          Bucket: AWS_BUCKET_NAME,
          Key: `${fileName}.${fileExtension}`,
          Body: fileData,
          ContentType: file.type,
          ACL: "public-read",
        };

        s3.putObject(params, function (err, pres) {
          let url = FILEURL + `${fileName}.${fileExtension}`;
          if (err) resolve(err);
          else resolve(url);
        });
      })
  );

  return Promise.all(res_promises);
};

module.exports = {
  upload_image2: upload_image2,
  upload_infographics: upload_infographics,
  upload_image: upload_image,
  upload_pdf: upload_pdf,
};








