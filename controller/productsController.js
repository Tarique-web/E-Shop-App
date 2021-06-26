const ProductModel = require('../model/productsModel');
const CategoryModel = require('../model/categoryModel');
const mongoose = require('mongoose');


//Getting a products as filtering
exports.filterProduct = async (req, res) => {
    // localhost:8000/products?categories=2342342,234234

    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }

    const productList = await ProductModel.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "product cannot be filterd!"
        })
    }
    res.status(200).send({
        status: 200,
        data: productList
    })
}

exports.getProduct = async(req, res) => {

    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(404).json({
            status: 404,
            success: false,
            message: "product not found!"
        })
    }
    res.status(200).send({
        status: 200,
        data: product
    });
}

exports.createProduct = async (req, res) => {

    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    let product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    // product = await product.save();

    // if(!product) 
    // return res.status(500).send('The product cannot be created')

    // res.send(product);
    product.save().then((results) => {
        res.status(200).send({
            status: 200,
            message: "The pruduct is created !"

        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            message: 'The product cannot be created' || err
        })
    })

}

exports.updateProduct = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid Product Id'
        })
    }

    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send({
        status: 400,
        message: 'Invalid Category !'
    })

    ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    ).then((results) => {
        res.status(200).send({
            status: 200,
            success: true,
            message: "The product is updated!."
        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            success: false,
            message: 'The product cannot be updated!.' || err
        })
    })

    // if (!product)
    //     return res.status(500).send('the product cannot be updated!')

    // res.send(product);
}

exports.deleteProduct = (req, res) => {
    ProductModel.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).send({ status: 200, success: true, message: 'The product is deleted!' })
        } else {
            return res.status(404).send({ status: 404, success: false, message: "Product not found!" })
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            success: false,
            error: err
        })
    })
}

exports.countProduct = async (req, res) => {

    const productCount = await ProductModel.countDocuments((count) => count)

    if (!productCount) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Product connot be counted !"
        })
    }
    res.send({
        success: true,
        productCount: productCount
    });
}

exports.featuredProduct = async (req, res) => {

    const count = req.params.count ? req.params.count : 0
    const products = await ProductModel.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.status(200).send({
        status: 200,
        data: product
    })

}
