/**
 * Created by zhengyinhua on 15-11-12.
 */
//提交表格-------------------------
function AddSalesman() {
	subStart(); //设置按钮禁用
	var salesmanName = $('#salesmanName').val();
	var mobilePhoneNo = $('#mobilePhoneNo').val();
	var userID = $('#mobilePhoneNo').attr("name");
	//----------输入格式判断------------
	if (salesmanName == '') {
		alert('业务员姓名不能为空！');
		subEnd();
		return false;
	}
	if (userID == '') {
		alert('请输入正确的业务员号码！');
		subEnd();
		return false;
	}
	//------------正式提交数据-------
	var MyUser = new User();
	MyUser.id=userID;
	var MySalesman = new Salesman();
	MySalesman.set('salesmanName', salesmanName);
	MySalesman.set('mobilePhoneNo', mobilePhoneNo);
	MySalesman.set('user', MyUser);
	MySalesman.save(null, { //保存更新的对象
		success: function(salesman) {
			// 成功保存之后，执行其他逻辑.
			subEnd(); //按钮设为禁用
			alert('增加业务员成功！');
			history.go(-1);
		},
		error: function(salesman, error) {
			subEnd(); //按钮设为禁用
			alert('增加分组失败，请重试！');
		}
	});
}