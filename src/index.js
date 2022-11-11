const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) return response.status(400).json({ message: 'Usuário não encontrado!', error: true });

  request.user = user;
  
  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (!name || !username) {
    return response.json({ message: 'Você precisa enviar os dados para o cadastro!', error: true });
  }
  
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  return response.status(201).json({ message: 'Usuário cadastrado com sucesso!', error: false });
});

app.get('/users', (request, response) => {
  return response.json({ data: users, error: false });
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json({ data: user.todos, error: false});
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const {title, deadline} = request.body;

  if (!title || !deadline) {
    return response.status(400).json({ message: 'Você precisa enviar os dados para o cadastro!', error: true });
  }

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  });

  return response.status(200).json({ data: user.todos[user.todos.length - 1], error: false});
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;