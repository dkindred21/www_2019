//
// Gulpfile
//
var gulp                   = require('gulp'),
    sass                   = require('gulp-sass'),
    changed                = require('gulp-changed'),
    autoprefixer           = require('gulp-autoprefixer'),
    rename                 = require('gulp-rename'),
    del                    = require('del'),
    concat                 = require('gulp-concat'),
    cssnano                = require('gulp-cssnano'),
    uglify                 = require('gulp-uglifyjs'),
    cache                  = require('gulp-cache'),
    imagemin               = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant               = require('imagemin-pngquant'),
    browserSync            = require('browser-sync').create();



//
// Gulp plumber error handler - displays if any error occurs during the process on your command
//
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}


//
// SASS - Compile SASS files into CSS
//
gulp.task('sass', function () {
 // Theme
 gulp.src([
   './assets/include/scss/**/*.scss',
   '!./assets/include/scss/bootstrap.scss',
  ])
  .pipe(changed('./assets/css/'))
  .pipe(sass({ outputStyle: 'expanded' }))
  .on('error', sass.logError)
  .pipe(autoprefixer([
      "last 1 major version",
      ">= 1%",
      "Chrome >= 45",
      "Firefox >= 38",
      "Edge >= 12",
      "Explorer >= 10",
      "iOS >= 9",
      "Safari >= 9",
      "Android >= 4.4",
      "Opera >= 30"], { cascade: true }))
  .pipe(gulp.dest('./assets/css/'))
  .pipe(browserSync.stream());
});



//
// Bootstrap Compile SASS files into CSS
//
//
gulp.task('sass-bootstrap', ['sass'], function() {
  return gulp.src('./assets/include/scss/bootstrap.scss')
    .pipe(changed('./assets/vendor/bootstrap/css/'))
    .pipe(sass({outputStyle:'expanded'}))
    .on('error', sass.logError)
    .pipe(autoprefixer([
      "last 1 major version",
      ">= 1%",
      "Chrome >= 45",
      "Firefox >= 38",
      "Edge >= 12",
      "Explorer >= 10",
      "iOS >= 9",
      "Safari >= 9",
      "Android >= 4.4",
      "Opera >= 30"],
      { cascade: true }))
    .pipe(gulp.dest('./assets/vendor/bootstrap/css/'))
    .pipe(browserSync.stream());
});



//
// BrowserSync (live reload) - keeps multiple browsers & devices in sync when building websites
//
//
gulp.task('serve', function() {
  browserSync.init({
    files: "./*.html",
    startPath: "./html/home/",
    server: {
      baseDir: "./",
    },
  })
});



//
// Gulp Watch and Tasks
//
//
gulp.task('watch', function() {
  gulp.watch('./assets/include/scss/**/*.scss', ['sass-bootstrap']);
  gulp.watch('./html/**/*.html').on('change', browserSync.reload);
  gulp.watch('./starter/**/*.html').on('change', browserSync.reload);
  gulp.watch('./documentation/**/*.html').on('change', browserSync.reload);
});

// Gulp Tasks
gulp.task('default', ['watch', 'sass-bootstrap', 'serve'])



//
// CSS minifier - merges and minifies the below given list of Space libraries into one theme.min.css
//
gulp.task('minCSS', function() {
  return gulp.src([
    './assets/css/theme.css',
  ])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./dist/css/'));
});



//
// JavaSript minifier - merges and minifies the below given list of Space libraries into one theme.min.js
//
gulp.task('minJS', function() {
  return gulp.src([
    './assets/js/hs.core.js',
    './assets/js/components/hs.countdown.js',
    './assets/js/components/hs.counter.js',
    './assets/js/components/hs.cubeportfolio.js',
    './assets/js/components/hs.g-map.js',
    './assets/js/components/hs.go-to.js',
    './assets/js/components/hs.header.js',
    './assets/js/components/hs.instagram.js',
    './assets/js/components/hs.malihu-scrollbar.js',
    './assets/js/components/hs.modal-window.js',
    './assets/js/components/hs.onscroll-animation.js',
    './assets/js/components/hs.progress-bar.js',
    './assets/js/components/hs.quantity-counter.js',
    './assets/js/components/hs.scroll-animation.js',
    './assets/js/components/hs.scroll-nav.js',
    './assets/js/components/hs.show-animation.js',
    './assets/js/components/hs.slick-carousel.js',
    './assets/js/components/hs.step-form.js',
    './assets/js/components/hs.sticky-block.js',
    './assets/js/components/hs.unfold.js',
    './assets/js/components/hs.validation.js',
    './assets/js/components/hs.video-player.js',
    './assets/js/helpers/hs.bg-video.js',
    './assets/js/helpers/hs.focus-state.js',
    './assets/js/custom-theme.js',
  ])
  .pipe(concat('theme.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/'));
});



//
// Image minifier - compresses images
//
gulp.task('minIMG', function() {
  return gulp.src('./assets/img/**/*')
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality:'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
    .pipe(gulp.dest('./dist/img/'));
});



//
// Copy Vendors - a utility to copy client-side dependencies into a folder
//
gulp.task('copyVendors', function() {
  gulp.src([
    './node_modules/*animate.css/**/*',
    './node_modules/*custombox/**/*',
    './node_modules/*flag-icon-css/**/*',
    './node_modules/*gmaps/**/*',
    './node_modules/*instafeed.js/**/*',
    './node_modules/*jquery/**/*',
    './node_modules/*jquery-migrate/**/*',
    './node_modules/*jquery-validation/**/*',
    './node_modules/*malihu-custom-scrollbar-plugin/**/*',
    './node_modules/*popper.js/**/*',
    './node_modules/*typed.js/**/*',
  ])
  .pipe(gulp.dest('./dist/vendor/'))
});

gulp.task('dist', ['copyVendors', 'minCSS', 'minJS', 'minIMG']);