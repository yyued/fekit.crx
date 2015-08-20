var _ = require('./bower_components/lodash/lodash')
var menuJSON = require('./fekit/menuJSON')
var qr = require('./node_modules/qr-image')

// 1. main
var Page = React.createClass({
	getInitialState: function () {
	    return {
	    	menu: pickItems(menuJSON, 3),
	        inputText: this.props.url,
	        inputColor: '#000',
	        inputSize: 250,
	        output: 'http://art.yypm.com/100x100'
	    }
	},
	render: function() {
		var state = this.state
		var base64 = generatorQrcode(state.inputText)
		state.output = `data:png;base64,${base64}`

		var $menuItems = _.map(state.menu, (v, k)=>{
			return <div className="Box__item" onClick={this.__handleJumpPage.bind(this, k)}>{v}</div>
		}.bind(this))
		return (  
			<div>
				<div className="Box__output">
		        	<img src={state.output} width={state.inputSize} alt="" />
			    </div>        
			    <div className="Box__input">
			        <div className="fmSection">
			            <input ref="inputText" type="text" value={state.inputText} onChange={this.__handleChangeTxt}></input>
			        </div>
			        <div className="fmSection">
			            <div className="fmGroup">
			                <input ref="inputSize" type="range" min="100" max="300" step="10" value={state.inputSize} onChange={this.__handleChangeSize}/>
			            </div>
			            <div className="fmGroup">
			                <div className="fkPreviewColor hidden"></div>
			            </div>
			            <div className="fmGroup">
			                <a href={state.output} download="qrcode.png" className="fkBtn">下载</a>
			            </div>
			        </div>
			    </div>
			    <div className="Box__buttom">
			        {$menuItems}
			        <div className="Box__item" onClick={this.__handleJumpPage.bind(this, 'formatter')}>更多功能&raquo;</div>
			        <div className="Box__item" onClick={this.__handleJumpLink.bind(this, 'https://github.com/duowan/fekit.crx/issues')}>意见反馈&raquo;</div>
			    </div>
			</div> 
		)
	},
	__handleChangeTxt: function(){
		var el = React.findDOMNode(this.refs.inputText)
		this.state.inputText = el.value
		this.setState(this.state)
	},
	__handleChangeSize: function(){
		var el = React.findDOMNode(this.refs.inputSize)
		this.state.inputSize = el.value
		this.setState(this.state)
	},
	__handleJumpPage: function(route){
		// console.log(route)
		// 1. createOrFocus the-target-tab
		// 2. rendMessage to the-target-tab
		chrome.tabs.query({currentWindow: true, title:'前端工具盒子', url: 'chrome-extension://*/*'}, function(tabs){
			var lastTab
			if(tabs.length>0){
				lastTab = tabs[tabs.length-1]
				chrome.tabs.update(lastTab.id, {active: true, selected: true}, function(tab){
					chrome.tabs.sendMessage(tab.id, {route: route})
				})
			}else{
				chrome.tabs.create({url: './fekit.html'}, function(tab){
					chrome.tabs.sendMessage(tab.id, {route: route})
				})
			}
			window.close()
		})
	},
	__handleJumpLink: function(link){
		chrome.tabs.create({url: link})
		window.close()
	}
})

// 1. main::entry
getTabUrl(function(url){
	React.render( <Page url={url}/>, document.getElementById('root') )	
})


// 2. utils
function getTabUrl(cb){
	if(!chrome.tabs){
		cb('http://duowan.com')
		return
	}
	chrome.tabs.getSelected(null, function(tab) {
		cb(tab.url)
    })  
}

function generatorQrcode(text){
    var options = {
    	size: 8,
        ec_level: 'H',
        type: 'png'
    }
    var buffer = qr.imageSync(text, options)
    return buffer.toString('base64')
}

function pickItems(obj, len){
	var newObj = {}, count = 0
	_.each(obj, (v,k)=>{
		if(count < len){
			newObj[k] = v
		}
		count++
	})
	return newObj
}

