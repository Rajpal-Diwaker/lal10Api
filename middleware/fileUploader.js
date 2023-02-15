 
let multer  = require('multer'),
path = require('path'),
crypto = require('crypto'),
fileExtension = require("file-extension");

let storage = multer.diskStorage({
    destination:  (req, file, cb) => {
      cb(null, path.resolve(__dirname, '../public/userpic'))
    },
    filename:  (req, file, cb) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(
            null,
            raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
        );
    });
    }
})

let upload = multer({ storage })

let cpUpload = upload.fields([
    { name: 'product[]', maxCount: 20 },
    { name: 'uploads[]', maxCount: 50 },
    { name: 'artisanImage', maxCount: 1 },
    { name: 'kycImage', maxCount: 1 },
    { name: 'newsfeed', maxCount: 1 },
    { name: 'manageListing', maxCount: 1 },
    { name: 'onboarding', maxCount: 1 },
    { name: 'loginOnboarding', maxCount: 1 },
    { name: 'link', maxCount: 1 },
    { name: 'chat', maxCount: 10 },
    { name: 'enquiryPic', maxCount: 1 }
])

module.exports = cpUpload;
