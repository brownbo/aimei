/**
 * Created by zhengyinhua on 15-9-7.
 */
$(document).ready(
	function() {
		ProImg(); //开启图片预览
		main();
		//绑定配送方式事件
		$("input:radio[name='paymentTerm']").change(function() {
			var value = $("input:radio[name='paymentTerm']:checked").val();
			if (value == 2) {
				$(".display").css("visibility", "visible");
			} else {
				$(".display").css("visibility", "hidden");
			}
		});
	}
);
function main() {
		ShowSelectValue(StoreType,'typeName','storeType');//显示storeType
		ShowSelectValue(City,'cityName','city');//显示city
		ShowSelectValue(DistributionCenter,'dcName','storeDC');//DistributionCenter
		ShowSelectValue(DeliveryRoute,'routeName','storeRoute');//显示storeType
		ShowCheckboxs(StoreGroup,'storeGroups');//显示业态多选框	
		
}
	//查询人员----------------------

//提交表格-------------------------
function addRes() {
	subStart();//设置按钮禁用
	var flag = false; //标记输入字段是否为空
	var storeName = $('#storeName').val();
	var storeRouteID = $('#storeRoute option:selected').val();
	var storeTypeID = $('#storeType option:selected').val();
	var storeAddress = $('#storeAddress').val();
	var storeDCID = $('#storeDC option:selected').val();
	var cityID = $('#city option:selected').val();
	var storeContact = $('#storeContact').val();
	var contactName = $('#contactName').val();
	var storePosition = $('#storePosition').val();
	var storeImage = $("#storeImage")[0];
	var ownerID = $('#owner').attr('name');
	var paymentDays = $('#paymentDays').val();
	var salesmanID = $('#salesman').attr('name');
	var earlyTime = $('#earlyTime').val();
	var latestTime = $('#latestTime').val();
	var storeNumber = $('#storeNumber').val();
	
	var NewSro = new store();
	//---获取storegroups checkbox选中项
	var CheckList=new Array();
	$("#storeGroups input[type=checkbox]").each(function(){
    	if(this.checked){
    		CheckList.push($(this).val());
    	}
	});
	var len=CheckList.length;
	
	var paymentTerm=$("input:radio[name='paymentTerm']:checked").val();
	
	//----------输入格式判断------------
	if (storeName == '') {
		alert('餐厅名称不能为空！');
		subEnd();
		return false;
	}
	/*if (storeAddress == '') {
		subEnd();
		alert('餐厅地址不能为空！');
		return false;
	}*/
	var isphone=/^(\d{8}|\d{7})$/;
	var ismobile=/^(((1[0-9][0-9]{1})|159|153)+\d{8})$/;
	if (storeContact == '') {
		//subEnd();
		//alert('联系方式不能为空！');
		//return false;
	}
	else if(!storeContact.match(isphone)&&!storeContact.match(ismobile)) { 
		alert('请输入11位手机号或固话(1234578)!');
		subEnd();
		return false;
	}
	if (ownerID == '') {
		alert('请输入正确的管理员用户名(手机号)！');
		subEnd();
		return false;
	}
	if (paymentDays == '') {
		//alert('授予账期不能为空！');
		//subEnd();
		//return false;
	}else if(isNaN(paymentDays)){
		alert('授予账期必须为数字！');
		subEnd();
		return false;
	}
	if (earlyTime == '') {
		alert('最早收货时间不能为空！');
		subEnd();
		return false;
	}
	if (latestTime == '') {
		alert('最晚收货时间不能为空！');
		subEnd();
		return false;
	}
	if(len==0){
		if(!confirm("未选择加入分组是否继续提交？")){
			subEnd();
			return false;
		}
	}
	//------------正式提交数据-------
	var NewRoute = new DeliveryRoute();
	NewRoute.id = storeRouteID;
	
	var DCenter = new DistributionCenter();
	DCenter.id = storeDCID;

	var owner = new User();
	owner.id = ownerID;

	var City = AV.Object.extend("City");
	var City = new City();
	City.id = cityID;

	var Mysalesman=new Salesman();
	Mysalesman.id=salesmanID;
	
	var NewStoreType=new StoreType();
	NewStoreType.id=storeTypeID;
	
	//获取时间Date 填充2个时间段
	var H = parseInt(earlyTime.substring(0, 2));
	var M = parseInt(earlyTime.substring(3, 5));
	var myearlyTime = new Date(2007,0,9);
	myearlyTime.setHours(H);
	myearlyTime.setMinutes(M);

	var H_l = parseInt(latestTime.substring(0, 2));
	var M_l = parseInt(latestTime.substring(3, 5));
	var mylatestTime = new Date(2007,0,9);
	mylatestTime.setHours(H_l);
	mylatestTime.setMinutes(M_l);
	NewSro.set('storeName', storeName);
	NewSro.set('storeRoute', NewRoute);
	NewSro.set('storeType', NewStoreType);
	NewSro.set('storeAddress', storeAddress);
	NewSro.set('storeDC', DCenter);
	NewSro.set('city', City);
	NewSro.set('storeContact', parseInt(storeContact));
	NewSro.set('contactName',contactName);
	//NewSro.set('storePosition',storePosition);
	NewSro.set('owner', owner);
	NewSro.set('salesman', Mysalesman);
	NewSro.set('paymentDays', parseInt(paymentDays));
	NewSro.set('earlyTime', myearlyTime);
	NewSro.set('latestTime', mylatestTime);
	if(storeNumber!=''){
		NewSro.set('storeNumber', parseInt(storeNumber));
	}
	if(paymentTerm=='1'){
		NewSro.set('paymentTerm', 1);
		NewSro.set('payeeTerm', 1);
	}else{
		var payeeTerm=$("input:radio[name='payeeTerm']:checked").val();
		NewSro.set('paymentTerm', 2);
		NewSro.set('payeeTerm', parseInt(payeeTerm));
	}
	var relation=NewSro.relation("storeGroups");
	for(var i=0;i<len;i++){
		var Mygroup=new StoreGroup();
		var groupID=CheckList[i];
		Mygroup.id=groupID;
		relation.add(Mygroup);
	}
	
	//-----图片上传成功过后 才保存对象 否则异步
	if(storeImage.files.length >0){  //如果上传图片 则更新图片
  		var file = storeImage.files[0];
  		var name = "avatar.jpg";
  		var avFile = new AV.File(name,file);
  		avFile.save().then(function() {
  			NewSro.set('storeImage',avFile);
  			NewSro.save(null, {      //保存更新的对象
 			success: function(post) {
    		// 成功保存之后，执行其他逻辑.
    			subEnd();//按钮设为禁用
    			alert('增加成功！');
    			history.go(-1);
  			},
  			error: function(post, error) { 			
    			alert('增加失败，请重试！');
    			subEnd();//按钮设为可用
  			}
		});
		}, function(error) {
  			alert('上传图片失败！');
  			subEnd();//按钮设为可用
		});
	}
	else{   //如果没有更新图片 则更新其他字段
		NewSro.save(null,{
			success: function(obj){
			subEnd();//按钮设为可用
			alert('增加成功！');
			history.back(-1);
			},
			error: function(obj,error){
				alert('增加失败，请重试！'+error.message);
				subEnd();//按钮设为可用
			}
		});
	}
}

