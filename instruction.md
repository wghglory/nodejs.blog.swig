# Nodejs.Blog
## Learning 1: project initialization
1. terminal `npm init` to add package.json
1. `npm install --save express` install and add lib name to package.json
1. write all dependencies in package.json and run `npm install` to install all others
1. add folders and app.js

    ```javascript
    var express = require('express');
    // create application => nodejs http.createServer()
    var app = express();
    ```

1. add router

    ```javascript
    app.get('/', function(req, res, next) {
        // res.send('<h1>hello blog</h1>');
        // read specific file under views folder, first para is template, second is data needs to be passed
        res.render('index');
    });

    app.listen(8888); // node app to run and browser localhost:8888
    ```
1. node app to run and browser localhost:8888
1. *ctrl + c* to stop server


## Learning 2: template configuration and return dynamic template html
1. add swig template engine to app.js

    ```javascript
    // only for development: when changing templates, default if no restarting server, refreshing web cannot see the latest change because it reads cache in memory
    swig.setDefaults({cache: false});
    // define template type
    app.engine('html', swig.renderFile);
    // where templates are stored, first parameter must be views, second dir
    app.set('views', './views');
    // register templates, first para must be view engine, second must be the same with app.engine(first para)
    app.set('view engine', 'html');
    ```
1. return dynamic index.html under views


## Learning 3: static files (picture, css, js, index.html)

```javascript
app.use('/public', express.static(__dirname + '/public'));
/* http request => resolve router => find matching rules => run binding function
static: /public, read and return file directly
dynamic: /views, load and return template */
```

## Learning 4: modules
1. app.js modules based on different functions:

    ```javascript
    app.use('/admin', require('./routers/admin'));
    app.use('/api', require('./routers/api'));
    app.use('/', require('./routers/main'));
    ```

1. routers/admin.js:

    ```javascript
    var express = require('express');
    var router = express.Router();
    router.get('/user', function(req, res, next) {
        res.send('admin-user');  //localhost:8888/admin/user
    });
    module.exports = router;
    ```


## Learning 5: data schema and database connection
1. introduce moogoose and define schemas/users model

    ```javascript
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var userSchema = new Schema({
        username: String,
        password: String
    });
    module.exports = userSchema;
    ```
1. write models/User.js

    ```javascript
    var mongoose = require('mongoose');
    var userSchema = require('../schemas/users');
    module.exports = mongoose.model('User', userSchema);
    ```
1. app.js

    ```javascript
    /*connect to mongodb*/
    var mongoose = require('mongoose');
    // will create a blog database and point to db folder
    mongoose.connect('mongodb://localhost:27018/blog', function(err) {
        if (err) {
            console.log('fail to connect to db');
        } else {
            console.log('connection successfully');
            app.listen(8888); // node app to run and browser localhost:8888
        }
    });
    ```
1. start mongodb server and point to project db:
`mongod --dbpath=/Users/derek/Work/Github/nodejs.blog.swig/db --port=27018`
1. run robomongo client to test connection
1. run project `node app`

> mac kill localhost:
>
> ```bash
> lsof -i :27018
> kill -2 <PID>
> ```

## Learning 6： Frontend sign/register logic

1. in routers/main.js render views/main/index.html

   ```javascript
    var express = require('express');
    var router = express.Router();
    router.get('/', function(req, res, next) {
        // res.send('index content');
        res.render('main/index');  //default will be html
    });
    module.exports = router;
   ```

2. create index.html under views/main (dynamic pages)

   ```Html
   <!doctype html>
   <html>

   <head>
       <meta charset="utf-8">
       <title>博客</title>
       <link href="/public/css/main.css" rel="stylesheet" type="text/css">
       <link href="/public/fontAwesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
   </head>

   <body>

       <header>
           <div class="backimg"><img src="/public/images/IMG_0293.JPG"></div>
           <div class="logo"><span></span><img src="/public/images/00002637.png"></div>
       </header>

       <nav>
           <div class="menu">
               <a href="/" class="focus">首页</a>
           </div>
       </nav>

       <main class="clear">
           <div class="mainLeft"></div>
           <div class="mainRight">
               <div class="rightBox" id="loginBox">
                   <div class="title"><span>登录</span></div>
                   <div class="line"><span class="colDark">用户名：</span><input name="username" type="text" /><em></em></div>
                   <div class="line"><span class="colDark">密码：</span><input name="password" type="password" /><em></em></div>
                   <div class="line"><span class="colDark"></span><button>登 录</button></div>
                   <p class="textRight">还没注册？<a href="javascript:;" class="colMint">马上注册</a></p>
                   <p class="colWarning textCenter"></p>
               </div>

               <div class="rightBox" id="registerBox" style="display: none;">
                   <div class="title"><span>注册</span></div>
                   <div class="line"><span class="colDark">用户名：</span><input name="username" type="text" /></div>
                   <div class="line"><span class="colDark">密码：</span><input name="password" type="password" /></div>
                   <div class="line"><span class="colDark">确认：</span><input name="repassword" type="password" /></div>
                   <div class="line"><span class="colDark"></span><button>注 册</button></div>
                   <p class="textRight">已有账号？<a href="javascript:;" class="colMint">马上登录</a></p>
                   <p class="colWarning textCenter"></p>
               </div>

               <div class="rightBox">
                   <div class="title"><span>社区</span></div>
                   <p><a href="http://www.google.com" target="_blank" class="colDanger">google</a></p>
                   <p><a href="http://bbs.baidu.com" target="_blank" class="colDanger">baidu</a></p>
               </div>
           </div>
       </main>

       <div class="copyright textCenter">Copyright © Guanghui</div>
   </body>
   <script src="/public/js/jquery-1.12.4.min.js"></script>
   <script src="/public/js/index.js"></script>

   </html>
   ```

