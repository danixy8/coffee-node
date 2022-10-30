
const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateUpload = require('../middlewares/validate-upload');

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
  ...validateUpload
}