// 0.lib
var _ = require('../../bower_components/lodash/lodash')
var Css2JSON = require('../../node_modules/css2json')

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
	        inputHeight: 50,
	        inputBorder: 10,
	        inputDirect: 'top',
	        inputFG: '#234',
	        inputBG: '#e8eaed',
	        output: '',
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var result = getOutput(state)
		state.output = result[0]
		var triangleBefore = result[1]
		var triangleAfter = result[2]
		var classNameOfPage = (state.show?"":" remove")
		var styleInput = {width:'80px'}
		return (  
			<div className={classNameOfPage} onClick={this.__handlePage}>
			<div className="Page__input">
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">三角形的高</div>
						<div className="fmGroup__item"><input type="text" style={styleInput} value={state.inputHeight} onChange={this.__handleChangeInputHeight} /></div>
						<div className="fmGroup__item"><input type="range" min="1" max="100" step="1" value={state.inputHeight} onChange={this.__handleChangeInputHeight} /></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">三角形的框</div>
						<div className="fmGroup__item"><input type="text" style={styleInput} value={state.inputBorder} onChange={this.__handleChangeInputBorder} /></div>
						<div className="fmGroup__item"><input type="range" min="1" max="100" step="1" value={state.inputBorder} onChange={this.__handleChangeInputBorder} /></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title ">方向</div>
						<label className="fmGroup__item"><input onChange={this.__handleChangeDirection} value='top' checked={state.inputDirect=='top'?'true':''} type="radio" name="cssTriangleDirectionType"/>top</label>
						<label className="fmGroup__item"><input onChange={this.__handleChangeDirection} value='right' checked={state.inputDirect=='right'?'true':''} type="radio" name="cssTriangleDirectionType"/>right</label>
						<label className="fmGroup__item"><input onChange={this.__handleChangeDirection} value='bottom' checked={state.inputDirect=='bottom'?'true':''} type="radio" name="cssTriangleDirectionType"/>bottom</label>
						<label className="fmGroup__item"><input onChange={this.__handleChangeDirection} value='left' checked={state.inputDirect=='left'?'true':''} type="radio" name="cssTriangleDirectionType"/>left</label>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">前景色</div>
						<div className="fmGroup__item"><MyColorPicker defaultColor={state.inputFG} changeCallback={this.__changeFGCallback}/></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">背景色</div>
						<div className="fmGroup__item"><MyColorPicker defaultColor={state.inputBG} changeCallback={this.__changeBGCallback}/></div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup">
						<div className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
				<div className="CssTriangleViewer">
					<div className="CssTriangleViewer__entity">
						<div style={triangleBefore} />
						<div style={triangleAfter} />
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
	__changeFGCallback: function(newColor){
		this.state.inputFG = newColor
		this.setState(this.state)
	},
	__changeBGCallback: function(newColor){
		this.state.inputBG = newColor
		this.setState(this.state)
	},
	__handleChangeInputHeight: function(e){
		this.state.inputHeight = +e.target.value
		this.setState(this.state)
	},
	__handleChangeInputBorder: function(e){
		this.state.inputBorder = +e.target.value
		this.setState(this.state)
	},
	__handleChangeDirection:function(e){
		this.state.inputDirect = e.target.value
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
	var mark;
	switch(state.inputDirect){
		case 'top': mark = ['bottom', 'left', 'right', 'top']; break;
		case 'bottom': mark = ['top', 'left', 'right', 'bottom']; break;
		case 'left': mark = ['right', 'top', 'bottom', 'left']; break;
		case 'right': mark = ['left', 'top', 'bottom', 'right']; break;
	}
	var triangleBefore = `.caret:before{
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-${mark[0]}: ${state.inputHeight}px solid ${state.inputFG};
		border-${mark[1]}: ${state.inputHeight}px solid transparent;
		border-${mark[2]}: ${state.inputHeight}px solid transparent;
	}`
	var triangleAfter = `.caret:after{
		content: '';
		position: absolute;
		left: ${ _.contains(['top','left', 'bottom'], mark[3])? state.inputBorder:0 }px;
		top:  ${ _.contains(['top','left', 'right'], mark[3])? state.inputBorder:0 }px;
		border-${mark[0]}: ${ state.inputHeight - state.inputBorder }px solid ${state.inputBG};
		border-${mark[1]}: ${ state.inputHeight - state.inputBorder }px solid transparent;
		border-${mark[2]}: ${ state.inputHeight - state.inputBorder }px solid transparent;
	}`
	var output = `
	.caret {
		position: relative;
	}

	${triangleBefore}

	${triangleAfter}
	`
	return [output, css2object(triangleBefore), css2object(triangleAfter)]

	function css2object(css){
		var newObj = {}
		var obj = Css2JSON(css)
		_.each(obj, (o)=>{
			_.each(o, (v, k)=>{
				newObj[_.camelCase(k,'-')] = v
			})
		})
		return newObj
	}
}

