var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var replace = require('gulp-string-replace');
var cleanCSS = require('gulp-clean-css');

var ts = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var strip = require('gulp-strip-comments');

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
		.pipe(ts.createProject('tsconfig.json')())
		.pipe(strip()) 	// Remove comments
		.pipe(gulp.dest('./js/'));
});
// gulp.task('ts', function() {
	// return browserify({
	// 	basedir: '.',
	// 	debug: false,
	// 	entries: ['js/filter-js.ts'],
	// 	cache: {},
	// 	packageCache: {}
	// })
	// .plugin(tsify)
	// .bundle()
	// .pipe(source('bundle.js'))
	// .pipe(gulp.dest('./js/'));
// });

// Watch
gulp.task('watch', function() {
	gulp.watch(['./_pug/*.pug', './_pug/**/*.pug'], gulp.series('sass','pug'));
	gulp.watch(['./_sass/*.scss', './_sass/**/*.scss',], gulp.series('sass', 'pug'));
});
gulp.task('watchTS', function() {
	gulp.watch(['./js/*.ts'], gulp.parallel('ts'));
});
gulp.task('watchAll', function() {
	gulp.watch(['./js/*.ts'], gulp.parallel('ts'));
	gulp.watch(['./_pug/*.pug', './_pug/**/*.pug'], gulp.series('sass','pug'));
	gulp.watch(['./_sass/*.scss', './_sass/**/*.scss',], gulp.series('sass', 'pug'));
})

// Default Task
// gulp.task('default', gulp.series('sass', 'pug', 'watch'));
// gulp.task('default', gulp.parallel('ts', 'watchTS'));
gulp.task('default', gulp.series('ts', 'sass', 'pug', 'watchAll'));