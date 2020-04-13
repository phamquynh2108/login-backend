//user models: save email(uniq: k trung),password
//trg hop log in bang face thif k can pass
//fbId: lay dc cac thong tin tu tren fb xuong
//first, lastname,avatarUrl
//createdAt

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique:  true,//db dam bao 2 ban ghi bi trung email
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type:String,
        required: true,
    },
    lastName: {
        type:String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: new Date(),
    },
    permissions: [String],//check quyen
})

const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;