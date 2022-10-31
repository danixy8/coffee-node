const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFiles, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads.controller');
const { allowedCollections } = require('../helpers');
const { validateJWT, validateUpload } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/', [
  validateJWT,
  validateUpload
], uploadFiles);

router.put('/:collection/:id', [
  validateJWT,
  validateUpload,
  check('id', 'mongo id is required').isMongoId(),
  validateFields,
  check('collection', 'this collection is not allowed').isIn(['users', 'products']),
  validateFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
  check('id', 'mongo id is required').isMongoId(),
  check('collection', 'this collection is not allowed').isIn(['users', 'products']),
  validateFields
], showImage)

module.exports = router;