const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, userPost, userPut, userDelete } = require('../controllers/users.controller');
const { isValidRole, isValidEmail } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/fields-validator');

const router = Router();

router.get('/', usersGet);

router.post('/', [
  check('name', 'name is required').not().isEmpty(),
  check('password', 'password must be more than 6 characters').isLength({min: 6}),
  check('email', 'this email not is valid').isEmail(),
  // check('role', 'Not is a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom( isValidRole ),
  check('email').custom( isValidEmail ),
  validateFields,
], userPost);

router.put('/:id', userPut);

router.delete('/', userDelete);

module.exports = router;