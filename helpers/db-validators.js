const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async(role = '') => {
  const roleExist = await Role.findOne({ role });
  if(!roleExist){
    throw new Error(`Role ${role} not extist in DB`)
  }
}

const isValidEmail = async(email) => {
  const emailExist = await User.findOne({email});
  if(emailExist){
    throw new Error(`the email '${email}' is already registered`)
  }
}

const existsUserById = async(id) => {
  const userExist = await User.findById(id);
  if(!userExist){
    throw new Error(`this ID '${id}' not exist`)
  }
}

module.exports={
  isValidRole,
  isValidEmail,
  existsUserById
}