const { Schema, model } = require('mongoose');

const schema = new Schema({
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'new'
  },
  fileContent: {
    type: String,
    default: ''
  },
  deadline: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  file: {
    type: Object
  }
});

module.exports = model('Task', schema);