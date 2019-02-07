const mongoose = require('mongoose')
const Product = require('../models/product')

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            url: {
              request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id
              }
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Product Created Successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log('From Database', doc)
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_PRODUCTS',
            url: 'http://localhost:3000/products/'
          }
        })
      } else {
        res.status(404).json({
          message: 'No valid entry found'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.update({
    _id: id
  }, {
    $set: updateOps
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId
  Product.remove({
    _id: id
  })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}
