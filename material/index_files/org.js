var nodeSelect = "";
var textSelect = "";
var array = "";
var stat = "";
$(function(){
	
	$.ajax({
        type : 'post',  
         url : 'theme/getTheme.do',  
         data : "user_id=" + uid,
         async : false,  
         success : function(data){
        	 var theme = data.theme;
        	 $("#easyuiTheme").attr("href", "js/jquery/easyui/themes/"+theme+"/easyui.css");
         }  
    });
	
	initTree();
	loadGrid();
})

function initTree() {
	$('#orgTree').tree({ 
		lines:true,
		url: basePath + 'org/loadnewOrgTree.do',
		onSelect: function(node){
			$("#grid").datagrid("clearSelections");	//清除复选框
		    $('#grid').datagrid('getPager').pagination('refresh', {
		    	pageNumber: 1
		    });
		    $('#grid').datagrid('options').pageNumber = 1;		
		    var queryParams = $('#grid').datagrid('options').queryParams;  
		    nodeSelect = node.id;  
		    textSelect = node.text;
		    stat = node.attributes.type;
		    queryParams.nodeid = node.id;		    
		    $('#grid').datagrid('clearSelections');  
		    $('#grid').datagrid('reload');	// 在reload时会默认读取以上参数
		},
       onLoadSuccess: function(node){
	    	$('#orgTree').tree("expandAll");
	    	var r=$('#orgTree').tree("getRoot");
	    	$('#orgTree').tree('select', r.target);
	    	$("#bg").hide();
			$("#show").hide();
		}
	});
}

//加载表格
function loadGrid(){
	$('#grid').datagrid({
		width: getGridWidth(),
		height: getGridHeight(),
		striped: true,
		url: basePath + 'org/loadorgGrid.do?parentId='+org,
		idField: 'orgId',
		columns: [[
			{field:'orgId', checkbox:'true', width:30},  
			{field:'orgType', title:'机构类型', width:60, align:'left'},
			{field:'orgName', title:'机构名称',width:70, align:'center'},
			{field:'parentid', title:'所属单位', width:70, align:'center'},
			{field:'detail', title:'所含岗位', hidden:true}
		]],
		pageSize:10,
	    pageList:[5,10,15,20],		
		loadMsg: '',
		pagination: true,
		rownumbers: true
	});
}

//按钮事件--弹出添加组织机构的对话框
function addOrg(){
	if(nodeSelect==""){
	   alert("请先在左边的模块树中选择一个上级节点");
	   return;
	}
	if(stat==400){
	   alert("处室下面不能添加组织结构");
	   return;
	}
	clearErrorTip($('#validText'), 'fm');
	$("#orgId").val("");
	$('#orgWin').dialog('open').dialog('setTitle','新增组织机构'); 
	$("#type").show();  
	$('#fm').form('clear');   
	$("#parent_Text").val(textSelect);
	$("#parentid").val(nodeSelect);
	initTypeSel(nodeSelect);
	initrolesSel()
}
function initTypeSel(orgid){
	$.post("org/loadOrgType.do",{orgid:orgid},function(data){		
	
		$("#orgType").html("");
		for(var i=0;i<data.length;i++){
			$("#orgType").append("<option value='"+data[i].id+"'>"+data[i].value+"</option>")
		}
		$("#orgType option").each(function(){
			if ($(this).val() == '-1') {
				$("#orgType").val('-1');
			}
		})
		
	})
	
}
function initrolesSel(){
	 $('#roles').combotree({   
	      url:basePath + 'role/loadPublicRole.do',
	      onlyLeafCheck:true	
	 });
}
function compare(roleids){
var less="";
var more="";
   for(var i =0;i<array.length;i++){
	        if( $.inArray(array[i], roleids)==-1){
	             if(less!=""){
	                less +=",";
	             }
	             less += array[i];
	         }
	   }
	for(var i =0;i<roleids.length;i++){
	        if( $.inArray(roleids[i], array)==-1){
	        if(more!=""){
	                more +=",";
	             }
	             more += roleids[i];
	         }
	   }
	   return more+":"+less;
}
//编辑角色
function editrolesSel(orgid,roleids){	   
	   for(var i =0;i<array.length;i++){
	        if( $.inArray(array[i], roleids)==-1){
	             var data = isExitUser(orgid,array[i]); 
	             if(data=="yes"){
	                 var node = $('#roles').combotree('tree').tree('find',array[i]);
                     alert("角色 "+node.text+" 下有人员不能删除");                   
                    return true;
	             }
	          }
	   }
	   return false;	         	
}
//按钮事件--弹出编辑模块对话框
function editOrg(){
    clearErrorTip($('#validText'), 'fm');
    var  id = getCheckedRow();
    if(id == null || id == ""){
    	alert("请先选择要编辑的行");
    	return;
    }else if(id.split(",").length>1){
        alert("只能选择一行进行编辑!");
    	return;
    }
    $("#orgId").val(id);
    $('#orgWin').dialog('open').dialog('setTitle','编辑组织机构');   
	$('#fm').form('clear');   
	$("#parent_Text").val( $('#grid').datagrid('getSelected').parentid);
	$("#orgType").val( $('#grid').datagrid('getSelected').orgType);
	initrolesSel();
	$("#type").hide();
    initOrgForm(id);
}
//初始化orgForm表单
function initOrgForm(id){
  if(id==null){    
  }else{
    var obj = loadObj(id,"com.hdkj.common.sysadmin.access.entity.SysOrg");
    bindForm(obj,"fm");
    $.ajaxSetup({async:false}); //设置同步执行ajax请求
    $.post("org/loadRoleNames.do",{"orgId":id},function(data){
    	var ids = data.substr(data.indexOf("_")+1).split(",");
    	array = ids;
    	$('#roles').combotree('setValues',ids);
    	//$('#roles').combotree('check', ids);    
    });
  }
}

