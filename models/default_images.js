const {Schema, model} = require('mongoose');

const DefaultImagesSchema = Schema({
  name: {
    type: String,
    require: [true, 'Name is required'],
    unique: true
  },
  url: {
    type: String,
    require: [true, 'Url is required'],
  }
});

DefaultImagesSchema.methods.toJSON = function(){
  const {__v, ...data } = this.toObject();
  return data
}

module.exports = model('default_images', DefaultImagesSchema)