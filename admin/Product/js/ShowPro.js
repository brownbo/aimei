/**
 * Created by zhengyinhua on 15-9-12.
 */
function changeCity(obj){
    view("main");
}
function SorMenu(object){
    /*console.log(object);
    console.log(this);*/
 //   console.log($.session);
  // $.session.clear();
 //   console.log($.session);
    if(object=='ProductUp')
    {
        if($.session.get('ProductUp')==null||$.session.get('ProductUp')==0 )
        {
            $.session.set('ProductUp', 1);
            $(".searchUl").find('li').eq(0).html('<a href="javascript:SorMenu(\'ProductUp\')">时间降序<img style="width: 10px;height: 10px" src="./img/shang.png"></a>');
          /*  $.session.remove('ProductUp');
            $.session.remove('ProductPri');
            $.session.remove('ProductUnitPrice');*/
        }
        else if($.session.get('ProductUp')==1 )
        {
            $.session.set('ProductUp', 0);
            $(".searchUl").find('li').eq(0).html('<a href="javascript:SorMenu(\'ProductUp\')">时间升序<img style="width: 10px;height: 10px" src="./img/xia.png"></a>');
        }
       /* else if($.session.get('ProductUp')==0)
        {
            $.session.set('ProductUp', 1);
            $(".searchUl").find('li').eq(0).html('<a href="javascript:SorMenu(\'ProductUp\')">按时间升序排序</a>');
        }*/

        $(".searchUl").find('li a').eq(0).css("color","rgb(66, 139, 202)");
        $(".searchUl").find('li').eq(1).html('<a href="javascript:SorMenu(\'ProductPri\')">产品价格</a>');
        $(".searchUl").find('li').eq(2).html('<a href="javascript:SorMenu(\'ProductUnitPrice\')">产品单价</a>');
        $.session.remove('ProductPri');
        $.session.remove('ProductUnitPrice');
        view("main",1);
    }
    else if(object=='ProductPri')
    {
        if($.session.get('ProductPri')==null||$.session.get('ProductPri')==0 )
        {
            $.session.set('ProductPri', 1);
            $(".searchUl").find('li').eq(1).html('<a href="javascript:SorMenu(\'ProductPri\')">价格降序<img style="width: 10px;height: 10px" src="./img/shang.png"></a>');

        }else if($.session.get('ProductPri')==1)
        {
            $.session.set('ProductPri', 0);
            $(".searchUl").find('li').eq(1).html('<a href="javascript:SorMenu(\'ProductPri\')">价格升序<img style="width: 10px;height: 10px" src="./img/xia.png"></a>');

        }

     //   $(".searchUl").find('li').eq(1).html('价格由高到低');
        $(".searchUl").find('li a').eq(1).css("color","rgb(66, 139, 202)");
        $(".searchUl").find('li').eq(0).html('<a href="javascript:SorMenu(\'ProductUp\')">更新时间</a>');
        $(".searchUl").find('li').eq(2).html('<a href="javascript:SorMenu(\'ProductUnitPrice\')">产品单价</a>');
        $.session.remove('ProductUp');

        $.session.remove('ProductUnitPrice');
        view("main",1);
    }
    else if(object=='ProductUnitPrice')
    {
        if($.session.get('ProductUnitPrice')==null||$.session.get('ProductUnitPrice')==0 )
        {
            $.session.set('ProductUnitPrice', 1);
            $(".searchUl").find('li').eq(2).html('<a href="javascript:SorMenu(\'ProductUnitPrice\')">单价降序<img style="width: 10px;height: 10px" src="./img/shang.png"></a>');

        }else if($.session.get('ProductUnitPrice')==1)
        {
            $.session.set('ProductUnitPrice', 0);
            $(".searchUl").find('li').eq(2).html('<a href="javascript:SorMenu(\'ProductUnitPrice\')">单价升序<img style="width: 10px;height: 10px" src="./img/xia.png"></a>');

        }
     /*   $.session.set('ProductUnitPrice', 1);
        $(".searchUl").find('li').eq(2).html('单价由高到低');*/
        $(".searchUl").find('li a').eq(2).css("color","rgb(66, 139, 202)");
        $(".searchUl").find('li').eq(0).html('<a href="javascript:SorMenu(\'ProductUp\')">更新时间</a>');
        $(".searchUl").find('li').eq(1).html('<a href="javascript:SorMenu(\'ProductPri\')">产品价格</a>');
        $.session.remove('ProductUp');
        $.session.remove('ProductPri');
        view("main",1);
    }
  //  alert($.session.get('ProductUp'));
 //   console.log($.session);
}
$(document).ready(
	function() {
       /* $.session.set('key', 'liangyi');
        var ly= $.session.get('key');
        alert(ly);*/
		ShowSelect(ProductType,'typeName',"productType");
		view("main");

	}
);
var page = 0;
var maincount = 0;
var Product = AV.Object.extend("Product");
var ProductType = AV.Object.extend("ProductType");
var StoreGroup = AV.Object.extend("StoreGroup");
var City= AV.Object.extend("City");
var query = new AV.Query(Product);
function view(tag,searchMenu) {

	if (tag == "nextpage") {
		page++;
        alert(maincount);
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
    if(searchMenu==2)
    {
        var currentPage=$("#CurrentNum").val();
     //   alert(currentPage);
        page=currentPage-1;
    }

        $("#pageNum").html(page+1);

        $("#CurrentNum").val(page+1);


	var html = '<thead>' +
		'<tr>' +
		'<th>产品图片</th>' +
		'<th>产品名称</th>' +
		'<th>产品ID</th>' +
		'<th>产品价格</th>' +
		'<th>产品单价</th>' +
		'<th>产品类别</th>' +
		/*'<th>所属城市</th>' +
		'<th>分拣中心</th>' +*/
		'<th>产品描述</th>';

		html += '<th>编辑</th>';


		html += '<th>删除</th>';

	html += '<th>上/下架</th>';
	html += '</tr>' +
		'</thead>';
	
	
	if (tag == "main") {
		query = new AV.Query(Product);
		query.equalTo("enabled",true);
        query.equalTo('onsell', true);
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
   /* var cityType=document.getElementById("cityType").value;
    var cityObj=new City();
    cityObj.id=cityType;
    query.equalTo("city",cityObj);*/
   // alert(cityType);
	if (tag == "search") {
		displa();//显示翻页按钮 隐藏加载按钮
		maincount = 0;
		page = 0;
		flag = true;
		var productTypeID = $('#productType option:selected').val();
		var onsell_Type=$('#onsell option:selected').val();
		query = new AV.Query(Product);
		var ProductType = AV.Object.extend("ProductType");
		if(productTypeID!='all'){
			var NewProType = new ProductType();
			NewProType.id = productTypeID;
			query.equalTo('productType', NewProType); //筛选出该类型的产品
		}



		if(onsell_Type=='onsell'){
			query.equalTo('onsell', true);
		}
		if(onsell_Type=='offsell'){
			query.equalTo('onsell', false);
		}
		query.equalTo("enabled",true);
		query.count({
			success: function(count) {
				maincount = count;
				if (count) {
					maincount = count;
				} else {
					alert('没有找到该类产品,请重试！')
					window.location.reload();
				}
			}
		});
	}
    query.descending("createdAt");

      //  alert(2);
        if($.session.get('ProductUp')==1)
        {
            query.descending('updatedAt');
        }else if($.session.get('ProductUp')==0)
        {
            query.ascending('updatedAt');
        }

      /*  if($.session.get('ProductPri')==1)
        {
            query.descending('productPrice');
        }else if($.session.get('ProductPri')==0)
        {
            query.ascending('productPrice');
        }*/
        if($.session.get('ProductUnitPrice')==1)
        {
            query.descending('unitPrice');
        }else if($.session.get('ProductUnitPrice')==0)
        {
            query.ascending('unitPrice');
        }


	query.limit(10);
	query.include('productType');
	/*query.include('city');
	query.include('sortingCenter');*/
	query.skip(10 * page);
	query.find({
		success: function(object) {
			//----
          //  alert(object.length);
			ShowObject(object, html);
		}
	});
}
function reload(){
	window.location.reload();
}
function deletebatch(id) {
		if (confirm("确定要删除吗？")) {
			var query = new AV.Query(Product);
			query.get(id, {
				success: function(pro) {
					pro.set('enabled',false);
					pro.save(null, {
						success: function(pro) {
							// 成功保存之后，执行其他逻辑.
							alert('删除成功！');
							window.location.reload();
						},
						error: function(pro, error) {
							alert('删除失败！'+error.message);
						}
					});
				},
				error: function(pro, error) {
					alert('删除失败！'+error.message);
				}
			});
		}
	}
//----------下架产品	
function offsell(id){
	if (confirm("确定要下架该产品吗？")) {
			var query = new AV.Query(Product);
			query.get(id, {
				success: function(pro) {
					pro.set('onsell',false);
					pro.save(null, {
						success: function(pro) {
							// 成功保存之后，执行其他逻辑.
							alert('下架成功！');
							window.location.reload();
						},
						error: function(pro, error) {
							alert('下架失败！'+error.message);
						}
					});
				},
				error: function(pro, error) {
					alert('下架失败！'+error.message);
				}
			});
		}
	
}
function onsell(id){
	if (confirm("确定要上架该产品吗？")) {
			var query = new AV.Query(Product);
			query.get(id, {
				success: function(pro) {
					pro.set('onsell',true);
					pro.save(null, {
						success: function(pro) {
							// 成功保存之后，执行其他逻辑.
							alert('上架成功！');
							window.location.reload();
						},
						error: function(pro, error) {
							alert('上架失败！'+error.message);
						}
					});
				},
				error: function(pro, error) {
					alert('上架失败！'+error.message);
				}
			});
	}
	
}
var flaglen=0;
function ToExcel(){
    var query=new AV.Query(Product);
    query.descending("createdAt");
    query.equalTo("enabled",true);
    query.limit(1000);
   /* query.include("city");*/
    query.include("productType");
/*    query.include("sortingCenter");*/
    query.find({
        success:function(object){
            var len=object.length;
            var html = '<thead>' +
                '<tr>' +
                '<th>产品名称</th>' +
                '<th>产品编号</th>' +
                '<th>产品ID</th>' +
                '<th>产品价格</th>' +
                '<th>包装规格</th>' +
                '<th>标准计量单位的数量</th>'+
                '<th>标准计量单位名称</th>'+
                '<th>每斤单价</th>'+
                '<th>产品类别</th>' +
               /* '<th>所属城市</th>' +
                 '<th>分拣中心</th>' +*/
                '<th>产品描述</th>'+
                '<th>是否上架</th>'+
                '<th>所属业态</th>'+
                '<th>是否独立包装</th>'+
                '</tr></thead>';

            for(var i=0;i<len;i++)
            {
                  (function(i){
                    var relation=object[i].relation("storeType");
                    relation.query().find({
                        success:function(obj){
                       //     console.log(1);
                            flaglen++;
                           // console.log(flaglen);
                            var storeType='';
                            for(var j=0;j<obj.length;j++)
                            {
                                storeType+=obj[j].get("typeName");
                                if(j!=obj.length-1)
                                {
                                    storeType+='、';
                                }
                            }
                            //var productImg=object[i].get("productImg")==null?'':object[i].get("productImg").thumbnailURL(40, 40);
                            var productName=object[i].get("productName")==null?'':object[i].get("productName");
                            var orderNumber=object[i].get("orderNumber")==null?'':object[i].get("orderNumber");
                            var productID=object[i].get("productID")==null?'':object[i].get("productID");
                            var productPrice=object[i].get("productPrice")==null?'':object[i].get("productPrice");
                            var packageString=object[i].get("packageString")==null?'':object[i].get("packageString");
                            var unitPerPackage=object[i].get("unitPerPackage")==null?'':object[i].get("unitPerPackage");
                            var unitString=object[i].get("unitString")==null?'':object[i].get("unitString");
                            var unitPrice=object[i].get("unitPrice")==null?'':object[i].get("unitPrice");
                            var productType=object[i].get("productType")==null?'':object[i].get("productType").get("typeName");
                          /*  var city=object[i].get("city")==null?'':object[i].get("city").get("cityName");
                            var sortingCenter=object[i].get("sortingCenter")==null?'':object[i].get("sortingCenter").get("scName");
                           */ var ProductDescription=object[i].get("ProductDescription")==null?'':object[i].get("ProductDescription");
                            var onsell=object[i].get("onsell")==null?'':object[i].get("onsell");
                            var isIndividualPackage=object[i].get("isIndividualPackage")==null?'':object[i].get("isIndividualPackage");
                            if(isIndividualPackage==true)
                            {
                                isIndividualPackage='是';
                            }
                            else
                            {
                                isIndividualPackage='否';
                            }

                            if(onsell==false)
                            {
                                onsell="已经下架"
                            }
                            else
                            {
                                onsell='';
                            }
                            html+='<tr>'+
                                '<td>'+productName+'</td>'+
                                '<td>'+orderNumber+'</td>'+
                                '<td>'+productID+'</td>'+
                                '<td>'+productPrice+'</td>'+
                                '<td>'+packageString+'</td>'+
                                '<td>'+unitPerPackage+'</td>'+
                                '<td>'+unitString+'</td>'+
                                '<td>'+unitPrice+'</td>'+
                                '<td>'+productType+'</td>'+
                              /*  '<td>'+city+'</td>'+
                                '<td>'+sortingCenter+'</td>'+*/
                                '<td>'+ProductDescription+'</td>'+
                                '<td>'+onsell+'</td>'+
                                '<td>'+storeType+'</td>'+
                                '<td>'+isIndividualPackage+'</td>'+
                                '</tr>';

                            if(flaglen==len)
                            {
                                console.log("flag:"+flaglen+"len:"+len);
                            //    console.log(html);
                                $("#ta").html(html);
                                method1('ta');
                            }
                        }
                    });
                }(i));
            }
          //  method1('ta');
        }
    });

}

function ShowSelect(className,typeName,id) {
	//载入产品类型下拉框列表----------------------
	var html_op = '<option value="all">所有分类</option>';
	var query = new AV.Query(className);
	query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				obj = results[i];
				var Name = obj.get(typeName);
				html_op += '<option value=\"' + obj.id + '\">' + Name + '</option>';
			}
			$("#"+id).html(html_op);
		}
	});
}

