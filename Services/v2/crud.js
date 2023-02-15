let util = require("../../Utilities/util"),
crud_dao = require("../../dao/v2/crud"),
// uploadCloud = require('../../middleware/cloudinary'),
uploadCloud = require('../../middleware/fileUploaderS3'),
multiparty = require('multiparty');

const MAX_IMG_SIZE = 12000000; // 12 MB

const deleteEntity = util.errHandler(async (req, res) => {
  let criteria = { ...req.body }
  // console.log("333333333333333333333333333",criteria)

  await crud_dao.deleteEntity(criteria);
  res.send({ code: 200, message: 'Deleted successfully' });
});

const editEntity = util.errHandler(async (req, res) => {
    let criteria = { ...req.body }
    await crud_dao.editEntity(criteria);

    res.send({ code: 201, message: 'Edited successfully' });
});

const editData = util.errHandler(async (req, res) => {
  let criteria = { ...req.body }
  let result = await crud_dao.editData(criteria);

  if(req.body.type=='products')
    result.image = await crud_dao.getProductImages(result.id);
  else
    result.image =result.image

  res.send({ code: 200, message: 'Edited successfully', result });
});


const addEntity = util.errHandler(async (req, res) => {

  // try {

    const form = new multiparty.Form();
    let uploadedFiles,criteria={};

      form.parse(req, async function (err, fields, files) {

        if (files.link && files.link.length > 0){

          const fileSize=files.link[0].size;
          if(Number(fileSize) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Banner Maximum 12 Mb file can be uploaded"})
            return
          }

            // uploadedFiles = await uploadCloud.upload_image2(files.link)
            uploadedFiles = await new Promise((resolve, reject) => uploadCloud.upload_image2(files.link, resolve, reject));
            criteria['link'] = uploadedFiles[0]
           }

          criteria['modelType']=fields.modelType[0]
          criteria['type']=fields.type[0]

          if(fields.description)
              criteria['description']=fields.description[0]

          if(fields.title)
              criteria['title']=fields.title[0]

          if(fields.subtitle)
              criteria['subtitle']=fields.subtitle[0]

          if(fields.name)
              criteria['name']=fields.name[0]

          // if(fields.id)
          //   criteria['id']=id[0]

          if(fields.viewType)
            criteria['viewType']=fields.viewType[0]

          await crud_dao.addEntity(criteria);
          res.send({ code: 201, message: 'Inserted successfully' });
        })

  // } catch (error) {
  //   res.send({ code: 401, message: error });
  // }
});


const filterEntity = util.errHandler(async (req, res) => {
  try {
      let  { col, modelType, val } = req.query
      let  criteria = { col, modelType, val }
      let  result = await crud_dao.filterEntity(criteria)

      if(req.query.modelType == 'Products'){
          if (result.length) {
            for (index = 0; index < result.length; index++) {
              result[index]['image'] = await crud_dao.getProductImages(result[index].id);
            }
          }
      }

      res.send({ code: 200 , message: "List fetched successfully", result })
  } catch (error) {
      res.send({ code: 401 , message: "Some error while fetching list" })
  }
})

// const addInfographics = util.errHandler(async (req, res) => {

//   try {

//     const form = new multiparty.Form();
//     let uploadedFiles,criteria={};

//       form.parse(req, async function (err, fields, files) {

//           if(fields.type=='India'){
//             criteria['totalProducts']=fields.totalProducts[0]
//             criteria['unitsDelivered']=fields.unitsDelivered[0]
//             criteria['exportedTo']=fields.exportedTo[0]
//             criteria['country']=fields.type[0]
//             criteria['type']=fields.type[0]
//             criteria['state'] = fields.state[0]
//             criteria['totalArtisan'] = fields.totalArtisan[0]
//           }

//           if(fields.type!='India'){
//             criteria['description']=fields.description[0]
//             criteria['totalClients']=fields.totalClients[0]
//             criteria['totalProject']=fields.totalProject[0]
//             criteria['country']=fields.type[0]
//             criteria['type']=fields.type[0]
//             criteria['state'] = fields.state[0]
//           }


//         if (files.image && files.image.length > 0){
//               uploadedFiles = await uploadCloud.upload_image2(files.image)
//               criteria['image'] = uploadedFiles[0]
//               // console.log("uploadedFiles==",uploadedFiles)
//           }

//           await crud_dao.addInfographics(criteria);
//           res.send({ code: 201, message: 'Inserted successfully',result:criteria });
//         })

//   } catch (error) {
//     res.send({ code: 401, message: error });
//   }
// });


const addInfographics = util.errHandler(async (req, res) => {

  // try {

    const form = new multiparty.Form();
    let uploadedFiles,criteria={};

      form.parse(req, async function (err, fields, files) {

          if(fields.type=='India'){
            criteria['totalProducts']=fields.totalProducts[0]
            criteria['unitsDelivered']=fields.unitsDelivered[0]
            criteria['exportedTo']=fields.exportedTo[0]
            criteria['country']=fields.type[0]
            criteria['type']=fields.type[0]
            // criteria['state'] = fields.state[0]
            criteria['totalArtisan'] = fields.totalArtisan[0]
          }

          if(fields.type!='India'){
            criteria['insdustry']=fields.insdustry[0]
            criteria['totalCountries']=fields.totalCountries[0]
            criteria['totalClients']=fields.totalClients[0]
            criteria['totalProject']=fields.totalProjects[0]
            criteria['country']=fields.type[0]
            criteria['type']=fields.type[0]
            // criteria['state'] = fields.state[0]
          }


        if (files.image && files.image.length > 0){

          const fileSize=files.image[0].size;
          if(Number(fileSize) > Number(MAX_IMG_SIZE)){
            res.send({code:"402", message:"Maximum 12 Mb file can be uploaded"})
            return
          }

              // uploadedFiles = await uploadCloud.upload_infographics(files.image)
              uploadedFiles = await uploadCloud.upload_pdf(files)
              criteria['image'] = uploadedFiles[0]
              // console.log("uploadedFiles==",uploadedFiles)
          }


          // console.log("files=====",criteria)

          await crud_dao.addInfographics(criteria);
          res.send({ code: 201, message: 'Inserted successfully',result:criteria });
        })

  // } catch (error) {
  //   res.send({ code: 401, message: error });
  // }
});

const getInfographics = util.errHandler(async (req, res) => {
  try {
      let result= await crud_dao.getInfographics(req.query.type);
      res.send({ code: 200, message:util.statusMessage.SUCCESS,result });
  } catch (error) {
    res.send({ code: 401, message: error });
  }
});

const delInfographicsState = util.errHandler(async (req, res) => {
  try {
    const result= await crud_dao.delInfographicsState(req.query.id);
      res.send({ code: 201, message: 'Inserted successfully',result });
  } catch (error) {
    res.send({ code: 401, message: error });
  }
});



module.exports = {
  deleteEntity,
  editEntity,
  editData,
  addEntity,
  filterEntity,
  addInfographics,
  getInfographics,
  delInfographicsState
};
