
/**
 ** cntid 需要验证的元素的外层容器的id。
 ** types 取值时需要单独处理的easyui组件类型字符串（eg. combotree,combogrid,combobox,searchbox）
 ** alertdom 显示提示信息的dom元素
 ** 验证成功返回true，否则返回false 同时验证失败的元素会显示红色边框和文字提示。
 ** 支持
 ** 数字 validate = number
 ** 长度 validate = 50
 ** 必填 validate = required 验证。
 ** 禁止包含空格 noSpace
 ** 禁止包含中文 noChinese

 ** 多个验证逻辑用逗号分隔 如：validate="required,number,50"

 ** 添加新的验证器：
 ** 1.添加var xxxx_validator = function (cntid){this.validate = function(element){}} 方法内必须要validate方法。
 ** 2.添加一个case 'xxxx' (记得break!)
 */
function validate(cntid, types, alertdom){
	clearErrorTip(alertdom, cntid);
	$("#" + cntid).data("flat", "true"); 
	
	// required的验证器
	var required_validator = function(cntid, fieldVal) {
		this.validate = function(element) { //参数为 表单元素的 jquery对象
			var elVal = (fieldVal == "" ? element.val() : fieldVal);
			if ($.trim(elVal) == ""||$.trim(elVal) == "-") {
				$("#" + cntid).data("flat", "false"); // 如果验证失败要在cntid打上flat为false的标记
				setErrorTip(alertdom, "* " + element.parent().prev().text() + "请填写数据"); // 设置错误信息
				return false;
			} else {
				return true;
			}
		}
	}
	
	//数字验证器
	var number_validator = function(cntid, fieldVal) {
		this.validate = function(element) {
			var elVal = (fieldVal == "" ? element.val() : fieldVal);
			if (isNaN(elVal)) {
				$("#" + cntid).data("flat", "false");
				setErrorTip(alertdom, "* " + element.parent().prev().text() + "只允许填写数字");
				return false;
			} else {
				return true;
			}
		}
	}

	//整数验证器
	var isInt_validator = function(cntid, fieldVal) {
		this.validate = function(element) {
			var elVal = (fieldVal == "" ? element.val() : fieldVal);
			if ($.trim(elVal) != "" && elVal != parseInt(elVal)) {
				$("#" + cntid).data("flat", "false");
				setErrorTip(alertdom, "* " + element.parent().prev().text() + "只允许填写整数");
				return false;
			} else {
				return true;
			}
		}
	}

	//最大长度验证器
	var max_validator = function(cntid, max, fieldVal) {
		this.validate = function(element, max) {
			var elVal = (fieldVal == "" ? element.val() : fieldVal);
			var fmax = max, sign = "";
			if (elVal == parseInt(elVal) && elVal < 0) {
				fmax = parseInt(max) + 1;
				sign = "整数";
			}
			if (elVal != null && elVal != '' && elVal.length > fmax) {
				$("#" + cntid).data("flat", "false");
				setErrorTip(alertdom, "* " + element.parent().prev().text() + sign + "长度不能超过" + max);
				return false;
			} else {
				return true;
			}
		}
	}

	//禁止包含中文验证器
	var chinese_validator = function(cntid, fieldVal) {
		this.validate = function(element) {
			var elVal = (fieldVal == "" ? element.val() : fieldVal);
			if (hasChinese(elVal)) {
				$("#" + cntid).data("flat", "false");
				setErrorTip(alertdom, "* " + element.parent().prev().text() + "不允许包含中文");
				return false;
			} else {
				return true;
			}
		}
	}
	
	//禁止包含空格验证器
	var space_validator = function(cntid, fieldVal) {
		this.validate = function(element) {
			var elVal = (fieldVal == "" ? element.val() : fieldVal);
			if (hasSpace(elVal)) {
				$("#" + cntid).data("flat", "false");
				setErrorTip(alertdom, "* " + element.parent().prev().text() + "请勿输入空格");
				return false;
			} else {
				return true;
			}
		}
	}

	$("#" + cntid + " [validate]").each(function() {
	
		var t = $(this);
		var v = t.attr("validate");
		var vv = v.split(",");		
		var fieldVal = '';
		if (types != null && types != '' && types.split(',').length > 0) {
			for (var i = 0; i < types.split(',').length; i++) {
				var tp = types.split(',')[i];
				var tc = t.attr('class');
				if (tc != null && tc.indexOf(tp) > -1) {
					if (tp == 'combotree') {
						fieldVal = t.combotree('getValue');
						break;
					} else if (tp == 'combogrid') {
						fieldVal = t.combogrid('getValue');
						break;
					} else if (tp == 'combobox') {
						fieldVal = t.combobox('getValue');
						break;
					} else if (tp == 'searchbox') {
						fieldVal = t.searchbox('getValue');
						break;
					}
				}
			}
		}
		for (var i = 0; i < vv.length; i++) {
			var _validator = null;
			switch (vv[i]) {
				case 'required':
					_validator = new required_validator(cntid, fieldVal);// 必填
					break;
				case 'number':
					_validator = new number_validator(cntid, fieldVal);// 数字
					break;
				case 'noChinese':
					_validator = new chinese_validator(cntid, fieldVal);// 不含中文
					break;
				case 'noSpace':
					_validator = new space_validator(cntid, fieldVal);// 不含空格
					break;
				case 'Integer':
					_validator = new isInt_validator(cntid, fieldVal);// 整数
					break;
				default:
					_validator = new max_validator(cntid, vv[i], fieldVal);// 最大值
			}
			_validator.validate(t, vv[i]);
		}
	});
	if ($("#" + cntid).data("flat") == true) {
		$("#" + cntid + " input").each( function() {
			$(this).val($.trim($(this).val()))
		})
	}
	return eval($("#"+cntid).data("flat"));
}

