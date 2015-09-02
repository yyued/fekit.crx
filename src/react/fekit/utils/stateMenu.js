var _ = require('../../bower_components/lodash/lodash')
var EV = require('./commonEvent')
var blackFunction  = function(){}

var NAME_SPACE = 'stateMenu'

module.exports = {
	componentWillMount: function(){
		EV.addChangeListener(NAME_SPACE, this.__stateMenuListener || blackFunction)
	},
	componentWillUnmount: function(){
		EV.removeChangeListener(NAME_SPACE, this.__stateMenuListener||blackFunction)
	},
	setStateMenu: function(name, value){
		EV.set(NAME_SPACE, name, value)
	},
	getStateMenu: function(name){
		return EV.get(NAME_SPACE, name)
	}
}
