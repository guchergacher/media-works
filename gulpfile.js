const {
  src,
  dest,
  series,
  watch
} = require('gulp');

const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const sync = require('browser-sync').create();
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');

const uglify = require('gulp-uglify-es').default;

const clean = () => {
  return del('build');
};

const copy = () => {
  return src([
    'source/img/**',
    'source/fonts/**/*',
    'source/*.ico'
  ], {
    base: 'source'
  })
  .pipe(dest('build'));
};

const html = () => {
  return src('source/*.html')
    .pipe(
      htmlmin({collapseWhitespace: true})
    )
    .pipe(dest('build'));
}

const css = () => {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      includePaths: ['node_modules']
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(cssmin())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(sync.stream());
};

const js = () => {
  return src('source/js/**/*.js')
    .pipe(sourcemap.init())
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/js'))
    .pipe(sync.stream());
};

const images = () => {
  return src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.mozjpeg(
        {progressive: true}
      ),
      imagemin.optipng(
        {optimizationLevel: 3}
      ),
      imagemin.svgo()
    ]))
    .pipe(dest('build/img'))
};

exports.images = images;

const build = series(
  clean,
  copy,
  css,
  js,
  images,
  html
);

exports.build = build;

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });

  done();
};

exports.server = server;

const watcher = () => {
  watch('source/sass/**/*.{scss,sass}', series(css));
  watch('source/js/**/*.js', series(js));
  watch('source/*.html').on('change', series(html, sync.reload));
};

exports.default = series(build, server, watcher);
