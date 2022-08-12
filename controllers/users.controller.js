const {response, request} = require('express');

const usuariosGet = (req = request, res) =>{
  
  const {nombre='no name', apikey, page=1, limit} = req.query;

  res.json({
    msg: "get API - controlador",
    nombre, apikey, page, limit
  });
}

const usuarioPost = (req, res) =>{
  
  const {nombre, edad} = req.body;

  res.json({
    msg: "post API - controlador",
    nombre, edad
  });
}

const usuarioPut = (req, res)=>{
  const id = req.params.id;
  res.json({
    msg: "put API - controlador",
    id
  });
}

const usuarioDelete = (req, res)=>{
  res.json({
    msg: "delete API - controlador"
  });
}

module.exports = {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete
}