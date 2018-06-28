const   gulp            = require('gulp'),
        sass            = require('gulp-sass'),
        cleanCSS        = require('gulp-clean-css'),
        autoprefixer    = require('gulp-autoprefixer'),
        concatCSS       = require('gulp-concat-css'),
        rename          = require("gulp-rename"),
        concatJS        = require('gulp-concat'),
        uglify          = require('gulp-uglify'),
        sourcemaps      = require('gulp-sourcemaps'),
        source          = require('vinyl-source-stream'),
        browserify      = require('browserify'),
        babelify        = require('babelify'),
        buffer          = require('vinyl-buffer'),
        clean           = require('gulp-clean'),
        imagemin        = require('gulp-imagemin'),
        es              = require('event-stream'),
        runSequence     = require('run-sequence');

/** CLEAN **/
gulp.task('clean__styles', () => {
    return gulp.src('./public/stylesheets', {read: false})
        .pipe(clean());
});
gulp.task('clean__styles-light', () => {
    return gulp.src(['./public/stylesheets/**/*', '!./public/stylesheets/vendors.css'], {read: false})
        .pipe(clean());
});

gulp.task('clean__scripts', () => {
    return gulp.src('./public/javascripts', {read: false})
        .pipe(clean());
});
gulp.task('clean__scripts-light', () => {
    return gulp.src(['./public/javascripts/**/*', '!./public/javascripts/vendors.js'], {read: false})
        .pipe(clean());
});

gulp.task('clean__images', () => {
    return gulp.src('./public/images', {read: false})
        .pipe(clean());
});
gulp.task('clean__fonts', () => {
    return gulp.src('./public/fonts', {read: false})
        .pipe(clean());
});

gulp.task('clean', ['clean__styles', 'clean__scripts', 'clean__images', 'clean__fonts']);

/** STYLE's **/
const styles = [
    './bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
    './bower_components/magnific-popup/dist/magnific-popup.css',
    './bower_components/animate.css/animate.min.css',
    './bower_components/select2/dist/css/select2.min.css',
    './bower_components/fine-uploader/dist/fine-uploader.min.css',
    './bower_components/simplemde/dist/simplemde.min.css'
];

gulp.task('styles__dev', () => {
    return gulp.src('./src/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: [
                "> 1%",
                "last 2 versions"
            ]
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/stylesheets'))
});
gulp.task('styles__vendors', () => {
    return gulp.src(styles)
        .pipe(concatCSS("vendors.css"))
        .pipe(gulp.dest('./public/stylesheets'))
});

gulp.task('styles', (done) => {
    runSequence
    (
        'clean__styles',
        ['styles__dev', 'styles__vendors'],
        done
    );
});
gulp.task('styles-light', (done) => {
    runSequence
    (
        'clean__styles-light',
        ['styles__dev'],
        done
    );
});

/** SCRIPT's **/
const scripts = [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/lodash/dist/lodash.min.js',
    './bower_components/owl.carousel/dist/owl.carousel.min.js',
    './bower_components/axios/dist/axios.min.js',
    './bower_components/mathjs/dist/math.min.js',
    './bower_components/validator-js/validator.min.js',
    './bower_components/jquery-mask-plugin/dist/jquery.mask.min.js',
    './bower_components/clipboard/dist/clipboard.min.js',
    './bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
    './bower_components/jquery-smooth-scroll/jquery.smooth-scroll.min.js',
    './bower_components/moment/min/moment-with-locales.min.js',
    './bower_components/web3/dist/web3.min.js',
    './bower_components/bignumber.js/bignumber.min.js',
    './bower_components/select2/dist/js/select2.min.js',
    './bower_components/fine-uploader/dist/jquery.fine-uploader.min.js',
    './bower_components/simplemde/dist/simplemde.min.js',
    './bower_components/markdown-it/dist/markdown-it.min.js',
    './custom_packages/qrcode/qrcode.min.js'
];

gulp.task('scripts__dev', () => {
    let tasks = [
        'main.js',
        'app.js',
        'app-add.js',
        'ico.js',
        'login.js',
        'registration.js'
    ].map((item) => {
        return browserify({
            entries: ['./src/js/' + item],
            debug: true
        })
        .transform("babelify", {
            presets: ["env"],
            plugins: ['transform-runtime']
        })
        .bundle()
        .pipe(source(item))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/javascripts/'));
    });
    return es.merge.apply(null, tasks);
});
gulp.task('scripts__vendors', () => {
    return gulp.src(scripts)
        .pipe(concatJS('vendors.js'))
        .pipe(gulp.dest('./public/javascripts'))
});

gulp.task('scripts', (done) => {
    runSequence
    (
        'clean__scripts',
        ['scripts__dev', 'scripts__vendors'],
        done
    );
});
gulp.task('scripts-light', (done) => {
    runSequence
    (
        'clean__scripts-light',
        ['scripts__dev'],
        done
    );
});

/** IMAGE's **/
gulp.task('images__dev', () => {
    return gulp.src('src/images/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/images'))
});

gulp.task('images', (done) => {
    runSequence
    (
        'clean__images',
        ['images__dev'],
        done
    );
});

/** FONT's **/
gulp.task('fonts__dev', () => {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('./public/fonts'))
});

gulp.task('fonts', (done) => {
    runSequence
    (
        'clean__images',
        ['fonts__dev'],
        done
    );
});

/** !!! WATCH !!! **/
gulp.task('watch', ['styles', 'scripts', 'images', 'fonts'], () => {
    gulp.watch('./src/sass/**/*.sass', ['styles-light']);
    gulp.watch('./src/js/**/*.js', ['scripts-light']);
    gulp.watch('./src/images/**/*', ['images']);
    gulp.watch('./src/fonts/**/*', ['fonts']);
});

/** !!! BUILD !!! **/
gulp.task('build', ['styles', 'scripts', 'images', 'fonts'], () => {
    console.log('Build will complete successful!');
});
