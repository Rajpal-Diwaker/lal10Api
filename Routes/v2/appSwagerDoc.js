
// 1
/**
 * @swagger
 * /api/v2/app/login:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: login
 *     summary: login to the App  -[1]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"mobile":"9667472268","device_token":"asbdvkjasbdasbdjasfkjbsjdbfjksa"}
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Login successfully
*         schema:
*           type: object
*           properties:
*             userId:
*               type: integer
*               description: userId.
*             authorization:
*               type: string
*               duserIdescription: authorization 
*             name:
*               type: string
*               description: name.
*             artisanImage:
*               type: integer
*               description: artisanImage.
*             kycImage:
*               type: string
*               description: kycImage
*             UserCraft:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                title:
*                 type: string
*                 description: title
*             Userproduct:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                title:
*                 type: string
*                 description: title
*             UserMaterial:
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

// 2
/**
 * @swagger
 * /api/v2/app/chooseLanguage:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: chooseLanguage
 *     summary: Choosing a language to the app [passing authorization Header also]  -[2]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"userId":"88","lang":"hi"}    [lang => [hi=>Hindi,en=>English,bn=>bangla]] 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success.
*       401:
*         description: Error.
 */


// 3
/**
 * @swagger
 * /api/v2/app/checkMobile:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: checkMobile
 *     summary: Checking mobile exist or not  -[3]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"userId":"88"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success.
*       401:
*         description: This mobile no exist please try again..
 */


// 4
/**
 * @swagger
 * /api/v2/app/signUp:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: signUp
 *     summary: Register a new user   -[4]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"mobile":"8889898998","name":"Test"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: User signup successfully.
*       401:
*         description: This mobile no exist please try again..
 */

// 5
/**
 * @swagger
 * /api/v2/app/artisanPicuploads:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: artisanPicuploads
 *     summary: Save artisan profilr pic [passing authorization Header also]  -[5]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Enter user Id.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: artisanImage
 *         description: Choose artisan image
 *         in: formData
 *         required: true
 *         type: file
	 *     responses:
*       200:
*         description: Image upload successfully.
*       401:
*         description: Error
 */


// 6 
/**
* @swagger
* /api/v2/app/states:
*   get:
*     tags:
*       - APP V2 API LIST
*     name: states
*     summary: Getting a states list  -[6]
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
*               duserIdescription: title 
*             image:
*               type: string
*               description: image.
*       401:
*         description: Bad Request
*/


// 7
/**
* @swagger
* /api/v2/app/getCraftList:
*   get:
*     tags:
*       - APP V2 API LIST
*     name: getCraftList
*     summary: Getting a craft list  -[7]
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
*               duserIdescription: title 
*             image:
*               type: string
*               description: image.
*       401:
*         description: Bad Request
*/


// 8
/**
* @swagger
* /api/v2/app/getMatrialList:
*   get:
*     tags:
*       - APP V2 API LIST
*     name: getMatrialList
*     summary: Getting a matrial list -[8]
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
*               duserIdescription: title 
*             image:
*               type: string
*               description: image.
*       401:
*         description: Bad Request
*/


// 9
/**
* @swagger
* /api/v2/app/getProductList:
*   get:
*     tags:
*       - APP V2 API LIST
*     name: getProductList
*     summary: Getting a product list  -[9]
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
*               duserIdescription: title 
*             image:
*               type: string
*               description: image.
*       401:
*         description: Bad Request
*/

// 10
/**
 * @swagger
 * /api/v2/app/completeSignUp:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: completeSignUp
 *     summary: Completing the artisan profile [passing authorization Header also]  -[10]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Enter user Id.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: state
 *         description: Choose your state.
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
 *       - name: kycImage
 *         description: Choose artisan image
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Updated successfully.
*       401:
*         description: Error
 */

