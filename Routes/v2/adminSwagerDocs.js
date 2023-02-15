
// 1
/**
 * @swagger
 * /api/v2/user/login:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: login
 *     summary: Admin login to the panel  -[1]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"admin@gmail.com","password":"123456","webToken":"sdbhfbjsdfbjkdbsfkj"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Login successfully
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             token:
*               type: string
*               description: token.
*             menus:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 title:
*                   type: string
*                   description: title.
*                 isActive:
*                   type: integer
*                   description: isActive
*                 createdAt:
*                   type: string
*                   description: createdAt.
*       401:
*         description: Error.
 */

 // 2
/**
* @swagger
* /api/v2/user/options:
*   get:
*     tags:
*       - ADMIN V2 API LIST
*     name: options
*     summary: getting a craft,products,material and state list based on type [type => [craft,products,material,state]  -[2]
*     consumes:
*       - application/json
 *     parameters:
 *       - name: type
 *         description: Request sample type=products [type => [craft,products,material,state]
 *         in: query
 *         required: true
 *         type: string
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             name:
*               type: string
*               description: name.
*       401:
*         description: Bad Request
*/


// 3
/**
 * @swagger
 * /api/v2/artisan/add:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: add
 *     summary:  Adding a New Artisan [passing authorization Header also] -[3]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Enter admin Id.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: kycImage
 *         description: Choose kyc image
 *         in: formData
 *         required: true
 *         type: file
 *       - name: artisanImage
 *         description: Choose artisan image
 *         in: formData
 *         required: true
 *         type: file
 *       - name: name
 *         description: Enter artisan name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: Enter artisan email .
 *         in: formData
 *         required: true
 *         type: string
 *       - name: mobile
 *         description: Enter artisan mobile.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: state
 *         description: Choose State  [passing a state name]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: craft
 *         description: Choose your craft [it’s should be multiple by comma seprated (1,2,3 etc)].
 *         in: formData
 *         required: true
 *         type: string
 *       - name: material
 *         description: Choose your material [it’s should be multiple by comma seprated (1,2,3 etc)].
 *         in: formData
 *         required: true
 *         type: string
 *       - name: product
 *         description: Choose your product [it’s should be multiple by comma seprated (1,2,3 etc)].
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Artisan added successfully.
*       401:
*         description: Error
 */

 // 4
/**
* @swagger
* /api/v2/artisan/listing:
*   post:
*     tags:
*       - ADMIN V2 API LIST
*     name: listing
*     summary: getting a artisan listing [passing authorization Header also]  -[4]
*     consumes:
*       - application/json
*     parameters:
*       - name: limit
*         description: Request sample  ex-10 [optional]
*         in: query
*         required: false
*         type: string
*       - name: offset
*         description: Request sample  ex-0 [optional]
*         in: query
*         required: false
*         type: string
*       - name: search
*         description: Request sample  ex-ABC [optional]
*         in: query
*         required: false
*         type: string
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             name:
*               type: string
*               description: name.
*             artisanImage:
*               type: string
*               description: artisanImage.
*             mobile:
*               type: string
*               description: mobile.
*             stateName:
*               type: string
*               description: stateName.
*             email:
*               type: string
*               description: email.
*             isActive:
*               type: string
*               description: isActive.
*             userId:
*               type: string
*               description: userId.
*             role:
*               type: string
*               description: role.
*             UserCraft:
*               type: string
*               description: UserCraft.
*             Userproducts:
*               type: string
*               description: Userproducts.
*             UserMaterial:
*               type: string
*               description: UserMaterial.
*             totalEnq:
*               type: string
*               description: totalEnq.
*             totalOrders:
*               type: string
*               description: totalOrders.
*             craft:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 name:
*                   type: string
*                   description: name.
*             material:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 name:
*                   type: string
*                   description: name.
*             product:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 name:
*                   type: string
*                   description: name.
*       401:
*         description: Bad Request
*/



 // 5
/**
* @swagger
* /api/v2/artisan/listingById:
*   get:
*     tags:
*       - ADMIN V2 API LIST
*     name: listing
*     summary: getting a product listingById [get paramerts => [id=10] -[5]
*     consumes:
*       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample user id of artisan  ex-13
 *         in: query
 *         required: true
 *         type: string
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             name:
*               type: string
*               description: name.
*             artisanImage:
*               type: string
*               description: artisanImage.
*             mobile:
*               type: string
*               description: mobile.
*             stateName:
*               type: string
*               description: stateName.
*             email:
*               type: string
*               description: email.
*             isActive:
*               type: string
*               description: isActive.
*             userId:
*               type: string
*               description: userId.
*             role:
*               type: string
*               description: role.
*             UserCraft:
*               type: string
*               description: UserCraft.
*             Userproducts:
*               type: string
*               description: Userproducts.
*             UserMaterial:
*               type: string
*               description: UserMaterial.
*             totalEnq:
*               type: string
*               description: totalEnq.
*             totalOrders:
*               type: string
*               description: totalOrders.
*             craft:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 name:
*                   type: string
*                   description: name.
*             material:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 name:
*                   type: string
*                   description: name.
*             product:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                   description: Record Id.
*                 name:
*                   type: string
*                   description: name.
*       401:
*         description: Bad Request
*/

// 6
/**
 * @swagger
 * /api/v2/artisan/addManageListing:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addManageListing
 *     summary:  Adding a new sample products,craft,material and state [passing authorization Header also] -[6]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Enter name of the ENTITIES.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: manageListing
 *         description: Choose manageListing image
 *         in: formData
 *         required: true
 *         type: file
 *       - name: isActive
 *         description: enter the 1
 *         in: formData
 *         required: true
 *         type: string
 *       - name: type
 *         description: choose type  ex-[craft,products,state,material].
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       201:
*         description: Listing added successfully.
*       401:
*         description: Error
 */



 // 7
/**
* @swagger
* /api/v2/artisan/getManageListing:
*   get:
*     tags:
*       - ADMIN V2 API LIST
*     name: listing
*     summary: Adding a new sample products,craft,material and state  [passing authorization Header also] -[7]
*     consumes:
*       - application/json
 *     parameters:
 *       - name: type
 *         description: Request sample user id of artisan  ex-[products,craft,material and state]
 *         in: query
 *         required: true
 *         type: string
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             name:
*               type: string
*               description: name.
*             type:
*               type: string
*               description: type.
*             isActive:
*               type: string
*               description: isActive.
*             created_at:
*               type: string
*               description: created_at.
*             image:
*               type: string
*               description: image.
*             userId:
*               type: string
*               description: userId.
*             deleted:
*               type: string
*               description: deleted.
*       401:
*         description: Bad Request
*/


 // 8
/**
* @swagger
* /api/v2/products/listing:
*   post:
*     tags:
*       - ADMIN V2 API LIST
*     name: listing
*     summary: Adding a new sample products,craft,material and state  [passing authorization Header also] -[8]
*     consumes:
*       - application/json
*     parameters:
 *       - name: Request
 *         description: Request sample {"plive":"0","page":"","userId":"1"}
 *         in: body
 *         required: true
 *         type: object
*     responses:
*       200:
*         description: Product list fetched successfully
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             name:
*               type: string
*               description: name.
*             type:
*               type: string
*               description: type.
*             isActive:
*               type: string
*               description: isActive.
*             created_at:
*               type: string
*               description: created_at.
*             image:
*               type: string
*               description: image.
*             userId:
*               type: string
*               description: userId.
*             deleted:
*               type: string
*               description: deleted.
*       401:
*         description: Bad Request
*/


// 9
/**
 * @swagger
 * /api/v2/products/add:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: add
 *     summary:  Adding a new sample products [passing authorization Header also] -[9]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Enter name of the product.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         description: Enter amount of the product.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: inventoryQty
 *         description: Enter inventoryQty of the product.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: doableQty
 *         description: Enter doableQty of the product.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: files
 *         description: Choose image of the product.
 *         in: formData
 *         required: true
 *         type: file
 *       - name: craft
 *         description: Choose craft of product it should be multiple [ex-1,2,3,4]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: searchTags
 *         description: Enter the product searchTags values
 *         in: formData
 *         required: true
 *         type: string
 *       - name: material
 *         description: Enter the product material values
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: enter the product description
 *         in: formData
 *         required: true
 *         type: string
 *       - name: categoryId
 *         description: Choosen product category
 *         in: formData
 *         required: true
 *         type: string
 *       - name: plive
 *         description: enter plive product live on website [plive->1,0 (1->live,0->notlive)]
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Product add successfully
*       401:
*         description: Error.
 */


// 10
/**
 * @swagger
 * /api/v2/products/changeStatus:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: changeStatus
 *     summary: Activate and deactivate the product [passing authorization Header also]  -[10]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","isActive":"0"} [isActive=1->active,0->inactive] [id=productId]
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Product status changed successfully
*       401:
*         description: Error.
 */

