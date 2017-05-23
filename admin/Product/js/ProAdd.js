/**
 * Created by zhengyinhua on 15-9-13.
 */
$(document).ready(
	function() {
		ShowPrice();//产品总价 随着产品单价 和数量 变化而变化 而不是用户自己输入
		ProImg(); //开启图片预览
		main();
	}
);
//页面加载后执行--------全局 申明-------
var Product = AV.Object.extend("Product");
var ProductType = AV.Object.extend("ProductType");
var City = AV.Object.extend("City");
var SortingCenter = AV.Object.extend("SortingCenter");
var StoreType = AV.Object.extend("StoreType");
/*var PROSUM=0;//储存产品总数*/
function main() {
		ShowSelectValue(ProductType,'typeName','productType');//显示productType
        ShowFather(ProductType,'typeName','productTypeParent');
	/*	ShowSelectValue(City,'cityName','city');//显示city
		ShowSelectValue(SortingCenter,'scName','sortingCenter');//显示分拣中心*/
	//	ShowCheckboxs(StoreType, 'stoTypeTD');//显示业态多选框
      //  showStoreType();//显示业态多选框
     //   $('input:radio[name="storeType"]').eq(1).attr("checked",'checked');
}
function showStoreType(){
   // var list= $('input:radio[name="storeType"]:checked').val();
  //  alert(list);
}
//提交表格-------------------------
function addPro() {
	subStart();//设置按钮禁用
	var productName = $('#productName').val();
	var productID = $('#productID').val();
	var productTypeID = $('#productType option:selected').val();
	var orderNumber = $('#orderNumber').val();
	/*var cityID = $('#city option:selected').val();*/
//	var productPrice = $('#productPrice').val();
/*	var packageString = $('#packageString').val()+$('#pack').text();
	var unitPerPackage = $('#unitPerPackage').val();*/
	var unitPrice = $('#unitPrice').val();
	/*var sortingCenterID = $('#sortingCenter option:selected').val();*/
	var unitString = $('#unitString').val();
	var productImg = $("#productImg")[0];
	var ProductDescription = $('#ProductDescription').val().substring(0,25);

  /*  var storeTypeC= $('input:radio[name="storeType"]:checked').val();
*/
	//---获取checkbox选中项
	var CheckList=new Array();
	$("#stoTypeTD input[type=checkbox]").each(function(){
    	if(this.checked){
    		CheckList.push($(this).val());
    	}
	});
	//验证输入格式是否正确 或者是否没有输入
	/*if(ProductDescription.length > 25){
    	ProductDescription=ProductDescription.substring(0,25);
    }*/
/*	var productPrice = $('#productPrice').val();*/
	var onsell_str = $('input[name="onsell"]:checked').val();
	if(onsell_str=='true'){  //字符串的true和false装换为bool的。
		var onsell=true;
	}else{var onsell=false;}
	/*var isIndividualPackage_str = $('input[name="isIndividualPackage"]:checked').val();
	if(isIndividualPackage_str=='true'){  //字符串的true和false装换为bool的。
		var isIndividualPackage=true;
	}else{var isIndividualPackage=false;}*/
	
	//----------输入格式判断------------
    /*if(storeTypeC==null)
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
	}else{
		 if(isNaN(unitPrice)){
		 	alert('单位单价必须为数字！');
			subEnd();
			return false;
		 }
	}
	/*if(unitPerPackage==''){
		alert('每包装含单位数量不能为空！');
		subEnd();
		return false;
	}else{
		 if(isNaN(unitPerPackage)){
		 	alert('每包装含单位数量格式必须为数字！');
			subEnd();
			return false;
		 }
	}
	if($('#packageString').val()==''){
		alert('包装规格名称不能为空！');
		subEnd();
		return false;
	}*/
	/*if(CheckList.length==0){
		alert('所属业态类型至少选择其一！');
		subEnd();
		return false;
	}*/
	if(productImg.files.length <= 0){
		alert('产品图片不能为空！');
		subEnd();
		return false;
	}
	if (ProductDescription == '') {
			if (confirm("产品描述为空是否继续提交？")==false) {
				subEnd();
				return false;
			}
			
	}
	//------------正式提交数据-------
	/*var NewSc = new SortingCenter();
	NewSc.id = sortingCenterID;
	
	
	var NewCity = new City();
	NewCity.id = cityID;*/

	var proType = new ProductType();
	proType.id = productTypeID;
	
	var NewProduct = new Product();
	NewProduct.set('productName',productName);
	NewProduct.set('productID',productID);
	if (orderNumber!=''){
		NewProduct.set('orderNumber',parseInt(orderNumber));//设置product 序列
	}
	NewProduct.set('productType',proType);
/*	NewProduct.set('city', NewCity);
	NewProduct.set('sortingCenter', NewSc);*/
	
	/*NewProduct.set('packageString', packageString);
	NewProduct.set('unitPerPackage', parseFloat(unitPerPackage));
	NewProduct.set('unitString', unitString);*/

   /* NewProduct.set('priceBelongTo', parseInt(storeTypeC));*///绑定业态
    NewProduct.set('unitString', unitString);
	NewProduct.set('unitPrice', parseFloat(unitPrice));
	NewProduct.set('ProductDescription',ProductDescription);
//	NewProduct.set('productPrice',parseFloat(productPrice));
	NewProduct.set('onsell',onsell);
/*	NewProduct.set('isIndividualPackage',isIndividualPackage);*/
	/*var relation=NewProduct.relation("storeType");
     for(var i=0;i<CheckList.length;i++){
     var MyType=new StoreType();
     var typeID=CheckList[i];
     MyType.id=typeID;
     relation.add(MyType);
     }*/
	var file = productImg.files[0];
	var name = "avatar.jpg";
	var avFile = new AV.File(name, file);
	avFile.save().then(function() {
		NewProduct.set('productImg', avFile);
		NewProduct.save(null, {
			success: function(post) {
				// 成功保存之后，执行其他逻辑.
				subEnd();
				alert('增加成功！');
				history.back(-1);
			},
			error: function(post, error) {
				alert('增加失败，请重试！');
			}
		});
	}, function(error) {
		alert('上传失败！'+error.message);
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

function changeOption(obje){
   // alert(obje.value);
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

function ShowSelectValue(obj,name,id,searchId){

	var html_op = '';
	var Query = new AV.Query(obj);
    if(obj==ProductType)
    {
        //alert(2);
        Query.equalTo("level",2);
        Query.equalTo("enabled",true);
    }
    if(searchId!=null)
    {
        var type=new ProductType();
        type.id=searchId;
        Query.equalTo("parent",type);
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
		}
	});

}

function ShowFather(obj,name,id){

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
        }
    });

}
function ShowCheckboxs(ClassType, id) {
	var html = '';
	var Query = new AV.Query(ClassType);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var typeName = result.get('typeName');
				if(i==0){
					html += '<input type="checkbox" name="storeType"  value=\"' + result.id + '\" checked>' + typeName + ' ';
				}
				else{
					html += '<input type="checkbox" name="storeType" value=\"' + result.id + '\">' + typeName + ' ';
				}
			}
			var strID = '#' + id;
			$(strID).html(html);
			
		}
	});
}
function ShowProNum() {
	$("#productType").change(function() {
		var TypeID = $(this).val();
		var query = new AV.Query(Product);
		var MyproType = new ProductType();
		MyproType.id = TypeID;
		query.equalTo('productType', MyproType);
		query.count({
			success: function(count) {
				$("#orderNumber").val(count + 1);
			}
		});
	});
}
function ShowPrice(){
	$("#unitPrice").change(function(){
		var unitPrice = $(this).val();
		var unitPerPackage=$("#unitPerPackage").val();
	//	var productPrice=unitPrice*unitPerPackage;
	//	$("#productPrice").val(productPrice.toFixed(2));
	});
	var unitString="";
	var unitPerPackage="";
	$("#unitString").change(function(){
		unitString = $(this).val();
		var pack="("+unitPerPackage+" "+unitString+"装)";
		$("#pack").text(pack);
	});
	$("#unitPerPackage").change(function(){
		unitPerPackage = $(this).val();
		var unitPrice=$("#unitPrice").val();
	//	var productPrice=unitPrice*unitPerPackage;
	//	$("#productPrice").val(productPrice.toFixed(2));
		var pack="("+unitPerPackage+" "+unitString+"装)";
		$("#pack").text(pack);
	});
}
/*function getProNum(){
	var query = new AV.Query(Product);
	query.limit(1000);
	query.count({
		success:function(count){
			PROSUM=count;
		}
	});
}*/