// 0. lib
var _ = require('../../bower_components/lodash/lodash')
var util = require('../utils/util')

// 0. corss-state
var stateColor = require('../utils/stateColor')

// 1. main code
var UI = React.createClass({
	getInitialState: function () {
	    return {
	    	colorId: guid(),
	    	color: this.props.defaultColor || '#000'
	    }
	},
	mixins: [stateColor, util],
	componentDidMount: function () {
	    // init colorState, shuld put do initProps in stateClass
	    var data = this.getStateColor('data')
	    if(!data){
			this.setStateColor('data', {
				active: false,
				activeId: '',
				list:{}
			})
	    }
	},
	render: function() {
		var state = this.state
		var style1 = {background: state.color}
		return (  
			<div className="fkColorPk">
				<input className="fkColorPk__input" type="text" value={state.color} onChange={this.__handleColorInput} />
				<div className="fkColorPk__preview" style={style1} onClick={this.__handleColorPreview} />
			</div>
		)
	},
	__stateColorListener: function(){
		var data = this.getStateColor('data')
		if(data.activeId === this.state.colorId){
			var cData = data['list'][data['activeId']]
			this.state.color = cData.color
			this.setState(this.state)
		}
	},
	__handleColorInput: function(e){
		this.state.color = e.target.value
		this.setState(this.state)
		if(this.state.color.length === 4 || this.state.color.length === 7){
			this.props.changeCallback(this.state.color)
		}
	},
	__handleColorPreview: function(e){
		this.__stopPropagation(e)
		var data = this.getStateColor('data')
		var list = data.list
		if(list[this.state.colorId]){
			list[this.state.colorId]['color'] = this.state.color
		}else{
			let offset = e.target.getBoundingClientRect()
			list[this.state.colorId] = {color:this.state.color, x:offset.left, y:offset.top, cb:this.props.changeCallback}
		}
		data.active = !data.active
		data.activeId = this.state.colorId
		this.setStateColor('data', data)
	}
})

module.exports = UI

// 2. utils
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
