'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('js', function () {
    return gulp.src(['Resources/Public/Js/*.js', '!Resources/Public/Js/*.min.js'])
        .pipe(uglify())
        .pipe(rename(function (path) { // Rename to minified file
            if (path.dirname !== '.') {
                path.basename = path.dirname.split('/').shift();
                path.dirname = '.';
            }
            path.basename += '.min';
        }))
        .pipe(gulp.dest('Resources/Public/Js'));
});

gulp.task('watch', function () {
    gulp.watch(['Resources/Public/Js/*.js', '!Resources/Public/Js/*.min.js'], gulp.series('js'));
});
