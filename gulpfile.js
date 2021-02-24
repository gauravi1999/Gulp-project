const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpConcat = require('gulp-concat');
const gulpImagemin = require('gulp-imagemin');
const gulpPlumber = require('gulp-plumber');
const gulpPostcss = require('gulp-postcss');
const gulpSass = require('gulp-sass');
const gulpSourceMap = require('gulp-sourcemaps');
const browerSync = require('browser-sync');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const del = require('del');

const style = () =>
    gulp.src('./src/scss/*.scss')
        .pipe(gulpSourceMap.init())
        .pipe(gulpSass())
        .pipe(gulpPostcss([autoprefixer(), cssnano()]))
        .pipe(gulpConcat('main.min.css'))
        .pipe(gulpSourceMap.write('.'))
        .pipe(gulp.dest('./dist/css'));

const html = () =>
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'));

const script = () =>
    gulp.src('./src/script/*.js')
        .pipe(gulpSourceMap.init())
        .pipe(gulpBabel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulpConcat('main.min.js'))
        .pipe(gulpSourceMap.write('.'))
        .pipe(gulp.dest('./dist/script'));

const image = () =>
    gulp.src('./src/images/*')
        .pipe(gulpImagemin())
        .pipe(gulp.dest('./dist/images'));

const clean = () => {
    return del(['./dist'])
}

function watchFiles() {
    browerSync.init({
        server: './dist'
    });

    gulp.watch('./src/scss/*.scss', style).on('change', browerSync.reload)
    gulp.watch('./src/*.html', html).on('change', browerSync.reload)
    gulp.watch('./src/script/*.js', script).on('change', browerSync.reload)
    gulp.watch('./src/images/*', image).on('change', browerSync.reload)
}

const watch = gulp.series(clean, style, html, script, image, watchFiles);

exports.watch = watch;
exports.style = style;
exports.html = html;
exports.script = script;
exports.image = image;