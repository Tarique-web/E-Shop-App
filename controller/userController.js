const UserModel = require('../model/userModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


exports.createUsers = async (req, res) => {

   
    const passwordHash = await bcrypt.hashSync(req.body.passwordHash, 10);   

    let user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        passwordHash: passwordHash,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    user.save().then((results) => {
        res.status(200).send({
            status: 200,
            message: "The user account is created !",
            data: results

        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })
}

exports.updateUser = async (req, res) => {

    const userExist = await UserModel.findById(req.params.id);

    let newPassword;

    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    UserModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true }
    ).then((user) => {
        res.status(200).send({
            status: 200,
            message: "The user account is uptated!",
            data: user
        })

    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })


}

exports.deleteUser = async(req, res) => {

    UserModel.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).send({ status: 200, message: 'the user is deleted!' })
        } else {
            return res.status(404).send({ status: 404, message: "user not found!" })
        }
    }).catch(err => {
        return res.status(500).send({ status: 500, error: err })
    })
}

exports.getUser = async (req, res) => {
    UserModel.find().select('-passwordHash').then((userList)=>{
        if (!userList) {
            return res.status(500).send({
                status: 500,
                user: empty
            })
        }
        res.status(200).send({
            status: 200,
            user: userList
        });

    }).catch((err)=>{
        res.status(500).send({
            status:500,
            error:err
        })
    })

    
}

exports.countUser = (req, res) => {

    UserModel.countDocuments().then((userCount)=>{
        if (!userCount) {
            return res.status(500).send({
                status: 500,
                userCount: empty
            }
            )
        }
        res.status(200).send({
            status: 200,
            userCount: userCount
        });
    }).catch((err)=>{
        res.status(500).send({
            status:500,
            error:err
        })
    })

   
}

exports.getUserById = async (req, res) => {

    const user = await UserModel.findById(req.params.id).select('-passwordHash');

    if (!user) {
        return res.status(500).send({
            status: 500,
            message: 'The user with the given ID was not found.'
        })
    }
    res.status(200).send({
        status: 200,
        user: user
    });
}