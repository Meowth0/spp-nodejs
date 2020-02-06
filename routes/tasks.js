require('dotenv').config();
const { Router } = require('express');
const router = Router();
const Task = require('../models/Task');
const multer  = require('multer');
const jwt = require('jsonwebtoken')
const upload = multer();
const fetch = require("node-fetch");
const { URL } = require('../constants/constants');

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

router.post('/login', (req, res) => {
  const { username } = req.body;
  if (process.env.loginName !== username) {
    return res.sendStatus(401);
  }
  const user = { name: username };
  

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.cookie('jwtToken', accessToken);  
  return res.redirect('/');
});

router.get('/login', (req, res) => {
  const accessToken = jwt.sign({ name: 'test' }, process.env.ACCESS_TOKEN_SECRET);
  if (req.cookies.jwtToken === accessToken) {
    return res.redirect('/');
  }
  res.render('login');
});

router.get('/', authenticateToken, async (req, res) => {
  const tasks = await Task.find({}).lean();
  res.render('index', {
    title: 'Tasks',
    isIndex: true,
    tasks
  });
});

router.get('/create', authenticateToken, (req, res) => {
  res.render('create', {
    title: 'Create task',
    isCreate: true
  });
});

router.get('/update/:id', authenticateToken, async (req, res) => {
  const { status, fileContent, description, deadline, _id, file } = await Task.findById(req.params.id);
  res.render('update', {
    title: 'Update task',
    isUpdate: true,
    status,
    fileContent,
    description,
    deadline,
    file,
    _id
  });
});

router.post('/update/:id', authenticateToken, upload.single('fileBuffer'), async (req, res) => {
  if (req.body._method === 'PUT') {
    const file = req.file;
    await fetch(`${URL}/update/${req.params.id}`, {
      method: 'PUT',
      body: {
        ...req.body,
        file
      }
    });
  }
  res.redirect('/');
});

router.put('/update/:id', authenticateToken, async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.end();
});

router.delete('/delete/:id', authenticateToken, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id });
  res.end();
});

router.post('/create', authenticateToken, upload.single('fileBuffer'), async (req, res) => {
  const { description, status, deadline, fileContent } = req.body;
  const file = req.file;
  const img = `data:image/png;base64,${Buffer.from(req.file.buffer.buffer).toString('base64')}`;
  await new Task({
    description,
    status,
    deadline,
    fileContent,
    file,
    img
  }).save();
  res.redirect('/');
});

module.exports = router;