var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    cssnano         = require('gulp-cssnano'), //Contains autoprefixer
    gutil           = require('gulp-util'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps');

var src = {
    scss: 'assets/_src/scss/{,*/}*.{scss,sass}'
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
 * Serve site, watch for changes and run tasks as needed
 */
gulp.task('serve', ['sass', 'browser-sync'], function () {
    gulp.watch(src.scss, ['sass']);
});