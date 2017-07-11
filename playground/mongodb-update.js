// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('595e6f0e426f083afc5804e5')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then( (result) => {
	// 	console.log(result);
	// } );

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('595e70166f2f362b7ccfe8e5')
	}, {
			$set: {name: 'Jonas'},
			$inc: {age: 1}
	}, {
		returnOriginal: false
	}).then( (res) => {
		console.log(res);
	} );

	// db.close();
});