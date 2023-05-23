import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import squoosh from 'gulp-squoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import { deleteAsync } from 'del';

// Styles

 export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([autoprefixer(), csso()]))
     .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//html
 const html  = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
     .pipe(gulp.dest('build'));
}

//img
 const optimizeImages  = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

 export const copyImages  = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'));
    }

//webP
 const createWebp  = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({webp:{}}))
  .pipe(gulp.dest('build/img'));
}

//svg
  const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons'])
.pipe(svgo())
.pipe(gulp.dest('build/img/'));
 }
 const sprite  = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//fonts,favicon
export const copy  = (done) => {
gulp.src(['source/fonts/*.{woff2,woff}','source/*.ico', 'source/*.webmanifest'],
{
  base: 'source'
})
.pipe(gulp.dest('build'))
done ();
}

//clean
 const clean  = () => {
  return deleteAsync('build');
}



// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//reload
 const reload  = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


 export default gulp.series(
  clean, copy, copyImages,
  gulp.parallel(
    styles, html, svg, sprite,
    createWebp
  ),
 gulp.series(server, watcher
));

//build
export const build =  gulp.series(
  clean, copy, optimizeImages,
  gulp.parallel(
    styles, html, svg, sprite, createWebp
  )
);
