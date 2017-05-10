// nodejs included plugins
var os = require("os"), path = require("path");

// third-party plugins
var $ = require("gulp-load-plugins")({
    pattern: ["*"],
    rename: { autoprefixer: "ap" }
}),
    gulp = $.gulp,
    sequence = $.runSequence,
    mds = $.markdownStyles,
    open = $.opn,
    del = $.del,
    bs = $.browserSync,
    plumber = $.plumber,
    clean = $.clean,
    rename = $.rename,
    purify = $.purifycss,
    replace = $.replace,
    pipe_error_stop = $.pipeErrorStop,
    shorthand = $.shorthand,
    cache = $.cache,
    remember = $.remember,
    find_free_port = $.findFreePort,
    gulpif = $.if,
    cli = $.yargs.argv;

// create the browser-sync servers
var bs1 = bs.create("localhost"),
    bs2 = bs.create("readme"),
    ports = {
        bs1: { app: null, ui: null },
        bs2: { app: null, ui: null }
    };

// browsers to open index.html/markdown preview in
var browsers = ["google-chrome"]; // , "firefox"];

// list of autoprefixer browsers to support
// adapted from google's web starter kit
var autoprefixer_browsers = [
    "ie >= 10",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4.4",
    "bb >= 10",
    "UCAndroid 11",
    "OperaMini All",
    "Samsung >= 4",
    "ChromeAndroid >= 56"
];

// Get the current task name inside task itself
// [http://stackoverflow.com/a/27535245]
gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
    this.currentTask = task;
    this.__runTask(task);
};

/**
 * @description [Builds the localhost URL dynamically.]
 * @param  {String} path [The gulpfile's file path.]
 * @return {String}      [The localhost URL.]
 */
var uri = function(filename, port) {
    // remove everything until /htdocs/, append the provided filename, & return
    return (
        "http://" +
        __dirname.replace(
            /^.+\/htdocs\//,
            "localhost" + (port ? ":" + port : "") + "/"
        ) +
        (filename ? "/" + filename : "")
    );
};

/**
 * @description [Create an OS notification.]
 * @param  {String} message [The notification message.]
 */
var notify = function(message, error) {
    // ubuntu
    // var notification = new notifier();
    // notification.notify({});

    // determine what image to show
    var image = (!error ? "success" : "error") + "_256.png";

    // OS agnostic
    $.nodeNotifier.notify({
        title: "Gulp",
        message: message,
        icon: path.join(__dirname, "source/assets/node-notifier/" + image),
        // time: 1000,
        // urgency: "critical",
        sound: true
    });
};

/**
 * @description [Stream pipe error handler.]
 * @param  {Error} error [The error object.]
 * @return {Undefined}       [Nothins is returned.]
 */
var pipe_error = function(error) {
    notify("Error with `" + this.currentTask.name + "` task.", true);
    this.emit("end");
};

// // example gulpif condition check
// var condition = function(file) {
//     // check the file name
//     return /styles.css$/.test(file.path);
// };

// tasks
// init HTML files + minify
gulp.task("html", function(done) {
    return gulp
        .src(
            [
                "index.top.html",
                "head/start.html",
                "head/meta.html",
                "head/css.html",
                "head/js.html",
                "head/end.html",
                "body/start.html",
                "body/content.html",
                "body/js.html",
                "body/end.html",
                "index.end.html"
            ],
            { cwd: "html/source/" }
        )
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe($.concat("index.html"))
        .pipe(
            $.jsbeautifier({
                brace_style: "collapse",
                end_with_newline: false,
                indent_char: " ",
                indent_handlebars: false,
                indent_inner_html: false,
                indent_scripts: "keep",
                indent_size: 4,
                max_preserve_newlines: 0,
                preserve_newlines: true,
                wrap_line_length: 0
            })
        )
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("./"))
        .pipe($.minifyHtml())
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("dist/"))
        .pipe(bs1.stream());
});

gulp.task("precssapp-clean-styles", function(done) {
    return (gulp
            .src(["styles.css"], {
                cwd: "css/source/"
            })
            .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
            // spot prefixes [https://www.mikestreety.co.uk/blog/find-and-remove-vendor-prefixes-in-your-css-using-regex]
            .pipe(
                replace(
                    /(\s+)?\-(moz|o|webkit|ms|khtml)\-(?!font-smoothing|osx|print|backface).+?;/gi,
                    ""
                )
            )
            .pipe(replace(/([ |,|:])(\.\d+)/g, "$10$2")) // 0px => 0 (leading_zeros)
            .pipe(
                // 0px => 0 (empty_zeros) & 0.0 => 0
                replace(
                    /(\b0(cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)|0\.0[^\d])/gi,
                    "0"
                )
            )
            // css color lowercase check /#[A-Fa-f0-9]{3,6}/ (hex_colors)
            .pipe(
                replace(/#[a-f0-9]{3,6}/gi, function(match) {
                    return match.toLowerCase();
                })
            )
            // line breaks [http://stackoverflow.com/a/16369725]
            // .pipe(replace(/^\s*[\r\n]/gm, ""))
            .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
            .pipe(gulp.dest("css/source/")) // dump into development folder
            .pipe(bs1.stream()) );
});

