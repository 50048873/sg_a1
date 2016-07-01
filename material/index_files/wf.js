var instIdTemp = "";
var curNodeTemp = "";
var fromUserTemp = "";
var lineIdTemp = "";
var commentTemp = "";
var handlerTypeTemp = "";

/**
 * 提交流程处理，根据情况可能弹出选人窗口
 * 
 * @param funcModeCode 业务代码
 * @param flowInstId 流程实例ID
 * @param currNode 当前节点
 * @param lineId 线路ID
 * @param handlerType 01-通过，02-不通过
 * @param afterCall 回调方法
 */
function commitFlow(funcModeCode, flowInstId, currNode, lineId, handlerType, afterCall) {
	// 先判断下一步是否存在多人可选
	$.ajax({
		url : basePath + "wfCommon/checkNextNode.do",
		data : {
			currNode : currNode,
			lineId : lineId,
			instId : flowInstId
		},
		success : function(data) {
			if (data == "more") {
				// 实例ID、当前节点、当前处理人、路线、意见、是否通过
				instIdTemp = flowInstId;
				curNodeTemp = currNode;
				fromUserTemp = "";
				lineIdTemp = lineId;
				commentTemp = "";
				handlerTypeTemp = handlerType;
				document.getElementById("userWin").style.display = "";// 下一步处理人选择窗口
				initChooseWin(flowInstId, currNode, lineId);// 加载下一步处理人选择窗口
				$('#userTable').datagrid('clearSelections');
				$('#userWin').window('open');
			} else if (data == "none") {
				alert("未找到下一步处理人,请检查流程配置");
			} else if (data == "finish") {
				submitWf(flowInstId, currNode, "", "", lineId, handlerType, "", afterCall);
			} else {
				submitWf(flowInstId, currNode, "", data, lineId, handlerType, "", afterCall);
			}
		}
	});
}

/**
 * 判断下一节点是否有多人可选
 * 
 * @param flowInstId 流程实例ID
 * @param currNode 当前节点
 * @param fromUser 当前处理人ID
 * @param handlerType 处理结果(通过01/不通过02)
 * @param lineId 线路ID
 * @param deptId 部门ID
 * @param comment 处理意见
 * @param afterCall 回调函数
 */
function checkNextNode(flowInstId, currNode, lineId, handlerType, comment, afterCall) {
	$.ajax({
		url : basePath + "wfCommon/checkNextNode.do",
		data : {
			currNode : currNode,
			lineId : lineId,
			instId : flowInstId
		},
		success : function(data) {
			if (data == "more") {
				// 实例ID、当前节点、当前处理人、路线、意见、是否通过
				instIdTemp = flowInstId;
				curNodeTemp = currNode;
				fromUserTemp = fromUser;
				lineIdTemp = lineId;
				commentTemp = comment;
				handlerTypeTemp = handlerType;
				document.getElementById("userWin").style.display = "";// 下一步处理人选择窗口

				// 加载下一步处理人选择窗口
				initChooseWin(flowInstId, deptId, currNode, lineId);
				$('#userTable').datagrid('clearSelections');
				$('#userWin').window('open');
			} else if (data == "none") {
				alert("未找到下一步处理人,请检查流程配置");
			} else if (data == "finish") {
				submitWf(flowInstId, currNode, fromUser, "", lineId, handlerType, comment, afterCall);
			} else {
				submitWf(flowInstId, currNode, fromUser, data, lineId, handlerType, comment, afterCall);
			}
		}
	});
}

/**
 * 有指定处理人的流程处理
 * 
 * @param flowInstId 流程实例ID
 * @param currNode 当前节点
 * @param fromUser 当前处理人ID
 * @param toUser 下一步处理人ID
 * @param lineId 线路ID
 * @param handlerType 处理结果(通过01/不通过02)
 * @param comment 处理意见
 * @param afterCall 回调函数
 */
function submitWf(flowInstId, currNode, fromUser, toUser, lineId, handlerType, comment, afterCall) {
	comment = encodeURIComponent(comment);
	$.ajax({
		url : basePath + "wfCommon/handlerFlowIns.do",
		data : {
			flowInstId : flowInstId,
			currNode : currNode,
			fromUser : fromUser,
			toUser : toUser,
			lineId : lineId,
			handlerType : handlerType,
			comment : comment
		},
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(msg) {
			if (msg != "") {
				alert(msg);
				return;
			}
			afterCall(flowInstId, currNode, fromUser, toUser, lineId, handlerType, comment);
		}
	});
}

/**
 * 加载下一步处理人选择窗口
 * 
 * @param flowInstId 流程实例ID
 * @param currNode 当前节点
 * @param lineId 线路ID
 */
