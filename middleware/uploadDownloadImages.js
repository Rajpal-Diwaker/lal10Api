const Path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');

const {downloadFile} = require('./driveApi');
const {httpDownload} = require('./httpDownload')
const {storeOnDisk} = require('./helpers');
const {dlFilePath} = require('./compress')

// LAL10
const AWS_BUCKET_NAME = `lal10bucketiam`
const AWS_REGION = `ap-south-1`
const AWS_ACCES_ID = `AKIAVVF5FAEJD5EZGD6Z`
const AWS_SECRET_KEY = `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`
const FILEURL=`https://lal10bucketiam.s3-ap-south-1.amazonaws.com/`;

//S3 Bucket
// AWS.config.loadFromPath('./awsConfig.json')

AWS.config.update({
    accessKeyId:AWS_ACCES_ID,
    secretAccessKey: AWS_SECRET_KEY,
    "region": AWS_REGION
});

const S3_PARAMS = {
    Bucket: AWS_BUCKET_NAME,
    ACL: 'public-read',
    ContentType: 'jpeg'
}

let s3 = new AWS.S3();
// s3.config.region = AWS_REGION;

const driveRegex = /drive.google.com/;
const dropBoxRegex = /dropbox.com/;

export const downloadImages = async (data, authClient) => {
    const restrictedImages = [];
    const dataToWrite = await Promise.all(data.map(async datum => {
        const imgUrl = datum.mainImgUrl || '';
        const otherImgUrl = datum.otherImgUrl || '';

        const rootName = `${datum.SKU}`
            .replace(/\s/g, '-');

        const imgName = rootName + '_main_img.jpg';
        datum.mainImagePath = await performDownload(imgUrl, imgName, authClient);
        if (datum.mainImagePath === null) {
            restrictedImages.push(datum);
            return null;
        }

        if(otherImgUrl){
            datum.otherImagePath = await Promise.all(otherImgUrl.split(',').map(async(oIm, ix) => {
                oIm = oIm.trim();
                const otherImgName = rootName + '_' + (++ix) + '_other_img.jpg';
                return await performDownload(oIm, otherImgName, authClient);
            }));
        } else {
            datum.otherImagePath = [];
        }
        return datum;
    }));
    return [dataToWrite.filter(datum => datum), restrictedImages];
}

const performDownload = async (link, name, authClient = null) => {
    const driveMatch = link.match(driveRegex);
    const dropboxMatch = driveMatch ? null : link.match(dropBoxRegex);
    let mainId, dropboxUrl;
    if (driveMatch) {
        mainId = link.length ? link.split('/')[5] : null;
    } else if (dropboxMatch) {
        dropboxUrl = link.slice(0, link.length - 1) + '1';
    }
    let bin;
    try {
        bin = mainId ? await downloadFile(mainId, authClient) :
            dropboxUrl ? await httpDownload(dropboxUrl) : null;
    } catch (err) {
        console.error('error in downloading img');
        console.error(err);
        return null;
    }
    if (bin) {
        const filePath = Path.join(dlFilePath, name)
        await storeOnDisk(bin, filePath);
        return filePath;
    }
}

export const uploadImageToS3 = async(imgPath, options = S3_PARAMS) => {
    const pathArr = imgPath.split('/');
    const imgName = pathArr[pathArr.length - 1];
    options.Key = imgName;
    options.Body = await new Promise((resolve, reject) =>
        fs.readFile(imgPath, (err, data) => {
            if(err){
                reject(err);
            } else{
                resolve(data);
            }
        }))
    await new Promise((resolve, reject) =>
        s3.upload(options, (err, data) => {
            if (err) {
                reject(err)
            } else {
                console.log(`${FILEURL}${imgName} uploaded`);
                resolve(`${FILEURL}${imgName}`);
            }
        }));
};
