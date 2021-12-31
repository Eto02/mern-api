const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
//Routes
const AuthRoutes= require('./src/routes/AuthRoutes');
const BlogRoutes= require('./src/routes/BlogRoutes');


const fileStorage= multer.diskStorage({
    destination:(req, file , cb)=>{
        cb(null,'images')
    },
    filename:(req, file, cb)=>{
        cb(null,new Date().getTime()+ '-' + file.originalname)
    }
})

const fileFillter = (req, file , cb)=>{
    if (file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg') {
        cb(null,true)
    }else{
        cb(null,false)
    }
}

//Middleware
app.use('/images',express.static(path.join(__dirname,'/images')))
app.use(multer({storage:fileStorage,fileFilter:fileFillter}).single('image'));
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
    next()
})

//Group Route
app.use('/v1/auth',AuthRoutes);
app.use('/v1/blog',BlogRoutes);
app.use((err,req,res,next)=>{
    const status= err.errorStatus||500;
    const message= err.message;
    const data =err.data;
    res.status(status).json({
        message:message,
        data:data
    })
})

mongoose.connect('mongodb+srv://Tahta:latihan@cluster0.j3nsx.mongodb.net/blog?retryWrites=true&w=majority')
.then(()=>{
    app.listen(4000,()=>console.log('Connection Success'))
})
.catch(err=>console.log(err))