1. introduce static files under public folder: images, js, css, fontAwesome.

1. in public/js/index.js: write frontend register/sign logic, send ajax call to different router/api, api will be implemented later

   ```javascript
   $(function() {

       var $loginBox = $('#loginBox');
       var $registerBox = $('#registerBox');
       var $userInfo = $('#userInfo');

       //切换到注册面板
       $loginBox.find('a.colMint').on('click', function() {
           $registerBox.show();
           $loginBox.hide();
       });

       //切换到登录面板
       $registerBox.find('a.colMint').on('click', function() {
           $loginBox.show();
           $registerBox.hide();
       });

       //注册
       $registerBox.find('button').on('click', function() {
           //通过ajax提交请求
           $.ajax({
               type: 'post',
               url: '/api/user/register',
               data: {
                   username: $registerBox.find('[name="username"]').val(),
                   password: $registerBox.find('[name="password"]').val(),
                   repassword: $registerBox.find('[name="repassword"]').val()
               },
               dataType: 'json',
               success: function(result) {
                   $registerBox.find('.colWarning').html(result.message);

                   if (!result.code) {
                       //注册成功
                       setTimeout(function() {
                           $loginBox.show();
                           $registerBox.hide();
                       }, 1000);
                   }

               }
           });
       });

       //登录
       $loginBox.find('button').on('click', function() {
           //通过ajax提交请求
           $.ajax({
               type: 'post',
               url: '/api/user/login',
               data: {
                   username: $loginBox.find('[name="username"]').val(),
                   password: $loginBox.find('[name="password"]').val()
               },
               dataType: 'json',
               success: function(result) {

                   $loginBox.find('.colWarning').html(result.message);

                   if (!result.code) {
                       //登录成功
                       window.location.reload();
                   }
               }
           });
       });

       //退出
       $('#logout').on('click', function() {
           $.ajax({
               url: '/api/user/logout',
               success: function(result) {
                   if (!result.code) {
                       window.location.reload();
                   }
               }
           });
       });

   });
   ```

1. open mongodb and run node project, open localhost:8888 to see index.html

## Learning 7：body-parser and api register validation
1. api accepts and resolve post request, need body-parser, so in app.js

    ```javascript
    /*handle post request data*/
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    ```

1. api.js includes register post validation:

    ```javascript
    var express = require('express');
    var router = express.Router();
    router.get('/user', function(req, res, next) {
        res.send('api-user'); //localhost:8888/api/user
    });

    /*
    统一返回格式
     */
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

        responseData.message = 'register successfully';
        res.json(responseData);
    });
    module.exports = router;
    ```

## Learning 8: mongodb select/insert, username exists db check, save registered user to db
1. schemes/users.js:

    ```javascript
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const userSchema = new Schema({
        username: String,
        password: String
    });

    module.exports = userSchema;
    ```

1. models/User.js:

    ```javascript
    const mongoose = require('mongoose');
    const userSchema = require('../schemas/users');
    module.exports = mongoose.model('User', userSchema);
    ```

1. routers/api.js

    ```javascript
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
            console.log(newUserInfo);
            responseData.message = 'register successfully';
            res.json(responseData);
        });

    });
    ```

## Learning 9: user login
1. views/main/index.html

    ```html
    <div class="rightBox" id="userInfo" style="display:none;">
        <div class="title"><span>用户信息</span></div>
        <p><span class="colDark username"></span></p>
        <p><span class="colDanger info"></span></p>
        <p><span class="colDark logout"><a href="javascript:">log out</a></span></p>
    </div>
    ```

1. api login:

    ```javascript
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
            res.json(responseData);
        });
    });
    ```

1. public/index.js frontend logic:

    ```javascript
    //登录
    $loginBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {

                $loginBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //登录成功
                    setTimeout(() => {
                        $loginBox.hide();
                        $userInfo.show();

                        //show user info
                        $userInfo.find('.username').html(result.userInfo.username);
                        $userInfo.find('.info').html('hi, welcome!');
                    }, 1000);
                }
            }
        });
    });
    ```

## Learning 10: cookie, 登陆状态保持
问题：以上learning 9登陆后，刷新页面，状态失去