// build app.css + autoprefix + minify
gulp.task("cssapp", ["precssapp-clean-styles"], function(done) {
    return (gulp
            .src(["normalize.css", "base.css", "styles.css", "helpers.css"], {
                cwd: "css/source/"
            })
            .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
            .pipe(
                $.autoprefixer({
                    browsers: autoprefixer_browsers,
                    cascade: false
                })
            )
            // .pipe(postcss([css_declaration_sorter({ order: "smacss" })]))
            .pipe(shorthand())
            .pipe($.concat("app.css"))
            .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
            .pipe(gulp.dest("css/")) // dump into development folder
            .pipe($.cleanCss()) // minify for production
            .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
            .pipe(gulp.dest("dist/css/")) // dump in dist/ folder
            .pipe(bs1.stream()) );
});

// build libs.css + minify + beautify
gulp.task("csslibs", function(done) {
    return (gulp
            .src(
                [
                    // add any used css library paths here
                    "font-awesome-4.7.0/css/font-awesome.css"
                ],
                { cwd: "css/libs/" }
            )
            .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
            .pipe($.concat("libs.css"))
            .pipe(
                $.autoprefixer({
                    browsers: autoprefixer_browsers,
                    cascade: false
                })
            )
            // .pipe(postcss([css_declaration_sorter({ order: "smacss" })]))
            .pipe(shorthand())
            .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
            .pipe(gulp.dest("css/")) // dump into development folder
            .pipe($.cleanCss()) // minify for production
            .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
            .pipe(gulp.dest("dist/css/")) // dump in dist/ folder
            .pipe(bs1.stream()) );
});

// check for any unused CSS
// maybe use command line arguments? [http://stackoverflow.com/a/23038290]
gulp.task("purify", function() {
    // get the command line arguments from yargs
    var remove = cli.r || cli.remove || null;
    var delete_file = cli.D || cli.del || null;

    // remove pure.css
    if (remove || delete_file) del(["./css/pure.css"]);
    if (delete_file) return; // don't run gulp just delete the file.

    return gulp
        .src("./css/source/styles.css")
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe(
            purify(["./js/app.js", "./index.html"], {
                info: true,
                rejected: true
            })
        )
        .pipe(gulpif(!remove, rename("pure.css")))
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("./css/" + (remove ? "source/" : "")));
});

// build app.js + minify + beautify
gulp.task("jsapp", function(done) {
    return gulp
        .src(
            [
                // get all the source build files
                "app.iife.top.js",
                "app.init.js",
                // start: app modules loaded in the
                // sequence they are provided
                "modules/libs.js",
                "modules/globals.js",
                "modules/utils.js",
                "modules/$$.js",
                "modules/core.js",
                "modules/events.js",
                "modules/main.js",
                // end: app modules
                "app.iife.end.js"
            ],
            { cwd: "js/source/" }
        )
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe($.concat("app.js"))
        .pipe($.jsbeautifier())
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("js/")) // dump into development folder
        .pipe($.uglify()) // minify for production
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("dist/js/")) // dump in dist/ folder
        .pipe(bs1.stream());
});

// build libs.js + minify + beautify
gulp.task("jslibs", function(done) {
    return gulp
        .src(
            [
                // add any used js library paths here
                // "jquery.js"
                // "modernizr.js"
                "fastclick.js"
            ],
            { cwd: "js/libs/" }
        )
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe($.concat("libs.js"))
        .pipe($.jsbeautifier())
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("js/")) // dump into development folder
        .pipe($.uglify()) // minify for production
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("dist/js/")) // dump in dist/ folder
        .pipe(bs1.stream());
});

// copy css libraries folder
gulp.task("csslibsfolder", ["clean-csslibs"], function(done) {
    return gulp
        .src(["css/libs/**"])
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("dist/css/libs/")) // dump in dist/ folder
        .pipe(bs1.stream());
});

// copy js libraries folder
gulp.task("jslibsfolder", ["clean-jslibs"], function(done) {
    return gulp
        .src(["js/libs/**"])
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("dist/js/libs/")) // dump in dist/ folder
        .pipe(bs1.stream());
});

// copy img/ to dist/img/
gulp.task("img", function(done) {
    // deed to copy hidden files/folders? [https://github.com/klaascuvelier/gulp-copy/issues/5]
    return gulp
        .src("img/**/*")
        .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
        .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
        .pipe(gulp.dest("dist/img/")) // dump in dist/ folder
        .pipe(bs1.stream());
});

// markdown to html (with github style/layout)
gulp.task("readme", function() {
    mds.render(
        mds.resolveArgs({
            input: path.normalize(process.cwd() + "/README.md"),
            output: path.normalize(process.cwd() + "/markdown/preview"),
            layout: path.normalize(
                process.cwd() + "/markdown/source"
                // process.cwd() + "/node_modules/markdown-styles/layouts/github"
            )
        })
        // function() {} // potential callback
    );
});

