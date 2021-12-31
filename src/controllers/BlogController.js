const {validationResult}= require('express-validator');
const BlogPost = require('../models/BlogModel')
const path = require('path');
const fs = require('fs');
exports.createBlog=(req, res, next)=>{
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err= new Error('Invalid Value!');
        err.errorSatatus=400;
        err.data=errors.array();
        throw err;
    }

    if (!req.file) {
        const err= new Error('Image Has not Found!');
        err.errorSatatus=422;
        err.data=errors.array();
        throw err;
    }

    const title= req.body.title;
    const image= req.file.path;
    const body= req.body.body;

    const Posting = new BlogPost({
        title:title,
        body:body,
        image:image,
        author:{
            uid:1,
            nama:"Tahta FM"
        }
    })
    Posting.save()
    .then(result=>{
        
        res.status(201).json({
            message:'Create Blog Post Success',
            data:result
        });
    })
    .catch(err=>{
        console.log('err:',err)
    });
}

exports.getAllBlogPost=(req, res,next)=>{
    const currentPage= parseInt(req.query.page) || 1;
    const perPage= parseInt(req.query.perPage) || 5;
    let totalItems;
    
    BlogPost.find()
    .countDocuments()
    .then(count=>{
        totalItems=count;
         return  BlogPost.find()
        .skip((currentPage -1 )*perPage)
        .limit(perPage);
    })
    .then(result=>{
        res.status(200).json({
            message:'Get Data Success',
            data:result,
            total:totalItems,
            per_page:perPage,
            current_page:currentPage,
        })
    })
    .catch(err=>{
        next(err);
    });

}
exports.getPostById=(req, res, next)=>{
    BlogPost.findById(req.params.postId)
    .then(result=>{
        if (!result) {
           const error= new Error('Blog post not found!');
           error.errorSatatus=404;
           throw error;
        } 
        res.status(200).json({
            message:'Get Data Success',
            data:result
        })
    })
    .catch(err=>{
        next(err)
    })
}
exports.updateBlogPost=(req, res, next)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err= new Error('Invalid Value!');
        err.errorSatatus=400;
        err.data=errors.array();
        throw err;
    }

    
    const title= req.body.title;
    const image=(!req.file ? '':req.file.path);
    const body= req.body.body;
    const postId= req.params.postId;
    BlogPost.findById(postId)
    .then(post=>{
        if (!post) {
           const error= new Error('Blog post not found!');
           error.errorSatatus=404;
           throw error;
        } 
        post.title=title;
        post.body=body;
        (!req.file ? '':post.image=image)
        return post.save();
    })
    .then(result=>{
        res.status(200).json({
            message:'Update Success',
            data:result
        })
    })
    .catch(err=>{
        next(err)
    })
}
exports.deleteBlogPost=(req, res, next)=>{
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post=>{
        if (!post) {
            const error= new Error('Blog post not found!');
            error.errorSatatus=404;
            throw error;
         } 
        removeImage(post.image);
     return  BlogPost.findByIdAndRemove(postId)
    })
    .then(result=>{
        res.status(200).json({
            message:'Remove Image Success!!!',
            data:result
        })
    })
    .catch(err=>{
        next(err);  
    })
}

const removeImage =(filePath)=>{
    filePath=path.join(__dirname,'../..',filePath);
    fs.unlink(filePath,err=>console.log(err))
}