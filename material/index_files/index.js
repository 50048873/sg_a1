var xmldoc;
var modTree;
var browser;
$(function(){
		if (navigator.userAgent.indexOf("MSIE") > 0) { // For IE
			browser = 'ie';
		} else {
	        //window.alert('暂不支持该浏览器!');
			browser = 'ie';
	    }
		if (browser != null && (browser == 'ie' || browser == 'ff')) {
			createFileds();
		}
		$('#workarea').attr('src', 'page/workarea.jsp');
		
		$("#top_menu a").click(function(){
		    $("#top_menu a").removeClass("tabSelected")
		    $(this).addClass("tabSelected")
		})
		$("#top_menu").find("a").first().click();
		changeTheme();
})

function changeTheme(){
	
	$.ajax({
        type : 'post',  
         url : 'theme/getTheme.do',  
         data : "user_id=" + uid,
         async : false,  
         success : function(data){
        	 var theme = data.theme;
        	 initTheme(theme);
         }  
    }); 
	
	$("#themeSelect").change(function(){
		 var theme = $(this).val();
		 
		 $.post("theme/changeTheme.do",{user_id:uid,theme:theme},function(data){
			 initTheme(theme);
  		 });
	});
	
}

function initTheme(theme) {
	 $("#themeSelect option[value='"+theme+"']").attr("selected", true);
	 
	$("#easyuiTheme").attr("href", "js/jquery/easyui/themes/"+theme+"/easyui.css");
	
    var $iframe = $('#workarea'); 
	 $contents = $iframe.contents();
	 $contents.find('#easyuiTheme').attr('href', "js/jquery/easyui/themes/"+theme+"/easyui.css"); 
	 
	 var $iframe123 =  $contents.find('iframe'); 
	 $contents123 = $iframe123.contents();
	 $contents123.find('#easyuiTheme').attr('href', "js/jquery/easyui/themes/"+theme+"/easyui.css");
}

function backHome() {
	$('#workarea')[0].contentWindow.backHome();
}

function createFileds(){//请求后台，动态生成获取这个Accord 的item。同时为每个item生成一个树。树的id为tree+item的id	
    for(var i=0;i<topMenu.length;i++){
    	$("#top_menu").append('<li ><a onclick="javascript:reloadAccord(\''+topMenu[i][0]+'\');" style="cursor:pointer"><span>'+topMenu[i][1]+'</span></a></li>');
	} 
	$('#modAccord').accordion({ 
		fit:false,
		height:document.documentElement.clientHeight - 111,
		border:true,
	    animate:false,
		onSelect: function(title, index) { //alert(title);
			reloadTree(title);
		}
	}); 	 
	$("#top_menu").find("a").first().click();
}

function reloadAccord(pid) {  
    $.post("index/loadAccord.do",{parentid:pid},function(data){
         
		 var ps=$('#modAccord').accordion("panels");
		 var titles=[];
         if(ps){
             for(var i=0;i<ps.length;i++){
			     var p=ps[i].panel('options');
			     titles.push(p.title);		     			     
			 }
			 for(var i=0;i<titles.length;i++){
			     $('#modAccord').accordion("remove",titles[i]);
			 }
         }
		 
		 for(var i=0;i<data.length;i++){
			
			 if(i == 0) {
				$('#modAccord').accordion('add', {
					id:'tree_'+data[i][0],
				    title:data[i][1],
				    iconCls:data[i][2],
				    selected:true
				});								
			 }else {
				$('#modAccord').accordion('add', {
					id:'tree_'+data[i][0],
				    title:data[i][1],
				    iconCls:data[i][2],
					selected:false
				});
				
			 }
		}
    })

	
}

function reloadTree(title) {
	// 将菜单树绑定到当前选中的 ACCORDION 面板中
	var pp = $('#modAccord').accordion('getPanel', title);
	if (pp){	
	    
		var rootId = pp.panel('options').id.split('_')[1];
		$.post("index/loadSysTopTree.do",{"parentid":rootId},function(data){
		   //隐藏子菜单树为空的According
		   if(data==""){
		       $('#modAccord').accordion('remove', title);
		   }
           var modTreeHtml = "";
           var id = data.split(",");
           for(var i =0;i<id.length;i++){
                modTreeHtml += '<ul id="modTree_' + id[i] + '" class="easyui-tree" data-options="onClick: function(node){$(this).tree(\'toggle\', node.target);}">';
				modTreeHtml += '</ul>';
			}
				pp.html(modTreeHtml);
				$.parser.parse(pp);	// 局部格式化，仅格式化当前的 PANEL
			for(var i =0;i<id.length;i++){
				modTree = $('#modTree_' + id[i]);
				modTree.tree({ 
				url: basePath + 'index/loadSysTreeMenu.do?parentId='+id[i],
		        onSelect: function(node){
		           $(".tree-node").click(function(){
					    $(".tree-node").removeClass("tree-node-selected")
					    $(this).addClass("tree-node-selected")
					})
		            if ($('#workarea').attr('src') != 'page/workarea.jsp') {
						var url = node.attributes.column0;
						var icon = node.iconCls;
						if (url!="" && url !='page/') {
							$('#workarea').attr('src', 'page/workarea.jsp');
						     $("#workarea").load(function(){ 
						         $('#workarea')[0].contentWindow.loadContent(node.id, node.text,url,icon);	
						     }); 
					    }
					}else{
					    var url = node.attributes.column0;
					    var icon = node.iconCls;
						if (url!="" && url !='page/') {		
						     $('#workarea')[0].contentWindow.loadContent(node.id, node.text,url,icon);
						   
					    }
					}
				},
				onLoadSuccess: function(node, data){
					
				}
			  });
           }
           
	
	    })
		
	}
	// 去掉遮盖层
	$("#bg").hide();
	$("#show").hide();
}

//修改密码
function changePsw(){
		$('#editDiv').dialog('open').dialog('setTitle','密码修改');		
}
function doChangePsw(){
   if(!checkPsw($("#newpsw1").val())){
	    alert("密码不应小于6位,且至少包含一位字母和一个数字");
	    return false;
	}	
	$.ajax({
		   type: "POST",
		   url: "editPsw.do",
		   data: "psw="+$("#psw").val()+"&new1="+$("#newpsw1").val()+"&new2="+$("#newpsw2").val(),
		   async: true,
		   success: function(msg){
		   		if( msg=="origin psw wrong" ){
		   			alert("原始密码错误，请重试！");
		   		}
		   		else if( msg=="different psw" ){
		   			alert("两次输入新密码不相同，请重试！");
		   		}
		   		else if( msg=="not null" ){
		   			alert("新密码不能为空!");
		   		}
		   		else if( msg=="success" ){
		   			alert("密码修改成功！");
		   			$("#editDiv").dialog('close');
		   		}
		   }
		   });
}
function checkPsw(s){ 
      if ((s.length>=6&&s.match(/[a-zA-Z]/) && s.match(/\d/))||(s.length>=6&&s.match(/[a-zA-Z]/) && s.match(/\d/) && s.match(/[_]/))){
       return true;
      } else{       
       return false; 
      }
}
function logOut(){
	$('#logoutDiv').dialog('open').dialog('setTitle','确认退出');			
}
function doLogout(){
	window.location.href="logout.do";
}
