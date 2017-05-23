/**
 * Created by zhengyinhua on 15-11-6.
 */
$(document).ready(
	function() {
		view("main");
	}
);
var page = 0;
var maincount = 0;
var query = new AV.Query(StoreGroup);
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
		'<th>分组名称</th>' +
		'<th>编辑</th>' +
		'<th>删除</th>' +
		'<th>推送信息</th>' +
		'</tr>' +
		'</thead>';
	if (tag == "main") {
		query = new AV.Query(StoreGroup);
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
		var groupName = '';
		if (object[i].get("groupName") != null) {
			groupName = object[i].get("groupName");
		}
		var ObjId = object[i].id;
		html += '<tr>' +
			'<td>' + groupName + '</td>' +
			'<td><a href="EditStoreGroup.html?id=' + ObjId + '">编辑</td>' +
			'<td><a href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>' +
			'<td><a href="javascript:PushMessages(\'' + ObjId + '\')">发送</td>' +
			'</tr>';
	}
	$("#groupList").html(html);

}

function deletebatch(id) {
	if (confirm("确定要删除吗？")) {
		var query = new AV.Query(StoreGroup);
		query.get(id, {
			success: function(group) {
				group.set('enabled', false);
				group.save(null, {
					success: function(group) {
						// 成功保存之后，执行其他逻辑.
						alert('删除成功！');
						window.location.reload();
					},
					error: function(group, error) {
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
	/*
	 *
	 * 给该分组的所有店铺 推送短信。
	 *
	 *
	 */

function PushMessages(id) {
	var MyGroup = new StoreGroup();
	MyGroup.id = id;
	var query = AV.Relation.reverseQuery('Store', 'storeGroups', MyGroup);
	query.include('owner');
	query.equalTo("enabled", true);
	query.find({
		success: function(objects) {
			var len = objects.length;
			if (confirm("您将向" + len + "家店铺推送消息？")) {
				var successLen = 0;
				var errorLen = 0;
				for (var i = 0; i < len; i++) {
					(function(i) {
						var obj = objects[i];
						var username = obj.get("owner").get("username");
						var storeName = obj.get("storeName");
						AV.Cloud.requestSmsCode({
							mobilePhoneNumber: username,
							template: "OrderVerified",
							"store": storeName,
						}).then(function() {
							//发送成功
							successLen++;
							if (i == len - 1) {
								alert("共发送" + len + "条消息[" + "成功:" + successLen + "失败:" + errorLen + "]");
							}
						}, function(err) {
							//发送失败
							errorLen++;
							if (i == len - 1) {
								alert("共发送" + len + "条消息[" + "成功:" + successLen + "失败:" + errorLen + "]");
							}
						});
					}(i));
				}
			}
		}
	});
}