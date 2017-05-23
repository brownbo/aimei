/**
 * Created by zhengyinhua on 15-9-7.
 */
$(document).ready(
	function() {
		view("main");
		ShowSelect(StoreGroup,'groupName',"storeGroups");
		ShowSelect(City,'cityName',"city");
		if ($.inArray("421", roleArray) >= 0) {
			$('#ResAddBt').attr("disabled", false);
		} else {
			$('#ResAddBt').attr("disabled", true);
			$("#ResAdd").click(function() {
				return false;
			});
		}
	}
);
var page = 0;
var maincount = 0;
var Store = AV.Object.extend("Store");
var StoreGroup = AV.Object.extend("StoreGroup");
var City = AV.Object.extend("City");
var query = new AV.Query(Store);
var Sum=10;//记录 店铺名称查询显示的条数
function view(tag) {
	if (tag == "nextpage") {
		page++;
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

	var html = '<thead>' +
		'<tr>' +
		'<th>店铺图片</th>' +
		'<th>店铺名称</th>' +
		'<th>业态</th>' +
		'<th>联系方式</th>' +
		'<th>店铺地址</th>' +
		'<th>管理员</th>' +
		'<th>城市</th>' +
		'<th>配送中心</th>' +
		'<th>线路</th>' +
		'<th>最早收货</th>' +
		'<th>最晚收货</th>';
	if ($.inArray("422", roleArray) >= 0) {
		html += '<th>编辑</th>';
	}
	if ($.inArray("423", roleArray) >= 0) {
		html += '<th>删除</th>';
	}
	html += '</tr>' +
		'</thead>';
	if (tag == "main") {
		query = new AV.Query(Store);
		query.equalTo("enabled", true);
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	if (tag == "searchStoName"||tag=='more') {   //第一次搜索时 或者是在 搜索店铺环境下的翻页情况 才触发下面的操作
		hide();//隐藏翻页按钮 显示  加载按钮
		page = 0;
		if(tag == "searchStoName"){  //点击查询一次 sum总数 初始为10
			Sum=10;
			$('#search_more').css('color',"#428BCA");
			$('#search_more').css('text-decoration',"inherit");
			$("#search_more").attr("onclick","view('more');");
		}
		if(tag=='more'){
			Sum+=10;
		}
		var storeName = $('#storeName').val();
		if (storeName != '请输入店铺名称') {
			var sql="select include storeDC,include storeType,include city,include storeImage,include owner,include storeRoute,* from Store where enabled=true and storeName like \'%"+storeName+"%\' limit 0,"+Sum;
			AV.Query.doCloudQuery(sql, {
				success: function(result) {
					var object =result.results;
					maincount=object.length;
					if(maincount==0){
						alert('没有找到该店铺,请重试！')
						window.location.reload();
					}
					if(maincount<Sum){  //没有更多结果了  让 "加载更多"按钮 不可用
						$("#search_more").removeAttr("onclick");
						$('#search_more').css('color',"darkgray");
						$('#search_more').css('text-decoration',"none");
					}
					ShowObject(object,html); //调用函数 输出结果集
				},
				error: function(error) {
					alert('error'+error.message);
				}
			});
		} else {
			alert("请输入店铺名称！");
			return false;
		}
	}
	if (tag == "searchStotell") {
		maincount = 0;
		page = 0;
		query = new AV.Query(Store);
		var ownerTell = $('#owner').val();

		if (ownerTell != '请输入店主联系方式') {
			query.equalTo('storeContact', parseInt(ownerTell)); //筛选出该联系方式的店铺
			query.equalTo("enabled", true);
		} else {
			alert("请输入店主联系方式");
			return false;
		}
		query.count({
			success: function(count) {
				if (count) {
					maincount = count;
				} else {
					alert('没有找到该店铺,请重试！')
					window.location.reload();
				}
			}
		});
	}
	if (tag == "searchGroupAndCity") {
		maincount = 0;
		page = 0;
		query=new AV.Query(Store);
		var storeGroupID = $('#storeGroups option:selected').val();
		var cityID = $('#city option:selected').val();
		if(storeGroupID!=='all'){
			var newGroup= new StoreGroup();
			newGroup.id=storeGroupID;
			query = AV.Relation.reverseQuery('Store','storeGroups', newGroup);
		}
		if(cityID!=='all'){
			var MyCity= new City();
			MyCity.id=cityID;
			query.equalTo("city",MyCity);
		}
		
		query.count({
			success: function(count) {
				if (count) {
					maincount = count;
				} else {
					alert('没有找到店铺,请重试！')
					window.location.reload();
				}
			}
		});
	}
	if (tag != "searchStoName"&&tag!='more') {  //店铺查询 或在店铺 翻页时不需要再输出
		displa();//显示翻页按钮 隐藏加载按钮
		query.limit(10);
		query.include('storeDC');
		query.include('city');
		query.include('storeType');
		query.include('owner');
		query.include('storeRoute');
		query.skip(10 * page);
		query.equalTo("enabled", true);
		query.find({
			success: function(object) {
				ShowObject(object, html); //调用函数 输出结果集
			}
		});	
	}
	
}

function deletebatch(id) {
	if (confirm("确定要删除吗？")) {
		var store = AV.Object.extend("Store");
		var query = new AV.Query(store);
		query.get(id, {
			success: function(sto) {
				sto.set('enabled', false);
				sto.save(null, {
					success: function(sto) {
						// 成功保存之后，执行其他逻辑.
						alert('删除成功！');
						window.location.reload();
					},
					error: function(sto, error) {
						alert('删除失败！' + error.message);
					}
				});
			},
			error: function(sto, error) {
				alert('删除失败！' + error.message);
			}
		});
	}
}

function ToTime(time) {
	if (time >= 0 && time < 10) {
		time = "0" + time;
	}
	return time;
}

function reload() {
	window.location.reload();
}

function ShowObject(object, html) { //输出一个query find方法返回的结果集 到table里
	var len = object.length;
	for (var i = 0; i < len; i++) {
		var storeName = '';
		if (object[i].get("storeName") != null) {
			storeName = object[i].get("storeName");
		}
		var storeRoute = '';
		if (object[i].get("storeRoute") != null) {
			storeRoute = object[i].get("storeRoute").get('routeName');
		}
		var storeImage = '';
		if (object[i].get("storeImage") != null) {
			storeImage = object[i].get("storeImage").url();
		}
		
		var storeType = '';
		if (object[i].get("storeType") != null) {
			storeType = object[i].get("storeType").get('typeName');
		}
		
		
		var storeContact = '';
		if (object[i].get("storeContact") != null) {
			storeContact = object[i].get("storeContact");
		}
		var storeDC = '';
		if (object[i].get("storeDC") != null) {
			storeDC = object[i].get("storeDC").get("dcName");
		}
		
		
		var owner = '';
		if (object[i].get("owner") != null) {
			owner = object[i].get("owner").get("username");

		}
		var storePosition = '';
		if (object[i].get("storePosition") != null) {
			storePosition = object[i].get("storePosition");
		}
		var storeAddress = '';
		if (object[i].get("storeAddress") != null) {
			storeAddress = object[i].get("storeAddress");
		}
		var earlyTime = '';
		if (object[i].get("earlyTime") != null) {
			var time = object[i].get("earlyTime");
			earlyTime = ToTime(time.getHours()) + ":" + ToTime(time.getMinutes());
		}
		
		var latestTime = '';
		if (object[i].get("latestTime") != null) {
			var time = object[i].get("latestTime");
			latestTime = ToTime(time.getHours()) + ":" + ToTime(time.getMinutes());
		}
		var city = '';
		if (object[i].get("city") != null) {
			city = object[i].get("city").get("cityName");
		}
		var ObjId = object[i].id;
		html += '<tr>' +
			'<td>' + '<img class="imgs" src=\"' + storeImage + '\" style="height:40px;width:40px"></td>' +
			'<td><div class="NameDiv">' + storeName + '</div></td>' +
			'<td>' + storeType + '</td>' +
			'<td>' + storeContact + '</td>' +
			'<td><div class="AddDiv">' + storeAddress + '</div></td>' +
			'<td>' + owner + '</td>' +
			'<td>'+city+'</td>'+
			'<td><div class="NameDiv">' + storeDC + '</div></td>' +
			'<td><div class="RouteDiv">' + storeRoute + '</div></td>' +
			'<td>' + earlyTime + '</td>' +
			'<td>' + latestTime + '</td>';
		if ($.inArray("422", roleArray) >= 0) {
			html += '<td><a href="ResEdit.html?id=' + ObjId + '">编辑</td>';
		}
		if ($.inArray("423", roleArray) >= 0) {
			html += '<td><a href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>';
		}
		html += '</tr>';
	}
	$("#resList").html(html);
	
}
/*
 * 
 * 显示分组下拉列表
 */
function ShowSelect(className,typeName,id) {
	//载入产品类型下拉框列表----------------------
	if(typeName=="cityName"){
		var html_op = '<option value="all">所有城市</option>';
	}else{
		var html_op = '<option value="all">所有分组</option>';
	}
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
function To_Time(time) {
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
/*
 * 
 * 导出店铺到excel
 */
function StoreToExcel(){
    var query=new AV.Query(Store);
    query.descending("createdAt");
    query.equalTo("enabled",true);
    query.limit(1000);
    query.include('storeDC');
	query.include('storeType');
	query.include('owner');
	query.include('city');
	query.include('owner');
	query.include('salesman');
	query.include('storeRoute');
	var flag=0;
    query.find({
        success:function(object){
            var len=object.length;
            var html = '<thead>' +
			'<tr>' +
			'<th>店铺名称</th>' +
			'<th>线路</th>' +
			'<th>业态</th>' +
			'<th>店铺地址</th>' +
			'<th>城市</th>' +
			'<th>联系方式</th>' +
			'<th>联系人名</th>' +
			'<th>管理员</th>' +
			'<th>业务员</th>' +
			'<th>配送中心</th>' +
			'<th>授予账期(</th>' +
			'<th>最早收货</th>' +
			'<th>最晚收货</th>'+
			'<th>加入分组</th>';
            for(var i=0;i<len;i++)
            {
                  (function(i){
                    var relation=object[i].relation("storeGroups");
                    relation.query().find({
                        success:function(obj){
                        	flag++;
                            var storeGroups='';
                            for(var j=0;j<obj.length;j++)
                            {
                                storeGroups+=obj[j].get("groupName");
                                if(j!=obj.length-1)
                                {
                                    storeGroups+='、';
                                }
                            }

                            var storeName=object[i].get("storeName")==null?'':object[i].get("storeName");
                            var storeRoute=object[i].get("storeRoute")==null?'':object[i].get("storeRoute").get('routeName');
                            var storeType=object[i].get("storeType")==null?'':object[i].get("storeType").get('typeName');
                            var storeAddress=object[i].get("storeAddress")==null?'':object[i].get("storeAddress");
                            var city=object[i].get("city")==null?'':object[i].get("city").get('cityName');
                            var storeContact=object[i].get("storeContact")==null?'':object[i].get("storeContact");
                            var contactName=object[i].get("contactName")==null?'':object[i].get("contactName");
                            var owner=object[i].get("owner")==null?'':object[i].get("owner").get('username');
                            var salesman=object[i].get("salesman")==null?'':object[i].get("salesman").get("salesmanName");
                            var storeDC=object[i].get("storeDC")==null?'':object[i].get("storeDC").get("dcName");
                            var paymentDays=object[i].get("paymentDays")==null?'':object[i].get("paymentDays");
                            var earlyTime=object[i].get("earlyTime")==null?'':object[i].get("earlyTime");
                            var latestTime=object[i].get("latestTime")==null?'':object[i].get("latestTime");

                            html+='<tr>'+
                                '<td>'+storeName+'</td>'+
                                '<td>'+storeRoute+'</td>'+
                                '<td>'+storeType+'</td>'+
                                '<td>'+storeAddress+'</td>'+
                                '<td>'+city+'</td>'+
                                '<td>'+storeContact+'</td>'+
                                '<td>'+contactName+'</td>'+
                                '<td>'+owner+'</td>'+
                                '<td>'+salesman+'</td>'+
                                '<td>'+storeDC+'</td>'+
                                '<td>'+paymentDays+'</td>'+
                                '<td>'+To_Time(earlyTime)+'</td>'+
                                '<td>'+To_Time(latestTime)+'</td>'+
                                '<td>'+storeGroups+'</td>'+
                                '</tr>';

                            if(flag==len)
                            {
                                console.log("flag:"+flag+"len:"+len);
                            	console.log(html);
                                $("#ta").html(html);
                                method1('ta');
                            }
                        }
                    });
                }(i));
            }
        }
    });
}