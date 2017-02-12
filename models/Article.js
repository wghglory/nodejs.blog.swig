const mongoose = require('mongoose');
const articleSchema = require('../schemas/articles');

module.exports = mongoose.model('Article', articleSchema);
