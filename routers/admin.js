'use strict';

const express = require('express');
const router = express.Router();

let User = require('../models/User');
let Category = require('../models/Category');
let Article = require('../models/Article');

router.use((req, res, next) => {
    if (!req.userInfo.isAdmin) {
        res.send('sorry, this is for admin');
        return;
    }
    next();
});

// admin index page: localhost/admin/
router.get('/', (req, res, next) => {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

// userlist page: localhost/admin/user
/*router.get('/user', (req, res, next) => {
    User.find().then((users) => {
        res.render('admin/userlist', {
            userInfo: req.userInfo,
            users: users
        });
    });
});*/

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

    User.count().then(totalCount => {
        // totalCount: total record numbers in db
        let pageSize = 2; // display how many records per page
        let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
        let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
        page = Math.min(page, maxPageNumber);
        page = Math.max(page, 1);

        let skipAmount = (page - 1) * pageSize;

        User.find().limit(pageSize).skip(skipAmount).then((users) => {
            res.render('admin/userlist', { //not case-sensative
                userInfo: req.userInfo,
                users,
                apiName: 'user',
                page,
                maxPageNumber,
                pageSize,
                totalCount,
            });
        });
    });

});

/*category list pagination: localhost/admin/category?page=1 */
router.get('/category', (req, res, next) => {

    Category.count().then(totalCount => {
        // totalCount: total record numbers in db
        let pageSize = 2; // display how many records per page
        let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
        let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
        page = Math.min(page, maxPageNumber);
        page = Math.max(page, 1);

        let skipAmount = (page - 1) * pageSize;

        // -1 降序， 1 升序， _id在创建时考虑时间了， -1 也就按照最新到最老数据的排序
        Category.find().sort({
            _id: -1
        }).limit(pageSize).skip(skipAmount).then(categories => {
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

/*article list*/
router.get('/article', (req, res, next) => {

    Article.count().then(totalCount => {
        // totalCount: total record numbers in db
        let pageSize = 2; // display how many records per page
        let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
        let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
        page = Math.min(page, maxPageNumber);
        page = Math.max(page, 1);

        let skipAmount = (page - 1) * pageSize;

        // -1 降序， 1 升序， _id在创建时考虑时间了， -1 也就按照最新到最老数据的排序
        Article.find().limit(pageSize).skip(skipAmount).populate(['category', 'user']).sort({
            addTime: -1
        }).then(articles => {
            res.render('admin/articlelist', { //not case-sensative
                userInfo: req.userInfo,
                articles,
                apiName: 'article',
                page,
                maxPageNumber,
                pageSize,
                totalCount
            });
        });
    });
});

/*article add get request*/
router.get('/article/add', (req, res, next) => {
    // load categories and choose one when add a new article
    Category.find().sort({
        _id: -1
    }).then(categories => {
        res.render('admin/articleAdd', {
            userInfo: req.userInfo,
            categories
        });
    });
});

/*article add save, post request*/
router.post('/article/add', (req, res, next) => {

    if (req.body.category === '') {
        console.log('you kid')
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'article should have a category first'
        });
        return;
    }

    if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'article title cannot be null'
        });
        return;
    }

    new Article({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(result => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'article saved successfully',
            url: '/admin/article'
        });
    });
});

/*article update get request*/
router.get('/article/edit', (req, res) => {
    let id = req.query.id || '';
    let categories = [];

    // load all categories to dropdown, then load the article that needs to be modified
    Category.find().sort({
        _id: -1
    }).then((result) => {
        categories = result;
        return Article.findOne({
            _id: id
        }).populate('category');
    }).then(article => { // load article in edit page
        if (!article) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'article doesn\'t exist'
            });
        } else {
            res.render('admin/articleEdit', {
                userInfo: req.userInfo,
                categories,
                article
            });
        }
    });
});

/*article save update post request*/
router.post('/article/edit', (req, res) => {
    let id = req.query.id || '';

    if (req.body.category === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'article must have a category'
        });
        return;
    }

    if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'article title cannot be null'
        });
        return;
    }

    Article.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(result => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'article saved successfully',
            url: '/admin/article/edit?id=' + id
        });
    });
});

/*article delete*/
router.get('/article/delete', (req, res) => {
    let id = req.query.id || '';

    Article.remove({
        _id: id
    }).then(result => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'delete successfully',
            url: '/admin/article'
        });
    });
});

module.exports = router;
