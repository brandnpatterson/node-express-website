require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'pug');
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Node is listening at http://localhost:${PORT}`);
});
