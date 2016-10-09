<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>地址选择</title>
    <style type="text/css">
    	body{
    		
    		background: #fff;
    	}
        #container
        {
            width:580px;
            height: 390px;
        }
        #r-result{float:left;width:208px}
        #Button1{position:absolute;right:10px;bottom:11px;color:#ccc;;}
        .btn{
        padding: 5px 12px 5px 12px;
		text-decoration: none;
		border: 1px solid #dedfdf;
		background: #F5F5F5;
		color: #5e5e5e;
        }
    </style>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
    <script type="text/javascript" src="/static/content/js/jquery.js" ></script>

    <link rel="stylesheet" type="text/css" href="/static/plugins/font-awesome-4.2.0/css/font-awesome.min.css">
</head>
<body onload="loand()">
	
	   <div  class="searchbox" style="margin-top:12px;position:relative;">
 <input type="text" onkeydown="Fsubmit(event.keyCode||event.which);" id="sousuo" style="width:100%;height:30px;font-size:18px;border: 1px solid #dedfdf;" placeholder="请输入您公司的地址回车搜索定位……" value="" onfocus="javascript:if(this.value='请输入您的公司地址！') this.value='';">
 <a id="Button1" href="javascript:;"  onclick="find()" /><i class="fa fa-search fa-lg"></i></a>
    </div>
	
    <div id="container" style="margin-top:10px;">
    </div>
    
    <input type="button" class="btn" value="关闭" onclick="hide();" style="margin-top:8px;margin-left:540px;margin-right:10px">
     <div id="r-result"></div>
     
    <input id="lng" type="hidden" runat="server" value="${lng!}"/>
    <input id="lat" type="hidden" runat="server" value="${lat!}"/>
    
    <script type="text/javascript">
     var theResult = {};
     
     $(function(){
       $("#sousuo").keydown(function(e){
          if(e.keyCode==13){
            $("#Button1").click();
             return false;
          }
       })
     });
     
     
function find() {
   
	var map = new BMap.Map("container");
	var lng = document.getElementById("lng").value;
	var lat = document.getElementById("lat").value;
	var point = new BMap.Point(lng, lat);
	var geoc = new BMap.Geocoder();
	var opts = {
		width : 250,
		height : 100,
		title : "您选择的地址"
	}
	var infoWindow = new BMap.InfoWindow("双击选择您的地址（您可以先使用关键字查询缩小范围）", opts);

	function showInfo(e) {
		point = new BMap.Point(e.point.lng, e.point.lat);
		document.getElementById("lng").value = e.point.lng;
		document.getElementById("lat").value = e.point.lat;
		geoc.getLocation(point, function(rs) {
			var addComp = rs.addressComponents;
			infoWindow = new BMap.InfoWindow(addComp.province + ", "
					+ addComp.city + ", " + addComp.district + ", "
					+ addComp.street + ", " + addComp.streetNumber, opts);
			theResult.lng = e.point.lng;
			theResult.lat = e.point.lat;
			theResult.province = addComp.province;
			theResult.city = addComp.city;
			theResult.district = addComp.district;
			theResult.street = addComp.street;
			theResult.streetNumber = addComp.streetNumber;

			map.openInfoWindow(infoWindow, point);
		});

	}
	map.addEventListener("click", showInfo);
	map.addControl(new BMap.NavigationControl());
	map.enableScrollWheelZoom();
	map.enableKeyboard();
	map.centerAndZoom(point, 13);
	var text = document.getElementById("sousuo").value;
	var local = new BMap.LocalSearch(map, {
		renderOptions : {
			map : map,panel:"r-result"
		}
	});
	local.search(text);
}

function loand() {
	var map = new BMap.Map("container");
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	if(lng!=''&&lat!=''){
		var point = new BMap.Point(lng, lat);
		map.centerAndZoom(point, 12);
	}else{
		var point = new BMap.Point(104.083, 30.686);
	
		function myFun(result) {
			var cityName = result.name;
			map.setCenter(cityName);
			point = new BMap.Point(result.center.lng, result.center.lat);
	
			document.getElementById("lng").value = result.center.lng;
			document.getElementById("lat").value = result.center.lat;
			infoWindow = new BMap.InfoWindow("双击选择您的地址（您可以先使用关键字查询缩小范围）", opts);
	
			map.openInfoWindow(infoWindow, point);
	
		}
		var myCity = new BMap.LocalCity();
		myCity.get(myFun);
	
		var geoc = new BMap.Geocoder();
		var opts = {
			width : 250,
			height : 100,
			title : "您选择的地址"
		}
		var infoWindow = new BMap.InfoWindow("双击选择您的地址（您可以先使用关键字查询缩小范围）", opts);
	
		function showInfo(e) {
			point = new BMap.Point(e.point.lng, e.point.lat);
			document.getElementById("lng").value = e.point.lng;
			document.getElementById("lat").value = e.point.lat;
			geoc.getLocation(point, function(rs) {
				var addComp = rs.addressComponents;
				infoWindow = new BMap.InfoWindow(addComp.province + ", "
						+ addComp.city + ", " + addComp.district + ", "
						+ addComp.street + ", " + addComp.streetNumber, opts);
				theResult.lng = e.point.lng;
				theResult.lat = e.point.lat;
				theResult.province = addComp.province;
				theResult.city = addComp.city;
				theResult.district = addComp.district;
				theResult.street = addComp.street;
				theResult.streetNumber = addComp.streetNumber;
				map.openInfoWindow(infoWindow, point);
			});
		}
		map.addEventListener("click", showInfo);
		map.addControl(new BMap.NavigationControl());
		map.enableScrollWheelZoom();
		map.enableKeyboard();
	
		map.centerAndZoom(point, 13);
	
		map.openInfoWindow(infoWindow, map.getCenter());
	}
}

