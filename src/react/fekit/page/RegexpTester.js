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
	        inputText: '',
	        inputRExp: '',
	        inputArgI: true,
	        inputArgM: false,
	        output: '',
	        show: false
	    }
	},
	mixins: [stateMenu, stateNotification],
	render: function() {
		var state = this.state
		var classNameOfPage = (state.show?"":" remove")
		state.output = getOutput(state.inputText, state.inputRExp, state.inputArgI, state.inputArgM)
		function getOutputHTML(){return {__html: state.output}}
		return (  
			<div className={classNameOfPage}>
			<div className="Page__input">
				<div className="fmSection">
					<textarea cols="50" rows="5" ref="inputText" onChange={this.__handleChangeInputInputText}></textarea>
				</div>
				<div className="fmSection">
					<div className="fmGroup fmGroup--hasHor">
						<div className="fmGroup__title">输入正则表达式</div>
						<input className="fmGroup__item" type="text" placeholder="" ref="inputRExp" onChange={this.__handleChangeInputRExp}/>
					</div>
					<div className="fmGroup fmGroup--hasHor">
						<label className="fmGroup__item">
				            <input type="checkbox" name="args" checked={state.inputArgI?'true':''} ref="inputArgI" onChange={this.__handleChangeArgI} >i</input>
				        </label>
					</div>
					<div className="fmGroup fmGroup--hasHor">
						<label className="fmGroup__item">
				            <input type="checkbox" name="args" checked={state.inputArgM?'true':''} ref="inputArgM" onChange={this.__handleChangeArgM} >m</input>
				        </label>
					</div>
				</div>
			</div>
			<div className="Page__output">
				<div contentEditable dangerouslySetInnerHTML={getOutputHTML()}></div>
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
	__handleChangeInputInputText: function(e){
		this.state['inputText'] = React.findDOMNode(this.refs['inputText']).value
		this.setState(this.state)
	},
	__handleChangeInputRExp: function(e){
		this.state['inputRExp'] = React.findDOMNode(this.refs['inputRExp']).value
		this.setState(this.state)
	},
	__handleChangeArgI: function(e){
		this.state['inputArgI'] = React.findDOMNode(this.refs['inputArgI']).checked
		this.setState(this.state)
	},
	__handleChangeArgM: function(){
		this.state['inputArgM'] = React.findDOMNode(this.refs['inputArgM']).checked
		this.setState(this.state)
	}
})

module.exports = Page

function getOutput(inputText, inputRExp, inputArgI, inputArgM){
	try{
        var regexp = createRegExpression(inputRExp, inputArgI, inputArgM)
        var matchData = [], i = 0, match;
        if(!inputText || !inputRExp){
            return 'not match anything!'
        }
        // http://stackoverflow.com/questions/1761051/difference-between-n-and-r
        inputText = inputText.replace(/\r/gm,'')
        while (match=regexp.exec(inputText)) {
            matchData[i] = [regexp.lastIndex-match[0].length, regexp.lastIndex]
            i++
        }
        return format(inputText, matchData)
        
    }catch(e){
        return 'not match anything!'
    }
}

/**
 * 生成正则表达式
 */
function createRegExpression(inputRExp, inputArgI, inputArgM){
	var args = `${inputArgI === true?'i':''}${inputArgM === true?'m':''}g`
	return new RegExp(inputRExp, args)
}


/**
 * 通过匹配数据，得到格式化html
 */
function format(inputText, matchData) {
    if ( matchData.length<1 ) {
    	return 'not match anything!'
    }
    var indexMatchFirst = matchData[0][0]
    var indexMatchLast = matchData[matchData.length-1][1]
    var dest = transUnMatch( inputText.substring(0,indexMatchFirst) )
    matchData.forEach(function (item, index) {
        dest += transMatch( inputText.substring(item[0], item[1]) )
        if ( matchData[index+1] ) {
            dest += transUnMatch( inputText.substring(matchData[index][1], matchData[index+1][0]) )
        }
    })
    dest += transUnMatch( inputText.substring(indexMatchLast, inputText.length) )
    return dest.replace(/\r?\n|\r/g, '<br>')

    function transMatch(d) {
        return '<b>'+ _.escape(d) +'</b>'
    }
    function transUnMatch(d){
        return _.escape(d)
    }
}


