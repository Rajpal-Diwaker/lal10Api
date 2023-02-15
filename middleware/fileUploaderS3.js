const { fork } = require("child_process");
const Path = require("path");

// LAL10
const AWS_BUCKET_NAME = `lal10bucketiam`;
const AWS_REGION = `ap-south-1`;
const AWS_ACCES_ID = `AKIAVVF5FAEJD5EZGD6Z`;
const AWS_SECRET_KEY = `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`;
const FILEURL = `https://lal10bucketiam.s3-ap-south-1.amazonaws.com/`;

//S3 Bucket
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: AWS_REGION,
  accessKeyId: AWS_ACCES_ID,
  secretAccessKey: AWS_SECRET_KEY,
});
let Jimp = require("jimp");
let zlib = require("zlib");
let path = require("path");
let s3Stream = require("s3-upload-stream")(s3);

let fs = require("fs");

//Multiple Image upload
let upload_image_abstraction = async (iterable, resolve, reject) => {
  let numChildren = iterable.length;
  const childrenResponse = {};
  for (let ix = 0; ix < numChildren; ix++) {
    const file = iterable[ix];
    const child = fork(Path.join(__dirname, "compress.js"));
    child.send([file, ix]);
    child.on("message", async ([filePath, ix]) => {
      console.log("got message from child");
      console.log("filepath", filePath);

      if (!(filePath instanceof Error)) {
        try {
          childrenResponse[filePath] = await new Promise((resolve, reject) =>
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            })
          );
        } catch (err) {
          console.log("error in reading file", err);
        }
      }
    });
    child.on("exit", async () => {
      numChildren -= 1;
      if (numChildren === 0) {
        clearTimeout(rejHandle);
        const imgUrls = await Promise.all(
          Object.keys(childrenResponse)
            .filter((key) => childrenResponse[key].byteLength)
            .map((key) =>
              new Promise((res, rej) => {
                const fileExtension = key.substring(key.lastIndexOf(".") + 1);
                const fileName = `LAL10_${new Date().getTime()}.${fileExtension}`;
                console.log("fileExtension", fileExtension, "key", key);
                return s3.putObject(
                  {
                    Bucket: AWS_BUCKET_NAME,
                    Key: fileName,
                    ContentType: fileExtension,
                    Body: childrenResponse[key],
                    ACL: "public-read",
                  },
                  (err, resp) => {
                    if (err) {
                      console.log("error in uploading to s3",err);
                      rej(err);
                    }
                    if (resp) {
                      console.log("response from aws",resp);
                      console.log("uploaded to s3");
                      console.log(`${FILEURL}${fileName}`);
                      res(`${FILEURL}${fileName}`);
                    }
                  }
                );
              }).catch((err) => "")
            )
        );
        await Promise.all(
          Object.keys(childrenResponse).map(
            (key) =>
              new Promise((resolve, reject) =>
                fs.unlink(key, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                })
              )
          )
        );
        resolve(imgUrls);
      }
    });
  }
  const rejHandle = setTimeout(reject, 20000);
  // process.exit(0);
};

// multiple upload
let upload_image = async (files, resolve, reject) =>
  await upload_image_abstraction(files.files, resolve, reject);

//single image upload
let upload_image2 = async (files, resolve, reject) =>
  await upload_image_abstraction(files, resolve, reject);

//upload PDF
let upload_pdf = async (files, res) => {
  let res_promises = files.image.map(
    (file) =>
      new Promise(async (resolve, reject) => {
        let fileExtension;
        fileExtension = file.originalFilename.replace(/^.*\./, "");
        fileExtension = fileExtension;

        // let fileData = await fs.readFile(file.path, "utf8", () => {});
        fileData = fs.readFileSync(file.path);
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
        // fileData = await fs.readFile(file.path, "utf8", () => {});
        fileData = fs.readFileSync(file.path);
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
