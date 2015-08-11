
// lib
var $ = require('jquery')
var _ = require('lodash')
var Mustache = require('mustache')
var multiline = require('multiline')

// Main Code
var $el = $('.palette')
init()
$el.on('input', '.pcard__hexVal', handleHexInput)
    
// helper
function handleHexInput(e, obj){
    var $this = $(this)
    var $pcard = $this.parents('.pcard')
    var hex = $this.val()
    var regHEX = /^#?[a-f\d]{3}([a-f\d]{3})?$/i
    if (regHEX.test(hex)) {
        if($pcard.data('myPicker')){
            $pcard.data('myPicker').fromString(hex)
        }else{
            $pcard.find('.pcard__color')[0].color.fromString(hex)
        }
    }
}

$el.on('change', '.pcard__color', function(e){
    var $this = $(this)
    $this.parents('.pcard').find('.pcard__hexVal').prop({
        value: $this.val()
    })
})

$el.on('mouseenter', '.pcard', function(e){
    $(this).addClass('pcard--on')
})

$el.on('mouseleave', '.pcard', function(e){
    $(this).removeClass('pcard--on')
})

$el.on('click', '.pcard__close', function(e){
    $(this).parents('.pcard').remove()
})

$el.on('click', '#addOne', function(e){
    var tpl, data, $root, id = String(+new Date)
    $root = $('.palette__bd')
    data = [
        {name: '描述标注', hex: '666', id: id}
    ]
    tpl = multiline(function(){/*!@preserve
    {{#.}}
    <li class="palette__item pcard pcard--{{id}}">
        <input class="pcard__color color {valueElement:'{{id}}'}" value="{{hex}}" type="text" readonly>
        <div class="pcard__main">
            <input class="pcard__name" type="text" value="{{name}}">
            <div class="pcard__hex">
                <span class="pcard__hexSign">#</span>
                <input class="pcard__hexVal" id="{{id}}" type="text" value="{{hex}}">
            </div>
        </div>
        <div class="pcard__close">×</div>
    </li>
    {{/.}}
    */console.log})
   dom = Mustache.render(tpl, data)
   $root.append(dom)

   var $pcard = $('.pcard--'+id)
   var myPicker = new jscolor.color($pcard.find('input')[0], {})
   $pcard.data('myPicker', myPicker)
   parent.__resetLayout()
})


function init(){
    var tpl, data, $root
    $root = $('.form-wrap')
    data = [
        {name: '默认文本', hex: '666'},
        {name: '注释文本', hex: '999'},
        {name: '默认链接', hex: '666'},
        {name: 'hover链接', hex: 'ec185b'},
        {name: '高亮颜色', hex: 'ec185b'}
    ]
    tpl = multiline(function(){/*!@preserve
    <ul class="palette__bd">
        {{#.}}
        <li class="palette__item pcard ">
            <input class="pcard__color color " value="{{hex}}" type="text" readonly>
            <div class="pcard__main">
                <input class="pcard__name" type="text" value="{{name}}">
                <div class="pcard__hex">
                    <span class="pcard__hexSign">#</span>
                    <input class="pcard__hexVal" type="text" value="{{hex}}">
                </div>
            </div>
            <div class="pcard__close">×</div>
        </li>
        {{/.}}
    </ul>
    */console.log})
   $root.append(Mustache.render(tpl, data))
}

