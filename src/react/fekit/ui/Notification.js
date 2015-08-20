var stateNotification = require('../utils/stateNotification')

var Notification = React.createClass({
	getInitialState: function () {
		return {
			isActive: false,
			msg: ''
		}	
	},
	mixins: [stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPop = ('fkPop'+ (state.isActive?' -active':' ') )
		return (  
			<div className={classNameOfPop}>
				<div className="fkPop__txt">{state.msg}</div>
			</div>
		)
	},
	__stateNotificationListener: function(){
		var state = this.state
		state.isActive = true
		state.msg = this.getStateNotification('msg')
		this.setState(state)
		setTimeout(()=>{
			state.isActive = false
			this.setState(state)
		}.bind(this), 1000)
	}
})

module.exports = Notification












