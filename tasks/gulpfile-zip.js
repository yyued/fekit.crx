module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        path = require('path'),
        del = require('del'),
        moment = require('moment'),
        multiSprite = require('multi-sprite'),
        log = console.log;

    var that = this;
    that.port = +argv.p || 3000;
    var pkg = require('../package.json');
    var banner = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author  : ' + pkg.author + '\n * @update  : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r';

    gulp.task('build_sass', function() {
        function sassCompile4nix(){
            function handler(){
                return plugins.notify.onError({
                    title:'sass编译错误', 
                    message:'<%=error.message%>'
                })
            }
            return plugins.sass().on('error', handler()) 
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompile4nix())
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer( {browsers: ['> 0%']} ))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(gulp.dest('src/css'))
    })
    gulp.task('build_css', ['build_sass'], function() {
        return gulp.src('src/css/**/*.css')
            .pipe(plugins.minifyCss({"compatibility":"ie7"}))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/css'))
    })
    gulp.task('build_slice', function() {
        return gulp.src('src/img/slice/**')
            .pipe(gulp.dest('dest/img/slice'))
    })
    gulp.task('build_sprite', ['build_slice', 'build_css'], function() {
        return multiSprite({
            srcCss: 'dest/css',
            srcImg: 'dest/img/slice',
            destCss: 'dest/css',
            destImg: 'dest/img/sprite',
            'algorithm': 'binary-tree',
            'padding': 4,
            'exportOpts': {
                'format': 'png',
                'quality': 90
            },
            successCB: function(){
                del(['dest/img/slice/**'])
                
                // 给css文件的图片请求加上时间戳
                var timestamp = +new Date
                gulp.src(['dest/css/**'])
                    .pipe(plugins.replace(/(\/[\w-]*\.(jpg|jpeg|gif|png|bmp|tiff|otf|ttf|woff|svg|webp|swf|htc))/ig, '$1?'+timestamp))
                    .pipe(gulp.dest('dest/css'));
            }
        })
    })
    gulp.task('build_prejs', function(){
        return gulp.src(['src/js/**', '!src/js/package.json', '!src/js/node_modules', '!src/js/node_modules/**'])
            .pipe(gulp.dest('dest/js'))
    })
    gulp.task('build_js', ['build_prejs'], function() {
        return gulp.src(['dest/js/*.js', '!dest/js/lib/**'])
            .pipe(plugins.uglify({mangle:false, preserveComments:'some'}))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/js'))
    })
    gulp.task('build_img', function() {
        return gulp.src(['src/img/**', '!src/img/**/*.psd', '!src/img/slice/**'])
            .pipe(plugins.imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('dest/img'))
    })
    gulp.task('build_fonts', function() {
        return gulp.src('src/fonts/**')
            .pipe(gulp.dest('dest/fonts'))
    })
    gulp.task('build_html', ['build_crx', 'build_biz'],function() {
        return gulp.src(['src/*.html'])
            .pipe(gulp.dest('dest'))
    })
    gulp.task('build_biz', function() {
        return gulp.src('src/biz/**')
            .pipe(gulp.dest('dest/biz'))
    })
    gulp.task('build_crx', function(){
        return gulp.src('src/manifest.json')
            .pipe(gulp.dest('dest'))
    })
    gulp.task('build_clean', function() {
        del.sync(['dest/**'])
    })

    gulp.task('build', ['build_clean', 'build_html', 'build_sprite', 'build_js', 'build_img', 'build_fonts', 'build_biz'], function(){
        log('build done!')
    })
    gulp.task('zip', ['build'],function() {
        var zipname = path.basename(path.join(__dirname, '..'))+'.zip'
        return gulp.src(['dest/**'])
            .pipe(plugins.zip(zipname))
            .pipe(gulp.dest('./'))
    })

}
