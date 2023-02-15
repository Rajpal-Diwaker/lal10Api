
// 1 
/**
 * @swagger
 * /api/v2/web/login:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: Login
 *     summary: Login to the application   -[1]
 *     description: sample request { "email":"rajpal@gmail.com", "password":"123456" }	
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample { "email":"rajpal@gmail.com", "password":"123456" }
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success 
*         schema:
*           type: object
*           properties:
*             userId:
*               type: integer
*               description: Record Id.
*             authorization:
*               type: string
*               description: Authorization Token Given.
*             storeName:
*               type: string
*               description: Store Name.
*             fullName:
*               type: string
*               description: fullName.
*             firstName:
*               type: string
*               description: firstName.
*             lastName:
*               type: string
*               description: lastName.
*             profileImage:
*               type: string
*               description: profileImage url.
*             email:
*               type: string
*               description: email.
*             mobile:
*               type: string
*               description: mobile.
*             countryCode:
*               type: string
*               description: countryCode.
*             is_verified:
*               type: string
*               description: is_verified.
*       401:
*         description: Bad Request
 */


// 2
/**
* @swagger
* /api/v2/web/typeOfStore:
*   get:
*     tags:
*       - WEBSITE V2 API LIST
*     name: TypeOfStore
*     summary: Type of Store  -[2]
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
*             name:
*               type: string
*               description: name.
*             icon:
*               type: string
*               description: Icon Url.
*             description:
*               type: string
*               description: description.
*             isActive:
*               type: string
*               description: isActive.
*             created_at:
*               type: string
*               description: created_at.
*       401:
*         description: Bad Request
*/

// 3
/**
 * @swagger
 * /api/v2/web/signUp:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: signUp
 *     summary: Registration to the application  -[3]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"name":"Mohan Kumar","name2":"Mohan Kumar","email":"abc1@gmail.com1","mobile":"96674772268","password":"123456","country":"India","phone":"89898989891","typeofstore":"Brick And Morter","store":"RAJPAL 123 PRIVATE limited","year":"5 Year 123 ","bussiness":"cotton Product 123","postalCode":"898989 123","websiteUrl":"abc.com 123","description":"Hello Every one how are you 123","hearabout":"1,2,3,4","category":"1,2,5","customerImportant":"Home Made"}
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Bad Request
 */


// 4
/**
 * @swagger
 * /api/v2/web/checkemail:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: checkemail
 *     summary: check user email Exit or not   -[4]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"abcd@gmail.com"}	
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: This email exist please try again
 */


// 5
/**
 * @swagger
 * /api/v2/web/checkUserMobile:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: checkUserMobile
 *     summary: check user mobile Exit or not   -[5]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"mobile":"92980899898"}	
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: This mobile no exist please try again
 */

// 6
/**
 * @swagger
 * /api/v2/web/hearAboutUs:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: signUp
 *     summary: How did you hear about us   -[6]
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
*             type:
*               type: string
*               description: type.
*             created_at:
*               type: string
*               description: created_at.
*       401:
*         description: Error
 */

// 7
/**
 * @swagger
 * /api/v2/web/getProductList:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getProductList
 *     summary: getting a Product List  -[7]
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
*               description: Title.
*             image:
*               type: string
*               description: Image URL.
*       401:
*         description: Error
 */

// 8
/**
 * @swagger
 * /api/v2/web/forgotPassword:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: forgotPassword
 *     summary: Forgot Password  Api  -[8]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"acb@gmail.com"}	
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: An email with generate new password link has been sent on registered emai
*       401:
*         description: Invalid email.
 */


// 9
/**
 * @swagger
 * /api/v2/web/resetPassword: 
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: resetPassword
 *     summary: Update the user password changed to the application  -[9]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"link":"XOyTgRsYd84DeKOqEpEmmZtUFZ7R3ldw","newPassword":"123"}	
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: User password changed successfully
*       401:
*         description: Invalid old password.
 */

// 10
/**
 * @swagger
 * /api/v2/web/changePassword:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: changePassword
 *     summary: Change user password to the application [passing authorization Header also]  -[10]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request
 *         description: Request sample {"newPassword":"123456","oldPassword":"123456"}	
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: User password changed successfully.
*       401:
*         description: Error.
 */

