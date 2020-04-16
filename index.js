require('dotenv').config();

const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 5000;

app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    helpers: {
      section(name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      }
    }
  })
);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/', router);

app.listen(PORT, () => {
  /* eslint-disable-next-line */
  console.log(`Node is listening at http://localhost:${PORT}`);
});