// 11
/**
 * @swagger
 * /api/v2/admin/getCategory:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getCategory
 *     summary: get a category list -[11]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title
*             image:
*               type: string
*               description: image
*             parentId:
*               type: integer
*               description: parentId
*             banner_image:
*               type: string
*               description: banner_image
*             totalProduct:
*               type: string
*               description: totalProduct
*             totalsubCategoryId:
*               type: string
*               description: totalsubCategoryId
*             isBestSelling:
*               type: string
*               description: isBestSelling
*             deleted:
*               type: string
*               description: deleted
*             isActive:
*               type: string
*               description: isActive
*             createdAt:
*               type: string
*               description: createdAt
*       401:
*         description: Error.
 */


// 12
/**
 * @swagger
 * /api/v2/crud/editData:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editData
 *     summary: get a category list [passing authorization Header also]  -[12]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"products","id":"1"} [id=productId]
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

// 13
/**
 * @swagger
 * /api/v2/user/addNewsfeed:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addNewsfeed
 *     summary: Adding a New newsfeed [passing authorization Header also]  -[13]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id of news feed [only edit case it should be present]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: title
 *         description: title of New feed
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: description of news feed
 *         in: formData
 *         required: true
 *         type: string
 *       - name: url
 *         description: url of News feed
 *         in: formData
 *         required: true
 *         type: string
 *       - name: newsfeed
 *         description: choose new feed file
 *         in: formData
 *         required: true
 *         type: file
 *       - name: type
 *         description: enter type ex- web ,app
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 14
/**
 * @swagger
 * /api/v2/user/edit:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: edit
 *     summary: Editing a New newsfeed [passing authorization Header also]  -[14]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"Newsfeed","isPublished":"0","id":"1"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       201:
*         description: Edited successfully
*       401:
*         description: Error.
 */



// 15
/**
 * @swagger
 * /api/v2/user/delete:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: delete
 *     summary: Deleting a newsfeed  [passing authorization Header also] -[15]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"Newsfeed","id":"1"}  [type=Users,Newsfeed]
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       201:
*         description: Deleted successfully
*       401:
*         description: Error.
 */


// 16
/**
 * @swagger
 * /api/v2/user/listingOnboarding:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: listingOnboarding
 *     summary: Deleting a newsfeed [passing authorization Header also]  -[16]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: Request sample {"type":"web"}  [type=web,app]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       201:
*         description: success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             ranking:
*               type: string
*               description: ranking
*             image:
*               type: string
*               description: image
*             description:
*               type: string
*               description: description
*             language:
*               type: string
*               description: language
*             created_at:
*               type: string
*               description: created_at
*             url:
*               type: string
*               description: url
*             type:
*               type: string
*               description: type
*       401:
*         description: Error.
 */


// 17
/**
 * @swagger
 * /api/v2/user/statusOnboarding:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: statusOnboarding
 *     summary: statusOnboarding [passing authorization Header also]  -[17]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"isActive":"0","id":"1"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       201:
*         description: Success
*       401:
*         description: Error.
 */

// 18
/**
 * @swagger
 * /api/v2/user/addEntity:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addEntity
 *     summary: addEntity [passing authorization Header also]  -[18]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"Testimonial","modelType":"CMS","description":"description","title":"description","link":"addbjada.com","name":"ABCCC"}   [modelType=About us,Faq,Testimonial,Patch-message,Banner,USP,Industries ]
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Inserted successfully
*       401:
*         description: Error.
 */


// 19
/**
 * @swagger
 * /api/v2/user/changeStatus:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: changeStatus
 *     summary: changeStatus inactive record [passing authorization Header also]  -[19]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"status":"0","userId":"1"}   [status==(0->active,1->inactive)]
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 20
/**
 * @swagger
 * /api/v2/admin/getEnquiries:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getEnquiries
 *     summary: Getting A Enquiries list [passing authorization Header also]  -[20]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: Request sample {"type":"3"}  [type==(1->lead Enquiry,2->Email Enquiry,3->website Enquiry)]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             uniqueId:
*               type: string
*               description: uniqueId
*             productId:
*               type: string
*               description: productId
*             title:
*               type: string
*               description: title
*             typeofEnquiry:
*               type: string
*               description: typeofEnquiry
*             isGenrate:
*               type: string
*               description: isGenrate
*             name:
*               type: string
*               description: name
*             email:
*               type: string
*               description: email
*             mailBy:
*               type: string
*               description: mailBy
*             mailSubject:
*               type: string
*               description: mailSubject
*             mailBody:
*               type: string
*               description: mailBody
*             created_at:
*               type: string
*               description: created_at
*       401:
*         description: Error.
 */


// 21
/**
 * @swagger
 * /api/v2/admin/getEnquiryById:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getEnquiryById
 *     summary: Getting A Enquiries details based on enquiryId [passing authorization Header also]  -[21]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"3"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             uniqueId:
*               type: string
*               description: uniqueId
*             productId:
*               type: string
*               description: productId
*             title:
*               type: string
*               description: title
*             description:
*               type: string
*               description: description
*             isGenrate:
*               type: string
*               description: isGenrate
*             name:
*               type: string
*               description: name
*             email:
*               type: string
*               description: email
*             mailBy:
*               type: string
*               description: mailBy
*             mailSubject:
*               type: string
*               description: mailSubject
*             mailBody:
*               type: string
*               description: mailBody
*             created_at:
*               type: string
*               description: created_at
*             craftId:
*               type: string
*               description: craftId
*             materialId:
*               type: string
*               description: materialId
*             update_status:
*               type: string
*               description: update_status
*             requestTo:
*               type: string
*               description: requestTo
*             attachment:
*               type: string
*               description: attachment
*       401:
*         description: Error.
 */

// 22
/**
 * @swagger
 * /api/v2/admin/editEnquiry:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editEnquiry
 *     summary: Editing or Genrate A Enquiries [passing authorization Header also]  -[22]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample { "id":"2","craftId":"209","requestTo":"1","type":"3","mailBy":"mailBy","mailSubject":"mailSubject","mailBody":"mailBody"} [requestTo==(1->Assign open to all,2->Assign to particuler group))] [type==(1->lead Enquiry,2->Email Enquiry,3->website Enquiry))]
 *         in: query
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 23
/**
 * @swagger
 * /api/v2/admin/getWebUser:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getWebUser
 *     summary: getting website User list [passing authorization Header also]  -[23]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample { "search":"test","limit":"1","offset":"0"} //optional serach parameters
 *         in: query
 *         required: false
 *         type: object
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             userId:
*               type: integer
*               description: userId
*             mobile:
*               type: string
*               description: mobile
*             email:
*               type: string
*               description: email
*             artisanName:
*               type: string
*               description: artisanName
*             isActive:
*               type: string
*               description: isActive
*             type:
*               type: string
*               description: type
*             postalCode:
*               type: string
*               description: postalCode
*             customerImportant:
*               type: string
*               description: customerImportant
*             is_verified:
*               type: string
*               description: is_verified
*             role:
*               type: string
*               description: role
*             deleted:
*               type: string
*               description: deleted
*             categroyId:
*               type: string
*               description: categroyId
*             categoryName:
*               type: object
*               properties:
*                 categoryId:
*                  type: integer
*                  description: categoryId.
*                 categoryName:
*                  type: string
*                  description: categoryName.
*       401:
*         description: Error.
 */


// 24
/**
 * @swagger
 * /api/v2/admin/getWebUserById:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getWebUserById
 *     summary: Getting website User details besed on id [passing authorization Header also]  -[24]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample { "id":"10"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             userId:
*               type: integer
*               description: userId
*             mobile:
*               type: string
*               description: mobile
*             email:
*               type: string
*               description: email
*             artisanName:
*               type: string
*               description: artisanName
*             country:
*               type: string
*               description: country
*             typeofstore:
*               type: string
*               description: typeofstore
*             storeName:
*               type: string
*               description: storeName
*             year:
*               type: string
*               description: year
*             annualSale:
*               type: string
*               description: annualSale
*             customerImportant:
*               type: string
*               description: customerImportant
*             sellcategories:
*               type: object
*               properties:
*                 categoryId:
*                  type: integer
*                  description: categoryId.
*                 categoryName:
*                  type: string
*                  description: categoryName.
*             hearaboutus:
*               type: object
*               properties:
*                 id:
*                  type: integer
*                  description: id.
*                 title:
*                  type: string
*                  description: title.
*       401:
*         description: Error.
 */


 // 25
/**
 * @swagger
 * /api/v2/admin/groupListing:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: groupListing
 *     summary: Getting Group Listing [passing authorization Header also]  -[25]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             group_name:
*               type: string
*               description: group_name
*             total_artisan:
*               type: string
*               description: total_artisan
*             craft:
*               type: string
*               description: craft
*             created_at:
*               type: string
*               description: created_at
*             isActive:
*               type: string
*               description: isActive
*             created_by:
*               type: string
*               description: created_by
*       401:
*         description: Error.
 */


 // 26