// 11
/**
 * @swagger
 * /api/v2/web/getCategory:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getCategory
 *     summary: Getting a Category List  -[11]
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
*             parentId:
*               type: integer
*               description: parentId.
*             image:
*               type: string
*               description: Image URL.
*             subcategory:
*               type: object
*               properties:
*                 id:
*                  type: integer
*                  description: Record Id.
*                 title:
*                  type: string
*                  description: title.
*                 parentId:
*                  type: integer
*                  description: parentId.
*                 image:
*                  type: string
*                  description: Image Url.
*                 subsubcategory:
*                  type: object
*                  properties:
*                     id:
*                       type: integer
*                       description: Record Id.
*                     title:
*                       type: string
*                       description: title.
*                     parentId:
*                       type: integer
*                       description: parentId.
*                     image:
*                      type: string
*                      description: Image Url.
*                     subsubsubcategory:
*                      type: object
*                      properties:
*                         id:
*                           type: integer
*                           description: Record Id.
*                         title:
*                           type: string
*                           description: title.
*                         parentId:
*                           type: integer
*                           description: parentId.
*                         image:
*                           type: string
*                           description: Image Url.
*       401:
*         description: Error.
 */


// 12
/**
 * @swagger
 * /api/v2/web/getSubCategory:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getSubCategory
 *     summary: Getting a Category SubCategory List  -[12]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"categoryId":"2"}	
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
*               description: Record Id.
*             title:
*               type: string
*               description: title.
*             parentId:
*               type: integer
*               description: parentId.
*             image:
*               type: string
*               description: Image URL.
*       401:
*         description: Error
 */


// 13
/**
 * @swagger
 * /api/v2/web/getCategoryProduct:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getCategoryProduct
 *     summary: Getting a Category Product List  live and Non libve Product List  -[13]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"categoryId":"2","subcategoryId":"11","price","100,100","craftId":"1","materialId":"2"}
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
*             name:
*               type: string
*               description: Product name 
*             amount:
*               type: integer
*               description: amount.
*             description:
*               type: string
*               description: Product description .
*             plive:
*               type: integer
*               description: plive.
*             inventoryQty:
*               type: string
*               description: inventoryQty
*             ideal:
*               type: string
*               description: ideal.
*             craft:
*               type: integer
*               description: craft
*             material:
*               type: integer
*               description: material.
*             categoryId:
*               type: integer
*               description: categoryId
*             image:
*               type: string
*               description: image.
*             subcategoryId:
*               type: string
*               description: subcategoryId
*             title:
*               type: string
*               description: title.
*             banner:
*               type: string
*               description: banner URL.
*       401:
*         description: Error
 */


// 14
/**
 * @swagger
 * /api/v2/web/getProductDetails:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getProductDetails
 *     summary: Getting a Product Details  -[14]
 *     consumes:
 *       - application/json 
 *     parameters:
  *       - name: productId
 *         description: Request sample {"productId":"1"}	
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
*             productName:
*               type: string
*               description: productName 
*             amount:
*               type: integer
*               description: amount.
*             description:
*               type: string
*               description: Product description .
*             plive:
*               type: integer
*               description: plive.
*             inventoryQty:
*               type: string
*               description: inventoryQty
*             ideal:
*               type: string
*               description: ideal.
*             ArtisanName:
*               type: string
*               description: ArtisanName
*             categoryId:
*               type: integer
*               description: categoryId
*             subcategoryId:
*               type: string
*               description: subcategoryId
*             doableQty:
*               type: integer
*               description: doableQty.
*             Cart:
*               type: integer
*               description: Cart checking product on cart or not
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

// 15
/**
 * @swagger
 * /api/v2/web/sendEnquiry:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: sendEnquiry
 *     summary: Send Enquiry   -[15]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"productsEnq":[{"description":"sdf","expPrice":"332","id":13,"productId":72,"qty":65},{"description":"eeeee","expPrice":"23","id":29,"productId":75,"qty":1}]}	 // id for cart id
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 16
/**
 * @swagger
 * /api/v2/web/getCartData:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getCartData
 *     summary: Getting a Cart list [passing authorization Header also]  -[16]
 *     consumes:
 *       - application/json 
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             getliveShopCart:
*               type: object
*               properties:
*                  id:
*                    type: integer
*                    description: id 
*                  productId:
*                    type: integer
*                    description: productId 
*                  name:
*                    type: string
*                    description: Product Name 
*                  qty:
*                    type: integer
*                    description: qty 
*                  amount:
*                    type: integer
*                    description: amount 
*                  uniqueId:
*                    type: string
*                    description: Cart uniqueId 
*                  description:
*                    type: string
*                    description: description 
*                  expPrice:
*                    type: integer
*                    description: expPrice
*                  image:
*                    type: string
*                    description: image Url
*             EnquiryCart:
*               type: object
*               properties:
*                  id:
*                    type: integer
*                    description: id 
*                  productId:
*                    type: integer
*                    description: productId 
*                  name:
*                    type: string
*                    description: Product Name 
*                  qty:
*                    type: integer
*                    description: qty 
*                  amount:
*                    type: integer
*                    description: amount 
*                  uniqueId:
*                    type: string
*                    description: Cart uniqueId 
*                  description:
*                    type: string
*                    description: description 
*                  expPrice:
*                    type: integer
*                    description: expPrice
*                  image:
*                    type: string
*                    description: image Url
*             isEmailVerified:
*               type: string
*               description: isEmailVerified [0,1]

*       401:
*         description: Error
 */