function ShowObject(object, html) {
	var len = object.length;
	for (var i = 0; i < len; i++) {
		var productName = '';
		if (object[i].get("productName") != null) {
			productName = object[i].get("productName");
		}
		var productImg = '';
		if (object[i].get("productImg") != null) {
			productImg = object[i].get("productImg").url();
		}
		var productID = '';
		if (object[i].get("productID") != null) {
			productID = object[i].get("productID");
		}
		var productType = '';
		if (object[i].get("productType") != null) {
			productType = object[i].get("productType").get("typeName");
		}
		var productPrice = '';
		if (object[i].get("productPrice") != null) {
			productPrice = object[i].get("productPrice");

		}
		var packageString = '';
		if (object[i].get("packageString") != null) {
			packageString = object[i].get("packageString");
		}
		var unitPrice = '';
		if (object[i].get("unitPrice") != null) {
			unitPrice = object[i].get("unitPrice");
		}
		var unitString = '';
		if (object[i].get("unitString") != null) {
			unitString = object[i].get("unitString");
		}
		var city = '';
		if (object[i].get("city") != null) {
			var city = object[i].get("city").get('cityName');
		}
		var ProductDescription = '';
		if (object[i].get("ProductDescription") != null) {
			var ProductDescription = object[i].get("ProductDescription");
		}
		var sortingCenter = '';
		if (object[i].get("sortingCenter") != null) {
			var sortingCenter = object[i].get("sortingCenter").get('scName');
		}
		var onsell = '';
		if (object[i].get("onsell") != null) {
			onsell = object[i].get("onsell");
		}
		var ObjId = object[i].id;
		if(onsell){
			html+='<tr class="onsell">';
		}
		else{
			html+='<tr class="offsell">';
		}
		html +='<td>' + '<img class="imgs" src=\"' + productImg + '\" style="height:40px;width:40px"></td>' +
			'<td><div class="ProDiv">' + productName + '</div></td>' +
			'<td><div class="IDDiv">' + productID + '</div></td>' +
			'<td>' + unitPrice + '元' + '</td>' +
			'<td>' + unitPrice + '元/' + unitString + '</td>' +
			'<td>' + productType + '</td>' +
			/*'<td>' + city + '</td>' +
			'<td><div class="ScDiv">' + sortingCenter + '</div></td>' +*/
			'<td><div class="DesDiv">' + ProductDescription + '</div></td>';

			if(onsell){
				html += '<td ><a   href="ProEdit.html?id=' + ObjId + '">编辑</td>';
			}else{
				html += '<td ><a class="redColor"  href="ProEdit.html?id=' + ObjId + '">编辑</td>';
			}


			if(onsell){
				html += '<td><a  href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>';
			}
			else{
				html += '<td><a class="redColor"  href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>';
			}
			


			if(onsell){
				html += '<td><a  href="javascript:offsell(\'' + ObjId + '\')">下架</td>';
			}
			else{
				html += '<td  ><a class="redColor" href="javascript:onsell(\'' + ObjId + '\')">上架</td>';
			}

		html += '</tr>';
	}
	$("#ProList").html(html);
}
var Sum=10;

