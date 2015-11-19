var fs = require('fs');
var gulp = require('gulp');
var svgSprite = require("gulp-svg-sprites");
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');

gulp.task('guild', function () {

    var postcss = require('gulp-postcss');
    var processedCSS = fs.readFileSync('./app/static/css/pages/common/common.css', 'utf-8');
    return gulp.src('./app/static/css/pages/common/common.css')
        .pipe(postcss([
            require('postcss-style-guide')({
                name: "样式指南",
                processedCSS: processedCSS
            })
        ]))
        .pipe(gulp.dest('./docs'));
});

gulp.task('default', function () {
    gulp.src('app/static/icon/svg/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/static/icon/inlinesvg"))
    gulp.src('app/static/icon/svg/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest("app/static/icon/sprites")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("app/static/icon/sprites"));
});