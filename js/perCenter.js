/**
 * Created by liangyi on 2016/4/19.
 */
var OrderTable=AV.Object.extend("OrderTable");
var OrderDetail=AV.Object.extend("OrderDetail");
var Product=AV.Object.extend("Product");
$(document).ready(function(){
  //  alert(1);
    getUserInfo();
    bindOrder();
    bindUserInfo();
    getCollection();
    changeMessage();
});
/*$(function(){
    $("#txfile").change(function(e){
        alert(1);
        var file = e.target.files||e.dataTransfer.files;
        if(file){
            var reader = new FileReader();
            reader.onload=function(){
                alert(this.result);
               // $("<img src='"+this.result+"'/>").appendTo("body");
                //$('#myimg').attr('src',this.result);

            }

            reader.readAsDataURL(file);
        }
    });
});*/
function changePasswd(){
    var oldPasswd=document.getElementById('oldPasswd').value;
    var newPasswd=document.getElementById('newPasswd').value;
    var conPasswd=document.getElementById('conPasswd').value;
    if(newPasswd!=conPasswd)
    {
        alert('新密码不一致！');
    }
    else
    {
         var user = AV.User.current();
         user.updatePassword(oldPasswd,newPasswd).then(function() {
             alert('密码修改成功！');
         //更新成功
         }, function(error) {
         //更新失败
         console.log(error);
         });
    }
    alert(oldPasswd+newPasswd+conPasswd);

}
function getCollection(){
    var cuUser = AV.User.current();
    var query=cuUser.relation('likes').query();

    query.descending('createdAt');
    query.equalTo('enabled',true);
    query.include('parent');
   // query.equalTo('productType',proObj);
    query.find({
        success:function(object){
            //   alert(object.length);
            var len=object.length;

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
                    '<a href="productDetail.html?id='+object[i].id+'"><img style="width:100%;height:250px;" src="'+img+'" alt="member" /></a>'+
                    '<div><h3>'+name+'</h3><div class="email">'+price+'元/'+unitString+'</div></div>'+
                    '<div style="height: 75px;width: 100%;">'+
                    '<p style="margin: 5px">'+ProductDescription+'</p>'+
                    '</div>'+
                    '<div style="position: relative;margin-top: 0">'+
                    '<a href="javascript:addToChart(\''+object[i].id+'\')"><div class="shopChart" style="color: #ffffff"><li style="list-style-type: none">加入购物车</li>'+
                    '</div></a><a  href="javascript:removeLikes(\''+object[i].id+'\')"><div class="collection"><li style="list-style-type: none">取消</li></div></a></div></div>';

                $("#myLikes").append(html);
            }
        }
    });
}

