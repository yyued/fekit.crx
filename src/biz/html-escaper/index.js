/**
 * Created by adi on 15-6-10.
 */

// module import
var $ = require('jquery')
var Mustache = require('mustache')
var multiline = require('multiline')
var _ = require('lodash')

// common data
var $go = $('[name="go"]')
var $dropbox = $('#dropbox')
var $out = $('#out')
var $copy = $('#copy')

// 1. main
$dropbox.on('input', handleInput)
$go.on('change', handleInput)
$copy.on('click', handleCopy)

function handleCopy(e){
    e.preventDefault()
    executeCopy($out.val())
    parent.popbox.show('代码已复制')
}
function handleInput(e){
    var src, dest, isEscape
    src = $dropbox.val()
    isEscape = $('[name="go"]:checked').val() === 'escape'? true:false
    if (isEscape) {
        dest = _.escape(src)
    }else{
        dest = _.unescape(src)
    }
    processResult(dest)
}

// 2. partial

function processResult(targetCode){
    $out.val(targetCode)
}

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

// 3. utils

