const express = require('express');
const router = express.Router();

const authController= require('../controllers/AuthController');

//Post :: v1/auth/register/
router.post('/register',authController.register);

module.exports= router;