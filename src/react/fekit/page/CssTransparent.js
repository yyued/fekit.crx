// 0.lib
var _ = require('../../bower_components/lodash/lodash')
var Colr = require('../../node_modules/react-colorpicker/node_modules/colr')

// 0.ui
var Notification = require('../ui/Notification')
var MyColorPicker = require('../ui/MyColorPicker')

// 0.corss-state
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

// 1. main code
var Page = React.createClass({
	getInitialState: function () {
	    return {
	        inputSelector: '.bg',
	        inputColor: '#000',
	        inputAlpha: 0,
	        output: '',
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		state.output = getOutput(state)
		var classNameOfPage = (state.show?"":" remove")
		var styleInput = {width:'80px'}
		return (  
			<div className={classNameOfPage} onClick={this.__handlePage}>
			<div className="Page__input">
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">选择器</div>
						<div className="fmGroup__item"><input type="text" value={state.inputSelector} onChange={this.__handleChangeInputSelector}/></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">颜色值</div>
						<div className="fmGroup__item"><MyColorPicker changeCallback={this.__changeCallback}/></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">透明度</div>
						<div className="fmGroup__item"><input type="text" style={styleInput} value={state.inputAlpha} onChange={this.__handleChangeInputAlpha} /></div>
						<div className="fmGroup__item"><input type="range" min="0" max="1" step="0.01" value={state.inputAlpha} onChange={this.__handleChangeInputAlpha} /></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup">
						<div className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
			</div>
			<div className="Page__output">
				<textarea  ref="output" cols="30" rows="10" onChange={this.__handleOutput} value={state.output}></textarea>
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
	__changeCallback: function(newColor){
		this.state.inputColor = newColor
		this.setState(this.state)
	},
	__handleChangeInputSelector: function(e){
		this.state.inputSelector = e.target.value
		this.setState(this.state)
	},
	__handleChangeInputAlpha: function(e){
		this.state.inputAlpha = e.target.value
		this.setState(this.state)
	},
	__handleOutput: function(){
		this.state['output'] = React.findDOMNode(this.refs['output']).value
		this.setState(this.state)
	},
	__handleCopy: function(){
		executeCopy(this.state.output)
		this.setStateNotification('msg', '代码已复制')
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
function getOutput(state){
	var rgba = getRGBA(state.inputColor, state.inputAlpha)
	var iergba = getIERGBA(state.inputColor, state.inputAlpha)
	return `
	${state.inputSelector}{
	    background-color: transparent;
	    background-color: ${rgba};
	    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=${iergba},endColorstr=${iergba});
	}
	:root ${state.inputSelector}{
	    filter: none\\9;   
	}
	`
}

function getRGBA(hex, alpha){
	var rgbArray = Colr.fromHex(hex).toRgbArray()
	return `rgba(${rgbArray.join(',')},${alpha})`
}

// hexIE('#aaa', .5) --> '#7fAAAAAA'
function getIERGBA(hex, alpha){
	var alphaHex = dec2hex(alpha*255)
	var rgbHex = Colr.fromHex(hex).toHex()
	return rgbHex.replace('#', '#'+alphaHex).toUpperCase()
}

function dec2hex(dec){
	return parseInt(dec, 10).toString(16)
}

