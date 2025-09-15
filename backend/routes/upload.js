const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMulter');
const { uploadFile, getUploadsForUser, getUploadById, getChartData } = require('../controllers/uploadController');

router.post('/', auth, upload.single('file'), uploadFile);
router.get('/', auth, getUploadsForUser);
router.get('/:id', auth, getUploadById);
router.get('/chart/:uploadId', auth, getChartData);

module.exports = router;
