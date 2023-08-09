const { postNew } = require('../models')
const jwt = require('jsonwebtoken')
const { get } = require('../routes/product.route')
const fs = require('fs');

const create_post = async (req, res) => {
    const user_id = req.user.id
    const post_photo = req.file.filename
    try {
        const input = await postNew.create({
            user_id: user_id,
            body: `{"1" : "${post_photo}"}`
        })
        return res.send({
            Message: "first upload success",
        })
    } catch (error) {
        return res.send({
            message: 'Nothing was Post',
            data: error
        })
    }
}


const upload_post = async (req, res) => {
    const user_id = req.user.id
    const post_photo = req.file.filename
    const getpost = await postNew.findOne({
        where: { user_id: user_id }
    })
    const datalama = getpost.dataValues.body
    let datatoJson = JSON.parse(datalama)
    const numberOfEntries = Object.keys(datatoJson).length + 1;
    datatoJson[`${numberOfEntries}`] = `${post_photo}`
    const jsonstring = JSON.stringify(datatoJson)
    try {
        const input = await postNew.update({
            body: jsonstring
        }, { where: { user_id: user_id } })

        return res.send({
            Message: "Succsed Upload",
        })
    } catch (error) {
        return res.send({
            message: 'Fail Uploading',
            data: error
        })
    }
}

const delete_post = async (req, res) => {
    const user_id = req.user.id
    const { deletedPost } = req.body

    const getpost = await postNew.findOne({
        where: { user_id: user_id }
    })
    const datalama = getpost.dataValues.body
    const datatoJson = JSON.parse(datalama)

    const uploadDir = `${process.cwd()}/upload`
    const Post_Dir = `${uploadDir}/post_picture`
    console.log('file data yang akan dihapus' + datatoJson[delete_post])
    fs.unlinkSync(`${Post_Dir}/${datatoJson[deletedPost]}`)
    delete datatoJson[`${deletedPost}`]
    const jsonstring = JSON.stringify(datatoJson)
    try {
        const input = await postNew.update({
            body: jsonstring
        }, { where: { user_id: user_id } })

        return res.send({
            Message: "Succsed deleted post",
        })
    } catch (error) {
        return res.send({
            message: 'Fail deleted post',
            data: error
        })
    }
}

const post = async (req, res) => {
    const iduser = req.user.id
    console.log(iduser);
    try {
        const check = await postNew.findOne({
            where: { user_id: iduser }
        })

        if (!check) {
            console.log("created post");
            return create_post(req, res)
        }

        console.log("upload post")
        return upload_post(req, res)

    } catch (error) {
        return res.send({
            message: 'fail post',
            data: error
        })
    }
}

module.exports = { post, delete_post }