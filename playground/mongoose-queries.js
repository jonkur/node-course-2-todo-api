const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '596747a1ea0f6d23e482b4afss';

// if (!ObjectID.isValid(id)) {
// 	console.log('ID not valid!');
// }

// Todo.find({
// 	_id: id
// }).then( (todos) => {
// 	console.log('Todos', todos)
// }, (e) => {
// 	console.log('Error', e);
// } );

// Todo.findOne({
// 	_id: id
// }).then( (todo) => {
// 	console.log('Todo', todo);
// }, (e) => {
// 	consoel.log('Error', e);
// } );

// Todo.findById(id).then( (todo) => {
// 	if (!todo) {
// 		return console.log('ID not found!');
// 	}
// 	console.log('Todo by id', todo);
// } ).catch( (e) => console.log(e) );

var userId = '5964f2971edaf610142d63a1';

User.findById(userId).then( (user) => {
	if (!user) {
		return console.log('Could not find user with that ID!');
	}

	console.log(`User with id ${userId}:`, user);
} ).catch( (e) => {
	console.log('There was an error: ', e);
} )