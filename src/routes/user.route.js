const express = require("express")
const {create, login,update,deleteUser,Upload_PhotoProfile,Change_password} = require("../controllers/user.controler")
const {verifyToken} = require('../middleware/VerifyToken')
const router = express.Router()
const multer = require('multer')

const uploadDir = `${process.cwd()}/upload`
const ProfilePic_Dir = `${uploadDir}/profile_picture`
const uploadProfilePic = multer({dest:ProfilePic_Dir})

// const upload = multer({dest: })
// POST
router.post("/register",create)
router.post("/login",login)
router.post('/Profile-picture', verifyToken,uploadProfilePic.single('profilepic'),Upload_PhotoProfile)

// PUT
router.put('/update',verifyToken,update)
router.put('/change-password',verifyToken,Change_password)

// DELETE
router.delete('/delete', verifyToken,deleteUser)

module.exports = router