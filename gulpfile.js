var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var replace = require('gulp-string-replace');
var cleanCSS = require('gulp-clean-css');

var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

// Pug
gulp.task('pug', function() {
	return gulp.src([
			'./_pug/*.pug'
		])
		.pipe(pug({
			pretty: '	'
		}))
		.pipe(gulp.dest('./'));
});

// Sass
gulp.task('sass', function() {
	return gulp.src([
			'./_sass/*.scss'
		])
		.pipe(sass())
		// .pipe(replace('@charset "UTF-8";', ''))
		// .pipe(cleanCSS())
		.pipe(gulp.dest('./css/'));
});

// Typescript
gulp.task('ts', function() {
	return gulp.src([
			'./js/*.ts'
		])
		.pipe(tsProject())
		.pipe(gulp.dest('./js/'));
});

// Watch
gulp.task('watch', function() {
	// gulp.watch(['./js/*.ts'], gulp.series('ts'));
	gulp.watch(['./_pug/*.pug', './_pug/**/*.pug'], gulp.series('sass','pug'));
	gulp.watch(['./_sass/*.scss', './_sass/**/*.scss',], gulp.series('sass', 'pug'));
});

// Default Task
gulp.task('default', gulp.series('sass', 'pug', 'watch'));