// 17
/**
 * @swagger
 * /api/v2/web/removeCartData:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: removeCartData
 *     summary: removing a cart data [passing authorization Header also]  -[17]
 *     consumes:
 *       - application/json 
 *     parameters:
  *       - name: Request
 *         description: Request sample {"id":"4"}	 // id for cart id
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
 * /api/v2/web/updateCartData:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: updateCartData
 *     summary: Updating a cart product qty  [passing authorization Header also]  -[18]
 *     consumes:
 *       - application/json 
 *     parameters:
  *       - name: Request
 *         description: Request sample {"id":"4","qty":"15","description":"asdbjsad","expPrice":}	id->cart id
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
 * /api/v2/web/getonBoarding:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getonBoarding
 *     summary: Getting a onboarding -[19]
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
*               type: integer
*               description: ranking 
*             description:
*               type: string
*               description: description.
*             language:
*               type: string
*               description: language.
*             image:
*               type: string
*               description: image URL
*             isActive:
*               type: integer
*               description: isActive.
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
*         description: Error
 */

// 20
/**
 * @swagger
 * /api/v2/web/subscribe:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: subscribe
 *     summary: subscribe  -[20]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"email":"abcd@gmail.com"}	
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */




// 21
/**
 * @swagger
 * /api/v2/web/getBrand:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getBrand
 *     summary: Getting a Brand list -[21]
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
*             brandName:
*               type: string
*               description: brandName 
*             logo:
*               type: string
*               description: logo.
*             userId:
*               type: integer
*               description: userId.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: integer
*               description: isActive.
*       401:
*         description: Error
 */


// 22
/**
 * @swagger
 * /api/v2/web/getBanner:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getBanner
 *     summary: Getting a Banner list -[22]
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
*             description:
*               type: string
*               description: description.
*             title:
*               type: string
*               description: title.
*             link:
*               type: string
*               description: link.
*             name:
*               type: string
*               description: name.
*             viewType:
*               type: string
*               description: viewType.
*             deleted:
*               type: string
*               description: deleted.
*             seqId:
*               type: integer
*               description: seqId.
*             created_at:
*               type: string
*               description: created_at.
*             isActive:
*               type: integer
*               description: isActive.
*       401:
*         description: Error
 */


// 23
/**
 * @swagger
 * /api/v2/web/getCraftMatrialList:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getCraftMatrialList
 *     summary: getCraftMatrialList  -[23]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: type
 *         description: Enter type ex type=craft,material
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
*             image:
*               type: string
*               description: image.
*       401:
*         description: Error
 */


