var _ = require('../../bower_components/lodash/lodash')
var EV = require('./commonEvent')
var blackFunction  = function(){}

var NAME_SPACE = 'statePage'

module.exports = {
	componentWillMount: function(){
		EV.addChangeListener(NAME_SPACE, this.__statePageListener || blackFunction)
	},
	componentWillUnmount: function(){
		EV.removeChangeListener(NAME_SPACE, this.__statePageListener||blackFunction)
	},
	setStatePage: function(name, value){
		EV.set(NAME_SPACE, name, value)
	},
	getStatePage: function(name){
		return EV.get(NAME_SPACE, name)
	}
}
