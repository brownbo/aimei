/**
 * Created by liangyi on 15-9-9.
 */
$(document).ready(function(){
   // alert(4);
   // alert(4);
    judgeAddEdit();
    bindMenu();
    bindBanner();
});
function judgeAddEdit(){
    var url=geturl();
  //  alert(url);

    if(url==null)
    {
        editStoreType();
    }
    else
    {
        editProductType();
    }
}
function editProductType(){
    var url=geturl();
    var ProductType=AV.Object.extend("ProductType");
    var query=new AV.Query(ProductType);
    query.include("parent");
    query.equalTo("objectId",url);
    query.find({
         success:function(object){
             /* 绑定storeType*/
             var StoreType=AV.Object.extend("StoreType");
             var query=new AV.Query(StoreType);
             query.descending("createdAt");

             query.find({
                 success:function(object){
                     var html='';
                     var len=object.length;
                     for(var i=0;i<len;i++)
                     {
                         var typeName=object[i].get("typeName")==null?'':object[i].get("typeName");
                         html+='<p><input class="typeName"  type="checkbox" name="typeName" value="'+object[i].id+'">'+typeName+'</p>';


                     }
                     $("#storeType").html(html);
                 }
             }).then(
                     function(){
                         var query=object[0].relation("storeType").query();
                         query.equalTo("enabled",true);
                         query.find({
                             success:function(object){

                                 var len=object.length;
                                 //   alert(object[0].id);
                                 var storeTypeName=document.getElementsByName("typeName");
                            //     alert(storeTypeName.length);
                                 for(var i=0;i<storeTypeName.length;i++)
                                 {
                                     for(var j=0;j<len;j++)
                                     {
                                         //          alert(object[j].id);
                                         if(storeTypeName[i].value==object[j].id)
                                         {
                                             storeTypeName[i].checked=true;
                                         }
                                     }

                                 }

                                 // alert(html);
                             }
                         });
                     }
                 );

            /* 绑定storeType*/
             var typeName=object[0].get("typeName")==null?'':object[0].get("typeName");
             var orderNumber=object[0].get("orderNumber")==null?'':object[0].get("orderNumber");
             var enabled=object[0].get("enabled")==null?'':object[0].get("enabled");
             var typeID=object[0].get("typeID")==null?'':object[0].get("typeID");
             var level=object[0].get("level")==null?'':object[0].get("level");
             var parentName=object[0].get("parent")==null?'':object[0].get("parent").get("typeName");

             if(level==1)
             {

                 document.getElementById("level").options[0].selected=true;
             }
             else if(level==2)
             {
                 document.getElementById("level").options[1].selected=true;
                 BindLevel("二级菜单",parentName);
               //  document.getElementById("parent").value=parentName;
             //    $("#parent").val(parentName);
             }
             else
             {
               //  alert('wu');
             }
             $("#typeName").val(typeName);
             $("#orderNumber").val(orderNumber);
             $("#typeID").val(typeID);

             if(enabled===true)
             {
                 document.getElementById("enabled").options[0].selected=true;
             }
             else
             {

                 document.getElementById("enabled").options[1].selected=true;
             }
         }
    });
}

/*绑定二级菜单*/
function BindLevel(value,name){
    if(value.value=="一级菜单")
    {
        var str='<option>无</option>';
        $("#parent").html(str);
    }
    else
    {
        var ProductType=AV.Object.extend("ProductType");
        var query=new AV.Query(ProductType);
        query.ascending("orderNumber");
        query.equalTo("level",1);
        query.equalTo("enabled",true);
        query.find({
            success:function(object){
                var len=object.length;
                var html='';
                for(var i=0;i<len;i++)
                {

                    if(object[i].get("typeName")!=null)
                    {
                        html+='<option id='+object[i].id+'>'+object[i].get("typeName")+'</option>';

                    }

                }
                $("#parent").html(html);
                if(name!=null)
                {
                    $("#parent").val(name);
                }
            }
        });
    }
}

function beforeSaveType(){
    var typeName=$("#typeName").val();
    var orderNumber=$("#orderNumber").val();
    var typeID=$("#typeID").val();
    var enabled=$("#enabled").val();
    var str=typeName==''?"'类别名称'":'';
    str+=orderNumber==''?"'类别编号'":'';
    str+=typeID==''?"'类别ID'":'';
    //str+=typeID==''?"'类别ID'":'';
  //  alert(str);
    if(str=='')
    {

        saveType();
    }
    else
    {
        alert(str+"不能为空！");
       //
    }
}
function saveType(){
    var url=geturl();
    var typeName=$("#typeName").val();
    var orderNumber=$("#orderNumber").val();
    var typeID=$("#typeID").val();
    var enabled=$("#enabled").val();

    var ProductType=AV.Object.extend("ProductType");
    var productType=new ProductType();
    if(url!=null)
    {
        productType.set("objectId",url);
    }
    var level=$("#level").val();

    if(level=="一级菜单")
    {
        productType.set("level",1);
        productType.set("parent",null);
    }
    else if(level=="二级菜单")
    {
        var parentId=$("#parent option:selected").attr("id");
        var productTypeParent=new ProductType();
        productTypeParent.id=parentId;
        productType.set("level",2);
        productType.set("parent",productTypeParent);
    }
    productType.set("typeName",typeName);
    productType.set("orderNumber",parseInt(orderNumber));
    productType.set("typeID",typeID);
    enabled=="启用"?productType.set("enabled",Boolean(1)):productType.set("enabled",Boolean(0));
    productType.save({
        success:function(object){
           // var num=new Array();
            var relation=object.relation("storeType");
            var StoreType=AV.Object.extend("StoreType");
            var storeType=new StoreType();
            var deleteType=new StoreType();
            /*删除relation*/
            var DeleteList=new Array();
            $("#storeType p input[type=checkbox]").each(function(){
                if(this.checked==false){
                    DeleteList.push($(this).val());
                }
            });
            for(var j=0;j<DeleteList.length;j++)
            {
                console.log(DeleteList[j]);
                // alert(num[i]);
                deleteType.id=DeleteList[j];
                relation.remove(deleteType);
                //      alert(i);

            }
            object.save().then(function(){
                /* 新增relation*/
                var CheckList=new Array();
                $("#storeType p input[type=checkbox]").each(function(){
                    if(this.checked){
                        CheckList.push($(this).val());
                    }
                });
                for(var i=0;i<CheckList.length;i++)
                {
                    console.log(CheckList[i]);
                    // alert(num[i]);
                    storeType.id=CheckList[i];
                    relation.add(storeType);
                    //      alert(i);

                }
                /* 新增relation*/
                object.save({
                    success:function(object){
                        url==null?alert("新增产品类别成功！"):alert("更新产品类别成功!");
                        window.location.href="../ProductType/ProductTypeList.html";
                    },error:function(obj,error){
                        alert(error.message);
                    }
                });
            });
            /*删除relation*/



        }
    });
}

function editStoreType(){
    var StoreType=AV.Object.extend("StoreType");
    var query=new AV.Query(StoreType);
    query.descending("createdAt");
    query.find({
        success:function(object){
            var html='';
            var len=object.length;
            for(var i=0;i<len;i++)
            {
                var typeName=object[i].get("typeName")==null?'':object[i].get("typeName");
                html+='<p><input class="typeName"  type="checkbox" name="typeName"  value="'+object[i].id+'">'+typeName+'</p>';


            }
            $("#storeType").html(html);
        }
    })
}