// 24
/**
 * @swagger
 * /api/v2/web/sendEnquiryWithoutLogin:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: sendEnquiryWithoutLogin
 *     summary: Send Enquiry   -[24]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: name
 *         description: Enter name .
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: mobile
 *         description: Enter mobile or phone .
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: store
 *         description: Enter store name or company name .
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: email
 *         description: Enter email.
 *         in: formData
 *         required: true
 *         type: string  
 *       - name: files
 *         description: Choose Attachment.
 *         in: formData
 *         required: true
 *         type: file
 *       - name: productName
 *         description: Enter the productName .
 *         in: formData
 *         required: true
 *         type: string  
 *       - name: description
 *         description: Enter the description .
 *         in: formData
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 25
/**
 * @swagger
 * /api/v2/web/masterSearch:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: masterSearch
 *     summary: masterSearch  -[25]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: search
 *         description: Enter which you want to search  ex- categoryName,subcategoryName,productName,description,title
 *         in: query
 *         required: true
 *         type: string  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             Liveproduct:
*               type: object
*               properties:
*                  id:
*                    type: integer
*                    description: id 
*                  name:
*                    type: string
*                    description: Product Name 
*                  amount:
*                    type: integer
*                    description: amount 
*                  description:
*                    type: string
*                    description: description
*                  plive:
*                    type: integer
*                    description: plive 
*                  inventoryQty:
*                    type: integer
*                    description: inventoryQty
*                  ideal:
*                    type: string
*                    description: ideal
*                  craft:
*                    type: integer
*                    description: craft
*                  material:
*                    type: integer
*                    description: material
*                  image:
*                    type: string
*                    description: image
*                  categoryId:
*                    type: string
*                    description: categoryId
*                  subcategoryId:
*                    type: string
*                    description: subcategoryId
*                  categoryName:
*                    type: string
*                    description: categoryName
*             Nonliveproduct:
*               type: object
*               properties:
*                  id:
*                    type: integer
*                    description: id 
*                  name:
*                    type: string
*                    description: Product Name 
*                  amount:
*                    type: integer
*                    description: amount 
*                  description:
*                    type: string
*                    description: description
*                  plive:
*                    type: integer
*                    description: plive 
*                  inventoryQty:
*                    type: integer
*                    description: inventoryQty
*                  ideal:
*                    type: string
*                    description: ideal
*                  craft:
*                    type: integer
*                    description: craft
*                  material:
*                    type: integer
*                    description: material
*                  image:
*                    type: string
*                    description: image
*                  categoryId:
*                    type: string
*                    description: categoryId
*                  subcategoryId:
*                    type: string
*                    description: subcategoryId
*                  categoryName:
*                    type: string
*                    description: categoryName
*       401:
*         description: Error
 */


// 26
/**
 * @swagger
 * /api/v2/web/addToCart:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: addToCart
 *     summary: addToCart  [passing authorization Header also]-[26]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"qty":"1","productId":"1"}	
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 27
/**
 * @swagger
 * /api/v2/web/addAddress:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: addAddress
 *     summary: addAddress [only edit case id passing ] [passing authorization Header also]-[27]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"101","name":"name111","mobNo":"123456","addLine1":"addLine11","street":"street1","countryId":"India","stateId":"Delhi","cityId":"Rishikesh","zip":"249201","addressType":"others","addressName":"addressName",“latlong”:”30.086927,78.267609”}	
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 28
/**
 * @swagger
 * /api/v2/web/getAddress:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: addAddress
 *     summary: getAddress  [passing authorization Header also]-[28]
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
*             name:
*               type: string
*               description: name 
*             countryId:
*               type: string
*               description: countryId.
*             street:
*               type: string
*               description: street.
*             cityId:
*               type: string
*               description: cityId 
*             stateId:
*               type: string
*               description: stateId.
*             zip:
*               type: string
*               description: zip.
*             mobNo:
*               type: string
*               description: mobNo 
*             defaultAdd:
*               type: string
*               description: defaultAdd.
*             userId:
*               type: integer
*               description: userId.
*             created_at:
*               type: string
*               description: created_at.
*             addressType:
*               type: string
*               description: addressType.
*             addressName:
*               type: string
*               description: addressName.
*             latlong:
*               type: string
*               description: latlong.
*       401:
*         description: Error
 */



// 29
/**
 * @swagger
 * /api/v2/web/addCardData:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: addCardData
 *     summary: addCardData   [passing authorization Header also]-[29]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"name":"RAJPAL","cardNo":"123412341234","expiry":"02/23","bankName":"HDFC BANCK DELHI"}	
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 30
/**
 * @swagger
 * /api/v2/web/getCardData:
 *   get:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: getCardData
 *     summary: getCardData  [passing authorization Header also]-[30]
 *     consumes:
 *       - application/json  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 31
/**
 * @swagger
 * /api/v2/web/removeData:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: removeData
 *     summary: removeData [passing authorization Header also]-[31]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"1","type":"card" [type-> card,address]}	
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 32
/**
 * @swagger
 * /api/v2/web/editPersonalDetails:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: editPersonalDetails
 *     summary: editPersonalDetails [passing authorization Header also]-[32]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"name":"Raj","name2":"Pal" }	
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */

// 33
/**
 * @swagger
 * /api/v2/web/editBussinessDetails:
 *   post:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: editBussinessDetails
 *     summary: editBussinessDetails [passing authorization Header also]-[33]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"store":"123456"}
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */

// 34
/**
 * @swagger
 * /api/v2/web/viewProfileDetails:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: viewProfileDetails
 *     summary: viewProfileDetails [passing authorization Header also]-[34]
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
*             name:
*               type: string
*               description: name 
*             name2:
*               type: string
*               description: name2 
*             mobile:
*               type: string
*               description: mobile 
*             email:
*               type: string
*               description: email 
*             profileImage:
*               type: string
*               description: profileImage.
*       401:
*         description: Error
 */


// 35
/**
 * @swagger
 * /api/v2/web/getliveShop:
 *   post:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getliveShop
 *     summary: getliveShop [passing authorization Header also]-[35]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"sortBy":"1"[1->order descding or 2->amount aseding]}
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 35
/**
 * @swagger
 * /api/v2/web/getliveShop:
 *   post:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getliveShop
 *     summary: getliveShop -[35]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"sortBy":"1"}  /// sortBy 1->amount asendig order 2->desceding order
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
*               description: id 
*             name:
*               type: string
*               description: Product Name 
*             amount:
*               type: integer
*               description: amount 
*             description:
*               type: string
*               description: description
*             plive:
*               type: integer
*               description: plive 
*             inventoryQty:
*               type: integer
*               description: inventoryQty
*             ideal:
*               type: string
*               description: ideal
*             craft:
*               type: integer
*               description: craft
*             material:
*               type: integer
*               description: material
*             image:
*               type: string
*               description: image
*             categoryId:
*               type: string
*               description: categoryId
*             subcategoryId:
*               type: string
*               description: subcategoryId
*       401:
*         description: Error
 */

// 36
/**
 * @swagger
 * /api/v2/web/getEnquiryList:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getEnquiryList
 *     summary: getEnquiryList [passing authorization Header also]-[36]
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
*             productId:
*               type: integer
*               description: productId 
*             update_status:
*               type: string
*               description: update_status
*             title:
*               type: string
*               description: title 
*             description:
*               type: string
*               description: description 
*             qty:
*               type: string
*               description: qty
*             isGenrate:
*               type: string
*               description: isGenrate
*             expPrice:
*               type: integer
*               description: expPrice 
*             image:
*               type: string
*               description: image Url
*             created_at:
*               type: string
*               description: created_at
*       401:
*         description: Error
 */


// 37
/**
 * @swagger
 * /api/v2/web/getCountry:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getCountry
 *     summary: getCountry [passing authorization Header also]-[37]
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
*             sortname:
*               type: string
*               description: sortname
*             name:
*               type: string
*               description: name 
*             phonecode:
*               type: string
*               description: phonecode
*       401:
*         description: Error
 */


// 38
/**
 * @swagger
 * /api/v2/web/getState:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getState
 *     summary: getState -[38]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"country":"India"} 
 *         in: query
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
*               description: id 
*             name:
*               type: string
*               description: name
*             country_id:
*               type: integer
*               description: country_id 
*       401:
*         description: Error
 */


// 39
/**
 * @swagger
 * /api/v2/web/getCity:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getCity
 *     summary: getCity -[39]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"state":"Delhi"} 
 *         in: query
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
*               description: id 
*             name:
*               type: string
*               description: name
*             state_id:
*               type: integer
*               description: state_id 
*       401:
*         description: Error
 */


// 40
/**
 * @swagger
 * /api/v2/web/userVerify:
 *   post:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: userVerify
 *     summary: userVerify -[40]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"link":"sdfjbsdjf sdf hsdfbhsdbfhsdbfjsdhfjsdbhfsdbfhb"} 
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


 // 41
/**
 * @swagger
 * /api/v2/web/trackEnquiry:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: trackEnquiry
 *     summary: trackEnquiry -[41]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: id
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
*               description: id 
*             uniqueId:
*               type: string
*               description: uniqueId
*             productId:
*               type: integer
*               description: productId
*             update_status:
*               type: string
*               description: update_status 
*             title:
*               type: string
*               description: title
*             description:
*               type: string
*               description: description
*             qty:
*               type: string
*               description: qty 
*             expPrice:
*               type: string
*               description: expPrice
*             isGenrate:
*               type: integer
*               description: isGenrate
*             image:
*               type: string
*               description: image 
*             created_at:
*               type: string
*               description: created_at
*             created_at2:
*               type: string
*               description: created_at2
*       401:
*         description: Error
 */


 // 42
