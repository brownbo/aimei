/**
 * Created by liangyi on 2016/4/11.
 */
var OrderTable=AV.Object.extend("OrderTable");
var OrderDetail=AV.Object.extend("OrderDetail");
var Product=AV.Object.extend("Product");
$(document).ready(function(){
       // alert(2);
    getUserInfo();
    showOrder();
});
function showOrder(){
    var cuUser=AV.User.current();
    var query=new AV.Query(OrderTable);
    query.equalTo('orderUser',cuUser);
    query.descending('createdAt');
    query.limit(1);
    query.find({
        success:function(object){
           // alert(object[0].get("orderSumPrice"));
            var orderSumPrice=object[0].get('orderSumPrice')==null?'':object[0].get('orderSumPrice');

            var query=object[0].relation('orderDetail').query();
            query.include('product');
            query.descending('product');
            query.find({
                success:function(object){
                    var len=object.length;

                    if(len==0)
                    {

                    }
                    else
                    {
                        var html='';
                        var totalPrice=0;
                        for(var i=0;i<len;i++)
                        {
                            var productName=object[i].get('product').get("productName")==null?'':object[i].get('product').get("productName");
                            var unitString=object[i].get('product').get("unitString")==null?'':object[i].get('product').get("unitString");
                            var unitPrice=object[i].get('product').get("unitPrice")==null?'':object[i].get('product').get("unitPrice");
                            var realPrice=object[i].get('realPrice')==null?'':object[i].get('realPrice');

                            var lastCount=object[i].get('lastCount')==null?'':object[i].get('lastCount');
                            var productImg=object[i].get('product').get("productImg")==null?'':object[i].get('product').get("productImg").thumbnailURL(60, 70);
                            html+=
                                ' <tr class="tb_tr">'+
                                '<td style="">'+
                                ''+
                                '</td>'+
                                '<td class="tb_td">'+
                                '<div class="tb_td_div">'+
                                '<img class="tt_img" src="'+productImg+'">'+
                                '</div>'+
                                '<div class="tb_td_div">'+
                                '<label>'+productName+'</label>'+
                                '<p class="tb_p">型号：'+unitString+'</p>'+
                                '</div>'+
                                '<div style="clear: both"></div>'+

                                '</td>'+
                                '<td id="p'+object[i].id+'">'+
                                unitPrice+
                                '</td>'+
                                '<td>'+
                                '<lable>'+lastCount+'</lable>'+
                                '</td>'+
                                '<td class="productPrice" id="s'+object[i].id+'">'+
                                    realPrice+
                                '</td>'+
                                '<td>'+
                                '删除'+
                                '</td>'+
                                '</tr>';
                            // alert(productName+unitPrice+unitString+productImg);
                        }
                        document.getElementById('tbody').innerHTML=html;
                        //alert(orderSumPrice);
                        document.getElementById('totalPrice').innerHTML=orderSumPrice;
                        document.getElementById('jiesuan').innerHTML=orderSumPrice;
                    }
                }
            });
        }
    });

}