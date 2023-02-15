const express = require('express'),
    router = express.Router(),
    shopService = require('../../Services/v2/shop'),
    auth = require('../../middleware/auth')

router.post('/shop', shopService.add);

module.exports = router;
