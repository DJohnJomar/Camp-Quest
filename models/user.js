const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        require: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);//This will add necessary stuff to our schema like username, password field, and methods we can use.

module.exports = mongoose.model('User', UserSchema);