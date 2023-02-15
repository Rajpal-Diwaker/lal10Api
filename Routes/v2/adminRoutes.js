const express = require('express'),
    router = express.Router(),
    adminService = require('../../Services/v2/adminServices'),
    adminAuth = require('../../middleware/adminAuth'),
    appService = require('../../Services/v2/appServices'),
    emailSync = require('../../emailSync/emailSync');

router.get('/dashboard', adminAuth.verifyToken, adminService.dashboard);

//v2 api start
router.get('/getEnquiries', adminAuth.verifyToken, adminService.getEnquiries);   //1->lead Enquiry,2->Email Enquiry,3->website Enquiry
router.get('/getEnquiryById', adminAuth.verifyToken, adminService.getEnquiryById);
router.post('/editEnquiry', adminAuth.verifyToken, adminService.editEnquiry);
router.post('/getWebUser', adminAuth.verifyToken, adminService.getWebUser);
router.get('/getWebUserById', adminAuth.verifyToken, adminService.getWebUserById);
router.get('/groupListing', adminAuth.verifyToken, adminService.GroupListing);
router.post('/groupListing2',adminAuth.verifyToken, adminService.GroupListing2);
router.get('/checkGroupName', adminAuth.verifyToken, adminService.checkGroupName);
router.post('/addGroup', adminAuth.verifyToken, adminService.addGroup);
router.post('/editGroup', adminAuth.verifyToken, adminService.editGroup);
router.get('/deleteGroup', adminAuth.verifyToken, adminService.deleteGroup);
router.post('/groupProductListing', adminAuth.verifyToken, adminService.ProductGroupListing);
router.get('/checkProductGroupName', adminAuth.verifyToken, adminService.checkProductGroupName);
router.post('/addProductGroup', adminAuth.verifyToken, adminService.addProductGroup);
router.post('/editProductGroup', adminAuth.verifyToken, adminService.editProductGroup);
router.get('/deleteProductGroup', adminAuth.verifyToken, adminService.deleteProductGroup);
router.get('/getCategory', adminAuth.verifyToken, adminService.getCategory);
router.get('/getSubCategory', adminAuth.verifyToken, adminService.getSubCategory);
router.get('/getSubSubCategory', adminAuth.verifyToken, adminService.getSubSubCategory);
router.post('/changeStatus', adminAuth.verifyToken, adminService.changeStatus);
router.post('/checkEmail', adminAuth.verifyToken, adminService.checkEmail)
router.post('/checkMobile',adminAuth.verifyToken, adminService.checkMobile)
router.post('/addCategory', adminAuth.verifyToken, adminService.addCategory);
router.post('/editCategory', adminAuth.verifyToken, adminService.editCategory);
router.post('/addSubCategory', adminAuth.verifyToken, adminService.addSubCategory);
router.post('/editSubCategory', adminAuth.verifyToken, adminService.editSubCategory);
router.post('/listingCms', adminAuth.verifyToken, adminService.listingCms);
router.get('/getshop', adminAuth.verifyToken, adminService.getshop);
router.post('/addShopProduct', adminAuth.verifyToken, adminService.addShopProduct);
router.get('/getIdealShop', adminAuth.verifyToken, adminService.getIdealshop);
router.get('/getFromAllProduct', adminAuth.verifyToken, adminService.getFromAllProduct);
router.get('/makeIdealProduct', adminAuth.verifyToken, adminService.makeIdealProduct);
router.get('/getGenrateEnquiryList', adminAuth.verifyToken, adminService.getGenrateEnquiryList);
router.post('/genrateEnquiry', adminAuth.verifyToken, adminService.genrateEnquiry);
router.get('/viewEnquiryArtisan', adminAuth.verifyToken, adminService.viewEnquiryArtisan);
router.post('/genrateNewEnquiry', adminAuth.verifyToken, adminService.genrateNewEnquiry);
router.post('/editGenratedEnquiry', adminAuth.verifyToken, adminService.editGenratedEnquiry);
router.post('/genrateEstimate', adminAuth.verifyToken, adminService.genrateEstimate);
router.post('/genratePurchaseOrder', adminAuth.verifyToken, adminService.genratePurchaseOrder);
router.get('/getOrderList', adminAuth.verifyToken, adminService.getOrderList);
router.post('/generateInvoice', adminAuth.verifyToken, adminService.generateInvoice);
router.post('/importEnquiries',adminAuth.verifyToken, adminService.importEnquiries);
router.post('/importArtisan',adminAuth.verifyToken, adminService.importArtisan);
router.post('/importProduct',adminAuth.verifyToken, adminService.importProduct);
router.post('/givePurchaseOrder', adminAuth.verifyToken, adminService.givePurchaseOrder);
router.get('/getPDF', adminAuth.verifyToken, adminService.getPDF);
router.post('/checkPDF', adminAuth.verifyToken, adminService.checkPDF);

