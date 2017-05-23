/**
 * Created by zhengyinhua on 15-11-12.
 */

$(document).ready(
	function() {
		EditMain();
	}
);

function EditMain() {
		var groupID = geturl();
		var query = new AV.Query('Salesman');
		query.include("user");
		query.get(groupID, {
			success: function(result) {
				var obj = result;
				var salesmanName = "";
				if (obj.get('salesmanName')) {
					salesmanName = obj.get('salesmanName');
				}
				var userID = "";
				var username = "";
				var nickname = "";
				if (obj.get('user')) {
					userID = obj.get('user').id;
					username = obj.get('user').get("username");
					nickname = obj.get('user').get("nickname");
				}

				$("#salesmanName").val(salesmanName);

				$("#salesmanAlert").css('color', 'green');
				$("#salesmanAlert").html("昵称：" + nickname);
				$("#mobilePhoneNo").attr('name', userID);
				$("#mobilePhoneNo").val(username);
			}
		});
	}
	//提交表格-------------------------

function EditSalesman() {
	subStart(); //设置按钮禁用
	var salesmanName = $('#salesmanName').val();
	//----------输入格式判断------------
	if (salesmanName == '') {
		alert('业务员姓名不能为空！');
		subEnd();
		return false;
	}
	//------------正式提交数据-------
	var SalesID = geturl(); //获取ID
	var query = new AV.Query(Salesman);
	query.get(SalesID, {
		success: function(Salesman) {
			Salesman.set("salesmanName", salesmanName);
			Salesman.save(null, { //保存更新的对象
				success: function(salesman) {
					// 成功保存之后，执行其他逻辑.
					subEnd(); //按钮设为禁用
					alert('编辑业务员成功！');
					history.go(-1);
				},
				error: function(salesman, error) {
					subEnd(); //按钮设为禁用
					alert('编辑业务员失败，请重试！');
				}
			});
		}

	});

}