const express = require('express'),
    router = express.Router(),
    userService = require('../../Services/v2/user')
    auth = require('../../middleware/auth'),
    adminAuth = require('../../middleware/adminAuth'),
    fileUploader = require('../../middleware/fileUploader')

router.post('/login', userService.login);
router.post('/changePassword', userService.changePassword);
router.post('/uploads',adminAuth.verifyToken, fileUploader, userService.uploads);
router.post('/gallery',adminAuth.verifyToken, userService.gallery);
router.post('/sendOtp',adminAuth.verifyToken, userService.otp);
router.get('/options',adminAuth.verifyToken, userService.options);
router.get('/states',adminAuth.verifyToken, userService.states);
router.post('/addCart',adminAuth.verifyToken, userService.addCart);
router.get('/cart',adminAuth.verifyToken, userService.cart);
router.post('/addEnquiry',adminAuth.verifyToken, userService.addEnquiry);
router.post('/addCard',adminAuth.verifyToken, userService.addCard);
router.post('/addAddress',adminAuth.verifyToken, userService.addAddress);
router.post('/changeStatus', adminAuth.verifyToken, userService.changeStatus);
router.delete('/deleteUser', userService.deleteUser);
router.post('/addNewsfeed', adminAuth.verifyToken, userService.addNewsfeed);
router.get('/getNewsfeed', adminAuth.verifyToken, userService.getNewsfeed);
router.post('/addCMS', adminAuth.verifyToken, userService.addCMS);
router.get('/getCMS', adminAuth.verifyToken, userService.getCMS);
router.post('/addOnboarding', adminAuth.verifyToken, userService.addOnboarding);
router.get('/listingOnboarding', adminAuth.verifyToken, userService.listingOnboarding);
router.post('/addLoginOnboarding', adminAuth.verifyToken, userService.addLoginOnboarding);
router.get('/listingLoginOnboarding', adminAuth.verifyToken, userService.listingLoginOnboarding);
router.get('/delLoginOnboarding', adminAuth.verifyToken, userService.delLoginOnboarding);
router.put('/statusOnboarding', adminAuth.verifyToken, userService.statusOnboarding);

module.exports = router;


