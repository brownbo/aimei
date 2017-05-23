/**
 * Created by liangyi on 2016/4/18.
 */
var OrderTable=AV.Object.extend("OrderTable");
var OrderDetail=AV.Object.extend("OrderDetail");
var Product=AV.Object.extend("Product");
var ProductType=AV.Object.extend("ProductType");
$(document).ready(function(){
   // alert(1);
    var url=geturl();
    showDetail(url);
    bindParent(url);
    getUserInfo();
    window.mobilecheck = function() {
        var check = false;
        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
    if(window.mobilecheck()){
        $('#rightContent').css('display','none');
        $('#main_left').css({
            'width':'100%'
        })
        $('#main_content').css('width','100%')
        $('#img').css('width','100%')
        $('#main_right').css({
            'width':'100%',
            'top':'500px'
        })
    }
});

function bindParent(id){
    var query=new AV.Query(Product);
    query.equalTo('objectId',id);
    query.include('productType');
   // query.include('productType');
    query.find({
        success:function(object){
           // alert(1);
            var typeQuery=new AV.Query(ProductType);
            typeQuery.equalTo('objectId',object[0].get('productType').id);
            typeQuery.include('parent');
            typeQuery.find({
                success:function(object){
                   // alert("gggg"+object[0].get("parent").get('typeName'));
                    var productTypeName=object[0].get('parent')==null?'':object[0].get('parent').get('typeName');
                    var typeID=object[0].get('parent')==null?'':object[0].get('parent').get('typeID');
                   // alert(typeId);
                    $('#productTypeName').html(productTypeName);
                    $('#productTypeEnglishName').html(typeID);
                }
            });
            //alert(object[0].get('productType').id);
        }
    });
}
function showDetail(id){
    var query=new AV.Query(Product);
    query.equalTo('objectId',id);
    query.include('productType');
    query.find({
        success:function(object){
         //   alert(1);
           var productName=object[0].get('productName')==null?'':object[0].get('productName');
            var price=object[0].get('unitPrice')==null?'':object[0].get('unitPrice');
            var unitString=object[0].get('unitString')==null?'':object[0].get('unitString');
            var img=object[0].get('productImg')==null?'':object[0].get('productImg').url();
            var ProductDescription=object[0].get('ProductDescription')==null?'':object[0].get('ProductDescription');

            $('#img').attr('src',img);
            $('#realPrice').html(price);
            $('#productName').html(productName);
            $('#description').html(ProductDescription);
            //$('#realPrice').html(price);

           // alert(object[0].get('productName'));
        }
    });
}

function addThisToChart(){
    var url=geturl();
    addToChart(url);
}