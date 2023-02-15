
let util = require('../../Utilities/util'),
    artisan_dao = require('../../dao/v2/artisan'),
    user_dao = require('../../dao/v2/user'),
    bcrypt = require('bcrypt'),
    // uploadCloud = require('../../middleware/cloudinary'),
    uploadCloud = require('../../middleware/fileUploaderS3'),
    multiparty = require('multiparty');
    const knex = require("../../db/knex");

const MAX_IMG_SIZE = 12000000; // 12 MB

let add = util.errHandler(async (req, res) => {

    try {

        var form = new multiparty.Form();
        let uploadedFiles;
        form.parse(req, async function (err, fields, files) {

            // // console.log("fields.mobile",fields.mobile)
            // // console.log("fields.mobile[0]",fields.mobile[0])
            // // console.log("fields.email",fields.email)
            // // console.log("fields.email[0]",fields.email[0])



            if(fields.mobile.length > 0 && fields.mobile){
                if(fields.id){
                    let user = await knex("users as t1").join("artisan_details as t2", "t1.id", "t2.userId")
                                     .where("mobile",fields.mobile)
                                     .where("t2.id","!=",fields.id)
                                     .where("deleted",'1')
                                     .debug()
                    if(user.length){
                        res.send({ code: util.statusCode.FOUR_ZERO_ONE , message: util.statusMessage.MOBILE_EXIST})
                        return
                    }
                }else{
                    let user2 = await knex("users").where("mobile",fields.mobile).where("deleted",'1').debug()
                    if(user2.length){
                        res.send({ code: util.statusCode.FOUR_ZERO_ONE , message: util.statusMessage.MOBILE_EXIST})
                        return
                    }
                }
            }

            if(fields.email.length > 1 && fields.email ){
                // // console.log("ffields",fields)
                if(fields.id){
                    let user = await knex("users as t1").join("artisan_details as t2", "t1.id", "t2.userId")
                                     .where("email",fields.email)
                                     .where("t2.id","!=",fields.id)
                                     .where("deleted",'1')
                                     .debug()
                    if(user.length){
                        res.send({ code: util.statusCode.FOUR_ZERO_ONE , message: util.statusMessage.EMAIL_EXIST})
                        return
                    }
                }else{
                    let user2 = await knex("users").where("email",fields.email).where("deleted",'1').debug()
                    if(user2.length){
                        res.send({ code: util.statusCode.FOUR_ZERO_ONE , message: util.statusMessage.EMAIL_EXIST})
                        return
                    }
                }
            }

            let criteria=[];
            criteria['email'] = fields.email[0]
            criteria['name'] = fields.name[0]
            criteria['mobile'] = fields.mobile[0]
            criteria['state'] = fields.state[0]
            criteria['craft'] = fields.craft[0]
            criteria['product'] = fields.product[0]
            criteria['material'] = fields.material[0]


            if(fields.id)
                criteria['id'] = fields.id[0]
            else
                criteria['id'] = null

                if (files.kycImage && files.kycImage.length > 0){
                    // uploadedFiles = await uploadCloud.upload_image2(files.kycImage)
                    uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.kycImage, resolve, reject));
                    criteria['kycImage'] = uploadedFiles[0]
                 }

                if (files.artisanImage && files.artisanImage.length > 0){
                // let uploadedFiles2 = await uploadCloud.upload_image2(files.artisanImage)
                uploadedFiles2 = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.artisanImage, resolve, reject));
                    criteria['artisanImage'] = uploadedFiles2[0]
                }

                criteria['role'] = util.role('artisan')

                if(criteria['id'] && criteria['id']!='null'){

                }else{
                    const user = await user_dao.addUser(criteria)
                    const userId = user.id
                    criteria['userId'] = userId
                }

                await artisan_dao.add(criteria,  _ => {})
                res.send({ code: util.statusCode.OK , message: 'Artisan added successfully'})
    })

    } catch (error) {
        // console.log(error)
        res.send({ code: util.statusCode.FOUR_ZERO_ONE , message: error })
    }
})


const listing = util.errHandler(async (req, res) => {
    let result={}
    // try {
        let criteria = req.body
        let limit = req.query.limit || 0

        criteria.adminId=req.admin.id;
        criteria.roleId=req.admin.role;
        const resp = await util.subAdmintotalArtisan(req.admin.id);
        if(resp){
            criteria.subAdmintotalArtisan=resp;
        }

        result = await artisan_dao.getArtisan(criteria,limit)
        let total=await artisan_dao.totalArtisan(criteria)
        res.send({ code: util.statusCode.OK , message: util.statusMessage.SUCCESS,total,result })

    // } catch (error) {
    // res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    // }
})


const listingById = util.errHandler(async (req, res) => {

    try {
        const { id } = req.query
        let criteria = { id }
        let checkRecordId=await knex('artisan_details').where({id:id})

        if(checkRecordId.length){

            const result = await artisan_dao.getArtisanById(criteria)
            res.send({ code: util.statusCode.OK , message: util.statusMessage.SUCCESS, result })

        }else{

            res.send({ code: util.statusCode.FOUR_ZERO_ONE , message: "Invalid userId" })
        }


    } catch (error) {
        // console.log(error)
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    }
})


// ****   addManageListing   ****
const addManageListing = util.errHandler(async (req, res) => {
    let uploadedFiles,criteria={};
    var form = new multiparty.Form();
        form.parse(req, async function (err, fields, files) {

            // console.log("fields=====",fields)

             criteria['userId'] = req.admin.id;
             criteria['name'] = fields.name[0];
             criteria['type'] = fields.type[0];
             criteria['isActive'] = 1;
             criteria['hindiName'] = fields.hindiName[0];
             criteria['bangaliName'] = fields.bangaliName[0];
             criteria['gujratiName'] = fields.gujratiName[0];
            //  criteria['stateId'] = fields.stateId[0];

             if(fields.craftId)
                criteria['craftId'] = fields.craftId[0];

            if(fields.materialId)
                criteria['materialId'] = fields.materialId[0];

             if(fields.type[0]!="state")
                criteria['stateId'] = fields.stateId[0];

            if(fields.id)
                criteria['id']=fields.id[0]

             // console.log("criteria",criteria)

             if (files.manageListing && files.manageListing.length > 0){
            //  let uploadedFiles = await uploadCloud.upload_image2(files.manageListing);
                uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.manageListing, resolve, reject));
                criteria['image'] = uploadedFiles[0];
             }

            //   await artisan_dao.addManageListing({userId:req.admin.id,name:fields.name[0],type:fields.type[0],
            //                                     image:uploadedFiles[0],isActive:1});

            await artisan_dao.addManageListing(criteria);

           const code = util.statusCode.OK;
           const message = util.statusMessage.IMAGE_UPLOAD;

            res.send({ code: util.statusCode.OK, message: 'Listing added successfully' });
        })

});

let getManageListing = util.errHandler(async (req, res) => {
    resul={}

    let code = util.statusCode.OK;
    let message = util.statusMessage.SUCCESS;

    const { type } = req.query

    const result = await artisan_dao.getManageListing({type});
    res.status(code).send({ code, message, result });
  });

module.exports = {
    add,
    listing,
    addManageListing,
    getManageListing,
    listingById,

};
