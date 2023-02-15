const express = require('express'),
    router = express.Router(),
    webService = require('../../Services/v2/webServices'),
    adminService = require('../../Services/v2/adminServices'),
    auth = require('../../middleware/webauth'),
    fileUploader = require('../../middleware/fileUploaderS3'),
    razorpayService = require('../../Services/v2/razorpay')

// let mcache = require('memory-cache');

// let cache = (duration) => {
//     return (req, res, next) => {

//         console.log("req.originalUrl || req.url",req.originalUrl,"req.url",req.url)

//         let key = '__express__' + req.originalUrl || req.url
//         let cachedBody = mcache.get(key)
//         if (cachedBody) {
//         res.send(cachedBody)
//         return
//         } else {
//         res.sendResponse = res.send
//         res.send = (body) => {
//             mcache.put(key, body, duration * 1000);
//             res.sendResponse(body)
//         }
//         next()
//         }
//     }
//     }

router.post('/login', webService.login);
router.get('/typeOfStore', webService.typeOfStore);
router.post('/signUp', webService.signUp);
router.post('/checkemail',webService.checkemail);
router.post('/checkUserMobile',webService.checkUserMobile);
router.get('/hearAboutUs', webService.hearAboutUs);
router.get('/getProductList', webService.getProductList);
router.post('/forgotPassword', webService.forgotPassword);
router.post('/resetPassword', webService.resetPassword);
router.post('/changePassword',auth.verifyToken,webService.changePassword);
router.get('/getCategory', webService.getCategory);
router.post('/getSubCategory', webService.getSubCategory);
router.post('/getCategoryProduct', webService.getCategoryProduct);
router.get('/getProductDetails', webService.getProductDetails);
router.get('/getonBoarding',webService.getonBoarding);
router.post('/subscribe',webService.subscribe);
router.get('/getBrand',webService.getBrand);
router.get('/getBanner',webService.getBanner);
router.get('/getCraftMatrialList', webService.getCraftMatrialList)
router.post('/sendEnquiryWithoutLogin',auth.verifyToken,webService.sendEnquiryWithoutLogin)
router.get('/masterSearch', webService.masterSearch)
router.post('/addToCart',auth.verifyToken,webService.addToCart);
router.get('/getCartData',auth.verifyToken,webService.getCartData);
router.post('/removeCartData',auth.verifyToken,webService.removeCartData);
router.post('/updateCartData',auth.verifyToken,webService.updateCartData);
router.post('/sendEnquiry',auth.verifyToken,webService.sendEnquiry);
router.post('/addAddress',auth.verifyToken,webService.addAddress);
router.get('/getAddress',auth.verifyToken,webService.getAddress);
router.post('/addCardData',auth.verifyToken,webService.addCardData);
router.get('/getCardData',auth.verifyToken,webService.getCardData);
router.post('/removeData',auth.verifyToken,webService.removeData);
router.post('/editPersonalDetails',auth.verifyToken,webService.editPersonalDetails);
router.post('/editBussinessDetails',auth.verifyToken,webService.editBussinessDetails);
router.get('/viewProfileDetails',auth.verifyToken,webService.viewProfileDetails);
router.post('/profileImage',auth.verifyToken,webService.profileImage);
router.post('/getliveShop',webService.getliveShop);
router.get('/getEnquiryList',auth.verifyToken,webService.getEnquiryList);
router.get('/trackEnquiry',auth.verifyToken,webService.trackEnquiry);
router.get('/getCountry',webService.getCountry);
router.get('/getState',webService.getState);
router.get('/getCity',webService.getCity);
router.get('/userVerify',webService.userVerify);

router.get('/getOrderList',auth.verifyToken,webService.getOrderList);
router.get('/trackOrder',auth.verifyToken,webService.trackOrder);
router.get('/getFaq',webService.getFaq);
router.get('/checkOut',auth.verifyToken,webService.checkOut);
router.post('/OrderPlace',auth.verifyToken,webService.OrderPlace);
router.get('/getNewsFeed',webService.getNewsFeed);
router.get('/getExhibitionBanner',webService.getExhibitionBanner);
router.get('/get/avenue', adminService.storiesGet);
router.get('/bestsellingProduct',webService.bestsellingProduct);
router.post('/razorpay/order', auth.verifyToken, razorpayService.razorpayOrder);
router.get('/worldManufacturing', webService.worldManufacturing);
router.get('/servicingIndia', webService.servicingIndia);
router.get('/customerFeedback', webService.customerFeedback);
router.get('/serviceSector', webService.serviceSector);
router.get('/category', adminService.getCategory);
router.post('/exhibition/user', webService.exhibitionUserPost);
router.get('/indiaMap', webService.indiaMap);
router.get('/countryMap', webService.countryMap);
router.get('/aboutUs', webService.aboutUs);
router.get('/getBlogs', webService.getBlogs);
router.get('/careers', webService.careers);
router.get('/getCatalogue', webService.getCatalogue);
router.get('/returnPolicy', webService.returnPolicy);
router.get('/privacyPolicy', webService.privacyPolicy);
router.post('/updateLiveCartQty',auth.verifyToken,webService.updateLiveCartQty);
router.post('/sendResume',webService.sendResume);
router.get('/getCustomerImportant',webService.getCustomerImportant);
router.get('/subscribe2',webService.subscribe2);
router.get('/getAllsubcategory',webService.getAllsubcategory);
router.get('/rajpal',webService.rajpal);
router.get('/clearChache',webService.clearChache);

module.exports = router;

