// lib
var _ = require('../../bower_components/lodash/lodash')

// ui
var Notification = require('../ui/Notification')
var FileZone = require('../ui/FileZone')

// corss-state
var stateMenu = require('../utils/stateMenu')
var stateNotification = require('../utils/stateNotification')

// main code
var Page = React.createClass({
	getInitialState: function () {
	    return {
	        input:'https://placehold.it/150x150',
	        output: '',
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPage = (state.show?"":" remove")
		return (  
			<div className={classNameOfPage}>
			<div className="Page__input">
				<div className="fmSection">
					<div className="fmGroup">
						<FileZone callback={this.__handleFileZone} />
					</div>
					<div className="fmGroup">
						<div ref="copy" className="fkBtn" onClick={this.__handleCopy}>复制结果</div>
					</div>
				</div>
				<div className="fmSection">
					<div className="fmGroup">
						<img className="fmPreviewImg" src={state.input} />
					</div>
				</div>
			</div>
			<div className="Page__output">
				<textarea cols="30" rows="5" value={state.output}></textarea>
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
	__handleCopy: function(){
		executeCopy(this.state.output)
		this.setStateNotification('msg', '代码已复制')
	},
	__handleFileZone: function(file){
		readFileAsDataURL(file, (fileContent)=>{
			this.state.input = fileContent
			this.state.output = fileContent
			this.setState(this.state)
		}.bind(this))
		
		function readFileAsDataURL(file, cb){
		    var reader = new FileReader()
		    reader.readAsDataURL(file)
		    reader.onload = function(e){
		        cb(e.target.result)
		    }
		}
	}
})

module.exports = Page


// copy
function executeCopy(text) {
    var input = document.createElement('textarea')
    var ref = document.getElementsByTagName('div')[0]
    document.body.insertBefore(input, ref)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('Copy')
    input.remove()
}





