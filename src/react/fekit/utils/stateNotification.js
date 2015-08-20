var _ = require('../../bower_components/lodash/lodash')
var EV = require('./commonEvent')
var blackFunction  = function(){}

var NAME_SPACE = 'stateNotification'

module.exports = {
	componentWillMount: function(){
		EV.addChangeListener(NAME_SPACE, this.__stateNotificationListener || blackFunction)
	},
	componentWillUnmount: function(){
		EV.removeChangeListener(NAME_SPACE, this.__stateNotificationListener||blackFunction)
	},
	setStateNotification: function(name, value){
		EV.set(NAME_SPACE, name, value)
	},
	getStateNotification: function(name){
		return EV.get(NAME_SPACE, name)
	}
}
