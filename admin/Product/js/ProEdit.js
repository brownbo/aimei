/**
 * Created by zhengyinhua on 15-9-13.
 */
$(document).ready(
	function() {
        ShowFather(ProductType,'typeName','productTypeParent');
		ShowPrice();
		ProImg(); //开启图片预览
		EditMain();
	}
);
var Product = AV.Object.extend("Product");
var ProductType = AV.Object.extend("ProductType");
var City = AV.Object.extend("City");
var SortingCenter = AV.Object.extend("SortingCenter");
var StoreType = AV.Object.extend("StoreType");
var ListStart = new Array(); //储存产品修改前的信息 以便后面比较是否需要更改
var CheckStart = new Array(); //储存storeType之前的checked对象
function EditMain() {
		//自动填入当前产品的相关信息---------------
		var ProID = geturl();
		var ProQuery = new AV.Query(Product);
		ProQuery.include('city');
		ProQuery.include('productType');

		ProQuery.include('sortingCenter');
		ProQuery.get(ProID, {
			success: function(result) {
				// 成功获得实例
				var obj = result;
				var productName = '';
				if (obj.get('productName')) {
					productName = obj.get('productName');
				}


				var productImg = '';
				if (obj.get("productImg")) {
					var productUrl = obj.get("productImg");
					productImg = productUrl.url();
				}
				var productID = '';
				if (obj.get("productID")) {
					productID = obj.get("productID");
				}

                /*var parent = '';
                if (obj.get("productType")) {
                    parent = obj.get("productType").get('typeName');
                }*/

				var orderNumber = '';
				if (obj.get("orderNumber")) {
					orderNumber = obj.get("orderNumber");
				}

				var unitString = '';
				if (obj.get("unitString")) {
					unitString = obj.get("unitString");
				}
				var unitPrice = '';
				if (obj.get("unitPrice")) {
					unitPrice = obj.get("unitPrice");
				}
			//alert(1)
				var productTypeID = '';
				if (obj.get("productType")) {
					productTypeID = obj.get('productType').id;
				}
				/*var sortingCenterID = '';
				if (obj.get("sortingCenter")) {
					sortingCenterID = obj.get('sortingCenter').id;
				}*/
				var ProductDescription = '';
				if (obj.get("ProductDescription")) {
					ProductDescription = obj.get('ProductDescription');
				}
				var productPrice = '';
				if (obj.get("productPrice")) {
					productPrice = obj.get('productPrice');
				}
				var onsell = '';
				if (obj.get("onsell")) {
					onsell = obj.get('onsell');
				}
				/*var isIndividualPackage = '';
				if (obj.get("isIndividualPackage")) {
					isIndividualPackage = obj.get('isIndividualPackage');
				}*/
				var relation = '';
				/*if (result.relation('storeType')) {
					relation = result.relation('storeType');
					relation.query().find({
						success: function(results) {
							for (var i = 0; i < results.length; i++) {
								result = results[i];
								CheckStart.push(result.id);
							}
							ShowCheckboxs(StoreType, 'stoTypeTD', CheckStart);
						},
						error: function(obj, error) {}
					});
				}*/
				//加入修改前的信息到数组 以便提交时进行比较
				ListStart['productName'] = productName;
				ListStart['productID'] = productID;
				/*ListStart['cityID'] = cityID;*/
				ListStart['productTypeID'] = productTypeID;
				ListStart['productPrice'] = productPrice;
				/*ListStart['packageString'] = packageString;
				ListStart['unitPerPackage'] = unitPerPackage;*/
				ListStart['unitString'] = unitString;
				ListStart['unitPrice'] = unitPrice;
				ListStart['ProductDescription'] = ProductDescription;
			/*	ListStart['sortingCenterID'] = sortingCenterID;*/
				ListStart['relation'] = relation;
				ListStart['onsell'] = onsell;
			//	ListStart['isIndividualPackage'] = isIndividualPackage;
				//设置默认值
				$("#productName").val(productName);
				$("#productID").val(productID);
				$("#orderNumber").val(orderNumber);

				//显示下拉框并且设置产品对应属性------------------------------
				ShowSelect(ProductType, 'typeName', 'productType', productTypeID); //产品类型
                ShowFather(ProductType,'typeName','productTypeParent',productTypeID);

			/*	ShowSelect(City, 'cityName', 'city', cityID); //城市
				ShowSelect(SortingCenter, 'scName', 'sortingCenter', sortingCenterID); //分拣中心
			*/

				/*$("#packageString").val(packArray[0]);
				$("#unitPerPackage").val(unitPerPackage);*/
                /*alert(parent);
                $('#productTypeParent').val(parent);*/
				$("#unitString").val(unitString);
				$("#unitPrice").val(unitPrice);
				$("#ImgPr").attr('src', productImg);
				$("#ProductDescription").val(ProductDescription);
			/*	$("#productPrice").val(productPrice);*/
				if (onsell) {
					var onsell_str = 'true';
				} else {
					var onsell_str = 'false';
				}
			/*	if (isIndividualPackage) {
					var isIndividualPackage_str = 'true';
				} else {
					var isIndividualPackage_str = 'false';
				}*/
				var temponsell = "input[type=radio][name=onsell][value=" + onsell_str + "]";
				$(temponsell).attr("checked", 'checked');

			},
			error: function(result, error) {
				// 失败了.
			}
		});
	}