/**
 * @swagger
 * /api/v2/admin/checkGroupName:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: checkGroupName
 *     summary: Checking Group Name  exist or not [passing authorization Header also]  -[26]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: group_name
 *         description: Request sample { "group_name":"Rajpal"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 27
/**
 * @swagger
 * /api/v2/admin/addGroup:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addGroup
 *     summary: Adding a New group [passing authorization Header also]  -[27]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"group_name":"ABCD","total_artisan":"172,1,18","craft":"1,2","userId":"1"} //total_artisan=> comma seprated userId,
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



 // 28
/**
 * @swagger
 * /api/v2/admin/editGroup:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editGroup
 *     summary: Edit a artisan group [passing authorization Header also]  -[28]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"group_name":"ABCD","total_artisan":"172,1,18","craft":"1,2","userId":"1","id:"1"} //total_artisan=> comma seprated userId,
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 29
/**
 * @swagger
 * /api/v2/admin/deleteGroup:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: deleteGroup
 *     summary: delete a artisan group [passing authorization Header also]  -[29]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Enter group Id
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



 // 30
/**
 * @swagger
 * /api/v2/admin/groupProductListing:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: groupProductListing
 *     summary: Getting Product Group Listing [passing authorization Header also]  -[30]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             group_name:
*               type: string
*               description: group_name
*             total_artisan:
*               type: string
*               description: total_artisan
*             craft:
*               type: string
*               description: craft
*             created_at:
*               type: string
*               description: created_at
*             isActive:
*               type: string
*               description: isActive
*             created_by:
*               type: string
*               description: created_by
*       401:
*         description: Error.
 */


 // 31
/**
 * @swagger
 * /api/v2/admin/checkProductGroupName:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: checkProductGroupName
 *     summary: Checking Product Group Name  exist or not [passing authorization Header also]  -[31]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: group_name
 *         description: Request sample { "group_name":"Rajpal"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 32
/**
 * @swagger
 * /api/v2/admin/addProductGroup:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addProductGroup
 *     summary: Adding a New Product group [passing authorization Header also]  -[32]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"group_name":"ABCD","total_product":"172,1,18","craft":"1,2","userId":"1"} //total_artisan=> comma seprated userId,
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



 // 33
/**
 * @swagger
 * /api/v2/admin/editProductGroup:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editProductGroup
 *     summary: Edit a Product group [passing authorization Header also]  -[33]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"group_name":"ABCD","total_product":"172,1,18","craft":"1,2","userId":"1","id:"1"} //total_artisan=> comma seprated userId,
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 34
/**
 * @swagger
 * /api/v2/admin/deleteProductGroup:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: deleteProductGroup
 *     summary: delete a Product group [passing authorization Header also]  -[34]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Enter group Id
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


 // 35
/**
 * @swagger
 * /api/v2/admin/changeStatus:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: changeStatus
 *     summary: changeStatus a status [passing authorization Header also]  -[35]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","type":"tbl_name","isActive":"0"} //type should be like->artisan_group,product_group,products
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


 // 36
/**
 * @swagger
 * /api/v2/admin/checkEmail:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: checkEmail
 *     summary: checking a Email exist or  not checkEmail [passing authorization Header also]  -[36]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"rajpaltechugo@gmail.com","type":"artisan"} //type=>artisan,enduser
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


 // 37
/**
 * @swagger
 * /api/v2/admin/checkMobile:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: checkMobile
 *     summary: checking a Mobile exist or  not checkMobile [passing authorization Header also]  -[37]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"mobile":"899988989","type":"artisan"} //type=>artisan,enduser
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



 // 38
/**
 * @swagger
 * /api/v2/admin/ProductChangeStatus:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: ProductChangeStatus
 *     summary: updating product details[passing authorization Header also]  -[38]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"70","categoryId":"2","subcategoryId":"11","publish":"1","addingBestselling":"1","addingBestsellingComment":"addingBestsellingComment","isActive":"0"} //which column you want to update give this api
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


 // 39
/**
 * @swagger
 * /api/v2/admin/getSubCategory:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSubCategory
 *     summary: getting a subcategory [passing authorization Header also]  -[39]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"70"} //categoryId given
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title
*             parentId:
*               type: string
*               description: parentId
*             created_at:
*               type: string
*               description: created_at
*             image:
*               type: string
*               description: image
*             isActive:
*               type: string
*               description: isActive
*             banner_image:
*               type: string
*               description: banner_image
*             deleted:
*               type: string
*               description: deleted
*             verified:
*               type: string
*               description: verified
*             isBestSelling:
*               type: string
*               description: isBestSelling
*             userId:
*               type: string
*               description: userId
*             totalProduct:
*               type: string
*               description: totalProduct
*             totalsubCategoryId:
*               type: string
*               description: totalsubCategoryId
*       401:
*         description: Error.
 */


// 40
/**
 * @swagger
 * /api/v2/admin/addCategory:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addCategory
 *     summary: Adding a New Category [passing authorization Header also]  -[40]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: title of Category
 *         in: formData
 *         required: true
 *         type: string
 *       - name: banner
 *         description: banner Image choose
 *         in: formData
 *         required: false
 *         type: file
 *       - name: image
 *         description: category Image choose
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 41
/**
 * @swagger
 * /api/v2/admin/editCategory:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editCategory
 *     summary: edit a Category [passing authorization Header also]  -[41]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Category Id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: title of Category
 *         in: formData
 *         required: false
 *         type: string
 *       - name: banner
 *         description: banner Image choose
 *         in: formData
 *         required: false
 *         type: file
 *       - name: image
 *         description: category Image choose
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 42
/**
 * @swagger
 * /api/v2/admin/addSubCategory:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addCategory
 *     summary: Adding a New Sub Category [passing authorization Header also]  -[42]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Category Id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: title of sub Category
 *         in: formData
 *         required: true
 *         type: string
 *       - name: banner
 *         description: banner Image choose
 *         in: formData
 *         required: false
 *         type: file
 *       - name: image
 *         description: sub Category Image choose
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 43
/**
 * @swagger
 * /api/v2/admin/editSubCategory:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editSubCategory
 *     summary: edit a Sub Category [passing authorization Header also]  -[43]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Sub Category Id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: title of sub Category
 *         in: formData
 *         required: true
 *         type: string
 *       - name: banner
 *         description: banner Image choose
 *         in: formData
 *         required: false
 *         type: file
 *       - name: image
 *         description: sub Category Image choose
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 44
/**
 * @swagger
 * /api/v2/admin/listingCms:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: listingCms
 *     summary: getting alisting of Cms [passing authorization Header also]  -[44]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"Faq","viewType":"web"} [ex-Faq,About us,Patch-message,Testimonial,Banner,USP,Industries][viewType value ex- web,app]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             type:
*               type: string
*               description: type
*             description:
*               type: string
*               description: description
*             created_at:
*               type: string
*               description: created_at
*             title:
*               type: string
*               description: title
*             link:
*               type: string
*               description: link
*             name:
*               type: string
*               description: name
*             viewType:
*               type: string
*               description: viewType
*             isActive:
*               type: string
*               description: isActive
*             deleted:
*               type: string
*               description: deleted
*             seqId:
*               type: string
*               description: seqId
*       401:
*         description: Error.
 */


// 45
/**
 * @swagger
 * /api/v2/user/getNewsfeed:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getNewsfeed
 *     summary: getting News feed [passing authorization Header also]  -[45]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: passing viewType value ex- web,app
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             type:
*               type: string
*               description: type
*             description:
*               type: string
*               description: description
*             created_at:
*               type: string
*               description: created_at
*             title:
*               type: string
*               description: title
*             link:
*               type: string
*               description: link
*             name:
*               type: string
*               description: name
*             viewType:
*               type: string
*               description: viewType
*             isActive:
*               type: string
*               description: isActive
*             deleted:
*               type: string
*               description: deleted
*             url:
*               type: string
*               description: url
*       401:
*         description: Error.
 */



// 46
/**
 * @swagger
 * /api/v2/user/addOnboarding:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addOnboarding
 *     summary: adding or updateing Onboarding  [passing authorization Header also]  -[46]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: on boading Id
 *         in: formData
 *         required: false
 *         type: string
 *       - name: language
 *         description: language of on boading  1,2,3,[ex-1 english,2->hindi,3->bangla]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: onboarding
 *         description: onboarding Pic
 *         in: formData
 *         required: true
 *         type: file
 *       - name: url
 *         description: url of onboading
 *         in: formData
 *         required: true
 *         type: string
 *       - name: type
 *         description: type of onboading  ex- web,app
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */




// 47
/**
 * @swagger
 * /api/v2/user/addLoginOnboarding:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addLoginOnboarding
 *     summary: adding or updateing addLoginOnboarding  [passing authorization Header also]  -[47]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: on boading Id [ when your try to editing the data]
 *         in: formData
 *         required: false
 *         type: string
 *       - name: table
 *         description: enter a table Name ,[ex-type_of_store,aboutus_sample,customer_important_sample,]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: loginOnboarding
 *         description: onboarding Pic
 *         in: formData
 *         required: false
 *         type: file
 *       - name: type
 *         description: enter type  ex-[ when table =customer_important_sample,about_us it required to give]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: country
 *         description:  enter country  [ when table =customer_important_sample it required to give]
 *         in: formData
 *         required: false
 *         type: string
 *       - name: name
 *         description:  enter name [ when table =type_of_store it required to give]
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 48
/**
 * @swagger
 * /api/v2/user/listingLoginOnboarding:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: listingLoginOnboarding
 *     summary: listingLoginOnboarding [passing authorization Header also]  -[48]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: table
 *         description: passing table name ex- [ex-type_of_store,aboutus_sample,customer_important_sample, ]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             name:
*               type: string
*               description: name
*             icon:
*               type: string
*               description: icon
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive
*             created_at:
*               type: string
*               description: created_at
*       401:
*         description: Error.
 */

// 49
/**
 * @swagger
 * /api/v2/user/delLoginOnboarding:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: delLoginOnboarding
 *     summary: delLoginOnboarding [passing authorization Header also]  -[49]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: table
 *         description: passing table name ex- [ex-type_of_store,aboutus_sample,customer_important_sample, ]
 *         in: query
 *         required: true
 *         type: string
 *       - name: id
 *         description: record id which your want to delete
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 50
/**
 * @swagger
 * /api/v2/crud/addInfographics:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addInfographics
 *     summary: adding or updateing Infographics  [passing authorization Header also]  -[50]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: totalProducts
 *         description: enter a totalProducts
 *         in: formData
 *         required: false
 *         type: string
 *       - name: exportedTo
 *         description: enter a exportedTo
 *         in: formData
 *         required: false
 *         type: string
 *       - name: type
 *         description: type ex- [India,Country] [when type is india then[totalProducts,exportedTo,unitsDelivered]]
 *         in: formData
 *         required: false
 *         type: string
 *       - name: unitsDelivered
 *         description: enter unitsDelivered
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description:  enter description
 *         in: formData
 *         required: false
 *         type: string
 *       - name: totalClients
 *         description:  enter totalClients
 *         in: formData
 *         required: false
 *         type: string
 *       - name: totalProjects
 *         description:  enter totalProjects
 *         in: formData
 *         required: false
 *         type: string
  *       - name: image
 *         description:  choose image
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 51
/**
 * @swagger
 * /api/v2/crud/getInfographics:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: delLoginOnboarding
 *     summary: delLoginOnboarding [passing authorization Header also]  -[51]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: type ex- [India,Country]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             totalProducts:
*               type: string
*               description: totalProducts
*             unitsDelivered:
*               type: string
*               description: unitsDelivered
*             exportedTo:
*               type: string
*               description: exportedTo
*             image:
*               type: string
*               description: image
*             country:
*               type: string
*               description: country
*             created_at:
*               type: string
*               description: created_at
*             totalProject:
*               type: string
*               description: totalProject
*             totalClients:
*               type: string
*               description: totalClients
*             totalCountries:
*               type: string
*               description: totalCountries
*             type:
*               type: string
*               description: type
*             deleted:
*               type: string
*               description: deleted
*             insdustry:
*               type: string
*               description: insdustry
*             totalArtisan:
*               type: string
*               description: totalArtisan
*       401:
*         description: Error.
 */



// 52
/**
 * @swagger
 * /api/v2/crud/delInfographicsState:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: delLoginOnboarding
 *     summary: delInfographicsState [passing authorization Header also]  -[52]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: record id which your want to delete
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 53
/**
 * @swagger
 * /api/v2/admin/getshop:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getshop
 *     summary: getidealshop [passing authorization Header also]  -[53]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: limit
 *         description: limit passing
 *         in: query
 *         required: false
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             name:
*               type: string
*               description: name
*             amount:
*               type: string
*               description: amount
*             material:
*               type: string
*               description: material
*             inventoryQty:
*               type: string
*               description: inventoryQty
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive
*             searchTags:
*               type: string
*               description: searchTags
*             categoryId:
*               type: string
*               description: categoryId
*             subcategoryId:
*               type: string
*               description: subcategoryId
*             addingBestselling:
*               type: string
*               description: addingBestselling
*             addingBestsellingComment:
*               type: string
*               description: addingBestsellingComment
*             plive:
*               type: string
*               description: plive
*             roleName:
*               type: string
*               description: roleName
*             noOfOrder:
*               type: string
*               description: noOfOrder
*             categoryName:
*               type: string
*               description: categoryName
*             publish:
*               type: string
*               description: publish
*             subcategoryName:
*               type: string
*               description: subcategoryName
*             image:
*               type: string
*               description: image
*             artisanName:
*               type: string
*               description: artisanName
*             uploadedBy:
*               type: string
*               description: uploadedBy
*       401:
*         description: Error.
 */



// 54
/**
 * @swagger
 * /api/v2/admin/getIdealshop:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getIdealshop
 *     summary: delInfographicsState [passing authorization Header also]  -[54]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: limit
 *         description: limit passing
 *         in: query
 *         required: false
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             name:
*               type: string
*               description: name
*             amount:
*               type: string
*               description: amount
*             material:
*               type: string
*               description: material
*             inventoryQty:
*               type: string
*               description: inventoryQty
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive
*             searchTags:
*               type: string
*               description: searchTags
*             categoryId:
*               type: string
*               description: categoryId
*             subcategoryId:
*               type: string
*               description: subcategoryId
*             addingBestselling:
*               type: string
*               description: addingBestselling
*             addingBestsellingComment:
*               type: string
*               description: addingBestsellingComment
*             plive:
*               type: string
*               description: plive
*             roleName:
*               type: string
*               description: roleName
*             noOfOrder:
*               type: string
*               description: noOfOrder
*             categoryName:
*               type: string
*               description: categoryName
*             publish:
*               type: string
*               description: publish
*             subcategoryName:
*               type: string
*               description: subcategoryName
*             image:
*               type: string
*               description: image
*             artisanName:
*               type: string
*               description: artisanName
*             uploadedBy:
*               type: string
*               description: uploadedBy
*       401:
*         description: Error.
 */


// 55
/**
 * @swagger
 * /api/v2/admin/makeIdealProduct:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: makeIdealProduct
 *     summary: makeIdealProduct [passing authorization Header also]  -[55]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: ids
 *         description: passing a id's for which you make ideal product
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 56
/**
 * @swagger
 * /api/v2/admin/getGenrateEnquiryList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getGenrateEnquiryList
 *     summary: getGenrateEnquiryList [passing authorization Header also]  -[56]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             uniqueId:
*               type: string
*               description: uniqueId
*             title:
*               type: string
*               description: title
*             isGenrate:
*               type: string
*               description: isGenrate
*             created_at:
*               type: string
*               description: created_at
*             assignUserId:
*               type: string
*               description: assignUserId
*             totalArtisan:
*               type: string
*               description: totalArtisan
*             attachment:
*               type: string
*               description: attachment
*             totalResponce:
*               type: string
*               description: totalResponce
*       401:
*         description: Error.
 */


// 57
/**
 * @swagger
 * /api/v2/admin/genrateEnquiry:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getGenrateEnquiryList
 *     summary: getGenrateEnquiryList [passing authorization Header also]  -[57]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"craftId":"1","materialId":"2","requestTo":"All","id":"6"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 58
/**
 * @swagger
 * /api/v2/admin/genrateNewEnquiry:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: genrateNewEnquiry
 *     summary: adding New Enquiry threw admin [passing authorization Header also]  -[58]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: title
 *         description: enter title
 *         in: formData
 *         required: false
 *         type: string
 *       - name: description
 *         description:  enter description
 *         in: formData
 *       - name: attachment
 *         description:  choose attachment
 *         in: formData
 *         required: false
 *         type: file
 *       - name: craftId
 *         description:  enter craftId
 *         in: formData
 *         required: false
 *         type: string
 *       - name: materialId
 *         description:  enter materialId
 *         in: formData
 *         required: false
 *         type: string
 *       - name: requestTo
 *         description:  enter requestTo
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 59
/**
 * @swagger
 * /api/v2/admin/editGenratedEnquiry:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editGenratedEnquiry
 *     summary: updating a Enquiry  [passing authorization Header also]  -[59]
 *     consumes:
 *       - application/json
 *     parameters:
*       - name: id
 *         description: enter enquiry Id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: title
 *         description: enter title
 *         in: formData
 *         required: false
 *         type: string
 *       - name: description
 *         description:  enter description
 *         in: formData
 *         required: false
 *         type: string
 *       - name: attachment
 *         description:  choose attachment
 *         in: formData
 *         required: false
 *         type: file
 *       - name: craftId
 *         description:  enter craftId
 *         in: formData
 *         required: false
 *         type: string
 *       - name: materialId
 *         description:  enter materialId
 *         in: formData
 *         required: false
 *         type: string
 *       - name: update_status
 *         description:  enter update_status
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 60
/**
 * @swagger
 * /api/v2/admin/viewEnquiryArtisan:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: viewEnquiryArtisan
 *     summary: viewEnquiryArtisan [passing authorization Header also]  -[60]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id
 *         in: query
 *         required: true
 *         type: string
 *       - name: type
 *         description: enter type [ex->0->totalArtisan,1->ResponedArtisanBy]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             EnqId:
*               type: integer
*               description: EnqId
*             mobile:
*               type: string
*               description: mobile
*             userId:
*               type: string
*               description: userId
*             state:
*               type: string
*               description: state
*             name:
*               type: string
*               description: name
*             artisanImage:
*               type: string
*               description: artisanImage
*             adminId:
*               type: string
*               description: adminId
*             totalEnquiry:
*               type: string
*               description: totalEnquiry
*             totalOrder:
*               type: string
*               description: totalOrder
*       401:
*         description: Error.
 */



