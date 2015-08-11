// 分析 package.json，将当前node_modules browserify成1个脚本

// 1. lib
var path = require('path')
var fs = require('fs')
var child_process = require('child_process')
var _ = require('../node_modules/browser-sync/node_modules/lodash')

// 2. main
// ... 分析 package.json, 得到所有模块的 name
// ... 生成 browserify打包命令
// ... ... 确定模块入口, 按如下规则
// ... ... ... 读取每一个模块的 pkg.main, 得到入口文件 fullPath
// ... ... ... 如不存在 pkg.main, 暂不处理
// ... ... 确定模块别名, 按 name数组
// ... 执行 browserify打包

var PACKAGE_PATH = path.resolve(__dirname, '../src/js/package.json')
var PACKAGE_CWD = path.dirname(PACKAGE_PATH)
var OUTPUT_PATH = path.join(PACKAGE_CWD, 'lib/node_modules.js')

var pkgJSON = JSON.parse(fs.readFileSync(PACKAGE_PATH))
var moduleNames = getModuleNames(pkgJSON)
var packCMD = generatePackCMD(moduleNames)
execPackCmd(packCMD)


// 3. utils
function getModuleNames (pkgJSON) {
	var moduleNames = []	
	_.each(['dependencies', 'devDependencies'], function(key){
		moduleNames = moduleNames.concat( _.keys(pkgJSON[key]) )
	})
	return moduleNames
}

function generatePackCMD(moduleNames){
	// browserify -r ./clean-css/index.js:clean-css  > ../_browserify/lib.js
	var packItems = []
	_.each(moduleNames, function(name){
		var entryPath = __getModuleEntry(name)
		if(entryPath){ packItems = packItems.concat(' -r '+entryPath+':'+name) }
	})
	return ' browserify ' +packItems.join(' ')+ ' > '+OUTPUT_PATH
}

function __getModuleEntry(moduleName){
	var moduleCWD = path.join(PACKAGE_CWD, 'node_modules', moduleName)
	var modulePkgPath = path.join(moduleCWD, 'package.json')
	var modulePkgJSON = JSON.parse(fs.readFileSync(modulePkgPath)) 
	if(modulePkgJSON.main){
		var moduleEntryPath = path.join(moduleCWD, modulePkgJSON.main)
		moduleEntryPath = (path.extname(moduleEntryPath) == '.js'?moduleEntryPath:moduleEntryPath+'.js')
		if(fs.existsSync(moduleEntryPath)) return moduleEntryPath
	}
	return __guessModuleEntry(moduleCWD)
}

function __guessModuleEntry(moduleCWD){
	var guessItems = ['index.js']
	var isFound = false
	var result = undefined
	_.each(guessItems, function(item){
		if(isFound) return;
		var guessFile = path.join(moduleCWD, item)
		if(fs.existsSync(guessFile)){ 
			isFound = true
			result = guessFile
		}
	})
	return result
}


function execPackCmd(packCMD){
	console.log('browserifying...')
	child_process.execSync(packCMD)
	console.log('browserify done!')
}



