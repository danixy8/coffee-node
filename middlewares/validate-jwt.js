const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const validateJWT = async( req = request, res = response, next ) => {

  const token = req.header('x-token')

  if(!token){
    return res.status(401).json({
      msg: 'there is no token in the request'
    })
  }
  
  try {

    const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);

    //leo el uid de usuario dueno del token
    const user = await User.findById(uid);

    if(!user){
      return res.status(401).json({
        msg: 'invalid token'
      })
    }

    //verificar si este usuario logueado es un usuario eliminado
    if(!user.state){
      return res.status(401).json({
        msg: 'invalid token'
      })
    }

    req.user = user;

    next();
    
  } catch (error) {

    console.log(error);
    res.status(401).json({
      msg: 'invalid token'
    })
  }
}

module.exports = {
  validateJWT
}