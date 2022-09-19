const {Schema, model} = require('mongoose');

const CategorySchema = Schema({
  name: {
    type: String,
    require: [true, 'Name is required'],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Category', CategorySchema)