function Fsubmit(e){
	if(e==13||e==32){
		find();
	}
}

  function okButtonClick() {
   /* theResult.province='广东';
    theResult.city='深圳';
    theResult.district='福田区';
    theResult.lng='1323';
    theResult.lat='4454343';*/
	if (typeof(theResult.lng) == "undefined") {
	    window.top.parent.parent.$.messager.alert('温馨提示', '请选择公司地址!', 'info');
		return false;
		
	}
	
	if (typeof(theResult.province) == "undefined"||theResult.province=="") {
	    window.top.parent.parent.$.messager.alert('温馨提示', '请选择正确的公司地址!', 'info');
		return false;
	}
	if (typeof(theResult.city) == "undefined"||theResult.city=="") {
	    window.top.parent.parent.$.messager.alert('温馨提示', '请选择正确的公司地址!', 'info');
		return false;
	}
	if(typeof(theResult.district) == "undefined"){
	theResult.district="";
	}
	if(typeof(theResult.street) == "undefined"){
	theResult.street="";
	}
	if(typeof(theResult.streetNumber) == "undefined"){
	theResult.streetNumber="";
	}
   
    
	window.top.$("#address").val(theResult.province + theResult.city + theResult.district+ theResult.street + theResult.streetNumber);
	window.top.$("#regionRegion").val(getRegionRegion(theResult.province));
	window.top.$("#regionProvinceChange").val(theResult.province);
	window.top.$("#regionCityChange").val(theResult.city);
	window.top.$("#regionTown").val(theResult.district);
	window.top.$("#lng").val(theResult.lng);
	window.top.$("#lat").val(theResult.lat);
			
	window.top.$("#baiduMapIFrame").hide();

}

   function getRegionRegion(regionProvinceChange){
     if(regionProvinceChange=='山东省'||regionProvinceChange=='安徽省'||regionProvinceChange=='江苏省'||regionProvinceChange=='安徽省'||regionProvinceChange=='浙江省'||regionProvinceChange=='福建省'||regionProvinceChange=='上海市'){
           return '华东区';
     }
     
     if(regionProvinceChange=='广东省'||regionProvinceChange=='广西省'||regionProvinceChange=='海南省'){
           return '华南区';
     }
     
     if(regionProvinceChange=='湖北省'||regionProvinceChange=='湖南省'||regionProvinceChange=='河南省'||regionProvinceChange=='江西省'){
           return '华中区';
     }
     if(regionProvinceChange=='北京市'||regionProvinceChange=='天津市'||regionProvinceChange=='河北省'||regionProvinceChange=='山西省'||regionProvinceChange=='内蒙古自治区'){
           return '华北区';
     }
     if(regionProvinceChange=='宁夏回族自治区'||regionProvinceChange=='新疆维吾尔自治区'||regionProvinceChange=='青海省'||regionProvinceChange=='陕西省'||regionProvinceChange=='甘肃省'){
           return '西北区';
     }
     if(regionProvinceChange=='四川省'||regionProvinceChange=='云南省'||regionProvinceChange=='贵州省'||regionProvinceChange=='西藏自治区'||regionProvinceChange=='重庆市'){
           return '西南区';
     }
     if(regionProvinceChange=='辽宁省'||regionProvinceChange=='吉林省'||regionProvinceChange=='黑龙江省'){
           return '东北区';
     }
     if(regionProvinceChange=='台湾省'||regionProvinceChange=='香港特别行政区'||regionProvinceChange=='澳门特别行政区'){
           return '台港澳';
     }
   
   }


function hide(){
	window.top.$("#baiduMapIFrame").hide();
}

        
         
    </script>
</body>
</html>