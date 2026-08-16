const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

router.get('/', async (req,res)=>{
  const products = await Product.find().sort({createdAt:-1});
  res.json(products);
});

router.post('/', upload.single('image'), async (req,res)=>{
  try{
    const {name, price, category, description} = req.body;
    const product = new Product({
      name, price, category, description,
      image: req.file ? req.file.path : ''
    });
    await product.save();
    res.status(201).json(product);
  }catch(e){ res.status(500).json({error:e.message}) }
});

router.delete('/:id', async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({message:'Deleted'});
});

module.exports = router;
