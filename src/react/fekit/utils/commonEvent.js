var _ = require('../../bower_components/lodash/lodash')
var EventEmitter = require('../../bower_components/eventEmitter/EventEmitter')

// window.EventEmitter = EventEmitter

var __prop = {}

var x = _.assign(EventEmitter.prototype, {
	get: function (ns, name) {
		var state = __prop[ns] = __prop[ns] || {}
		return name? state[name]: state
	},
	set: function(ns, name, value){
		var state = __prop[ns] = __prop[ns] || {}
		state[name] = value
		var arg = {}
		arg[name] = value
		this.emitChange(ns, arg)
	},
	emitChange: function(ns, arg){
		this.emit(ns, arg)
	},
	addChangeListener: function(ns, callback){
		this.on(ns, callback)
	},
	removeChangeListener: function(ns, callback){
		this.off(ns, callback)
	}
})

module.exports = x

