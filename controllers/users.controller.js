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