// 11
/**
 * @swagger
 * /api/v2/app/viewProfile:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: viewProfile
 *     summary: User Prifile view [passing authorization Header also]  -[11]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"userId":"88"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success.
*         schema:
*           type: object
*           properties:
*             id:
*               type: integer
*               description: id.
*             email:
*               type: string
*               duserIdescription: email 
*             mobile:
*               type: string
*               description: mobile.
*             state:
*               type: string
*               duserIdescription: state 
*             name:
*               type: string
*               description: name.
*             artisanImage:
*               type: string
*               duserIdescription: artisanImage 
*             kycImage:
*               type: string
*               description: kycImage.
*             UserCraft:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                image:
*                 type: string
*                 description: Image URL
*       401:
*         description: Error
 */


// 12
/**
 * @swagger
 * /api/v2/app/checkEmail:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: checkEmail
 *     summary: Checking email exist or not  -[12]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"abc@gmail.com"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: This email exist please try again
 */


// 13
/**
 * @swagger
 * /api/v2/app/editProfile:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: editProfile
 *     summary: Edit Profile [passing authorization Header also] -[13]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Enter user Id.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: Enter the email
 *         in: formData
 *         required: false
 *         type: string 
 *       - name: artisanImage
 *         description: Choose artisan image
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
*       200:
*         description: Updated successfully.
*       401:
*         description: Error
 */


// 14
/**
 * @swagger
 * /api/v2/app/enquiryList:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: enquiryList
 *     summary: getting Enquiry List [passing authorization Header also]-[14]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"userId":"13","limit":"10","offset":"0"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             totalCount:
*               type: integer
*               description: totalCount.
*             res:
*               type: object
*               properties:
*                last_msg:
*                 type: string
*                 description: last_msg
*                type:
*                 type: string
*                 description: type
*                fromId:
*                 type: string
*                 description: fromId
*                EnqId:
*                 type: string
*                 description: EnqId
*                uniqueId:
*                 type: string
*                 description: uniqueId
*                title:
*                 type: string
*                 description: title
*                description:
*                 type: string
*                 description: description
*                qty:
*                 type: string
*                 description: qty
*                expPrice:
*                 type: string
*                 description: expPrice
*                productId:
*                 type: string
*                 description: productId
*                image:
*                 type: string
*                 description: image
*                unreadCount:
*                 type: string
*                 description: unreadCount
*                created_at:
*                 type: string
*                 description: created_at
*                reciverId:
*                 type: string
*                 description: reciverId
*       401:
*         description: Error
 */


// 15
/**
 * @swagger
 * /api/v2/app/orderList:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: enquiryList
 *     summary: getting Order List [passing authorization Header also]-[15]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"userId":"13","limit":"10","offset":"0"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             totalCount:
*               type: integer
*               description: totalCount.
*             res:
*               type: object
*               properties:
*                last_msg:
*                 type: string
*                 description: last_msg
*                type:
*                 type: string
*                 description: type
*                fromId:
*                 type: string
*                 description: fromId
*                orderId:
*                 type: string
*                 description: orderId
*                EnqId:
*                 type: string
*                 description: EnqId
*                uniqueId:
*                 type: string
*                 description: uniqueId
*                title:
*                 type: string
*                 description: title
*                description:
*                 type: string
*                 description: description
*                qty:
*                 type: string
*                 description: qty
*                expPrice:
*                 type: string
*                 description: expPrice
*                productId:
*                 type: string
*                 description: productId
*                image:
*                 type: string
*                 description: image
*                unreadCount:
*                 type: string
*                 description: unreadCount
*                created_at:
*                 type: string
*                 description: created_at
*                reciverId:
*                 type: string
*                 description: reciverId
*                orderstatus:
*                 type: string
*                 description: orderstatus
*                orderType:
*                 type: string
*                 description: orderType
*       401:
*         description: Error
 */


// 16
/**
 * @swagger
 * /api/v2/app/uploadChatMedia:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: uploadChatMedia
 *     summary: upload media for socket chat [-16]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: chat
 *         description: Choose uploaded chat image 
 *         in: formData
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: '{"code":200,"message":"Success.","result":{"filename":"http://15.206.162.67:5656/959603d00986ce27c0d9b4cd5299a09f1593783018985.gif"}}'
*       401:
*         description: Error
 */


// 17
/**
 * @swagger
 * /api/v2/app/orderAcceptorReject:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: orderAcceptorReject
 *     summary: order Accept or Reject [passing authorization Header also] [-17]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample { "userId":"158","orderId":"2","type":"1"} [type=1->accept,2->reject]
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */



