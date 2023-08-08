require("dotenv").config()
const express = require('express');
const port = process.env.SERVER_PORT || 3003;
const app = express();
const cors = require("cors")
const { sequelize } = require('./models')

const productRouter = require('./routes/product.route')
const UserRouter = require('./routes/user.route')
const postRouter = require('./routes/post.router')
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors({origin: true,credentials: true}))

sequelize.authenticate().then(function(error) {
    console.log('DATABASE connection has succesfully connected')
}).catch(function (error){
    console.log('unable to connect to database' + error)
})

app.get('/', (req, res) => {
    res.send({Name : "API LEARNING", Version : "1.0.0" ,Author : "ILHAM LIE"})
})

app.use("/api/product", productRouter)
app.use("/api/user",UserRouter)
app.use("/api/post",postRouter)
app.listen(process.env.SERVER_PORT, () => {console.log('server running http://localhost:' + port)})