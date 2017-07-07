// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').find({_id: new ObjectID('595e6e95cbb88c1ebcdad00c')}).toArray().then( (docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// } );

	// db.collection('Todos').find().count().then( (count) => {
	// 	console.log(`Todos count: ${count}`);

	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// } );

	db.collection('Users').find({name: 'Jonas'}).toArray().then( (docs) => {
		console.log('Users who matched your search:');
		console.log(JSON.stringify(docs, undefined, 3));
	}, (err) => {
		console.log('Something went wrong with your search. Please try again.');
	} );

	// db.close();
});