/* 4.1 milestone */
router.post('/edit/client', adminAuth.verifyToken, adminService.clientUpdatePost); // [not in use]
router.post('/edit/content', adminAuth.verifyToken, adminService.updateContentPost); //[not in use ]
router.post('/edit/testimonials', adminAuth.verifyToken, adminService.updateTestimonialsPost);
router.post('/edit/faqs', adminAuth.verifyToken, adminService.updateFaqsPost);
router.delete('/delete/faqs', adminAuth.verifyToken, adminService.deleteFaqsDelete);
router.post('/getMessage', adminService.getMessage);
router.patch('/status/message', adminAuth.verifyToken, adminService.statusMessagePatch);
router.post('/edit/message', adminAuth.verifyToken, adminService.editMessagePost);
router.delete('/delete/message', adminAuth.verifyToken, adminService.deleteCmsDelete);
router.post('/get/gallery', adminAuth.verifyToken, adminService.getGalleryPic);
router.post('/gallery/comment', adminAuth.verifyToken, appService.addGalleryComment);
router.post('/gallery/price', adminAuth.verifyToken, appService.addGalleryPrice);
router.delete('/del/gallery', adminAuth.verifyToken, appService.delGalleryPic);
router.get('/cms/list', adminAuth.verifyToken, adminService.cmsListGet);
router.get('/website/orders', adminAuth.verifyToken, adminService.websiteOrdersGet);
router.post('/website/orders/invoice', adminAuth.verifyToken, adminService.generateInvoicePost);
router.put('/edit/website/orders', adminAuth.verifyToken, adminService.editWebsiteOrdersPut);
router.get('/get/stories', adminAuth.verifyToken, adminService.storiesGet);
router.post('/add/stories', adminAuth.verifyToken, adminService.addStoriesPost);
router.put('/edit/stories', adminAuth.verifyToken, adminService.editStoriesPut);
router.delete('/delete/stories', adminAuth.verifyToken, adminService.storiesDelete);
// router.get('/gallery/zip',  adminAuth.verifyToken,adminService.galleryZipGet);

router.get('/gallery/zip',adminService.galleryZipGet);
router.get('/get/awards', adminAuth.verifyToken, adminService.awardsGet);
router.delete('/delete/notification', adminAuth.verifyToken, adminService.notifDelete);
router.get('/get/notification', adminAuth.verifyToken, adminService.notifGet);
router.post('/add/notification', adminAuth.verifyToken, adminService.addNotifPost);
router.post('/repeat/notification', adminAuth.verifyToken, adminService.repeatNotifPost);  //[no in use ]
router.get('/getlogisticDetails', adminAuth.verifyToken,adminService.getlogisticDetails);
router.get('/getProductionTracker',adminAuth.verifyToken, adminService.getProductionTracker);
router.post('/editProductionTracker',adminAuth.verifyToken, adminService.editProductionTracker);
router.post('/websiteOrderEdit',adminAuth.verifyToken, adminService.websiteOrderEdit);

router.get('/getSubAdminRole',adminAuth.verifyToken, adminService.getSubAdminRole);
router.post('/addSubAdmin',adminAuth.verifyToken, adminService.addSubAdmin);
router.get('/getSubAdminList',adminAuth.verifyToken, adminService.getSubAdminList);
router.post('/createSubAdminGroup',adminAuth.verifyToken, adminService.createSubAdminGroup);
router.get('/viewSubAdminCategorylist',adminAuth.verifyToken, adminService.viewSubAdminCategorylist);
router.post('/subAdminCategoryAction',adminAuth.verifyToken, adminService.subAdminCategoryAction);
router.get('/getGroupUser',adminAuth.verifyToken, adminService.getGroupUser);
router.get('/getSubAdminDetails',adminAuth.verifyToken, adminService.getSubAdminDetails);
router.get('/getGalleryList',adminAuth.verifyToken, adminService.getGalleryList);
router.get('/getGalleryDetails',adminAuth.verifyToken, adminService.getGalleryDetails);
router.get('/getNotificationList',adminAuth.verifyToken, adminService.getNotificationList);
router.get('/inCompleteProfileNotificationCron', adminService.inCompleteProfileNotification);
router.get('/order25DoneCron', adminService.order25Done);
router.get('/liveShopPanelFreezeCron', adminService.liveShopPanelFreeze);

