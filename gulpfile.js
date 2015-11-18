var gulp = require('gulp');
var svgSprite = require("gulp-svg-sprites");
var svg2png = require('gulp-svg2png');


gulp.task('default', function () {
    gulp.src('app/static/svg/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/static/inlinesvg"))
    gulp.src('./app/static/svg/**/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest('./app/static/svg/png'));
});