function bindFather(id){   //绑定父级菜单
    var query=new AV.Query(ProductType);
    query.equalTo('objectId',id);
    query.include('parent');
    query.find({
        success:function(object){
            var father=object[0].get('parent').get('typeName')==null?'':object[0].get('parent').get('typeName');
           // alert(object[0].get('parent').get('typeName'))
            if(father!='')
            {

               // alert(1);
                $("#productTypeParent option[value='"+object[0].get('parent').id+"']").attr("selected", "selected");
              //  $("#productTypeParent").find("option[text='"+father+"']").attr("selected",true);
            //    $('#productTypeParent').val(father);
            }
        }
    });
}
    //--------------提交修改------------



function ProEdit() {
		//设置按钮样式 表示正在提交并且禁用按钮
		subStart();
		//获取提交时  的字段信息
        var storeTypeC= $('input:radio[name="storeType"]:checked').val();

		var productName = $('#productName').val();
		var productID = $('#productID').val();
		var productTypeID = $('#productType option:selected').val();
	/*	var cityID = $('#city option:selected').val();*/
		var orderNumber = $('#orderNumber').val();
		var productPrice = $('#productPrice').val();
		/*var packageString = $('#packageString').val() + $('#pack').text();
		var unitPerPackage = $('#unitPerPackage').val();*/
		var unitPrice = $('#unitPrice').val();
	/*	var sortingCenterID = $('#sortingCenter option:selected').val();*/
		var unitString = $('#unitString').val();
		var productImg = $("#productImg")[0];
		var ProductDescription = $('#ProductDescription').val();
		//---获取checkbox选中
		/*var CheckList = new Array();
		$("#stoTypeTD input[type=checkbox]").each(function() {
			if (this.checked) {
				CheckList.push($(this).val());
			}
		});*/
		var onsell_str = $('input[name="onsell"]:checked').val();
		if (onsell_str == 'true') { //字符串的true和false装换为bool的。
			var onsell = true;
		} else {
			var onsell = false;
		}
		/*var isIndividualPackage_str = $('input[name="isIndividualPackage"]:checked').val();
		if(isIndividualPackage_str=='true'){  //字符串的true和false装换为bool的。
			var isIndividualPackage=true;
		}else{
			var isIndividualPackage=false;
		}*/
       /* if(storeTypeC==null)
        {
            subEnd();
            alert('产品业态没有选择！');
            return false;
        }*/
		if (productName == '') {
			subEnd();
			alert('产品名称不能为空！');
			return false;
		}
		if (productID == '') {
			subEnd();
			alert('产品ID不能为空！');
			return false;
		}
		if(orderNumber!=''){
			if(isNaN(orderNumber)){
		 		alert('产品编号必须为数字！');
				subEnd();
				return false;
			}
		}
		if (unitString == '') {
			subEnd();
			alert('计量单位不能为空！');
			return false;
		}
		if (unitPrice == '') {
			subEnd();
			alert('单位单价不能为空！');
			return false;
		} else {
			if (isNaN(unitPrice)) {
				alert('单位单价必须为数字！');
				subEnd();
				return false;
			}
		}
		/*if (unitPerPackage == '') {
			alert('每包装含单位数量不能为空！');
			subEnd();
			return false;
		} else {
			if (isNaN(unitPerPackage)) {
				alert('每包装含单位数量格式必须为数字！');
				subEnd();
				return false;
			}
		}*/
	/*	if ($('#packageString').val() == '') {
			alert('包装规格名称不能为空！');
			subEnd();
			return false;
		}*/

		/*if (CheckList.length == 0) {
			alert('所属业态类型至少选择其一！');
			subEnd();
			return false;
		}*/
		if (ProductDescription == '') {
			if (confirm("产品描述为空是否继续提交？") == false) {
				subEnd();
				return false;
			}

		}
		//------------正式提交数据-------
		var ProID = geturl(); //获取ID
		var ProductQuery = new AV.Query(Product);
		ProductQuery.get(ProID, {
			success: function(pro) {
				//如果字段没有修改 则不需要再更新该字段
				if (ListStart['productName'] != productName) {
					pro.set('productName', productName);
				}
				if (ListStart['productID'] != productID) {
					pro.set('productID', productID);
				}
				/*if (ListStart['packageString'] != packageString) {
					pro.set('packageString', packageString);
				}
				if (ListStart['unitPerPackage'] != unitPerPackage) {
					pro.set('unitPerPackage', parseFloat(unitPerPackage));
				}*/
				if (ListStart['productTypeID'] != productTypeID) {
					var NewProductType = new ProductType();
					NewProductType.id = productTypeID;
					pro.set('productType', NewProductType);
				}
				/*if (ListStart['cityID'] != cityID) {
					var City = AV.Object.extend("City");
					var City = new City();
					City.id = cityID;
					pro.set('city', City);
				}*/
				if (ListStart['unitString'] != unitString) {
					pro.set('unitString', unitString);
				}
				/*if (ListStart['sortingCenterID'] != sortingCenterID) {
					var NewSortingCenter = new SortingCenter();
					NewSortingCenter.id = sortingCenterID;
					pro.set('sortingCenter', NewSortingCenter);
				}*/
				if (ListStart['productPrice'] != productPrice) {
					pro.set('productPrice', parseFloat(productPrice));
				}
				if (ListStart['unitPrice'] != unitPrice) {
					pro.set('unitPrice', parseFloat(unitPrice));
				}
				if (ListStart['ProductDescription'] != ProductDescription) {
					pro.set('ProductDescription', ProductDescription);
				}
				if (ListStart['onsell'] != onsell) {
					pro.set('onsell', onsell);
				}
				/*if (ListStart['isIndividualPackage'] != isIndividualPackage) {
					pro.set('isIndividualPackage', isIndividualPackage);
				}*/
                pro.set('priceBelongTo', parseInt(storeTypeC));
				pro.set('orderNumber', parseInt(orderNumber)); //设置product 序列
				/*var relation = pro.relation("storeType");
				for (var i = 0; i < CheckStart.length; i++) {
					var typeid = CheckStart[i];
					var NewStoreType1 = new StoreType();
					NewStoreType1.id = typeid;
					relation.remove(NewStoreType1);
				}*/
				if (productImg.files.length > 0) { //如果上传图片 则更新图片
					var file = productImg.files[0];
					var name = "avatar.jpg";
					var avFile = new AV.File(name, file);
					avFile.save().then(function() {
						pro.set('productImg', avFile);
						pro.save(null, { //保存更新的对象
							success: function(pro) {
								// 成功保存之后，执行其他逻辑.
								/*for (var i = 0; i < CheckList.length; i++) {
									var typeid = CheckList[i];
									var NewStoreType = new StoreType();
									NewStoreType.id = typeid;
									relation.add(NewStoreType);
								}*/
								pro.save(null, {
									success: function(obj) {
										subEnd(); //按钮设为启用
										alert('修改成功！');
										history.back(-1);
									},
									error: function(pro, error) {
										subEnd(); //按钮设为启用
										alert('修改失败，请重试！', error);
									}
								});
							},
							error: function(pro, error) {
								subEnd(); //按钮设为启用
								alert('修改失败，请重试！', error);
							}
						});
					}, function(error) {
						alert('上传图片失败！');
					});
				} else { //如果没有更新图片 则更新其他字段
					pro.save(null, {
						success: function(obj) {
							/*for (var i = 0; i < CheckList.length; i++) {
								var typeid = CheckList[i];
								var NewStoreType = new StoreType();
								NewStoreType.id = typeid;
								relation.add(NewStoreType);
							}*/
							pro.save(null, {
								success: function(obj) {
									subEnd(); //按钮设为禁用
									alert('修改成功！');
									history.back(-1);
								},
								error: function(pro, error) {
									subEnd(); //按钮设为禁用
									alert('修改失败，请重试！', error);
								}
							});
						},
						error: function(obj, error) {
							alert('修改失败，请重试！');
							subEnd();
						}
					});
				}
			},
			error: function(obj, error) {
				alert('打开编辑窗失败！');
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

//--------------提交后 按钮的变化  禁用 样式变化------------
function subStart() {
	$("#subButton").attr("disabled", "disabled"); //按钮禁用
	$("#subButton").css("background-color", "rgb(19, 16, 16)");
}

function subEnd() {
		$("#subButton").removeAttr("disabled"); //将按钮可用	
		$("#subButton").css('background-color', 'rgb(66, 139, 202)');
	}
	//---------本地显示上传 的图片----------------

function ProImg() {
	$("#productImg").change(function() {
			var objUrl = getObjectURL(this.files[0]);
			if (objUrl) {
				$("#ImgPr").attr("src", objUrl);
			}
		})
		//建立一个可存取到该file的url

	function getObjectURL(file) {
		var url = null;
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	}
}

//显示各种下拉框列表------并选中该产品的属性值----
function ShowSelect(obj, name, id, SelectedValue) {
		var html_op = '';
		var Query = new AV.Query(obj);
        if(obj==ProductType)
        {
            //alert(2);
            Query.equalTo("level",2);
            Query.equalTo("enabled",true);
          //  Query.include("ProductType");
        }
		Query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) {
					result = results[i];
					var MyName = result.get(name);
					html_op += '<option value=\"' + result.id + '\">' + MyName + '</option>';
				}
				//为防止异步 ，显示下拉框和选择下拉框先后紧跟实现。
				var strID = '#' + id;
				$(strID).html(html_op); //显示所有下拉列表
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
				var typeName = result.get('typeName');
				html += '<input type="checkbox" name="storeType" value=\"' + result.id + '\">' + typeName + ' ';
			}
			var strID = '#' + id;
			$(strID).html(html);
			for (var i = 0; i < checkeds.length; i++) {
				$(":checkbox[value='" + checkeds[i] + "']").prop("checked", true);
			}
		}
	});
}

