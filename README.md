# Blog

## project startup
- uncompress db
- `npm install` to install all packages
- `mongod --dbpath=/Users/derek/Work/Github/nodejs.blog.swig/db --port=27018`, modify path
- `node server`
- localhost:8888

## project indroduction
- regular/admin login/logout
- admin backend management, CRUD of user, category and content
- pagination
- content refers user and category
- `npm install supervisor -g`, and `supervisor appName` to start nodejs

Note:
```javascript
console.log(categories[0]._id);   //Object, needs toString()
console.log(categories[0].id===categories[0]._id.toString());   //true!
```
