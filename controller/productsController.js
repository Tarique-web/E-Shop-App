const ProductModel = require('../model/productsModel');
const CategoryModel = require('../model/categoryModel');
const mongoose = require('mongoose');

const multer = require('multer');

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// }
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];
//         let uploadError = new Error('invalid image type');

//         if (isValid) {
//             uploadError = null
//         }
//         cb(uploadError, 'public/uploads')
//     },
//     filename: function (req, file, cb) {

//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype];
//         cb(null, `${fileName}-${Date.now()}.${extension}`)
//     }
// })
// const uploadOptions = multer({ storage: storage })


//Getting a products as filtering
exports.filterProduct = async (req, res) => {

    // localhost:8000/product?categories=2342342,234234

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

exports.getProduct = async (req, res) => {

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

exports.getAllProduct = async (req, res) => {
    ProductModel.find().populate('category').then((product) => {
        res.status(200).send({
            status: 200,
            data: product
        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })
}
exports.createProduct = async (req, res) => {

    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send({
        status: 400,
        message: 'Invalid Category'
    })


    // const file = req.file;
    // if (!file) return res.status(400).json('No image in the request')

    // const fileName = file.filename
    // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        // image: `${basePath}${fileName}`,
        image: req.file,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product.save().then((results) => {
        res.status(200).send({
            status: 200,
            message: "The pruduct is created !",
            data: results

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
    ).then((product) => {
        if (product) {
            res.status(200).send({
                status: 200,
                success: true,
                message: "The product is updated!."
            })
        } else {
            return res.status(404).send({ status: 404, success: false, message: "Product not found!" })
        }

    }).catch((err) => {

        res.status(500).send({
            status: 500,
            error: err
        })
    })


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
        res.status(500).send({
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
        res.status(500).send({ success: false })
    }
    res.status(200).send({
        status: 200,
        data: product
    })

}
