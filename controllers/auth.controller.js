const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

  const {email, password} = req.body

  try {

    //verificar email existe
    const user = await User.findOne({ email });
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

const googleSignIn = async (req, res) => {

  const {id_token} = req.body;

  try {
    const {name, img, email} = await googleVerify( id_token )

    let user = await User.findOne({email});

    if(!user){
      //si no tiene hacemos que cree un usuario
      const data = {
        name,
        email,
        role: "USER_ROLE",
        password: ':P',
        img,
        google: true
      }

      user = new User(data);
      await user.save();
    }

    //si el usuario en DB esta deshabilitado/bloqueado
    if(!user.state){
      return res.status(401).json({
        msg: 'contact admin, user blocked'
      })
    }

    //si el correo de google existe en BD creamos un token
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    })

  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    })
  }
}

module.exports = {
  login,
  googleSignIn
}