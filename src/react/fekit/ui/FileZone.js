// var _ = require('../../../bower_components/lodash/lodash')
// var _ = require('../../../bower_components/lodash/lodash')

/**
 * 本地文件夹控件
 * 支持：拖拽、浏览
 * prop属性：callback(File)，回调逻辑，该逻辑传入控件拖拽、浏览事件里
 */
var FileZone = React.createClass({
	getInitialState: function () {
		return {
			isActive: false,
			filename: '点击浏览或拖拽文件'
		}
	},
	render: function() {
		var classNameOfZone = (this.state.isActive?'fmFile -active':'fmFile')
		var styleOfFile = {
			display: 'none'
		}
		return (  
			<div className={classNameOfZone} onClick={this.__handleClick} onDragOver={this.__handleDragOver} onDrop={this.__handleDrop} onDragLeave={this.__handleDragLeave}>
				<div className="fmFile__name">{this.state.filename}</div>
				<input ref="fileInput" onChange={this.__handleChange} type="file" accept="*/*" style={styleOfFile} />
			</div>
		)
	},
	__handleClick: function(){
		var fileInput = React.findDOMNode(this.refs.fileInput)
		fileInput.value = null
		fileInput.click()
	},
	__handleChange: function(e){
		var file = e.target.files[0]
		this.state.filename = file.name
		this.setState(this.state)
		this.props.callback(file, e)
	},
	__handleDrop: function(e){
		e.preventDefault()
		var file = e.dataTransfer.files[0]
		this.props.callback(file, e)

		this.state.isActive = false
		this.setState(this.state)

	},
	__handleDragOver: function(e){
		e.preventDefault()
    	e.stopPropagation()

		this.state.isActive = true
		this.setState(this.state)
	},
	__handleDragLeave: function(e){
		this.state.isActive = false
		this.setState(this.state)
	}
})

module.exports = FileZone












