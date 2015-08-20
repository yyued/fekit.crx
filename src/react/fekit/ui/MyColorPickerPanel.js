require('../../../sass/color-picker.scss')
var ColorPicker = require('../../node_modules/react-colorpicker')

var stateColor = require('../utils/stateColor')
var util = require('../utils/util')

var PAGE_WIDTH = window.innerWidth
var PICKER_WIDTH = 400
var TARGET_WIDTH = 40

var MyConponent = React.createClass({
	getInitialState: function () {
		return {
			active: false,
			color: '#000222',
			x: 200,
			y: 300
		}	
	},
	mixins: [stateColor, util],
	componentDidMount: function () {
      	document.addEventListener('click', this.__handleAutoHidePanel, false)
	},
	render: function() {
		var state = this.state
		var className1 = `fkColorPk ${state.active?'-active':''}`
		var style1 = {
			position: 'fixed',
			top: state.y,
			left: isTurnRight(state.x)? state.x-PICKER_WIDTH : state.x+TARGET_WIDTH
		}
		return (  
			<div className={className1} style={style1} onClick={this.__handleClickPanel}> 
				<ColorPicker color={state.color} onChange={this.__handleChangeColor} />
			</div>
		)
	},
	__stateColorListener: function(){
		var data = this.getStateColor('data')
		var active = data['active']
		var cData = data['list'][data['activeId']]
		if(!cData) return
		this.setState({
			active: active,
			color: cData.color,
			x: cData.x,
			y: cData.y
		})
	},
	__handleChangeColor: function(Colr){
		var data = this.getStateColor('data')
		data['list'][data['activeId']]['color'] = Colr.toHex()
		data['list'][data['activeId']]['cb'](Colr.toHex())
		this.setStateColor('data', data)
	},
	__handleClickPanel: function(e){
		this.__stopPropagation(e)
	},
	__handleAutoHidePanel: function(e){		
		var data = this.getStateColor('data')
		if(!data) return
		data.active = false
		this.setStateColor(data)
	}
})

module.exports = MyConponent

function isTurnRight(targetX){
	return PAGE_WIDTH - targetX - TARGET_WIDTH < 2*PICKER_WIDTH
}













