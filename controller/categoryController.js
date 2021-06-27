const ProductModel = require('../model/productsModel');
const CategoryModel = require('../model/categoryModel');
const mongoose = require('mongoose');


exports.getCategory = (req, res) => {

    CategoryModel.find().then((category) => {
        res.status(200).send({
            status: 200,
            data: category
        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })

}

exports.getCategoryById = (req, res) => {

    CategoryModel.findById(req.params.id).then((category) => {
        if (!category) {
            return res.status(500).send({
                status: 500,
                message: 'The category with the given ID was not found.'
            })
        }
        res.status(200).send({
            status: 200,
            data: category
        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })

}

exports.createCategory = (req, res) => {

    let category = new CategoryModel({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category.save().then((category) => {
        if (category)
            return res.status(200).send({
                status: 200,
                message: "The category is created !",
                category: category

            })
        res.status(400).send({
            status: 400,
            message: 'The category cannot be created!'
        })


    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    });

}

exports.updateCategory = async (req, res) => {
    const category = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        { new: true }
    ).then((results) => {
        if (!results)
            return res.status(400).send({
                status: 400,
                message: 'The category cannot be created!'
            })

        res.status(200).send({
            status: 200,
            message: "The category is updated!."
        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })


}

exports.deleteCategory = (req, res) => {
    CategoryModel.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).send({ status: 200, message: 'The category is deleted!' })
        } else {
            return res.status(404).send({ status: 404, message: "category not found!" })
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })
}