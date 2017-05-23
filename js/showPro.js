/**
 * Created by liangyi on 2016/3/29.
 */
var ProductType=AV.Object.extend("ProductType")
var Product=AV.Object.extend("Product");

$(document).ready(function(){
    //alert(3);
    var url=geturl();
  //  alert(url);
    getUserInfo();
    findType(url);
    bindDirection(url);
    bindMainInfo(url);
    //bindMainInfo

});
function bindDirection(id){
    var query=new AV.Query(ProductType);
    query.equalTo("objectId",id);
    query.include('parent');
    query.find({
        success:function(object){
         //   alert(object.length);
            var Name=object[0].get('typeName')==null?'':object[0].get('typeName');
             var parentName=object[0].get('parent')==null?'':object[0].get('parent').get('typeName');
           //  alert(Name+parentName);
            $('#direction').html(Name);
        }
    })
}
function findType(id){
    var query=new AV.Query(ProductType);
    query.equalTo('objectId',id);
    query.include('parent');
    query.find({
        success:function(object){
            if(object[0].get('parent')!=null)
            {
                bindMenu(object[0].get('parent').get('orderNumber'));
            }
       //     alert(object[0].get('parent').get('orderNumber'));

        }
    });
}

function bindMainInfo(id,tag){
    var query=new AV.Query(Product);
    var proObj=new Product;
    proObj.id=id;
    query.descending('createdAt');
    query.equalTo('enabled',true);
    query.include('parent');
    query.equalTo('productType',proObj);
    query.find({
        success:function(object){
           //   alert(object.length);
            var len=object.length;
            if(len>0)
            {
                document.getElementById('noGoods').style.display="none";
            }
            /*var Name=object[0].get('typeName')==null?'':object[0].get('typeName');
            var parentName=object[0].get('parent')==null?'':object[0].get('parent').get('typeName');
            alert(Name+parentName);*/
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

                $("#content").append(html);
            }
        }
    });
}

