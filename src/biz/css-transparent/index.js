// lib
var $ = require('jquery')
var _ = require('lodash')
var Mustache = require('mustache')
var multiline = require('multiline')

// global var 
var $opacity = $('[name="opacity"]')
var $opacityView = $('[name="opacityView"]')
var $form = $('form')
var $result = $('#out')
var $copy = $('#copy')
var $color = $('#color')
var $selector = $('#selector')

// Main Code
// ... pageOnload
$(function(){
    exec()
})

// ... bindEvent
$opacity.on('change', function(e){
    $opacityView.val($opacity.val())
    exec()
})
$opacityView.on('input', function(e){
    $opacity.val($opacityView.val())
    exec()
})
$selector.on('input', handleInput)
$color.on('input', handleInput)
$color.on('change', handleInput)
$copy.on('click', handleCopy)


// helper
function handleInput(e){
    exec()
}

function handleCopy(e){
    e.preventDefault()
    executeCopy($result.val())
    parent.popbox.show('代码已复制')
}

function exec(){
    var data = getFormData($form)
    data.colorRGBA = hexToRgba(data.color, data.opacity).toString()
    data.colorHEXIE = hexToHexie(data.color, data.opacity)
    var tpl = multiline(function(){/*!@preserve
    {{selector}}{
        background-color: transparent;
        background-color: {{colorRGBA}};
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr={{colorHEXIE}},endColorstr={{colorHEXIE}});
    }
    :root {{selector}}{
        filter: none\9;   
    }
    */console.log})
   var result =  Mustache.render(tpl, data)
   
   $result.val(result)
}

/**
 * 表单数据toJSONObject
 */
function getFormData($form){
    var array = $form.serializeArray()
    var obj = {}
    $.map(array, function(item){
        if (!item['name']) {return};
        obj[item['name']] = item['value']
    })
    return obj
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        toString: function(){
            return rgb(this.r, this.g, this.b);
        }
    } : null;
}
function hexToRgba(hex, alpha){
    var obj = hexToRgb(hex)
    if(!obj) return;
    obj.a = alpha
    obj.toString = function(){
        return rgba(this.r, this.g, this.b, this.a);
    }
    return obj
}

function rgb(r,g,b) {
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function rgba(r,g,b,a) {
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

// hexIE('#aaa', .5) --> '#7fAAAAAA'
function hexToHexie(hex, alpha){
    hex = (hex.indexOf('#') == -1? '#'+hex: hex )
    var alphaHex = ConvertBase.dec2hex(alpha*255)
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return '#'+r + r + g + g + b + b;
    })
    return hex.replace('#', '#'+alphaHex).toUpperCase()
}

// https://gist.github.com/faisalman/4213592
(function(){
 
    var ConvertBase = function (num) {
        return {
            from : function (baseFrom) {
                return {
                    to : function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    };
        
    // binary to decimal
    ConvertBase.bin2dec = function (num) {
        return ConvertBase(num).from(2).to(10)
    }
    
    // binary to hexadecimal
    ConvertBase.bin2hex = function (num) {
        return ConvertBase(num).from(2).to(16)
    }
    
    // decimal to binary
    ConvertBase.dec2bin = function (num) {
        return ConvertBase(num).from(10).to(2)
    }
    
    // decimal to hexadecimal
    ConvertBase.dec2hex = function (num) {
        return ConvertBase(num).from(10).to(16)
    }
    
    // hexadecimal to binary
    ConvertBase.hex2bin = function (num) {
        return ConvertBase(num).from(16).to(2)
    }
    
    // hexadecimal to decimal
    ConvertBase.hex2dec = function (num) {
        return ConvertBase(num).from(16).to(10)
    }
    
    this.ConvertBase = ConvertBase
    
})(this)

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
