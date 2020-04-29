const express = require('express');
const app = express();
const httpApp = require('http').createServer(app);
const io = require('socket.io')(httpApp);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const graphqlHttp = require('express-graphql');
const User = require('./models/User');
const Task = require('./models/Task');
const { buildSchema } = require('graphql');

const path = require('path');
const PORT = process.env.PORT || 8000;
const tasksRoutes = require('./routes/tasks');



const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(tasksRoutes);

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type User {
      _id: ID!
      login: String!
      password: String!
    }

    type Task {
      _id: ID!
      status: String!
      description: String!
      fileContent: String!
      deadline: String
      img: String!
    }

    input TaskInput {
      status: String!
      description: String!
      fileContent: String!
      deadline: String
      img: String!
    }

    input UserInput {
      login: String!
      password: String!
    }

    type RootQuery {
      tasks: [Task!]!
    }

    type RootMutation {
      createTask(taskInput: TaskInput): Boolean
      createUser(userInput: UserInput): Boolean
      deleteTask(_id: ID!): Boolean
      loginUser(userInput: UserInput): Boolean
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    createUser: args => {
      const { login, password } = args.userInput;
      new User({
        login,
        password
      }).save()
        .then(user => user._doc)
        .catch(err => { console.log(err); throw new Error(err) });
      return true;
    },
    deleteTask: async args => {
      const { _id } = args;
      await Task.deleteOne({ _id });
      return true;
    },
    loginUser: async (args, { req, res }) => {
      const { login, password } = args.userInput;
      const user = await User.findOne({ login, password }).lean();
      res.cookie('jwtToken', jwt.sign(user, process.env.ACCESS_TOKEN_SECRET));
      console.log(user);
      return true;
    }
  },
  graphiql: true,
}));

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://test:test@cluster0-wwchr.mongodb.net/test', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    httpApp.listen(PORT);
  }
  catch (err) {
    console.log(err);
  }
};

start();
let users = 0;
io.on('connection', socket => {
  console.log('User connected');
  users++;
  io.sockets.emit('new user', { users });
  socket.on('disconnect', () => {
    users--;
    io.sockets.emit('user disconnected', { users });
    console.log('User disconnected');
  });
});

console.log(`App running on http://localhost:${PORT}`);