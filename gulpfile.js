"use strict";

let gulp = require('gulp');
let connect = require('gulp-connect'); // Runs a local dev server
let open = require('gulp-open'); // Open a URL in a web browser
let browserify = require('browserify'); // Bundles JS
let reactify = require('reactify'); // Transforms React JSX to JS
let source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
let concat = require('gulp-concat'); //Concantenates files
let lint = require('gulp-eslint'); //Lint our JS files, including out JSX


let config = {
    port: 3000,
    devBaseUrl: 'http://localhost',
    paths: {
        html:   './src/*.html',
        js:     './src/**/.js',
        css: [
                'node_modules/bootstrap/dist/css/bootstrap.min.css',
                'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist:   './dist',
        mainJS: './src/main.js'
    }
};

// Start a local dev server
gulp.task('connect',  function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
   gulp.src('dist/index.html')
       .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}))
});

gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
});

gulp.task('js', function() {
    browserify(config.paths.mainJS)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint({config: '.eslintrc'}))
        .pipe(lint.format());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
