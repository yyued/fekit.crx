// lib
var $ = require('jquery')
var Mustache = require('mustache')
var multiline = require('multiline')
var qr = require('qr-image')

// common data
var $dropbox = $('#dropbox')
var $out = $('#out')
var $go = $('#go')
var $copy = $('#copy')

// Main Code

$(function(){
    // ... event
    $go.on('click', generator)
    $('body')[0].addEventListener('DOMSubtreeModified', function (e) {
        parent.__resetLayout()
    }, false)
        
    // ... default exec
    chrome.tabs.getSelected(null, function(tab) {
        $dropbox.val(tab.url)
        $go.trigger('click')
    })
})


// helper
function generator(e){
    e.preventDefault()
    var text = $dropbox.val()
    var options = {
        ec_level: 'H',
        type: 'png'
    }
    var buffer = qr.imageSync(text, options)

    var tpl = multiline(function(){/*!@preserve
     data:{{mime}};base64,{{code}}
     */console.log});
    var base64 = Mustache.render(tpl, {mime:'image/'+options.type, code:buffer.toString('base64')})
    //base64.replace(/&#x2f;/ig, '/')

    previewFile($out, base64)
}

function previewFile($el, code){
    $el.html('<img src="'+code+'">')
}