// 61
/**
 * @swagger
 * /api/v2/admin/genrateEstimate:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: genrateEstimate
 *     summary: genrateEstimate [passing authorization Header also]  -[61]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"enqId":"6","address":"address","shipTo":"shipTo","estimateNo":"estimateNo","productName":"productName","unit":"6","estimateRate":"600","tax":"18","amount":"906","subTotal":"906","acceptedBy":"906","acceptedDate":"2020-07-22"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 62
/**
 * @swagger
 * /api/v2/admin/genratePurchaseOrder:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: genratePurchaseOrder
 *     summary: genratePurchaseOrder [passing authorization Header also]  -[62]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample  {"enqId":"6","supplier":"supplier","shipTo":"shipTo","qty":"10","productName":"productName","unit":"6","price":"600","gst":"18","amount":"906","dueDate":"2020-07-25","subTotal":"906","discount":"10","assignUserId":"104"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 63
/**
 * @swagger
 * /api/v2/admin/getOrderList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getOrderList
 *     summary: getOrderList [passing authorization Header also]  -[63]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             EnqId:
*               type: integer
*               description: EnqId
*             title:
*               type: string
*               description: title
*             expPrice:
*               type: string
*               description: expPrice
*             place_on:
*               type: string
*               description: place_on
*             orderId:
*               type: string
*               description: orderId
*             id:
*               type: string
*               description: id
*             adminId:
*               type: string
*               description: adminId
*             image:
*               type: string
*               description: image
*             userId:
*               type: string
*               description: userId
*             chatCount:
*               type: string
*               description: chatCount
*             artisanPic:
*               type: string
*               description: artisanPic
*             update_status:
*               type: string
*               description: update_status
*             mobile:
*               type: string
*               description: mobile
*             description:
*               type: string
*               description: description
*             materialId:
*               type: string
*               description: materialId
*             craftId:
*               type: string
*               description: craftId
*             artisanName:
*               type: string
*               description: artisanName

*       401:
*         description: Error.
 */


// 64
/**
 * @swagger
 * /api/v2/admin/generateInvoice:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: generateInvoice
 *     summary: generateInvoice [passing authorization Header also]  -[64]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample  {"enqId":"6","userId":"107","invoiceTo":"AHELLO","shipTo":"AHELLO","placeOfSupply":"AHELLO","currency":"Rupes","qty":"10","productName":"AHELLO","unit":"pcs","rate":"10","tax":"18","dueDate":"2020-08-07","subTotal":"400.09"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 65
/**
 * @swagger
 * /api/v2/admin/importEnquiries:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: importEnquiries
 *     summary: importEnquiries [passing authorization Header also]  -[65]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: files
 *         description: choose csv file which you want to upload
 *         in: formData
 *         required: true
 *         type: file
 *       - name: type
 *         description: which enquiries you have to upload ex 1->lead enquiries 2->email enquiries
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 66
/**
 * @swagger
 * /api/v2/admin/importArtisan:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: importArtisan
 *     summary: importArtisan [passing authorization Header also]  -[66]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: files
 *         description: choose csv file which you want to upload
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 67
/**
 * @swagger
 * /api/v2/admin/importProduct:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: importProduct
 *     summary: importProduct [passing authorization Header also]  -[67]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: files
 *         description: choose csv file which you want to upload
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */




// 68
/**
 * @swagger
 * /api/v2/admin/addShopProduct:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addShopProduct
 *     summary: addShopProduct [passing authorization Header also]  -[68]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: files
 *         description: product pic
 *         in: formData
 *         required: true
 *         type: file
 *       - name: name
 *         description: Enter product Name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: artisanId
 *         description: artisanId
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         description: product price
 *         in: formData
 *         required: true
 *         type: string
 *       - name: inventoryQty
 *         description: inventoryQty
 *         in: formData
 *         required: true
 *         type: string
 *       - name: material
 *         description: material
 *         in: formData
 *         required: true
 *         type: string
 *       - name: id
 *         description: enter product id  when editiing the product
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 69
/**
 * @swagger
 * /api/v2/admin/getFromAllProduct:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getFromAllProduct
 *     summary: getFromAllProduct [passing authorization Header also]  -[69]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             name:
*               type: string
*               description: name
*             websiteView:
*               type: string
*               description: websiteView
*             totalEnqCount:
*               type: string
*               description: totalEnqCount
*             noOfOrder:
*               type: string
*               description: noOfOrder
*             artisanName:
*               type: string
*               description: artisanName
*             image:
*               type: string
*               description: image
*       401:
*         description: Error.
 */


// 70
/**
 * @swagger
 * /api/v2/admin/getPDF:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getPDF
 *     summary: getPDF [passing authorization Header also]  -[70]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"table":"invoice,po,estimate","id":"table uniqueId"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             result:
*               type: integer
*               description: result
*       401:
*         description: Error.
 */


// 71
/**
 * @swagger
 * /api/v2/admin/checkPDF:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: checkPDF
 *     summary: checkPDF [passing authorization Header also]  -[71]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"table":"invoice,po,estimate","id":"EnquiryId given"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             result:
*               type: integer
*               description: result
*       401:
*         description: Error.
 */


// 72
/**
 * @swagger
 * /api/v2/admin/edit/client:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /edit/client
 *     summary: /edit/client [passing authorization Header also]  -[72]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: imgs
 *         description: imaegs
 *         in: formData
 *         required: true
 *         type: file
 *       - name: isLogo
 *         description: isLogo
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 73
/**
 * @swagger
 * /api/v2/admin/edit/content:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /edit/content
 *     summary: /edit/client [passing authorization Header also]  -[73]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"isCmsContent":"1","type":"type","description":"description"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 74
/**
 * @swagger
 * /api/v2/admin/edit/testimonials:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /edit/testimonials
 *     summary: /edit/testimonials [passing authorization Header also]  -[74]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *         type: string
 *       - name: imgs
 *         description: imgs
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 75
/**
 * @swagger
 * /api/v2/admin/edit/faqs:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /edit/faqs
 *     summary: /edit/faqs [passing authorization Header also]  -[75]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","isFaq":"isFaq","question":"question","description":"description"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 76
/**
 * @swagger
 * /api/v2/admin/delete/faqs:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /delete/faqs
 *     summary: /delete/faqs [passing authorization Header also]  -[76]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 77
/**
 * @swagger
 * /api/v2/admin/getMessage:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getMessage
 *     summary: getMessage [passing authorization Header also]  -[77]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             EnqId:
*               type: string
*               description: EnqId
*             fromId:
*               type: string
*               description: fromId
*             toId:
*               type: string
*               description: toId
*             message:
*               type: string
*               description: message
*             type:
*               type: string
*               description: type
*             isRead:
*               type: string
*               description: isRead
*             created_at:
*               type: string
*               description: created_at
*             created_at2:
*               type: string
*               description: created_at2
*       401:
*         description: Error.
 */


// 78
/**
 * @swagger
 * /api/v2/admin/status/message:
 *   patch:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: status/message
 *     summary: status/message [passing authorization Header also]  -[78]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","isCms":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 79
/**
 * @swagger
 * /api/v2/admin/edit/message:
 *   patch:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: edit/message
 *     summary: edit/message [passing authorization Header also]  -[79]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","isCms":"1","title":"title", "link":"link"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 80
/**
 * @swagger
 * /api/v2/admin/delete/message:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /delete/message
 *     summary: /delete/message [passing authorization Header also]  -[80]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 81
/**
 * @swagger
 * /api/v2/admin/get/gallery:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /get/gallery
 *     summary: /get/gallery [passing authorization Header also]  -[81]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"EnqId":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             EnqId:
*               type: string
*               description: EnqId
*             fromId:
*               type: string
*               description: fromId
*             toId:
*               type: string
*               description: toId
*             message:
*               type: string
*               description: message
*             type:
*               type: string
*               description: type
*             isRead:
*               type: string
*               description: isRead
*             created_at:
*               type: string
*               description: created_at
*             isActive:
*               type: string
*               description: isActive
*             files:
*               type: string
*               description: files
*             price:
*               type: string
*               description: price
*             comments:
*               type: string
*               description: comments
*       401:
*         description: Error.
 */


 // 82