function Search_Name(tag) {
	var html = '<thead>' +
		'<tr>' +
		'<th>产品图片</th>' +
		'<th>产品名称</th>' +
		'<th>产品ID</th>' +
		'<th>产品价格</th>' +
		'<th>产品单价</th>' +
		'<th>产品类别</th>' +
		/*'<th>所属城市</th>' +
		'<th>分拣中心</th>' +*/
		'<th>产品描述</th>';

		html += '<th>编辑</th>';


		html += '<th>删除</th>';

	html += '</tr>' +
		'</thead>';
		
	hide(); //隐藏翻页按钮 显示  加载按钮
	if (tag == "main") { //点击查询一次 sum总数 初始为10
		Sum = 10;
		$('#search_more').css('color', "#428BCA");
		$('#search_more').css('text-decoration', "inherit");
		$("#search_more").attr("onclick","Search_Name('more');");
	}
	if (tag == 'more') {
		Sum += 10;
	}
	var SerProName = $('#SerProName').val();
	if (SerProName != '请输入产品名称') {
		var sql = "select include productType,include city,include productImg,include sortingCenter,* from Product where enabled=true and productName like \'%" + SerProName + "%\' limit 0," + Sum;
		AV.Query.doCloudQuery(sql, {
			success: function(result) {
				var object = result.results;
				maincount = object.length;
				if (maincount == 0) {
					alert('没有找到该产品,请重试！');
					window.location.reload();
				}
				if (maincount < Sum) { //没有更多结果了  让 "加载更多"按钮 不可用
					$("#search_more").removeAttr("onclick");
					$('#search_more').css('color', "darkgray");
					$('#search_more').css('text-decoration', "none");
				}
				ShowObject(object, html); //调用函数 输出结果集
			},
			error: function(error) {
				alert('error' + error.message);
			}
		});

	} else {
		alert("请输入产品名称！");
		return false;
	}
}
function hide(){  //隐藏翻页按钮 显示  加载按钮
	$("#nextpage").css("display",'none');
	$("#pastpage").css("display",'none');
	$(".center").css("display",'block');
	
}
function displa(){  //显示翻页按钮 隐藏加载按钮
	$("#nextpage").css("display",'block');
	$("#pastpage").css("display",'block');
	$(".center").css("display",'none');
}
/*
 * 
 * 导出店铺到excel
 */
