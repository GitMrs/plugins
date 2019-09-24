/**
 * Created by DSG-LiuLei on 2017/3/26.
 */
/*************************表格接口*****************************/
/**
 * getTableInit
 * @param tableId:表格id
 * @param toolBarId:表格工具栏id,若无工具栏，传入null或者""
 * @param url:发送请求的url
 * @param queryParams:表格查询参数,json对象格式
 * @param pageSize:每页显示记录数
 * @param pageList:分页列表
 * @param tableHeight:表格高度
 * @param columnConfig:表格列配置信息
 * @param queryParamCallBack:表格参数刷新回调function
 */
callBack_data={};
function getTableInit(tableId,toolBarId,url,queryParams,pageSize,pageList,tableHight,columnConifg,queryParamCallBack){
    //Bootstrap table QueryParam CalllBack
    var queryTableParams = function(initParams){
        var temp = queryParamCallBack(initParams,queryParams);
        temp.limit = initParams.limit;
        temp.offset = initParams.offset;
        return temp;
    }
    var a1=(toolBarId=='')?null:("#"+toolBarId);
    $("#"+tableId).bootstrapTable({
        url : url,         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        toolbar:a1,//工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                //是否显示分页（*）
        queryParams : queryTableParams,
        paginationLoop:false,				//是否循环分页
        smartDisplay:true,
        showPaginationSwitch:false,			//是否显示 数据条数选择框
        //sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: pageSize,                       //每页的记录行数（*）
        pageList: pageList,        		//可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        // showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 1,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: tableHight,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        // showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        contentType: "application/x-www-form-urlencoded",
        // contentType:'text',
        columns:columnConifg,
        responseHandler: function (data) {
            verificationInstruction(data);
            callBack_data.flag=data.statFlag;
            if(data.statFlag==100){//返回的table 不正确
                layer.confirm(data.message,{icon:2,btn:['确认']},function (index) {
                    layer.close(index);
                    if(callBack_data.get_callBack_data){
                        callBack_data.get_callBack_data();
                    }
                });
                data={rows:[],total:0};
            }else{
                data = data.dataInfo;
            }
            return data;
        },
        onLoadSuccess: function () {
        	$("#"+tableId).bootstrapTable('resetView');
        	}
    });
}

function getTableInitLocal(tableId,toolBarId,url,queryParams,pageSize,pageList,tableHight,columnConifg,queryParamCallBack,isExpand,ExpandUrl,ExpandqueryParamCallBack,ExpandCol){
    //Bootstrap table QueryParam CalllBack
    var queryTableParams = function(initParams){
        var temp = queryParamCallBack(initParams,queryParams);
        temp.limit = initParams.limit;
        temp.offset = initParams.offset;
        return temp;
    }
    var a1=(toolBarId=='')?null:("#"+toolBarId);
    $("#"+tableId).bootstrapTable({
        // url : url,         //请求后台的URL（*）
        // method: 'post',                      //请求方式（*）
        data:url,
        toolbar:a1,//工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                //是否显示分页（*）
        queryParams : queryTableParams,
        paginationLoop:false,				//是否循环分页
        smartDisplay:true,
        showPaginationSwitch:false,			//是否显示 数据条数选择框
        //sortable: true,                     //是否启用排序
        // sortOrder: "asc",                   //排序方式
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: pageSize,                       //每页的记录行数（*）
        pageList: pageList,        		//可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        // showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: tableHight,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        // showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: isExpand?true:false,                   //是否显示父子表
        onExpandRow:function(index, row, $detail) {
            // oTableInit.InitSubTable(index, row, $detail);
            var payNo = row.payNo
            var cur_table = $detail.html('<table class="expandTable"></table>').find('table');
            var ExpandqueryTableParams = function(initParams){
                var temp = ExpandqueryParamCallBack(initParams,{});
                temp.limit = initParams.limit;
                temp.offset = initParams.offset;
                temp.columnName=row.colName
                return temp;
            }
            $(cur_table).bootstrapTable({
                url: ExpandUrl,
                pagination: false,
                striped: true,                      //是否显示行间隔色
                clickToSelect: true,                //是否启用点击选中行
                sidePagination: "server",
                queryParams : ExpandqueryTableParams,
                dataType: 'json',
                // detailView:true,//父子表
                uniqueId: "salesNo",
                columns: ExpandCol,
                responseHandler: function (data) {
                    verificationInstruction(data);
                    if(!data.dataInfo.flag){//返回的table 不正确
                        layer.confirm(data.message,{icon:2,btn:['确认']},function (index) {
                            layer.close(index);
                        });
                        data={rows:[],total:0};
                    }else{
                        // data = {rows:data.dataInfo.rows,total:data.dataInfo.total};
                        data=data.dataInfo.rows
                    }
                    console.log(data)
                    return data;
                },
            });
        },
            // contentType: "application/x-www-form-urlencoded",
        // contentType:'text',
        columns:columnConifg,
    });

}

function createClickTableInit(tableId,url,queryParams,pageSize,pageList,tableHight,columnConifg,queryParamCallBack){
    //Bootstrap table QueryParam CalllBack
    var queryTableParams = function(initParams){
        var temp = queryParamCallBack(initParams,queryParams);
        temp.limit = initParams.limit;
        temp.offset = initParams.offset;
        return temp;
    }
    $(tableId).bootstrapTable({
        url : url,         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        //toolbar: "#"+toolBarId==null||toolBarId==""?"toolbar":toolBarId,//工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                //是否显示分页（*）
        queryParams : queryTableParams,
        paginationLoop:false,				//是否循环分页
        smartDisplay:true,
        showPaginationSwitch:false,			//是否显示 数据条数选择框
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: pageSize,                       //每页的记录行数（*）
        pageList: pageList,        		//可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: tableHight,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        formatRecordsPerPage: function (pageNumber) {
     		return "";
        },
        formatDetailPagination: function (totalRows) {
            return "";
        },
        contentType: "application/x-www-form-urlencoded",
        columns:columnConifg,

    });
}
/**
 * refreshTable
 * @param tablId
 */
function refreshTable(formId,tablId){
    //禁用表单提交跳转
    $("#"+formId).submit(function() {return false;});
    $("#"+tablId).bootstrapTable('refresh');
}
/**
 * hideColumn
 * @param tablId
 * @param fieldName
 */
function hideColumn(tablId,fieldName){
    $("#"+tablId).bootstrapTable('hideColumn', fieldName);
}
/**
 * showColumn
 * @param tablId
 * @param fieldName
 */
function showColumn(tablId,fieldName){
    $("#"+tablId).bootstrapTable('showColumn', fieldName);
}
/**
 * getTableData
 * @param tableId
 */
function getTableData(tableId){
    $("#"+tableId).bootstrapTable('getData');
}

//取时间
function getNowFormatDate () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + seperator2 + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        + seperator2 + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return currentdate;
}
function getDateStr (AddDayCount, detail) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var result = "";
    if (m < 10) {
        result = y + "-0" + m;
    } else {
        result = y + "-" + m;
    }
    var d = dd.getDate();
    if (d < 10) {
        result += "-0" + d;
    } else {
        result += "-" + d;
    }
    if (detail) {
        result += getNowFormatDate().substr(10);
    }
    return result;
}