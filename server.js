/*application start*/
'use strict';

/*express*/
const express = require('express');
const app = express(); // create application => nodejs http.createServer()

/*body-parser: handle post request data*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// get user model because in cookies below, we need to know if user is admin
let User = require('./models/User.js');

/*cookies, user login status persistence. This should be written before routers*/
let cookies = require('cookies');
app.use((req, res, next) => {
    req.cookies = new cookies(req, res);
    //resolve login user cookies
    req.userInfo = {};
    if (req.cookies.get('userInfo')) { // user has logged in before
        try {
            // custom variable in request object
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            // find whether user is admin or regular
            User.findById(req.userInfo._id).then((currentUser) => {
                req.userInfo.isAdmin = Boolean(currentUser.isAdmin);
                next();
            });

        } catch (e) {
            console.log('probably JSON parse wrong cookie object')
            next();
        }
    } else { // first time login, not cookie
        next();
    }
});

/*template section*/
const swig = require('swig');
// only for development: when changing templates, default if no restarting server, refreshing web cannot see the latest change because it reads cache in memory
swig.setDefaults({
    cache: false
});
// define template type
app.engine('html', swig.renderFile);
// where templates are stored, first parameter must be views, second dir
app.set('views', './views');
// register templates, first para must be view engine, second must be the same with app.engine(first para)
app.set('view engine', 'html');


/*static file processor*/
app.use('/public', express.static(__dirname + '/public'));

/*router will be in modules*/
// app.get('/', function(req, res, next) {
//     // res.send('<h1>hello blog</h1>');
//     // read specific file under views folder, first para is template, second is data needs to be passed
//     res.render('index');
// });

/*modules based on different fucntions*/
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

/*connect to mongodb*/
const mongoose = require('mongoose');
// start mongodb server and point to project db: mongod --dbpath=/Users/derek/Work/Bitbucket/nodejs.blog.swig/db --port=27018
// will create a blog database and point to db folder
mongoose.connect('mongodb://localhost:27018/blog', function(err) {
    if (err) {
        console.log('fail to connect to db');
    } else {
        console.log('connection successfully');
        app.listen(8888); // node app to run and browser localhost:8888
    }
});
