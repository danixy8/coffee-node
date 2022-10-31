const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL )

const { response, request } = require("express");
const { uploadFile, getNameAndExtension, imageValidExtensions } = require('../helpers');
const { User, Product, DefaultImages } = require("../models");

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

// const updateImage = async(req=request, res=response) => {

//   const {id, collection} = req.params

//   let model;

//   switch (collection) {
//     case 'users':
//       model = await User.findById(id);
//       if(!model){
//         return res.sendFile(pathDefaultImage);
//       }
//       break;

//     case 'products':
//       model = await Product.findById(id);
//       if(!model){
//         return res.sendFile(pathDefaultImage);
//       }
//       break;
  
//     default:
//       return res.sendFile(pathDefaultImage);
//   }

//   //limpiar imagenes previas
//   if(model.img){
//     //borrar la imagel del servidor
//     const pathImage = path.join(__dirname, '../uploads', collection, model.img);
//     if(fs.existsSync(pathImage)){
//       fs.unlinkSync(pathImage)
//     }
//   }

//   const name = await uploadFile( req.files, collection);
//   model.img = name;

//   await model.save();

//   res.json( model );
// }

const updateImageCloudinary = async(req=request, res=response) => {

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
    const name = model.img.substr(model.img.lastIndexOf('/')+1,model.img.length);
    const public_id = name.substr(0,name.lastIndexOf('.'));
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url

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

  // esto para cuando subes imagenes desde una carpeta local
  // if(model.img){
  //   const pathImage = path.join(__dirname, '../uploads', collection, model.img);
  //   if(fs.existsSync(pathImage)){
  //     return res.sendFile(pathImage)
  //   }
  // }

    if(model.img){
      return res.json({url: model.img})
  }

  const [defaultImage] = await DefaultImages.find({name: 'default_image'})
  res.json({url: defaultImage.url})

}

module.exports = {
  uploadFiles,
  updateImageCloudinary,
  showImage
};