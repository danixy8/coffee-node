const { Product } = require("../models");

//obtenerProducts - paginado - total - populate
const getProducts = async(req, res)=>{
  const {limit = 5, from = 0} = req.query;
  const query = { state:true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(from)
      .limit(limit)
      .populate('user', 'name')
      .populate('category', 'name')
  ])

  res.status(200).json({
    total,
    products
  })
}

//obtenerProduct - populate

const getProduct = async(req, res)=>{
  
  const { id } = req.params

  const product = await Product.findById(id)
                        .populate('user', 'name')
                        .populate('category', 'name');
  res.status(200).json({
    product
  });

}

const createProduct = async(req, res) => {

  const { state, user, ...body} = req.body;

  const name = req.body.name.toUpperCase();

  const productDB = await Product.findOne({name});

  if(productDB){
    return res.status(400).json({
      msg: `this product ${productDB.name} already exists`
    });
  }

  //generar la data a guardar
  const data = {
    ...body,
    name,
    user: req.user._id
  }

  const product = new Product(data)

  //guardar en DB
  await product.save();

  res.status(201).json(product);

}

//actualizarProduct - recibe nombre
const putProduct = async(req, res) => {
  const { id } = req.params;
  const {state, user, ...data} = req.body;

  if(data.name){
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;

  const product = await Product
  .findOneAndUpdate({_id: id}, data, {new: true})
  .populate('user', 'name')

  res.json(product);

}

//borrar product - id verificar- estado: false
const deleteProduct = async(req, res)=>{
  const { id } = req.params
  const user = req.user._id
  
  //soft delete
  const productDeleted = await Product
  .findByIdAndUpdate({_id: id}, { state: false, user }, {returnOriginal: false})
  .populate('user', 'name')

  res.status(200).json({
    productDeleted
  });
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  putProduct,
  deleteProduct
}