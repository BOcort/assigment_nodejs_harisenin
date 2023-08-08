const { parse } = require('dotenv')
const product_data = require('../ModelKnex/products.json')

const allproduct = (req, res) => {
    res.send({
        Message: 'Data Product retrived',
        status: "ok",
        data: product_data
    })
}

const productsbyid = (req, res) => {
    const params = req.params.id
    const getDataById = (dataList, targetId) => {
        return dataList.find(item => item.id == targetId);
    }
    if (getDataById(product_data,params) == undefined) {
        res.send({
            data: "undefined"
        })
    } else {

    res.send({
        Message: 'data Product retrieved',
        status: "OK",
        data: getDataById(product_data, params)
    })
}
}

module.exports = { allproduct, productsbyid }