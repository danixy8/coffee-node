const { Router } = require('express');
const { check, query } = require('express-validator');
const { createProduct, getProducts, getProduct, putProduct, deleteProduct } = require('../controllers/products.controller');
const { existsProductById, existsCategoryById } = require('../helpers/db-validators');
const { validateJWT, hasARole } = require('../middlewares');

const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

// {{url}}/api/product

//obtener todas los productos - publico
router.get('/', [
  query("limit", "value of 'limit' must be numeric")
    .isNumeric()
    .optional(),
  query("from", "value of 'from' must be numeric")
    .isNumeric()
    .optional(),
  validateFields
], getProducts);

//obtener productos por id - publico
router.get('/:id', [
  check('id', 'Not is a valid ID').isMongoId(),
  validateFields,
  check('id').custom(existsProductById),
  validateFields
], getProduct);

//crear producto - cualquier con un token valido
router.post('/', [
  validateJWT, 
  check('name', 'name is required').not().isEmpty(),
  check('category', 'that is not a mongo id').isMongoId(),
  validateFields,
  check('category').custom( existsCategoryById ),
  validateFields
], createProduct);

//actualizar - privado - cualquier con token valido
router.put('/:id', [
  validateJWT,
  hasARole('ADMIN_ROLE', 'SALES_ROLE'),
  check('category','that is not a mongo id').isMongoId(),
  validateFields,
  check('id').custom( existsProductById ),
  validateFields
], putProduct);

//borrar un producto - admin
router.delete('/:id', [
  validateJWT,
  hasARole('ADMIN_ROLE'),
  check('id', 'Not is a valid ID').isMongoId(),
  validateFields,
  check('id').custom( existsProductById ),
  validateFields
], deleteProduct);

module.exports = router;