const mongoose = require('mongoose');
 
const PostSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    createAt:{
        type:Date,
        default: Date.now,

    }
});

const PostModel = mongoose.model('Post',PostSchema);
module.exports = PostModel;