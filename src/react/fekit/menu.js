var stateMenu = require('./utils/stateMenu')
var menuJSON = require('./menuJSON.js')

var Menu = React.createClass({
	getInitialState: function () { 
	    return {
	        menu: menuJSON,
	        active: 'formatter'
	    }
	},
	componentWillMount: function () {	      
		var ENV_RELEASE = !!chrome.tabs
		if (ENV_RELEASE) {
			chrome.runtime.onMessage.addListener(function(req, sender, resp){
				var url = req.route
				window.__defaultURL = url
				this.state.active = url
				this.setState(this.state)
				this.setStateMenu('active', url)
			}.bind(this))
		}
	},
	componentDidMount: function () {
		this.setStateMenu('active', this.state.active)
	},
	mixins: [stateMenu],
	render: function() {
		var state = this.state
		var $items = _.map(state.menu, (v,k)=>{
			var menuItemClassname = (state.active == k? "Menu__item -active":"Menu__item")
			return (
				<div className={menuItemClassname} key={k} onClick={this.__handleClick.bind(this, k)}> {v} </div>
			)
		}.bind(this))
		return (  
			<div className="Menu">
				{$items}
			</div>
		)
	},
	__handleClick: function(key){
		this.state.active = key
		this.setState(this.state)
		this.setStateMenu('active', key)
	}
})

module.exports = Menu












