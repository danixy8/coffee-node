const path = require('path');
const fs = require('fs');
const { response, request } = require("express");
const { uploadFile } = require('../helpers');
const { User, Product } = require("../models");

const pathDefaultImage = path.join(__dirname, '../assets', 'no-image-found.jpeg');

const uploadFiles = async(req, res) => {

  try{
    const fullPath = await uploadFile( req.files, undefined, 'imgs');
    return res.json({ path: fullPath })
  }
  catch(error){
    return res.status(400).json({ msg: error }); 
  }

}

const updateImage = async(req=request, res=response) => {

  const {id, collection} = req.params

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if(!model){
        return res.sendFile(pathDefaultImage);
      }
      break;

    case 'products':
      model = await Product.findById(id);
      if(!model){
        return res.sendFile(pathDefaultImage);
      }
      break;
  
    default:
      return res.sendFile(pathDefaultImage);
  }

  //limpiar imagenes previas
  if(model.img){
    //borrar la imagel del servidor
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImage)){
      fs.unlinkSync(pathImage)
    }
  }

  const name = await uploadFile( req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json( model );
}

const showImage = async(req=request, res=response) => {

  const {id, collection} = req.params

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if(!model){
        return res.sendFile(pathDefaultImage);
      }
      break;

    case 'products':
      model = await Product.findById(id);
      if(!model){
        return res.sendFile(pathDefaultImage);
      }
      break;
  
    default:
      return res.sendFile(pathDefaultImage);
  }

  if(model.img){
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImage)){
      return res.sendFile(pathImage)
    }
  }

  
  res.sendFile(pathDefaultImage)

}

module.exports = {
  uploadFiles,
  updateImage,
  showImage
};