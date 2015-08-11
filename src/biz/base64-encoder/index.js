var $ = require('jquery')
var Mustache = require('mustache')
var multiline = require('multiline')

// common data
var $dropbox = $('#dropbox')
var $preview = $('#dropbox')
var $out = $('#out')
var $copyBase64 = $('#copyBase64')
var $copy = $('#copy')

// 1. main
dragAndBrowser($dropbox, handleFiles)
$copy.on('click', handleCopy)
$copyBase64.on('click', handleCopyBase64)

// 2. partial

function handleFiles(files) {

    for (var i = 0; i < files.length; i++) {
        // ignore files which not the first one
        if (i>0) {return}

        // ignore files which not a image
        var file = files[i];
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            continue;
        }

        // convert preview print and notice
        readFileAsbase64(file, function(base64){
            previewFile($preview, base64)
            $out.text(generatorCSSImg(base64))
        })
    }
}

function handleCopy(e){
    e.preventDefault()
    executeCopy($out.val())
    parent.popbox.show('结果已复制')
}
function handleCopyBase64(e){
    e.preventDefault()
    executeCopy(cssImg2base64($out.val()))
    parent.popbox.show('结果已复制')
}

function readFileAsbase64(file, cb){
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(e){
        cb(e.target.result)
    }
}

function previewFile($el, code){
    $el.html('<img src="'+code+'">')
}

function generatorCSSImg(code){
    return 'background-image:url("'+code+'")'
}
function cssImg2base64(cssString){
    var tag = 'background-image:url("'
    var start = cssString.indexOf(tag)+tag.length
    var stop = cssString.length -1
    return cssString.substring(start, stop)
}

// 3. utils

function isElement(el){
    if (el.length) {
        return !!el.length
    }
    return !!el
}

function dragAndBrowser(el, handleFiles){
    var $el = $(el)
    var $file = $('<input type="file" style="display: none" accept="image/*" />')
    $file.insertAfter($el)

    $el.on('dblclick', function(e){
        $file.trigger('click')
        e.preventDefault()
    })
    $file.on('change', function (e) {
        handleFiles(this.files)
    })

    $el.on('dragenter', dragenter)
    $el.on('dragover', dragover)
    $el.on('drop', drop)

    function dragenter(e) {
        e.stopPropagation()
        e.preventDefault()
    }
    function dragover(e) {
        e.stopPropagation()
        e.preventDefault()
    }
    function drop(e) {
        e.stopPropagation()
        e.preventDefault()

        var files = e.originalEvent.dataTransfer.files
        handleFiles(files)
    }
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