const Poll = require('./Poll');

exports.createGetPollController = (req, res, next) => {
  res.render('create');
};
exports.createPostPollController = async (req, res, next) => {
  let { title, description, options } = req.body;
  console.log(req.body);

  options = options.map((opt) => {
    return {
      name: opt,
      vote: 0,
    };
  });

  console.log(options);

  let poll = new Poll({
    title,
    description,
    options,
  });

  try {
    await poll.save();
    res.redirect('/polls');
  } catch (e) {
    console.log(e);
  }
};

exports.getAllPolls = async (req, res, next) => {
  try {
    let polls = await Poll.find();
    res.render('polls', { polls });
  } catch (e) {
    console.log(e);
  }
};

exports.viewPollGetController = async (req, res, next) => {
  const id = req.params.id;
  try {
    let poll = await Poll.findById(id);
    let options = [...poll.options];
    let cookie = req.cookies;
    let result = [];
    options.map((opt) => {
      let percentage = (opt.vote * 100) / poll.totalVote;
      result.push({
        ...opt._doc,
        percentage: percentage ? percentage : 0,
      });
    });
    res.render('viewPoll', { poll, result, cookie });
  } catch (e) {
    console.log(e);
  }
};

exports.viewPollPostController = async (req, res, next) => {
  let id = req.params.id;
  let optionId = req.body.options;
  console.log('optionID: ' + optionId);
  try {
    let poll = await Poll.findById(id);
    let options = [...poll.options];
    let index = options.findIndex((o) => o.id === optionId);

    options[index].vote = options[index].vote + 1;
    let totalVote = poll.totalVote + 1;

    await Poll.findOneAndUpdate(
      { _id: poll._id },
      { $set: { options, totalVote } }
    );

    res.cookie('Voted', optionId, { maxAge: 900000 });
    console.log('cookie created successfully');
    res.redirect('/polls/' + id);
  } catch (e) {
    console.log(e);
  }
};