1. app.js introduce cookies before routers:

    ```javascript
    /*cookies, user login status persistence. This should be written before routers*/
    let cookies = require('cookies');
    app.use((req, res, next) => {
        req.cookies = new cookies(req, res);
        //resolve login user cookies
        req.userInfo = {};
        if (req.cookies.get('userInfo')) { // user has logged in before (cookie set in api)
            try {
                // custom variable in request object
                req.userInfo = JSON.parse(req.cookies.get('userInfo'));
                next();
            } catch (e) {
                console.log('probably JSON parse wrong cookie object')
                next();
            }
        } else { // first time login, not cookie
            next();
        }
    });
    ```


1. api.js login successfully, set cookies:

    ```javascript
    //set cookies after login successfully
    req.cookies.set('userInfo', JSON.stringify(userInfo));
    ```
    ```javascript
    /*logout*/
    router.get('/user/logout', (req, res) => {
        req.cookies.set('userInfo', null);  //clear cookie after logout
        res.json(responseData);
    });
    ```

1. routers/main.js pass req.userInfo, if not null => user login

    ```javascript
    router.get('/', function(req, res, next) {
        // res.send('index content');

        res.render('main/index', {
            userInfo: req.userInfo
        }); //default will be html,
        // pass userInfo data, if not null => user already logged in => show userinfo div.
        // null => user not login => show login div
    });
    ```

1. public/index.js

    ```javascript
    //登录
    $loginBox.find('button').on('click', function() {
        $.ajax({
            success: function(result) {
                $loginBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //登录成功
                    /*setTimeout(() => {
                        $loginBox.hide();
                        $userInfo.show();

                        //show user info
                        $userInfo.find('.username').html(result.userInfo.username);
                        $userInfo.find('.info').html('hi, welcome!');
                    }, 1000);*/

                    //after login => cookie has userInfo => reload page => index.html will render based on "userInfo"
                    window.location.reload();
                }
            }
        });
    });

    //logout
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(result) {
                if (!result.code) {
                    // backend clear cookie, req.userInfo = null => reload will show login
                    window.location.reload();
                }
            }
        });
    });
    ```

1. views/main/index.html renders views based on userInfo object from main.js

    ```html
    <!-- show userinfo div or login/register based on whether backend passed userInfo data -->
    {%if userInfo._id%}
    <div class="rightBox" id="userInfo">
        <div class="title"><span>用户信息</span></div>
        <p><span class="colDark username">{{userInfo.username}}</span></p>
        <p><span class="colDanger info">welcome to my blog!</span></p>
        <p><span class="colDark" id="logout"><a href="javascript:">log out</a></span></p>
    </div>
    {%else%}
    <div class="rightBox" id="loginBox">
        <div class="title"><span>登录</span></div>
        <div class="line"><span class="colDark">用户名：</span><input name="username" type="text" /><em></em></div>
        <div class="line"><span class="colDark">密码：</span><input name="password" type="password" /><em></em></div>
        <div class="line"><span class="colDark"></span><button>登 录</button></div>
        <p class="textRight">还没注册？<a href="javascript:;" class="colMint">马上注册</a></p>
        <p class="colWarning textCenter"></p>
    </div>
    <div class="rightBox" id="registerBox" style="display: none;">
        <div class="title"><span>注册</span></div>
        <div class="line"><span class="colDark">用户名：</span><input name="username" type="text" /></div>
        <div class="line"><span class="colDark">密码：</span><input name="password" type="password" /></div>
        <div class="line"><span class="colDark">确认：</span><input name="repassword" type="password" /></div>
        <div class="line"><span class="colDark"></span><button>注 册</button></div>
        <p class="textRight">已有账号？<a href="javascript:;" class="colMint">马上登录</a></p>
        <p class="colWarning textCenter"></p>
    </div>
    {%endif%}
    ```

## Learning 11: regular user and admin
1. schemas/users.js add isAdmin

    ```js
    const userSchema = new Schema({
        username: String,
        password: String,
        isAdmin: {
            type: Boolean,
            default: false
        }
    });
    ```

1. manually insert admin data to mongodb

    ```json
    {
        "username":"admin",
        "password":"admin",
        "isAdmin":true
    }
    ```

1. app.js: search current user isAdmin and set it to req.userInfo.isAdmin

    ```javascript
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
    ```

1. views/main/index.html display admin or regular user

    ```html
    {%if userInfo.isAdmin%}
    <p><span class="colDanger info">welcome Admin, </span><a href="/admin">enter admin</a></p>
    {%else%}
    <p><span class="colDanger info">welcome to my blog!</span></p>
    {%endif%}
    ```

## Learning 12: master page extends, admin page render
1. include bootstrap in public folders

1. create layout.html in views/admin

    ```html
    <div class="container-fluid">
        {%block main%}{%endblock%}
    </div>
    ```

1. views/admin/index.html

    ```html
    {%extends 'layout.html'%}

    {%block main%}
    <section class="jumbotron">
        <h1>hello, {{userInfo.username}}</h1>
        <p>welcome to back admin management system</p>
    </section>
    woca
    {%endblock%}
    ```

1. routers/admin.js

    ```javascript
    router.use((req, res, next) => {
        if (!req.userInfo.isAdmin) {
            res.send('sorry, this is for admin');
            return;
        }
        next();
    });

    // localhost/admin/
    router.get('/', (req, res, next) => {
        res.render('admin/index', {
            userInfo: req.userInfo
        });
    });
    ```

