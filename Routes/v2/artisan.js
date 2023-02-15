const express = require('express'),
    router = express.Router(),
    artisanService = require('../../Services/v2/artisan'),
    auth = require('../../middleware/auth'),
    adminAuth = require('../../middleware/adminAuth'),
    fileUploader = require('../../middleware/fileUploader')

// router.post('/add', adminAuth.verifyToken, fileUploader, artisanService.add);
router.post('/add', adminAuth.verifyToken, artisanService.add);
router.post('/listing', adminAuth.verifyToken, artisanService.listing);
router.get('/listingById', adminAuth.verifyToken, artisanService.listingById);
router.post('/statusChange', adminAuth.verifyToken, artisanService.addManageListing);
router.post('/addManageListing', adminAuth.verifyToken,artisanService.addManageListing);
router.get('/getManageListing',adminAuth.verifyToken, artisanService.getManageListing);

module.exports = router;