/**
 ** 删除验证失败的提示信息
 */
function clearErrorTip(element, cntid) {
	if (!cntid) {
		$(".validate_required").remove();
		$(".validate_required_element").removeClass("validate_required_element");
		element.attr('style', 'width:' + element.width() + 'px;display:none');
		element.html('');
	} else {
		$("#" + cntid + " .validate_required").remove();
		$("#" + cntid + " .validate_required_element").removeClass("validate_required_element");
		element.attr('style', 'width:' + element.width() + 'px;display:none');
		element.html('');
	}
}
/**
 ** 设置验证失败的提示信息
 */
function setErrorTip(element, errStr) {
	 if (element.attr('style').indexOf('display') > -1) {
		 element.attr('style', 'width:' + element.width() + 'px');
	 }
	 element.addClass("validate_required_element");
	 element.append("<span class='validate_required' style='color:red'>" + errStr + "</span><br>");
	 // element.after("<span class='validate_required' style='color:red'>" + errStr + "</span>");
}
 
function hasChinese(temp) {   
	var re = /[\u4e00-\u9fa5]/; 	
	if(re.test(temp)) {
		return true;
	} else {
		return false;
	}  
}

function hasSpace(temp) {
	var re =  /\s/g;
	if(re.test(temp)) {
		return true;
	} else {
		return false;
	}  
}

// 替换回车符为"|-n"，以便存储
function replaceEnter(str) { 
    var result = ""; 
    var c; 
    for (var i = 0; i < str.length; i++) { 
        c = str.substr(i, 1); 
        if (c == "\n") {
        	result = result + "|-n"; 
        } else if (c != "\r") {
        	result = result + c; 
        }
    } 
    if (result == "") {
    	return str; 
    }
    return result; 
} 

//将搜索关键字之间的空格全部替换为","，连续的空格替换为一个","
function replaceSpace(str) { 
    var result = ""; 
    var c; 
    for (var i = 0; i < str.length; i++) { 
        c = str.substr(i, 1); 
        var p = '';
        if (i > 1) {p = str.substr(i-1, 1);}
        if (c == " " && p != ',' && p != ' ') {
        	result = result + ","; 
        } else if (c !== ' ') {
        	result = result + c;
        }
    } 
    if (result == "") {
    	return str; 
    }
    return result; 
} 

