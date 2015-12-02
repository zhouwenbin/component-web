var fs = require('fs');
var gulp = require('gulp');
var svgSprite = require("gulp-svg-sprites");
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');
var postcss = require('gulp-postcss');

gulp.task('common', function () {
    
    var processedCSS = fs.readFileSync('./app/static/css/pages/common/common.css', 'utf-8');
    return gulp.src('./app/static/css/pages/common/common.css')
        .pipe(postcss([
            require('postcss-style-guide')({
                name: "组件样式指南",
                processedCSS: processedCSS,
                dir: "./docs/common"
            })
        ]))
        .pipe(gulp.dest('./docs/common'));
});

gulp.task('index2', function () {

    var processedCSS = fs.readFileSync('./app/static/css/pages/index/index2.css', 'utf-8');
    return gulp.src('./app/static/css/pages/index/index2.css')
        .pipe(postcss([
            require('postcss-style-guide')({
                name: "首页样式指南",
                processedCSS: processedCSS,
                dir: "./docs/index2"
            })
        ]))
        .pipe(gulp.dest('./docs/index2'));
});

gulp.task('default', function () {
    gulp.src('app/static/icon/svg/login/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/static/icon/inlinesvg/login/"))
});