/**
 * @swagger
 * /api/v2/admin/gallery/comment:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /gallery/comment
 *     summary: /gallery/comment [passing authorization Header also]  -[82]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"EnqId":"1","ids":"1,2","comments":"TESTY,BUY"} [comments,ids->value should comma seprated]
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

// 83
/**
 * @swagger
 * /api/v2/admin/gallery/price:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /gallery/price
 *     summary: /gallery/price [passing authorization Header also]  -[83]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"EnqId":"1","ids":"1,2","price":"TESTY,BUY"} [price,ids->value should comma seprated]
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

// 84
/**
 * @swagger
 * /api/v2/admin/del/gallery:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /del/gallery
 *     summary: /del/gallery [passing authorization Header also]  -[84]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 85
/**
 * @swagger
 * /api/v2/admin/cms/list:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: cms/list
 *     summary: cms/list [passing authorization Header also]  -[85]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"1"} [sample  => 'About us', 'Patch-message', 'Banner', 'USP', 'Testimonial', 'Industries']
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             type:
*               type: string
*               description: type.
*             description:
*               type: integer
*               description: description.
*             created_at:
*               type: stringdescription
*               description: link
*             name:
*               type: string
*               description: name
*             viewType:
*               type: string
*               description: viewType
*             isActive:
*               type: string
*               description: isActive
*             deleted:
*               type: string
*               description: deleted
*             seqId:
*               type: string
*               description: seqId
*       401:
*         description: Error.
 */


// 86
/**
 * @swagger
 * /api/v2/admin/website/orders:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: website/orders
 *     summary: website/orders [passing authorization Header also]  -[86]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             EnqId:
*               type: integer
*               description: EnqId.
*             title:
*               type: string
*               description: title.
*             expPrice:
*               type: integer
*               description: expPrice.
*             place_on:
*               type: string
*               description: place_on
*             id:
*               type: string
*               description: id
*             adminId:
*               type: string
*               description: adminId
*             image:
*               type: string
*               description: image
*             userId:
*               type: string
*               description: userId
*             chatCount:
*               type: string
*               description: chatCount
*             artisanPic:
*               type: string
*               description: artisanPic
*             update_status:
*               type: string
*               description: update_status
*             created_at:
*               type: string
*               description: created_at
*             created_at2:
*               type: string
*               description: created_at2
*             description:
*               type: string
*               description: description
*             materialId:
*               type: string
*               description: materialId
*             craftId:
*               type: string
*               description: materialId
*       401:
*         description: Error.
 */



// 87
/**
 * @swagger
 * /api/v2/admin/website/orders/invoice:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: website/orders/invoice
 *     summary: website/orders/invoice [passing authorization Header also]  -[87]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"enqId":"1595","shipTo":"bbj","productName":"7867867","unit":"76786","rate":"78687","tax":"76768","amount":"76767","dueDate":"2020-09-29","subTotal":"32324","userId":"1","type":"order","qty":"687","placeOfSupply":"xxfds"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 88
/**
 * @swagger
 * /api/v2/admin/edit/orders/invoice:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: website/orders/invoice
 *     summary: website/orders/invoice [passing authorization Header also]  -[88]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","enqId":"1595","shipTo":"bbj","productName":"7867867","unit":"76786","rate":"78687","tax":"76768","amount":"76767","dueDate":"2020-09-29","subTotal":"32324","userId":"1","type":"order","qty":"687","placeOfSupply":"xxfds"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 89
/**
 * @swagger
 * /api/v2/admin/get/stories:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: get/stories
 *     summary: get/stories [passing authorization Header also]  -[89]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: Record Id.
*             title:
*               type: string
*               description: title.
*             description:
*               type: integer
*               description: description.
*             isActive:
*               type: string
*               description: isActive.
*             image:
*               type: integer
*               description: image.
*             created_at:
*               type: integer
*               description: created_at.
*       401:
*         description: Error.
 */

// 88
/**
 * @swagger
 * /api/v2/admin/edit/orders/invoice:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: website/orders/invoice
 *     summary: website/orders/invoice [passing authorization Header also]  -[88]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","enqId":"1595","shipTo":"bbj","productName":"7867867","unit":"76786","rate":"78687","tax":"76768","amount":"76767","dueDate":"2020-09-29","subTotal":"32324","userId":"1","type":"order","qty":"687","placeOfSupply":"xxfds"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 90
/**
 * @swagger
 * /api/v2/admin/add/stories:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: add/stories
 *     summary: add/stories [passing authorization Header also]  -[90]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: title
 *         description: Enter title .
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: Enter description .
 *         in: formData
 *         required: true
 *         type: string
 *       - name: isActive
 *         description: Enter isActive.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: image
 *         description: choose image.
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 91
/**
 * @swagger
 * /api/v2/admin/edit/stories:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: edit/stories
 *     summary: edit/stories [passing authorization Header also]  -[91]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Enter id .
 *         in: formData
 *         required: true
 *         type: string
 *       - name: title
 *         description: Enter title .
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: Enter description .
 *         in: formData
 *         required: true
 *         type: string
 *       - name: isActive
 *         description: Enter isActive.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: image
 *         description: choose image.
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 92
/**
 * @swagger
 * /api/v2/admin/delete/stories:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: delete/stories
 *     summary: delete/stories [passing authorization Header also]  -[92]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 93
/**
 * @swagger
 * /api/v2/admin/gallery/zip:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /gallery/zip
 *     summary: /gallery/zip [passing authorization Header also]  -[93]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 94
/**
 * @swagger
 * /api/v2/admin/get/awards:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /get/awards
 *     summary: /get/awards [passing authorization Header also]  -[94]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             image:
*               type: string
*               description: image
*             title:
*               type: string
*               description: title.
*             isActive:
*               type: string
*               description: isActive
*             isPublished:
*               type: string
*               description: isPublished.
*             created_at:
*               type: string
*               description: created_at
*             name:
*               type: string
*               description: name.
*             userId:
*               type: string
*               description: userId
*             totalAwards:
*               type: string
*               description: totalAwards.
*       401:
*         description: Error.
 */

// 95
/**
 * @swagger
 * /api/v2/admin/delete/notification:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /delete/notification
 *     summary: /delete/notification [passing authorization Header also]  -[95]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 96
/**
 * @swagger
 * /api/v2/admin/get/notification:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /get/notification
 *     summary: /get/notification [passing authorization Header also]  -[96]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             type:
*               type: string
*               description: type
*             to:
*               type: string
*               description: to.
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive.
*             created_at:
*               type: string
*               description: created_at
*             groupName:
*               type: string
*               description: groupName.
*       401:
*         description: Error.
 */



// 97
/**
 * @swagger
 * /api/v2/admin/get/notification:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /get/notification
 *     summary: /get/notification [passing authorization Header also]  -[97]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             type:
*               type: string
*               description: type
*             to:
*               type: string
*               description: to.
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive.
*             created_at:
*               type: string
*               description: created_at
*             groupName:
*               type: string
*               description: groupName.
*       401:
*         description: Error.
 */


// 98
/**
 * @swagger
 * /api/v2/admin/add/notification:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: /add/notification
 *     summary: /add/notification [passing authorization Header also]  -[98]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"message":"message","sendType":"sendType","type":"type","userIds":"1,2,3,4","group":"All"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 99
/**
 * @swagger
 * /api/v2/admin/getlogisticDetails:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getlogisticDetails
 *     summary: getlogisticDetails [passing authorization Header also]  -[99]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             orderId:
*               type: string
*               description: orderId
*             carrier:
*               type: string
*               description: carrier.
*             trackingNo:
*               type: integer
*               description: trackingNo.
*             boxes:
*               type: string
*               description: boxes
*             paymentMode:
*               type: string
*               description: paymentMode.
*             userId:
*               type: integer
*               description: userId.
*             created_at:
*               type: string
*               description: created_at
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */


// 100
/**
 * @swagger
 * /api/v2/admin/getProductionTracker:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getProductionTracker
 *     summary: getProductionTracker [passing authorization Header also]  -[100]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             productionStatus:
*               type: string
*               description: productionStatus
*             paymentStatus:
*               type: string
*               description: paymentStatus.
*             created_at:
*               type: integer
*               description: created_at.
*             deliveryDate:
*               type: string
*               description: deliveryDate
*             orderId:
*               type: string
*               description: orderId.
*             files:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                files:
*                 type: string
*                 description: files
*       401:
*         description: Error.
 */

