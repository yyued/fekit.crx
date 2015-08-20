// 0.lib
var _ = require('../../bower_components/lodash/lodash')
var Colr = require('../../node_modules/react-colorpicker/node_modules/colr')

// 0.ui
var Notification = require('../ui/Notification')
var MyColorPicker = require('../ui/MyColorPicker')
var MyColorPicker2 = require('../ui/MyColorPicker2')

// 0.corss-state
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

// 1. main code
var Page = React.createClass({
	getInitialState: function () {
	    return {
	        title: '项目标题...',
	        cards: [{
	        	show: true,
	        	name: '默认文本',
	        	color: '#666'
	        },{
	        	show: true,
	        	name: '高亮文本',
	        	color: '#ec185b'
	        },{
	        	show: true,
	        	name: '默认链接',
	        	color: '#999'
	        },{
	        	show: true,
	        	name: 'hover链接',
	        	color: '#ec185b'
	        }],
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPage = ` ${state.show?'':'remove'}`
		
		var $items = state.cards.map((v,k)=>{
			var styleOfItem = {display: `${v.show?'block':'none'}`, float: 'left' }
			return (
				<div style={styleOfItem}>
					<MyColorPicker2  key={k} defaultText={v.name} defaultColor={v.color} removeCB={this.__removeCB.bind(this,k)} changeTextCB={this.__changeTextCB} changeColorCB={this.__changeColorCB}/>
				</div>
			)
		})
		return (  
			<div className={classNameOfPage} onClick={this.__handlePage}>
		    <div className="Page__input palette">
				<div className="palette__hd">
			        <input className="palette__title" type="text" value={state.title} onChange={this.__handleChangeTitle}/>
			        <div className="palette__btn fkBtn" onClick={this.__handleAppendItem} >添加标注</div>
			    </div>
		    	<div className="palette__bd">
			        {$items}
			    </div>
		    </div>
			</div>
		)
	},
	__stateMenuListener: function(){
		var state = this.state
		if(this.getStateMenu('active') === this.props.url){
			state.show = true
		}else{
			state.show = false
		}
		this.setState(state)
	},
	__removeCB: function(index){
		// render not as expected! maybe state not in current component
		// _.remove(this.state.cards, (v,k)=>{
		// 	return k == index
		// })
		this.state.cards[index].show = false
		this.setState(this.state)
	},
	__changeColorCB: function(newColor){
		// this.state.inputColor = newColor
		// this.setState(this.state)
	},
	__changeTextCB: function(newText){
		// this.state.inputColor = newText
		// this.setState(this.state)
	},
	__handleChangeTitle: function(e){
		this.state.title = e.target.value
		this.setState(this.state)
	},
	__handleAppendItem: function(e){
		this.state.cards.push({show: true, name: '默认文本', color: '#666'})
		this.setState(this.state)
	}
})

module.exports = Page

// 2. utils

