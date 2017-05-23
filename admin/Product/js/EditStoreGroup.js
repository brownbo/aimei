/**
 * Created by zhengyinhua on 15-11-6.
 */
$(document).ready(
	function() {
		EditMain();
	}
);
function EditMain() {
	var groupID = geturl();
	var query = new AV.Query('StoreGroup');
	query.get(groupID, {
		success: function(result) {
			var obj=result;
			var groupName = "";
			if (obj.get('groupName')) {
				groupName = obj.get('groupName');
			}
			$("#groupName").val(groupName);
		}
	});
}
//提交表格-------------------------
function EditGroup() {
	subStart(); //设置按钮禁用
	var groupName = $('#groupName').val();
	//----------输入格式判断------------
	if (groupName == '') {
		alert('分组名称不能为空！');
		subEnd();
		return false;
	}
	//------------正式提交数据-------
	var groupID = geturl();
	var query = new AV.Query(StoreGroup);
	query.get(groupID, {
		success: function(group) {
			group.set('groupName', groupName);
			group.save(null,{
				success:function(group){
					subEnd(); //按钮设为启用
					alert('编辑分组成功！');
					history.go(-1);
				},error:function(group,error){
					subEnd(); //按钮设为启用
					alert('编辑分组失败，请重试！');
				}
			});
		},
		error: function(group, error) {
			subEnd(); //按钮设为启用
			alert('编辑失败，请重试！');
		}
	});
}
function geturl() {
	var url = location.search.substr(1);
	var gethref;
	if (url.length > 0) {
		var ar = url.split(/[&=]/);
		for (i = 0; i < ar.length; i += 2) {
			gethref = ar[i + 1];
		}
	}
	return gethref;
}