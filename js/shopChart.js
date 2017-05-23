/**
 * Created by liangyi on 2016/4/3.
 */
var OrderTable=AV.Object.extend("OrderTable");
var OrderDetail=AV.Object.extend("OrderDetail");
var Product=AV.Object.extend("Product");
$(document).ready(function(){
   // bindMenu();

    getUserInfo();
    getShopChart();
    changeCheckBox();
    window.mobilecheck = function() {
        var check = false;
        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
    if(window.mobilecheck()){
        $('#right_content').css('display','none');

        $('#right_pro').css('display','none');

    }

});
function generateOrder(){ //生成订单
    var len=$(':checkbox[name="checkbox"]:checked').length;
    if(len<=0)
    {
        alert(1);
    }
    else
    {
        var cuuser = AV.User.current();

        var orderTable=new OrderTable();
        orderTable.set('orderUser',cuuser);
        var orderSumPrice=$('#jiesuan').html();   //总价格
        orderTable.set('orderSumPrice',parseFloat(orderSumPrice));
        orderTable.save({
            success:function(object){

                var relation=object.relation('orderDetail');

                var cheLen=$(':checkbox[name="checkbox"]:checked').length;
                var tag=0;
                for(var i=0;i<cheLen;i++)
                {

                    (function(i){

                        var id=$(':checkbox[name="checkbox"]:checked').eq(i).val();
                        var product=new Product();
                        product.id=id;
                        var lastCount=$('#i'+id).val();    //商品数量
                        var realPrice=$('#s'+id).html();   //小计的价格
                        var orderDetail=new OrderDetail();
                        orderDetail.set('product',product);
                        orderDetail.set('lastCount',parseInt(lastCount));
                        orderDetail.set('realPrice',parseFloat(realPrice));
                        orderDetail.save({
                            success:function(od){
                                relation.add(od);
                                object.save({
                                    success:function(){
                                       // alert(tag+"g"+cheLen);
                                        tag++;
                                        if(tag==cheLen)
                                        {
                                            alert('已经为您生成了订单！');
                                            window.location.href="order.html";
                                        }
                                    }
                                });
                            }
                        });
                    }(i));


                    //alert('i'+id);
                    //alert(sumPrice);
                }
                        //alert(obj.length);

            }
        });


    }


}
function changeCheckBox(){
    var checkAll=$('#checkAll').is(':checked');
    if(checkAll)
    {


        $(':checkbox[name="checkbox"]').prop("checked",true);
        checkCount=$(':checkbox[name="checkbox"]:checked').length;

        document.getElementById('totalCount').innerHTML=checkCount;
        var totalPrice=parseFloat(document.getElementById('totalPrice').innerHTML);
        document.getElementById('jiesuan').innerHTML=totalPrice;

    }
    else
    {
        checkCount=0;
        $(':checkbox[name="checkbox"]').prop("checked",false);
        document.getElementById('totalCount').innerHTML=checkCount;
        document.getElementById('jiesuan').innerHTML=0;
    }
   // alert(checkAll);

}
var checkCount=0;
function getthisObj(object){    //点击checkbox获取总价
  if(object.checked==true)
  {
      checkCount++;
      var simPrice=parseFloat($('#s'+object.value+'').html());
     // alert(typeof simPrice)
     // alert(simPrice);
      var totalPrice= parseFloat(document.getElementById('jiesuan').innerHTML);

      totalPrice+=parseFloat(simPrice);
      document.getElementById('totalCount').innerHTML=checkCount;
      document.getElementById('jiesuan').innerHTML=totalPrice;
  }
    else
  {
      checkCount--;
      var simPrice=parseFloat($('#s'+object.value+'').html());
      // alert(typeof simPrice)
      // alert(simPrice);
      var totalPrice= parseFloat(document.getElementById('jiesuan').innerHTML);

      totalPrice-=parseFloat(simPrice);
      document.getElementById('totalCount').innerHTML=checkCount;
      document.getElementById('jiesuan').innerHTML=totalPrice;
  }
}
function getShopChart(){
    var cuUser=AV.User.current();
    if(cuUser==null)
    {

    }
    else
    {

        var query=cuUser.relation('shopChart').query();
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
                        var productName=object[i].get("productName")==null?'':object[i].get("productName");
                        var unitString=object[i].get("unitString")==null?'':object[i].get("unitString");
                        var unitPrice=object[i].get("unitPrice")==null?'':object[i].get("unitPrice");
                        totalPrice+=unitPrice;
                        var productImg=object[i].get("productImg")==null?'':object[i].get("productImg").thumbnailURL(60, 70);
                       html+=
                           ' <tr class="tb_tr">'+
                           '<td style="">'+
                           '<input onclick="getthisObj(this)" value="'+object[i].id+'" name="checkbox" type="checkbox">'+
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
                        '<input id="i'+object[i].id+'" onchange="getSSum(\''+object[i].id+'\')" style="width: 40px" type="number" value="1" min="0" max="100">'+
                        '</td>'+
                        '<td class="productPrice" id="s'+object[i].id+'">'+
                        unitPrice+
                        '</td>'+
                        '<td>'+
                        '<a href="javascript:removeShopChart(\''+object[i].id+'\')">删除</a>'+
                        '</td>'+
                    '</tr>';
                       // alert(productName+unitPrice+unitString+productImg);
                    }
                    document.getElementById('tbody').innerHTML=html;
                    document.getElementById('totalPrice').innerHTML=totalPrice;

                }
           //     alert(object.length);
            }
        });
    }
  //  alert(cuUser.id);

}

function removeShopChart(id){
    var product=new Product();
    product.id=id;
    var cuUser=AV.User.current();
    var relation=cuUser.relation('shopChart');
    relation.remove(product);
    cuUser.save().then(function(user) {
        alert('删除成功！');
        location.reload();
        // 成功
    }, function(error) {
        // 失败
    });
}
function getSSum(id){    //计算单个商品价格
  //  alert(document.getElementById('p'+id).value)
    document.getElementById('s'+id).innerHTML=document.getElementById('p'+id).innerHTML*document.getElementById('i'+id).value;

    var sumPrice=0;
    var sumPrice0=0;
   // alert(1)
 //   alert(document.getElementsByClassName("productPrice")[0].innerHTML);
    for(var i=0;i<document.getElementsByClassName("productPrice").length;i++)
    {
      //  alert(2)
        var ju=$(':checkbox[name="checkbox"]').eq(i).is(':checked');
        if(ju)
        {
            sumPrice0+=parseFloat(document.getElementsByClassName("productPrice")[i].innerHTML);
        }
        sumPrice+=parseFloat(document.getElementsByClassName("productPrice")[i].innerHTML);
    }
  //  alert(sumPrice);
    document.getElementById('totalPrice').innerHTML=sumPrice;
    document.getElementById('jiesuan').innerHTML=sumPrice0;
}


function getSum(){   //计算所有商品总价

}