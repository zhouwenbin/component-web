var fs = require("fs");
var gulp = require("gulp");
var svgSprite = require("gulp-svg-sprites");
var filter = require("gulp-filter");
var svg2png = require("gulp-svg2png");
var postcss = require("gulp-postcss");
var include = require("gulp-html-tag-include");
var cssnext = require("gulp-cssnext");
var precss = require("precss");
var path = require("path");
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var slim = require("gulp-slim");
var modules = fs.readdirSync("src/modules");
var pages = fs.readdirSync("src/pages");

gulp.task("guild", function () {

    var processedCSS = fs.readFileSync("./app/static/css/pages/common/common.css", "utf-8");
    return gulp.src("./app/static/css/pages/common/common.css")
        .pipe(postcss([
            require("postcss-style-guide")({
                name: "组件样式指南",
                processedCSS: processedCSS,
                dir: "./docs/common"
            })
        ]))
        .pipe(gulp.dest("./docs/common"));
});

gulp.task("svg", function () {
  for(var i in modules){
    if(modules[i] !== '.DS_Store'){
      gulp.src("src/modules/"+modules[i]+"/svgs/*.svg")
          .pipe(svgSprite({
              common: modules[i]+"-icon",
              selector: "icon-%f",
              padding:10,
              svg: {
                  sprite: "svg/"+modules[i]+".svg"
              }
          }))
          .pipe(gulp.dest("src/modules/"+modules[i]+"/sprites/")) // Write the sprite-sheet + CSS + Preview
          .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
          .pipe(svg2png())           // Create a PNG
          .pipe(gulp.dest("src/modules/"+modules[i]+"/sprites/"));

      gulp.src("src/modules/"+modules[i]+"/sprites/svg/*")
          .pipe(gulp.dest("dist/svg"))
    }
  }
});

gulp.task('watch', function() {
  for(var i in pages){
    gulp.watch("src/pages/"+ pages[i] +"/**.html",["html"]);
    gulp.watch("src/pages/"+ pages[i] +"/**.css",["css"]);
  }
  for(var i in modules){
    gulp.watch("src/modules/"+ modules[i] +"/**.html",["html"]);
    gulp.watch("src/modules/"+ modules[i] +"/**.css",["css"]);
  }
});

gulp.task("html", function () {
    for(var i in pages){
      //html
      gulp.src("src/pages/"+ pages[i] +"/**.html")
          .pipe(include())
          .pipe(gulp.dest("dist/"+ pages[i]));
    }
});

gulp.task("css", function () {
    for(var i in pages){
      //css
      gulp.src("src/pages/"+ pages[i] +"/**.css")
      .pipe(
          postcss([
              require("precss")({ /* options */ })
          ])
      )
      .pipe(cssnext({ browsers: ['last 10 versions'] }))
      .pipe(gulp.dest("dist/"+ pages[i]))
    }
});

gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    for(var i in pages){
      gulp.watch("src/pages/"+ pages[i] +"/*.html").on("change", browserSync.reload);
      gulp.watch("src/pages/"+ pages[i] +"/*.css").on("change", browserSync.reload);
    }
});

gulp.task('sass', function () {
  gulp.src('./app/static/scss/pages/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnext({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('./app/static/css/pages'));
});
gulp.task('sass:watch', function () {
  gulp.watch('./app/static/scss/pages/**/*.scss', ['sass']);
});
gulp.task('slim', function(){
  gulp.src("./app/static/slim/pages/**/*.slim")
    .pipe(slim({
      pretty: true,
      chdir: true
    }))
    .pipe(gulp.dest("./app/static/html/pages/"));
});

gulp.task('default', ['watch', 'css', 'html', 'serve']);
