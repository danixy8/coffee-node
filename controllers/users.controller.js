const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const usersGet = (req = request, res) =>{
  
  const {name='no name', apikey, page=1, limit} = req.query;

  res.json({
    msg: "get API - controlador",
    name, apikey, page, limit
  });
}

const userPost = async(req, res) =>{

  const {name, email, password, role} = req.body
  const user = new User({name,email,password,role});

  //Verificar si correo existe
  // const emailExist = await User.findOne({email})
  // if(emailExist){
  //   return res.status(400).json({
  //     msg: 'this email exist'
  //   })
  // }

  //Encriptar pass
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  //Guardar en BD
  await user.save();

  res.json({
    user
  });
}

const userPut = (req, res)=>{
  const id = req.params.id;
  res.json({
    msg: "put API - controlador",
    id
  });
}

const userDelete = (req, res)=>{
  res.json({
    msg: "delete API - controlador"
  });
}

module.exports = {
  usersGet,
  userPost,
  userPut,
  userDelete
}