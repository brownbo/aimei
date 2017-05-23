/**
 * Created by liangyi on 2016/3/29.
 */
$(document).ready(
    function(){
        //   testData();
        //    document.write('<script src="../public/js/leancloud.js"></script>');
        /*if(AV.User.current()==null){
            window.location.href='../index.html';
        }
        else {
            if($.inArray("130",roleArray)>=0){
                $('#orderSummary').css('display','none');
            }

        }*/
        bindMenu();
        bindBanner();

        $("form").filter('.navbar-right').find("input").remove();
        $("title").text("Ai美韩妆");

    }
);
function geturlArry(){
    var url = location.search.substr(1);
    var gethref=[];
    if(url.length > 0)
    {
        var  ar = url.split(/[&=]/);
        for(var i=0;i<ar.length;i++)
        {
            gethref.push(ar[i]);
            //alert("参数:"+ar[i]+":"+ar[i+1]+"<br>");
            // alert(ar[i+1]);
        }

    }
    return gethref;
}
function geturl(){
    var url = location.search.substr(1);
    var gethref;
    if(url.length > 0)
    {
        var  ar = url.split(/[&=]/);
        for(var i=0;i<ar.length;i+=2)
        {
            gethref=ar[i+1];
            //alert("参数:"+ar[i]+":"+ar[i+1]+"<br>");
            // alert(ar[i+1]);
        }

    }
    return gethref;
}

function getList(){

    var menu1=$("#menu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }
} /*获取下拉列表（产品）*/


function bindMenu(){
    var html='';

      /*  html+= '<li ><a  href="../BatchTable/index.html">批次管理</a></li>';*/


        html+=   '<li><a href="javascript:getList()">产品管理</a></li>'+
            '<div id="menu" style="display: none">'+
            '<ul class="nav nav-sidebar">';
          html+=        '<li class="manuli"><a href="../ProductType/ProductTypeList.html">产品类别管理</a></li>';


            html+=        '<li class="manuli"><a href="../Product/product.html">产品管理</a></li>';


          /*  html+=        '<li class="manuli"><a href="../ProductPrice/ProductPriceList.html">产品价格管理</a></li>';
*/
        html+='</ul>'+
            '</div>';

    // alert($.inArray("100",roleArray));

        html+= '<li><a href="javascript:getOrderMenu()">订单管理</a></li>'+
            '<div id="orderMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';

            html+= '<li class="manuli"><a  href="../order/orderList.html">订单查询</a></li>';


            html+= '<li id="orderSummary" class="manuli"><a  href="../order/statistics.html">订单统计</a></li>';

        html+=   '</ul>'+
           '</div>';


        html+= '<li><a href="javascript:getUserMenu()">用户管理</a></li>'+
            '<div id="UserMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';

        /*    html+=  '<li class="manuli"><a  href="../htdocs/index.html">商铺管理</a></li>';
*/

            html+=  '<li class="manuli"><a  href="../User/index.html">用户账户管理</a></li>';


          /*  html+=  '<li class="manuli"><a  href="../User/ShowUserJoinStore.html">店铺操作员管理</a></li>';


            html+=  '<li class="manuli"><a  href="../htdocs/ShowStoreGroup.html">店铺分组管理</a></li>';



            html+=  '<li class="manuli"><a  href="../htdocs/ShowSalesman.html">业务员管理</a></li>';
*/
        html+= '</ul>'+
            '</div>';


        /*html+=  '<li ><a  href="../SortingOrder/SortingOrderList.html">工单管理</a></li>';


        html+= '<li><a href="javascript:getDeliveryMenu()">物流管理</a></li>'+
            '<div id="DeliveryMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';

        html+='<li class="manuli"><a  href="../DeliveryRoute/DeliveryRouteList.html">物流路线</a></li>';


        html+= '<li class="manuli"><a  href="../DeliveryRoute/Delivery.html">物流人员</a></li>';

        html+= '</ul>'+
            '</div>';*/



    /*html+= '<li><a href="javascript:getPowerMenu()">权限管理</a></li>'+
            '<div id="PowerMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';

    html+='<li class="manuli"><a  href="../Power/role.html">角色管理</a></li>';


    html+= '<li class="manuli"><a  href="../Power/operator.html">操作员管理</a></li>';

    html+= '</ul>'+
            '</div>';*/

    /* html+='<ul class="nav nav-sidebar" style="margin-left: 0px">'+
     '<li><a href="javascript:testData()">设置enabled</a></li>'+
     '</ul>';*/

    $("ul").filter('.nav-sidebar').html(html);


}

function getUserMenu(){
    var menu1=$("#UserMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }
}

function getPowerMenu(){
    var menu1=$("#PowerMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }
}

function getOrderMenu(){

    var menu1=$("#orderMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }


}

function getNeedsMenu(){

    var menu1=$("#needsMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }


}

function getDeliveryMenu(){

    var menu1=$("#DeliveryMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }


}

function bindBanner(){
    var html='';
    html+='<li><a href="javascript:logout()">注销</a></li>';
    $("ul").filter('.navbar-right').html(html);
    // $("#banner").html(html);
}  /*绑定banner*/
/*session*/
(function($){

    $.session = {

        _id: null,

        _cookieCache: undefined,

        _init: function()
        {
            if (!window.name) {
                window.name = Math.random();
            }
            this._id = window.name;
            this._initCache();

            // See if we've changed protcols

            var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
            if (matches && document.location.protocol !== matches[1]) {
                this._clearSession();
                for (var key in this._cookieCache) {
                    try {
                        window.sessionStorage.setItem(key, this._cookieCache[key]);
                    } catch (e) {};
                }
            }

            document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();

        },

        _generatePrefix: function()
        {
            return '__session:' + this._id + ':';
        },

        _initCache: function()
        {
            var cookies = document.cookie.split(';');
            this._cookieCache = {};
            for (var i in cookies) {
                var kv = cookies[i].split('=');
                if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
                    this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
                }
            }
        },

        _setFallback: function(key, value, onceOnly)
        {
            var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
            if (onceOnly) {
                cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
            }
            document.cookie = cookie;
            this._cookieCache[key] = value;
            return this;
        },

        _getFallback: function(key)
        {
            if (!this._cookieCache) {
                this._initCache();
            }
            return this._cookieCache[key];
        },

        _clearFallback: function()
        {
            for (var i in this._cookieCache) {
                document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            this._cookieCache = {};
        },

        _deleteFallback: function(key)
        {
            document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            delete this._cookieCache[key];
        },

        get: function(key)
        {
            return window.sessionStorage.getItem(key) || this._getFallback(key);
        },

        set: function(key, value, onceOnly)
        {
            try {
                window.sessionStorage.setItem(key, value);
            } catch (e) {}
            this._setFallback(key, value, onceOnly || false);
            return this;
        },

        'delete': function(key){
            return this.remove(key);
        },

        remove: function(key)
        {
            try {
                window.sessionStorage.removeItem(key);
            } catch (e) {};
            this._deleteFallback(key);
            return this;
        },

        _clearSession: function()
        {
            try {
                window.sessionStorage.clear();
            } catch (e) {
                for (var i in window.sessionStorage) {
                    window.sessionStorage.removeItem(i);
                }
            }
        },

        clear: function()
        {
            this._clearSession();
            this._clearFallback();
            return this;
        }

    };

    $.session._init();

})(jQuery);
/*session*/