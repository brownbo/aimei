/**
 * Created by liangyi on 2016/4/8.
 */
var OrderTable=AV.Object.extend("OrderTable");

$(document).ready(function(){
    vieList('main');
});
var page=0;
var maincount=0;
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
    var query=new AV.Query(OrderTable);
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
    query.include("orderUser");
    query.equalTo("enabled",true);
    query.descending("createdAt");
    query.find({
        success:function(object){
            var len=object.length;
            // alert(object.length);
            var html='<thead>'+
                '<tr>'+


                '<th>订单用户</th>'+
                '<th>订单总价</th>'+
                '<th>送货地址</th>'+
                '<th>订单状态</th>'+
                '<th>订单时间</th>'
                ;

            html+=   '<th>编辑</th>';


            html+=   '<th>删除</th>';

            html+=   '</tr>'+
                '</thead>';
            for(var i=0;i<len;i++)
            {
                var orderAddress=object[i].get("orderAddress")==null?'':object[i].get("orderAddress");
                var orderUser=object[i].get("orderUser")==null?'':object[i].get("orderUser").get("username");
                var orderSumPrice=object[i].get("orderSumPrice")==null?'':object[i].get("orderSumPrice");
                var orderStatus=object[i].get("orderStatus")==null?'':object[i].get("orderStatus");
                var orderTime=object[i].createdAt==null?'':object[i].createdAt.toLocaleString();
              //  alert(object[i].createdAt);
             //   var parentName=object[i].get("parent")==null?'':object[i].get("parent").get("typeName");
             //   enabled=enabled==true?"启用":"停用";
                html+='<tr>'+

                    '<td>'+orderUser+'</td>'+
                    '<td>'+orderSumPrice+'</td>'+
                    '<td>'+orderAddress+'</td>'+
                    '<td>'+orderStatus+'</td>'+
                    '<td>'+orderTime+'</td>'
                   ;

                html+=  '<td><a href="../ProductType/ProductTypeAdd.html?id='+object[i].id+'">编辑</td>';


                html+= '<td><a href="javascript:deleteOrder(\''+object[i].id+'\')">删除</td>';

                html+='</tr>';
                //    alert(typeName);
            }
            $("#index").html(html);

        }
    });

}

function deleteOrder(id){
    if(confirm("确定要删除吗？"))
    {
      //  var orderTable=AV.Object.extend("ProductType");
        var orderTable=new OrderTable();
        orderTable.id=id;
        orderTable.set("enabled",false);
        orderTable.save({
            success:function(){
                window.location.reload();
            }
        });

    }

}