function initChooseWin(flowInstId, currNode, lineId) {
	$('#userTable').datagrid({
		fitColumns : true,
		heigth : '350px',
		url : 'wfCommon/loadUserByRole.do',
		idField : 'id',
		queryParams : {
			currNode : currNode,
			lineId : lineId,
			instId : flowInstId
		},
		columns : [
			[
				{
					field : 'id',
					checkbox : 'true',
					width : 30
				}, {
					field : 'username',
					title : '姓名',
					width : 60,
					align : 'center'
				}, {
					field : 'dealCount',
					title : '待办条数',
					width : 40,
					align : 'center',
					formatter : formatDeal
				}
			]
		],
		loadMsg : '数据装载中......',
		rownumbers : true,
		singleSelect : true,
		checkOnSelect : true
	});
}

function formatDeal(value, row, index) {
	var userId = row.id;
	var result = value;
	if (typeof afterUserWin!='undefined' && value > 0) {
		result = "<a style='text-decoration: none;' href='javascript:afterUserWin(\"" + userId + "\");'>" + value + "</a>";
	} else {
		result = value;
	}
	return result;
}

/**
 * 下一步处理人确认按钮
 */
function choosePerson() {
	var rows = $('#userTable').datagrid('getChecked');
	if (rows.length == 1) {
		$.ajax({
			url : basePath + "wfCommon/handlerFlowIns.do",
			data : {
				flowInstId : instIdTemp,
				currNode : curNodeTemp,
				fromUser : fromUserTemp,
				toUser : rows[0].id,
				lineId : lineIdTemp,
				handlerType : handlerTypeTemp,
				comment : commentTemp
			},
			async : true,
			success : function(msg) {
				$('#userWin').window('close');
				if (typeof afterWfCommit != "undefined" && afterWfCommit) {
					afterWfCommit(instIdTemp, curNodeTemp, fromUserTemp, rows[0].id, lineIdTemp, handlerTypeTemp, commentTemp);
				}
			}
		});
	} else {
		alert("只能选择一个用户进行提交");
	}
}

/**
 * 关闭下一步流程人员选择窗口
 */
function closeUserWin() {
	$('#userWin').window('close');
	document.getElementById("userWin").style.display = "none";
}

/**
 * 新增tab
 * 
 * @param id iframeId
 * @param text tab的标题名称
 * @param url 嵌套iframe的src属性值
 */
function addTab(id, text, url) {
	if (parent.$('#modTabs').tabs('exists', text)) {
		parent.$('#modTabs').tabs('select', text);
	} else {
		parent.$('#modTabs').tabs('add', {
					title : text,
					content : '<iframe id="iframe_' + id + '" scrolling="yes" frameborder="0" src=' + url + ' style="width:100%;height:100%;"></iframe>',
					closable : true,
					cache : true
				});
	}
}

/**
 * 关闭当前tab并跳转刷新原tab
 */
function closeTab() {
	var selTitle = parent.$('#modTabs').tabs('getSelected').panel('options').title;
	parent.$('#modTabs').tabs('close', selTitle);
}

/**
 * 根据当前节点获取按钮信息
 * 
 * @param funcModeCode 业务代码
 * @param instId 流程实例ID
 * @param curNode 当前节点
 * @param btnDiv 嵌套返回结果的div
 */
function initFlowInfo(funcModeCode, instId, curNode, btnDiv) {
	$.ajax({
		url : basePath + "wfCommon/getBtnByCurNode.do",
		data : {
			curNode : curNode
		},
		async : false,
		success : function(data) {
			if (data != null) {
				var result = "";
				$.each(data, function(i, val) {
					result += '<a id="' + val.id + '" class="easyui-linkbutton" href="javascript:void(0);" onclick="javascript:submitFunction' + '(\'' + funcModeCode + '\',\'' + instId + '\',\'' + curNode + '\',\'' + val.id + '\',\'' + val.lineType + '\')">' + val.lineName + '</a> ';
				});
				$("#" + btnDiv).append(result).find(".easyui-linkbutton").linkbutton();
			}
		}
	});

}

/**
 * 获取的按钮触发事件
 * 
 * @param funcModeCode 业务代码
 * @param instId 流程实例ID
 * @param curNode 当前节点
 * @param lineId 线路ID
 * @param handlerType 01-通过，02-不通过
 */
