const { Schema, model } = require('mongoose');

const quizSchema = new Schema({

  options: [String],
});

module.exports = model('Quiz', quizSchema);
