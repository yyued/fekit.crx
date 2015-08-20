module.exports = {
	__stopPropagation: function(e){
	    e.stopPropagation()
	    e.nativeEvent.stopImmediatePropagation()
	}
}