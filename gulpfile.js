const { src, dest, parallel, series, watch } = require('gulp');
const browserSync    = require('browser-sync').create();
const scss           = require('gulp-sass')(require('sass'));
const concat         = require('gulp-concat');
const uglify         = require('gulp-uglify-es').default;
const autoPrefixer   = require('gulp-autoprefixer');
const imagemin       = require('gulp-imagemin');
const del            = require('del');
const cheerio        = require('gulp-cheerio');
const replace        = require('gulp-replace');
const sprite         = require('gulp-svg-sprite');
const ssi            = require('browsersync-ssi');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/',
        middleware: ssi({
            baseDir: 'app/',
            ext: '.html',
          })
        },
        notify: false,
        online: true,
    });
}

function styles() {
    return src([
        'app/scss/style.scss'
    ])
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/mixitup/dist/mixitup.js',
        'app/js/main.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img/**/*.*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(dest('dist/img'))
}

function svgSprite() {
    return src('app/img/sprite/*.svg')
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {
                xmlMode: true,
            }
        }))
        .pipe(replace('&gt;','>'))
        .pipe(sprite({
            mode: {
                stack: {
                    sprite:'../sprite.svg'
                }
            }
        }))
        .pipe(dest('app/img'));
}


function build() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html',
        'app/fonts/**/*',
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/**/*.html']).on('change', browserSync.reload);
    watch(['app/img/sprite/*.svg'], svgSprite);
}


exports.watching    = watching;
exports.styles      = styles;
exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.images      = images;
exports.cleandist   = cleanDist;
exports.svgSprite   = svgSprite;

exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, scripts, svgSprite, browsersync, watching);