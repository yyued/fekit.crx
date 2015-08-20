var _ = require('../../bower_components/lodash/lodash')
var EV = require('./commonEvent')
var blackFunction  = function(){}

var NAME_SPACE = 'stateColor'

/**
 *
 * data: {
 * 	 active: false,
 *	 activeId: '0',
 *	 list:{
 *	 		'0': {
 *	 			x: 0,
 *	 			y: 0,
 *	 			color: '#000'
 *	 		}
 *    }
 * }
 */

module.exports = {
	componentWillMount: function(){
		EV.addChangeListener(NAME_SPACE, this.__stateColorListener || blackFunction)
	},
	componentWillUnmount: function(){
		EV.removeChangeListener(NAME_SPACE, this.__stateColorListener||blackFunction)
	},
	setStateColor: function(name, value){
		EV.set(NAME_SPACE, name, value)
	},
	getStateColor: function(name){
		return EV.get(NAME_SPACE, name)
	}
} 