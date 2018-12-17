'use strict'

const browser = require('browser-sync');
const gulp = require('gulp');
const htmlhint = require('gulp-htmlhint');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const packageImporter = require('node-sass-package-importer');
const csscomb    = require('gulp-csscomb');
const mmq = require('gulp-merge-media-queries');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify  = require('gulp-notify');
const changed = require('gulp-changed');
const cache = require('gulp-cached');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg  = require('imagemin-mozjpeg');

const destDir = 'dist/';

const assetsDir = 'common/';

gulp.task('sass', () => {
  return gulp.src(['src/'+assetsDir+'sass/**/*.scss'])
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass({
        importer: packageImporter({
            extensions: ['.scss', '.css']
        })
    }))
    .pipe(autoprefixer({browsers: ['last 2 version', 'ie >= 11', 'iOS >= 8.0', 'Android >= 4.2'] }))
    .pipe(csscomb())
    .pipe(mmq())
    .pipe(csso())
    .pipe(gulp.dest('src/'+assetsDir+'css/'))
    .pipe(notify({
        title: 'compile OK :)',
        message: new Date(),
    }))
});

gulp.task( 'css', () => {
    return gulp.src('src/**/*.css')
    .pipe(cache('css-cache'))
    .pipe(gulp.dest(destDir))
    .pipe(browser.reload({stream:true}))
});


gulp.task( 'js', () => {
    return gulp.src('src/**/*.js')
    .pipe(cache('js-cache'))
    .pipe(gulp.dest(destDir))
    .pipe(browser.reload({stream:true}))
});

gulp.task('html', () => {
    return gulp.src('src/**/*.html')
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest(destDir))
    .pipe(browser.reload({stream:true}))
});

gulp.task('server', () => {
    browser({
        server: {
            baseDir: destDir
        }
    });
});

gulp.task('copyResource', () => {
    return gulp.src([
        'src/**/*',
        '!src/'+assetsDir+'sass/',
        '!src/'+assetsDir+'sass/**/*',
        '!src/_tmp/',
        '!src/_tmp/**/*'
    ])
    .pipe(cache('src-cache'))
    .pipe(gulp.dest(destDir))
    .pipe(browser.reload({stream:true}))
});

gulp.task('default',['sass', 'css', 'js', 'html', 'copyResource', 'server'], () => {
    gulp.watch(['src/**/*.html'], (event) => {
        gulp.start(['html']);
    });
    gulp.watch(['src/**/*.scss'], (event) => {
        gulp.start(['sass']);
    });
    gulp.watch(['src/**/*.css'], (event) => {
        gulp.start(['css']);
    });
    gulp.watch(['src/**/*.js'], (event) => {
        gulp.start(['js']);
    });
});

gulp.task('imagemin', () => {
    return gulp.src('src/**/*.+(jpg|jpeg|gif|png)')
    .pipe(plumber())
    .pipe(imagemin([
        pngquant({
            quality: '65-75',
            speed: 1
        }),
        mozjpeg({
            quality: 65,
            progressive: true
        }),
        imagemin.optipng(),
        imagemin.gifsicle(),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest(destDir))
});
