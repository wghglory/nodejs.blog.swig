'use strict';

const express = require('express');
const router = express.Router();

let User = require('../models/User'); //introduce to validate if username exists in db
let Article = require('../models/Article');

router.get('/user', function(req, res, next) {
    res.send('api-user'); //localhost:8888/api/user
});

/*
统一返回格式
 */
let responseData = '';
router.use((req, res, next) => {
    responseData = {
        code: 0,
        message: ''
    };

    next();
});

/**
 * register
 * username cannot be null
 * password cannot be null
 * confirm password
 *
 * if username exists in db, select from db
 */
router.post('/user/register', (req, res, next) => {
    console.log(req.body); //bodyParser
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    if (username === '') {
        responseData.code = 1;
        responseData.message = 'username cannot be null';
        res.json(responseData);
        return;
    }
    if (password === '') {
        responseData.code = 2;
        responseData.message = 'password cannot be null';
        res.json(responseData);
        return;
    }
    if (password !== repassword) {
        responseData.code = 3;
        responseData.message = 'password not same';
        res.json(responseData);
        return;
    }

    // check if username exists in db
    User.findOne({
        username: username
    }).then((userInfo) => {
        if (userInfo) { //db has this username
            responseData.code = 4;
            responseData.message = 'username exists in db';
            res.json(responseData);
            return;
        }
        // save to db
        let user = new User({
            username: username,
            password: password
        });
        return user.save();

    }).then((newUserInfo) => {
        responseData.message = 'register successfully';
        res.json(responseData);
    });

});

/*sign in*/
router.post('/user/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username === '' || password === '') {
        responseData.code = 1;
        responseData.message = 'username or password cannot be null';
        res.json(responseData);
        return;
    }

    //search if username and password match in db
    User.findOne({
        username: username,
        password: password
    }).then((userInfo) => {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = 'username or password wrong';
            res.json(responseData);
            return;
        }

        //log in successfully
        responseData.message = 'login successfully';
        responseData.userInfo = userInfo;

        //set cookies
        req.cookies.set('userInfo', JSON.stringify(userInfo));

        res.json(responseData);
    });
});

/*logout*/
router.get('/user/logout', (req, res) => {
    req.cookies.set('userInfo', null); //clear cookie after logout
    res.json(responseData);
});

/*load comments for an article*/
router.get('/comment', (req, res) => {
    let articleId = req.query.articleid || '';

    Article.findOne({
        _id: articleId
    }).then(article => {
        responseData.comments = article.comments;
        res.json(responseData);
    });
});

/*submit comment*/
router.post('/comment/post', (req, res) => {
    let articleId = req.body.articleid || '';
    let postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    //find current article information
    Article.findOne({
        _id: articleId
    }).then(article => {
        article.comments.push(postData);
        return article.save();
    }).then(newArticle => {
        responseData.message = 'comment successfully';
        responseData.article = newArticle;
        res.json(responseData);
    });
});

module.exports = router;
