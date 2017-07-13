var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});
mongoose.connect('mongodb://jkur2:asdewq123@ds159112.mlab.com:59112/todoapi-db', {useMongoClient: true}); // mlab test database pw: 2dfwaw3f43we

module.exports = { mongoose };