1. login by admin and click "enter admin" (localhost/admin) to see result

## Learning 13: load all users to userlist page
1. routers/admin.js load userlist

    ```javascript
    let User = require('../models/User');

    // userlist page: localhost/admin/user
    router.get('/user', (req, res, next) => {
        User.find().then((users) => {
            res.render('admin/userlist', {
                userInfo: req.userInfo,
                users: users
            });
        });
    });
    ```

1. create views/admin/userlist.html

    ```html
    {%extends 'layout.html'%}

    {%block main%}

    <ol class="breadcrumb">
        <li><a href="/">management index</a></li>
        <li><span>user list</span></li>
    </ol>

    <h3>user list</h3>
    <table class="table table-hover table-striped">
        <tr>
            <th>id</th>
            <th>username</th>
            <th>password</th>
            <th>isAdmin</th>
        </tr>
        {%% for user in users}
        <tr>
            <td>{{user._id}}</td>
            <td>{{user.username}}</td>
            <td>{{user.password}}</td>
            <td>{%if user.isAdmin%}yes{%endif%}</td>
        </tr>
        {%endfor%}
    </table>

    {%endblock%}
    ```

1. after entering admin index, click "用户管理" to localhost/admin/user

## Learning 14: userlist pagination and include other pages, not extends from master page
1. routers/admin.js pagination load (querystring, count, skip, limit)

    ```javascript
    // userlist pagination: localhost/admin/user?page=1
    router.get('/user', (req, res, next) => {
        /*
         * 从数据库中读取所有的用户数据
         *
         * limit(Number) : 限制获取的数据条数
         * skip(2) : 忽略数据的条数
         *
         * 每页显示2条
         * 1 : 1-2 skip:0 -> (当前页-1) * limit
         * 2 : 3-4 skip:2
         * */

        User.count().then((totalCount) => {
            // totalCount: total record numbers in db
            let pageSize = 2; // display how many records per page
            let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
            let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
            page = Math.min(page, maxPageNumber);
            page = Math.max(page, 1);

            let skipAmount = (page - 1) * pageSize;

            User.find().limit(pageSize).skip(skipAmount).then((users) => {
                res.render('admin/userlist', {
                    userInfo: req.userInfo,
                    users,
                    page,
                    maxPageNumber,
                    pageSize,
                    totalCount
                });
            });
        });

    });
    ```

1. create reusable views/admin/pagination.html

    ```html
    <nav>
        <ul class="pager">
            <li class="previous"><a href="/admin/user?page={{page-1}}">&larr; 上一页</a></li>
            <li>一共有 {{totalCount}} 条数据，每页显示 {{pageSize}} 条数据，一共 {{maxPageNumber}} 页，当前第 {{page}} 页</li>
            <li class="next"><a href="/admin/user?page={{page+1}}">下一页 &rarr;</a></li>
        </ul>
    </nav>
    ```

1. in views/admin/userlist.html, include pagination page

    ```html
    {%include 'pagination.html'%}
    ```

## Learning 15: admin adds category
1. create schemas/categories.js

    ```javascript
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const categorySchema = new Schema({
        name: String
    });

    module.exports = categorySchema;
    ```

1. create models/Category.js

    ```javascript
    const mongoose = require('mongoose');
    const categorySchema = require('../schemas/categories');
    module.exports = mongoose.model('Category', categorySchema);
    ```

1. routers/admin.js add category add get/post

    ```javascript
    let Category = require('../models/Category');

    /*category add get request*/
    router.get('/category/add', (req, res) => {
        res.render('admin/categoryAdd', {
            userInfo: req.userInfo
        });
    });

    /*category add post request*/
    router.post('/category/add', (req, res) => {
        let name = req.body.name || '';
        if (name === '') {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'category name cannot be null'
            });
            return;
        }

        //check if db has existing category name
        Category.findOne({
            name
        }).then((result) => {
            if (result) { // name exists in db
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: 'category already exists'
                });
                return Promise.reject();
            } else { //save new category to db
                return new Category({
                    name
                }).save();
            }
        }).then(newCategory => {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: 'save category successfully',
                url: '/admin/category'
            });
        });
    });
    ```

1. create views/admin/categoryAdd.html

    ```html
    {% extends 'layout.html' %}

    {% block main %}

    <ol class="breadcrumb">
        <li><a href="/admin">管理首页</a></li>
        <li><span>分类添加</span></li>
    </ol>

    <h3>分类添加</h3>

    <form role="form" method="post">
        <div class="form-group">
            <label for="name">分类名称：</label>
            <input type="text" class="form-control" id="name" placeholder="请输入分类名称" name="name">
        </div>
        <button type="submit" class="btn btn-default">提交</button>
    </form>

    {% endblock %}
    ```

1. create views/admin/success.html

    ```html
    {% extends 'layout.html' %}

    {% block main %}

    <ol class="breadcrumb">
        <li><a href="/admin">管理首页</a></li>
        <li><span>成功提示</span></li>
    </ol>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">成功提示</h3>
        </div>
        <div class="panel-body">{{message}}</div>
        <div class="panel-footer">
            <a href="{{url}}">点击这里跳转</a>
        </div>
    </div>

    {% endblock %}
    ```

