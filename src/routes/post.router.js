const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/VerifyToken')
const {post,delete_post,deleteUser_Post} = require('../controllers/post.controler')
const multer = require('multer')

const uploadDir = `${process.cwd()}/upload`
const Post_Dir = `${uploadDir}/post_picture`
const uploadPost = multer({dest:Post_Dir})
router.post('/',verifyToken,uploadPost.single('post_photo'),post)

router.put('/deleted',verifyToken,delete_post)

router.delete('/delete-post', verifyToken,deleteUser_Post)
module.exports = router