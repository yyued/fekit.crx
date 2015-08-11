module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        path = require('path'),
        moment = require('moment')
        log = console.log;

    var pkg = require('../package.json');
    var banner = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author  : ' + pkg.author + '\n * @update  : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r';

    gulp.task('predev_cmd', function(){
        log('[packing src/js/node_modules in one file] browserifying... ')
        var CWD = path.join(__dirname, '..')
        var dir1 = path.join(CWD, 'src/js')
        var cmd = 'cd '+dir1+' && npm i && node ../../scripts/post-install.js && cd '+ CWD
        require('child_process').execSync(cmd)
        return true;
    })  

    gulp.task('predev', ['predev_cmd'], function(){
        log('[uglifying src/js/lib/**] uglifying... ')
        return gulp.src(['src/js/lib/*.js'])
            .pipe(plugins.uglify())
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('src/js'))
    })

}