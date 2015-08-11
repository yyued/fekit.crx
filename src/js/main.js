void function () {
	var _ = require('lodash')
    var $ = require('jquery')
    var Mustache = require('mustache')
    var multiline = require('multiline')
    // var menuJSON = require('./js/menu.json')
	var menuJSON = window.menuData

    // Menu render
    renderMenu()
    function renderMenu(){
        var el, data, tpl
        el = $('.Nav')
        data = menuJSON
        tpl = multiline(function(){/*!@preserve
         {{#menu}}
         <div class="group">
             <div class="group__name">{{name}}</div>
             <div class="group__list">
                 {{#items}}
                 <div class="group__item {{#default}}-active{{/default}}" data-path="{{path}}">{{name}}</div>
                 {{/items}}
             </div>
         </div>
         {{/menu}}
         */console.log});
        el.html(Mustache.render(tpl, data))
    }

    // Menu events
    var $menu = $('.Nav'), $targetPage = $('#targetPage');
    $menu.on('click', '[data-path]', function(e){
        $menu.find('[data-path]').removeClass('-active')
        var p = $(this).addClass('-active').data('path')
        $targetPage.attr('src', calcPath(p))
    })
    $targetPage.attr('src', calcPath(getDefaultPage(menuJSON)))

    function calcPath(p){
        return 'biz/'+p+'/index.html'
    }
    function getDefaultPage(menuJSON){
        var arr = []
        _.each(menuJSON.menu, function (v) {
            arr = arr.concat(v.items)
        })
        return _.find(arr, {default:true}).path
    }

    // iframe_height_reset
    window.__resetLayout = function(){
        var el = $('#targetPage')[0]
        return function(){
            el.style.height =
            el.contentWindow.document.body.offsetHeight + 'px';
        }
    }()
    $('#targetPage').load(__resetLayout)


    // global::popbox
    function popbox(){
        this.__init()
    }
    popbox.prototype = {
        constructor: popbox,
        show: function(msg, isHolding){
            var self = this
            this.__el.find('.popbox__txt').html(msg)
            this.__el.addClass('-on')
            if(!isHolding){
                setTimeout(function(){
                    self.hide()
                }, 2000)
            }
        },
        hide: function(){
            this.__el.removeClass('-on')
        },
        __init: (function(){
            var result
            return function(){
                if (result) return result;
                result = this.__render()
                this.__el = result
            }
        })(),
        __el : null,
        __render: function(){
            var tpl, el;
            tpl  = function(){/*!@preserve
                <div id="popbox" class="popbox">
                    <div class="popbox__txt">done!</div>
                </div>   
            */
            console.log}.toString().split('\n').slice(1,-2).join('\n')
            $('body').append(tpl)
            return $('#popbox')
        }
    }
    window.popbox = new popbox

}()



// module popbox
// function popbox(){
//     this.__init()
// }
// popbox.prototype = {
//     constructor: popbox,
//     show: function(msg){
//         this.__el.find('.popbox__txt').html(msg)
//         this.__el.addClass('-on')
//     },
//     hide: function(){
//         this.__el.removeClass('-on')
//     }
//     __init: (function(){
//         var result
//         return function(){
//             if (result) return result;
//             result = __render()
//             this.__el = result
//         }
//     })(),
//     __el,
//     __render: function(){
//         var tpl, el;
//         tpl  = function(){/*!@preserve
//             <div id="popbox" class="popbox -on">
//                 <div class="popbox__txt">done!</div>
//             </div>   
//         */
//         console.log}.toString().split('\n').slice(1,-2).join('\n')
//         $(body).append(tpl)
//         return $('#popbox')
//     }
// }
// module.exports = new popbox


