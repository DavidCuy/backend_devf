const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: String,
    password: String,
    img: {
        type: String,
        default: ''
    }
});

const user = mongoose.model('Users', User);

module.exports = {
    user
};