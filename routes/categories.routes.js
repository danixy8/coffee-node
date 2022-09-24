const { Router } = require('express');
const { check, query } = require('express-validator');
const { createCategory, getCategories, getCategory, putCategory, deleteCategory } = require('../controllers/categories.controller');
const { existsCategoryById } = require('../helpers/db-validators');
const { validateJWT, hasARole } = require('../middlewares');

const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

// {{url}}/api/categories

//obtener todas las categorias - publico
router.get('/', [
  query("limit", "value of 'limit' must be numeric")
    .isNumeric()
    .optional(),
  query("from", "value of 'from' must be numeric")
    .isNumeric()
    .optional(),
  validateFields
], getCategories);

//obtener categorias por id - publico
router.get('/:id', [
  check('id', 'Not is a valid ID').isMongoId(),
  check('id').custom(existsCategoryById),
  validateFields
], getCategory);

//crear categoria - cualquier con un token valido
router.post('/', [
  validateJWT, 
  check('name', 'name is required').not().isEmpty(),
  validateFields
], createCategory);

//actualizar - privado - cualquier con token valido
router.put('/:id', [
  validateJWT,
  hasARole('ADMIN_ROLE', 'SALES_ROLE'),
  check('name', 'name is required').not().isEmpty(),
  check('id', 'Not is a valid ID').isMongoId(),
  validateFields,
  check('id').custom( existsCategoryById ),
  validateFields
], putCategory);

//borrar una categoria - admin
router.delete('/:id', [
  validateJWT,
  hasARole('ADMIN_ROLE'),
  check('id', 'Not is a valid ID').isMongoId(),
  validateFields,
  check('id').custom( existsCategoryById ),
  validateFields
], deleteCategory);

module.exports = router;