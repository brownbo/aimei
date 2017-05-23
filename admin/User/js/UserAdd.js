/**
 * Created by zhengyinhua on 15-9-17.
 */
$(document).ready(
	function() {
		ProImg(); //开启图片预览
		ShowRoles(); //角色下拉框
	}
);
//页面加载后执行--------全局 申明-------

var User = AV.Object.extend("User");

//提交表格-------------------------
function addUser() {
	subStart(); //设置按钮禁用
	var username = $('#username').val();
	var password = $('#password').val();
	var nickname = $('#nickname').val();
	var trueName = $('#trueName').val();
	var headPortrait = $("#headPortrait")[0];
	var sex = $('input[name="sex"]:checked').val();
	var birthday = changeDate($('#birthday').val());
	var email = $('#email').val();
	var power = $('#role option:selected').val().split(/,/);
	var roleID = $('#role option:selected').attr("id");
	//----------输入格式判断------------
	if (username == '') {
		subEnd();
		alert('用户名不能为空！');
		return false;
	} else if (!username.match(/^(((1[0-9][0-9]{1})|159|153)+\d{8})$/)) {
		alert('用户名格式不正确！');
		subEnd();
		return false;
	}
	if (password == '') {
		subEnd();
		alert('密码不能为空！');
		return false;
	}
	if (trueName == '') {
		subEnd();
		alert('姓名不能为空！');
		return false;
	}
	if (nickname == '') {
		subEnd();
		alert('昵称不能为空！');
		return false;
	}

	if (birthday == '') {
		alert('请选择出生日期！');
		subEnd();
		return false;
	}
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则
	if (email == '') {
		alert('邮箱不能为空！');
		subEnd();
		return false;
	} else if (!reg.test(email)) {
		alert('邮箱格式不正确！');
		subEnd();
		return false;
	}
	if (headPortrait.files.length <= 0) {
		alert('用户图片不能为空！');
		subEnd();
		return false;
	}

	//------------正式提交数据-------
	var CustomRole = AV.Object.extend("CustomRole");
	var NewRole = new CustomRole();
	NewRole.id = roleID;

	var NewUser = new User();
	NewUser.set('username', username);
	NewUser.set('password', password);
	NewUser.set('nickname', nickname);
	NewUser.set('trueName', trueName);
	NewUser.set('sex', sex);
	NewUser.set('birthday', birthday);
	NewUser.set('email', email);
	NewUser.set('telNo', username); //联系电话默认是用户名
	NewUser.set('mobilePhoneNumber', username); //用户名作为 user表默认的mobilePhoneNumber
	NewUser.set('role', NewRole);
	NewUser.set('power', power);
	//-----图片上传成功过后 才保存对象 否则异步
	var file = headPortrait.files[0];
	var name = "handsome.jpg";
	var avFile = new AV.File(name, file);
	avFile.save().then(function() {
		NewUser.set('headPortrait', avFile);
		NewUser.signUp(null, {
			success: function(user) {
				// 成功保存之后，执行其他逻辑.
				subEnd();
				alert('增加成功！');
				location.reload();
			},
			error: function(user, error) {
				subEnd();
				alert("添加失败，" + " " + error.message);
			}
		});
	}, function(error) {
		alert('上传头像失败！');
	});

}

function subStart() {
	$("#subButton").attr("disabled", "disabled"); //按钮禁用
	$("#subButton").css("background-color", "#808080");
}

function subEnd() {
	$("#subButton").removeAttr("disabled"); //将按钮可用	
	$("#subButton").css('background-color', 'rgb(66, 139, 202)');
}

function ProImg() {
	$("#headPortrait").change(function() {
			var objUrl = getObjectURL(this.files[0]);
			if (objUrl) {
				$("#ImgUser").attr("src", objUrl);
			}
		})
		//建立一個可存取到該file的url

	function getObjectURL(file) {
		var url = null;
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	}
}

function ShowSelectValue(obj, name, id) {
	var html_op = '';
	var Query = new AV.Query(obj);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var MyName = result.get(name);
				html_op += '<option value=\"' + result.id + '\">' + MyName + '</option>';
			}
			var strID = '#' + id;
			$(strID).html(html_op);
		}
	});
}

function changeDate(str) {
	var arr = str.split(/-/);
	return new Date(arr[0], arr[1] - 1, arr[2]);
}

function ShowRoles() {

	var html_op = '';
	var CustomRole = AV.Object.extend("CustomRole");
	var Query = new AV.Query(CustomRole);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var roleName = result.get("roleName");
				var power = result.get("power");

				html_op += '<option id=\"' + result.id + '\"value=\"' + power + '\">' + roleName + '</option>';
			}
			var strID = '#' + 'role';
			$(strID).html(html_op);
		}
	});
}