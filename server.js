const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./api/users/routes');
const postRouter = require('./api/posts/routes');
const expressSession = require('express-session');
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/techkids',(error) =>{
    if(error) throw error;

    const app = express();

    //middlewares: sd cho tat ca cac route
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(cors({
        origin: ['http://localhost:3000']
    }))
    app.use(expressSession({
        secret:'keyboard',
        resave: false,
        saveUninitialized: true,
    }));
    //route

    app.use('/api/users',userRouter);//chi sd dc cho userrouter nay vi co them url
    app.use('/api/posts',postRouter);
    //start server
    app.listen(3001,(error)=>{
        if (error) throw error;
        console.log('server listen on port 3001...')
    });
});