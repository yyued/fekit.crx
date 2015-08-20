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
	    	name: this.props.defaultText || '默认文本',
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
			<div className="palette__item pcard ">
	            <div className="pcard__color" style={style1} onClick={this.__handleColorPreview}/>
	            <div className="pcard__main">
	                <input className="pcard__name" type="text" value={state.name} onChange={this.__handleTextChange}/>
	                <div className="pcard__hex">
	                    <input className="pcard__hexVal" type="text" value={state.color} onChange={this.__handleColorChange}/>
	                </div>
	            </div>
	            <div className="pcard__close" onClick={this.__handleRemove} >×</div>
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
	__handleTextChange: function(e){
		this.state.name = e.target.value
		this.setState(this.state)
		this.props.changeTextCB && this.props.changeTextCB(this.state.name)
	},
	__handleColorChange: function(e){
		this.state.color = e.target.value
		this.setState(this.state)
		if(this.state.color.length === 4 || this.state.color.length === 7){
			this.props.changeColorCB && this.props.changeColorCB(this.state.color)
		}
	},
	__handleColorPreview: function(e){
		this.__stopPropagation(e)
		var data = this.getStateColor('data')
		var offset = e.target.getBoundingClientRect()
		data['list'][this.state.colorId] = {color:this.state.color, x:offset.left, y:offset.top, cb:this.props.changeColorCB}
		data.active = !data.active
		data.activeId = this.state.colorId
		this.setStateColor('data', data)
	},
	__handleRemove: function(){
		this.props.removeCB && this.props.removeCB()
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
