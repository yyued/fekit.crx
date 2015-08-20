require('../sass/global.scss') 

// 0. lib
var _ = require('./bower_components/lodash/lodash')
var async = require('./bower_components/async/dist/async.min')

// 0. biz
var Menu = require('./fekit/menu')
var Page = require('./fekit/page') 

// 1. main
React.render(
	<div>
		<Menu />
		<Page />
	</div> 
  ,
  document.getElementById('root')
)

// React.render(<div></div>, document.getElementById('root'))
window._ = _

