const express = require('express'),
    router = express.Router(),
    crudService = require('../../Services/v2/crud'),
    adminAuth = require('../../middleware/adminAuth'),
    fileUploader = require('../../middleware/fileUploader')

router.put('/edit', adminAuth.verifyToken, crudService.editEntity);
router.delete('/delete', adminAuth.verifyToken, crudService.deleteEntity);
router.post('/editData', adminAuth.verifyToken, crudService.editData);
router.post('/addEntity', adminAuth.verifyToken, crudService.addEntity);
router.post('/addInfographics', adminAuth.verifyToken, crudService.addInfographics);
router.get('/getInfographics', adminAuth.verifyToken, crudService.getInfographics);
router.get('/delInfographicsState', adminAuth.verifyToken, crudService.delInfographicsState);
router.get('/filterEntity', adminAuth.verifyToken, crudService.filterEntity);

module.exports = router;