/**
 * @swagger
 * /api/v2/web/getOrderList:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getOrderList
 *     summary: getOrderList [passing authorization Header also]-[42]
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
*             productId:
*               type: integer
*               description: productId
*             update_status:
*               type: string
*               description: update_status 
*             title:
*               type: string
*               description: title
*             description:
*               type: string
*               description: description
*             qty:
*               type: string
*               description: qty 
*             expPrice:
*               type: string
*               description: expPrice
*             isGenrate:
*               type: integer
*               description: isGenrate
*             image:
*               type: string
*               description: image 
*             created_at:
*               type: string
*               description: created_at
*             created_at2:
*               type: string
*               description: created_at2
*       401:
*         description: Error
 */

// 43
/**
 * @swagger
 * /api/v2/web/trackOrder:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: trackOrder
 *     summary: trackOrder -[43]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: id
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
*               description: id 
*             uniqueId:
*               type: string
*               description: uniqueId
*             productId:
*               type: integer
*               description: productId
*             update_status:
*               type: string
*               description: update_status 
*             title:
*               type: string
*               description: title
*             description:
*               type: string
*               description: description
*             qty:
*               type: string
*               description: qty 
*             expPrice:
*               type: string
*               description: expPrice
*             isGenrate:
*               type: integer
*               description: isGenrate
*             image:
*               type: string
*               description: image 
*             created_at:
*               type: string
*               description: created_at
*             created_at2:
*               type: string
*               description: created_at2
*       401:
*         description: Error
 */


// 44
/**
 * @swagger
 * /api/v2/web/getFaq:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getFaq
 *     summary: getFaq -[44]
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
*             description:
*               type: string
*               description: description
*             title:
*               type: string
*               description: title
*             link:
*               type: string
*               description: link 
*             name:
*               type: string
*               description: name 
*       401:
*         description: Error
 */


// 45
/**
 * @swagger
 * /api/v2/web/checkOut:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: checkOut
 *     summary: checkOut -[45]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: id
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
*               description: id 
*             description:
*               type: string
*               description: description
*             code:
*               type: string
*               description: code [0->stock aviable,1->not in stock]
*             ProductName:
*               type: string
*               description: ProductName 
*       401:
*         description: Error
 */


// 46
/**
 * @swagger
 * /api/v2/web/OrderPlace:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: OrderPlace
 *     summary: OrderPlace -[46]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: request
 *         description: Request sample {"ids":"53,54","totalPrice":"800","addressId":"3"}
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             productId:
*               type: integer
*               description: productId 
*             userId:
*               type: integer
*               description: userId
*             uniqueId:
*               type: string
*               description: uniqueId
*             qty:
*               type: string
*               description: qty
*             addressId:
*               type: string
*               description: addressId
*             price:
*               type: integer
*               description: price
*             totalOrderPrice:
*               type: string
*               description: totalOrderPrice
*       401:
*         description: Error
 */

// 47
/**
 * @swagger
 * /api/v2/web/getNewsFeed:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getNewsFeed
 *     summary: getNewsFeed -[47]
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
*             description:
*               type: string
*               description: description
*             title:
*               type: string
*               description: title
*       401:
*         description: Error
 */

// 48
/**
 * @swagger
 * /api/v2/web/getExhibitionBanner:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getExhibitionBanner
 *     summary: getExhibitionBanner -[48]
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
*             description:
*               type: string
*               description: description
*             title:
*               type: string
*               description: title
*             link:
*               type: string
*               description: link
*       401:
*         description: Error
 */

// 49
/**
 * @swagger
 * /api/v2/web/get/avenue:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: get/avenue
 *     summary: get/avenue -[49]
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
*             amount:
*               type: string
*               description: amount
*             material:
*               type: string
*               description: material
*             created_at:
*               type: string
*               description: created_at
*             userId:
*               type: string
*               description: userId
*             image:
*               type: string
*               description: image
*             isActive:
*               type: string
*               description: isActive
*             description:
*               type: string
*               description: description
*             title:
*               type: string
*               description: title
*       401:
*         description: Error
 */