//获得选中的行id
function getCheckedRow(){
	var ids=""
	var rows = $('#grid').datagrid('getChecked');
	for(var i=0;i<rows.length;i++){
	   if(ids==""){
	     ids = rows[i].orgId;
	   }else{
	     ids +=","+rows[i].orgId
	   }
	}
	return ids
}
//win按钮事件--保存
 function saveAddOrg(){
    var node = $('#orgTree').tree('getSelected');
    if (validate('fm', 'combotree', $('#validText'))){
    var orgId=$("#orgId").val();
	var orgCode=$("#orgCode").val();
	var orgName=$("#orgName").val();
	var orgType=$("#orgType").val();	
	var parentid=$("#parentid").val();
	var orgInfo=$("#orgInfo").val();
	var roles = $("#roles").combotree("getValues");
	if(checkOrgDuplicated(orgId, orgName)){
		  alert("当前级别下存在同名组织");
		  return false;
	}
	if(editrolesSel(orgId,roles)){
	    return false;
	}
	var moreorless = compare(roles);
	$.post("org/saveOrg.do?roles="+roles,{"orgId":orgId,"orgCode":orgCode,"orgName":orgName,"orgType":orgType,"parentid":parentid,"orgInfo":orgInfo,"moreorless":moreorless},function(){	
		  //增加    
		  if(orgId==""){	
			 alert("添加组织机构成功");
			$('#orgWin').dialog('close');		
			$('#grid').datagrid('reload');
			$('#orgTree').tree('reload');
		  }else{ //编辑
		    alert("修改组织机构成功")
		    $('#orgWin').dialog('close');		
			$('#grid').datagrid('reload');
			$('#orgTree').tree('reload');
		  }		  
	})
  }
 }
//按钮事件--删除
function deleteOrg(){		
    var  id = getCheckedRow(); 
    var idArray=id.split(",");
    if(id==""){
      alert("请先选中要删除的行")
      return false;
    }
    for(var i=0;i<idArray.length;i++){
        if(idArray[i]==org){
            alert("选中的节点含有根节点，不能进行删除")
            return false;
        } 
        var node = $('#orgTree').tree('find',idArray[i]);
        var children=$("#orgTree").tree('getChildren',node.target);
        if(children.length>0){
            alert("选中的节点中有的含有下属机构,不能进行删除");
            return false;
        }
    }
    $.post("org/checkUser.do",{"orgId":id},function(data){
      if(data=="yes"){
        alert("该组织下存在用户，请先删除这些用户")
      }else{
    	  if(confirm("是否确定删除选中的组织机构？")){
    		  $.post("org/delOrg.do",{"orgId":id},function(){
   			    alert("删除成功！");
   			    $('#grid').datagrid('reload');
   		    	$('#orgTree').tree('reload');
   		    	$('#grid').datagrid('clearChecked');
    		  });
    		}else{
    		  return false;
    		}
	  }
    });
}

//初始化组织机构到GPRS
function syncOrgToGPRS(){
	if(confirm("初始化操作将删除GPRS的相关机构表数据(CompanyUnit,DeviceGroups),你确定吗?")){
		$.post("org/SyncOrgToGPRS.do",function(){
			alert("初始化完成!");
		});
	}else{
		return false;
	}
}

//判断角色下是否存在用户
function isExitUser(orgid,roleid){
    var dat="";
    $.ajaxSetup({async:false}); //设置同步执行ajax请求。
    $.post("org/isExistUser.do",{"orgid":orgid,"roleid":roleid},function(data){      
        dat = data;
    });
    return dat;
    
}
function checkOrgDuplicated(id, name){
    if(id!=""&& 0==id){
        return false;
    }else{
      var node = $('#orgTree').tree('find',id);
      if(node){
	      var pnode = $('#orgTree').tree('getParent',node.target);
	      if(pnode){
		        var children=$("#orgTree").tree('getChildren',pnode.target);
		        for(i=0;i<children.length;i++){
		         if(id!=children[i].id){
		                if(children[i].text==name){
		                    return true;
		                }
		            }
		       }
	       }
      }   
        return false;
    }
}
//按钮事件--上移
function moveUp(){
	var node = $('#orgTree').tree("getSelected");
	if(node){
	 var id = node.id;
	 $.ajaxSetup({async:false}); //设置同步执行ajax请求
		$.post("org/moveitem.do?id="+node.id+"&ud=up",{},function(){

		});
		$('#orgTree').tree('reload');
		var noded = $('#orgTree').tree('find',id);
		if(noded){
		   $('#orgTree').tree('select', noded.target);
		}		
	}
}
//节点下移
function moveDown(){
    var node = $('#orgTree').tree("getSelected");
	if(node){
	 var id = node.id;
	 $.ajaxSetup({async:false}); //设置同步执行ajax请求
		$.post("org/moveitem.do?id="+node.id+"&ud=down",{},function(){

		});
		$('#orgTree').tree('reload');
		var noded = $('#orgTree').tree('find',id);
		if(noded){
		   $('#orgTree').tree('select', noded.target);
		}		
	}
}
function getGridWidth(){
    return $(document).width() - 200;
}

function getGridHeight(){
    return $(document).height() - 18;
}


 