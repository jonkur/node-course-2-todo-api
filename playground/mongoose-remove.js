const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then( (result) => {
// 	console.log(result);
// } );

Todo.findOneAndRemove({text: 'This should be removed and returned'}).then( (res) => {
	console.log(res);
} );