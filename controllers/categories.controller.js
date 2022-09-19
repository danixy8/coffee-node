const { response, request, query } = require("express");
const { Category } = require("../models");

//obtenerCategorias - paginado - total - populate
const getCategories = async(req = request, res = response)=>{
  const {limit = 5, from = 0} = req.query;
  const query = { state:true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .skip(from)
      .limit(limit)
      .populate('user')
  ])

  res.status(200).json({
    total,
    categories
  })
}

//obtenerCategoria - populate

const getCategory = async(req, res)=>{
  
  const { id } = req.params

  const category = await Category.findById(id, { name: 1 });

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
  const name = req.body.name.toUpperCase();
  const user = req.user._id

  const category = await Category
  .findOneAndUpdate({id}, {name, user }, {returnOriginal: false})
  .populate('user');

  res.json({
    name: category.name,
    user: category.user
  });

}

//borrar categoria - id verificar- estado: false
const deleteCategory = async(req, res)=>{
  const { id } = req.params
  const user = req.user._id
  
  //soft delete
  const category = await Category
  .findByIdAndUpdate(id, { state: false, user }, {returnOriginal: false})
  .populate('user');

  res.json({
    category
  });
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  putCategory,
  deleteCategory
}