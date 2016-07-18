var gulp = require('gulp'),
  addsrc = require('gulp-add-src'),
  concat = require('gulp-concat'),
  jade = require('gulp-jade'),
  flatten = require('gulp-flatten'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  base_path = require('path'),
  cssmin = require('gulp-minify-css'),
  plumber = require('gulp-plumber'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;

  var path = {
    public: {//Указываем пути для готового проекта
      html: 'app/public/',
      js: 'app/public/js/',
      css: 'app/public/css/',
      img: 'app/public/img/',
      fonts: 'app/public/fonts/'
      },
    src: {//Указываем пути для рабочих файлов
      jade: 'app/index.jade',
      js: 'app/app.js',
      scss: 'app/common.blocks/**/*.scss',
      img: 'app/common.blocks/**/*.{jpg,png,svg}',
      fonts: 'app/fonts/**/*.*'
    },
    watch: {//Указываем за какими файлами нужно следить
      index_jade: 'app/index.jade',
      jade: 'app/common.blocks/**/*.jade',
      index_js: 'app/app.js',
      js: 'app/common.blocks/**/*.js',
      index_scss: 'app/app.scss',
      scss: 'app/common.blocks/**/*.scss',
      img: 'app/common.blocks/**/*.{jpg,png,svg}'
    },
    clean: './app/public'
  };

  gulp.task('html:public', function () {
    gulp.src(path.src.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      basedir: base_path.resolve()
    }))
    .pipe(gulp.dest(path.public.html))
    .pipe(reload({ stream: true }));
  });

  gulp.task('js:public', function () {
  gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(path.public.js))
    .pipe(reload({ stream: true }));
});

  gulp.task('css:public', function () {
  gulp.src(path.src.scss)
  .pipe(plumber())
  .pipe(addsrc.prepend('app/app.scss'))
  .pipe(concat('styles.scss'))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(prefixer())
  .pipe(cssmin())
  .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest(path.public.css))
  .pipe(reload({ stream: true }));
});

gulp.task('image:public', function () {
  gulp.src(path.src.img)
  .pipe(flatten())
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
  }))
  .pipe(gulp.dest(path.public.img))
  .pipe(reload({ stream: true }));
});

gulp.task('fonts:public', function () {
  gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.public.fonts))
  .pipe(reload({ stream: true }));
});

gulp.task('public', [
  'html:public',
  'js:public',
  'css:public',
  'image:public',
  'fonts:public'
]);

gulp.task('watch', function(){
  watch([path.watch.index_jade], function(event, cb) {
    gulp.start('html:public');
  });
  watch([path.watch.jade], function(event, cb) {
    gulp.start('html:public');
  });
  watch([path.watch.index_scss], function(event, cb) {
    gulp.start('css:public');
  });
  watch([path.watch.scss], function(event, cb) {
    gulp.start('css:public');
  });
  watch([path.watch.index_js], function(event, cb) {
    gulp.start('js:public');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:public');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:public');
  });
});

gulp.task('webserver', function () {
  browserSync.init({
     server: {
         baseDir: "./app/public"
     }
   });
});

gulp.task('default', ['public', 'webserver', 'watch']);
