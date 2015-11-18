var gulp = require('gulp');
var svgSprite = require("gulp-svg-sprites");
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');


gulp.task('default', function () {
    gulp.src('app/static/svg/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/static/inlinesvg"))
    gulp.src('app/static/svg/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest("app/static/sprites")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("app/static/sprites"));
});