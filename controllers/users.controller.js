const {response, request} = require('express');
const User = require('../models/user');

const usersGet = (req = request, res) =>{
  
  const {name='no name', apikey, page=1, limit} = req.query;

  res.json({
    msg: "get API - controlador",
    name, apikey, page, limit
  });
}

const userPost = async(req, res) =>{

  const body = req.body
  const user = new User(body);

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