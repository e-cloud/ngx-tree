/* eslint-disable */
const gulp = require('gulp')
const path = require('path')
const ngc = require('@angular/compiler-cli/src/main').main
const rollup = require('rollup')
const sourcemaps = require('rollup-plugin-sourcemaps');
const localResolve = require('rollup-plugin-local-resolve');
const del = require('del')
const runSequence = require('run-sequence')
const inlineResources = require('./tools/gulp/inline-resources')

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src/ngx-tree');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');

const libName = 'ngx-tree'

const rollupBaseConfig = {
  // Bundle's entry point
  // See https://github.com/rollup/rollup/wiki/JavaScript-API#entry
  input: `${buildFolder}/index.js`,

  name: libName,

  sourcemap: true,

  external: [
    // A list of IDs of modules that should remain external to the bundle
    // See https://github.com/rollup/rollup/wiki/JavaScript-API#external
    '@angular/core',
    '@angular/common',
    '@angular/platform-browser',
    '@angular/animations',
    'rxjs',
    'lodash-es'
  ],

  plugins: [
    sourcemaps(),
    localResolve()
  ]
};

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function () {

  // Delete contents but not dist folder to avoid broken npm links
  // when dist directory is removed while npm link references it.
  return deleteFolders([distFolder + '/**', '!' + distFolder]);
});

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});


/**
 * 4. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc', function (cb) {
  const exitCode = ngc(['-p', `${tmpFolder}/tsconfig.es5.json`])

  if (exitCode === 1) {
    // This error is caught in the 'compile' task by the runSequence method callback
    // so that when ngc fails to compile, the whole compile process stops running
    throw new Error('ngc compilation failed');
  }

  cb()
});

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:fesm', async function () {
  const config = Object.assign({}, rollupBaseConfig, {
    // Format of generated bundle
    // See https://github.com/rollup/rollup/wiki/JavaScript-API#format
    format: 'es',

    file: path.join(distFolder, `${libName}.js`),

    sourcemapFile: path.join(buildFolder, `${libName}.js`),
  })
  const bundle = await rollup.rollup(config)

  await bundle.write(config);
});

/**
 * 6. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', async function () {
  const config = Object.assign({}, rollupBaseConfig, {

    // Format of generated bundle
    // See https://github.com/rollup/rollup/wiki/JavaScript-API#format
    format: 'umd',

    // Export mode to use
    // See https://github.com/rollup/rollup/wiki/JavaScript-API#exports
    exports: 'named',

    // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals
    globals: {
      typescript: 'ts'
    },

    file: path.join(distFolder, `${libName}.umd.js`),
    sourcemapFile: path.join(buildFolder, `${libName}.umd.js`),
  })

  const bundle = await rollup.rollup(config)

  await bundle.write(config);
});

/**
 * 7. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
gulp.task('copy:build', function () {
  return gulp.src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 8. Copy package.json from /src to /dist
 */
gulp.task('copy:manifest', function () {
  return gulp.src([`${srcFolder}/package.json`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 9. Copy README.md from / to /dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([path.join(rootFolder, 'README.{MD,md}')])
    .pipe(gulp.dest(distFolder));
});

/**
 * 10. Delete /.tmp folder
 */
gulp.task('clean:tmp', function () {
  return deleteFolders([tmpFolder]);
});

/**
 * 11. Delete /build folder
 */
gulp.task('clean:build', function () {
  return deleteFolders([buildFolder]);
});

gulp.task('compile', function () {
  runSequence(
    'clean:dist',
    'copy:source',
    'inline-resources',
    'ngc',
    'rollup:fesm',
    'rollup:umd',
    'copy:build',
    'copy:manifest',
    'copy:readme',
    'clean:build',
    'clean:tmp',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
        deleteFolders([distFolder, tmpFolder, buildFolder]);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  gulp.watch(`${srcFolder}/**/*`, ['compile']);
});

gulp.task('clean', ['clean:dist', 'clean:tmp', 'clean:build']);

gulp.task('build', function (cb) {
  runSequence('clean', 'compile', cb)
});

gulp.task('build:watch', ['build', 'watch']);

gulp.task('default', ['build:watch']);

/**
 * Deletes the specified folder
 */
function deleteFolders(folders) {
  return del(folders);
}
