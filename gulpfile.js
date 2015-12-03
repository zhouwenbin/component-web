var fs = require('fs');
var gulp = require('gulp');
var svgSprite = require("gulp-svg-sprites");
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');
var postcss = require('gulp-postcss');
var include = require('gulp-html-tag-include');
var cssnext = require("gulp-cssnext");
var scss = require("postcss-scss");
var module = ["login","header","footer","sidebar","index"]

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

gulp.task('sprites', function () {
  for(var i in module){
    gulp.src("modules/"+module[i]+"/svgs/*.svg")
        .pipe(svgSprite({
            common: "svg",
            selector: module[i]+"-%f"
        }))
        .pipe(gulp.dest("modules/"+module[i]+"/sprites/")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("modules/"+module[i]+"/sprites/"));
  }

});

gulp.task('default', function () {
    //svg
    for(var i in module){
      gulp.src("modules/"+module[i]+"/svgs/*.svg")
          .pipe(svgSprite({
            mode: "symbols",
            common: "svg",
            selector: "icon-%f"
          }))
          .pipe(gulp.dest("modules/"+module[i]+"/symbols"))
    }
    //html
    gulp.src('pages/user/login/posthtml/**.html')
        .pipe(include())
        .pipe(gulp.dest('pages/user/login/html/'));
    //css
    gulp.src("pages/user/login/postcss/**.css")
    .pipe(
        postcss([
            require('precss')({ /* options */ })
        ])
    )
    .pipe(cssnext())
    .pipe(gulp.dest("pages/user/login/css/"))
});
