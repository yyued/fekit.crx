var UglifyJS = require('uglifyJs')
var CleanCSS = require('cleanCss')
var _ = require('../../bower_components/lodash/lodash')
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

var Notification = require('../ui/Notification')
var FileZone = require('../ui/FileZone')

var AceEditor = require('../../node_modules/react-ace/index')
var brace  = require('../../node_modules/react-ace/node_modules/brace/index')
require('../../node_modules/react-ace/node_modules/brace/mode/html')
require('../../node_modules/react-ace/node_modules/brace/mode/css')
require('../../node_modules/react-ace/node_modules/brace/mode/javascript')
require('../../node_modules/react-ace/node_modules/brace/mode/json')
require('../../node_modules/react-ace/node_modules/brace/theme/idle_fingers')


var Page = React.createClass({
	getInitialState: function () {
	    return {
	        input:'',
	        output: '',
	        lang: 'javascript',
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPage = (state.show?"":"remove")
		return (  
			<div className={classNameOfPage}>
			<div className="Page__input">
				<div className="fmSection">
					<div className="fmGroup">
						<FileZone callback={this.__handleFileZone} />
					</div>
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title ">语言</div>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'css')} checked={state.lang=='css'?'true':''} type="radio" name="minifyFileType"/>css</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'javascript')} checked={state.lang=='javascript'?'true':''} type="radio" name="minifyFileType"/>js</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'json')} checked={state.lang=='json'?'true':''} type="radio" name="minifyFileType"/>json</label>
					</div>
					<div className="fmGroup">
						<div className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
				<AceEditor mode={state.lang} theme="idle_fingers" onChange={this.__handleChange} value={state.input} width="800" height="400" name="UNIQUE_ID3" />
			</div>
			<div className="Page__output">
				<AceEditor mode={state.lang} theme="idle_fingers" onChange={this.__handleChange2} value={this.state.output} width="800" height="100" name="UNIQUE_ID4"/>
			</div>
			</div>
		)
	},
	__stateMenuListener: function(){
		var state = this.state
		if(this.getStateMenu('active') === this.props.url){
			state.show = true
		}else{
			state.show = false
		}
		this.setState(state)
	},
	__handleSwitchLang: function(lang){
		var state = this.state
		state.lang = lang
		state.output = getMinifyCode.call(this, state.input, lang)
		this.setState(state)
	},
	__handleChange: function(newValue, oldValue){
		var state = this.state
		state.input = newValue
		state.output = getMinifyCode.call(this, this.state.input, this.state.lang)
		this.setState(state)
	},
	__handleChange2: function(newValue){
		this.state.output = newValue
	},
	__handleFileZone: function(file){
		switch(file.type){
			case 'application/json' : this.state.lang = 'json'; break;
			case 'text/javascript' 	: this.state.lang = 'javascript'; break;
			case 'text/css' 		: this.state.lang = 'css'; break;
			case 'text/html' 		: this.state.lang = 'html'; break;
		}
		readFileAsText(file, (fileContent)=>{
			this.state.input = fileContent
			this.state.output = getMinifyCode.call(this, this.state.input, this.state.lang)
			this.setState(this.state)
		}.bind(this))
		
		function readFileAsText(file, cb){
		    var reader = new FileReader()
		    reader.readAsText(file)
		    reader.onload = function(e){
		        cb(e.target.result)
		    }
		}
	},
	__handleCopy: function(){
		executeCopy(this.state.output)
		this.setStateNotification('msg', '代码已复制')
	}
})

module.exports = Page

// utils
function guessFileType(source){
    var reg_html = /\<\w+\>(?!'|")/gm
    var reg_css = /\.\w[\w\d-]*\{/gm
    //var reg_js = /function\s+\w[\w\d-_$]*\(/gm
    var fileType
    if(reg_html.test(source)){
        return fileType = 'html'
    }
    if(reg_css.test(source)){
        return fileType = 'css'
    }
    //if(reg_js.test(source)){
    return fileType = 'javascript'
    //}
}

function getMinifyCode(sourceCode, fileType){
    var targetCode
	try{
	    switch (fileType){
	        case 'json': targetCode = doMinifyJSON(sourceCode); break;
	        case 'javascript': targetCode = doMinifyJS(sourceCode); break;
	        case 'css': targetCode = doMinifyCSS(sourceCode); break;
	    }
	}catch(e){
		this.state.output = ''
		this.setStateNotification('msg', '压缩出错')
	}
    return targetCode
}


function doMinifyJS(source){
    var options = {
    	fromString: true
    }
    var result = UglifyJS.minify(source, options)
    return result.code
}

function doMinifyJSON(source){
    var code
    try{
        code = JSON.stringify(JSON.parse(source), null, 0)
    }catch(e) {

    }
    return code || false
}

function doMinifyCSS(source){
    var option = {
        compatibility: "ie7"
    }
    var result = new CleanCSS(option).minify(source)
    return result.styles
}

function executeCopy(text) {
    var input = document.createElement('textarea')
    var ref = document.getElementsByTagName('div')[0]
    document.body.insertBefore(input, ref)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('Copy')
    input.remove()
}



