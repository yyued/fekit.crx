var _ = require('../bower_components/lodash/lodash')
var stateNotification = require('./utils/stateNotification')

var Notification = require('./ui/Notification')
var MyColorPickerPanel = require('./ui/MyColorPickerPanel')
var Formatter = require('./page/Formatter')
var Minifier = require('./page/Minifier')
var Base64Encoder = require('./page/Base64Encoder')
var QrcodeGenerator = require('./page/QrcodeGenerator')
var RegexpTester = require('./page/RegexpTester')
var UrlEncoder = require('./page/UrlEncoder')
var HtmlEscaper = require('./page/HtmlEscaper')
var JsEscaper = require('./page/JsEscaper')
var CssTransparent = require('./page/CssTransparent')
var CssTriangle = require('./page/CssTriangle')
var ColorPalette = require('./page/ColorPalette')


var Page = React.createClass({
	// getInitialState: function () {
	//     return {
	//         value:'111',
	//         value2: '11'
	//     }
	// },
	mixins: [stateNotification],
	render: function() {
		
		return (  
			<div className="Page">
				<Formatter url="formatter"/>
				<Minifier  url="minifier" />
				<Base64Encoder  url="base64-encoder" />
				<QrcodeGenerator  url="qrcode-generator" />
				<RegexpTester  url="regexp-tester" />
				<UrlEncoder  url="url-encoder" />
				<HtmlEscaper  url="html-escaper" />
				<JsEscaper  url="js-escaper" />
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












