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
	        encode: true,
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
					<textarea  ref="input" cols="30" rows="2" placeholder="请输入url或其他文本" onChange={this.__handleInput} value={state.input}></textarea>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<label className="fmGroup__item"><input onClick={this.__handleSwitchType.bind(this, true)} checked={state.encode?'true':''} type="radio" name="urlCodeType" /> encode</label>
						<label className="fmGroup__item"><input onClick={this.__handleSwitchType.bind(this, false)} checked={state.encode?'':'true'} type="radio" name="urlCodeType" /> decode</label>
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
		this.state['output'] = getOutput(this.state['input'], this.state['encode'])
		this.setState(this.state)
	},
	__handleOutput: function(){
		this.state['output'] = React.findDOMNode(this.refs['output']).value
		this.setState(this.state)
	},
	__handleSwitchType: function(isEncode){
		this.state['encode'] = isEncode
		this.state['output'] = getOutput(this.state['input'], this.state['encode'])
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
function getOutput(input, isEncode){
	return  isEncode?encodeURIComponent(input):decodeURIComponent(input)
}