1. create views/admin/error.html

    ```html
    {% extends 'layout.html' %}

    {% block main %}

    <ol class="breadcrumb">
        <li><a href="/admin">管理首页</a></li>
        <li><span>错误提示</span></li>
    </ol>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">错误提示</h3>
        </div>
        <div class="panel-body">{{message}}</div>
        <div class="panel-footer">
            {% if url %}
            <a href="{{url}}">点击这里跳转</a>
            {% else %}
            <a href="javascript:window.history.back();">返回上一步</a>
            {% endif %}
        </div>
    </div>

    {% endblock %}
    ```

1. in http://localhost:8888/admin, click "分类管理/添加分类" and test result

## Learning 16: admin -- category list, edit, delete. regular user -- load category list
### admin category list get request
1. routers/admin.js add category load all

    ```javascript
    // category list pagination: localhost/admin/category?page=1
    router.get('/category', (req, res, next) => {

        Category.count().then(totalCount => {
            // totalCount: total record numbers in db
            let pageSize = 2; // display how many records per page
            let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
            let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
            page = Math.min(page, maxPageNumber);
            page = Math.max(page, 1);

            let skipAmount = (page - 1) * pageSize;

            Category.find().sort({_id: -1}).limit(pageSize).skip(skipAmount).then(categories => {
                res.render('admin/categorylist', { //not case-sensative
                    userInfo: req.userInfo,
                    categories,
                    apiName: 'category',
                    page,
                    maxPageNumber,
                    pageSize,
                    totalCount
                });
            });
        });

    });
    ```

1. views/admin/categoryList.html

    ```html
    {% extends 'layout.html' %}

    {% block main %}

    <ol class="breadcrumb">
        <li><a href="/admin">管理首页</a></li>
        <li><span>分类列表</span></li>
    </ol>

    <h3>分类列表</h3>

    {% include 'pagination.html' %}

    <table class="table table-hover table-striped">
        <tr>
            <th>ID</th>
            <th>分类名称</th>
            <th>操作</th>
        </tr>

        {% for category in categories %}
        <tr>
            <td>{{category._id.toString()}}</td>
            <td>{{category.name}}</td>
            <td>
                <a href="/admin/category/edit?id={{category._id.toString()}}">修改</a> |
                <a href="/admin/category/delete?id={{category._id.toString()}}">删除</a>
            </td>
        </tr>
        {% endfor %}

    </table>

    {% include 'pagination.html'%}

    {% endblock %}
    ```

1. note when passing data in api, apiName is added, so pagination.html will know it's category or user

    ```html
    <a href="/admin/{{apiName}}?page={{page-1}}">&larr; 上一页</a>
    ```

### main page category list get request
1. routers/main.js load categories

    ```javascript
    const Category = require('../models/Category');

    router.get('/', function(req, res, next) {

        Category.find().then(categories => {
            res.render('main/index', {
                userInfo: req.userInfo,
                categories
            }); //default will be html,
            // pass userInfo data, if not null => user already logged in => show userinfo div.
            // null => user not login => show login div
        });
    });
    ```

1. views/main/index.html

    ```html
    <div class="menu">
        <a href="/" class="focus">首页</a>
        {%for category in categories%}
        <a href="/">{{category.name}}</a>
        {%endfor%}
    </div>
    ```

### admin category edit
1. routers/admin.js add category/edit

    ```javascript
    /*category edit get request*/
    router.get('/category/edit', (req, res, next) => {
        let id = req.query.id || '';
        Category.findOne({
            _id: id
        }).then(category => {
            if (!category) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: 'category doesn\'t exist'
                });
            } else {
                res.render('admin/categoryEdit', {
                    userInfo: req.userInfo,
                    category
                });
            }
        });
    });

    /*category edit post request*/
    router.post('/category/edit', (req, res, next) => {
        let id = req.query.id || ''; // post request, however id is available?
        let name = req.body.name || '';

        Category.findOne({
            _id: id
        }).then(category => {
            if (!category) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: 'category doesn\'t exist'
                });

                return Promise.reject();
            } else {
                // admin doesn't modify name and click submit
                if (name === category.name) {
                    res.render('admin/success', {
                        userInfo: req.userInfo,
                        message: 'update successfully',
                        url: '/admin/category'
                    });
                    return Promise.reject();
                } else { // whether new name exists in db
                    return Category.findOne({
                        name
                    });
                }
            }
        }).then(result => {
            if (result) { // db has already a category with same name
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: 'db has existing name'
                });
                return Promise.reject();
            } else {
                return Category.update({
                    _id: id
                }, {
                    name
                });
            }
        }).then(() => {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: 'update successfully',
                url: '/admin/category'
            });
        });

    });
    ```

