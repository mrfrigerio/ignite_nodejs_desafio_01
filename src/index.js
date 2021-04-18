const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  if (!username) {
    return response.status(400).json({error: "Bad request. The username is required on header!"})
  }
  const userExists = users.find((user) => user.username === username)

  if (!userExists) {
    return response.status(400).json({ error: "User not exists!"})
  }

  request.user = userExists
  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
  if(users.some((user) => user.username === username)){
    return response.status(400).json({error: "User already exists!"})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(newUser)
  return response.status(200).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body
  const { user } = request
  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date()
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { id } = request.params

  const { user } = request
  const todo = user.todos.find((t) => t.id === id)

  if(!todo) {
    return response.status(400).json({error: "Todo not found!"})
  }

  Object.assign(todo, {
    title,
    deadline,
  })

  return response.status(200).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
