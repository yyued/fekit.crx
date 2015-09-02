// 0.lib
var _ = require('../../bower_components/lodash/lodash')

// 0.ui
var Notification = require('../ui/Notification')

// 0.corss-state
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

// 1. main code
var Page = React.createClass({
	getInitialState: function () {
	    return {
	        input: '',
	        output: '',
	        type: 'escapeJS', // choices: escapeJS unescapeJS escapeHTML unescapeHTML encodeURL decodeURL encodeHexNCR decodeHexNCR encodeUnicode decodeUnicode encodeUTF8 decodeUTF8
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPage = (state.show?"":" remove")
		return (  
			<div className={classNameOfPage}>
			<div className="Page__input">
				<div className="fmSection">
					<textarea cols="30" rows="2" placeholder="请输入文本~" onChange={this.__handleInput} value={state.input}></textarea>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'escapeJS')} checked={state.type == 'escapeJS'?'true':''} type="radio" name="convertType" /> escape JS</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'unescapeJS')} checked={state.type == 'unescapeJS'?'true':''} type="radio" name="convertType" /> unescape JS</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'escapeHTML')} checked={state.type == 'escapeHTML'?'true':''} type="radio" name="convertType" /> escapeHTML</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'unescapeHTML')} checked={state.type == 'unescapeHTML'?'true':''} type="radio" name="convertType" /> unescapeHTML</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'encodeURL')} checked={state.type == 'encodeURL'?'true':''} type="radio" name="convertType" /> encodeURL</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'decodeURL')} checked={state.type == 'decodeURL'?'true':''} type="radio" name="convertType" /> decodeURL</label>
					</div>
					<div className="fmGroup fmGroup--hasHor">
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'encodeHexNCR')} checked={state.type == 'encodeHexNCR'?'true':''} type="radio" name="convertType" /> encodeHexNCR</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'decodeHexNCR')} checked={state.type == 'decodeHexNCR'?'true':''} type="radio" name="convertType" /> decodeHexNCR</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'encodeUnicode')} checked={state.type == 'encodeUnicode'?'true':''} type="radio" name="convertType" /> encodeUnicode</label>
						<label className="fmGroup__item"><input onChange={this.__handleSwitchType.bind(this, 'decodeUnicode')} checked={state.type == 'decodeUnicode'?'true':''} type="radio" name="convertType" /> decodeUnicode</label>
					</div>
					<div className="fmGroup">
						<div className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
				<div className="fmSection">
					
				</div>
			</div>
			<div className="Page__output">
				<textarea cols="30" rows="2" onChange={this.__handleOutput} value={state.output}></textarea>
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
	__handleCopy: function(){
		executeCopy(this.state.output)
		this.setStateNotification('msg', '代码已复制')
	},
	__handleInput: function(e){
		this.state['input'] = e.target.value
		this.state['output'] = getOutput(this.state['input'], this.state['type'])
		this.setState(this.state)
	},
	__handleOutput: function(){
		this.state['output'] = e.target.value
		this.setState(this.state)
	},
	__handleSwitchType: function(type){
		this.state['type'] = type
		this.state['output'] = getOutput(this.state['input'], this.state['type'])
		this.setState(this.state)
	}
})

module.exports = Page

// 2. utils
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
function getOutput(input, type){
	switch(type){
		case 'escapeJS': return escapeJS(input)
		case 'unescapeJS': return unescapeJS(input)
		case 'escapeHTML': return escapeHTML(input)
		case 'unescapeHTML': return unescapeHTML(input)
		case 'encodeURL': return encodeURL(input)
		case 'decodeURL': return decodeURL(input)
		case 'encodeHexNCR': return encodeHexNCR(input)
		case 'decodeHexNCR': return decodeHexNCR(input)
		case 'encodeUnicode': return encodeUnicode(input)
		case 'decodeUnicode': return decodeUnicode(input)
	}
}

// https://github.com/joliss/js-string-escape
function escapeJS(str){
	str = str2unicode(str)
    return (''+str).replace(/\\u[\w\d]{4}|["'\\\n\r\u2028\u2029]/g, function(char){
        switch(char){
            case '"':
            case "'":
            case '\\': return '\\'+ char
            // case '\u': return '\\u'
            case '\n': return '\\n'
            case '\r': return '\\r'
            case '\u2028': return '\\u2028'
            case '\u2029': return '\\u2029'
            default: return char
        }
    })
    function str2unicode (str) {
		var result='', hex, i
		for (i = 0; i < str.length; i++) {
			hex = str.charCodeAt(i).toString(16)
	        hex = ('000'+hex).slice(-4)
	        if(hex<'007f'&&hex>'0019'){
	           hex = str[i]
	        }else{
	           hex = '\\u'+hex
	        }
			result += hex
		}
		return result
	}
}

function unescapeJS(str){
    return (''+str).replace(/\\u[\w\d]{4}|\\"|\\'|\\\\|\\n|\\r|\\u2028|\\u2029/g, function(char){
        switch(char){
            case '\\"': return '"'
            case "\\'": return "'"
            case '\\\\': return '\\'
            case '\\n': return '\n'
            case '\\r': return '\r'
            case '\\u2028': return '\u2028'
            case '\\u2029': return '\u2029'
            default: return unicode2str(char)
        }
    })
    function unicode2str (code) {
		var hex = code.slice(-4)
		var decimal = Number.parseInt(hex, 16)
		return String.fromCharCode(decimal)
	}
}

function escapeHTML (str) {
	return _.escape(str)
}

function unescapeHTML (str) {
	return _.unescape(str)
}

function encodeURL (str) {
	return encodeURIComponent(str)
}

function decodeURL (str) {
	return decodeURIComponent(str)
}

function encodeHexNCR (str) {
	var result = __toHexArray(str)
	return result.map(function (e) {
		return '&#x'+e+';'
	}).join('')
}

function decodeHexNCR (hexNCR) {
	return (''+hexNCR).replace(/&#x[\w\d]{4};/g, function(item){
		var decimal = Number.parseInt(item.substr(3, 4), 16)
		return String.fromCharCode(decimal)
	})
}



function encodeUnicode (str) {
	return __toHexArray(str).map(function (item) {
		return '\\u'+item
	}).join('')
}
function decodeUnicode (str) {
	return (''+str).replace(/\\u[\w\d]{4}/g, function (item) {
		var decimal = Number.parseInt(item.slice(-4), 16) 
		return String.fromCharCode(decimal)
	})
}
function encodeUTF8 (str) {
	
}
function decodeUTF8 (str) {
	
}

function __toHexArray (str) {
	var result=[], hex, i
	for (i = 0; i < str.length; i++) {
		hex = str.charCodeAt(i).toString(16)
		result.push(('000'+hex).slice(-4))
	}
	return result
}

function __toDecimalArray (str) {
	var result=[], hex, i
	for (i = 0; i < str.length; i++) {
		hex = str.charCodeAt(i).toString(10)
		result.push(('000'+hex).slice(-4))
	}
	return result
}


