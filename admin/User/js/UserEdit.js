/**
 * Created by zhengyinhua on 15-9-17.
 */
$(document).ready(
	function() {
		ProImg(); //开启图片预览
		EditMain();
	}
);
var CustomRole = AV.Object.extend("CustomRole"); //角色表
var ListStart = new Array(); //储存修改前的字段
function EditMain() {
		//自动填入当前餐厅的相关信息---------------
		var UserID = geturl();
		var User = AV.Object.extend("User");
		var UserQuery = new AV.Query(User);
		UserQuery.get(UserID, {
			success: function(result) {
				// 成功获得实例

				var obj = result;
				var username = '';
				if (obj.get('username')) {
					username = obj.get('username');
				}
				var nickname = '';
				if (obj.get('nickname')) {
					nickname = obj.get('nickname');
				}
				var headPortrait = '';
				if (obj.get('headPortrait')) {
					headPortrait = obj.get('headPortrait').url();
				}
				var trueName = '';
				if (obj.get('trueName')) {
					trueName = obj.get('trueName');
				}
				var sex = '1';
				if (obj.get('sex')) {
					sex = obj.get('sex');
				}
				var birthday = '';
				if (obj.get('birthday')) {
					birthday = obj.get('birthday');
				}
				var email = '';
				if (obj.get('email')) {
					email = obj.get('email');
				}

				var enabled = '';
				enabled = obj.get('enabled');
				if (enabled) {
					enabled = "true";
				} else {
					enabled = "false";
				}

				var role = '';
				if (obj.get('role')) {
					role = obj.get('role').id;
				}

				//加入修改前的信息到数组 以便提交时进行比较
				ListStart['nickname'] = nickname;
				ListStart['headPortrait'] = headPortrait;
				ListStart['trueName'] = trueName;
				ListStart['sex'] = sex;
				ListStart['birthday'] = birthday;
				ListStart['email'] = email;
				ListStart['enabled'] = enabled;
				ListStart['role'] = role;
				//设置默认值

				$("#nickname").val(nickname);
				$("#trueName").val(trueName);

				$("#birthday").val(changeDateTostring(birthday));
				$("#email").val(email);
				$("#username").val(username);
				var tempSex = "input[type=radio][value=" + sex + "]";
				$(tempSex).attr("checked", 'checked');
				$("#ImgUser").attr('src', headPortrait);
				var tempEn = "input[type=radio][value=" + enabled + "]";
				$(tempEn).attr("checked", 'checked');
				ShowRoles(role); //添加角色下拉列表 并且显示该用户的角色 由于会异步所以先显示再设置选中
			},
			error: function(result, error) {
				// 失败了.
				alert('失败了' + error.message);
			}
		});
	}
	//--------------提交修改------------

