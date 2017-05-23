/**
 * Created by liangyi on 2016/3/29.
 */
var ProductType=AV.Object.extend('ProductType');
var Product=AV.Object.extend('Product');
$(document).ready(function(){
    //alert(3);
    bindMenu();
    bindMainInfo();
    getUserInfo();

});
function bindMainInfo(tag){    //绑定数据
    var query=new AV.Query(Product);
    query.descending('createdAt');
    query.equalTo('enabled',true);
    query.find({
        success:function(object){
          //  alert(object.length);
            var len=object.length;

            for(var i=0;i<len;i++)
            {
                var html='';
            //    alert(1);
                var name=object[i].get('productName')==null?'':object[i].get('productName');
                var price=object[i].get('unitPrice')==null?'':object[i].get('unitPrice');
                var unitString=object[i].get('unitString')==null?'':object[i].get('unitString');
                var img=object[i].get('productImg')==null?'':object[i].get('productImg').url();
                var ProductDescription=object[i].get('ProductDescription')==null?'':object[i].get('ProductDescription');
                html+='<div style="margin-bottom: 40px" class="four columns team">'+
                    '<a href="productDetail.html?id='+object[i].id+'"><img style="width:100%;height:300px;" src="'+img+'" alt="member" /></a>'+
                    '<div><h3>'+name+'</h3><div class="email">'+price+'元/'+unitString+'</div></div>'+
                    '<div style="height: 75px;width: 100%;">'+
                    '<p style="margin: 5px">'+ProductDescription+'</p>'+
                    '</div>'+
                    '<div style="position: relative;margin-top: 0">'+
                    '<a href="javascript:addToChart(\''+object[i].id+'\')"><div class="shopChart" style="color: #ffffff"><li style="list-style-type: none">加入购物车</li>'+
                    '</div></a><a  href="javascript:addToLikes(\''+object[i].id+'\')"><div class="collection"><li style="list-style-type: none">收藏</li></div></a></div></div>';
                //addToLikes
                $("#content").append(html);
            }
        }
    });
}