// 101
/**
 * @swagger
 * /api/v2/admin/editProductionTracker:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editProductionTracker
 *     summary: editProductionTracker [passing authorization Header also]  -[101]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","productionStatus":"10","paymentStatus":"30"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 102
/**
 * @swagger
 * /api/v2/admin/websiteOrderEdit:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: websiteOrderEdit
 *     summary: websiteOrderEdit [passing authorization Header also]  -[102]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"EnqId":"1","update_status":"enquiry forwarded to artisan"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 103
/**
 * @swagger
 * /api/v2/admin/getSubAdminRole:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSubAdminRole
 *     summary: getSubAdminRole [passing authorization Header also]  -[103]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             title:
*               type: string
*               description: title
*             isActive:
*               type: integer
*               description: isActive.
*             createdAt:
*               type: string
*               description: createdAt .
*       401:
*         description: Error.
 */


// 104
/**
 * @swagger
 * /api/v2/admin/addSubAdmin:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSubAdminRole
 *     summary: getSubAdminRole [passing authorization Header also]  -[104]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"email@email.com","mobile":"98989898","password":"12345"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


/// aftre responce given




// 105
/**
 * @swagger
 * /api/v2/admin/getSubAdminList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSubAdminList
 *     summary: getSubAdminList [passing authorization Header also]  -[105]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             mobile:
*               type: string
*               description: mobile
*             email:
*               type: string
*               description: email.
*             isActive:
*               type: string
*               description: isActive .
*             profileImage:
*               type: string
*               description: profileImage
*             name:
*               type: string
*               description: name.
*             groupName:
*               type: string
*               description: groupName .
*             subAdminRoleId:
*               type: string
*               description: subAdminRoleId
*             totalGroup:
*               type: string
*               description: totalGroup.
*             totalArtisan:
*               type: string
*               description: totalArtisan .
*             userId:
*               type: string
*               description: userId .
*       401:
*         description: Error.
 */

// 106
/**
 * @swagger
 * /api/v2/admin/createSubAdminGroup:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: createSubAdminGroup
 *     summary: createSubAdminGroup [passing authorization Header also]  -[106]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"5","groupName":"RAJPAL1","subAdminRoleId":"1,2,3","totalArtisan":"301,303,314,345","mobile":"98899889","email:"abcd@gmail.com"} [id->record id,total Artisan => userId comma seperated]
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

// 107
/**
 * @swagger
 * /api/v2/admin/viewSubAdminCategorylist:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: viewSubAdminCategorylist
 *     summary: viewSubAdminCategorylist [passing authorization Header also]  -[107]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             categoryId:
*               type: string
*               description: categoryId
*             subcategoryId:
*               type: string
*               description: subcategoryId.
*             image:
*               type: string
*               description: image .
*             categoryName:
*               type: string
*               description: categoryName
*             isActive:
*               type: string
*               description: isActive
*             subcategoryName:
*               type: string
*               description: subcategoryName.
*             mobile:
*               type: string
*               description: mobile .
*             email:
*               type: string
*               description: email
*             subAdminName:
*               type: string
*               description: subAdminName .
*             verified:
*               type: string
*               description: verified
*       401:
*         description: Error.
 */

// 108
/**
 * @swagger
 * /api/v2/admin/getGalleryList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getGalleryList
 *     summary: getGalleryList [passing authorization Header also]  -[108]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             title:
*               type: string
*               description: title
*             artisanImage:
*               type: string
*               description: artisanImage.
*             artisanName:
*               type: string
*               description: artisanName .
*             totalImage:
*               type: string
*               description: totalImage
*       401:
*         description: Error.
 */

// 109
/**
 * @swagger
 * /api/v2/admin/getGroupUser:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getGroupUser
 *     summary: getGroupUser [passing authorization Header also]  -[109]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"1"} [id-> it is comma separted group id's]
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             name:
*               type: string
*               description: name
*             artisanImage:
*               type: string
*               description: artisanImage.
*             mobile:
*               type: string
*               description: mobile .
*             stateName:
*               type: string
*               description: stateName
*             email:
*               type: string
*               description: email
*             isActive:
*               type: string
*               description: isActive.
*             userId:
*               type: string
*               description: userId .
*             role:
*               type: string
*               description: role
*             totalEnq:
*               type: string
*               description: totalEnq
*             totalOrders:
*               type: string
*               description: totalOrders.
*       401:
*         description: Error.
 */


// 110
/**
 * @swagger
 * /api/v2/admin/getSubSubCategory:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSubSubCategory
 *     summary: getting a getSubSubCategory [passing authorization Header also]  -[110]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"70"} //categoryId given
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             title:
*               type: string
*               description: title
*             parentId:
*               type: string
*               description: parentId.
*             created_at:
*               type: string
*               description: created_at
*             image:
*               type: string
*               description: image.
*             isActive:
*               type: string
*               description: isActive
*             banner_image:
*               type: string
*               description: banner_image.
*             deleted:
*               type: string
*               description: deleted
*             totalProduct:
*               type: string
*               description: totalProduct.
*             userId:
*               type: string
*               description: userId
*             isBestSelling:
*               type: string
*               description: isBestSelling.
*             verified:
*               type: string
*               description: verified
*             totalsubCategoryId:
*               type: string
*               description: totalsubCategoryId.
*       401:
*         description: Error.
 */

 // 111
/**
 * @swagger
 * /api/v2/admin/getSubAdminDetails:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSubAdminDetails
 *     summary: getting a getSubAdminDetails [passing authorization Header also]  -[111]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"70"} // Record id
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             mobile:
*               type: string
*               description: mobile
*             email:
*               type: string
*               description: email.
*             isActive:
*               type: string
*               description: isActive
*             profileImage:
*               type: string
*               description: profileImage.
*             name:
*               type: string
*               description: name.
*             groupName:
*               type: string
*               description: groupName
*             subAdminRoleId:
*               type: string
*               description: subAdminRoleId.
*             totalGroup:
*               type: string
*               description: totalGroup.
*             totalArtisan:
*               type: string
*               description: totalArtisan
*             groupId:
*               type: string
*               description: groupId.
*             subAdminRoleList:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                title:
*                 type: string
*                 description: title
*       401:
*         description: Error.
 */


 // 112
/**
 * @swagger
 * /api/v2/admin/getGalleryDetails:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getGalleryDetails
 *     summary: getting a getGalleryDetails [passing authorization Header also]  -[112]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Request sample {"id":"70"} // Record id
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             title:
*               type: string
*               description: title
*             artisanImage:
*               type: string
*               description: artisanImage.
*             artisanName:
*               type: string
*               description: artisanName
*             totalImage:
*               type: string
*               description: totalImage.
*             Images:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                images:
*                 type: string
*                 description: images
*       401:
*         description: Error.
 */

// 113
/**
 * @swagger
 * /api/v2/admin/getNotificationList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getNotificationList
 *     summary: getting a getNotificationList [passing authorization Header also]  -[113]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             type:
*               type: string
*               description: type
*             title:
*               type: string
*               description: title.
*             description:
*               type: string
*               description: description
*             gcmId:
*               type: string
*               description: gcmId.
*             userId:
*               type: string
*               description: userId
*             sendStatus:
*               type: string
*               description: sendStatus.
*             isActive:
*               type: string
*               description: isActive
*             isRead:
*               type: string
*               description: isRead.
*             created_at:
*               type: string
*               description: created_at
*             ArtisanName:
*               type: string
*               description: ArtisanName.
*       401:
*         description: Error.
 */


 // 114
/**
 * @swagger
 * /api/v2/admin/changePassword:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: changePassword
 *     summary: getting a changePassword [passing authorization Header also]  -[114]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"oldPassword":"123456","newPassword":"1234562"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


 // 115
/**
 * @swagger
 * /api/v2/admin/getProfile:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getProfile
 *     summary: getting a getProfile [passing authorization Header also]  -[115]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             email:
*               type: string
*               description: email
*             mobile:
*               type: string
*               description: mobile.
*             name:
*               type: string
*               description: name
*             name2:
*               type: string
*               description: name2.
*       401:
*         description: Error.
 */


 // 116
