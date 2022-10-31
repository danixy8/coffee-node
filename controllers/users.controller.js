const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const usersGet = async(req = request, res = response) =>{
  const { limit = 5, from = 0 } = req.query;
  query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(from))
      .limit(Number(limit))
  ])

  res.json({
    total,
    users
  });
}

const userGet = async(req, res)=>{
  
  const { id } = req.params

  const user = await User.findById(id)
  
  res.status(200).json({
    user
  });
  
}

const userPost = async(req, res) =>{

  const {name, email, password, role} = req.body
  const user = new User({name,email,password,role});

  //Encriptar pass
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  //Guardar en BD
  await user.save();

  res.json({
    user
  });
}

const userPut = async(req, res)=>{
  const { id } = req.params;
  const {_id, password, google, ...rest} = req.body;

  //TODO validar en base de datos

  if( password ){
    //Encriptar pass
    const salt = bcrypt.genSaltSync();
    rest.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate( id, rest );

  res.json(user);
}

const userDelete = async(req, res)=>{
  const { id } = req.params

  //borrado fisico
  // const user = await User.findByIdAndDelete( id );
  
  //soft delete
  const user = await User.findByIdAndUpdate(id, { state: false });
  //info de usuario dueno del token
  // const authenticatedUser = req.user;

  res.json({
    user,
    // authenticatedUser
  });
}

module.exports = {
  usersGet,
  userGet,
  userPost,
  userPut,
  userDelete
}