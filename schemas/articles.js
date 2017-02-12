const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //ref field
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // models/Category.js
    },
    //ref field
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    addTime: {
        type: Date,
        default: new Date()
    },
    viewAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    comments: {
        type: Array,
        default: []
    }
});
