const express = require('express');
const UserModel = require('./model');
const bcryptjs = require('bcryptjs');
const path = require('path');
const userRouter = express();
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


// userRouter.use(express.static('public'));

userRouter.get('/test',(req, res) =>{
    console.log('CurrentUser:',req.session.currentUser);
    res.json({
        success: true,
    });
});

userRouter.get('/register',(req,res) => {
    res.status(200).sendFile(path.resolve(__dirname, '../../public/html/register.html')); 
});

userRouter.get('/login',(req,res) =>{
    res.status(200).sendFile(path.resolve(__dirname, '../../public/html/login.html'));
});

userRouter.post('/register', async(req,res) => {
    try {
        const {email , password , firstName , lastName} = req.body;
        //validate email,pw, pullName
        if(!email || !emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: 'Invalid email address',
            });
        }else if(!password || password.length < 6){
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }else if(!firstName){
            res.status(400).json({
                success: false,
                message: 'Please input first name',
            });
        }else if(!lastName){
            res.status(400).json({
                success: false,
                message: 'Please input last name',
            });
        }else{
            //check email exist
            UserModel.findOne({email: email}, (error,data) =>{
                if(error) {
                    res.status(500).json({
                        success: false,
                        message: error.message,
                    });
                }else if (data) {//check data:neu data da ton tai
                    res.status(400).json({
                        success: false,
                        message: 'Email has been used',
                    });
                }else{
                    //hash password
                    const hashPassword = bcryptjs.hashSync(password,10);
                    //save to db
                    UserModel.create({
                        ...req.body,
                        password: hashPassword,
                        permissions: ['POST.CREATE'],
                    }, (err, newUser)=>{
                        if(err){
                            res.status(500).json({
                                success: false,
                                message: err.message,
                            })
                        }else{
                            res.status(201).json({
                                success: true,
                                data:{
                                    ...newUser._doc,
                                    password:'',//tra ve string rong
                                }
                            });
                        }
                    });
                }
            }); 
        }  
    } catch (error) {
        res.status(500).end(error.message);
    }
});

userRouter.post('/login', async(req,res) => {
    try {
        const loginInfo = req.body;
        //check email, password empty
        if (loginInfo.email.toString().length ===0 || loginInfo.password.length===0){
            res.status(400).json({
                success: false,
                message:'Please input',
            });
        }else {
            //check email exist
            UserModel.findOne({email: loginInfo.email} , (err,data) => {
                if(err) {
                    res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }else if( !data) {
                    res.status(400).json({
                        success: false,
                        message: 'Email didnt exist',
                    });
                }else if (!bcryptjs.compareSync(loginInfo.password, data.password)) {
                    res.status(400).json({
                        success: false,
                        message: 'Wrong password',
                    });
                }else {
                    //save session storage
                    req.session.currentUser = {
                    _id: data._id,
                    email: data.email,
                    permissions: data.permissions.length > 0 ? data.permissions : [],
                    // permissions: ['POST.CREATE'],
                    };
                    req.session.save();
                    res.status(200).json({
                        success: true,
                        message: 'Login success',
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).end(error.message);
    }    
});

userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }else {
            res.status(200).json({
                success: true,
                message: 'Logout success',
            });
        }
    });
});
module.exports = userRouter;