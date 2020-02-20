const express = require('express');
const app = express();
const httpApp = require('http').createServer(app);
const io = require('socket.io')(httpApp);
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

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