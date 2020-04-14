const { dest, parallel, series, src, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');

const paths = {
  dist: './dist',
  src: './src',
  scss: './scss'
};

function scriptsTask(webpackConfig) {
  console.log('Building client...');

  return src(`${paths.src}/**/*.js`)
    .pipe(
      webpack({
        ...webpackConfig,
        ...require('./webpack.config.js')
      })
    )
    .pipe(dest(`${paths.dist}/js`))
    .pipe(browserSync.stream());
}

function stylesTask(outputStyle) {
  return src(`${paths.scss}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write('/'))
    .pipe(dest(`${paths.dist}/css`))
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
  watch(`${paths.src}/**/*.js`, scriptsDev);
}

function startServer() {
  browserSync.init({
    proxy: 'http://localhost:5000',
    notify: false,
    online: true
  });

  watchTask();
}

exports.scripts = scriptsBuild;
exports.styles = stylesBuild;
exports.build = series(stylesBuild, scriptsBuild);
exports.default = series(parallel(stylesDev, scriptsDev), startServer);
