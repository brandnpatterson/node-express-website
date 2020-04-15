const { dest, parallel, series, src, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const webpackConfigFile = require('./webpack.config.js');

const paths = {
  js: './assets/js',
  scss: './assets/scss',
  views: './views',
  public: './public'
};

function scriptsTask(webpackConfig) {
  console.log('Building client...');

  return src(`${paths.js}/**/*.js`)
    .pipe(
      webpack({
        ...webpackConfig,
        ...webpackConfigFile
      })
    )
    .pipe(dest(`${paths.public}/js`))
    .pipe(browserSync.stream());
}

function stylesTask(outputStyle) {
  return src(`${paths.scss}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write('/'))
    .pipe(dest(`${paths.public}/css`))
    .pipe(browserSync.stream());
}

function scriptsBuild() {
  return scriptsTask({
    mode: 'production'
  });
}

function scriptsDev() {
  return scriptsTask({
    mode: 'development',
    devtool: 'eval-cheap-source-map'
  });
}

function stylesBuild() {
  return stylesTask('compressed');
}

function stylesDev() {
  return stylesTask('expanded');
}

function watchTask() {
  watch(`${paths.scss}/**/*.scss`, stylesDev);
  watch(`${paths.js}/**/*.js`, scriptsDev);
  watch(`${paths.views}/**/*.hbs`).on('change', browserSync.reload);
}

function startServer() {
  browserSync.init({
    proxy: 'http://localhost:5000',
    notify: false,
    online: true,
    open: false
  });

  watchTask();
}

exports.scripts = scriptsBuild;
exports.styles = stylesBuild;
exports.build = series(stylesBuild, scriptsBuild);
exports.default = series(parallel(stylesDev, scriptsDev), startServer);
