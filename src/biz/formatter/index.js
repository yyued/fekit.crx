// lib
var $ = require('jquery')
var Mustache = require('mustache')
var multiline = require('multiline')
var beautify = require('js-beautify')

// common data
var $fileType = $('[name="fileType"]')
var $dropbox = $('#dropbox')
var $preview = $('#dropbox')
var $out = $('#out')
var $copy = $('#copy')

// 1. main
dragAndBrowser($dropbox, handleFiles)
$fileType.on('change', handleFileType)
$dropbox.on('input', handleInput)
$copy.on('click', handleCopy)

function handleCopy(e){
    e.preventDefault()
    executeCopy($out.val())
    parent.popbox.show('代码已复制')
}

function handleInput(e){
    var fileType, sourceCode, targetCode
    sourceCode = $dropbox.val()
    fileType = guessFileType(sourceCode)
    updateView($('[value="'+fileType+'"]'), {checked:true})

    targetCode = getBeautifyCode(sourceCode, fileType)
    processResult(targetCode)

    function updateView(el, props){
        el.prop(props)
    }
}

function handleFileType(e){
    var fileType, sourceCode, targetCode
    sourceCode = $dropbox.val()
    fileType = $(this).val()

    targetCode = getBeautifyCode(sourceCode, fileType)
    processResult(targetCode)
}

function handleFiles(files) {
    var file = files[0], sourceCode, targetCode
    updateView($('[value="'+file.type+'"]'), {checked:true})
    
    readFileAsText(file, function(code){
        previewFile($preview, code)
        targetCode = getBeautifyCode(code, file.type)
        processResult(targetCode)
    })

    function previewFile($el, code){
        $el.val(code)
    }
    function updateView(el, props){
        el.prop(props)
    }
    function readFileAsText(file, cb){
        var reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function(e){
            cb(e.target.result)
        }
    }
}

// 2. partial
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

function processResult(targetCode){
    $out.val(targetCode)
}

function guessFileType(source){
    var reg_html = /\<\w+\>(?!'|")/gm
    var reg_css = /\.\w[\w\d]*\{/gm
    //var reg_js = /function\s+\w[\w\d-_$]*\(/gm
    var fileType
    if(reg_html.test(source)){
        return fileType = 'text/html'
    }
    if(reg_css.test(source)){
        return fileType = 'text/css'
    }
    //if(reg_js.test(source)){
    return fileType = 'text/javascript'
    //}
}

function getBeautifyCode(sourceCode, fileType){
    var targetCode
    switch (fileType){
        case 'text/javascript': targetCode = doBeautifyJS(sourceCode); break;
        case 'text/css': targetCode = doBeautifyCSS(sourceCode); break;
        case 'text/html': targetCode = doBeautifyHTML(sourceCode); break;
    }
    return targetCode
}

function doBeautifyJS(source, isPath){
    //@see https://github.com/beautify-web/js-beautify
    if(isPath){source = fs.readFileSync(source, "utf8")}
    var options = {
        "indent_size": 4,
        "indent_char": " ",
        "eol": "\n",
        "indent_level": 0,
        "indent_with_tabs": false,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "jslint_happy": false,
        "space_after_anon_function": false,
        "brace_style": "collapse",
        "keep_array_indentation": false,
        "keep_function_indentation": false,
        "space_before_conditional": true,
        "break_chained_methods": false,
        "eval_code": false,
        "unescape_strings": false,
        "wrap_line_length": 0,
        "wrap_attributes": "auto",
        "wrap_attributes_indent_size": 4,
        "end_with_newline": true
    }
    var code = beautify.js(source, options)
    return code
}

function doBeautifyCSS(source, isPath){
    if(isPath){source = fs.readFileSync(source, "utf8")}
    var options = {
        "indent_size": 4
    }
    var code = beautify.css(source, options)
    return code
}

function doBeautifyHTML(source, isPath){
    if(isPath){source = fs.readFileSync(source, "utf8")}
    var options = {
        "indent_size": 4
    }
    var code = beautify.html(source, options)
    return code
}

// 3. utils

function dragAndBrowser(el, handleFiles){
    var $el = $(el)
    var $file = $('<input type="file" style="display: none"/>')
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