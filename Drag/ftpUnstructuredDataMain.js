/*非结构流程----FTP*/
var basePath = basePath_un;
function FTP(){}
/*new*/
FTP.prototype.n_next=function(TH) {
    let s_1=TH.COM1Data.step1;
    if(s_1==1){
        //第一步
        $('#customForm').data('bootstrapValidator').validate();
        if(!$('#customForm').data('bootstrapValidator').isValid()){
            layer.msg('验证不正确，请重新填写。',{icon:2,time:900});
            return false;
        }
        let d_1=TH.N_FTP_1.list;
        let pu={tokenID:parent.tokenID};
        d_1.forEach(function (item1,index1) {
          pu[item1.paramName]=item1.value;
        })
      vm.loading('加载中');
        $.ajax({
            type:'post',
            dataType:'json',
            data:pu,
            url:basePath+'ftpExternalInterFaceController/validateFtpInterFaceService.do',
            success:function (data) {
                if(!verificationInstruction(data)){
                    return false;
                };
                data=data.dataInfo;

                if(data.flag=='true'){
                    layer.msg('验证成功',{icon:1,time:600});
                    if(vm.COM1getD.remotePath==''&&data.pathInfo){
                        vm.COM1getD.remotePath=data.pathInfo;
                    }
                    if(data.os){
                      vm.COM1getD.osName=data.os;
                    }
                    if(TH.COM1Data.step1!=TH.COM1Data.steps){
                        TH.clearText();
                    }
                    //添加保存
                  let l_mo;
                  if(vm.DRdragDropDatas.index2==-1) {//修改
                    let selectData=vm.DRdropDatas[TH.DRcontextmenuData.index1];
                    l_mo=selectData.moduleID;
                  }else{//新建
                    l_mo=vm.moduleID+1;
                  }
                  let pu2={
                    tokenID:pu.tokenID,
                    flowID:vm.flowID,
                    engineID:12,
                    osName:data.os,
                    hostName:'',
                    hostIp:pu.hostIp,
                    hostPort:pu.hostPort,
                    userName:pu.userName,
                    passWord:pu.passWord,
                    packagePath:data.pathInfo,
                    packageName:'',
                    moduleID:l_mo,
                    packageJavaHome:'',
                    detailID:'',
                  }
                  $.ajax({
                    type:'post',
                    dataType:'json',
                    data:pu2,
                    url:basePath_par+'serviceByDynamicFlow/saveFlowMacConfigureInfo.do',
                    success:function (data) {
                      if(!verificationInstruction(data)){
                        return false;
                      };
                      data=data.dataInfo;

                      if(data.flag=='true'){
                        vm.closeLoading();
                        TH.COM1Data.step1++;
                      }else{
                        layer.msg('保存出错，请重新填写')
                      }
                    },
                  });
                }else{
                    layer.confirm('当前填写内容不正确；错误信息如下 ：'+data[0].message,{btn:['确定'],area:['80%','80%']},function (index) {
                        layer.close(index);
                    });
                }
            },
        });
    }else if(s_1==2){
        //第二步
        //    验空
        let params={tokenID:parent.tokenID,charsetName:vm.COM1getD.codedFormat};
        vm.N_FTP_1.list.forEach(function (item1,index1) {
            params[item1.paramName]=item1.value;
        })
        params['remotePath']=vm.COM1getD.remotePath;
        params['osName']=vm.COM1getD.osName;
        if(vm.COM1getD.remotePath==''){
            layer.msg('远程目录的值不能为空',{icon:2,time:1200});
            return;
        }
        // let ty_1=0;//txt
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
        if(!vm.COM1getD.typePath){//文件--
          params['fileName']=vm.COM1getD.selectFile;
          params['filterFileName']=vm.COM1getD.ignoreFile;
          params['isDecompress']=vm.COM1getD.signType;
        }


        // let urls=['/ftpExternalInterFaceController/externalInterFaceOfEngineByFtp.do','/serviceByExternalInterFace/externalInterFaceOfEngineByHttp.do']
        vm.loading('加载中');
        $.ajax({
            type:'post',
            url:basePath+'/ftpExternalInterFaceController/externalInterFaceOfEngineByFtp.do',
            data:params,
            success:function(data){
                if(!verificationInstruction(data)){
                    return false;
                };
                data=data.dataInfo;
                vm.closeLoading();
                if(!data){
                    layer.msg('此格式暂不支持',{icon:2});
                    return;
                }

                var dataInfo=data.jsonDataArr;
                let arrInfo=[];
                if(fileType=='xml'){
                  for(var i in dataInfo){
                    arrInfo.push({"name":i,"value":dataInfo[i],values:[dataInfo[i]]})
                  }
                }else{
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
                }

                // var dataInfo=data.jsonDataArr[0];
                // let arrInfo=[];
                // for(var index in dataInfo){
                //     arrInfo.push({"name":index,"value":dataInfo[index]})
                // }
                vm.COM1COLD.list=arrInfo;
                if(fileType=='txt'||fileType=='excel'){//txt---excel
                    vm.COM1COLD.module=data.colName;
                }else if(fileType=='json'){//json
                    vm.COM1COLD.module=JSON.parse(data.jsonModuleInfo);
                }else if(fileType=='xml'){//xml
                    vm.COM1COLD.module=data.jsonModuleInfo;
                }
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
    }else if(s_1==3){
        //第三步
        if(TH.COM1COLD.select==''){
            layer.msg('请选择要操作的数据',{icon:2,time:1200});
            return;
        }
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
            let fileType=TH.COM1getD.fileType;
            if(fileType=='txt'||fileType=='xml'||fileType=='excel'){//txt--xml--excel
                //text--json
                let names={};
                vm.COM1COLD.select.forEach(function (a) {
                    names[a.name]=a.value;
                })
                // var jsontext = JSON.stringify(vm.COM1COLD.module,function (key,value) {
                //     if(typeof value!="object"){
                //         if(names[key]==undefined){
                //             return undefined;
                //         }else{
                //             return value;
                //         }
                //
                //     }else{
                //         /**/
                //         let istrue=false;
                //         JSON.stringify(value,function (key1,value1) {
                //             if(typeof value1!="object"){
                //                 if(names[key1]!=undefined){
                //                     istrue=true;
                //                     return undefined;
                //                 }else{
                //                     return value1;
                //                 }
                //
                //             }else{
                //                 return value1;
                //             }
                //         });
                //         if(istrue){
                //             return value;
                //         }else{
                //             return undefined;
                //         }
                //     }
                // });
                var jsontext=JSON.stringify(names);
                vm.COM1COLD.moduleSelect=names;
                var jsonText1 = JSON.stringify(JSON.parse(jsontext),function (key,value) {
                    if (typeof value != "object") {
                        return "<input id='only_"+key+"' class='editdata form-control' data-name='"+key+"' type='text' value='"+key+"'/>";
                    } else {
                        return value;
                    }
                });
                var jsonText2 = JSON.stringify(JSON.parse(jsonText1),null,4);
                var jsonText3 = JSON.stringify(JSON.parse(jsontext),function (key,value) {
                    if (typeof value != "object") {
                        return "---"+names[key];
                    } else {
                        return value;
                    }
                });
                var jsonText4 = JSON.stringify(JSON.parse(jsonText3),null,4);
                for(var i in names){
                    let a='"'+i+'": "---';
                    jsonText4=jsonText4.replace(a,'"<span class=\'editdata-key'+i+'\'>'+i+'</span>": "');
                }
                TH.COM1ShowD.key=jsonText2;
                TH.COM1ShowD.value=jsonText4;
                if(TH.COM1Data.step1!=TH.COM1Data.steps){
                    TH.clearText();
                }
            }else if(fileType=='json'){//json---json
                // vm.COM1COLD.module=JSON.parse(data.jsonModuleInfo);
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
                vm.COM1COLD.moduleSelect=JSON.parse(jsontext);
                var jsonText1 = JSON.stringify(JSON.parse(jsontext),function (key,value) {
                    if (typeof value != "object") {
                        return "<input id='only_"+key+"' class='editdata form-control' data-name='"+key+"' type='text' value='"+value+"'/>";
                    } else {
                        return value;
                    }
                });
                var jsonText2 = JSON.stringify(JSON.parse(jsonText1),null,4);
                var jsonText3 = JSON.stringify(JSON.parse(jsontext),function (key,value) {
                    if (typeof value != "object") {
                        return "---"+names[key];
                    } else {
                        return value;
                    }
                });
                var jsonText4 = JSON.stringify(JSON.parse(jsonText3),null,4);
                for(var i in names){
                    let a='"'+i+'": "---';
                    jsonText4=jsonText4.replace(a,'"<span class=\'editdata-key'+i+'\'>'+i+'</span>": "');
                }
                TH.COM1ShowD.key=jsonText2;
                TH.COM1ShowD.value=jsonText4;
                if(TH.COM1Data.step1!=TH.COM1Data.steps){
                    TH.clearText();
                }
            }
            TH.COM1Data.step1++;
        }
    }else if(s_1==4){
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
        if(istrue){
            layer.msg('原始模块的值不能为空',{icon:0,time:1200});
            return;
        }
        let jsontext = JSON.stringify(vm.COM1COLD.moduleSelect,function (key,value) {
            if(typeof value!="object"){
                return d[key];
            }else{
                return value;
            }
        });
        TH.COM1COLD.moduleSelectJson=jsontext;
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
        // TH.COM1Data.step1++;
    }else if(s_1==5){
        //第五步
        ftp.n_save(TH);
    }
}
FTP.prototype.n_save=function(TH) {
    vm.loading('保存模块 ...');
    let arr='';
    if(vm.COM1getD.fileType=='txt'){//text
        if(vm.COM1getD.fileFormat=='asc'){
            arr=vm.COM1getD.fileFormat1;
        }
        if(vm.COM1getD.fileFormat=='hex'){
            let arrs=[];
            vm.COM1getD.fileFormat2.forEach(function (item1,index1) {
                arrs.push(item1.value);
            })
            arr='0X'+arrs.join('0X');
        }
    }
    let ars=[];
    let ars_2=[];
    let ars_3=[];
    vm.COM1COLD.select.forEach(function (item1) {
        ars.push(item1.name);
    })
    for(var i  in vm.COM1COLD.module){
        if(ars.indexOf(vm.COM1COLD.module[i]+'')!=-1){
            ars_2.push({
                [i]:vm.COM1COLD.module[i]
            });
            ars_3.push(i+":"+vm.COM1COLD.module[i]);
        }
    }
    let stds='';
    if(vm.COM1COLD.fileFormat=='asc'){
        stds=vm.COM1COLD.fileFormat1;
    }else{
        let ar=[];
        for(var i in vm.COM1COLD.fileFormat2){
            ar.push('0X'+vm.COM1COLD.fileFormat2[i].value);
        }
        stds=ar.join(',');
    }
    //
    let data_1=vm.N_FTP_1.list;
    let objex1={
        "type": "ftp",
        "info": {
            "hostIp": data_1[0].value,
            "hostPort": data_1[1].value,
            "userName": data_1[2].value,
            "passWord": data_1[3].value,
            "isColName": vm.COM1getD.isColName,
            "colNameInfo": ars_3.join(','),
            "split": arr,
            // "suffix":vm.COM1getD.suffix,
            "sendSplit":stds,
            "type": "POST",
            "remotePath": vm.COM1getD.remotePath,
            // "osName": vm.COM1getD.osName,
            "sendType": {
                "thisType": vm.COM1COLD.txt
            },
            "dataType":vm.COM1getD.fileType,
            "datainfo": ars_2,
            "cronExpress": vm.NDaLIST1.CronExpress,
            "topicInfo": "test_send_tianqi",
            "charsetName":vm.COM1getD.codedFormat
        }
    }
    if(vm.COM1getD.fileType=='txt'){
      objex1.info['suffix']=vm.COM1getD.suffix;
    }
    objex1.info['searchType']='directory';
    if(!vm.COM1getD.typePath){//文件
      objex1.info['searchType']='file';
      objex1.info['fileName']=vm.COM1getD.selectFile;
      objex1.info['filterFileName']=vm.COM1getD.ignoreFile;
      objex1.info['isDecompress']=vm.COM1getD.signType;
    }
    let l_mo;
    if(vm.DRdragDropDatas.index2==-1) {//修改
        l_mo=vm.DRdropDatas[TH.DRcontextmenuData.index1].moduleID;
    }else{//新建
        l_mo=vm.moduleID+1;
    }
    var str=JSON.stringify(objex1)
    $.ajax({
        url:basePath+"ftpExternalInterFaceController/externalInterFaceSaveCronExpressionsByFtp.do",
        type:"post",
        data:{
            tokenID:parent.tokenID,
            flowID:vm.flowID,
            sendString:str,
            moduleID:l_mo
        },
        success:function(data){
            vm.closeLoading();
            if(!verificationInstruction(data)){
                return false;
            };
            if(data.statFlag==100){
              layer.msg(data.message, {icon: 0});
              return;
            }
            // data=data.dataInfo;
            // if(data){
                layer.msg('保存模块成功',{icon:1,time:1200},function () {
                    ftp.n_save_module();
                });
            // }else{
            //     layer.msg('保存模块失败',{icon:2,time:1200});
            // }
        }
    })
}
FTP.prototype.n_save_module=function() {
    let TH=vm;
    let n_1=TH.COM1ShowD.time_Type=='r';
    let ItemCon_1=[
        {paramName:'主机的信息',value:TH.N_FTP_1.list[0].value},
        {paramName:'目录',value:TH.COM1getD.remotePath},
        {paramName:'定时器类型',value:n_1?'实时定时器':'周期定时器'},
    ];
    if(!n_1){
        ItemCon_1.push({paramName:'表达式',value:TH.NDaLIST1.CronExpress})
    }
    if(vm.DRdragDropDatas.index2==-1) {//修改
        let data=vm.DRdropDatas[TH.DRcontextmenuData.index1];
        data.step1=JSON.stringify(TH.N_FTP_1);
        data.step2=JSON.stringify(TH.COM1getD);
        data.step3=JSON.stringify(TH.COM1COLD);
        data.step4=JSON.stringify(TH.COM1ShowD);
        data.step5=JSON.stringify(TH.NDaLIST1);
        data.ItemCon=ItemCon_1;
        data.ItemConTitle=[TH.N_FTP_1.list[0].value,TH.N_FTP_1.list[1].value];
    }else{//新建
        TH.DRdropDatas.push({
            type:2,
            name:'ftp',
            version:'1.0',
            msg:'ftp协议',
            iconImg:vm.HserverType[vm.DRdragDropDatas.index2].img,
            left:vm.DRdragDropDatas.left,
            top:vm.DRdragDropDatas.top,
            step1:JSON.stringify(TH.N_FTP_1),
            step2:JSON.stringify(TH.COM1getD),
            step3:JSON.stringify(TH.COM1COLD),
            step4:JSON.stringify(TH.COM1ShowD),
            step5:JSON.stringify(TH.NDaLIST1),
            ItemConTitle:[TH.N_FTP_1.list[0].value,TH.N_FTP_1.list[1].value],
            ItemCon:ItemCon_1,
            moduleID:++vm.moduleID,
            engineID:12
        })
    }
    vm.cancel();
    vm.saveDo1();//保存流程
}
FTP.prototype.ftpTabClear=function () {
    if($('#N_ftp #customForm').html()){
        $('#N_ftp #customForm').bootstrapValidator('destroy')
    }
    if($('#N_ftp #kafkaYTable-table').length!=0){
        $('#N_ftp #kafkaYTable-table').bootstrapTable('destroy');
    }
    if($('#N_ftp #dbTableBox').length!=0){
        $('#N_ftp #dbTableBox').bootstrapTable('destroy');
    }
}
FTP.prototype.ftpSearch=function () {
    $('#kafkaYTable-table').bootstrapTable('refresh');
}
FTP.prototype.ftpSelect=function (TH) {
    let selectData=$('#kafkaYTable-table').bootstrapTable('getSelections');
    if(selectData.length==0){
        layer.msg('请选择数据',{icon:0});
        return;
    }
    TH.N_FTP_1.list.forEach(function (item,index) {
        item.value=selectData[0][item.uparamName];
    })
    TH.ftpTab(1,true);
}
FTP.prototype.ftpTab=function (TH,type,params) {
    /*type--代表要切换到哪个页面*/
    ftp.ftpTabClear();//清空
    vm.N_FTP_1.stat=type;
    if(type==1){//新建页面
      TH.N_FTP_1.list.forEach(function (item,index) {
        if(item.paramName=='osName'){
          TH.N_FTP_1.list[index].show=params?false:true;
        }
      })
        vm.kafkaInitForm=10;
    }else if(type==2){//已有页面
        vm.kafkaInitForm=11;
    }
}
var layerIndexTree;
FTP.prototype.openFile=function (TH,type,params) {
  let title='远程目录';
  if(!vm.COM1getD.typePath){
    title='远程文件';
  }
  layerIndexTree=layer.open({
    type:1,
    content:$('#zTreeFile'),
    title:'选择当前 [ '+title+' ] ',
    area:['80%','70%'],
    success:function (layero) {
      var a=$(layero);
      a.find('.layui-layer-content').css('height',a.height()-42+'px');
      $('#zTreeFile').removeClass('hide');
      if(vm.COM1getD.typePath){//目录
        let files=vm.COM1getD.remotePath.split(';');
        vm.fileDirectory.root=files[0];
        vm.fileDirectory.selectFileList=files;

        vm.fileDirectory.selectFileIndex=0;
        vm.fileDirectory.hoverFileIndex=-1;
      }else{//文件
        vm.fileDirectory.root=vm.COM1getD.remotePath;
        let a=vm.COM1getD.selectFile.split(';');
        let b=vm.COM1getD.ignoreFile.split(';');
        let c={};
        if(a[0]){
          a.forEach(function(item){
            c[item]={
              type:1,
              name:item
            }
          })
        }
        if(b[0]){
          b.forEach(function(item){
            c[item]={
              type:0,
              name:item
            }
          })
        }

        // console.log(c)
        // console.log(a);
        let ad=vm.COM1getD.signFile;
        vm.fileDirectory.signList=ad?JSON.parse(ad):{},//存储 文件时的状态;
        vm.fileDirectory.regSignList=c;
        vm.fileDirectory.regType=0;
        vm.fileDirectory.isinitTrue=true;
        vm.fileDirectory.isZip=false;
      }
      vm.fileDirectory.selectData=[];



      vm.selectFile(3);//初始化目录初始值
    },
    end:function () {
      $('#zTreeFile').addClass('hide');
      //  销毁tree
    },
  })

}
var ftp = new FTP();
/*添加的方法*/
$(function () {
    $('#N_ftp').on('keyup','.editdata',function () {
        let a=$(this).val();
        let b=$(this).index();
        let c=$('#N_ftp .editdata');
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
            $('#N_ftp .editdata-key'+$(this).attr('data-name')).html(a);
        }
    })


})
if(0){


  //  init tree
  var setting = {
    view: {
      // addHoverDom: addHoverDom,
      // removeHoverDom: removeHoverDom,
      selectedMulti: false
    },
    check: {
      enable: false
      // ,chkStyle: 'radio'
      // ,radioType: "level"
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    edit: {
      enable: true
    }
  };

  var zNodes =[
    { id:1, pId:0, name:"pNode 1", open:true},
    { id:11, pId:1, name:"pNode 11"},
    { id:111, pId:11, name:" sNode 111"},
    { id:112, pId:11, name:"sNode 112"},
    { id:113, pId:11, name:"sNode 113"},
    { id:114, pId:11, name:"sNode 114"},
    { id:12, pId:1, name:"pNode 12"},
    { id:121, pId:12, name:"sNode 121"},
    { id:122, pId:12, name:"sNode 122"},
    { id:123, pId:12, name:"sNode 123"},
    { id:124, pId:12, name:"sNode 124"},
    { id:13, pId:1, name:"pNode 13", isParent:true},
    { id:2, pId:0, name:"pNode 2"},
    { id:21, pId:2, name:"pNode 21", open:true},
    { id:211, pId:21, name:"sNode 211"},
    { id:212, pId:21, name:"sNode 212"},
    { id:213, pId:21, name:"sNode 213"},
    { id:214, pId:21, name:"sNode 214"},
    { id:22, pId:2, name:"pNode 22"},
    { id:221, pId:22, name:"sNode 221"},
    { id:222, pId:22, name:"sNode 222"},
    { id:223, pId:22, name:"sNode 223"},
    { id:224, pId:22, name:"sNode 224"},
    { id:23, pId:2, name:"pNode 23"},
    { id:231, pId:23, name:"sNode 231"},
    { id:232, pId:23, name:"sNode 232"},
    { id:233, pId:23, name:"sNode 233"},
    { id:234, pId:23, name:"sNode 234"},
    { id:3, pId:0, name:"pNode 3", isParent:true}
  ];
  function setCheck() {
    setting.check.chkStyle = $("#r1").attr("checked")? "checkbox":"radio";
    setting.check.enable = (!$("#disablechk").attr("checked"));
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
  }
  // $(document).ready(function(){
  $.fn.zTree.init($("#treeDemo"), setting, zNodes);
  // setCheck();
  // $("#r1").bind("change", setCheck);
  // $("#r2").bind("change", setCheck);
  // $("#disablechk").bind("change", setCheck);
  // });
}

