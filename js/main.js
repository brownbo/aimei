/**
 * Created by liangyi on 2016/4/2.
 */
/**
 * Created by liangyi on 2016/3/29.
 */
function addToLikes(id){
    var cuUser = AV.User.current();
    if(cuUser==null)
    {
        if(confirm('您尚未登录！是否立即登录？'))
        {
            window.location.href="login.html";
        }
    }
    else
    {
        var Product=AV.Object.extend('Product');

        var relation=cuUser.relation('likes');
        var product=new Product();
        product.id=id;
        relation.add(product);
        cuUser.save().then(function(user) {
            // 成功
            alert('已经收藏！');
        }, function(error) {
            // 失败
        });

    }



}
function addToChart(id){    //添加到购物车
      var Product=AV.Object.extend('Product');
      var OrderDetail=AV.Object.extend("OrderDetail");
      var cuUser = AV.User.current();
      if(cuUser==null)
      {
          if(confirm('您尚未登录！是否立即登录？'))
          {
              window.location.href="login.html";
          }
      }
    else
      {


         // var orderDetail=new OrderDetail();
          var product=new Product();
          product.id=id;
          var relation=cuUser.relation('shopChart');
          relation.add(product);

          cuUser.save().then(function(user) {
              // 成功
              alert("已经添加到购物车！");
          }, function(error) {
              // 失败
          });


        /*  orderDetail.set('product',product);
          orderDetail.save({
              success:function(object){
                  console.log(object);

              }
          });*/


         /* relation.query().find({
              success:function(object){
                  alert(object.length);
              }
          });*/
      }
}
function getUserInfo(){
   // alert(2)
    var cuuser = AV.User.current();
    if(cuuser==null)
    {
       // alert(2);
       $('#login').css('display','block');
    }
    else
    {
        $('#login').css('display','none');
        var nickname=cuuser.get('nickname');
        nickname='<a style="color: rgb(237,20,91)" href="perCenter.html">'+nickname+'</a>';
        var username=cuuser.get('username');
        username='<a style="color: rgb(237,20,91)" href="perCenter.html">'+username+'</a>';
        if(nickname==null)
        {
            $('#nickname').html(username);
        }else
        {
            $('#nickname').html(nickname);
        }
    }
    // console.log(cuuser);

    //  alert();
}
function bindMenu(flag){
   // alert(flag);
    var ProductType=AV.Object.extend('ProductType');

    var query=new AV.Query(ProductType);
    query.equalTo('level',1);
    query.equalTo('enabled',true);
    query.ascending('orderNumber');
    query.find({
        success:function(object){
            var len=object.length;

            var bannerArray=new Array(6);
            var tag=0;
            for(var i=0;i<len;i++)
            {
                var html='';

                var typeName=object[i].get('typeName')==null?'':object[i].get('typeName');
                var englishName=object[i].get('typeID')==null?'':object[i].get('typeID');
                if(i==parseInt(flag)-1)
                {
                 //   alert(1+"i"+i);
                    html+='<li class="current_page_item">';
                }
                else
                {
                    html+='<li class="">';
                }
           // class="current_page_item"
                html+='<a>'+typeName+
                    '<div class="sub">'+englishName+
                    '</div>'+
                    '</a>'+
                    '<ul id="'+object[i].id+'">';
                html+='</ul>'+
                    '</li>';
                $("#banner").append(html);
                (function(i){
                    bindChild(object[i].id,tag);


                }(i));


            }

            // console.log(bannerArray);
        }
    });
}

function bindChild(id){
    //  alert(id);
    var ProductType=AV.Object.extend('ProductType');

    var productObj=new ProductType();
    productObj.id=id;
    var cQuery=new AV.Query(ProductType);
    cQuery.equalTo('level',2);
    cQuery.equalTo('parent',productObj);
    cQuery.equalTo('enabled',true);
    cQuery.ascending('orderNumber');
    cQuery.find({
        success:function(object){
            var html='';
            if(object.length!=0)
            {
                for(var i=0;i<object.length;i++)
                {
                    var chTypeName=object[i].get('typeName')==null?'':object[i].get('typeName');
                    html+='<li><a href="showPro.html?id='+object[i].id+'">'+chTypeName+'</a></li>';
                }
            }
            $("#"+id+"").html(html);
        }
    });
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