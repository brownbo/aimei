/**
 * Created by zhengyinhua on 15-10-22.
 */
//页面加载后执行--------全局 申明-------
var DistributionCenter = AV.Object.extend("DistributionCenter");
var SortingCenter = AV.Object.extend("SortingCenter");
var store = AV.Object.extend("Store");
var City = AV.Object.extend("City");
var StoreType = AV.Object.extend("StoreType");
var DeliveryRoute = AV.Object.extend("DeliveryRoute");
var Salesman = AV.Object.extend("Salesman");
var User = AV.Object.extend("User");
var StoreGroup = AV.Object.extend("StoreGroup");
//---------本地显示上传 的图片----------------
function ProImg(){
	$("#storeImage").change(function(){
		var objUrl=getObjectURL(this.files[0]);
		if(objUrl){
		$("#ImgPr").attr("src",objUrl);
		}
	})
	//建立一个可存取到该file的url
	function getObjectURL(file) {
		var url = null ; 
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
			} else if (window.URL!=undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file) ;
			} else if (window.webkitURL!=undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file) ;
		}
		return url ;
	}
}

/*
 * 
 * 显示下拉框
 */
function ShowSelectValue(obj,name,id){
	var html_op = '';
	var Query = new AV.Query(obj);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var MyName = result.get(name);
				html_op += '<option value=\"' + result.id + '\">' + MyName + '</option>';
			}
			var strID='#'+id;
			$(strID).html(html_op);
		}
	});

}
/*
 * 
 * 显示多选框
 */
function ShowCheckboxs(ClassType, id) {
	var html = '';
	var Query = new AV.Query(ClassType);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var groupName = result.get('groupName');
				html += '<input type="checkbox" name="storeGroups"  value=\"' + result.id + '\" >' + groupName + ' '+"<br>";
			}
			var strID = '#' + id;
			$(strID).html(html);
			
		}
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
				Alert = '昵称：' + nickname;
				$("#Alert").css('color', 'green');
				$("#owner").attr('name', result[0].id);
			} else {
				Alert = "该用户不存在！";
				$("#owner").attr('name','');
				$("#owner").val('请输入11位手机号');
				$("#owner").css('color', '#999');
				$("#Alert").css('color', 'red');
			}
			$("#Alert").html(Alert);
		}
	});
}

function SearchSale() {
	var salesman = $("#salesman").val();
	var query = new AV.Query(Salesman);
	query.equalTo("mobilePhoneNo", salesman);
	query.find({
		success: function(result) {
			var html = '';
			if (result[0] != null) {
				var salesmanName = result[0].get('salesmanName');
				html = '姓名：' + salesmanName;
				$("#saleAlert").css('color', 'green');
				$("#salesman").attr('name', result[0].id);
			} else {
				html = "该业务员不存在！";
				$("#salesman").attr('name','');
				$("#salesman").val('请输入11位手机号');
				$("#salesman").css('color', '#999');
				$("#saleAlert").css('color', 'red');
			}
			$("#saleAlert").html(html);
		}
	});
}
function SearchSalesman() {
	var mobilePhoneNo = $("#mobilePhoneNo").val();
	var User = AV.Object.extend("User");
	var UserQuery = new AV.Query(User);
	UserQuery.equalTo("username", mobilePhoneNo);
	UserQuery.find({
		success: function(result) {
			var Alert = '';
			if (result[0] != null) {
				//还需判断是否已经是业务员 以免重复增加
				var query = new AV.Query(Salesman);
				query.equalTo("enabled",true);
				query.equalTo("mobilePhoneNo",mobilePhoneNo);
				query.count({
					success:function(count){
						if(count!=0){
							Alert = "该用户已经是业务员，不可重复添加！";
							$("#mobilePhoneNo").attr('name','');
							$("#mobilePhoneNo").css('color', '#999');
							$("#salesmanAlert").css('color', 'red');
						}else{
							var nickname = result[0].get('nickname');
							Alert = '昵称：' + nickname;
							$("#salesmanAlert").css('color', 'green');
							$("#mobilePhoneNo").attr('name', result[0].id);
						}
						$("#salesmanAlert").html(Alert);
					}
				});
				
			} else {
				Alert = "该用户不存在！";
				$("#mobilePhoneNo").attr('name','');
				//$("#mobilePhoneNo").val('请输入11位手机号');
				$("#mobilePhoneNo").css('color', '#999');
				$("#salesmanAlert").css('color', 'red');
				$("#salesmanAlert").html(Alert);
			}
			
		}
	});
}
/*
 * input值监控函数  输入11位手机号后立即进行查询
 */
function OnInput(event,tage) {
	var value = event.target.value;
	var len = value.length;
	html = "请输入11位手机号";
	if (len == 11) {
		if(tage=='owner'){
			SearchName();
		}
		if (tage=='sale') {
			SearchSale();
		}
		if (tage=='Salesman') {
			SearchSalesman();
		}
	}else{
		if(tage=='owner'){
			$("#Alert").html(html);
			$("#owner").attr('name','');
			$("#owner").css('color', '#999');
			$("#Alert").css('color', 'red');
		}
		if(tage=='sale'){
			$("#saleAlert").html(html);
			$("#salesman").attr('name','');
			$("#salesman").css('color', '#999');
			$("#saleAlert").css('color', 'red');
		}
		if(tage=='Salesman'){
			$("#salesmanAlert").html(html);
			$("#salesmanAlert").css('color', 'red');
			$("#mobilePhoneNo").attr('name','');
			$("#mobilePhoneNo").css('color', '#999');
		}
	}
}