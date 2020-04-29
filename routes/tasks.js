require('dotenv').config();
const { Router } = require('express');
const router = Router();
const Task = require('../models/Task');
const User = require('../models/User');
const multer  = require('multer');
const jwt = require('jsonwebtoken');
const upload = multer();
const moment = require('moment');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.redirect('/login');
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.redirect('/login');
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

router.get('/register', (req, res) => {
  res.render('register', { signUp: true });
});

router.get('/login', (req, res) => {
  res.render('login', { signUp: false });
});

router.get('/', authenticateToken, async (req, res) => {
  const tasks = await Task.find({}).lean();
  const formattedTasks = tasks.map(task => ({...task, deadline: moment(task.deadline).format('DD MMMM YYYY') }));
  res.render('index', {
    title: 'Tasks',
    isIndex: true,
    tasks: formattedTasks,
    signIn: true
  });
});

router.get('/create', authenticateToken, (req, res) => {
  res.render('create', {
    title: 'Create task',
    isCreate: true,
    signIn: true
  });
});

router.get('/update/:id', authenticateToken, async (req, res) => {
  const { status, fileContent, description, deadline, _id, file } = await Task.findById(req.params.id);
  res.render('update', {
    title: 'Update task',
    isUpdate: true,
    signIn: true,
    status,
    fileContent,
    description,
    deadline: moment(deadline).format('DD MMMM YYYY'),
    _id, 
    file
  });
});

router.post('/update/:id', authenticateToken, upload.single('fileBuffer'), async (req, res) => {
  const img = `data:image/png;base64,${Buffer.from(req.file.buffer.buffer).toString('base64')}`;
  await Task.findByIdAndUpdate(req.params.id, { ...req.body, img, file: req.file });
  res.redirect('/');
});

router.post('/create', authenticateToken, upload.single('fileBuffer'), async (req, res) => {
  const { description, status, deadline, fileContent } = req.body;
  const { file } = req;
  const img = `data:image/png;base64,${Buffer.from(req.file.buffer.buffer).toString('base64')}`;  
  await new Task({
    description,
    status,
    deadline,
    fileContent,
    img,
    file
  }).save();
  res.redirect('/');
});

module.exports = router;