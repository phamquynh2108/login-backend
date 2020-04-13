const express = require('express');
const PostModel = require('./model');
const path = require('path');
const PostRouter = express();

PostRouter.get('/create-content',(req,res) => {
    res.status(200).sendFile(path.resolve(__dirname,'../../public/html/post.html'));
})
PostRouter.post('/create-content',async(req,res) => {
    try {
        if(!req.session.currentUser){
            res.status(403).json({
                message:'Unauthenticated',
            })
        }
        console.log(req.session.currentUser);

        if(req.session.currentUser && req.session.currentUser.permissions.indexOf('POST.CREATE')>-1){
            const postInfo = req.body;
            const newPost = await PostModel.create(postInfo);
            res.status(201).json(newPost);
        }else{
            res.status(403).json({
                message: 'Unathorized',
            })
        }
    } catch (error) {
        res.status(500).end(error.message);
    }
   
});
module.exports = PostRouter;