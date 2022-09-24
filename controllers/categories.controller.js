const { response, request, query } = require("express");
const { Category } = require("../models");

//obtenerCategorias - paginado - total - populate
const getCategories = async(req, res)=>{
  const {limit = 5, from = 0} = req.query;
  const query = { state:true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .skip(from)
      .limit(limit)
      .populate('user', 'name')
  ])

  res.status(200).json({
    total,
    categories
  })
}

//obtenerCategoria - populate

const getCategory = async(req, res)=>{
  
  const { id } = req.params

  const category = await Category.findById(id).populate('user', 'name');

  res.status(200).json({
    category
  });

}

const createCategory = async(req, res) => {

  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if(categoryDB){
    return res.status(400).json({
      msg: `this category ${categoryDB.name} already exists`
    });
  }

  //generar la data a guardar
  const data = {
    name,
    user: req.user._id
  }

  const category = new Category(data)

  //guardar en DB
  await category.save();

  res.status(201).json(category);

}

//actualizarCategoria - recibe nombre
const putCategory = async(req, res) => {
  const { id } = req.params;
  const {state, user, ...data} = req.body;
  
  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category
  .findOneAndUpdate(id, data, {returnOriginal: false})
  .populate('user', 'name')

  res.json(category);

}

//borrar categoria - id verificar- estado: false
const deleteCategory = async(req, res)=>{
  const { id } = req.params
  const user = req.user._id
  
  //soft delete
  const categoryDeleted = await Category
  .findByIdAndUpdate(id, { state: false, user }, {returnOriginal: false})
  .populate('user', 'name')

  res.status(200).json({
    categoryDeleted
  });
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  putCategory,
  deleteCategory
}