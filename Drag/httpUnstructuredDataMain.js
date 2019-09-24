/*非结构流程的JS-----HTTP*/
var basePath_par=basePath;
var basePath = basePath_un;
function HTTP(){}
/*new*/
HTTP.prototype.n_next=function(TH) {
    let s_1=TH.COM1Data.step1;
    if(s_1==1){
        //第一步

        //验空
        let istrue=false;
        let ps1=TH.N_HTTP_1.params;
        // for(var i in ps1){
        //     if(ps1[i].value==''){
        //         istrue=true;
        //     }
        // }
        // if(TH.N_HTTP_1.urlType==''||TH.N_HTTP_1.urlPath==''||istrue){
        //     layer.msg('不能为空',{icon:2,time:1200});
        //     return;
        // }
        // if(TH.COM1Data.step1!=TH.COM1Data.steps){
        //     TH.clearText();
        // }
        // TH.COM1Data.step1++;
    //    加=----
        console.log(vm.N_HTTP_1)
        let newpARAMS1=[];
        ps1.forEach(function (item2,index2) {
            newpARAMS1.push(item2.name+'='+item2.value);
        })
        let params={
            tokenID:parent.tokenID,
            urlType:vm.N_HTTP_1.urlType,
            urlInfo:vm.N_HTTP_1.urlPath,
            paramInfo:newpARAMS1.join('&')
        }
        vm.loading('加载中');
        // $.ajax({
        //     type:'post',
        //     url:basePath+'serviceByExternalInterFace/externalInterFaceOfEngineByHttp.do',
        //     data:params,
        //     success:function(data){
        //         if(!verificationInstruction(data)){
        //             return false;
        //         };
        //         data=data.dataInfo;
        //         vm.closeLoading();
        //         if(!data){
        //             layer.msg('此格式暂不支持',{icon:2});
        //             return;
        //         }

        //         var dataInfo=data.jsonDataArr;
        //         let arrInfo=[];
        //         dataInfo.forEach(function (item1,index1__) {
        //             if(index1__==0){
        //                 for(var index2 in item1){
        //                     arrInfo.push({"name":index2,"value":item1[index2],values:[]})
        //                 }
        //             }else{
        //                 arrInfo.forEach(function (item2) {
        //                     if(item1[item2.name]!=undefined){
        //                         item2.values.push(item1[item2.name]);
        //                     }
        //                 })
        //             }
        //         })
        //         // var dataInfo=data.jsonDataArr[0];
        //         // let arrInfo=[];
        //         // for(var index in dataInfo){
        //         //     arrInfo.push({"name":index,"value":dataInfo[index]})
        //         // }
        //         vm.COM1COLD.list=arrInfo;
        //         let fileType=TH.COM1getD.fileType;
        //         if(fileType=='txt'||fileType=='xml'||fileType=='excel'){//txt
        //             vm.COM1COLD.module=data.colName;
        //         }else if(fileType=='json'){//json
        //             vm.COM1COLD.module=JSON.parse(data.jsonModuleInfo);
        //         }
        //         if(vm.DRdragDropDatas.index2!=-1){//新建
        //             vm.COM1COLD.select=[];
        //         }else{//修改
        //             let index1_=vm.DRcontextmenuData.index1;
        //             let data=vm.DRdropDatas[index1_];
        //             let ty_1=JSON.parse(data.step2).fileType;
        //             let ty_2=TH.COM1getD.fileType;
        //             if(ty_1!=ty_2){//替换原来
        //                 vm.COM1COLD.select=[];
        //             }else{
        //                 let names=[];
        //                 for(var i in vm.COM1COLD.select){
        //                     names.push(vm.COM1COLD.select[i].name);
        //                 }
        //                 for(var i in vm.COM1COLD.list){
        //                     if(names.indexOf(vm.COM1COLD.list[i].name)!=-1){
        //                         vm.COM1COLD.list[i].checkHttp=true;
        //                     }
        //                 }
        //             }
        //         }
        //         if(TH.COM1Data.step1!=TH.COM1Data.steps){
        //             TH.clearText();
        //         }
        //         TH.COM1Data.step1++;
        //         TH.kafkaInitForm=9;

        //     }
        // })
        TH.COM1Data.step1++;
    }else if(s_1==-1){
        //第二步--之前的第二置空

        //    验空
        let params={
            tokenID:parent.tokenID,
            urlType:vm.N_HTTP_1.urlType,
            urlInfo:vm.N_HTTP_1.urlPath,
            paramInfo:vm.N_HTTP_1.parameter_data
        }
        // let params={tokenID:parent.tokenID,charsetName:vm.COM1getD.codedFormat};
        // vm.N_FTP_1.list.forEach(function (item1,index1) {
        //     params[item1.paramName]=item1.value;
        // })
        if(0){
            params['remotePath']=vm.COM1getD.remotePath;
            if(vm.COM1getD.remotePath==''){
                layer.msg('远程目录的值不能为空',{icon:2,time:1200});
                return;
            }
            let ty_1=0;//txt
            params['fileType']=vm.COM1getD.fileType;
            let fileType=TH.COM1getD.fileType;
            if(fileType=='txt'){
                if(TH.COM1getD.fileFormat=='asc'){
                    params['splitStr']=TH.COM1getD.fileFormat1;
                    if(TH.COM1getD.fileFormat1==''){
                        layer.msg('ASCII编码的值不能为空',{icon:2,time:1200});
                        return;
                    }
                }else{
                    let istrue=false;
                    let arrs=[];
                    let se1=TH.COM1getD.fileFormat2;
                    for(var i in se1){
                        arrs.push(se1[i].value);
                        if(se1[i].value==''){
                            istrue=true;
                        }
                    }
                    params['splitStr']='0X'+arrs.join('0X');
                    if(istrue){
                        layer.msg('十六进制编码的值不能为空',{icon:2,time:1200});
                        return;
                    }
                }
                params['suffix']=vm.COM1getD.suffix;
                params['isColName']=vm.COM1getD.isColName;
            }
        }


        // console.log(params)
        // let urls=['/ftpExternalInterFaceController/externalInterFaceOfEngineByFtp.do','/serviceByExternalInterFace/externalInterFaceOfEngineByHttp.do']
        vm.loading('加载中');
        TH.COM1Data.step1++;
        TH.kafkaInitForm=9;
        // $.ajax({
        //     type:'post',
        //     url:basePath+'serviceByExternalInterFace/externalInterFaceOfEngineByHttp.do',
        //     data:params,
        //     success:function(data){
        //         if(!verificationInstruction(data)){
        //             return false;
        //         };
        //         data=data.dataInfo;
        //         vm.closeLoading();
        //         if(!data){
        //             layer.msg('此格式暂不支持',{icon:2});
        //             return;
        //         }

        //         var dataInfo=data.jsonDataArr;
        //         let arrInfo=[];
        //         dataInfo.forEach(function (item1,index1__) {
        //             if(index1__==0){
        //                 for(var index2 in item1){
        //                     arrInfo.push({"name":index2,"value":item1[index2],values:[]})
        //                 }
        //             }else{
        //                 arrInfo.forEach(function (item2) {
        //                     if(item1[item2.name]!=undefined){
        //                         item2.values.push(item1[item2.name]);
        //                     }
        //                 })
        //             }
        //         })
        //         // var dataInfo=data.jsonDataArr[0];
        //         // let arrInfo=[];
        //         // for(var index in dataInfo){
        //         //     arrInfo.push({"name":index,"value":dataInfo[index]})
        //         // }
        //         vm.COM1COLD.list=arrInfo;
        //         let fileType=TH.COM1getD.fileType;
        //         if(fileType=='txt'||fileType=='xml'||fileType=='excel'){//txt
        //             vm.COM1COLD.module=data.colName;
        //         }else if(fileType=='json'){//json
        //             vm.COM1COLD.module=JSON.parse(data.jsonModuleInfo);
        //         }
        //         if(vm.DRdragDropDatas.index2!=-1){//新建
        //             vm.COM1COLD.select=[];
        //         }else{//修改
        //             let index1_=vm.DRcontextmenuData.index1;
        //             let data=vm.DRdropDatas[index1_];
        //             let ty_1=JSON.parse(data.step2).fileType;
        //             let ty_2=TH.COM1getD.fileType;
        //             if(ty_1!=ty_2){//替换原来
        //                 vm.COM1COLD.select=[];
        //             }else{
        //                 let names=[];
        //                 for(var i in vm.COM1COLD.select){
        //                     names.push(vm.COM1COLD.select[i].name);
        //                 }
        //                 for(var i in vm.COM1COLD.list){
        //                     if(names.indexOf(vm.COM1COLD.list[i].name)!=-1){
        //                         vm.COM1COLD.list[i].checkHttp=true;
        //                     }
        //                 }
        //             }
        //         }
        //         if(TH.COM1Data.step1!=TH.COM1Data.steps){
        //             TH.clearText();
        //         }
        //         TH.COM1Data.step1++;
        //         TH.kafkaInitForm=9;

        //     }
        // })
        return;
        //    验空
        if(TH.COM1getD.fileType=='txt'){
            if(TH.COM1getD.fileFormat=='asc'){
                if(TH.COM1getD.fileFormat1==''){
                    layer.msg('ASCII编码的值不能为空',{icon:2,time:1200});
                    return;
                }
            }else{
                let istrue=false;
                let se1=TH.COM1getD.fileFormat1;
                for(var i in se1){
                    if(se1[i].value==''){
                        istrue=true;
                    }
                }
                if(istrue){
                    layer.msg('十六进制编码的值不能为空',{icon:2,time:1200});
                    return;
                }
            }
        }
        vm.loading('加载中');
        $.ajax({
            type:'post',
            url:basePath+'/serviceByExternalInterFace/externalInterFaceOfEngineByHttp.do',
            data:{
                tokenID:parent.tokenID,
                urlType:vm.N_HTTP_1.urlType,
                urlInfo:vm.N_HTTP_1.urlPath,
                paramInfo:vm.N_HTTP_1.parameter_data
            },
            success:function(data){
                if(!verificationInstruction(data)){
                    return false;
                };
                data=data.dataInfo;
                vm.closeLoading();
                var dataInfo=data.jsonDataArr;
                let arrInfo=[];
                dataInfo.forEach(function (item1,index1__) {
                    if(index1__==0){
                        for(var index2 in item1){
                            arrInfo.push({"name":index2,"value":item1[index2],values:[]})
                        }
                    }else{
                        arrInfo.forEach(function (item2) {
                            if(item1[item2.name]!=undefined){
                                item2.values.push(item1[item2.name]);
                            }
                        })
                    }
                })
                // let a_1=data.dataInfo;
                // var dataInfo=data.dataInfo.jsonDataArr[0];
                // let arrInfo=[];
                // for(var index in dataInfo){
                //     arrInfo.push({"name":index,"value":dataInfo[index]})
                // }
                vm.COM1COLD.list=arrInfo;
                vm.COM1COLD.module=JSON.parse(data.jsonModuleInfo);
                if(vm.DRdragDropDatas.index2!=-1){//新建
                    vm.COM1COLD.select=[];
                }else{//修改

                    let index1_=vm.DRcontextmenuData.index1;
                    let data=vm.DRdropDatas[index1_];
                    let ty_1=JSON.parse(data.step2).fileType;
                    let ty_2=TH.COM1getD.fileType;
                    if(ty_1!=ty_2){//替换原来
                        vm.COM1COLD.select=[];
                    }else{
                        let names=[];
                        for(var i in vm.COM1COLD.select){
                            names.push(vm.COM1COLD.select[i].name);
                        }
                        for(var i in vm.COM1COLD.list){
                            if(names.indexOf(vm.COM1COLD.list[i].name)!=-1){
                                vm.COM1COLD.list[i].checkHttp=true;
                            }
                        }
                    }
                }
                if(TH.COM1Data.step1!=TH.COM1Data.steps){
                    TH.clearText();
                }
                TH.COM1Data.step1++;
                TH.kafkaInitForm=9;

            }
        })
    }else if(s_1==2){
        //第三步
        // if(TH.COM1COLD.select==''){
        //     layer.msg('请选择要操作的数据',{icon:2,time:1200});
        //     return;
        // }
        let jsonType=TH.COM1COLD.txt;
       
        if(jsonType=='text'){//文本型
            TH.layerIndex2=layer.open({
                type:1,
                title:'文本分隔符选择',
                area:['60%','250px'],
                content:$('#N_type'),
                success:function (layero) {
                    var a=$(layero);
                    a.find('.layui-layer-content').css('height',a.height()-42+'px');
                    $('#N_type').removeClass('hide');
                },
                end:function (layero) {
                    var a=$(layero);
                    a.find('.layui-layer-content').css('height',a.height()-42+'px');
                    $('#N_type').addClass('hide');
                }
            });
        }else if(jsonType=='cjson'||jsonType=='db'){//json 型
            let names={};
            vm.COM1COLD.select.forEach(function (a) {
                names[a.name]=a.value;
            })
            var jsontext = JSON.stringify(vm.COM1COLD.module,function (key,value) {
                if(typeof value!="object"){
                    if(names[key]==undefined){
                        return undefined;
                    }else{
                        return value;
                    }

                }else{
                    /**/
                    let istrue=false;
                    JSON.stringify(value,function (key1,value1) {
                        if(typeof value1!="object"){
                            if(names[key1]!=undefined){
                                istrue=true;
                                return undefined;
                            }else{
                                return value1;
                            }

                        }else{
                            return value1;
                        }
                    });
                    if(istrue){
                        return value;
                    }else{
                        return undefined;
                    }
                }
            });
            // console.log()
            // var jsontext = "1111"
            // vm.COM1COLD.moduleSelect=JSON.parse();
            // let upOld={};
            // if(vm.COM1COLD.moduleSelectJson!=''){
            //     JSON.stringify(JSON.parse(vm.COM1COLD.moduleSelectJson),function (key,value) {
            //         if(typeof value!="object"){
            //             upOld[key]=value;
            //             return value;
            //         }else{
            //             return value;
            //         }
            //     });
            // }
            // var jsonText1 = JSON.stringify(JSON.parse(jsontext),function (key,value) {
            //     if (typeof value != "object") {
            //         if(upOld[key]!=undefined)value=upOld[key];
            //         return "<input id='only_"+key+"' class='editdata form-control' data-name='"+key+"' type='text' value='"+value+"'/>";
            //     } else {
            //         return value;
            //     }
            // });
            // var jsonText2 = JSON.stringify(JSON.parse(jsonText1),null,4);
            // var jsonText3 = JSON.stringify(JSON.parse(jsontext),function (key,value) {
            //     if (typeof value != "object") {
            //         return "---"+names[key];
            //     } else {
            //         return value;
            //     }
            // });
            // var jsonText4 = JSON.stringify(JSON.parse(jsonText3),null,4);
            // for(var i in names){
            //     let a='"'+i+'": "---';
            //     let b=upOld[i]!=undefined?upOld[i]:i;
            //     jsonText4=jsonText4.replace(a,'"<span class=\'editdata-key'+i+'\'>'+b+'</span>": "');
            // }
            // TH.COM1ShowD.key=jsonText2;
            // TH.COM1ShowD.value=jsonText4;
            // if(TH.COM1Data.step1!=TH.COM1Data.steps){
            //     TH.clearText();
            // }
            TH.COM1Data.step1++;
        }
    }else if(s_1==3){
        //第四步
        let istrue=false;
        let c=$('#N_http .editdata');
        let d={};
        for(var i=0;i<c.length;i++){
            d[c.eq(i).attr('data-name')]=c.eq(i).val();
            if(c.eq(i).value==''){
                istrue=true;
            }
        }
        // if(istrue){
        //     layer.msg('原始模块的值不能为空',{icon:0,time:1200});
        //     return;
        // }
        // let jsontext = JSON.stringify(vm.COM1COLD.moduleSelect,function (key,value) {
        //     if(typeof value!="object"){
        //         return d[key];
        //     }else{
        //         return value;
        //     }
        // });
        console.log(istrue)
        TH.COM1COLD.moduleSelectJson='1111';
        TH.layerIndex2=layer.open({
            type:1,
            title:'选择定时器类型',
            content:$('#N_time'),
            area:['300px','250px'],
            success:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                $('#N_time').removeClass('hide');
            }, end:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                $('#N_time').addClass('hide');
            }
        })
        TH.COM1Data.step1++;
    }else if(s_1==4){
        //第五步
        http.n_save(TH);
    }
}
HTTP.prototype.n_save=function(TH) {
    vm.loading('保存模块 ...');
    let cronExp_str=vm.NDaLIST1.CronExpress;
    let object={
        "type":"http",
        "info":{
            "url":vm.N_HTTP_1.urlPath,
            "type":vm.N_HTTP_1.urlType,
            "parameter":vm.N_HTTP_1.params,
            "sendType":{
                "thisType":vm.COM1COLD.txt
            },
            "datainfo":TH.COM1COLD.moduleSelectJson,
            "cronExpress":cronExp_str,
            "topicInfo":"test_send_tianqi",

            "suffix":vm.COM1COLD.suffix,
        }
    };
    var str=JSON.stringify(object);
    let l_mo;
    if(vm.DRdragDropDatas.index2==-1) {//修改
        l_mo=vm.DRdropDatas[TH.DRcontextmenuData.index1].moduleID;
    }else{//新建
        l_mo=vm.moduleID+1;
    }
    layer.msg('保存模块成功',{icon:1,time:1200},function () {
        http.n_save_module();//保存http 模板
    });
    // $.ajax({
    //     url:basePath+"serviceByExternalInterFace/externalInterFaceSaveCronExpressionsByHttp.do",
    //     type:"post",
    //     data:{
    //         tokenID:parent.tokenID,
    //         flowID:vm.flowID,
    //         sendString:str,
    //         moduleID:l_mo
    //     },
    //     success:function(data){
    //         vm.closeLoading();
    //         if(!verificationInstruction(data)){
    //             return false;
    //         };
    //         // data=data.dataInfo;
    //         // if(data){
    //             layer.msg('保存模块成功',{icon:1,time:1200},function () {
    //                 http.n_save_module();//保存http 模板
    //             });
    //         // }else{
    //         //     layer.msg('保存模块失败',{icon:2,time:1200});
    //         // }

    //     }
    // })
}
HTTP.prototype.n_save_module=function() {
    let TH=vm;
    let n_1=TH.COM1ShowD.time_Type=='r';
    let ItemCon_1=[
        {paramName:'URL',value:TH.N_HTTP_1.urlPath},
        {paramName:'send文件格式',value:TH.COM1COLD.txt},
        {paramName:'定时器类型',value:n_1?'实时定时器':'周期定时器'},
    ];
    if(!n_1){
        ItemCon_1.push({paramName:'表达式',value:TH.NDaLIST1.CronExpress})
    }
    if(vm.DRdragDropDatas.index2==-1) {//修改
        let data=vm.DRdropDatas[TH.DRcontextmenuData.index1];
        data.step1=JSON.stringify(TH.N_HTTP_1);
        data.step2=JSON.stringify(TH.COM1getD);
        data.step3=JSON.stringify(TH.COM1COLD);
        data.step4=JSON.stringify(TH.COM1ShowD);
        data.step5=JSON.stringify(TH.NDaLIST1);
        data.ItemCon=ItemCon_1;
        data.ItemConTitle=[TH.N_HTTP_1.urlType,TH.N_HTTP_1.urlPath];
    }else{//新建
        console.log(TH)
        TH.DRdropDatas.push({
            type:1,
            name:'http',
            version:'1.0',
            msg:'http协议',
            iconImg:TH.HserverType[TH.DRdragDropDatas.index2].img,
            left:TH.DRdragDropDatas.left,
            top:TH.DRdragDropDatas.top,
            step1:JSON.stringify(TH.N_HTTP_1),
            step2:JSON.stringify(TH.COM1getD),
            step3:JSON.stringify(TH.COM1COLD),
            step4:JSON.stringify(TH.COM1ShowD),
            step5:JSON.stringify(TH.NDaLIST1),
            ItemConTitle:[TH.N_HTTP_1.urlType,TH.N_HTTP_1.urlPath],
            ItemCon:ItemCon_1,
            moduleID:++vm.moduleID,
            engineID:11
        })
    }
    vm.cancel();
    vm.saveDo1();//保存流程
}
var http = new HTTP();
/*添加的方法*/
$(function () {
    $('#N_http').on('keyup','.editdata',function () {
        let a=$(this).val();
        let b=$(this).index();
        let c=$('#N_http .editdata');
        let d=false;
        for(var i=0;i<c.length;i++){
            if(i!=b){
                if(c.eq(i).val()==a){
                    d=true;
                }
            }
        }
        if(d){
            layer.msg('修改过后的数据不能重复',{icon:0});
            $(this).val('');
        }else{
            $('#N_http .editdata-key'+$(this).attr('data-name')).html(a);
        }
    })
})