// 18
/**
 * @swagger
 * /api/v2/app/addlogisticDetails:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: addlogisticDetails
 *     summary: Adding a New logistic Details [passing authorization Header also] [-18]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","carrier":"hello","trackingNo":"HELOP09990","boxes":"YES","paymentMode":"Hwllo","orderId":"2"} 
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */



 // 19
/**
 * @swagger
 * /api/v2/app/getlogisticDetails:
 *   get:
 *     tags:
 *      - APP V2 API LIST
 *     name: getlogisticDetails
 *     summary: getting a New logistic Details [passing authorization Header also] [-19]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","orderId":"2"} 
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
*               type: integer
*               description: orderId 
*             carrier:
*               type: string
*               description: carrier.
*             trackingNo:
*               type: string
*               description: trackingNo 
*             boxes:
*               type: integer
*               description: boxes.
*             paymentMode:
*               type: string
*               description: paymentMode 
*             userId:
*               type: integer
*               description: userId.
*             created_at:
*               type: string
*               description: created_at 
*             isActive:
*               type: integer
*               description: isActive.

*       401:
*         description: Error
 */



 // 20
/**
 * @swagger
 * /api/v2/app/getGalleryPic:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: getGalleryPic
 *     summary: Getting a Gallery Pic [passing authorization Header also] [-20]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","EnqId":"2"} 
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
*             EnqId:
*               type: integer
*               description: EnqId 
*             fromId:
*               type: string
*               description: fromId.
*             toId:
*               type: string
*               description: toId 
*             message:
*               type: integer
*               description: message.
*             comments:
*               type: string
*               description: comments.
*             files:
*               type: string
*               description: files 
*             price:
*               type: integer
*               description: price.
*             isRead:
*               type: string
*               description: isRead 
*             isActive:
*               type: integer
*               description: isActive.
*             type:
*               type: string
*               description: type 
*             created_at:
*               type: integer
*               description: created_at.
*       401:
*         description: Error
 */


// 21
/**
 * @swagger
 * /api/v2/app/uploadGalleryPic:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: uploadGalleryPic
 *     summary: Uploading a Gallery Pic [passing authorization Header also] [-21]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: files
 *         description: Choose uploaded gallery image 
 *         in: formData
 *         required: true
 *         type: file
 *       - name: EnqId
 *         description: Enter the enquiry Id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: userId
 *         description: Enter the user Id
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 22
/**
 * @swagger
 * /api/v2/app/addGalleryComment:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: addGalleryComment
 *     summary: Adding a Gallery Comment [passing authorization Header also] [-22]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","EnqId":"2","ids":"1,2","comments":"hello,User"} [ids->should be comma seprated,comments->should be comma seprated] 
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 23
/**
 * @swagger
 * /api/v2/app/getGalleryComment:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: getGalleryComment
 *     summary: getting a Gallery Comment [passing authorization Header also] [-23]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","EnqId":"2"}
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
*             EnqId:
*               type: integer
*               description: EnqId 
*             fromId:
*               type: string
*               description: fromId.
*             toId:
*               type: string
*               description: toId 
*             message:
*               type: integer
*               description: message.
*             comments:
*               type: string
*               description: comments.
*             files:
*               type: string
*               description: files 
*             price:
*               type: integer
*               description: price.
*             isRead:
*               type: string
*               description: isRead 
*             isActive:
*               type: integer
*               description: isActive.
*             type:
*               type: string
*               description: type 
*             created_at:
*               type: integer
*               description: created_at.
*       401:
*         description: Error
 */



// 24
/**
 * @swagger
 * /api/v2/app/addGalleryPrice:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: addGalleryPrice
 *     summary: Adding a Gallery Price [passing authorization Header also] [-24]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","EnqId":"2","ids":"1,2","prices":"10,20"} [ids->should be comma seprated,prices->should be comma seprated] 
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */



// 25
/**
 * @swagger
 * /api/v2/app/getGalleryPrice:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: getGalleryPrice
 *     summary: getting a Gallery Price [passing authorization Header also] [-25]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","EnqId":"2"}
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
*             EnqId:
*               type: integer
*               description: EnqId 
*             fromId:
*               type: string
*               description: fromId.
*             toId:
*               type: string
*               description: toId 
*             message:
*               type: integer
*               description: message.
*             comments:
*               type: string
*               description: comments.
*             files:
*               type: string
*               description: files 
*             price:
*               type: integer
*               description: price.
*             isRead:
*               type: string
*               description: isRead 
*             isActive:
*               type: integer
*               description: isActive.
*             type:
*               type: string
*               description: type 
*             created_at:
*               type: integer
*               description: created_at.

*       401:
*         description: Error
 */


// 26
/**
 * @swagger
 * /api/v2/app/addProductionTracker:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: addProductionTracker
 *     summary: Adding a Production Tracker  [passing authorization Header also] [-26]
 *     consumes:
 *       - application/json
 *     parameters: 
 *       - name: files
 *         description: Choose uploaded files  [it shuld be multiple]
 *         in: formData
 *         required: true
 *         type: file
 *       - name: orderId
 *         description: Enter the orderId
 *         in: formData
 *         required: true
 *         type: string
 *       - name: productionStatus
 *         description: Enter Production Status like 10,20 [Number]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: paymentStatus
 *         description: Enter Payment Status like 10,20 [Number]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: image_ids
 *         description: enter the file ids which your have to remove
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 27
/**
 * @swagger
 * /api/v2/app/getProductionTracker:
 *   get:
 *     tags:
 *      - APP V2 API LIST
 *     name: getProductionTracker
 *     summary: getting a Production Tracker [passing authorization Header also] [-27]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"userId":"158","orderId":"2"}
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
*             productionStatus:
*               type: string
*               description: productionStatus 
*             paymentStatus:
*               type: string
*               description: paymentStatus.
*             created_at:
*               type: string
*               description: created_at 
*             deliveryDate:
*               type: string
*               description: deliveryDate.
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
*         description: Error
 */


// 28
/**
 * @swagger
 * /api/v2/app/delGalleryPic:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: delGalleryPic
 *     summary: deleting a GalleryPic [passing authorization Header also] [-28]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"id":"158"}
 *         in: body
 *         required: true
 *         type: object
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 29
/**
* @swagger
* /api/v2/app/getOnboarding:
*   get:
*     tags:
*       - APP V2 API LIST
*     name: getOnboarding
*     summary: Getting a Onboarding list  -[29]
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
*             ranking:
*               type: string
*               description: ranking 
*             image:
*               type: string
*               description: image.
*             description:
*               type: string
*               description: description 
*             language:
*               type: string
*               description: language.
*             isActive:
*               type: string
*               description: isActive 
*             created_at:
*               type: string
*               description: created_at.
*             url:
*               type: string
*               description: url 
*             type:
*               type: string
*               description: type.
*       401:
*         description: Bad Request
*/

// 30
/**
 * @swagger
 * /api/v2/app/getMyShop:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getMyShop
 *     summary: getMyShop  [passing authorization Header also] -[30] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: limit
 *         description: enter the limit of the product
 *         in: query
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             totalCount:
*               type: integer
*               description: totalCount.
*             res:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: id
*                name:
*                 type: string
*                 description: name
*                amount:
*                 type: string
*                 description: amount
*                inventoryQty:
*                 type: string
*                 description: inventoryQty
*                doableQty:
*                 type: string
*                 description: doableQty
*                description:
*                 type: string
*                 description: description
*                ideal:
*                 type: string
*                 description: ideal
*                image:
*                 type: string
*                 description: image
*       401:
*         description: Error
 */

// 31
/**
 * @swagger
 * /api/v2/app/getLiveProduct:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getLiveProduct
 *     summary: getLiveProduct  [passing authorization Header also] -[31] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: limit
 *         description: enter the limit of the product
 *         in: query
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             totalCount:
*               type: integer
*               description: totalCount.
*             res:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: id
*                name:
*                 type: string
*                 description: name
*                amount:
*                 type: string
*                 description: amount
*                inventoryQty:
*                 type: string
*                 description: inventoryQty
*                doableQty:
*                 type: string
*                 description: doableQty
*                description:
*                 type: string
*                 description: description
*                ideal:
*                 type: string
*                 description: ideal
*                image:
*                 type: string
*                 description: image
*       401:
*         description: Error
 */