function submitFunction(funcModeCode, instId, curNode, lineId, handlerType) {
	var isPass = true;
	if (typeof validataForm != "undefined" && validataForm) {
		isPass = validataForm();
	}
	if(isPass == "false" || isPass == false) {
		return false;
	}
	if (instId == null || instId == "" || instId == "null") {// 申请：获得实例ID
		$.ajax({
			type : "POST",
			url : basePath + "wfCommon/startFlowIns.do",
			async : false,
			data : {
				userId : userId,
				funcModeCode : funcModeCode
			},
			success : function(data) {
				if (data != null || data != "") {
					instId = data;
				}
			}
		});
	}

	commitFlow(funcModeCode, instId, curNode, lineId, handlerType, function(flowInstId, currNode, fromUser, toUser, lineId, handlerType, comment) {
		if (typeof afterWfCommit != "undefined" && afterWfCommit) {
			afterWfCommit(flowInstId, currNode, fromUser, toUser, lineId, handlerType, comment);
		}
	});
}

/**
 * 退回第一步
 */
function backFirstStep(comment) {
	comment = encodeURIComponent(comment);
	$.ajax({
		url : basePath + "wfCommon/backFirstStep.do",		
		data : {
			curNode : curNode,
			instId : instId,
			userId : userId,
			comment : comment
		},
		async : true,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(msg) {
			if (msg != "") {
				alert(msg);
			} else {
				alert("退回成功");
				closeTab();
			}
		}
	});
}

/**
 * 退回上一步
 */
function backOneStep(comment) {
	comment = encodeURIComponent(comment);
	$.ajax({
		url : basePath + "wfCommon/backOneStep.do",
		data : {
			curNode : curNode,
			instId : instId,
			userId : userId,
			comment : comment
		},
		async : true,
		contentType: "application/x-www-form-urlencoded; charset=utf-8", 
		success : function(msg) {
			if (msg != "") {
				alert(msg);
			} else {
				alert("退回成功");
				closeTab();
			}
		}
	});
}

/**
 * 退回任意一步<br>
 * 只退回流程所走过的除当前节点的步骤(譬如有退回的操作)
 */
function backAnyStep() {
	document.getElementById("anyNodeWin").style.display = "";
	initAnyNodeChooseWin(instId, curNode);
	$('#anyNodeWin').window('open');
}

/**
 * 加载历史节点窗口
 * 
 * @param flowInstId 流程实例ID
 * @param currNode 当前节点
 */
function initAnyNodeChooseWin(instId, curNode) {
	$('#anyNodeTable').datagrid({
		fitColumns : true,
		heigth : '350px',
		url : 'wfCommon/backAnyStep.do',
		idField : 'nodeId',
		queryParams : {
			instId : instId,
			curNode : curNode
		},
		columns : [
			[
				{
					field : 'nodeId',
					checkbox : 'true',
					width : 30
				}, {
					field : 'nodeName',
					title : '节点名称',
					width : 60,
					align : 'center'
				}
			]
		],
		loadMsg : '数据装载中......',
		rownumbers : true,
		singleSelect : true,
		checkOnSelect : true
	});
}

/**
 * 选中某个节点判断是否有多人可选
 */
function chooseAnyNode() {
	// 1.关闭历史节点窗口
	$('#anyNodeWin').window('close');

	var rows = $('#anyNodeTable').datagrid('getChecked');
	if (rows.length == 1) {
		// 2.判断选中节点是否有多人可选
		checkSelectedNodeUser(rows[0].nodeId, "01", "退回任意一步");
	} else {
		alert("请选择任意一条数据进行提交");
	}
}

/**
 * 关闭历史节点
 */
function closeAnyNodeWin() {
	$('#anyNodeWin').window('close');
	document.getElementById("anyNodeWin").style.display = "none";
}

/**
 * 判断选中节点是否有多人可选
 * 
 * @param instId
 * @param selectedNode
 */
function checkSelectedNodeUser(selectedNode, handlerType, comment) {
	$.ajax({
		url : basePath + "wfCommon/checkSelectedNodeUser.do",
		data : {
			selectedNode : selectedNode,
			instId : instId
		},
		success : function(data) {
			if (data == "more") {
				curNodeTemp = selectedNode;
				handlerTypeTemp = handlerType;
				commentTemp = comment;
				document.getElementById("anyNodeUserWin").style.display = "";
				inistChooseAnyNodeUserWin(selectedNode);// 加载选中的节点处理人选择窗口
				$('#anyNodeUserTable').datagrid('clearSelections');
				$('#anyNodeUserWin').window('open');
			} else if (data == "none") {
				alert("未找到下一步处理人,请检查流程配置");
			} else if (data == "finish") {
				submitAnyNodeWf(selectedNode, "", handlerType, comment);
			} else if (data == "first") {
				closeAnyNodeWin();
				backFirstStep(comment);
			} else {
				submitAnyNodeWf(selectedNode, data, handlerType, comment)
			}
		}
	});
}

/**
 * 指定选中的节点处理人流程处理方法
 * 
 * @param instId
 * @param selectedNode
 * @param toUser
 * @param handlerType
 * @param comment
 */
