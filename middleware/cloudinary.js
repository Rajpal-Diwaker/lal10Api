const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: "techugonew",
    api_key: "667778321984613",
    api_secret: "QiME8Or0K_ebGZo61UtBpWtIauc"
});

module.exports = {

    upload_image: async (req, res) => {
        // res_promises will be an array of promises
        let res_promises = req.files.map(file => new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(file.path, { use_filename: true, unique_filename: false }, function (error, result) {
                
                if (error) reject(error)
                else resolve(result.secure_url)
            })
        }))
        // Promise.all will fire when all promises are resolved 
        return Promise.all(res_promises)
    },

    upload_image2: async (req, res) => {
        // res_promises will be an array of promises
        let res_promises = req.map(file => new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(file.path, { use_filename: true, unique_filename: false }, function (error, result) {                
                if (error) reject(error)
                else resolve(result.secure_url)
            })
        }))
        // Promise.all will fire when all promises are resolved 
        return Promise.all(res_promises)
    }

}