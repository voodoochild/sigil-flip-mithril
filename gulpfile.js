var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');

gulp.task('html', function () {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', function () {
  return gulp.src('./src/styles/main.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('js', function () {
  var b = browserify({
    entries: './src/javascript/index.js',
    debug: true,
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/javascript'));
});

gulp.task('default', ['html', 'css', 'js'], function () {
  gulp.watch('./src/index.html', ['html']);
  gulp.watch('./src/styles/**/*.scss', ['css']);
  gulp.watch('./src/javascript/**/*.js', ['js']);
});
