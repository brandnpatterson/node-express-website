const router = require('express').Router();
const { Post } = require('../models');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();

    res.render('home', { posts });
  } catch (err) {
    console.log(err);
  }
});

router.get('/auth', (req, res) => {
  res.render('auth');
});

router.get('/messages', (req, res) => {
  res.render('messages');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

module.exports = router;
