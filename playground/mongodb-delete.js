// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then( (result) => {
	// 	console.log(result);
	// } );

	// db.collection('Todos').deleteOne({text: 'Feed cats'}).then( (result) => {
	// 	console.log(result);
	// } );

	// db.collection('Todos').findOneAndDelete({completed: false}).then( (result) => {
	// 	console.log(result);
	// } );

//öööh
	// db.collection('Users').findOne({name: 'Jonas'}).then( (result) => {
	// 	console.log('Preserve this shit: \n' + result);
	// 	db.collection('Users').deleteMany({name: 'Jonas'}, !result).then( (res) => {
	// 		console.log(res);
	// 	})
	// } );

	db.collection('Users').findOneAndDelete({_id: ObjectID('595f67f7a661730254b947e3')}).then( (result) => {
		console.log(result);
	} );

	// db.close();
});