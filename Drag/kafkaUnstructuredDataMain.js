/**
 * Created by admin on 2019/3/5.
 */
function KAFKA(){

}
KAFKA.prototype.customFormValidation=function (type,a1,formName,differentArrs) {
    //    公共的表单验证
    /**
     * type (参数值) 0普通的正常的
     * @params a1 格式 a1=[{regex:'',paramName:'',viewName:''}]
     *  type (参数值) 1为简单的表单验证 特殊处理
     *  @params a1 格式 a1=[{name:''}]
     *  @params differentArrs 存储的是 验证中 需要验证重复的
     * **/
        //    生成表单
    let differentArrsIs=false;
    if(differentArrs){
        if(differentArrs.length>1){
            differentArrsIs=true;
        }
    }

    var b1={};
    if(type==0){
        for(var i=0;i<a1.length;i++){
            if(a1[i].regex){//有正则
                var tt2=a1[i].regex;
                var tt1=eval(tt2);
                b1[a1[i].paramName]={
                    validators: {
                        notEmpty: {
                            message:a1[i].viewName+ '不能为空'
                        },
                        regexp: {
                            regexp: tt1,
                            message:a1[i].viewName+ '格式不正确'
                        },
                    }
                }
            }else{//无正则
                b1[a1[i].paramName]={
                    validators: {
                        notEmpty: {
                            message:a1[i].viewName+ '不能为空'
                        },
                    }
                }
            }
            if(a1[i].regexp){//自定义信息正则
                b1[a1[i].paramName]['validators']['regexp']={
                    regexp:a1[i].regexp.regexp,
                    message: a1[i].regexp.message
                }
            }
            if(a1[i].stringLength){//长度 信息
                b1[a1[i].paramName]['validators']['stringLength']={
                    min:a1[i].stringLength.min,
                    max:a1[i].stringLength.max,
                    message: a1[i].stringLength.message
                }
            }


            //    验证重复
            if(a1[i].differentArrs&&differentArrsIs){
                let a_1=differentArrs.indexOf(a1[i].paramName);
                b1[a1[i].paramName]['validators']['different']={
                    field: (differentArrs.slice(0,a_1).concat(differentArrs.slice(a_1+1,differentArrs.length))).join(','),
                    message: '端口号不能重复'
                }
                let name=a1[i].paramName;
                b1[a1[i].paramName]['validators']['remote']={
                    url: vm.basePath+'serviceByModuleOperation/checkPortUsedInfo.do',//验证地址
                    message: '端口号已存在',//提示消息
                    delay : 1000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                    type: 'POST',//请求方式
                    /**自定义提交数据，默认值提交当前input value
                     * data: function(validator) {
                    return {
                    password: $('[name="passwordNameAttributeInYourForm"]').val(),
                    whatever: $('[name="whateverNameAttributeInYourForm"]').val()
                    };*/
                    // tokenID  flowID  engineID  moduleID  osName  hostIp  port
                    data: function(validator,data) {
                        let n_data_1=vm.DRdropDatas[vm.LNData.index1];
                        return {
                            tokenID:parent.tokenID,
                            flowID:vm.flowID,
                            engineID:n_data_1.id,
                            moduleID:n_data_1.moduleID,
                            osName:n_data_1.osName,
                            hostIp:vm.LNremortConfig[1].value,
                            checkPort:$("[name="+name+"]").val(),
                            userName:vm.LNremortConfig[3].value,
                            passWord:vm.LNremortConfig[4].value,
                        }
                    }
                }
            }
            if(a1[i].configType=="upload"){//上传
                let af_=a1[i].paramName;
                b1[af_]['validators']['callback']={
                    message: '请上传文件',
                    callback: function(value, validator) {
                        let ULstat=$(formName).data('bootstrapValidator').getFieldElements(af_).attr('datastat');
                        let arrs=['','请上传文件','','上传文件错误，请重新上传'];
                        if(ULstat==1||ULstat==3){
                            $(formName).data('bootstrapValidator').updateMessage(af_,'callback',arrs[ULstat]);
                            return false;
                        }else{
                            return true;
                        }
                    }
                }
            }
        }
    }else if(type==1){
        for(var i=0;i<a1.length;i++){
            b1[a1[i].name]={
                validators: {
                    notEmpty: {
                        message:a1[i].name+ '不能为空'
                    },
                }
            }
        }
    }else if(type==3){
        for(var i=0;i<a1.length;i++){
            b1[a1[i].paramName]={
                validators: {
                    notEmpty: {
                        message:a1[i].viewName+ '不能为空'
                    },
                }
            }
        }
    }
    $(formName).bootstrapValidator({
        message: 'This value is not valid',
        excluded:[":disabled"],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: b1
    });
}
KAFKA.prototype.kafkaClear=function () {
    if($('#type_kafka #customForm').html()){
        $('#customForm').bootstrapValidator('destroy')
    }
    if($('#type_kafka #kafkaYTable-table').length!=0){
        $('#type_kafka #kafkaYTable-table').bootstrapTable('destroy');
    }
    if($('#type_kafka .selectpicker')){
        for(var i=0;i<$('#type_kafka .selectpicker').length;i++){
            $('#type_kafka .selectpicker').eq(i).selectpicker('destroy');
        }
    }
    if($('#type_kafka #dbTableBox').length!=0){
        $('#type_kafka #dbTableBox').bootstrapTable('destroy');
    }
}
KAFKA.prototype.kafkaYTable=function (TH) {
    //初始化 table
    var postUrl =basePath_par + 'serviceByDynamicFlow/queryMachineConfigureInfo.do';
    var columnConfig =[
        {radio:true},
        {field:'hostName',title:"主机名称",align:"center"},
        {field:'ip',title:"ip",align:"center"},
        {field : 'port',title : 'SSH端口',align:"center"},
        {field:'userName',title:"用户名",align:"center"},
        {field : 'passWord',title : '密码',align:"center",formatter:function (value, row, index) {
            var str='··················································';
            var str1=str.substr(0,value.length);
            return str1;
        }},
    ];
    var param={};
    var tempParams ;
    var queryParamCallBack = function(initParams,param){
        param = {tokenID:parent.tokenID};
        var a_1=$('#SipAddress').val();
        if(a_1&&a_1!=''){
            param['ipAddress']=a_1;
        }
        return param;
    }
    var h=$('.kafkaYTable-box').height();
    getTableInit("kafkaYTable-table","LTPTool",postUrl,param,10,[ 5, 10, 15 , 50, 100,150,300],h,columnConfig,queryParamCallBack);
}
KAFKA.prototype.kafkaDBTable=function (TH) {
    var postUrl =basePath_par + 'hostAndDataSourceConfig/getDataSourcePageInfo.do';
    var columnConfig =[
        {radio:true},
        {field:'db_id',title:"数据源ID",align:"center"},
        {field:'host_ip',title:"数据源ip",align:"center"},
        {field : 'db_name',title : '数据源名称',align:"center"},
        {field:'db_type',title:"数据源类型",align:"center"},
        {field : 'createTime',title : '创建时间',align:"center"},
    ];

    var param={};
    var tempParams ;
    var queryParamCallBack = function(initParams,param){
        let f1=vm.kafkaVersionD;
        var param = {
            tokenID:parent.tokenID,
            flowID:vm.flowID,
            engineID:f1.engineID,
            moduleID:f1.moduleID
        };
        return param;
    }
    var h=$('.dbTableBox-box').height();
    getTableInit("dbTableBox","",postUrl,param,10,[ 5, 10, 15 , 50, 100,150,300],h,columnConfig,queryParamCallBack);
}
KAFKA.prototype.kafkaYTableSearch=function () {
    $('#kafkaYTable-table').bootstrapTable('refresh');
}
KAFKA.prototype.kafkaYSelc=function (TH) {
    let selectData=$('#kafkaYTable-table').bootstrapTable('getSelections');
    if(selectData.length==0){
        layer.msg('请选择数据',{icon:0});
        return;
    }
    TH.KAFremortConfig.forEach(function (item) {
        item.value=selectData[0][item.paramName];
    })
    TH.kafkaYTab(1);
}
KAFKA.prototype.kafkaYTab=function (TH,type) {
    /*type--代表要切换到哪个页面*/
    kafka.kafkaClear();//清空
    vm.kafkaYStat=type;
    if(type==1){//新建页面
        vm.kafkaInitForm=1;
    }else if(type==2){//已有页面
        vm.kafkaInitForm=2;
    }
}
KAFKA.prototype.kafkaPrev=function (TH) {
    kafka.kafkaNextDo(false);
}
KAFKA.prototype.kafkaNext=function (TH) {
    /*下一步之前*/
    let listData=TH.kafkaList[TH.kafkaStep];
    if($('#customForm').length>0){
        $('#customForm').data('bootstrapValidator').validate();
        if(!$('#customForm').data('bootstrapValidator').isValid()){
            var refresh=false;
            var dataF=$('#customForm').find('.form-control-feedback');
            for(var i=0;i<dataF.length;i++){
                if(dataF.eq(i).hasClass('glyphicon-refresh')){
                    refresh=true;
                }
            }
            var msg_1='验证不正确，请重新填写。';
            var icon_1=2;
            if(refresh){
                msg_1='验证中，请稍后再试';
                icon_1=0;
            }
            layer.msg(msg_1,{icon:icon_1,time:900});
            return false;
        }
        TH.loading('请稍等 ...');
    }
    if(listData.modelName=='remortConfig'){
        //远程配置的下一步
        //    通过ajax验证
        var daats2=TH.KAFremortConfig;
        var datas1={
            hostName:daats2[0].value,
            hostIp:daats2[1].value,
            hostPort:daats2[2].value,
            userName:daats2[3].value,
            passWord:daats2[4].value,
            tokenID:parent.tokenID,
            flowID:TH.flowID,
            engineID:TH.kafkaVersionD.engineID,
            moduleID:TH.kafkaVersionD.moduleID
        };
        $.ajax({
            type:'post',
            dataType:'json',
            data:datas1,
            url:basePath_par+'serviceByDynamicFlow/validateHostConfigureInfo.do',
            success:function (data) {
                if(!verificationInstruction(data)){
                    return false;
                };
                data=data.dataInfo;

                if(data[0].flag=='true'){
                    layer.msg('验证成功',{icon:1,time:600},function () {
                        if(vm.kafaListData.isinit){//当为新建时才可以给框 赋（接口传的）——值
                            vm.kafaListData.data['osName']=data[0].pathInfo.os;
                            var ad23=TH.kafkaList[TH.kafkaStep+1].modelName;
                            if(ad23=='pathConfig'){
                                var ad234=vm.KAFpathConfig;
                            }else if(ad23=='kafkaPathConfig'){//kafa
                                var ad234=vm.KAFpathConfigkafka;
                            }
                            ad234[0].value=data[0].pathInfo.path;
                            if(data[0].pathInfo.doc){
                                ad234[1].value=data[0].pathInfo.doc;
                            }else{
                                ad234[1].value='';
                            }
                            if(ad234[2]){
                                if(data[0].pathInfo.javaHome){
                                    ad234[2].value=data[0].pathInfo.javaHome;
                                }else{
                                    ad234[2].value='';
                                }
                            }

                        }
                        kafka.kafkaNextDo(true);//下一步的操作
                    });
                }else{
                    layer.confirm('当前填写内容不正确；错误信息如下 ：'+data[0].message,{btn:['确定'],area:['80%','80%']},function (index) {
                        layer.close(index);
                    });
                }
            },
        });
    }
    else if(listData.modelName=='kafkaPathConfig'){//路径配置的下一步
        var daats3=vm.KAFpathConfigkafka;
        var daats2=TH.KAFremortConfig;
        var datas1={
            flowID:TH.flowID,
            engineID:TH.kafkaVersionD.engineID,
            moduleID:TH.kafkaVersionD.moduleID,
            hostName:daats2[0].value,
            hostIp:daats2[1].value,
            hostPort:daats2[2].value,
            userName:daats2[3].value,
            passWord:daats2[4].value,
            packagePath:daats3[0].value,
            packageName:daats3[1].value,
            packageJavaHome:daats3[2]?daats3[2].value:'',
            tokenID:parent.tokenID,
            // moduleID:vm.DRdropDatas[vm.DRdragDropDatas.index4].moduleID,
            osName:vm.kafaListData.data.osName
        };
        $.ajax({
            type:'post',
            dataType:'json',
            data:datas1,
            url:basePath_par+'serviceByDynamicFlow/saveFlowMacConfigureInfo.do',
            success:function (data) {
                if(!verificationInstruction(data)){
                    return false;
                };

                //首先验证当前是否是修改，并且是否地址未曾变动，则进入下一步骤
                // var ag1=TH.LTPDatas.isinit;
                var ag1=vm.kafaListData.isinit;
                // var isno=true;//定义是否有改动
                // daats3.forEach(function (item11) {
                //     if(a1[item11.paramName]!=item11.value){
                //         isno=false;
                //     }
                // })
                if((!ag1)&&data.statFlag==405){
                    layer.msg('根路径与根目录有重复 ， 不允许向下进行操作',{icon:2,time:600});
                    return ;
                }
                data=data.dataInfo;


                if(data.flag=='true'){
                    layer.msg('保存成功',{icon:1,time:600},function () {
                        //给下一步赋值
                        if(ag1.isinit) {//当为新建时才可以给框 赋（接口传的）——值
                            var e1=vm.kafkaList[vm.kafkaStep+1];
                            var arr=[];
                            if(e1.modelType=='config'){
                                e1.modleList.forEach(function (item1) {
                                    arr.push(item1.paramName)
                                    var e2=data[item1.paramName];
                                    if(e2)item1.value=e2;
                                })
                            }
                        }
                        kafka.kafkaNextDo(true);
                    });
                }else{
                    layer.confirm('当前填写内容不正确；错误信息如下 ：'+data[0].message,{btn:['确定'],area:['80%','80%']},function (index) {
                        layer.close(index);
                    });
                }
            },
        });
    }
    else if(listData.modelType=='config'){//目标端基础配置
        vm.closeLoading();
        kafka.kafkaNextDo(true);
    }else if(listData.modelName=='dataBaseConfig'){//目标端基础配置 dataBaseConfig

    }

    // TH.kafkaStep++;
    /*下一步之后*/


}
KAFKA.prototype.kafkaNextDo=function (istrue) {
    kafka.kafkaClear();
    if(istrue){
        vm.kafkaStep++;
    }else{
        vm.kafkaStep--;
    }
    vm.kafaListData.isUpdate=false;
    setTimeout(function () {
        vm.kafaListData.isUpdate=true;
        if(listData.modelType=='config'){//目标端基础配置 dtBaseConfig
            vm.kafkaInitForm=4;//后台 基础配置
        }
    },100);
    let listData=vm.kafkaList[vm.kafkaStep];
    if(listData.modelName=='remortConfig'){//远程配置
        vm.kafkaInitForm=1;// 远程配置
    }else if(listData.modelName=='kafkaPathConfig'){//kafka 路径配置
        vm.kafkaInitForm=3;//kafka 路径配置
    }else if(listData.modelName=='dataBaseConfig'){//kafka 数据源配置
        //    进入数据源
        let istrue=vm.kafaListData.isshowTable;
        if(istrue){//生成table表格
            vm.kafkaInitForm=5;//kafka 数据源配置
        }else{//

        }
    }
}
KAFKA.prototype.upLoadFlie=function (TH,paramName,index1){
    var file = $(".file"+paramName)[0].files[0];
    let st=$("#"+paramName).attr('datastat');
    if(st=='1'&&file==undefined){
        layer.msg('请重新选择文件',{icon:2});
        return;
    }
    if(st==undefined){
        layer.msg('请选择文件',{icon:2});
        return;
    }
    var formObj = new FormData();
    var daats2=TH.KAFremortConfig;
    var daats3=TH.KAFpathConfigkafka;
    formObj.set('tokenID', parent.tokenID);
    formObj.set('flowID', TH.flowID);
    formObj.set('engineID', TH.kafkaVersionD.engineID);
    formObj.set('moduleID', TH.kafkaVersionD.moduleID);
    formObj.set('osName', TH.kafaListData.data.osName);
    formObj.set('hostIp', daats2[1].value);
    formObj.set('hostPort', daats2[2].value);
    formObj.set('userName', daats2[3].value);
    formObj.set('passWord', daats2[4].value);
    formObj.set('packagePath', daats3[0].value);
    formObj.set('packageName', daats3[1].value);
    formObj.set('loadFile', file);
    $.ajax({
        type: 'post',
        url:  basePath_par+"serviceByDynamicFlow/uploadConfigFile.do",
        data:formObj,
        cache: false,
        processData: false,
        contentType: false,
        success:function(data){
            if(data.statFlag==0){
                layer.msg('上传成功',{icon:1,time:1200});
                vm.kafkaList[vm.kafkaStep].modleList[index1].ULstat=2;
                $('#'+paramName).attr('datastat',2);
                $('#customForm').data('bootstrapValidator').revalidateField(paramName);
            }else{
                var str=data.message;
                layer.msg(str,{icon:2})
                vm.kafkaList[vm.kafkaStep].modleList[index1].ULstat=3;
                $('#'+paramName).attr('datastat',3);
                $('#customForm').data('bootstrapValidator').revalidateField(paramName);
            }
        },
        error:function(data){
            var str=data.message;
            layer.msg(str,{icon:2})
            vm.kafkaList[vm.kafkaStep].modleList[index1].ULstat=3;
            $('#'+paramName).attr('datastat',3);
            $('#customForm').data('bootstrapValidator').revalidateField(paramName);
        }
    });
}
KAFKA.prototype.kafkaSave=function (TH) {
    let listData=TH.kafkaList[TH.kafkaStep];
    if($('#customForm').length>0){
        $('#customForm').data('bootstrapValidator').validate();
        if(!$('#customForm').data('bootstrapValidator').isValid()){
            var refresh=false;
            var dataF=$('#customForm').find('.form-control-feedback');
            for(var i=0;i<dataF.length;i++){
                if(dataF.eq(i).hasClass('glyphicon-refresh')){
                    refresh=true;
                }
            }
            var msg_1='验证不正确，请重新填写。';
            var icon_1=2;
            if(refresh){
                msg_1='验证中，请稍后再试';
                icon_1=0;
            }
            layer.msg(msg_1,{icon:icon_1,time:900});
            return false;
        }
        TH.loading('请稍等 ...');
    }
    var daats2=TH.KAFremortConfig;
    var daats3=TH.KAFpathConfigkafka;
    var a3=[];
    let issavednid=false;
    TH.kafkaList.forEach(function (item1) {
        if(item1.modelType=='config'){
            a3.push({});
            item1.modleList.forEach(function (item2) {
                a3[a3.length-1][item2.mid]=item2.value;
                //获取 要展示在详细配置的菜单
                if(item2.detailsConfigFlag=='true'){
                    item2.selectList.forEach(function (item3) {
                        if(item3.value==item2.value){
                            if(item3.detailsConfigFlag=='true'){
                                //    此时 将其加入  右键 详细配置二级菜单
                                // deindex++;
                                // a1.detailsConfigData.push({
                                //     name:item2.paramName,
                                //     type:deindex,
                                //     value:item2.value,
                                //     mid:item2.mid,
                                //     icon:'icon-lanmupeizhi'
                                // })
                            }
                        }
                    })

                }
            })
        }else if(item1.modelName=='dataBaseConfig'){//是否要保存dbid
            issavednid=true;
        }
    })
    vm.loading('保存中 ...');
    var params={
        flowID:TH.flowID,
        engineID:TH.kafkaVersionD.engineID,
        moduleID:TH.kafkaVersionD.moduleID,
        hostName:daats2[0].value,
        hostIp:daats2[1].value,
        hostPort:daats2[2].value,
        userName:daats2[3].value,
        passWord:daats2[4].value,
        packagePath:daats3[0].value,
        packageName:daats3[1].value,
        packageJavaHome:daats3[2]?daats3[2].value:'',
        baseConfigInfo:JSON.stringify(a3),
        tokenID:parent.tokenID,
        osName:TH.kafaListData.data.osName
    }
    if(!issavednid) {
        //    不保存dbid
        $.ajax({
            type:'post',
            dataType:'json',
            data:params,
            url:basePath_par+'serviceByDynamicFlow/saveFlowConfigureInfo.do',
            success:function (data) {
                if(!verificationInstruction(data)){
                    return false;
                };
                if(data.dataInfo=='sucess'){
                    layer.msg('保存成功',{icon:1,time:1200},function () {
                        vm.cancel();
                        kafka.addModel_kafka();//保存kafka模块
                    });
                }else{
                    layer.msg('保存失败',{icon:2})
                }
            },
        });
    }else{//保存dbid
        var params1={
            tokenID:parent.tokenID,
            flowID:TH.flowID,
            engineID:TH.kafkaVersionD.engineID,
            moduleID:TH.kafkaVersionD.moduleID,
            dbID: TH.TLdbIDList.db_id,
            hostIP:daats2[1].value,
            hostPort:daats2[2].value,
            userName:daats2[3].value,
          dbSame:''
        };
        $.ajax({
            type:'post',
            dataType:'json',
            data:params1,
            url:basePath_par+'serviceByModuleOperation/saveEngineModuleDataBaseID.do',
            success:function (data) {
                if(!verificationInstruction(data)){
                    return false;
                };
                data=data.dataInfo;
                if(data.flag){
                    $.ajax({
                        type:'post',
                        dataType:'json',
                        data:params,
                        url:basePath_par+'serviceByDynamicFlow/saveFlowConfigureInfo.do',
                        success:function (data) {
                            if(!verificationInstruction(data)){
                                return false;
                            };
                            if(data.dataInfo=='sucess'){
                                layer.msg('保存成功',{icon:1,time:1200},function () {
                                    vm.cancel();
                                    kafka.addModel_kafka();//保存kafka模块
                                });
                            }else{
                                layer.msg('保存失败',{icon:2})
                            }
                        },
                    });
                }else{
                    layer.msg('保存dbid失败',{icon:2})
                }
            },
        });
    }




}
KAFKA.prototype.addModel_kafka=function(){
    let z_={};
    vm.KAFremortConfig.forEach(function (item1) {
        z_[1+item1.paramName]=item1.value;
    })
    vm.KAFpathConfig.forEach(function (item1) {
        z_[2+item1.paramName]=item1.value;
    })
    vm.KAFpathConfigkafka.forEach(function (item1) {
        z_[3+item1.paramName]=item1.value;
    })
    let newKafka=[];
    vm.kafkaList.forEach(function (item1) {
        if(item1.modelView){
            item1.modleList.forEach(function (item2) {
                if(item2.pageView==1){
                    newKafka.push(item2);
                    newKafka[newKafka.length-1].eType=item1.eType;
                    newKafka[newKafka.length-1].value=item2.value;
                }
            })
        }
    })
    let detailsTp=[2];//2 --指向的是kafka类型--详细配置--菜单
    let detailsDa=[];
    vm.kafkaList.forEach(function (item1) {
        if(item1.modelType=='config'){
            item1.modleList.forEach(function (item2) {
                //获取 要展示在详细配置的菜单
                if(item2.detailsConfigFlag=='true'){
                    item2.selectList.forEach(function (item3) {
                        if(item3.value==item2.value){
                            if(item3.detailsConfigFlag=='true'){
                                //    此时 将其加入  右键 详细配置二级菜单
                                detailsDa.push({
                                    name:item2.paramName,
                                    // type:deindex,
                                    value:item2.value,
                                    mid:item2.mid,
                                    icon:'icon-lanmupeizhi'
                                })
                            }
                        }
                    })

                }
            })
        }
    })
    if(vm.DRdragDropDatas.index2==-1) {//修改
        let in_=vm.DRcontextmenuData.index1;
        vm.DRdropDatas[in_].kafkaList=JSON.stringify(vm.kafkaList);
        vm.DRdropDatas[in_].kafkaYStat=vm.kafkaYStat;
        vm.DRdropDatas[in_].kafaListDataisinit=vm.kafaListData.isinit;
        vm.DRdropDatas[in_].kafaListDatadata=JSON.stringify(vm.kafaListData.data);
        vm.DRdropDatas[in_].others=JSON.stringify(z_);
        vm.DRdropDatas[in_].ItemCon=newKafka;
        vm.DRdropDatas[in_].detailsTp=detailsTp;
        vm.DRdropDatas[in_].detailsDa=detailsDa;
    }else{//新建
        vm.DRdropDatas.push({
            type:3,
            name:'kafka',
            version:vm.kafkaVersion[vm.kafkaVersionD.selectIndex].version,
            msg:vm.kafkaVersion[vm.kafkaVersionD.selectIndex].details,
            iconImg:vm.HserverType[vm.DRdragDropDatas.index2].img,
            isupload:false,//定义当前是否上传
            left:vm.DRdragDropDatas.left,
            top:vm.DRdragDropDatas.top,
            kafkaList:JSON.stringify(vm.kafkaList),
            kafkaYStat:vm.kafkaYStat,
            kafaListDataisinit:vm.kafaListData.isinit,
            kafaListDatadata:JSON.stringify(vm.kafaListData.data),
            others:JSON.stringify(z_),
            ItemCon:newKafka,
            detailsTp:detailsTp,
            detailsDa:detailsDa,
            engineID:vm.kafkaVersionD.engineID,
            moduleID:vm.kafkaVersionD.moduleID,
            engineTypeCode:vm.kafkaVersionD.engineTypeCode
        })
        if(!vm.kafaListData.isshowTable){//添加数据源
            vm.DRdropDatas[vm.DRdropDatas.length-1].TLdbIDList=JSON.stringify(vm.TLdbIDList);
        }
        ++vm.moduleID;
    }
    vm.cancel();
    vm.saveDo1();//保存流程
}//生成模块
var kafka=new KAFKA();
