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
  for(var i in modules) {
    if(modules[i] !== '.DS_Store') {
      gulp.src("src/modules/"+ modules[i] +"/svgs/*.svg")
          .pipe(svgSprite({
              common: modules[i]+"-icon",
              selector: "icon-%f",
              padding:10,
              svg: {
                  sprite: "svg/"+ modules[i] +".svg"
              }
          }))
          .pipe(gulp.dest("src/modules/"+ modules[i] +"/sprites/")) // Write the sprite-sheet + CSS + Preview
          .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
          .pipe(svg2png())           // Create a PNG
          .pipe(gulp.dest("src/modules/"+ modules[i] +"/sprites/"));
    }
  }
});

gulp.task("open-header", function () {
  gulp.src("src/modules/open-header/svgs/*.svg")
          .pipe(svgSprite({
              common: "open-header-icon",
              selector: "icon-%f",
              padding:10,
              svg: {
                  sprite: "svg/open-header.svg"
              }
          }))
          .pipe(gulp.dest("src/modules/open-header/sprites/")) // Write the sprite-sheet + CSS + Preview
          .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
          .pipe(svg2png())           // Create a PNG
          .pipe(gulp.dest("src/modules/open-header/sprites/"));
});

gulp.task("open-main", function () {
  gulp.src("src/modules/open-main/svgs/*.svg")
          .pipe(svgSprite({
              common: "open-main-icon",
              selector: "icon-%f",
              padding:10,
              svg: {
                  sprite: "svg/open-main.svg"
              }
          }))
          .pipe(gulp.dest("src/modules/open-main/sprites/")) // Write the sprite-sheet + CSS + Preview
          .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
          .pipe(svg2png())           // Create a PNG
          .pipe(gulp.dest("src/modules/open-main/sprites/"));
});

gulp.task("header", function () {
  gulp.src("src/modules/header/svgs/*.svg")
          .pipe(svgSprite({
              common: "header-icon",
              selector: "icon-%f",
              padding:10,
              svg: {
                  sprite: "svg/header.svg"
              }
          }))
          .pipe(gulp.dest("src/modules/header/sprites/")) // Write the sprite-sheet + CSS + Preview
          .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
          .pipe(svg2png())           // Create a PNG
          .pipe(gulp.dest("src/modules/header/sprites/"));
});

gulp.task("footer", function () {
  gulp.src("src/modules/footer/svgs/*.svg")
          .pipe(svgSprite({
              common: "footer-icon",
              selector: "icon-%f",
              padding:10,
              svg: {
                  sprite: "svg/footer.svg"
              }
          }))
          .pipe(gulp.dest("src/modules/footer/sprites/")) // Write the sprite-sheet + CSS + Preview
          .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
          .pipe(svg2png())           // Create a PNG
          .pipe(gulp.dest("src/modules/footer/sprites/"));
});

gulp.task("svg:copy", function () {
  for(var i in modules) {
    if(modules[i] !== '.DS_Store') {
      // 复制svg文件
      gulp.src("src/modules/"+modules[i]+"/sprites/svg/*")
          .pipe(gulp.dest("dist/pages/svg"))

      gulp.src("src/modules/"+modules[i]+"/sprites/**")
          .pipe(gulp.dest("dist/modules/"+modules[i]+"/sprites/"))
    }
  }
});

gulp.task('watch', function() {
  for(var i in pages) {
    gulp.watch("src/pages/"+ pages[i] +"/**.html",["html"]);
    gulp.watch("src/pages/"+ pages[i] +"/**.scss",["scss"]);
    gulp.watch("src/pages/"+ pages[i] +"/**.css",["css"]);
    gulp.watch("src/pages/"+ pages[i] +"/**.js",["js"]);
  }
  for(var i in modules) {
    gulp.watch("src/modules/"+ modules[i] +"/**.html",["html"]);
    gulp.watch("src/modules/"+ modules[i] +"/**.scss",["scss"]);
    gulp.watch("src/modules/"+ modules[i] +"/**.css",["css"]);
    gulp.watch("src/modules/"+ modules[i] +"/**.js",["js"]);
  }
});

gulp.task("html", function () {
  for(var i in pages) {
    //html
    gulp.src("src/pages/"+ pages[i] +"/**.html")
        .pipe(include())
        .pipe(gulp.dest("dist/pages/"+ pages[i]));
  }
  for(var i in modules) {
    if(modules[i] !== '.DS_Store') {
      //html
      gulp.src("src/modules/"+ modules[i] +"/**.html")
          .pipe(include())
          .pipe(gulp.dest("dist/modules/"+ modules[i]));
    }
      
  }
    
});

gulp.task("css", function () {
  for(var i in pages) {
    //postcss
    gulp.src("src/pages/"+ pages[i] +"/**.css")
    .pipe(
        postcss([
            require("precss")({ /* options */ })
        ])
    )
    .pipe(cssnext({ browsers: ['last 10 versions'] }))
    .pipe(gulp.dest("dist/pages/"+ pages[i]))
  }
  for(var i in modules) {
    if(modules[i] !== '.DS_Store') {
      
      //postcss
      gulp.src("src/modules/"+ modules[i] +"/**.css")
        .pipe(
            postcss([
                require("precss")({ /* options */ })
            ])
        )
        .pipe(cssnext({ browsers: ['last 10 versions'] }))
        .pipe(gulp.dest("dist/modules/"+ modules[i]))
      }
      
  }
});

gulp.task("scss", function () {
  for(var i in pages) {
    //sass
    gulp.src("src/pages/"+ pages[i] +"/**.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnext({ browsers: ['last 10 versions'] }))
    .pipe(gulp.dest("dist/pages/"+ pages[i]));
  }
  for(var i in modules) {
    if(modules[i] !== '.DS_Store') {
      //sass
        gulp.src("src/modules/"+ modules[i] +"/**.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnext({ browsers: ['last 10 versions'] }))
        .pipe(gulp.dest("dist/modules/"+ modules[i]));
    }
  }
});

gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sass', function () {
  gulp.src('./app/static/scss/pages/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnext({ browsers: ['last 10 versions'] }))
    .pipe(gulp.dest('./app/static/css/pages'));
});
gulp.task('sass:watch', function () {
  gulp.watch('./app/static/scss/pages/**/*.scss', ['sass']);
});
gulp.task('slim', function() {
  gulp.src("./app/static/slim/pages/**/*.slim")
    .pipe(slim({
      pretty: true,
      chdir: true
    }))
    .pipe(gulp.dest("./app/static/html/pages/"));
});

gulp.task('js', function () {
  for(var i in pages){
    gulp.src("src/pages/"+ pages[i] +"/**.js")
    .pipe(gulp.dest("dist/pages/"+ pages[i]));

  }
  for(var i in modules) {
    if(modules[i] !== ".DS_Store") {
      gulp.src("src/modules/"+ modules[i] +"/**.js")
      .pipe(gulp.dest("dist/modules/"+ modules[i]));
    }
      
  }
  gulp.src("src/vender/**.js")
  .pipe(gulp.dest("dist/vender/"));
});

gulp.task('default', ['watch', 'css', 'html', 'serve','scss', 'js']);
