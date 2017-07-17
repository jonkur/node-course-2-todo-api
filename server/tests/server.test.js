const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
	{_id: new ObjectID(), text: 'First new test todo'}, 
	{_id: new ObjectID(), text: 'Second newer test todo', completed: true, completedAt: 333}
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

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo._id).toBe(hexId);
			} )
			.end( (err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then( (todo) => {
					expect(todo).toNotExist();
					done();
				} ).catch( (e) => done(e) );
			} );
	});

	it('should return a 404 if todo not found', (done) => {
		var objId = new ObjectID().toHexString();	// New random bogus objectID
		request(app)
			.delete(`/todos/${objId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
			.delete(`/todos/${todos[0]._id.toHexString()}123`) // make objectId invalid by adding '123' to the end
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var updatedText = 'Text now updated via testing module';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({'text': updatedText, 'completed': true})
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo.text).toBe(updatedText);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			} )
			.end( (err, res) => {
				if (err) return done(err);

				// Check that todo was updated in the database
				Todo.findById(hexId).then( (todo) => {
					if (!todo) return res.status(404).send();

					expect(todo.text).toBe(updatedText);
					expect(todo.completed).toBe(true);
					expect(todo.completedAt).toBeA('number');
					done();
				} ).catch( (e) => done(e) );
			} );
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var updatedText = "Updated text, completed should be false and completedAt null";
		request(app)
			.patch(`/todos/${hexId}`)
			.send({text: updatedText, completed: false})
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo.text).toBe(updatedText);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			} )
			.end( (err, res) => {
				if (err) return done(err);

				// Check that todo was updated in the db
				Todo.findById(hexId).then( (todo) => {
					if (!todo) return res.status(404).send();

					expect(todo.text).toBe(updatedText);
					expect(todo.completed).toBe(false);
					expect(todo.completedAt).toNotExist();
					done();
				} ).catch( (e) => done(e) );
			} );
	});
});