/**
 * Created by liangyi on 2016/4/3.
 */
function test(obj){
   // alert(1);
  //  $('#test').css('border','1px solid red');
}
function changeSign()
{
    var html='<a style="" href="javascript:changeLogin()">点击登录</a>';
    $('#changeLogin').html(html);
    $('#confirmSecond').css('display','block');
    $('#signUp').css('display','block');
    $('#login').css('display','none');
}
function changeLogin()
{
    var html='<a style="" href="javascript:changeSign()">快速注册</a>';
    $('#changeLogin').html(html);
    $('#confirmSecond').css('display','none');
    $('#signUp').css('display','none');
    $('#login').css('display','block');
}

function login(){
    var userName=$("#username").val();
    var password=$("#password").val();
    //alert(userName+password);
    // alert(password);
    AV.User.logIn(userName, password, {
        success: function(user) {
            if(user.get("enabled")==false)
            {
                alert("用户已经被删除！");
                location.reload();
            }
            window.location.href="index.html";


            var cuuser = AV.User.current();

        },
        error: function(user, error) {
            // 失败了.
            //      alert(222);
            if(error.code==210)
            {
                alert('密码不正确！');
            }
            else if(error.code==211)
            {
                alert('未找到该用户！')
            }
            else
            {
                alert(error.message);
            }

        }
    });

}

function signUp(){
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    var secondPassword=document.getElementById('secondPassword').value;
    if(secondPassword==password)
    {
        var CustomRole=AV.Object.extend("CustomRole");
        var customRole=new CustomRole();
        customRole.id="56fb791c128fe10050c93e22";
        var user = new AV.User();
        user.set('username',username);
        user.set('password',password);
       // user.set('email', 'hang@leancloud.rocks');
        user.set('role',customRole);
// other fields can be set just like with AV.Object
        user.set('mobilePhoneNumber',username);
        user.signUp().then(function(user) {
            alert("注册成功!");
            window.location.reload();
            // 注册成功，可以使用了
            console.log(user);
        }, function(error) {
            // 失败了
            if(error.code==214)
            {
                alert('用户已经被注册！');
            }
            else if(error.code==127)
            {
                alert('手机号码无效！');
            }
            console.log('Error: ' + error.code + ' ' + error.message);
        });
    }
    else
    {
        alert('密码输入不一致！');
    }

}