// 英文单引号转英文双引号，不允许英文单引号入数据库表
function singleQuot2double(str) { 
    var result = ""; 
    var c; 
    for (var i = 0; i < str.length; i++) { 
        c = str.substr(i, 1); 
        if (c == "'") {
        	result = result + "\""; 
        } else if (c != "\r") {
        	result = result + c; 
        }
    } 
    if (result == "") {
    	return str; 
    }
    return result; 
} 

function progressStart(d) {
	
	openDiv(d);
}

function progressFinish(d) {
	
	closeDiv(d);
}

function progressEnd(w, d) {
	if (w.document.readyState != 'interactive') {
		setTimeout(function() {
			progressEnd(w, d);
		}, 200);
	} else {
		closeDiv(d);
	}
}

function openDiv(d) {
	d.OpenDiv();
}

function closeDiv(d) {
	d.CloseDiv();	
}

//替换某一个符号，以便显示（如将“\”替换为“/”）
function replacePunct(str, m, n) { 
    var result = ""; 
    var c; 
    for (var i = 0; i < str.length; i++) { 
        c = str.substr(i, 1); 
        if (c == m) {
        	result = result + n; 
        } else {
        	result = result + c; 
        }
    } 
    if (result == "") {
    	return str; 
    }
    return result; 
}
 /**
 id:主键id
 classname: 类名全路径。必须要hibernate映射过的
 返回的对象属性如果为对象类型，同样会被加载，集合类型不加载。
 */
 function loadObj(id,cn){
 	var ret ;
 	$.ajax({
		   type: "POST",
		   url: "object/loadSimpleObject.do",
		   data: {"id":id,"classname":cn},
		   async: false,
		   success: function(dat){
		     ret = dat;
		   }
	});
	return ret;
 }
 
 /**
重新设置行的序号
*/
function resetNo(grid){
	var j=1;
	var num = grid.getRowsNum();
	for(var i=0;i<num;i++){
		var id = grid.getRowId(i);
		var c = grid.cells(id,0);
		c.setValue(j++);
	}
}
 /*
 日志的机制：（只支持ie）
 事件源具有title属性时，如果事件中用jquery请求了服务器，那么title的属性值将被作为日志记录。
 
 通常日志会被自动记录。
 但是有些情况 没有调用jquery的ajax机制来请求服务器，比如$("#moduleForm").submit(); 
 或者此次事件操作没有请求服务器也希望记录日志时可调用log()方法。
 则需要手工调用此方法来记录日志。
 log() 为主动调用记录日志的方法。
 */
 function log(){
 	$.post("bizlog/log.do",{},function(){})
 }
 
 /*
 避免同一个请求出现相同日志时 调用nolog方法
 */
 function nolog(){
 	if(window.event){
 		if(window.event.srcElement){
		 	window.event.srcElement.title = '';
	 		if(window.event.srcElement.parentElement){
			 	window.event.srcElement.parentElement.title = '';
	 		}
 		}
 	}
 }
 
 /*
 将obj的值绑定到对应的元素上，对应关系为 元素的name属性值对应obj的属性名称。
 cnt 为容器范围内。
 支持无限级的对象属性：
 比如 对象{a:{b:"1"}}
 会将name为"a.b"的元素的值设置为1.
 */
 function bindForm(obj,cnt,pre){
 	if(!pre){
 		pre = "";
 	}
 	for(var o in obj){
 		if(typeof(obj[o]) == "string"||typeof(obj[o]) == "number"){
	 		$("#"+cnt+" [name="+pre+o+"]").val(obj[o]);
 		}else if(typeof(obj[o]) == "object" ){
 			bindForm(obj[o],cnt,o+".")
 		}
 	}
 }
 
 //修正win下面的input 不能选中