router.post('/changePassword',adminAuth.verifyToken,adminService.changePassword);
router.get('/getProfile',adminAuth.verifyToken,adminService.getProfile);
router.post('/profileUpdate',adminAuth.verifyToken,adminService.profileUpdate);
router.post('/forgotPassword', adminService.forgotPassword);
router.post('/resetPassword', adminService.resetPassword);
router.get('/bannerSequenceChanged', adminAuth.verifyToken, adminService.bannerSequenceChanged);
router.get('/getExhibannerList', adminAuth.verifyToken, adminService.getExhibannerList);
router.get('/getSupportList', adminAuth.verifyToken, adminService.getSupportList);
router.post('/addEditSupport', adminAuth.verifyToken, adminService.addEditSupport);
router.delete('/deleteSupport', adminAuth.verifyToken, adminService.deleteSupport);
router.get('/getExhibannerUserList',adminAuth.verifyToken,  adminService.getExhibannerUserList);
router.post('/publishAwardToNewsFeed',adminAuth.verifyToken, adminService.publishAwardToNewsFeed);
router.post('/addAdminBussinessDetails',adminAuth.verifyToken, adminService.addAdminBussinessDetails);
router.get('/getAdminBussinessDetails',adminAuth.verifyToken, adminService.getAdminBussinessDetails);
router.post('/addWebToken',adminAuth.verifyToken, adminService.addWebToken);
router.post('/removeWebToken', adminService.removeWebToken);
router.post('/senWebNotifi', adminService.senWebNotifi);
router.post('/editAboustUs',adminAuth.verifyToken,adminService.editAboustUs);
router.post('/uploadBrand',adminAuth.verifyToken,adminService.uploadBrand);
router.get('/getBrand',adminAuth.verifyToken,adminService.getBrand);

//new API
router.post('/addTeam',adminAuth.verifyToken,adminService.addTeam);
router.get('/getTeam',adminAuth.verifyToken,adminService.getTeam);
router.post('/addCarrer',adminAuth.verifyToken,adminService.addCarrer);
router.get('/getCarrer',adminAuth.verifyToken,adminService.getCarrer);
router.post('/addPrivacyPolicy',adminAuth.verifyToken,adminService.addPrivacyPolicy);
router.get('/getPrivacyPolicy',adminAuth.verifyToken,adminService.getPrivacyPolicy);
router.post('/addReturnPolicy',adminAuth.verifyToken,adminService.addReturnPolicy);
router.get('/getReturnPolicy',adminAuth.verifyToken,adminService.getReturnPolicy);
router.post('/addCatalouge',adminAuth.verifyToken,adminService.addCatalouge);
router.get('/getCatalouge',adminAuth.verifyToken,adminService.getCatalouge);
router.post('/addBlogs',adminAuth.verifyToken,adminService.addBlogs);
router.get('/getBlogs',adminAuth.verifyToken,adminService.getBlogs);
router.delete('/deleteData',adminAuth.verifyToken,adminService.deleteData);
router.post('/getManageListing',adminAuth.verifyToken,adminService.getManageListing);
router.post('/deleteEnquiry',adminAuth.verifyToken,adminService.deleteEnquiry);
router.post('/editBanner',adminAuth.verifyToken,adminService.editBanner);
router.get('/emailSync',emailSync.emailSync);
router.get('/saveEmailEnquiries',emailSync.saveEmailEnquiries);

router.post('/importListing',adminAuth.verifyToken, adminService.importListing);
router.post('/deleteArtisan',adminAuth.verifyToken, adminService.deleteArtisan);
router.post('/deleteProduct',adminAuth.verifyToken, adminService.deleteProduct);
router.post('/deleteProductImage',adminAuth.verifyToken, adminService.deleteProductImage);


module.exports = router;