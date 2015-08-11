// lib
var $ = window.$

// common data
var $copy = $('#copy')
var $out = $('#caret-output')


// 1. main
$(function(){
    ll.caret.App.start()
})
$copy.on('click', handleCopy)

function handleCopy(e){
	e.preventDefault()
	executeCopy($out.html())
	parent.popbox.show('代码已复制')
}

function executeCopy(text) {
    var input = document.createElement('textarea')
    var ref = document.getElementsByTagName('h1')[0]
    document.body.insertBefore(input, ref)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('Copy')
    input.remove()
}


