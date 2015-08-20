var _ = require('../../bower_components/lodash/lodash')
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

var Notification = require('../ui/Notification')
var NotificationSystem = require('../../node_modules/react-notification-system/dist/notification-system')

var FileZone = require('../ui/FileZone')
var AceEditor = require('../../node_modules/react-ace/index')
var brace  = require('../../node_modules/react-ace/node_modules/brace/index')
require('../../node_modules/react-ace/node_modules/brace/mode/html')
require('../../node_modules/react-ace/node_modules/brace/mode/css')
require('../../node_modules/react-ace/node_modules/brace/mode/javascript')
require('../../node_modules/react-ace/node_modules/brace/mode/json')
// @see http://ace.c9.io/build/kitchen-sink.html
// require('../../node_modules/react-ace/node_modules/brace/theme/github')
require('../../node_modules/react-ace/node_modules/brace/theme/idle_fingers')

var beautify = require('../../node_modules/js-beautify/js/index')

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
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'html')} checked={state.lang=='html'?'true':''} type="radio" name="formatFileType"/> html</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'css')} checked={state.lang=='css'?'true':''} type="radio" name="formatFileType"/>css</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'javascript')} checked={state.lang=='javascript'?'true':''} type="radio" name="formatFileType"/>js</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchLang.bind(this, 'json')} checked={state.lang=='json'?'true':''} type="radio" name="formatFileType"/>json</label>
					</div>
					<div className="fmGroup">
						<div className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
				<AceEditor mode={state.lang} theme="idle_fingers" onChange={this.__handleChange} value={state.input} width="800" height="100" name="UNIQUE_ID1" />
			</div>
			<div className="Page__output">
				<AceEditor mode={state.lang} theme="idle_fingers" onChange={this.__handleChange2} value={this.state.output} width="800" height="400" name="UNIQUE_ID2"/>
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
		this.state.lang = lang
		this.state.output = getBeautifyCode(this.state.input, lang)
		this.setState(this.state)
	},
	__handleChange: function(newValue, oldValue){
		var state = this.state
		state.input = newValue
		// state.lang = guessFileType(newValue)
		state.output = getBeautifyCode(newValue, state.lang)
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

function getBeautifyCode(sourceCode, fileType){
    var targetCode
    switch (fileType){
        case 'json': targetCode = doBeautifyJS(sourceCode); break;
        case 'javascript': targetCode = doBeautifyJS(sourceCode); break;
        case 'css': targetCode = doBeautifyCSS(sourceCode); break;
        case 'html': targetCode = doBeautifyHTML(sourceCode); break;
    }
    return targetCode
}

function doBeautifyJS(source, isPath){
    //@see https://github.com/beautify-web/js-beautify
    if(isPath){source = fs.readFileSync(source, "utf8")}
    var options = {
        "indent_size": 4,
        "indent_char": " ",
        "eol": "\n",
        "indent_level": 0,
        "indent_with_tabs": false,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "jslint_happy": false,
        "space_after_anon_function": false,
        "brace_style": "collapse",
        "keep_array_indentation": false,
        "keep_function_indentation": false,
        "space_before_conditional": true,
        "break_chained_methods": false,
        "eval_code": false,
        "unescape_strings": false,
        "wrap_line_length": 0,
        "wrap_attributes": "auto",
        "wrap_attributes_indent_size": 4,
        "end_with_newline": true
    }
    var code = beautify.js(source, options)
    return code
}

function doBeautifyCSS(source){
    var options = {
        "indent_size": 4
    }
    var code = beautify.css(source, options)
    return code
}

function doBeautifyHTML(source){
    var options = {
        "indent_size": 4
    }
    var code = beautify.html(source, options)
    return code
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