1. create views/admin/categoryEdit.html

    ```html
    {% extends 'layout.html' %}

    {% block main %}

    <ol class="breadcrumb">
        <li><a href="/admin">管理首页</a></li>
        <li><span>分类编辑</span></li>
    </ol>

    <h3>分类编辑 - {{category.name}}</h3>

    <form role="form" method="post">
        <div class="form-group">
            <label for="name">分类名称：</label>
            <input type="text" value="{{category.name}}" class="form-control" id="name" placeholder="请输入分类名称" name="name">
        </div>
        <button type="submit" class="btn btn-default">提交</button>
    </form>

    {% endblock %}
    ```

### admin category delete (routers/admin.js)
```javascript
/*category delete*/
router.get('/category/delete', (req, res) => {
   let id = req.query.id || id;

   Category.remove({
       _id: id
   }).then(() => {
       res.render('admin/success', {
           userInfo: req.userInfo,
           message: 'delete successfully',
           url: '/admin/category'
       });
   });
});
```
---

## Learning 17 content CRUD, model refers another model
### create content model and schema
1. create schemas/categories.js

    ```javascript
    const mongoose = require('mongoose');

    modules.exports = new mongoose.Schema({
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
    ```

1. create models/Content.js

    ```javascript
    const mongoose = require('mongoose');
    const contentSchema = require('../schemas/contents');
    module.exports = mongoose.model('Content', contentSchema);
    ```

### select contents and populate relative category: ==populate(string or array)==
1. add routers/admin.js content list

    ```javascript
    let Content = require('../models/Content');

    /*content list*/
    router.get('/content', (req, res, next) => {

        Content.count().then(totalCount => {
            // totalCount: total record numbers in db
            let pageSize = 2; // display how many records per page
            let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
            let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
            page = Math.min(page, maxPageNumber);
            page = Math.max(page, 1);

            let skipAmount = (page - 1) * pageSize;

            // -1 降序， 1 升序， _id在创建时考虑时间了， -1 也就按照最新到最老数据的排序
            Content.find().sort({
                _id: -1
            }).limit(pageSize).skip(skipAmount).populate(['category', 'user']).then(contents => {
                res.render('admin/contentlist', { //not case-sensative
                    userInfo: req.userInfo,
                    contents,
                    apiName: 'content',
                    page,
                    maxPageNumber,
                    pageSize,
                    totalCount
                });
            });
        });
    });
    ```

1. create views/admin/contentList.html, note time operation

    ```html
    {% for content in contents %}
    <tr>
        <td>{{content._id.toString()}}</td>
        <td>{{content.category.name}}</td>
        <td>{{content.title}}</td>
        <td>{{content.user.username}}</td>
        <td>{{content.addTime|date('Y年m月d日 H:i:s', -8*60)}}</td><!--swig filter, -8*60 is eastern 8 timezone-->
        <td>{{content.viewAmount}}</td>
        <td>
            <a href="/admin/content/edit?id={{content._id.toString()}}">修改</a> |
            <a href="/admin/content/delete?id={{content._id.toString()}}">删除</a>
        </td>
    </tr>
    {% endfor %}
    ```

### create and save content
1. add routers/admin.js add content

    ```javascript
    /*content add get request*/
    router.get('/content/add', (req, res, next) => {
        // load categories and choose one when add a new content
        Category.find().sort({
            _id: -1
        }).then(categories => {
            res.render('admin/contentAdd', {
                userInfo: req.userInfo,
                categories
            });
        });
    });

    /*content add save, post request*/
    router.post('/content/add', (req, res, next) => {

        if (req.body.category === '') {
            console.log('you kid')
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'content should have a category first'
            });
            return;
        }

        if (req.body.title === '') {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'content title cannot be null'
            });
            return;
        }

        new Content({
            category: req.body.category,
            title: req.body.title,
            user: req.userInfo._id.toString(),
            description: req.body.description,
            content: req.body.content
        }).save().then(result => {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: 'content saved successfully',
                url: '/admin/content'
            });
        });
    });
    ```
1. add views/admin/contentAdd.html

### update content

```javascript
/*content update get request*/
router.get('/content/edit', (req, res) => {
   let id = req.query.id || '';
   let categories = [];

   // load all categories to dropdown, then load the content that needs to be modified
   Category.find().sort({
       _id: -1
   }).then((result) => {
       categories = result;
       return Content.findOne({
           _id: id
       }).populate('category');
   }).then((content) => { // load content in edit page
       if (!content) {
           res.render('admin/error', {
               userInfo: req.userInfo,
               message: 'content doesn\'t exist'
           });
       } else {
           res.render('admin/contentEdit', {
               userInfo: req.userInfo,
               categories,
               content
           });
       }
   });
});

/*content save update post request*/
router.post('/content/edit', (req, res) => {
   let id = req.query.id || '';

   if (req.body.category === '') {
       res.render('admin/error', {
           userInfo: req.userInfo,
           message: 'content must have a category'
       });
       return;
   }

   if (req.body.title === '') {
       res.render('admin/error', {
           userInfo: req.userInfo,
           message: 'content title cannot be null'
       });
       return;
   }

   Content.update({
       _id: id
   }, {
       category: req.body.category,
       title: req.body.title,
       description: req.body.description,
       content: req.body.content
   }).then((err) => {
       res.render('admin/success', {
           userInfo: req.userInfo,
           message: 'content saved successfully',
           url: '/admin/content/edit?id=' + id
       });
   });
});
```

