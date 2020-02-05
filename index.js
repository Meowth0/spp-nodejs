const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const app = express();
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
app.use(tasksRoutes);

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://test:test@cluster0-wwchr.mongodb.net/test', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    app.listen(PORT);
  }
  catch (err) {
    console.log(err);
  }
};


start();
console.log(`App running on http://localhost:${PORT}`);