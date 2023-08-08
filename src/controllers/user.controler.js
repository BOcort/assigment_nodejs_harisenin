const knexQuery = require('../ModelKnex/knex')
const { userNew } = require('./../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const create = async (req, res) => {
    const { nama_depan, nama_belakang, username, email, password } = req.body

    try {
        if (!nama_depan || !email || !password || !username) {
            return res.status(400).send({
                message: "Some field must be filled,cannot be empty"
            })
        }

        const bashedPassword = bcrypt.hashSync(password,8)

        const input = await userNew.create({
            firstname: nama_depan,
            lastname: nama_belakang,
            username: username,
            email: email,
            password: bashedPassword
        })


        return res.status(201).send({
            Message: "user Created"
        })

    } catch (error) {
        return res.send({
            message: "error ecourred",
            data: error.errors[0].message
        })

    }

}

const login = async(req,res) => {
    try {
        const {username, password} = req.body
        if (!password || !username) {
            return res.status(400).send({
                message: "Some field must be filled,cannot be empty"
            })
        }

        const getuser = await userNew.findOne({
            where:{username : username}
        })

        if (!getuser) {
            res.status(404).send({
                message: "username : " + username + " 404" 
            })
        }
        const tryPassword = bcrypt.compareSync(password, getuser.dataValues.password)
        if (!tryPassword) {
         return res.status(400).send({
            message:"Wrong password"
         })   
        }
        
        const token = jwt.sign({
            id: getuser.dataValues.id,
            username: getuser.dataValues.username,
        }, process.env.JWT_SECRET,{expiresIn: '30m'})

        return res.status(200).send({
            message:"Login Success",
            token:token
        })

    } catch (error) {
        return res.send({
            message: "error ecourred",
            data: error
        })
    }
}

const update = async (req,res) => {
    try {
        const iduser = req.user.id
        const {nama_depan,nama_belakang,username} = req.body

        const updateData = await userNew.update({
            firstname: nama_depan,
            lastname: nama_belakang,
            username: username
        }, {
            where: {id: iduser}})

        const data = await userNew.findOne({
            where: {id: iduser}
        })

        res.status(201).send({
            message: 'user updated',
            data: data
        })

    } catch (error) {
        console.log(error);
        return res.send({
            message: 'Update was error',
            data: error
        })        
    }
}

const deleteUser = async (req, res ) => {
    try {
        const iduser = req.user.id 
        const deletedUser = await userNew.destroy({
            where: {id: iduser}
        })

        res.status(200).send({
            message: 'This account has been deleted',
            data: deletedUser
        })
    } catch (error) {
        return res.send({
            message: 'Update was error',
            data: error
        })
    }
}

const Upload_PhotoProfile = async (req, res) =>{
    try {
        const iduser = req.user.id 
        const profile_picture = req.file.filename
        console.log(profile_picture)
        const image_upload = await userNew.update({
            profilepic: profile_picture
        },{where:{ id : iduser}})
        const upload_user = await userNew.findOne({
            where:{id: iduser}
        })
        return res.status(201).send({
            message: "Profile Picture succes",
            picture: profile_picture,
            data: upload_user
        })
    } catch (error) {
        return res.send({
            message: 'Upload was error',
            data: error
        })
    }

}

const Change_password = async (req,res) => {
    try {
        const iduser = req.user.id
        const {OldPassword,NewPassword} = req.body
        const userdata = await userNew.findOne({
            where:{id: iduser}
        })
        const isValidPassword = bcrypt.compareSync(OldPassword, userdata.dataValues.password)
        if (!isValidPassword) {
            return res.status(201).send({
                message: 'Wrong Password'
            })
        }

        if(!validator.isStrongPassword(NewPassword)) {
            return res.status(400).send({
                message:'Password is Not Strong. 8 Character , 1 Uppercase, 1 Lowercase, 1 Number and 1 Symbol'
            })
        }


        const UpdatePassword = await userNew.update({
            password: bcrypt.hashSync(NewPassword,8)
        },{where:{id: iduser}})
        return res.status(201).send({
            message:'Password has been change'
        })
    } catch (error) {
        return res.send({
            message: 'password was not update',
            data: error
        })
    }
}

module.exports = { create,login,update,deleteUser,Upload_PhotoProfile,Change_password }