/**
 * Created by zhengyinhua on 15-9-11.
 */
$(document).ready(
	function() {
		ProImg(); //开启图片预览
		EditMain();
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
var ListStart = new Array(); //储存餐厅修改前的信息 以便后面比较是否需要更改
var CheckStart = new Array(); //储存storeType之前的checked对象
function EditMain() {
		//自动填入当前餐厅的相关信息---------------
		var SroID = geturl();
		var SroQuery = new AV.Query(store);
		SroQuery.include('storeDC');
		SroQuery.include('city');
		SroQuery.include('owner');
		SroQuery.include('storeRoute');
		SroQuery.include('salesman');
		SroQuery.get(SroID, {
			success: function(result) {
				// 成功获得实例
				var obj = result;
				var storeName = "";
				if (obj.get('storeName')) {
					storeName = obj.get('storeName');
				}
				var storeRouteID = "";
				if (obj.get('storeRoute')) {
					storeRouteID = obj.get('storeRoute').id;
				}
				var storeTypeID = "";
				if (obj.get('storeType')) {
					storeTypeID = obj.get('storeType').id;
				}
				var storeAddress = "";
				if (obj.get('storeAddress')) {
					storeAddress = obj.get('storeAddress');
				}
				var storeDCID = "";
				if (obj.get('storeDC')) {
					storeDCID = obj.get('storeDC').id;
				}
				var DCID = "";
				if (obj.get('storeDC')) {
					DCID = obj.get('storeDC').id;
				}
				var cityID = "";
				if (obj.get('city')) {
					cityID = obj.get('city').id;
				}
				var contactName = "";
				if (obj.get('contactName')) {
					contactName = obj.get('contactName');
				}
				var storeContact = "";
				if (obj.get('storeContact')) {
					storeContact = obj.get('storeContact');
				}
				var storeImage = "";
				if (obj.get('storeImage')) {
					storeImage = obj.get("storeImage").url();
				}
				var owner = "";
				var ownerID = '';
				var ownerNickName = '';
				if (obj.get('owner')) {
					owner = obj.get("owner").get('username');
					ownerID = obj.get("owner").id;
					ownerNickName = obj.get("owner").get('nickname');
				}
				var paymentDays = "";
				if (obj.get('paymentDays')) {
					paymentDays = obj.get("paymentDays");
				}
				var salesmanName = "";
				var mobilePhoneNo = "";
				var salesmanID = '';
				if (obj.get('salesman')) {
					salesmanName = obj.get("salesman").get('salesmanName');
					mobilePhoneNo = obj.get("salesman").get('mobilePhoneNo');
					salesmanID = obj.get("salesman").id;
				}
				var earlyTime = "";
				if (obj.get('earlyTime')) {
					earlyTime = ToTime(obj.get('earlyTime'));
				}
				var latestTime = "";
				if (obj.get('latestTime')) {
					latestTime = ToTime(obj.get('latestTime'));
				}
				var storeNumber = "";
				if (obj.get('storeNumber')) {
					storeNumber = obj.get("storeNumber");
				}
				var paymentTerm = "";
				if (obj.get('paymentTerm')) {
					paymentTerm = obj.get("paymentTerm");
				}
				var payeeTerm = "";
				if (obj.get('payeeTerm')) {
					payeeTerm = obj.get("payeeTerm");
				}
				var relation = '';
				if (result.relation('storeGroups')) {
					relation = result.relation('storeGroups');
					relation.query().find({
						success: function(results) {
							for (var i = 0; i < results.length; i++) {
								result = results[i];
								CheckStart.push(result.id);
							}
							ShowCheckboxs(StoreGroup, 'storeGroups', CheckStart);
						},
						error: function(obj, error) {}
					});
				}
				//加入修改前的信息到数组 以便提交时进行比较
				ListStart['storeName'] = storeName;
				ListStart['storeRouteID'] = storeRouteID;
				ListStart['storeTypeID'] = storeTypeID;
				ListStart['storeAddress'] = storeAddress;
				ListStart['storeDCID'] = storeDCID;
				ListStart['DCID'] = DCID;
				ListStart['cityID'] = cityID;
				ListStart['storeContact'] = storeContact;
				ListStart['contactName'] = contactName;
				ListStart['owner'] = owner;
				ListStart['mobilePhoneNo'] = mobilePhoneNo;
				ListStart['earlyTime'] = earlyTime;
				ListStart['latestTime'] = latestTime;
				ListStart['storeNumber'] = storeNumber;
				//设置默认值
				//载入下拉框列表并选择餐厅对应下拉属性----------------------
				ShowSelectValue(StoreType, 'typeName', 'storeType', storeTypeID); //显示storeType
				ShowSelectValue(City, 'cityName', 'city', cityID); //显示city
				ShowSelectValue(DistributionCenter, 'dcName', 'storeDC', DCID); //DistributionCenter
				ShowSelectValue(DeliveryRoute, 'routeName', 'storeRoute', storeRouteID); //显示storeType
				$("#storeAddress").val(storeAddress);
				$("#storeName").val(storeName);
				$("#storeContact").val(storeContact);
				$("#contactName").val(contactName);
				if (ownerID != '') {
					$("#Alert").css('color', 'green');
					$("#owner").css('color', '#000');
					$("#owner").attr('name', ownerID);
					var html_1 = '昵称：' + ownerNickName;
					$("#Alert").html(html_1);
					$("#owner").val(owner);
				}
				if (salesmanID != '') {
					$("#salesman").val(mobilePhoneNo);
					$("#saleAlert").css('color', 'green');
					$("#salesman").css('color', '#000');
					$("#salesman").attr('name', salesmanID);
					var html_2 = '姓名：' + salesmanName;
					$("#saleAlert").html(html_2);
				}
				$("#paymentDays").val(paymentDays);
				$("#ImgPr").attr('src', storeImage);
				$("#earlyTime").val(earlyTime);
				$("#latestTime").val(latestTime);
				$("#storeNumber").val(storeNumber);
				if(paymentTerm=='1'){
					var temp1 = "input[name='paymentTerm'][value=" + 1 + "]";
					$(temp1).attr("checked", 'checked');
				}else{
					$(".display").css("visibility","visible");
					var temp2 = "input[name='paymentTerm'][value=" + 2 + "]";
					$(temp2).attr("checked", 'checked');
					var temp3 = "input[name='payeeTerm'][value=" + payeeTerm + "]";
					$(temp3).attr("checked", 'checked');
				}
			},
			error: function(result, error) {
				// 失败了.
			}
		});
	}
	//--------------提交修改------------

function ResEdit() {
		//设置按钮样式 表示正在提交并且禁用按钮
		subStart();
		//获取提交时 当前页面的字段默认信息
		var storeName = $('#storeName').val();
		var storeRouteID = $('#storeRoute option:selected').val();
		var storeTypeID = $('#storeType option:selected').val();
		var storeAddress = $('#storeAddress').val();
		var storeDCID = $('#storeDC option:selected').val();
		var cityID = $('#city option:selected').val();
		var storeContact = $('#storeContact').val();
		var contactName = $('#contactName').val();
		var storeImage = $("#storeImage")[0];
		var ownerID = $('#owner').attr('name');
		var paymentDays = $('#paymentDays').val();
		var salesmanID = $('#salesman').attr('name');
		var mobilePhoneNo = $('#salesman').val();
		var earlyTime = $('#earlyTime').val();
		var latestTime = $('#latestTime').val();
		var storeNumber = $('#storeNumber').val();
		var paymentTerm=$("input:radio[name='paymentTerm']:checked").val();
		//---获取storegroups checkbox选中项
		var CheckList = new Array();
		$("#storeGroups input[type=checkbox]").each(function() {
			if (this.checked) {
				CheckList.push($(this).val());
			}
		});
		var len = CheckList.length;
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
		var isphone = /^(\d{11}|\d{7}|\d{8})$/;
		var ismobile = /^(((1[0-9][0-9]{1})|159|153)+\d{8})$/;
		if (storeContact == '') {
			//subEnd();
			//alert('联系方式不能为空！');
			//return false;
		} else if (!storeContact.match(isphone) && !storeContact.match(ismobile)) {
			alert('请输入11位手机号或固话(不加区号)!');
			subEnd();
			return false;
		}
		/*if (contactName == '') {
			subEnd();
			alert('联系人名不能为空！');
			return false;
		}*/
		/*if (ownerID == '') {
			subEnd();
			alert('请输入正确的管理员用户名(手机号)！');
			return false;
		}*/
		if (paymentDays == '') {
			//alert('授予账期不能为空！');
			//subEnd();
			//return false;
		} else if (isNaN(paymentDays)) {
			alert('授予账期必须为数字！');
			subEnd();
			return false;
		}
		
		/*if (earlyTime == '') {
			subEnd();
			alert('最早收货时间不能为空！');
			return false;
		}*/
		if (latestTime == '') {
			subEnd();
			alert('最晚收货时间不能为空！');
			return false;
		}
		if (len == 0) {
			if (!confirm("未选择加入分组是否继续提交？")) {
				subEnd();
				return false;
			}
		}
		//------------正式提交数据-------
		var StoID = geturl(); //获取ID
		var StoQuery = new AV.Query(store);
		StoQuery.get(StoID, {
			success: function(Res) {
				//如果字段没有修改 则不需要再更新该字段
				if (ListStart['storeName'] != storeName) {
					Res.set('storeName', storeName);
				}
				if (ListStart['storeRouteID'] != storeRouteID) {
					var DRoute = new DeliveryRoute();
					DRoute.id = storeRouteID;
					Res.set('storeRoute', DRoute);
				}
				if (ListStart['storeTypeID'] != storeTypeID) {
					var StoType = new StoreType();
					StoType.id = storeTypeID;
					Res.set('storeType', StoType);
				}
				if (ListStart['storeAddress'] != storeAddress) {
					Res.set('storeAddress', storeAddress);
				}
				if (ListStart['storeContact'] != parseInt(storeContact)) {
					Res.set('storeContact', parseInt(storeContact));
				}
				if (ListStart['storeDCID'] != storeDCID) {
					var myDCenter = new DistributionCenter();
					myDCenter.id = storeDCID;
					Res.set('storeDC', myDCenter);
				}
				if (ListStart['cityID'] != cityID) {
					var myCity = new City();
					myCity.id = cityID;
					Res.set('city', myCity);
				}
				if (ListStart['ownerID'] != ownerID&&ownerID!='') {
					var owner = new User();
					owner.id = ownerID;
					Res.set('owner', owner);
				}
				if (ListStart['paymentDays'] != parseInt(paymentDays)) {
					Res.set('paymentDays', parseInt(paymentDays));
				}
				if (salesmanID!='') {
					var Mysalesman = new Salesman();
					Mysalesman.id = salesmanID;
					Res.set('salesman', Mysalesman);
				}
				if (ListStart['contactName'] != contactName) {
					Res.set('contactName', contactName);
				}
				if (ListStart['earlyTime'] != earlyTime) {
					var Time = TODate(earlyTime);
					Res.set('earlyTime', Time);
				}
				if (ListStart['latestTime'] != latestTime) {
					var Time = TODate(latestTime);
					Res.set('latestTime', Time);
				}
				if (ListStart['storeNumber'] != storeNumber) {
					Res.set('storeNumber', parseInt(storeNumber));
				}
				if(paymentTerm=='1'){
					Res.set('paymentTerm', 1);
					Res.set('payeeTerm', 1);
				}else{
					var payeeTerm=$("input:radio[name='payeeTerm']:checked").val();
					Res.set('paymentTerm', 2);
					Res.set('payeeTerm', parseInt(payeeTerm));
				}
				var relation = Res.relation("storeGroups");
				for (var i = 0; i < CheckStart.length; i++) {
					var groupid = CheckStart[i];
					var newStoreGroup = new StoreGroup();
					newStoreGroup.id = groupid;
					relation.remove(newStoreGroup);
				}
				
				if (storeImage.files.length > 0) { //如果上传图片 则更新图片
					var file = storeImage.files[0];
					var name = "avatar.jpg";
					var avFile = new AV.File(name, file);
					avFile.save().then(function() {
						Res.set('storeImage', avFile);
						Res.save(null, { //保存更新的对象
							success: function(Res) {
								// 成功保存之后，执行其他逻辑.
								for (var i = 0; i < CheckList.length; i++) {
									var groupid = CheckList[i];
									var newStoreGroup = new StoreGroup();
									newStoreGroup.id = groupid;
									relation.add(newStoreGroup);
								}
								Res.save(null, {
									success: function(Res) {
										subEnd(); //按钮设为禁用
										alert('修改成功！');
										history.go(-1);
									},
									error: function(Res, error) {
										subEnd(); //按钮设为禁用
										alert('修改失败，请重试！', error);
									}
								});
							},
							error: function(Res, error) {
								alert('修改失败，请重试！');
								subEnd(); //按钮设为可用
							}
						});
					}, function(error) {
						alert('上传图片失败！');
						subEnd(); //按钮设为可用
					});
				} else { //如果没有更新图片 则更新其他字段
					Res.save(null, {
						success: function(Res) {
							for (var i = 0; i < CheckList.length; i++) {
								var groupid = CheckList[i];
								var newStoreGroup = new StoreGroup();
								newStoreGroup.id = groupid;
								relation.add(newStoreGroup);
							}
							Res.save(null, {
								success: function(Res) {
									subEnd(); //按钮设为禁用
									alert('修改成功！');
									history.go(-1);
								},
								error: function(Res, error) {
									subEnd(); //按钮设为禁用
									alert('修改失败，请重试！', error);
								}
							});
						},
						error: function(Res, error) {
							alert('修改失败，请重试！' + error.message);
							subEnd(); //按钮设为可用
						}
					});
				}
			},
			error: function(Res, error) {
				alert('打开编辑窗失败！' + error.message);
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
			}

		}
		return gethref;
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

function ShowSelectValue(obj, name, id, SelectedValue) {
		var html_op = '';
		var Query = new AV.Query(obj);
		Query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) {
					result = results[i];
					var MyName = result.get(name);
					html_op += '<option value=\"' + result.id + '\">' + MyName + '</option>';
				}
				var strID = '#' + id;
				$(strID).html(html_op);
				var TempStr = strID + " option[value=\'" + SelectedValue + "\']"; //选中产品对应属性
				$(TempStr).attr("selected", true);
			}
		});
	}
	/*
	 * 显示多选框列表
	 */

function ShowCheckboxs(ClassType, id, checkeds) {
	var html = '';
	var Query = new AV.Query(ClassType);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var groupName = result.get('groupName');
				html += '<input type="checkbox" name="storeGroups" value=\"' + result.id + '\">' + groupName + ' ' + "<br>";
			}
			var strID = '#' + id;
			$(strID).html(html);
			for (var i = 0; i < checkeds.length; i++) {
				$(":checkbox[value='" + checkeds[i] + "']").prop("checked", true);
			}
		}
	});
}