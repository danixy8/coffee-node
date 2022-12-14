const { Router } = require('express');
const { check, query } = require('express-validator');
const { usersGet, userPost, userPut, userDelete, userGet } = require('../controllers/users.controller');
const { isValidRole, isValidEmail, existsUserById } = require('../helpers/db-validators');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, hasARole } = require('../middlewares/validate-roles');
const { validateFields, validateJWT, isAdminRole, hasARole } = require('../middlewares')

const router = Router();

router.get('/', [
  query("limit", "value of 'limit' must be numeric")
    .isNumeric()
    .optional(),
  query("from", "value of 'from' must be numeric")
    .isNumeric()
    .optional(),
  validateFields
],usersGet);

router.get('/:id', [
  check('id', 'Not is a valid ID').isMongoId(),
  validateFields,
  check('id').custom( existsUserById ),
  validateFields
],userGet);

router.post('/', [
  check('name', 'name is required').not().isEmpty(),
  check('password', 'password must be more than 6 characters').isLength({min: 6}),
  check('email', 'this email not is valid').isEmail(),
  check('role').custom( isValidRole ),
  check('email').custom( isValidEmail ),
  validateFields,
], userPost);

router.put('/:id', [
  check('id', 'Not is a valid ID').isMongoId(),
  check('id').custom( existsUserById ),
  check('role').custom( isValidRole ),
  validateFields 
] , userPut);

router.delete('/:id',[
  validateJWT,
  // isAdminRole,
  hasARole('ADMIN_ROLE', 'SALES_ROLE'),
  check('id', 'Not is a valid ID').isMongoId(),
  check('id').custom( existsUserById ),
  validateFields
], userDelete);

module.exports = router;