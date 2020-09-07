const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const pollController = require('./PollController');
var cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/create', pollController.createGetPollController);
app.post('/create', pollController.createPostPollController);
app.get('/polls/:id', pollController.viewPollGetController);
app.post('/polls/:id', pollController.viewPollPostController);
app.get('/polls', pollController.getAllPolls);

mongoose
  .connect('mongodb://localhost:27017/express-poll', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => console.log('App running in 5000'));
  })
  .catch((e) => console.log(e));
