const { response, request } = require("express");
const { Category, Product, User } = require("../models");
const { ObjectId } = require("mongoose").Types;

const allowedCollections = [
  'categories',
  'products',
  'productsByCategory',
  'users'
];

const searchUsers = async(term = '', res) => {

  const isMongoId = ObjectId.isValid(term);

  if(isMongoId){
    const user = await User.findById(term);
    return res.json({results : user ? [user] : [] })
  }

  const regex = new RegExp(term, 'i');

  const query = {
    $or: [{name: regex}, {email: regex}],
    $and: [{state: true}]
  }

  const users = await User.aggregate([
    {
      $match: query
    },
    {
      $facet: {
        count: [{ $count: "total" }],
        results: [{ $match: {} }]
      }
    },
    {
      $unwind: "$count"
    }
  ]);

  res.json({
    total: users[0].count.total,
    results: users[0].results
  });
}

const searchCategories = async(term = '', res) => {

  const isMongoId = ObjectId.isValid(term);

  if(isMongoId){
    const categoryById = await Category.findById(term);
    return res.json({results : categoryById ? [categoryById] : [] })
  }

  const regex = new RegExp(term, 'i');

  const query = {name: regex, state: true}

  const category = await Category.find(query)

  res.json({results: category});

}

const searchProducts = async(term = '', res) => {

  const isMongoId = ObjectId.isValid(term);

  if(isMongoId){
    const productById = await Product.findById(term).populate('category', 'name');
    return res.json({results : productById ? [productById] : [] })
  }

  const regex = new RegExp(term, 'i');

  const query = {name: regex, state: true}

  const products = await Product.find(query).populate('category', 'name');

  res.json({results: products});

}

const productsByCategory = async(term = '', res) => {

  try {
    const isMongoId = ObjectId.isValid(term);

    if(isMongoId){
      const products = await Product
        .find({category: ObjectId(term), status: true})
        .select('name price description available')
        .populate('category', 'name');
        console.log('entro')
      return res.json({results: products})
    }
    
    const regex = new RegExp(term, 'i');

    const categories = await Category.find({ name: regex, status: true});

    if(!categories.length){
      return res.status(400).json({msg: `There's no results with ${term} search term`});
    }

    const products = await Product.find({
      $or: [...categories.map(c => { return { category: c._id }})],
      $and: [{ state: true}]
    })
    .select('name price description available')
    .populate('category', 'name')

    res.json({results: products})
    
  } catch (error) {
    res.status(400).json(error)
  }
}

const search = (req = request, res = response) => {

  const {collection, term} = req.params;

  if(!allowedCollections.includes(collection)){
    return res.status(400).json({
      msg: `the allowed collections are: ${allowedCollections}`
    })
  }

  switch (collection) {
    case 'categories':
      searchCategories(term, res)
      break;

    case 'productsByCategory':
      productsByCategory(term, res)
      break;

    case 'products':
      searchProducts(term, res)
      break;
  
    case 'users':
      searchUsers(term, res);
      break;
      
    default:
      res.status(500).json({
        msg: 'collection not covered'
      })
  }

}

module.exports = {
  search
}