### content delete

```javascript
/*content delete*/
router.get('/content/delete', (req, res) => {
   let id = req.query.id || '';

   Content.remove({
       _id: id
   }).then((err) => {
       res.render('admin/success', {
           userInfo: req.userInfo,
           message: 'delete successfully',
           url: '/admin/content'
       });
   });
});
```

## Learning 18: index page list of contents
1. routers/main.js add list

    ```javascript
    const Content = require('../models/Content');

    /*index*/
    router.get('/', function(req, res, next) {

        /*Category.find().then(categories => {
            res.render('main/index', {
                userInfo: req.userInfo,
                categories
            }); //default will be html,
            // pass userInfo data, if not null => user already logged in => show userinfo div.
            // null => user not login => show login div
        });*/

        let data = {
            userInfo: req.userInfo,
            categories: [],
            totalCount: 0,
            page: Number(req.query.page) || 1,
            pageSize: 2,
            maxPageNumber: 0
        };

        Category.find().then(categories => {
            data.categories = categories;
            return Content.count();
        }).then(totalCount => {
            data.totalCount = totalCount;
            //计算总页数
            data.maxPageNumber = Math.ceil(data.totalCount / data.pageSize);
            //取值不能超过maxPageNumber
            data.page = Math.min(data.page, data.maxPageNumber);
            //取值不能小于1
            data.page = Math.max(data.page, 1);

            var skipAmount = (data.page - 1) * data.pageSize;

            return Content.find().limit(data.pageSize).skip(skipAmount).populate(['category', 'user']).sort({
                addTime: -1
            });
        }).then(function(contents) {
            data.contents = contents;
            res.render('main/index', data);
        });
    });
    ```

1. views/main/index.html

    ```html
    <div class="mainLeft">
        {%for content in contents%}
        <div class="listBox">
            <h1>{{content.title}}</h1>
            <p class="colDefault">
                作者：<span class="colInfo">{{content.user.username}}</span> -
                时间：<span class="colInfo">{{content.addTime|date('Y年m月d日 H:i:s', -8*60)}}</span> -
                阅读：<span class="colInfo">{{content.viewAmount}}</span> -
                评论：<span class="colInfo">{{content.comments.length}}</span>
            </p>
            <dfn><p>{{content.description}}</p></dfn>
            <div class="function"><a href="/view?contentid={{content.id}}">阅读全文</a></div>
        </div>
        {%endfor%}

        <div class="pager">
            <ul class="clear">

                <li class="previous">

                    {%if page <= 1%}
                    <span>没有上一页了</span>
                    {%else%}
                    <a href="/?category={{category}}&page={{page-1}}">上一页</a>
                    {%endif%}

                </li>

                {%if maxPageNumber > 0%}
                <li>
                    <strong>{{page}} / {{maxPageNumber}}</strong>
                </li>
                {%endif%}

                <li class="next">

                    {%if page >= maxPageNumber%}
                    <span>没有下一页了</span>
                    {%else%}
                    <a href="/?category={{category}}&page={{page+1}}">下一页</a>
                    {%endif%}

                </li>

            </ul>
        </div>
    </div>
    ```

## Learning 19: load list based on category id
when clicking "首页", no need where category; only when clicking a category like javascript, pass category id to where clause.

1. routers/main.js

    let data = {
        userInfo: req.userInfo,
        categories: [],
        ==category: req.query.category || '', //click javascript, html, etc. category, pass clicked category id==
        totalCount: 0,
        page: Number(req.query.page) || 1,
        pageSize: 2,
        maxPageNumber: 0
    };

    ==// filter clicked category
    let whereCondition = {};
    if (data.category) {
        whereCondition.category = data.category; // note mongodb content table has field called "category", storing id.
    }==

    Category.find().then(categories => {
        data.categories = categories;
        return Content.==where(whereCondition)==.count();
    }).then(totalCount => {
        return Content.==where(whereCondition)==.find().limit(data.pageSize).skip(skipAmount)...
    })...

1. views/main/index.html

    ```html
    <div class="menu">
       {%if category === ''%}
       <a href="/" class="focus">首页</a>
       {%else%}
       <a href="/">首页</a>
       {%endif%}

       {%for cate in categories%}
       {%if category === cate.id%}
       <a href="/?category={{cate.id}}" class="focus">{{cate.name}}</a>
       {%else%}
       <a href="/?category={{cate.id}}">{{cate.name}}</a>
       {%endif%}
       {%endfor%}
   </div>
   ```

## Learning 20: content detail, viewAmount

