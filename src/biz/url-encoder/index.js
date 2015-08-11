/**
 * Created by adi on 15-6-10.
 */

// module import
var $ = require('jquery')
var Mustache = require('mustache')
var multiline = require('multiline')


// common data
var $go = $('[name="go"]')
var $dropbox = $('#dropbox')
var $out = $('#out')
var $copy = $('#copy')

// 1. main
// @todo http://stackoverflow.com/questions/75980/best-practice-escape-or-encodeuri-encodeuricomponent
$dropbox.on('input', handleInput)
$go.on('change', handleInput)
$copy.on('click', handleCopy)

function handleInput(e){
    var src, dest, isEncode
    src = $dropbox.val()
    isEncode = $('[name="go"]:checked').val() === 'encode'? true:false
    if (isEncode) {
        dest = encodeURIComponent(src)
    }else{
        dest = decodeURIComponent(src)
    }
    processResult(dest)
}

function handleCopy(e){
    e.preventDefault()
    executeCopy($out.val())
    $dropbox.focus()
    parent.popbox.show('结果已复制')
}

// 2. partial
function processResult(targetCode){
    $out.val(targetCode)
}
function executeCopy(text) {
    var input = document.createElement('textarea')
    document.body.appendChild(input)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('Copy')
    input.remove()
}
