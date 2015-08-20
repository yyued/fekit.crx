// 0.lib
var _ = require('../../bower_components/lodash/lodash')
var qr = require('../../node_modules/qr-image')

// 0.ui
var Notification = require('../ui/Notification')
var FileZone = require('../ui/FileZone')

// 0.corss-state
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

// 1. main code
var Page = React.createClass({
	getInitialState: function () {
		var url = window.location.href
	    return {
	        inputText: url,
	        inputSize: 250,
	        output: '',
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPage = (state.show?"":" remove")
		state.output = generatorQrcode(state.inputText)
		return (  
			<div className={classNameOfPage}>
			<div className="Page__input">
				<div className="fmSection">
					<textarea  ref="inputText" cols="30" rows="2" placeholder="请输入url或其他文本" onChange={this.__handleChangeText} value={state.inputText} ></textarea>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">尺寸</div>
						<input className="fmGroup__item" ref="inputSize" type="range" min="100" max="300" step="10" value={state.inputSize} onChange={this.__handleChangeSize}/>
					</div>
				</div>
				<div className="fmSection">
					<a href={state.output} download="qrcode.png" className="fkBtn">下载</a>
				</div>
			</div>
			<div className="Page__output">
				<img className="" src={state.output} width={state.inputSize} />
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
	__handleChangeText: function(){
		var state = this.state
		var el = React.findDOMNode(this.refs.inputText)
		state.inputText = el.value
		this.setState(state)
	},
	__handleChangeSize: function(){
		var state = this.state
		var el = React.findDOMNode(this.refs.inputSize)
		state.inputSize = el.value
		this.setState(state)
	}
})

module.exports = Page

// 2. utils
function generatorQrcode(text){
    var options = {
    	size: 8,
        ec_level: 'H',
        type: 'png'
    }
    var buffer = qr.imageSync(text, options)
    var output = `data:${options.type};base64,${buffer.toString('base64')}`
    return output
}