1. routers/main.js: both index and view need load categories, to be more specific, layout's nav needs categories data. So hanlde general data below.

    ```javascript
    let data;
    /*handle general data*/
    router.use((req, res, next) => {
        data = {
            userInfo: req.userInfo,
            categories: []
        };

        Category.find().then(categories => {
            data.categories = categories;
            next();
        });
    });

    /*index*/
    router.get('/', function(req, res, next) {

        data.category = req.query.category || ''; //click javascript, html, etc. category, pass clicked category id
        data.totalCount = 0;
        data.page = Number(req.query.page) || 1;
        data.pageSize = 2;
        data.maxPageNumber = 0;

        // filter clicked category
        let whereCondition = {};
        if (data.category) {
            whereCondition.category = data.category; // note mongodb content table has field called "category", storing id.
        }

        Content.where(whereCondition).count().then(totalCount => {
            data.totalCount = totalCount;
            //计算总页数
            data.maxPageNumber = Math.ceil(data.totalCount / data.pageSize);
            //取值不能超过maxPageNumber
            data.page = Math.min(data.page, data.maxPageNumber);
            //取值不能小于1
            data.page = Math.max(data.page, 1);

            var skipAmount = (data.page - 1) * data.pageSize;

            return Content.where(whereCondition).find().limit(data.pageSize).skip(skipAmount).populate(['category', 'user']).sort({
                addTime: -1
            });
        }).then(function(contents) {
            data.contents = contents;
            res.render('main/index', data);
        });
    });

    /*user click "read detail" to content detail */
    router.get('/view', (req, res) => {
        let contentId = req.query.contentid || '';

        Content.findOne({
            _id: contentId
        }).then(content => {
            data.content = content;
            content.viewAmount++;
            content.save();

            res.render('main/view', data);
        });
    });
    ```

1. create views/main/layout.html and view.html, work on 3 html

    view.html:

    ```html
    {%extends 'layout.html'%}

    {%block content%}
        <div class="listBox">
            <h1>{{content.title}}</h1>
            <p class="colDefault">
                作者：<span class="colInfo">{{content.user.username}}</span> -
                时间：<span class="colInfo">{{content.addTime|date('Y年m月d日 H:i:s', -8*60)}}</span> -
                阅读：<span class="colInfo">{{content.viewAmount}}</span> -
                评论：<span class="colInfo">{{content.comments.length}}</span>
            </p>
            <dfn>
                {{content.content}}
            </dfn>
        </div>
    {%endblock%}
    ```

## Learning 21: post/load comments, frontend pagination.
1. views/main/view.html

    ```html
    {%extends 'layout.html'%}

    {%block css%}
    <link rel="stylesheet" href="/public/css/pagination.css">
    {%endblock%}

    {%block content%}
    <div class="listBox">
        <h1>{{content.title}}</h1>
        <p class="colDefault">
            作者：<span class="colInfo">{{content.user.username}}</span> -
            时间：<span class="colInfo">{{content.addTime|date('Y年m月d日 H:i:s', -8*60)}}</span> -
            阅读：<span class="colInfo">{{content.viewAmount}}</span> -
            评论：<span class="colInfo">{{content.comments.length}}</span>
        </p>
        <dfn>
            {{content.content}}
        </dfn>
    </div>

    <div class="listBox message">
        <h3 class="textLeft"><strong>评论</strong> <span class="em">一共有 <em id="messageCount">0</em> 条评论</span></h3> {% if userInfo._id %}
        <p class="textLeft clear">
            <textarea id="messageContent"></textarea>
            <input type="hidden" id="contentId" value="{{content.id}}">
            <button id="messageBtn" class="submit">提交</button>
        </p>
        {%else%}
        <p class="bgDanger" style="line-height: 30px;">你还没有登录，请先登录！</p>
        {%endif%}

        <div class="messageList">
        </div>

        <!-- not use pagination -->
        <!-- <div class="pager">
                <ul class="clear">
                    <li class="previous">
                        <a href="">上一页</a>
                    </li>
                    <li></li>
                    <li class="next">
                        <a href="">下一页</a>
                    </li>
                </ul>
            </div> -->

        <div id="pagination"></div>

        <!--<div class="messageList">-->
        <!--<div class="messageBox"><p>还没有留言</p></div>-->
        <!--</div>-->

        <!--<div class="messageList" style="display: block;">-->
        <!--<div class="messageBox">-->
        <!--<p class="name clear"><span class="fl">admin</span><span class="fr">2016年07月29日 17:24:01</span></p><p>哈哈</p>-->
        <!--</div>-->
        <!--</div>-->

    </div>

    {%endblock%}

    {%block scripts%}
    <script src="/public/js/time.js"></script>
    <script src="/public/js/pagination.js"></script>
    <script src="/public/js/comment.js"></script>
    {%endblock%}

    ```

1. routers/api.js add comment functions

    ```javascript
    /*load comments for an article*/
    router.get('/comment', (req, res) => {
        let contentId = req.query.contentid || '';

        Content.findOne({
            _id: contentId
        }).then(content => {
            responseData.comments = content.comments;
            res.json(responseData);
        });
    });

    /*submit comment*/
    router.post('/comment/post', (req, res) => {
        let contentId = req.body.contentid || '';
        let postData = {
            username: req.userInfo.username,
            postTime: new Date(),
            content: req.body.content
        };
        //find current article information
        Content.findOne({
            _id: contentId
        }).then(content => {
            content.comments.push(postData);
            return content.save();
        }).then(newContent => {
            responseData.message = 'comment successfully';
            responseData.comment = newContent;
            res.json(responseData);
        });
    });
    ```

1. create pagination.js and pagination.css

1. create public/js/comment.js
