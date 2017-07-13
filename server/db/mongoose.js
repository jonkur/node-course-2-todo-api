var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useMongoClient: true}); // mlab test database pw: 2dfwaw3f43we

module.exports = { mongoose };