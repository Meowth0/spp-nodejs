const { Router } = require('express');
const router = Router();
const Task = require('../models/Task');
const multer  = require('multer');
const upload = multer();
const fetch = require("node-fetch");
const { URL } = require('../constants/constants');

router.get('/', async (req, res) => {
  const tasks = await Task.find({}).lean();
  res.render('index', {
    title: 'Tasks',
    isIndex: true,
    tasks
  });
});

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create task',
    isCreate: true
  });
});

router.get('/update/:id', async (req, res) => {
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

router.post('/update/:id', upload.single('fileBuffer'), async (req, res) => {
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

router.put('/update/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.end();
});

router.delete('/delete/:id', async (req, res) => {
  await Task.deleteOne({ _id: req.params.id });
  res.end();
});

router.post('/create', upload.single('fileBuffer'), async (req, res) => {
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