// watch changes to files
gulp.task("watch", function(done) {
    // start browser-syncs
    bs1.init(
        {
            browser: browsers,
            proxy: uri(),
            port: ports.bs1.app,
            ui: { port: ports.bs1.ui },
            notify: false
        },
        function() {
            // notify("BS1 Server Created.");
        }
    );
    bs2.init(
        {
            browser: browsers,
            proxy: uri("markdown/preview/README.html"),
            port: ports.bs2.app,
            ui: { port: ports.bs2.ui },
            notify: false,
            open: false
        },
        function() {
            // notify("BS2 Server Created.");
        }
    );

    // gulp.watch options
    var options = { /*debounceDelay: 2000,*/ cwd: "./" };

    gulp.watch(
        ["i*.html", "head/*.html", "body/*.html"],
        { cwd: "html/source/" },
        function() {
            return sequence("html");
        }
    );
    gulp.watch(["libs/**/*.css", "source/*.css"], { cwd: "css/" }, function() {
        return sequence("cssapp", "csslibs", "csslibsfolder");
    });
    gulp.watch(
        ["libs/**/*.js", "source/*.js", "source/modules/*.js"],
        { cwd: "js/" },
        function() {
            return sequence("jsapp", "jslibs", "jslibsfolder");
        }
    );
    gulp.watch(["img/**/*.{jpg,png,gif}"], options, function() {
        return sequence("img");
    });
    gulp.watch(["README.md"], options, function() {
        return sequence("readme", function() {
            bs2.reload();
        });
    });
});

// command line gulp task names

// open index.html in browser
gulp.task("open", function(done) {
    // get the command line arguments from yargs
    var filename = cli.f || cli.file || "index.html",
        port = cli.p || cli.port || 3000;

    // return if argument(s) missing
    if (!filename || !port) {
        if (!filename) console.log("Missing -f/--file <String> parameter.");
        if (!port) console.log("Missing -p/--port <Number> parameter.");
        done();
        return;
    }

    // reset the filename
    if (filename === "index.html") filename = null;
    if (filename === "readme.md") filename = "markdown/preview/README.html";

    // open file in the browser
    open(uri(filename, port), {
        app: browsers
    }); // .then(function() {});
    done();
});

// reset the parent folder to its original status
gulp.task("reset", function(done) {
    // remove the dist directory
    return del(
        [
            "./**", // select all files but keep the following...
            "!.", // keep the parent directory
            // keep the source/ and node_modules/ directories
            // and the gulpfile + package.json files.
            "!./source",
            "!./source/**",
            "!./node_modules",
            "!./node_modules/**",
            "!./gulpfile.js",
            "!./package.json"
        ],
        {
            force: true
            // dryRun: true
        }
    )
        .then(function(paths) {
            // once everything but the source/ and node_modules/ directories
            // are deleted we copy the source/ folder contents into the root
            // directory.
            return gulp
                .src(["./source/**"], {
                    dot: true // copy dot files as well
                })
                .pipe(plumber({ errorHandler: pipe_error.bind(this) }))
                .pipe(pipe_error_stop({ errorCallback: pipe_error.bind(this) }))
                .pipe(gulp.dest("./"));
        })
        .then(function() {
            notify("Reset complete");
        });
});

// remove the dist/ folder
gulp.task("clean-dist", function() {
    return gulp.src("dist/", { read: false, cwd: "./" }).pipe(clean());
});
// remove the css/libs/ folder
gulp.task("clean-csslibs", function() {
    return gulp.src("dist/css/libs/", { read: false, cwd: "./" }).pipe(clean());
});
// remove the js/libs/ folder
gulp.task("clean-jslibs", function() {
    return gulp.src("dist/js/libs/", { read: false, cwd: "./" }).pipe(clean());
});

// build the dist/ folder
gulp.task("build", ["clean-dist"], function(done) {
    return sequence(
        "cssapp",
        "csslibs",
        "csslibsfolder",
        "jsapp",
        "jslibs",
        "jslibsfolder",
        "img",
        "html",
        "readme",
        function() {
            notify("Build complete");
            done();
        }
    );
});

// gulps default task is set to rum the build + watch + browser-sync
gulp.task("default", function(done) {
    return find_free_port(3000, 3100, "127.0.0.1", 4, function(
        err,
        p1,
        p2,
        p3,
        p4
    ) {
        // set the ports
        ports.bs1.app = p1;
        ports.bs1.ui = p2;
        ports.bs2.app = p3;
        ports.bs2.ui = p4;

        // after getting the free ports, finally run the build task
        return sequence("build", function() {
            sequence("watch");
            done();
        });
    });
});

// Error Handling
// [https://scotch.io/tutorials/prevent-errors-from-crashing-gulp-watch]
// [https://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/]
// [http://blog.ibangspacebar.com/handling-errors-with-gulp-watch-and-gulp-plumber/]
// [https://github.com/rbalicki2/pipe-error-stop]
// [https://github.com/spalger/gulp-jshint/issues/91]
// [https://artandlogic.com/2014/05/error-handling-in-gulp/]