// 32
/**
 * @swagger
 * /api/v2/app/getProductDetail:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getProductDetail
 *     summary: getProductDetail  [passing authorization Header also] -[32] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: id
 *         description: enter the prioudct Id which wan't be pass
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
*             amount:
*               type: integer
*               description: amount.
*             description:
*               type: string
*               description: Product description .
*             inventoryQty:
*               type: string
*               description: inventoryQty
*             ideal:
*               type: string
*               description: ideal.
*             doableQty:
*               type: integer
*               description: doableQty.
*             material:
*               type: string
*               description: material.
*             searchTags:
*               type: integer
*               description: searchTags.
*             materialName:
*               type: string
*               description: materialName.
*             craftName:
*               type: integer
*               description: craftName.
*             image:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: Record Id
*                image:
*                 type: string
*                 description: Image URL
*       401:
*         description: Error
 */


// 33
/**
 * @swagger
 * /api/v2/app/addEditProduct:
 *   post:
 *     tags:
 *      - APP V2 API LIST
 *     name: addEditProduct
 *     summary: add or updateing a product  [passing authorization Header also] [-33]
 *     consumes:
 *       - application/json
 *     parameters: 
 *       - name: files
 *         description: Choose uploaded  product image  it should be multiple
 *         in: formData
 *         required: true
 *         type: file
 *       - name: name
 *         description: Enter the product Name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         description: Enter the product amount or price
 *         in: formData
 *         required: true
 *         type: string
 *       - name: inventoryQty
 *         description: Enter  product inventoryQty 
 *         in: formData
 *         required: true
 *         type: string
 *       - name: doableQty
 *         description: Enter product doableQty
 *         in: formData
 *         required: true
 *         type: string
 *       - name: material
 *         description: Enter product matrial  [given a material id]
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: Enter product description 
 *         in: formData
 *         required: true
 *         type: string
 *       - name: searchTags
 *         description: Enter product searchTags 
 *         in: formData
 *         required: true
 *         type: string
 *       - name: id
 *         description: Enter product id [only edit case]
 *         in: formData
 *         required: false
 *         type: string
  *       - name: image_ids
 *         description: Enter product image_ids  which you wan't to remove [only edit case]
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 34
/**
 * @swagger
 * /api/v2/app/getIdealShop:
 *   post:
 *     tags:
 *       - APP V2 API LIST
 *     name: getIdealShop
 *     summary: getIdealShop  [passing authorization Header also] -[34] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: (type=> 1->for craft,2=>material ,search =>ids comma seperated) Request Sample {"type":"2","limit":"1","search":"21"} 
 *         in: body
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             totalCount:
*               type: integer
*               description: totalCount.
*             list:
*               type: object
*               properties:
*                id:
*                 type: integer
*                 description: id
*                name:
*                 type: string
*                 description: name
*       401:
*         description: Error
 */


// 35
/**
 * @swagger
 * /api/v2/app/getAwards:
 *   post:
 *     tags:
 *       - APP V2 API LIST
 *     name: getAwards
 *     summary: getAwards  [passing authorization Header also] -[35] 
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
*               type: integer
*               description: title.
*             totalAwards:
*               type: string
*               description: totalAwards .
*             userId:
*               type: string
*               description: userId 
*             isActive:
*               type: integer
*               description: isActive.
*             isPublished:
*               type: string
*               description: isPublished.
*             created_at:
*               type: string
*               description: created_at.
*       401:
*         description: Error
 */

