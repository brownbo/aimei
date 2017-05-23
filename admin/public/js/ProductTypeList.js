/**
 * Created by liangyi on 15-9-9.
 */
$(document).ready(function(){

    vieList("main");
    bindMenu();
    bindBanner();

});
var page=0;
var maincount=0;
var ProductType=AV.Object.extend("ProductType");
function vieList(tag){

    if(tag=="nextpage")
    {

        page++;


        if(page*10>=maincount)
        {
            page--;
            alert("这已经是最后一页了！");
        }
    }
    if(tag=="pastpage")
    {
        if(page>0)
        {
            page--;

        }
        else
        {
            alert("这已经是第一页了！");
        }
    }
    var query=new AV.Query(ProductType);
    if(tag=="main")
    {
        query.count({
            success:function(count){
                maincount=count;
            }
        });
    }
    query.limit(10);
    query.skip(10*page);
    query.include("parent");
    query.equalTo("enabled",true);
    query.descending("createdAt");
    query.find({
        success:function(object){
            var len=object.length;
           // alert(object.length);
            var html='<thead>'+
                '<tr>'+
                '<th>类别名称</th>'+
                '<th>类别ID</th>'+
                '<th>类别编号</th>'+
                '<th>级别</th>'+
                '<th>父类</th>'+
                '<th>是否可用</th>';

                 html+=   '<th>编辑</th>';


                html+=   '<th>删除</th>';

             html+=   '</tr>'+
                '</thead>';
            for(var i=0;i<len;i++)
            {
                var typeName=object[i].get("typeName")==null?'':object[i].get("typeName");
                var typeID=object[i].get("typeID")==null?'':object[i].get("typeID");
                var orderNumber=object[i].get("orderNumber")==null?'':object[i].get("orderNumber");
                var enabled=object[i].get("enabled")==null?'':object[i].get("enabled");
                var level=object[i].get("level")==null?'':object[i].get("level");
                var parentName=object[i].get("parent")==null?'':object[i].get("parent").get("typeName");
                enabled=enabled==true?"启用":"停用";
                html+='<tr>'+
                    '<td>'+typeName+'</td>'+
                    '<td>'+typeID+'</td>'+
                    '<td>'+orderNumber+'</td>'+
                    '<td>'+level+'</td>'+
                    '<td>'+parentName+'</td>'+
                    '<td>'+enabled+'</td>';

                    html+=  '<td><a href="../ProductType/ProductTypeAdd.html?id='+object[i].id+'">编辑</td>';


                    html+= '<td><a href="javascript:deleteType(\''+object[i].id+'\')">删除</td>';

                    html+='</tr>';
            //    alert(typeName);
            }
            $("#index").html(html);

        }
    });

}

function ChangeLevel(value){
    alert(value.value);

}

function deleteType(id){
    if(confirm("确定要删除吗？"))
    {
        var ProductType=AV.Object.extend("ProductType");
        var productType=new ProductType();
        productType.id=id;
        productType.set("enabled",false);
        productType.save({
            success:function(){
                window.location.reload();
            }
        });

    }

}