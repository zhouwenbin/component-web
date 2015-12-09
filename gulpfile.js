var fs = require("fs");
var gulp = require("gulp");
var svgSprite = require("gulp-svg-sprites");
var svg2png = require("gulp-svg2png");
var filter = require("gulp-filter");
var postcss = require("gulp-postcss");
var include = require("gulp-html-tag-include");
var cssnext = require("gulp-cssnext");
var precss = require("precss");
var path = require("path");
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var modules = ["login","header","footer","sidebar","index"];
var pages = ["user/login"]

gulp.task("common", function () {

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
    gulp.src("modules/"+modules[i]+"/svgs/*.svg")
        .pipe(svgSprite({
          mode: "symbols",
          common: "svg",
          selector: "icon-%f"
        }))
        .pipe(gulp.dest("modules/"+modules[i]+"/symbols"))
    gulp.src("modules/"+modules[i]+"/svgs/*.svg")
        .pipe(svgSprite({
            common: "svg",
            selector: "icon-%f"
        }))
        .pipe(gulp.dest("modules/"+modules[i]+"/sprites/")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("modules/"+modules[i]+"/sprites/"));
  }

});
gulp.task("test", function () {

    //css
    gulp.src("test/postcss/**.css")
    .pipe(
      postcss([
        require("postcss-modules")({
          getJSON: function(cssFileName, json) {
            var cssName       = path.basename(cssFileName, ".css");
            var jsonFileName  = path.resolve("./test/css/" + cssName + ".json");
            fs.writeFileSync(jsonFileName, JSON.stringify(json));
          },
          generateScopedName: function(name, filename, css) {
            var i         = css.indexOf("." + name);
            var numLines  = css.substr(0, i).split(/[\r\n]/).length;
            var file      = path.basename(filename, ".css");

            return file + "-" + name;
          }
        })
      ])
    )
    .pipe(gulp.dest("test/css/"))
});

gulp.task('react', function () {
    return gulp.src('test/jsx/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('test/js/'));
});
gulp.task('watch', function() {
  for(var i in pages){
    gulp.watch("pages/"+ pages[i] +"/posthtml/**.html",["html"]);
    gulp.watch("pages/"+ pages[i] +"/postcss/**.css",["css"]);
  }
  for(var i in modules){
    gulp.watch("modules/"+ modules[i] +"/**.html",["html"]);
    gulp.watch("modules/"+ modules[i] +"/**.css",["css"]);
  }
});

gulp.task("html", function () {
    for(var i in pages){
      //html
      gulp.src("pages/"+ pages[i] +"/posthtml/**.html")
          .pipe(include())
          .pipe(gulp.dest("pages/"+ pages[i] +"/html/"));
    }
});

gulp.task("css", function () {
    for(var i in pages){
      //css
      gulp.src("pages/"+ pages[i] +"/postcss/**.css")
      .pipe(
          postcss([
              require("precss")({ /* options */ })
          ])
      )
      .pipe(cssnext())
      .pipe(gulp.dest("pages/"+ pages[i] +"/css/"))
    }
});

gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("pages/user/login/html/*.html").on("change", browserSync.reload);
    gulp.watch("pages/user/login/css/*.css").on("change", browserSync.reload);
});

gulp.task('default', ['watch', 'css', 'html', 'serve']);
