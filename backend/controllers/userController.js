const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');



// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler( async(req,res) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    
    //Check user exists 
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User alreaady exists')
    }
    
    // Hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //Create user

    const user = await User.create({
        name,
        email,
        password : hashedPassword,
    });

    if(user){
        res.status(201).json({
            _id : user.id,
            name:user.name,
            email:user.email
        })
    } 
    else{
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler( async(req,res) => {

    const {email,password} = req.body;

    const user = await User.findOne({email});
    
    if(user && (await bcrypt.compare(password , user.password))){
        res.status(200).json({
            _id : user.id,
            name:user.name,
            email:user.email 
        })
    }
    else
    {
        res.status(400);
        throw new Error('Invalid user data');  
    }
})

// @desc Get user data
// @route POST /api/users/me
// @access Public
const getMe = asyncHandler( async (req,res) => {
    res.json({message : 'User data display'})
})

module.exports = {
    registerUser,loginUser,getMe
}