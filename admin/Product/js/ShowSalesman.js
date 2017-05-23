/**
 * Created by zhengyinhua on 15-11-12.
 */
$(document).ready(
	function() {
		view("main");
	}
);
var page = 0;
var maincount = 0;
var query = new AV.Query(Salesman);
var Sum = 10; //记录 店铺名称查询显示的条数
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
		'<th>业务员姓名</th>' +
		'<th>业务员电话</th>' +
		'<th>编辑</th>' +
		'<th>删除</th>' +
		'</tr>' +
		'</thead>';
	if (tag == "main") {
		query = new AV.Query(Salesman);
		query.equalTo("enabled", true);
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	query.descending("updatedAt");
	query.limit(10);
	query.skip(10 * page);
	query.find({
		success: function(object) {
			//----
			ShowObject(object, html);
		}
	});
}

function ShowObject(object, html) { //输出一个query find方法返回的结果集 到table里
	var len = object.length;
	for (var i = 0; i < len; i++) {
		var salesmanName = '';
		if (object[i].get("salesmanName") != null) {
			salesmanName = object[i].get("salesmanName");
		}
		var mobilePhoneNo = '';
		if (object[i].get("mobilePhoneNo") != null) {
			mobilePhoneNo = object[i].get("mobilePhoneNo");
		}
		var ObjId = object[i].id;
		html += '<tr>' +
			'<td>' + salesmanName + '</td>' +
			'<td>' + mobilePhoneNo + '</td>' +
			'<td><a href="EditSalesman.html?id=' + ObjId + '">编辑</td>' +
			'<td><a href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>' +
			'</tr>';
	}
	$("#salesmanList").html(html);
}

function deletebatch(id) {
	if (confirm("确定要删除吗？")) {
		var query = new AV.Query(Salesman);
		query.get(id, {
			success: function(salesman) {
				salesman.set('enabled', false);
				salesman.save(null, {
					success: function(salesman) {
						// 成功保存之后，执行其他逻辑.
						alert('删除成功！');
						window.location.reload();
					},
					error: function(salesman, error) {
						alert('删除失败！' + error.message);
					}
				});
			},
			error: function(pro, error) {
				alert('删除失败！' + error.message);
			}
		});
	}
}


//根据产品类型 进行筛选
function reload() {
	window.location.reload();
}
