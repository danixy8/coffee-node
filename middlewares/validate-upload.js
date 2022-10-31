const { response } = require("express");
const { getNameAndExtension } = require("../helpers");

const imageValidExtensions = ['gif', 'jpg', 'jpeg', 'tiff', 'png', 'webp', 'bmp'];

const validateUpload = (req, res = response, next) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({msg: 'No files were uploaded.'});
    
  }

  const {extension} = getNameAndExtension(req.files.file.name)

  if(!imageValidExtensions.includes(extension)){
    return res.json({msg: `Image format not allowed. Valid image extensions: ${imageValidExtensions}`})
  }

  next();
}

module.exports={
  validateUpload
}