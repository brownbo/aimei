/**
 * Created by zhengyinhua on 15-11-6.
 */
//提交表格-------------------------
function AddGroup() {
	subStart(); //设置按钮禁用
	var groupName = $('#groupName').val();
	//----------输入格式判断------------
	if (groupName == '') {
		alert('分组名称不能为空！');
		subEnd();
		return false;
	}
	//------------正式提交数据-------
	var newStoreGroup = new StoreGroup();
	newStoreGroup.set('groupName', groupName);
	newStoreGroup.save(null, { //保存更新的对象
		success: function(group) {
			// 成功保存之后，执行其他逻辑.
			subEnd(); //按钮设为禁用
			alert('增加分组成功！');
			history.go(-1);
		},
		error: function(group, error) {
			alert('增加分组失败，请重试！');
		}
	});
}