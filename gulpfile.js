var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    childprocess    = require('child_process'),
    concat          = require('gulp-concat'),
    cssnano         = require('gulp-cssnano'), //Contains autoprefixer
    filter          = require('gulp-filter'),
    gutil           = require('gulp-util'),
    jshint          = require('gulp-jshint'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    uglify          = require('gulp-uglify');

var src = {
    scss: 'assets/_src/scss/{,*/}*.{scss,sass}',
    js: ['assets/_src/js/vendor/*.js', 'assets/_src/js/main.js']
};

var config = {
    production: !!gutil.env.production
};

/**
 * $ gulp sass (--production)
 * Compile and minify sass files + generate generate sourceemaps + place compiled css in both '/assets/' and '_site/assets/' for reloading
 * Passing --production flag disables sourcemaps
 */
gulp.task('sass', function () {
    return gulp.src(src.scss)
        .pipe(config.production ? gutil.noop() : sourcemaps.init()) // Skip sourcemaps if --production
        .pipe(sass())
        .on('error', function (err) {
            browserSync.notify("Uh oh, there's an error!");
            gutil.log(
                err.name + ' in '+ gutil.colors.cyan(err.plugin) + ':'   +'\n'+
                gutil.colors.grey('----------------------------------')  +"\n"+
                '    File:  ' + gutil.colors.magenta(err.relativePath)   +"\n"+
                '    Line:  ' + gutil.colors.magenta(err.line)           +'\n'+
                ' Message:  ' + gutil.colors.yellow(err.messageOriginal) +"\n"+
                gutil.colors.grey('----------------------------------')
            );
            this.emit('end');
        })
        .pipe(cssnano({
                autoprefixer: {browsers: ['last 2 versions', 'ie 9'], add: true}
            }))
        .pipe(config.production ? gutil.noop() : sourcemaps.write()) // Skip sourcemaps if --production
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
          stream: true
        }));
});


/**
 * $ gulp scripts (--production)
 * Lint, concat and uglify scripts and place file into both '/assets/' and '_site/assets/' for reloading
 * Passing --production flag disables sourcemaps
 */
gulp.task('scripts', function () {
    var excludeVendorFilter = filter(['**','!*assets/_src/js/vendor/*.js'], {restore: true}); //Filter for excluding vendor js files from linting

    return gulp.src(src.js)
        .pipe(excludeVendorFilter)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(excludeVendorFilter.restore)
        .pipe(config.production ? gutil.noop() : sourcemaps.init()) // Skip sourcemaps if --production
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .on('error', function (err) {
            browserSync.notify("Uh oh, there's an error!");
            gutil.log(
                err.name + ' in '+ gutil.colors.cyan(err.plugin) + ':'   +'\n'+
                gutil.colors.grey('----------------------------------')  +"\n"+
                '    File:  ' + gutil.colors.magenta(err.fileName)       +"\n"+
                '    Line:  ' + gutil.colors.magenta(err.lineNumber)     +'\n'+
                ' Message:  ' + gutil.colors.yellow(err.message)         +"\n"+
                gutil.colors.grey('----------------------------------')
            );
            this.emit('end');
        })
        .pipe(config.production ? gutil.noop() : sourcemaps.write()) // Skip sourcemaps if --production
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

/**
 * Start a BrowserSync server
 */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Build Jekyll Site with an incremental build
 */
gulp.task('jekyll', function (done) {
    browserSync.notify('Building Jekyll site...');
    return childprocess.spawn('jekyll', ['build', '--incremental'], {stdio: 'inherit'})
    .on('close', done);
});

/**
 * Serve site, watch for changes and run tasks as needed
 */
gulp.task('serve', ['sass', 'scripts', 'jekyll', 'browser-sync'], function () {
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.js, ['scripts']);
    gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*'], ['jekyll']);
    gulp.watch(['_site/**/*.html']).on('change', browserSync.reload);
});