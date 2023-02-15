let util = require('../../Utilities/util'),
    product_dao = require('../../dao/v2/product'),
    // uploadCloud = require('../../middleware/cloudinary'),
    uploadCloud = require('../../middleware/fileUploaderS3'),
    multiparty = require('multiparty');
    knex = require("../../db/knex");

    const MAX_IMG_SIZE = 12000000; // 12 MB

let add = util.errHandler(async (req, res) => {
    try {
        var form = new multiparty.Form();
        let uploadedFiles,criteria={};
        form.parse(req, async function (err, fields, files) {

            let { name, amount, inventoryQty, doableQty, craft, searchTags, material, description, categoryId,subcategoryId,subsubcategoryId,plive,id } = fields;

            criteria['id'] = id;
            criteria['userId'] = req.admin.id;
            criteria['isActive'] = 1;
            criteria['verified'] = '1';
            criteria['name'] = name;
            criteria['amount'] = amount;
            criteria['inventoryQty'] = inventoryQty.map(elem => (!elem? 0: elem));
            criteria['doableQty'] = doableQty;
            criteria['craft'] = craft;
            criteria['searchTags'] = searchTags;
            criteria['material'] = material;
            criteria['description'] = description;
            criteria['categoryId'] = categoryId;
            criteria['subcategoryId'] = subcategoryId;
            criteria['subsubcategoryId'] = subsubcategoryId.map(elem => (!elem? 0: elem));

            // if(fields.subsubcategoryId.length>1)
            //     criteria['subsubcategoryId'] = fields.subsubcategoryId[0];
            // else
            //     criteria['subsubcategoryId'] = 0;

            criteria['plive'] = fields.plive[0];
            criteria['pstateId'] = fields.pstateId[0]

            // console.log(criteria, "criteria")
            let productInfo = await product_dao.add(criteria)
            // // console.log(productInfo, "productInfo")

            if (files.files && files.files.length > 0)
                {

                    const fileSize=files.files[0].size;
                    if(Number(fileSize) > Number(MAX_IMG_SIZE)){
                      res.send({code:"401", message:"Maximum 12 Mb file can be uploaded"})
                      return
                    }

                    // uploadedFiles = await uploadCloud.upload_image(files)
                    uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image(files, resolve, reject));

                    let updateImageQuery = []
                    for (const key in uploadedFiles) {
                        let temp = {
                            productId: productInfo.id ? productInfo.id:id,
                            image: uploadedFiles[key],
                            userId: req.admin.id
                        }
                        updateImageQuery.push(temp)
                    }

                    await product_dao.uploadImage(updateImageQuery)
            }

            if(fields.image_ids)
            {
                product_dao.removeImage(fields.image_ids)
            }

            // res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS });

            if(id){

                let checkProductPublish=await knex('products').where({isActive:'1',deleted:'1',userId:'1',id:id})

                if(checkProductPublish.length){
                    // console.log("checkProductPublish admin product",checkProductPublish)
                    res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS });
                }else{
                    // console.log("checkProductPublish not admin product")
                    let checkProductPublish2=await knex('products').where({isActive:'1',deleted:'1',publish:1,id:id})
                    if(!checkProductPublish2.length)
                        res.send({ code: util.statusCode.OK, message: "Your changes are being saved but it needs to be approved from Artisan. It will reflect after that" });
                    else
                        res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS });
                }
                // // console.log("productInfo",productInfo,"checkProductPublish",checkProductPublish)
            }else
                res.send({ code: util.statusCode.OK, message: util.statusMessage.SUCCESS });
        })
    } catch (error) {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    }
})

let listing = util.errHandler(async (req, res) => {
    try {

        let criteria = req.body

        criteria.adminId=req.admin.id;
        criteria.roleId=req.admin.role;
        const resp = await util.subAdmintotalArtisan(req.admin.id);
        if(resp){
            criteria.subAdmintotalArtisan=resp;
        }

        let result = await product_dao.listing(criteria)
        let total = await product_dao.totalProduct(criteria)

        res.send({ code: util.statusCode.OK , message: util.statusMessage.SUCCESS, total,result })

    } catch (error) {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    }
})

let changeStatus = util.errHandler(async (req, res) => {
    try {
        const { id, isActive } = req.body
        await product_dao.changeStatus({ id, isActive })
        res.send({ code: util.statusCode.OK , message: util.statusMessage.SUCCESS })
    } catch (error) {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    }
})

let ProductChangeStatus = util.errHandler(async (req, res) => {
    try {
        await product_dao.ProductChangeStatus(req.body)
        res.send({ code: util.statusCode.OK , message: util.statusMessage.SUCCESS })
    } catch (error) {
        res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    }
})



module.exports = {
    add,
    listing,
    ProductChangeStatus,
    changeStatus,
};
