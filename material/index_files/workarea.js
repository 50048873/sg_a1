var tabIdArr = new Array();
$(function() {
	 
});
var isRefresh = false;
// 加载工作区内的内容：创建 TAB 面板，载入内容
function loadContent(id, text, url, frametype) {
	url = basePath + url;
	id="123";
	$('#modTabs').tabs();
	if ($('#modTabs').tabs('exists', text)) {	// 检查 TAB 页是否存在，存在则选中，不存在则新增
		$('#modTabs').tabs('select', text);
		//$("#iframe_"+id).attr("src",url);       //点击菜单时刷新tab内容,直接点击tab切换时不刷新
	} else {
		$('#modTabs').tabs('add',{
			title: text,
			content: '<iframe id="iframe_' + id + '" scrolling="yes" frameborder="0" src="' + url + '" style="width:100%;height:100%;"></iframe>',
			closable:true,
			cache:true
		});		
	}
}
function backHome() {
	var tab = $('#modTabs').tabs('getSelected');
	if(tab.title != "首页") {
		$('#modTabs').tabs('select','首页');
	}
}

function closeTabs(opertype) {
alert()
	var tabArr = $('#modTabs').tabs('tabs');
	if (tabArr != null && tabArr.length > 0) {
		if (opertype == 'other') {
			var selTab = $('#modTabs').tabs('getSelected');
			for (var i = tabArr.length - 1; i > -1; i--) {
				if (tabArr[i].panel('options').title != selTab.panel('options').title && tabArr[i].panel('options').title != "首页") {
					$('#modTabs').tabs('close', tabArr[i].panel('options').title);
				}
			}
		} else if (opertype == 'all') {
			for (var i = tabArr.length - 1; i > -1; i--) {
				if (tabArr[i].panel('options').title != "首页") {
					$('#modTabs').tabs('close', tabArr[i].panel('options').title);
				}
			}
		}		
	}
}

function selectTabs() {
	if(isRefresh) {
		 var currTab =  $('#modTabs').tabs('getSelected');
		 var id = $(currTab.panel('options').content).attr('id');
		 var myiframe = document.getElementById(id);
		 if(myiframe != null && myiframe != "") {
		 	myiframe.src = myiframe.src;
		 } else {
		 	if(currTab.text == "集成待办" || currTab.text == "流程待办" || currTab.text == "流程已办") {
			 	location.replace(location.href);
		 	}
		 }
		 isRefresh = false;
	}
}
function closeTabs1() {
	
	isRefresh = true;
}

function getViewName(){
	return 'tabs';
}



