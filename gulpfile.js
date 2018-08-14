var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  babel = require('gulp-babel');

var tsSrc = [
  'src/**/*.ts',
  '!./node_modules/**'
];
gulp.task('ts-babel', function() {
  var tsProject = ts.createProject('tsconfig.json');
  return gulp.src(tsSrc)
    .pipe(tsProject())
    .pipe(babel({
      presets: ['es2015'],
      plugins: [
        'transform-runtime'
      ]
    }))
    .pipe(gulp.dest((function(f) { return f.base; })));
});
