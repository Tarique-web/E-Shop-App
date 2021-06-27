const OrderItems = require('../model/orderItemsModel');
const OrderModel = require('../model/orderModel')

exports.createOrder = async (req, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItems({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItems.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new OrderModel({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order.save().then((order) => {
        if (!order)
            return res.status(400).send('the order cannot be created!')
        res.status(200).send({
            status: 200,
            message: "Order success !",
            order: order
        })

    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })
}

exports.updateOrder = (req, res) => {
    OrderModel.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    ).then((order) => {
        if (!order)
            return res.status(400).send({
                status: 400,
                message: 'the order cannot be update!'
            })

        res.status(200).send({
            status: 200,
            message: "Order updated !",
            order: order
        })
    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })

}

exports.removeOrder = async (req, res) => {
    OrderModel.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ status: 200, message: 'The order is deleted!' })
        } else {
            return res.status(404).json({ status: 404, message: "Order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ status: 500, error: err })
    })
}
exports.getOrder = (req, res) => {
    OrderModel.find().populate('user', 'name').sort({ 'dateOrdered': -1 }).then((orderList) => {
        res.status(200).send({
            status: 200,
            orderList: orderList
        })

    }).catch((err) => {
        res.status(500).send({
            status: 500,
            error: err
        })
    })

}

exports.getByIdOrder = (req, res) => {

    OrderModel.findById(req.params.id).populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        }).then((order) => {
            res.status(200).send({
                status: 200,
                order: order
            })

        }).catch((err) => {
            res.status(500).send({
                status: 500,
                error: err
            })
        })

}

exports.getUserOrder = (req, res) => {
    OrderModel.find({ user: req.params.userId }).populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        }).sort({ 'dateOrdered': -1 }).then((orderList) => {
            res.status(200).send({
                status: 200,
                orderList: orderList
            })

        }).catch((err) => {
            res.status(500).send({
                status: 500,
                error: err
            })
        })
  
}

exports.ordersCount = async(req,res)=>{
    const orderCount = await OrderModel.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}

exports.getTotalSales = async (req,res)=>{
    const totalSales= await OrderModel.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).json('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
}