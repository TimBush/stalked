const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define a new schema
const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

// Model schema into a class we can use
const User = mongoose.model('user', userSchema)

// Export schema
module.exports.User = User;