$(function(){
	$("input").mousemove(function(){
		window.event.cancelBubble = true
	})
	$("textarea").mousemove(function(){
		window.event.cancelBubble = true
	})
	
	var div = "<div id='myalert' style='z-index:99999;color:#90C3C7;font-weight:bold;display:none;text-align:center;"+
	"position:absolute;width:270px;height:115px;background-image:url(img/alert.gif)'>"
	+"<div style='height:40px;padding-left:244px;padding-top:3px;'><a href='javascript:hideMyAlert();'>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>"
	+"<div id='myalert_content'></div></div>";
	$("body").append(div);
})
function hideMyAlert(){
	$("#myalert").hide();
}

/**
 初始化select
 combo:select对应的dom对象
 sql：select value, html from ...   value和html将被映射到每个option上，两个值的顺序不能改变
 afterCall:回调函数,可用来初始化、过滤options
 */
function initSelect(combo,sql,afterCall){
  $.post("combo/loadSelect.do",{"sql":sql},function(data){
     $(combo).html("")
     for(var i=0;i<data.length;i++){
       $(combo).append("<option value='"+data[i].value+"'>"+data[i].html+"</option>")
     }
     afterCall();
  },'json')
}
//返回
function common_goback(){
	history.go(-1);
}

function myalert(str,out){
	var h = $(document).height();
	var w = $(document).width();
	var top = (h - 100)/2 - 90;
	var left = (w - 270)/2 - 100;
	if($("#pwin").css('display')=='block'){	//如果忙碌窗口可见，则隐藏
		$("#pwin").hide();
	}
	alert(str);
}
function myalert2(str,out){
	var h = $(document).height();
	var w = $(document).width();
	var top = (h - 100)/2 - 90;
	var left = (w - 270)/2 - 100;
	$("#myalert").css("top",top+"px");
	$("#myalert").css("left",left+"px");
	$("#myalert_content").html(str);
}
function openTab(id,name,url){//add by chenlj

	if(!parent.tabbar.cells(id)){
	    //处理tab页是否同名
	    isExistTab(parent.tabbar,parent.tabids,name);
		if(parent.existTabid!=""){//同名处理
			parent.tabbar.setTabActive(parent.existTabid);
		}else{
		    parent.tabbar.addTab(id,name,"130px")
		    parent.tabbar.cells(id).attachURL(url);
		    parent.tabbar.setTabActive(id);
		
		    parent.tabids = parent.tabids+id+",";//记录打开的tabid
		    parent.taburls = parent.taburls+url+",";//记录打开的taburl
		}
	}else{
		parent.tabbar.setTabActive(id);
	}
}
function closeTab1(){
    deleteTabVal(parent.tabbar.getActiveTab());
    parent.tabbar.removeTab(parent.tabbar.getActiveTab(),true);
}

//id为选中的TAB的id
function deleteTabVal(id){
    var ids = parent.tabids.split(",");
	var urls = parent.taburls.split(",");
	for(i=0; i<ids.length-1; i++){
	    if(ids[i]==id){
		    urls[i]="";
		    break;
		}
	}
    parent.taburls="";
	for(i=0; i<urls.length-1; i++){
		if(urls[i]!=""){
		    parent.taburls = parent.taburls+urls[i]+",";
		}
	}
	parent.tabids = parent.tabids.replace(id+",","");//关闭时去掉该tabid
}

function isExistTab(tabbar,tabids,tabname){//处理tab页是否同名,如同名返回tabid;不同返回空
    parent.existTabid="";
    var array = tabids.split(",");
	for(i=0; i<array.length-1; i++){//判断是否有重名tab，如有，则定位到已存在的TAB
        if(tabbar.getLabel(array[i])==tabname){
		    parent.existTabid = array[i];
			break;
		}
	}
}

