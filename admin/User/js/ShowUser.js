/**
 * Created by zhengyinhua on 15-9-12.
 */

$(document).ready(
	function() {
		view("main");
	}
);
var page = 0;
var maincount = 0;
var flag = false; //标记是否是筛选环境下
function view(tag) {
	if (tag == "nextpage") {
		page++;
		if (page * 10 >= maincount) {
			alert('当前已经是最后一页了！');
			page--;
			return false;
		}
	}
	if (tag == "pastpage") {
		if (page > 0) {
			page--;
		} else {
			alert('当前已经是第一页了！');
			return false;
		}
	}

	var html = '<thead>' +
		'<tr>' +
		'<th>头像</th>' +
		'<th>用户名</th>' +
		'<th>昵称</th>' +
		'<th>姓名</th>' +
		'<th>性别</th>' +
		'<th>生日</th>' +
		'<th>邮箱</th>' +
		'<th>编辑</th>' +
		'<th>删除</th>' +
		'</tr>' +
		'</thead>';
	var User = AV.Object.extend("User");
	var query = new AV.Query(User);
	query.equalTo("enabled", true);
	if (tag == "main") {
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	if (flag) { //如果是在筛选环境下 则翻页的时候需要进行筛选
		var UserName = $("#UserNameS").val();
		var query = new AV.Query(User);
		query.equalTo('username', UserName); //筛选出该类型的产品
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	if (tag == "search") {
		maincount = 0;
		page = 0;
		flag = true;
		var UserName = $("#UserNameS").val();
		var query = new AV.Query(User);
		query.equalTo('username', UserName); //筛选出该类型的产品
		query.count({
			success: function(count) {
				maincount = count;
				if (count == 0) {
					alert("该用户不存在！");
					window.location.reload();
				}
			}
		});
	}
	query.descending("updatedAt");
	query.limit(10);
	query.skip(10 * page);
	query.find({
		success: function(object) {
			var len = object.length;
			for (var i = 0; i < len; i++) {
				var username = '';
				if (object[i].get("username") != null) {
					username = object[i].get("username");
				}

				var headPortrait = '';
				if (object[i].get("headPortrait") != null) {
					headPortrait = object[i].get("headPortrait").url();
					//alert(productImg);
				}

				var nickname = '';
				if (object[i].get("nickname") != null) {
					nickname = object[i].get("nickname");
				}

				var trueName = '';
				if (object[i].get("trueName") != null) {
					trueName = object[i].get("trueName");
				}
				var sex = '';
				if (object[i].get("sex") != null) {
					if (object[i].get("sex") == '1') {
						sex = '男';
					} else {
						sex = '女';
					}

				}
				var birthday = '';
				if (object[i].get("birthday") != null) {
					birthday = changeDateTostring(object[i].get("birthday"));
				}
				var email = '';
				if (object[i].get("email") != null) {
					email = object[i].get("email");
				}

				var ObjId = object[i].id;
				html += '<tr>' +
					'<td>' + '<img class="imgs" src=\"' + headPortrait + '\" style="height:40px;width:40px"></td>' +
					'<td>' + username + '</td>' +
					'<td>' + nickname + '</td>' +
					'<td>' + trueName + '</td>' +
					'<td>' + sex + '</td>' +
					'<td>' + birthday + '</td>' +
					'<td>' + email + '</td>' +
					'<td><a href="UserEdit.html?id=' + ObjId + '">编辑</td>' +
					'<td><a href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>' +
					'</tr>';
			}
			$("#userList").html(html);
		}
	});
}

function deletebatch(id) {
		if (confirm("确定要删除吗？")) {
			var UserID = id;
			AV.Cloud.run('EnabledUser', {
				UserID: UserID
			}, {
				success: function(data) {
					//调用成功，得到成功的应答data
					alert(data);
					location.reload();
				},
				error: function(err) {
					//处理调用失败
					alert(err.message);
					location.reload();
				}
			});
		}
	}
	//根据产品类型 进行筛选

function ShowSelect() {
	//载入产品类型下拉框列表----------------------
	var html_op = '';
	var ProductType = AV.Object.extend("ProductType");
	var ProTypeQuery = new AV.Query(ProductType);
	ProTypeQuery.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				obj = results[i];
				var typeName = obj.get('typeName');
				html_op += '<option value=\"' + obj.id + '\">' + typeName + '</option>';
			}
			$("#userList").html(html_op);
		}
	});
}

function changeDateTostring(date) {
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