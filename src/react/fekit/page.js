var _ = require('../bower_components/lodash/lodash')
var stateNotification = require('./utils/stateNotification')

var MyColorPickerPanel = require('./ui/MyColorPickerPanel')
var Notification = require('./ui/Notification')
var Formatter = require('./page/Formatter')
var Base64Encoder = require('./page/Base64Encoder')
var QrcodeGenerator = require('./page/QrcodeGenerator')
var RegexpTester = require('./page/RegexpTester')
var Encoder = require('./page/Encoder')
var CssTransparent = require('./page/CssTransparent')
var CssTriangle = require('./page/CssTriangle')
var ColorPalette = require('./page/ColorPalette')


var Page = React.createClass({
	mixins: [stateNotification],
	render: function() {
		
		return (  
			<div className="Page">
				<Formatter url="formatter"/>
				<Base64Encoder  url="base64-encoder" />
				<QrcodeGenerator  url="qrcode-generator" />
				<RegexpTester  url="regexp-tester" />
				<Encoder  url="encoder" />
				<CssTransparent  url="css-transparent" />
				<CssTriangle  url="css-triangle" />
				<ColorPalette  url="color-palette" />
				<Notification />
				<MyColorPickerPanel/>
			</div>
		)
	}
})

module.exports = Page











