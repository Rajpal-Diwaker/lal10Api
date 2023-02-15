const express = require('express'),
    router = express.Router(),
    productService = require('../../Services/v2/product'),
    auth = require('../../middleware/auth'),
    adminAuth = require('../../middleware/adminAuth');


router.post('/add', adminAuth.verifyToken, productService.add);
router.post('/listing', adminAuth.verifyToken, productService.listing);
router.post('/changeStatus', adminAuth.verifyToken, productService.changeStatus);
router.post('/ProductChangeStatus', adminAuth.verifyToken, productService.ProductChangeStatus);
// router.post('/categoryChange', adminAuth.verifyToken, productService.categoryChange);

module.exports = router;
