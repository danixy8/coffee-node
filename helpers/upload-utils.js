const path = require('path');

const getNameAndExtension = (filename) => {
  const name = filename.substr(0,filename.lastIndexOf('.'));
  const extension = filename.substr(filename.lastIndexOf('.')+1,filename.length);
  // const index = filename.lastIndexOf('.');
  // return filename.slice(index + 1);
  return {name,extension}
}

const generateId = () => {
  const random = Math.random().toString(36).substring(2)
  const date = Date.now().toString(36)
  return random + date
}

const uploadFile = (files, validImageExtensions = ['gif', 'jpg', 'jpeg', 'tiff', 'png', 'webp', 'bmp'], folder = '') => {

  return new Promise((resolve, reject) => {

    const {file} = files;

    const {name, extension} = getNameAndExtension(file.name)

    if(!validImageExtensions.includes(extension)){
      return reject(`Image format not allowed. Valid image extensions: ${validImageExtensions}`)
    }
  
    const finalName = `${name}_${generateId()}.${extension}`
  
    const uploadPath = path.join(__dirname, '../uploads/', folder, finalName);
  
    file.mv(uploadPath, (err) => {
      if(err){
        return reject(err);
      }
  
      resolve(finalName)
    });

  } )

}

module.exports={
  generateId,
  getNameAndExtension,
  uploadFile
}