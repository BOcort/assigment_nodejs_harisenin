const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/VerifyToken')
const {post} = require('../controllers/post.controler')
const multer = require('multer')

const uploadDir = `${process.cwd()}/upload`
const Post_Dir = `${uploadDir}/post_picture`
const uploadPost = multer({dest:Post_Dir})

router.post('/',verifyToken,uploadPost.single('post_photo'),post)

module.exports = router