function UserEdit() {
		//设置按钮样式 表示正在提交并且禁用按钮
		subStart();
		//获取提交时 当前页面的字段默认信息
		var password = $('#password').val();
		var nickname = $('#nickname').val();
		var trueName = $('#trueName').val();
		var headPortrait = $("#headPortrait")[0];
		var sex = $('input[name="sex"]:checked').val();
		var birthday = changeDate($('#birthday').val());
		var email = $('#email').val();
		var enabled = $('input[name="enabled"]:checked').val();
		var role = $('#role option:selected').attr("id");
		var roleArray = $('#role option:selected').attr("value");
		//----------输入格式判断------------
		if (trueName == '') {
			subEnd();
			alert('姓名不能为空！');
			return false;
		}
		if (password == '') {
			subEnd();
			alert('密码不能为空！');
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
		var ListName = new Array();
		var ListKey = new Array();
		//------------正式提交数据-------
		//如果字段没有修改 则不需要再更新该字段
		if (ListStart['nickname'] != nickname) {
			ListName.push('nickname');
			ListKey.push(nickname);
		}
		if (password != '**********') {
			ListName.push('password');
			ListKey.push(password);
		}
		if (ListStart['trueName'] != trueName) {
			ListName.push('trueName');
			ListKey.push(trueName);
		}
		if (ListStart['sex'] != sex) {
			ListName.push('sex');
			ListKey.push(sex);
		}
		if (ListStart['birthday'] != birthday) {
			ListName.push('birthday');
			ListKey.push(birthday);
		}
		if (ListStart['email'] != email) {
			ListName.push('email');
			ListKey.push(email);
		}
		if (ListStart['enabled'] != enabled) {
			ListName.push('enabled');
			var T = true;
			var F = false;
			if (enabled == "false") {
				ListKey.push(F);
			} else {
				ListKey.push(T);
			}
		}
		ListName.push('role');
		ListKey.push(roleArray.split(/-/)); //字符串转化内数组
		var UserID = geturl(); //获取ID
		AV.Cloud.run('EditUser', {
			ListName: ListName,
			ListKey: ListKey,
			UserID: UserID,
			RoleID: role
		}, {
			success: function(data) {
				//调用成功，得到成功的应答data
				alert(data);
				subEnd();
				location.reload();
			},
			error: function(err) {
				//处理调用失败
				alert(err.message);
				subEnd();
				location.reload();
			}
		});
	}
	//获取url上传入的id

function geturl() {
		var url = location.search.substr(1);
		var gethref;
		if (url.length > 0) {
			var ar = url.split(/[&=]/);
			for (i = 0; i < ar.length; i += 2) {
				gethref = ar[i + 1];
				//alert("参数:"+ar[i]+":"+ar[i+1]+"<br>");
				// alert(ar[i+1]);
			}

		}
		return gethref;
	}
	//查询人员----------------------

function SearchName() {
		var InputName = $("#owner").val();
		var User = AV.Object.extend("User");
		var UserQuery = new AV.Query(User);
		UserQuery.equalTo("username", InputName);
		UserQuery.find({
			success: function(result) {
				var Alert = '';
				if (result[0] != null) {
					var nickname = result[0].get('nickname');
					Alert = '成功，用户昵称：' + nickname + '!';
					$("#Alert").css('color', 'green');
					$("#owner").attr('name', result[0].id);
				} else {
					Alert = "失败,没有找到该用户！";
					$("#owner").val('请输入用户名并搜索');
					$("#owner").css('color', '#999');
					$("#Alert").css('color', 'red');
				}
				$("#Alert").html(Alert);
			}
		});
	}
	//对时间进行处理 比2:5分 改为显示02:05分。 

function ToTime(time) {
	var h = time.getHours();
	var m = time.getMinutes();
	if (h >= 0 && h < 10) {
		h = "0" + h;
	}
	if (m >= 0 && m < 10) {
		m = "0" + m;
	}
	var StrTime = h + ':' + m;
	return StrTime;
}

function TODate(time) { //把字符串的时间转换为date类型。
		var H = parseInt(time.substring(0, 2));
		var M = parseInt(time.substring(3, 5));
		var myTime = new Date();
		myTime.setHours(H);
		myTime.setMinutes(M);
		return myTime;
	}
	//--------------提交后 按钮的变化  禁用 样式变化------------

function subStart() {
	$("#subButton").attr("disabled", "disabled"); //按钮禁用
	$("#subButton").css("background-color", "rgb(19, 16, 16)");
}

function subEnd() {
		$("#subButton").removeAttr("disabled"); //将按钮可用	
		$("#subButton").css('background-color', 'rgb(66, 139, 202)');
	}
	//---------本地显示上传 的图片----------------

function ProImg() {
	$("#headPortrait").change(function() {
			var objUrl = getObjectURL(this.files[0]);
			if (objUrl) {
				$("#ImgUser").attr("src", objUrl);
			}
		})
		//建立一个可存取到该file的url

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

function changeDate(str) {
	var arr = str.split(/-/);
	return new Date(arr[0], arr[1] - 1, arr[2]);
}

function changeDateTostring(date) {
	if (date == '') {
		return '';

	}
	var year = date.getFullYear();
	var month = (date.getMonth() + 1).toString();
	var day = (date.getDate()).toString();
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	var dateTime = year + '-' + month + '-' + day;
	return dateTime;
}

function ShowRoles(role) {

	var html_op = '';
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
			var tempRole = "#role  option[id=\'" + role + "\']";
			$(tempRole).attr("selected", true);
		}
	});


}