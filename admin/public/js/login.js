/**
 * Created by liangyi on 15-9-11.
 */
var CustomRole=AV.Object.extend("CustomRole");
$(document).ready(
    function(){

     //   alert(getCookieValue('userName'));
      //  console.log("梁帅降临");
        if(getCookieValue('userName')!=null)
        {
            $("#userName").val(getCookieValue('userName'));
        }
        if(getCookieValue('password')!=null)
        {
            $("#password").val(getCookieValue('password'));
        }
      //  alert(111);
    }
);
function login(){
    var userName=$("#userName").val();
    var password=$("#password").val();

   // alert(password);
    AV.User.logIn(userName, password, {
        success: function(user) {
            if(user.get("enabled")==false)
            {
                alert("用户已经被删除！");
                location.reload();
            }

           /* if($('input[name="checkbox"]:checked').val()=='true')
            {
                var date=new Date();
                date.setDate(date.getDate() + 7);
                document.cookie="userName="+userName+";expires=" + date+";path=/";
                document.cookie="password="+password+";expires=" + date+";path=/";
               // alert($.cookie('password'));
            }*/
            var cuuser = AV.User.current();
            var roleId = cuuser.get('role').id;

            var query=new AV.Query(CustomRole);
            query.equalTo("objectId",roleId);
            query.find({
                success:function(object){
                 //   alert(object.length);
                  //  var str='';
                    var roleName=object[0].get("roleName");
                    if(roleName=="超级管理员")
                    {
                        window.location.href="welcome/welcome.html";
                    }
                    else
                    {
                        alert("您的身份权限不够");
                    }
                    /*alert(roleArray);
                    for(var i=0;i<roleArray.length;i++)
                    {
                        str+=roleArray[i];
                        if(i<roleArray.length-1)
                        {
                            str+=',';
                        }
                    }
                    alert(typeof str+str);*/
                    /*var date=new Date();
                    date.setDate(date.getDate() + 7);
                    document.cookie="roleArray="+roleArray+";expires=" + date+";path=/";*/
                  //  alert(document.cookie);

                }
            });

          //  $.session.set('userName', userName);
            // 成功了，现在可以做其他事情了.

       //     window.location.href="BatchTable/index.html";
        },
        error: function(user, error) {
            // 失败了.
      //      alert(222);
            alert(error.message);
        }
    });

}


function cookie(){
    $.cookie('the_cookie'); // 读取 cookie
    $.cookie('the_cookie', 'the_value'); // 存储 cookie
    $.cookie('the_cookie', 'the_value', { expires: 7 }); // 存储一个带7天期限的 cookie
    $.cookie('the_cookie', '', { expires: -1 }); // 删除 cookie

}
function getCookieValue(name){  /**获取cookie的值，根据cookie的键获取值**/
//用处理字符串的方式查找到key对应value
var cookie = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
        var start = pos + name.length;                  //cookie值开始的位置
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
        var value = allcookies.substring(start,end); //提取cookie的值
        return (value);                           //对它解码
    }else{  //搜索失败，返回空字符串
        return "";
    }
}