// 50
/**
 * @swagger
 * /api/v2/web/bestsellingProduct:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: bestsellingProduct
 *     summary: bestsellingProduct -[50]
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
*             description:
*               type: string
*               description: description
*             name:
*               type: string
*               description: name
*             amount:
*               type: string
*               description: amount
*             inventoryQty:
*               type: string
*               description: inventoryQty
*             material:
*               type: string
*               description: material
*             userId:
*               type: string
*               description: userId
*             isActive:
*               type: string
*               description: isActive
*             created_at:
*               type: string
*               description: created_at
*             searchTags:
*               type: string
*               description: searchTags
*             plive:
*               type: string
*               description: plive
*             doableQty:
*               type: string
*               description: doableQty
*             craft:
*               type: string
*               description: craft
*             categoryId:
*               type: string
*               description: categoryId
*             subcategoryId:
*               type: string
*               description: subcategoryId
*             publish:
*               type: string
*               description: publish
*             addingBestselling:
*               type: string
*               description: addingBestselling
*             addingBestsellingComment:
*               type: string
*               description: addingBestsellingComment
*             deleted:
*               type: string
*               description: deleted
*             verified:
*               type: string
*               description: verified
*             ideal:
*               type: string
*               description: ideal
*             sku:
*               type: string
*               description: sku
*             subsubcategoryId:
*               type: string
*               description: subsubcategoryId
*             vendorName:
*               type: string
*               description: vendorName
*             image:
*               type: string
*               description: image
*       401:
*         description: Error
 */

// 51
/**
 * @swagger
 * /api/v2/web/razorpay/order:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: /razorpay/order
 *     summary: /razorpay/order [passing authorization Header also] -[51]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: request
 *         description: Request sample {"amount":"400","name":"abcd"}
 *         in: body
 *         required: true
 *         type: object  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             value:
*               type: string
*               description: string 
*             name:
*               type: string
*               description: name
*       401:
*         description: Error
 */

 // 52
/**
 * @swagger
 * /api/v2/web/worldManufacturingr:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: worldManufacturing
 *     summary: worldManufacturing  -[52]
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
*             totalClients:
*               type: string
*               description: totalClients 
*             totalProject:
*               type: string
*               description: totalProject
*             insdustry:
*               type: string
*               description: insdustry
*             type:
*               type: string
*               description: type
*             isActive:
*               type: string
*               description: isActive 
*             deleted:
*               type: string
*               description: deleted
*             totalCountries:
*               type: string
*               description: totalCountries 
*       401:
*         description: Error
 */

  // 53
/**
 * @swagger
 * /api/v2/web/servicingIndia:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: servicingIndia
 *     summary: servicingIndia  -[53]
 *     consumes:
 *       - application/json  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             artisansWorked:
*               type: integer
*               description: artisansWorked 
*             productCategories:
*               type: string
*               description: productCategories 
*             packagingDelivered:
*               type: string
*               description: packagingDelivered 
*             countriesExported:
*               type: string
*               description: countriesExported 
*       401:
*         description: Error
 */

  // 54
/**
 * @swagger
 * /api/v2/web/customerFeedback:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: customerFeedback
 *     summary: customerFeedback  -[54]
 *     consumes:
 *       - application/json  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             customerName:
*               type: integer
*               description: customerName 
*             image:
*               type: string
*               description: image 
*             feedback:
*               type: string
*               description: feedback 
*       401:
*         description: Error
 */


// 55
/**
 * @swagger
 * /api/v2/web/serviceSector:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: serviceSector
 *     summary: serviceSector  -[55]
 *     consumes:
 *       - application/json  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             customerName:
*               type: integer
*               description: customerName 
*             image:
*               type: string
*               description: image 
*             feedback:
*               type: string
*               description: feedback 
*       401:
*         description: Error
 */

// 56
/**
 * @swagger
 * /api/v2/web/exhibition/user:
 *   post:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: /exhibition/user
 *     summary: /exhibition/user  -[56]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: Request
 *         description: Request sample {"name":"ABC","email":"email@gmail.com","mobile":"9090909090","exhibitionId":"12"}
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */



   // 57
