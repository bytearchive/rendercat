var gulp = require('gulp');
var typescript = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('app.ts')
        .pipe(typescript())
        .pipe(gulp.dest('.'));
});