function StoreToExcel(){
    var query=new AV.Query(Product);
    query.descending("createdAt");
    query.equalTo("enabled",true);
    query.limit(1000);
    query.include("city");
    query.include("productType");
    query.include("sortingCenter");
    query.find({
        success:function(object){
            var len=object.length;
            var html = '<thead>' +
                '<tr>' +
                '<th>产品图片</th>' +
                '<th>产品名称</th>' +
                '<th>产品编号</th>' +
                '<th>产品ID</th>' +


                '<th>产品价格</th>' +

                '<th>包装规格</th>' +

                '<th>标准计量单位的数量</th>'+
                '<th>标准计量单位名称</th>'+
                '<th>每斤单价</th>'+

                '<th>产品类别</th>' +
                /*'<th>所属城市</th>' +
                '<th>分拣中心</th>' +*/
                '<th>产品描述</th>'+
                '<th>是否上架</th>'+
                '<th>所属业态</th>'+
                '<th>是否独立包装</th>'+
                '</tr></thead>';

            for(var i=0;i<len;i++)
            {

                  (function(i){
                    var relation=object[i].relation("storeType");
                    relation.query().find({
                        success:function(obj){
                       //     console.log(1);
                            flaglen++;
                           // console.log(flaglen);
                            var storeType='';
                            for(var j=0;j<obj.length;j++)
                            {
                                storeType+=obj[j].get("typeName");
                                if(j!=obj.length-1)
                                {
                                    storeType+='、';
                                }
                            }
                      //      console.log(2);

                            var productImg=object[i].get("productImg")==null?'':object[i].get("productImg").thumbnailURL(40, 40);
                            var productName=object[i].get("productName")==null?'':object[i].get("productName");
                            var orderNumber=object[i].get("orderNumber")==null?'':object[i].get("orderNumber");
                            var productID=object[i].get("productID")==null?'':object[i].get("productID");
                            var productPrice=object[i].get("productPrice")==null?'':object[i].get("productPrice");
                            var packageString=object[i].get("packageString")==null?'':object[i].get("packageString");
                            var unitPerPackage=object[i].get("unitPerPackage")==null?'':object[i].get("unitPerPackage");
                            var unitString=object[i].get("unitString")==null?'':object[i].get("unitString");
                            var unitPrice=object[i].get("unitPrice")==null?'':object[i].get("unitPrice");
                            var productType=object[i].get("productType")==null?'':object[i].get("productType").get("typeName");
                            var city=object[i].get("city")==null?'':object[i].get("city").get("cityName");
                            var sortingCenter=object[i].get("sortingCenter")==null?'':object[i].get("sortingCenter").get("scName");
                            var ProductDescription=object[i].get("ProductDescription")==null?'':object[i].get("ProductDescription");
                            var onsell=object[i].get("onsell")==null?'':object[i].get("onsell");
                            var isIndividualPackage=object[i].get("isIndividualPackage")==null?'':object[i].get("isIndividualPackage");

                            if(isIndividualPackage==true)
                            {
                                isIndividualPackage='是';
                            }
                            else
                            {
                                isIndividualPackage='否';
                            }

                            if(onsell==false)
                            {
                                onsell="已经下架"
                            }
                            else
                            {
                                onsell='';
                            }
                         //   console.log(3);
                            html+='<tr>'+
                                '<td>' + '<img class="imgs" src=\"' + productImg + '\" style="height:40px;width:40px"></td>'+
                                '<td>'+productName+'</td>'+
                                '<td>'+orderNumber+'</td>'+
                                '<td>'+productID+'</td>'+
                                '<td>'+productPrice+'</td>'+
                                '<td>'+packageString+'</td>'+
                                '<td>'+unitPerPackage+'</td>'+
                                '<td>'+unitString+'</td>'+
                                '<td>'+unitPrice+'</td>'+
                                '<td>'+productType+'</td>'+
                                '<td>'+city+'</td>'+
                                '<td>'+sortingCenter+'</td>'+
                                '<td>'+ProductDescription+'</td>'+
                                '<td>'+onsell+'</td>'+
                                '<td>'+storeType+'</td>'+
                                '<td>'+isIndividualPackage+'</td>'+
                                '</tr>';

                            if(flaglen==len)
                            {
                                console.log("flag:"+flaglen+"len:"+len);
                            //    console.log(html);
                                $("#ta").html(html);
                                method1('ta');
                            }
                        }
                    });

                }(i));


            }

          //  method1('ta');
        }
    });

}