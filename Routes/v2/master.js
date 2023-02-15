const express = require('express'),
    router = express.Router(),
    auth = require('../../middleware/auth')
    masterService = require('../../Services/v2/master')

router.post('addCategory', masterService.addCategory)
router.get('getCategory', masterService.getCategory)

module.exports = router;
