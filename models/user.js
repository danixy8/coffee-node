const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name:{
    type: String,
    required: [true, 'name is required']
  },
  mail:{
    type: String,
    required: [true, 'mail is required'],
    unique: true
  },
  password:{
    type: String,
    required: [true, 'password is required']
  },
  img:{
    type: String,
  },
  role:{
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  state:{
    type: Boolean,
    default: true
  },
  google:{
    type: Boolean,
    default: false
  }
});

module.exports = model('User', UserSchema)