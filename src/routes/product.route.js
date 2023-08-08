const express = require("express")
const {allproduct,productsbyid} = require("../controllers/product.controler")
const { verifyToken } = require("../middleware/VerifyToken")
const router = express.Router()

router.get("/",verifyToken,allproduct)
router.get("/:id",verifyToken, productsbyid)
module.exports = router