/*
控制textarea的字数，传入的cnt2 是显示剩余字数容器的id
*/
jQuery.fn.extend({ 
	showWordCount: function(cnt2){
		$(this).bind('propertychange', function() {
	        $(this)._showWordCount(cnt2);
	    });
	    $(this).focus(function(){    
	        $(this)._showWordCount(cnt2);
	    });
	},
       _showWordCount: function(cnt2) { 
       		
           var _max = $(this).attr('max');
           var _length = $(this).text().length;
           if(_length > _max) {
               $(this).text($(this).text().substring(0, _max));
           }
           $("#"+cnt2).html(_max - _length);
       } 
   });
   
//加载loading的modal层，text为显示文本  
function loadingShow(text){
    
    var html="<div id='loadingDiv'>"+
	          "<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'>"+
		          "<tr><td align='center'>"+
		          "<p><font color='gray'>"+text+"</font></p>"+
		          "<img src='img/loading.gif'></img>"+
		          "</td></tr>"+
	          "</table>"+
          "</div>"
 if($("#loadingDiv").size()>0){	     
     $('#loadingDiv').window("open")
 }else{	     
    $(document.body).append(html)
    $('#loadingDiv').window({
	    width:350,
	    height:150,
	    modal:true,
	    title:'',
	    collapsible:false,
	    minimizable:false,
	    maximizable:false,
	    closable:true
	});
    //$("#loadingDiv").show()
 }         
}
 
function loadingHide(){
   
    if($("#loadingDiv").size()>0){	     
	     $('#loadingDiv').window("close")
	}
}

/* 
 * 用来遍历指定对象所有的属性名称和值
 * obj 需要遍历的对象
 * author: Jet Mah
 * website: http://www.javatang.com/archives/2006/09/13/442864.html 
 */ 
 function allPrpos(obj) { 
     // 用来保存所有的属性名称和值
     var props = "";
     // 开始遍历
     for(var p in obj){ 
         // 方法
         if(typeof(obj[p])=="function"){ 
             obj[p]();
         }else{ 
             // p 为属性名称，obj[p]为对应属性的值
             props+= p + "=" + obj[p] + "\t";
         } 
     } 
     // 最后显示所有的属性
     alert(props);
 }
 
function isNum(input){
     var re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/  
     if (!re.test(input)){
         return false;
     }else{
         return true;
     }
    
}

function refresh(url){
	window.location=basePath+url;
}

function openwindow(url,name,iWidth,iHeight){
	 var url;                                 //转向网页的地址;
	 var name;                           //网页名称，可为空;
	 var iWidth;                          //弹出窗口的宽度;
	 var iHeight;                        //弹出窗口的高度;
	 var iTop = (window.screen.availHeight-30-iHeight)/2;       //获得窗口的垂直位置;
	 var iLeft = (window.screen.availWidth-10-iWidth)/2;           //获得窗口的水平位置;
	 window.open(url,name,'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
}

function setAjaxProgress(){
	$.ajaxSetup({     
	    contentType:"application/x-www-form-urlencoded;charset=utf-8",     
	    beforeSend: function(XMLHttpRequest){
			//$.blockUI({
		 	//	 message: '<h3 style="padding:10px; margin:10px;font-weight:bold;"><img src="./images/busy.gif" /> 正在处理,请稍后...</h3>',
		 	//	 css: {border: '3px solid #a00'}
		   	 	 //,overlayCSS: {backgroundColor: '#E8E8E8'} 
		   	//	 ,overlayCSS: {opacity:0} 
		  	// });
		},
		error: function(xhr,status,error){
			alert("系统错误,请联系管理员!");
		},
	    complete:function(XMLHttpRequest,textStatus){
			$.unblockUI();
		}
	});
}

function cancelAjaxProgress(){
	$.ajaxSetup({     
	    contentType:"application/x-www-form-urlencoded;charset=utf-8",     
	    beforeSend: function(XMLHttpRequest){},
		error: function(xhr,status,error){
			alert("系统错误,请联系管理员!");
		},
	    complete:function(XMLHttpRequest,textStatus){}
	});
}

setAjaxProgress();