// 36
/**
 * @swagger
 * /api/v2/app/addAwards:
 *   post:
 *     tags:
 *       - APP V2 API LIST
 *     name: addAwards
 *     summary: addAwards  [passing authorization Header also] -[36] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: title
 *         description: enter the award title
 *         in: formData
 *         required: true
 *         type: string  
 *       - name: image
 *         description: choose the award image
 *         in: formData
 *         required: true
 *         type: file  
 *       - name: id
 *         description: enter the record id which you have to edit
 *         in: formData
 *         required: false
 *         type: string  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 37
/**
 * @swagger
 * /api/v2/app/getAwardsDetails:
 *   post:
 *     tags:
 *       - APP V2 API LIST
 *     name: getAwardsDetails
 *     summary: getAwardsDetails  [passing authorization Header also] -[37] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"id":"2"} 
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
*             image:
*               type: string
*               description: image 
*             title:
*               type: integer
*               description: title.
*             totalAwards:
*               type: string
*               description: totalAwards .
*             userId:
*               type: string
*               description: userId 
*             isActive:
*               type: integer
*               description: isActive.
*             isPublished:
*               type: string
*               description: isPublished.
*             created_at:
*               type: string
*               description: created_at.
*       401:
*         description: Error
 */

// 38
/**
 * @swagger
 * /api/v2/app/getNewsFeed:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getNewsFeed
 *     summary: getNewsFeed  [passing authorization Header also] -[38] 
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
*               type: integer
*               description: title.
*             description:
*               type: string
*               description: description .
*             userId:
*               type: string
*               description: userId 
*             isActive:
*               type: integer
*               description: isActive.
*             isPublished:
*               type: string
*               description: isPublished.
*             created_at:
*               type: string
*               description: created_at.
*             url:
*               type: string
*               description: url.
*             type:
*               type: string
*               description: type.
*       401:
*         description: Error
 */


// 39
/**
 * @swagger
 * /api/v2/app/addMyGallery:
 *   post:
 *     tags:
 *       - APP V2 API LIST
 *     name: addMyGallery
 *     summary: addMyGallery  [passing authorization Header also] -[39] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: title
 *         description: enter the gallery title
 *         in: formData
 *         required: true
 *         type: string  
 *       - name: image
 *         description: choose the gallery image
 *         in: formData
 *         required: true
 *         type: file  
 *       - name: id
 *         description: enter the record id which you have to edit
 *         in: formData
 *         required: false
 *         type: string  
 *       - name: image_ids
 *         description: enter the images id which you have to remove [it shiuld be comma seperated]
 *         in: formData
 *         required: false
 *         type: string  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 40
/**
 * @swagger
 * /api/v2/app/getMyGalleryList:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getMyGalleryList
 *     summary: getMyGalleryList  [passing authorization Header also] -[40] 
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
*               type: integer
*               description: title.
*       401:
*         description: Error
 */

// 41
/**
 * @swagger
 * /api/v2/app/getMyGalleryDetails:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getMyGalleryDetails
 *     summary: getMyGalleryDetails  [passing authorization Header also] -[41] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"id":"2"} 
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
*             image:
*               type: string
*               description: image 
*             title:
*               type: integer
*               description: title.
*       401:
*         description: Error
 */


// 42
/**
 * @swagger
 * /api/v2/app/getNotificationList:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: getNotificationList
 *     summary: getNotificationList  [passing authorization Header also] -[42] 
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
*               description: created_at.
*             notiDate:
*               type: string
*               description: notiDate.
*       401:
*         description: Error
 */


// 43
/**
 * @swagger
 * /api/v2/app/clearNotification:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: clearNotification
 *     summary: clearNotification  [passing authorization Header also] -[43] 
 *     consumes:
 *       - application/json 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */

// 44
/**
 * @swagger
 * /api/v2/app/sendOTP:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: sendOTP
 *     summary: sendOTP /resentOtp  -[44] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"mobile":"9090990090"} 
 *         in: query
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 45
/**
 * @swagger
 * /api/v2/app/otpVerified:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: otpVerified
 *     summary: otpVerified   -[45] 
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request Sample {"mobile":"9090990090","otp":"900909"} 
 *         in: query
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 46
/**
 * @swagger
 * /api/v2/app/logout:
 *   get:
 *     tags:
 *       - APP V2 API LIST
 *     name: logout
 *     summary: logout [passing authorization Header also]  -[46] 
 *     consumes:
 *       - application/json  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */