const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async(req, res = response) => {

  const {email, password} = req.body

  try {

    //verificar email existe
    const user = await Usuario.findOne({ email });
    if (!user){
      return res.status(400).json({
        msg: 'incorrect user/password'
      })
    }

    //si el usuario esta activo
    if (!user.state){
      return res.status(400).json({
        msg: 'incorrect user/password'
      })
    }

    //verificar contra
    const validPassword = bcryptjs.compareSync(password, user.password);
    if(!validPassword){
      return res.status(400).json({
        msg: 'incorrect user/password'
      })
    }

    //generar el jwt
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    })
  } catch (error) {
    console.log(error)
    return res.status.json({
      msg: 'Contact the administrator'
    })
  }

}

module.exports = {
  login
}