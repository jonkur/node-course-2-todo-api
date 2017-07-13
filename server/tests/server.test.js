const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
	{_id: new ObjectID(), text: 'First new test todo'}, 
	{_id: new ObjectID(), text: 'Second newer test todo'}
];

beforeEach( (done) => {
	Todo.remove({}).then( () => {
		return Todo.insertMany(todos);
	} ).then( () => done() );
} );

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Some test todo text here';

		request(app)
			.post('/todos')
			.send({text}) // ES6 syntax, refers to variable above, same as {text: text}
			.expect(200)
			.expect( (res) => {
				expect(res.body.text).toBe(text);
			})
			.end( (err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then( (todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				} ).catch( (e) => done(e) );
			} );
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end( (err, res) => {
				if(err) return done(err);

				Todo.find().then( (todos) => {
					expect(todos.length).toBe(2);
					done();
				} ).catch( (e) => done(e) );
			} );
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect( (res) => {
				expect(res.body.todos.length).toBe(2);
			} )
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			} )
			.end(done);
	});

	it('should return a 404 if todo not found', (done) => {
		var objId = new ObjectID().toHexString();	// New random bogus objectID
		request(app)
			.get(`/todos/${objId}`)
			.expect(404)
			.end(done);
	});

	it('should return a 404 for non-object ids', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}123`) // make objectId invalid by adding '123' to the end
			.expect(404)
			.end(done);
	});
});