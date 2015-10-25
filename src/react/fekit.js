require('../sass/global.scss') 

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

