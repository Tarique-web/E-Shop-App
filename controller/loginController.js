const UserModel = require('../model/userModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {

    const user = await UserModel.findOne({ email: req.body.email })
    const secret = process.env.secret;
    if (!user) {
        return res.status(404).send({
            status: 404,
            message: "The user not found"
        });
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1d' }
        )
        res.cookie(token);
        res.status(200).send({
            status: 200,
            message: 'login success!',
            user: user.name, email: user.email, token: token
        })
    } else {
        res.status(400).send({
            status: 400,
            message: 'password is wrong!'
        });
    }

}