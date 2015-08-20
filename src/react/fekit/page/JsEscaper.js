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
	        escape: true,
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
					<textarea  ref="input" cols="30" rows="2" placeholder="请输入文本~" onChange={this.__handleInput} value={state.input}></textarea>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<label className="fmGroup__item"><input onClick={this.__handleSwitchType.bind(this, true)} checked={state.escape?'true':''} type="radio" name="jsEscapeType" /> escape</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchType.bind(this, false)} checked={state.escape?'':'true'} type="radio" name="jsEscapeType" /> unescape</label>
					</div>
					<div className="fmGroup">
						<div className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
				<div className="fmSection">
					
				</div>
			</div>
			<div className="Page__output">
				<textarea  ref="output" cols="30" rows="2" onChange={this.__handleOutput} value={state.output}></textarea>
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
	__handleInput: function(){
		this.state['input'] = React.findDOMNode(this.refs['input']).value
		this.state['output'] = getOutput(this.state['input'], this.state['escape'])
		this.setState(this.state)
	},
	__handleOutput: function(){
		this.state['output'] = React.findDOMNode(this.refs['output']).value
		this.setState(this.state)
	},
	__handleSwitchType: function(isEscape){
		this.state['escape'] = isEscape
		this.state['output'] = getOutput(this.state['input'], this.state['escape'])
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
function getOutput(input, isEscape){
	return  isEscape? escapeJs(input): unescapeJs(input)
}

// https://github.com/joliss/js-string-escape
function escapeJs(str){
    return (''+str).replace(/["'\\\n\r\u2028\u2029]/g, function(char){
        switch(char){
            case '"':
            case "'":
            case '\\': return '\\'+ char
            case '\n': return '\\n'
            case '\r': return '\\r'
            case '\u2028': return '\\u2028'
            case '\u2029': return '\\u2029'
        }
    })
}

function unescapeJs(str){
    return (''+str).replace(/\\"|\\'|\\\\|\\n|\\r|\\u2028|\\u2029]/g, function(char){
        switch(char){
            case '\\"': return '"'
            case "\\'": return "'"
            case '\\\\': return '\\'
            case '\\n': return '\n'
            case '\\r': return '\r'
            case '\\u2028': return '\u2028'
            case '\\u2029': return '\u2029'
        }
    })
}