function removeLikes(id){
    var product=new Product();
    product.id=id;
    var cuUser=AV.User.current();
    var relation=cuUser.relation('likes');
    relation.remove(product);
    cuUser.save().then(function(user) {
        alert('不再收藏！');
        location.reload();
        // 成功
    }, function(error) {
        // 失败
    });
}
function saveMessage(){
    var cuUser = AV.User.current();
    var list= $('input:radio[name="sex"]:checked').val();
  //  alert(list);
    var nickname=document.getElementById('Enickname').value;
    cuUser.set('sex',list);
    cuUser.set('nickname',nickname);
    cuUser.save().then(function(user) {
        // 成功
        alert("修改用户信息成功！");
    }, function(error) {
        // 失败
    });

}
function upfile(object){
    //alert(1);
    uploadImg()
}
function uploadImg(){
    var cuUser = AV.User.current();
    var headPortrait = $("#headPortrait")[0];
    var file = headPortrait.files[0];

    var name = "handsome.jpg";
    var avFile = new AV.File(name, file);
    avFile.save({
        success:function(){
            //alert(1);
        }
    }).then(function() {
        cuUser.set('headPortrait', avFile);
        cuUser.save().then(function(user) {
            // 成功
            alert("修改用户信息成功！");
            location.reload();
        }, function(error) {
            // 失败
        });
    }, function(error) {
        alert('上传头像失败！');
    });
}
function changeMessage(){
    var cuUser = AV.User.current();
    var username=cuUser.get('username')==null?'':cuUser.get('username');
    var nickname=cuUser.get('nickname')==null?'':cuUser.get('nickname');
    var mobilePhoneNumber=cuUser.get('mobilePhoneNumber')==null?'':cuUser.get('mobilePhoneNumber');
    var sex=cuUser.get('sex')==null?'':cuUser.get('sex');
    var img=cuUser.get('headPortrait')==null?'':cuUser.get('headPortrait').thumbnailURL(60, 60);
    document.getElementById('phone').innerHTML=mobilePhoneNumber;
    document.getElementById('Enickname').value=nickname;
    document.getElementById('username').innerHTML=username;
    $('#myimg').attr('src',img);
    if(sex==0)
    {
        $("#girl").attr("checked","checked");
    }
    else
    {
        $("#man").attr("checked","checked");

    }
}
function bindUserInfo(){
    var cuUser = AV.User.current();
    var username=cuUser.get('username')==null?'':cuUser.get('username');
    var nickname=cuUser.get('nickname')==null?'':cuUser.get('nickname');
    var sex=cuUser.get('sex')==null?'':cuUser.get('sex');
    var img=cuUser.get('headPortrait')==null?'':cuUser.get('headPortrait').thumbnailURL(60, 60);
    document.getElementById('Snickname').innerHTML=nickname;
    document.getElementById('Susername').innerHTML=username;
    $('#headerImg').attr('src',img);
}
function changeMenu(tag){
    //alert(tag);
    if(tag==0)
    {
        document.getElementById('right_title').innerHTML="我的订单";
        document.getElementById('myLikes').style.display='none';
        document.getElementById('myMessage').style.display='none';
        document.getElementById('myPasswd').style.display='none';
        document.getElementById('myOrder').style.display='block';

    }
    else if(tag==1)
    {
        document.getElementById('right_title').innerHTML="个人信息";
        document.getElementById('myLikes').style.display='none';
        document.getElementById('myMessage').style.display='block';
        document.getElementById('myPasswd').style.display='none';
        document.getElementById('myOrder').style.display='none';
    }
    else if(tag==2)
    {
        document.getElementById('right_title').innerHTML="我的收藏";
        document.getElementById('myLikes').style.display='block';
        document.getElementById('myMessage').style.display='none';
        document.getElementById('myPasswd').style.display='none';
        document.getElementById('myOrder').style.display='none';
    }
    else
    {
        document.getElementById('right_title').innerHTML="修改密码";
        document.getElementById('myLikes').style.display='none';
        document.getElementById('myMessage').style.display='none';
        document.getElementById('myPasswd').style.display='block';
        document.getElementById('myOrder').style.display='none';
    }

}
function bindOrder(){
    var cuUser = AV.User.current();
    var query=new AV.Query(OrderTable);
    query.descending('createdAt');
    query.limit(1);
    query.equalTo('orderUser',cuUser);
    query.find({
        success:function(object){
        //    alert(object.length);
            var len=object.length;
            var html='';

            for(var i=0;i<len;i++)
            {

                (function(i){
                    html+='<table class="myOrder">'+
                        '<thead style="height: 40px">'+
                        '<th>订单信息</th>'+
                        '<th>商品</th>'+
                        '<th>数量</th>'+
                        '<th>状态</th>'+
                        '</thead>'+
                        '<tbody>';
                    var orderSumPrice=object[i].get('orderSumPrice')==null?'':object[i].get('orderSumPrice');
                    var relation=object[i].relation('orderDetail').query();
                    relation.include('product');
                    relation.find({
                        success:function(obj){
                            //alert(obj.length);

                            for(var j=0;j<obj.length;j++)
                            {
                                var productImg=obj[j].get('product').get("productImg")==null?'':obj[j].get('product').get("productImg").thumbnailURL(60, 70);
                             //   alert(productImg);
                                var lastCount=obj[j].get('lastCount')==null?'':obj[j].get('lastCount');
                              //  alert(lastCount);
                                if(j==0)
                                {
                                    var rowspan=parseInt(obj.length);
                                    // alert("fasxasx"+parseInt(i)+1);
                                    html+='<tr>'+
                                        '<td style="width: 40%" rowspan="'+rowspan+'">商品总价格:'+orderSumPrice+'</td>'+
                                        '<td style="width: 30%"><img class="orderImg"  src="'+productImg+'"></td>'+
                                        '<td style="width: 10%">'+lastCount+'</td>'+
                                        '<td style="width: 20%" rowspan="'+rowspan+'"><h3>未付款</h3><label ><a style="color: rgb(237,20,91)" href="order.html">前往付款</a></label></td>'+
                                        '</tr>';
                                }
                                else{
                                    html+='<tr>'+

                                        '<td><img class="orderImg"  src="'+productImg+'"></td>'+
                                        '<td>'+lastCount+'</td>'+

                                        '</tr>';
                                }
                            }
                            html+='</tbody>'+
                                '</table>';
                            $('#myOrder').append(html);
                            //    alert(html);


                        }
                    });
                }(i));



            }

        }
    })
}