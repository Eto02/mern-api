const express = require('express');
const {body}=require('express-validator');

const router = express.Router();

const BlogController= require('../controllers/BlogController');

//Post :: v1/blog/post/
router.post('/post',[
    body('title').isLength({min:5}).withMessage('Data tidak sesuai'),
    body('body').isLength({min:5}).withMessage('Data tidak sesuai')
],BlogController.createBlog);

router.get('/posts',BlogController.getAllBlogPost);
router.get('/post/:postId',BlogController.getPostById);
router.put('/post/:postId',[
    body('title').isLength({min:5}).withMessage('Data tidak sesuai'),
    body('body').isLength({min:5}).withMessage('Data tidak sesuai')
],BlogController.updateBlogPost);
router.delete('/post/:postId',BlogController.deleteBlogPost)


module.exports= router;