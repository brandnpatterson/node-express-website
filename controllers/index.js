const { Post } = require('../models');

exports.home = async (req, res) => {
  try {
    const posts = await Post.findAll();

    res.render('home', { posts });
  } catch (err) {
    console.log(err);
  }
};

exports.auth = (req, res) => {
  res.render('auth');
};

exports.profile = (req, res) => {
  res.render('profile');
};

exports.messages = (req, res) => {
  res.render('messages');
};
