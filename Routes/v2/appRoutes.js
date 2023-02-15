const express = require('express'),
    router = express.Router(),
    appService = require('../../Services/v2/appServices'),
    adminService = require('../../Services/v2/adminServices'),
    auth = require('../../middleware/auth'),
    permission = require('../../middleware/permission'),
    fileUploader = require('../../middleware/fileUploader');

// v1 api start
router.post('/login', appService.login)
router.post('/chooseLanguage',auth.verifyToken, appService.chooseLanguages)
router.post('/checkMobile', appService.checkMobile)
router.post('/signUp', appService.signUp)
router.post('/artisanPic',auth.verifyToken,appService.artisanPicuploads)
router.get('/states', appService.states)
router.get('/getCraftList', appService.getCraftList)
router.get('/getMatrialList', appService.getMatrialList)
router.get('/getProductList', appService.getProductList)
router.post('/completeSignUp', auth.verifyToken, appService.signUpStep2)
router.post('/viewProfile', auth.verifyToken, appService.viewProfile)
router.post('/checkEmail', appService.checkEmail)

// v2 api start
router.post('/enquiryList', auth.verifyToken,auth.userCheck,appService.enquiryList)
router.post('/orderList', auth.verifyToken,auth.userCheck,appService.orderList)
router.post('/editProfile', auth.verifyToken,appService.editProfile)

// chat image and video upload api
router.post('/uploadChatMedia',appService.uploadChatMedia)
router.post('/orderAcceptorReject', auth.verifyToken,auth.userCheck,appService.orderAcceptorReject)
router.post('/addlogisticDetails', auth.verifyToken,auth.userCheck,appService.addlogisticDetails)
router.get('/getlogisticDetails', auth.verifyToken,auth.userCheck,appService.getlogisticDetails)
router.post('/getGalleryPic', auth.verifyToken, auth.userCheck, appService.getGalleryPic)
router.post('/addGalleryPic', auth.verifyToken,appService.uploadGalleryPic)

router.post('/addGalleryComment', auth.verifyToken,auth.userCheck,appService.addGalleryComment)
router.post('/getGalleryComment', auth.verifyToken,auth.userCheck,appService.getGalleryComment)
router.post('/getGalleryPrice', auth.verifyToken, auth.userCheck, appService.getGalleryPrice)
router.post('/addGalleryPrice', auth.verifyToken, auth.userCheck,appService.addGalleryPrice)

router.post('/addProductionTracker', auth.verifyToken,auth.userCheck,appService.addProductionTracker)
router.get('/getProductionTracker', auth.verifyToken,auth.userCheck,appService.getProductionTracker);

router.post('/delGalleryPic', auth.verifyToken, auth.userCheck, appService.delGalleryPic)
router.get('/getOnboarding',appService.getOnboarding)

router.get('/getMyShop', auth.verifyToken,auth.userCheck,appService.getMyShop);
router.get('/getLiveProduct', auth.verifyToken,auth.userCheck,appService.getLiveProduct);

router.get('/getProductDetail', auth.verifyToken,auth.userCheck,appService.getProductDetail);
router.get('/getProductDetails', auth.verifyToken,auth.userCheck,appService.getProductDetail2);
router.post('/addEditProduct', auth.verifyToken,auth.userCheck,appService.addEditProduct);

router.get('/getTermsAndCondition',appService.getTermsAndCondition);
router.post('/getIdealShop', auth.verifyToken,auth.userCheck,appService.getIdealShop);

router.post('/addAwards', auth.verifyToken,auth.userCheck,appService.addAwards)
router.get('/getAwards', auth.verifyToken,auth.userCheck,appService.getAwards)
router.get('/getAwardsDetails', auth.verifyToken,auth.userCheck,appService.getAwardsDetails)

router.get('/getNewsFeed', auth.verifyToken,auth.userCheck,appService.getNewsFeed)
router.get('/viewInvoice', auth.verifyToken,auth.userCheck,appService.viewInvoice)

router.post('/addMyGallery', auth.verifyToken,auth.userCheck,appService.addMyGallery)
router.get('/getMyGalleryList', auth.verifyToken,auth.userCheck,appService.getMyGalleryList)
router.get('/getMyGalleryDetails', auth.verifyToken,auth.userCheck,appService.getMyGalleryDetails)

router.get('/getNotificationList', auth.verifyToken,auth.userCheck,appService.getNotificationList)
router.get('/clearNotification', auth.verifyToken,auth.userCheck,appService.clearNotification)

router.post('/sendOTP',appService.sendOTP)
router.post('/otpVerified',appService.otpVerified)

router.post('/invoice', auth.verifyToken, auth.userCheck, appService.generateInvoicePost);
router.get('/get/invoice', auth.verifyToken, auth.userCheck, appService.invoiceGet);
router.get('/get/dashboard', auth.verifyToken, auth.userCheck, appService.dashboardGet);
router.get('/product/logs', auth.verifyToken, auth.userCheck, appService.productLogGet);
router.get('/product/log/accept', auth.verifyToken, auth.userCheck, appService.productLogAcceptGet);

router.get('/getSupportList', appService.getSupportList);
router.post('/saveSupportTicket', auth.verifyToken, appService.saveSupportTicket);
router.get('/logout',auth.verifyToken, appService.logout);

router.post('/getManageListing',appService.getManageListing);

module.exports = router;