function submitAnyNodeWf(selectedNode, toUser, handlerType, comment) {
	comment = encodeURIComponent(comment);
	$.ajax({
		url : basePath + "wfCommon/backAnyNodeFlowIns.do",
		data : {
			instId : instId,
			curNode : curNode,
			nextNode : selectedNode,
			fromUser : userId,
			toUser : toUser,
			handlerType : handlerType,
			comment : comment
		},
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(msg) {
			if (msg != "") {
				alert(msg);
				return;
			}
			$('#anyNodeWin').window('close');
			alert("退回成功");
			closeTab();
		}
	});
}

/**
 * 加载选中的节点处理人选择窗口
 * 
 * @param instId
 * @param selectedNode
 */
function inistChooseAnyNodeUserWin(selectedNode) {
	$('#anyNodeUserTable').datagrid({
		fitColumns : true,
		heigth : '350px',
		url : 'wfCommon/loadSelectedNodeUserByRole.do',
		idField : 'id',
		queryParams : {
			selectedNode : selectedNode,
			instId : instId
		},
		columns : [
			[
				{
					field : 'id',
					checkbox : 'true',
					width : 30
				}, {
					field : 'username',
					title : '姓名',
					width : 60,
					align : 'center'
				}, {
					field : 'dealCount',
					title : '待办条数',
					width : 40,
					align : 'center'
				}
			]
		],
		loadMsg : '数据装载中......',
		rownumbers : true,
		singleSelect : true,
		checkOnSelect : true
	});
}

/**
 * 节点处理人选择窗口-确定按钮
 */
function chooseAnyNodeUser() {
	var rows = $('#anyNodeUserTable').datagrid('getChecked');
	if (rows.length == 1) {
		$.ajax({
			url : basePath + "wfCommon/backAnyNodeFlowIns.do",
			data : {
				instId : instId,
				curNode : curNode,
				nextNode : curNodeTemp,// 选中的节点
				fromUser : userId,
				toUser : rows[0].id,
				handlerType : handlerTypeTemp,
				comment : commentTemp
			},
			async : true,
			success : function(msg) {
				if (msg != "") {
					alert(msg);
				} else {
					$('#anyNodeUserWin').window('close');
					alert("退回成功");
					closeTab();
				}
			}
		});
	} else {
		alert("请选择任意一条数据进行提交");
	}
}

/**
 * 关闭选中的处理人窗口
 */
function closeAnyNodeUserWin() {
	// 关闭选中的处理人窗口
	$('#anyNodeUserWin').window('close');
	document.getElementById("anyNodeUserWin").style.display = "none";

	// 打开历史节点窗口
	document.getElementById("anyNodeWin").style.display = "";
	$('#anyNodeWin').window('open');
}
//// -------------- 将查看待办条数详情加入此处，不用每一个页面都写一下代码 start 

function afterUserWin(userId){
	$('#win').window('open');
	initDbGrid(userId);
}

function initDbGrid(userId) {
	$('#dbGrid').datagrid({
		width : getGridWidth(),
		height : getGridHeight(),
		nowrap : true,
		autoRowHeight : false,
		striped : true,
		collapsible : true,
		fitColumns : false,
		url : basePath + "wfCommon/getFlowInsToDoByUser.do",
		queryParams : {
			userId : userId,
			funcModeCode : funcModeCode
		},
		idField : 'instId',
		columns : [[{
			field : 'insTitle',
			title : '<span class="txtleft">标题</span>',
			width : 100,
			align : 'center'
		},{
			field : 'projectName',
			title : '工程编号',
			align : 'left'
		},{
			field : 'startUser',
			title : '发起人',
			width : 80,
			align : 'center'
		}, {
			field : 'nodeName',
			title : '执行步骤',
			width : 150,
			align : 'center'
		}, {
			field : 'lastUser',
			title : '上一步执行人',
			width : 80,
			align : 'center'
		}, {
			field : 'getTime',
			title : '获得待办时间',
			width : 150,
			align : 'center'
		}, {
			field : 'lastDealTime',
			title : '剩余处理时间',
			width : 80,
			align : 'center',
			styler : cellStyler,
			formatter : format
		}]],
		pageNumber : 1,
		pageSize : 15,
		pageList : [15, 20, 25, 30],
		loadMsg : '数据装载中......',
		pagination : true,
		rownumbers : true,
		singleSelect : true
	});
}

// 单元格样式
function cellStyler(value,row,index) {
	if(value == "该节点已被删除") {
		return "color:red;";
	} else if(Number(value) < 0) {
		return "color:red;";
	}
}
function format(value,row,index) {
	return value+"(小时)";
}
function getGridWidth() {
	return $(document).width() - 200;
}

function getGridHeight() {
	return $(document).height() - 18;
}

// -----------------end