/**
 * @swagger
 * /api/v2/web/indiaMap:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: indiaMap
 *     summary: indiaMap  -[57]
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
*             totalClients:
*               type: string
*               description: totalClients 
*             totalProject:
*               type: string
*               description: totalProject
*             insdustry:
*               type: string
*               description: insdustry
*             type:
*               type: string
*               description: type
*             isActive:
*               type: string
*               description: isActive 
*             deleted:
*               type: string
*               description: deleted
*             totalCountries:
*               type: string
*               description: totalCountries 
*       401:
*         description: Error
 */


  // 58
/**
 * @swagger
 * /api/v2/web/countryMap:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: countryMap
 *     summary: countryMap  -[58]
 *     consumes:
 *       - application/json  
 *     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             lat:
*               type: string
*               description: lat 
*             lng:
*               type: string
*               description: lng 
*             placeName:
*               type: string
*               description: placeName 
*       401:
*         description: Error
 */



 // 59
/**
 * @swagger
 * /api/v2/web/aboutUs:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: aboutUs
 *     summary: aboutUs -[59]
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
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive 
*             createdAt:
*               type: string
*               description: createdAt              
*       401:
*         description: Error
 */


 // 61
/**
 * @swagger
 * /api/v2/web/getBlogs:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getBlogs
 *     summary: getBlogs -[62]
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
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive 
*             createdAt:
*               type: string
*               description: createdAt 
*             image:
*               type: string
*               description: image 
*             link:
*               type: string
*               description: link 
*       401:
*         description: Error
 */

// 63
/**
 * @swagger
 * /api/v2/web/careers:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: careers
 *     summary: careers -[63]
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
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive 
*             createdAt:
*               type: string
*               description: createdAt 
*             position:
*               type: string
*               description: position 
*             totalOpening:
*               type: string
*               description: totalOpening 
*       401:
*         description: Error
 */


// 64
/**
 * @swagger
 * /api/v2/web/getCatalogue:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getCatalogue
 *     summary: getCatalogue -[64]
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
*             link:
*               type: string
*               description: link
*       401:
*         description: Error
 */


// 65
/**
 * @swagger
 * /api/v2/web/returnPolicy:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: returnPolicy
 *     summary: returnPolicy -[65]
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
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive 
*             createdAt:
*               type: string
*               description: createdAt
*       401:
*         description: Error
 */


// 66
/**
 * @swagger
 * /api/v2/web/updateLiveCartQty:
 *   post:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: updateLiveCartQty
 *     summary: updateLiveCartQty -[66]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"id":"51","qty":"14"}
 *         in: body
 *         required: true
 *         type: object 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 67
/**
 * @swagger
 * /api/v2/web/sendResume:
 *   post:
 *     tags:
 *      - WEBSITE V2 API LIST
 *     name: sendResume
 *     summary: sendResume   -[67]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - name: fullName
 *         description: Enter fullName .
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: mobile
 *         description: Enter mobile or phone .
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: subject
 *         description: Enter subject .
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: email
 *         description: Enter email.
 *         in: formData
 *         required: true
 *         type: string   
 *       - name: description
 *         description: Enter description.
 *         in: formData
 *         required: true
 *         type: string  
 *       - name: files
 *         description: Choose Attachment.
 *         in: formData
 *         required: true
 *         type: file 
 *     responses:
*       200:
*         description: Success
*       401:
*         description: Error
 */


// 67
/**
 * @swagger
 * /api/v2/web/getCustomerImportant:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: getCustomerImportant
 *     summary: getCustomerImportant -[65]
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
*             type:
*               type: string
*               description: Type of Store.
*             icon:
*               type: string
*               description: Icon Url.
*             created_at:
*               type: string
*               description: created Date.
*             country:
*               type: string
*               description: country.
*       401:
*         description: Error
 */


// 67
/**
 * @swagger
 * /api/v2/web/privacyPolicy:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: privacyPolicy
 *     summary: privacyPolicy -[67]
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
*             description:
*               type: string
*               description: description
*             isActive:
*               type: string
*               description: isActive 
*             createdAt:
*               type: string
*               description: createdAt
*       401:
*         description: Error
 */



// 68
/**
 * @swagger
 * /api/v2/web/category:
 *   get:
 *     tags:    
 *      - WEBSITE V2 API LIST
 *     name: category
 *     summary: category -[68]
 *     consumes:
 *       - application/json  
 *     parameters:
 *       - name: Request
 *         description: Request sample {"isBestSelling":"1"}
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
*         description: Error
 */