/**
 * @swagger
 * /api/v2/admin/profileUpdate:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: profileUpdate
 *     summary: getting a profileUpdate [passing authorization Header also]  -[116]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"name":"admin","name2":"admin"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



 // 117
/**
 * @swagger
 * /api/v2/admin/forgotPassword:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: forgotPassword
 *     summary: getting a forgotPassword  -[117]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"admin@gmail.com"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



 // 118
/**
 * @swagger
 * /api/v2/admin/resetPassword:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: resetPassword
 *     summary: getting a resetPassword [passing authorization Header also]  -[118]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"link":"EFtj0LWYigUBU77CuUiEL5lPYpBEU4Xc","newPassword":"123456"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 119
/**
 * @swagger
 * /api/v2/admin/bannerSequenceChanged:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: bannerSequenceChanged
 *     summary: getting a bannerSequenceChanged [passing authorization Header also]  -[119]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1,4"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 120
/**
 * @swagger
 * /api/v2/admin/getExhibannerList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getExhibannerList
 *     summary: getting a bannerSequenceChanged [passing authorization Header also]  -[120]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             type:
*               type: string
*               description: type.
*             description:
*               type: string
*               description: description
*             title:
*               type: string
*               description: title.
*             link:
*               type: string
*               description: link
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive
*             totalUser:
*               type: string
*               description: totalUser.
*       401:
*         description: Error.
 */

// 121
/**
 * @swagger
 * /api/v2/admin/   :
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getSupportList
 *     summary: getting a getSupportList [passing authorization Header also]  -[121]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title.
*             isActive:
*               type: string
*               description: isActive
*             createdAt:
*               type: string
*               description: createdAt.
*       401:
*         description: Error.
 */


// 122
/**
 * @swagger
 * /api/v2/admin/addEditSupport:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addEditSupport
 *     summary: getting a addEditSupport [passing authorization Header also]  -[122]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","title":"heloo"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 123
/**
 * @swagger
 * /api/v2/admin/deleteSupport:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: deleteSupport
 *     summary: getting a deleteSupport [passing authorization Header also]  -[123]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: body
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 124
/**
 * @swagger
 * /api/v2/admin/getExhibannerUserList:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getExhibannerUserList
 *     summary: getting a getExhibannerUserList [passing authorization Header also]  -[124]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             name:
*               type: string
*               description: name.
*             email:
*               type: string
*               description: email
*             mobile:
*               type: string
*               description: mobile.
*             exhibitionId:
*               type: string
*               description: exhibitionId.
*             isDeleted:
*               type: string
*               description: isDeleted
*             createdAt:
*               type: string
*               description: createdAt.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */




// 125
/**
 * @swagger
 * /api/v2/admin/publishAwardToNewsFeed:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: publishAwardToNewsFeed
 *     summary: getting a publishAwardToNewsFeed [passing authorization Header also]  -[125]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","isPublished":"1"}
 *         in: query
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 126
/**
 * @swagger
 * /api/v2/admin/addAdminBussinessDetails:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addAdminBussinessDetails
 *     summary: getting a addAdminBussinessDetails [passing authorization Header also]  -[126]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"companyEmail":"companyEmail@gmail.com","companyNumber":"companyNumber","companyAddress":"companyAddress","instagram":"instagram","facebook":"facebook"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

// 127
/**
 * @swagger
 * /api/v2/admin/getAdminBussinessDetails:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getAdminBussinessDetails
 *     summary: getting a getAdminBussinessDetails [passing authorization Header also]  -[127]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             companyEmail:
*               type: string
*               description: companyEmail.
*             companyNumber:
*               type: string
*               description: companyNumber
*             companyAddress:
*               type: string
*               description: companyAddress.
*             instagram:
*               type: string
*               description: instagram.
*             facebook:
*               type: string
*               description: facebook.
*             twitter:
*               type: string
*               description: twitter
*             isActive:
*               type: string
*               description: isActive.
*             createdAt:
*               type: string
*               description: createdAt.
*       401:
*         description: Error.
 */


// 128
/**
 * @swagger
 * /api/v2/admin/addWbeToken:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addWbeToken
 *     summary: addWbeToken  -[128]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"webToken":"dsbfjssbkjfdfjhbsdhfbjsdbfjbdsjfbjdsbfjdsf"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Login successfully
*       401:
*         description: Error.
 */

// 129
/**
 * @swagger
 * /api/v2/admin/removeWebToken:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: removeWebToken
 *     summary: getting a removeWebToken [passing authorization Header also]  -[129]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"webToken":"dsbfjssbkjfdfjhbsdhfbjsdbfjbdsjfbjdsbfjdsf"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 130
/**
 * @swagger
 * /api/v2/admin/editAboustUs:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: editAboustUs
 *     summary: getting a editAboustUs [passing authorization Header also]  -[130]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"description":"dsbfjssbkjfdfjhbsdhfbjsdbfjbdsjfbjdsbfjdsf"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */


// 131
/**
 * @swagger
 * /api/v2/admin/uploadBrand:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: uploadBrand
 *     summary: getting a uploadBrand [passing authorization Header also]  -[131]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: logo
 *         description: Choose logo image
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 132
/**
 * @swagger
 * /api/v2/admin/getBrand:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getBrand
 *     summary: getting a getBrand [passing authorization Header also]  -[132]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             brandName:
*               type: string
*               description: brandName.
*             logo:
*               type: string
*               description: logo
*             userId:
*               type: string
*               description: userId.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */



// 133
/**
 * @swagger
 * /api/v2/admin/addTeam:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addTeam
 *     summary: getting a addTeam [passing authorization Header also]  -[133]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: image
 *         description: Choose image
 *         in: formData
 *         required: true
 *         type: file
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: designation
 *         description: designation
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 134
/**
 * @swagger
 * /api/v2/admin/getTeam:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getTeam
 *     summary: getting a getTeam [passing authorization Header also]  -[134]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             name:
*               type: string
*               description: name.
*             designation:
*               type: string
*               description: designation
*             image:
*               type: string
*               description: image.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */


// 135
/**
 * @swagger
 * /api/v2/admin/addCarrer:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addCarrer
 *     summary: getting a addCarrer [passing authorization Header also]  -[135]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"title":"Sales","description":"abc","position":"abc","totalOpening":"3"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 136
/**
 * @swagger
 * /api/v2/admin/getCarrer:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addCarrer
 *     summary: getting a addCarrer [passing authorization Header also]  -[136]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title.
*             position:
*               type: string
*               description: position
*             totalOpening:
*               type: string
*               description: totalOpening.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */



// 137
/**
 * @swagger
 * /api/v2/admin/addPrivacyPolicy:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addPrivacyPolicy
 *     summary: getting a addPrivacyPolicy [passing authorization Header also]  -[137]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"title":"Sales","description":"abc",}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 138
/**
 * @swagger
 * /api/v2/admin/getPrivacyPolicy:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getPrivacyPolicy
 *     summary: getting a getPrivacyPolicy [passing authorization Header also]  -[138]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */



// 139
/**
 * @swagger
 * /api/v2/admin/addReturnPolicy:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addReturnPolicy
 *     summary: getting a addReturnPolicy [passing authorization Header also]  -[139]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"title":"Sales","description":"abc",}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */

 // 140
/**
 * @swagger
 * /api/v2/admin/getReturnPolicy:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getReturnPolicy
 *     summary: getting a getReturnPolicy [passing authorization Header also]  -[140]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */


// 141
/**
 * @swagger
 * /api/v2/admin/addCatalouge:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addCatalouge
 *     summary: getting a addCatalouge [passing authorization Header also]  -[141]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: link
 *         description: Choose  image or pdf
 *         in: formData
 *         required: true
 *         type: file
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 142
/**
 * @swagger
 * /api/v2/admin/getCatalouge:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getCatalouge
 *     summary: getting a getCatalouge [passing authorization Header also]  -[142]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title.
*             description:
*               type: string
*               description: description
*             link:
*               type: string
*               description: link.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */


// 143
/**
 * @swagger
 * /api/v2/admin/addBlogs:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: addBlogs
 *     summary: getting a addBlogs [passing authorization Header also]  -[143]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: image
 *         description: Choose  image
 *         in: formData
 *         required: true
 *         type: file
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *         type: string
 *       - name: link
 *         description: link
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 144
/**
 * @swagger
 * /api/v2/admin/getBlogs:
 *   get:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: getBlogs
 *     summary: getting a getBlogs [passing authorization Header also]  -[144]
 *     consumes:
 *       - application/json
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id
*             title:
*               type: string
*               description: title.
*             image:
*               type: string
*               description: image
*             description:
*               type: string
*               description: description
*             link:
*               type: string
*               description: link.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: string
*               description: isActive.
*       401:
*         description: Error.
 */



// 145
/**
 * @swagger
 * /api/v2/admin/deleteData:
 *   delete:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: deleteData
 *     summary: deleteData [passing authorization Header also]  -[145]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"type":"catalogue"(table name ex-catalogue,blogs,carrer,),"id":"1"(recordId)}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */



// 146
/**
 * @swagger
 * /api/v2/admin/importListing:
 *   post:
 *     tags:
 *      - ADMIN V2 API LIST
 *     name: importListing
 *     summary: importListing [passing authorization Header also]  -[146]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: files
 *         description: choose csv file which you want to upload
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error.
 */
