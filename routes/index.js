const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });

    res.render('home', {
      title: 'Home',
      users: users.map(user => user.toJSON())
    });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/register', async (req, res) => {
  const {
    email,
    username,
    firstname,
    lastname,
    password,
    passwordConfirm
  } = req.body;

  const hash = bcrypt.hashSync(password, 10);
  let errors = [];

  if (
    !email ||
    !username ||
    !firstname ||
    !lastname ||
    !password ||
    !passwordConfirm
  ) {
    errors.push({ message: 'All fields are required' });
  }

  if (password !== passwordConfirm) {
    errors.push({ message: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ message: 'Password must be at least six characters' });
  }

  if (errors.length > 0) {
    return res.render('register', {
      errors,
      email,
      username,
      firstname,
      lastname,
      password,
      passwordConfirm
    });
  }

  try {
    const result = await User.findOrCreate({
      where: {
        username
      },
      defaults: {
        email,
        username,
        firstname,
        lastname,
        password: hash
      }
    });

    const createdUser = result[1];

    if (!createdUser) {
      errors.push({ message: 'User already exists with that username' });
      return res.render('register', {
        errors,
        email,
        username,
        firstname,
        lastname,
        password: hash
      });
    }

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