function ShowPrice() {
	$("#unitPrice").change(function() {
		var unitPrice = $(this).val();
		var unitPerPackage = $("#unitPerPackage").val();
		var productPrice = unitPrice * unitPerPackage;
		$("#productPrice").val(productPrice.toFixed(2));
	});
	$("#unitString").change(function() { //动态显示 包装规格
		var unitString = $(this).val();
		var unitPerPackage = $("#unitPerPackage").val();
		var pack = "(" + unitPerPackage + " " + unitString + "装)";
		$("#pack").text(pack);
	});
	$("#unitPerPackage").change(function() {
		var unitPerPackage = $(this).val();
		var unitPrice = $("#unitPrice").val();
		var productPrice = unitPrice * unitPerPackage;
		$("#productPrice").val(productPrice.toFixed(2));

		var unitString = $("#unitString").val(); //动态显示 包装规格
		var pack = "(" + unitPerPackage + " " + unitString + "装)";
		$("#pack").text(pack);
	});
}

function ShowFather(obj,name,id,typeId){

    var html_op = '';
    var Query = new AV.Query(obj);
    if(obj==ProductType)
    {
        //alert(2);
        Query.equalTo("level",1);
        Query.equalTo("enabled",true);
    }

    Query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                result = results[i];
                var MyName = result.get(name);
                html_op += '<option value=\"' + result.id + '\">' + MyName + '</option>';
            }
            var strID='#'+id;
            $(strID).html(html_op);
           // alert(1)
            if(obj==ProductType)
            {
                bindFather(typeId);
               // alert(2)
            }
        }
    });

}
function changeOption(obje){
 //   alert(obje.value);
    var html_op = '';
    var Query = new AV.Query(ProductType);

    //alert(2);
    Query.equalTo("level",2);
    Query.equalTo("enabled",true);


    var type=new ProductType();
    type.id=obje.value;
    Query.equalTo("parent",type);

    Query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                var  result = results[i];
                var MyName = result.get('typeName');
                html_op += '<option value=\"' + result.id + '\">' + MyName + '</option>';
            }

            $('#productType').html(html_op);
        }
    });
}