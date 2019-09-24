function ORACLE(){

}
ORACLE.prototype.oracleYTable=function (TH) {
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
    var a_1=$('#SipAddressoracle').val();
    if(a_1&&a_1!=''){
      param['ipAddress']=a_1;
    }
    return param;
  }
  var h=$('.kafkaYTable-box').height();
  getTableInit("oracleYTable-table-1","LTPTooloracle",postUrl,param,10,[ 5, 10, 15 , 50, 100,150,300],h,columnConfig,queryParamCallBack);
}
ORACLE.prototype.oracleYTable2=function (TH) {
  // console.log(33)
  //初始化 table
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
    param = {tokenID:parent.tokenID};
    var a_1=$('#SipAddressoracle').val();
    if(a_1&&a_1!=''){
      param['host_ip']=a_1;
    }
    return param;
  }
  var h=$('.dbTableBox-box').height();
  getTableInit("dbTableBox","LTPTooloracle",postUrl,param,10,[ 5, 10, 15 , 50, 100,150,300],h,columnConfig,queryParamCallBack);
}
ORACLE.prototype.oracleYTable3=function () {
  // console.log(33)
  if($('#dbTableBox').html()){
    $('#dbTableBox').bootstrapTable('destroy');
  }
  //初始化 table
  let type=vm.oracleList[3].type;
  var postUrl =basePath_par + 'serviceByDataReconnaissance/queryAllOfOwnerInDataBaseByDBId.do';
  if(type==2){//用户
    var columnConfig =[
      {radio:true},
      {field:'name',title:"用户名",align:"center"},
    ];
  }else if(type==3){//表
    var columnConfig =[
      {radio:true},
      {field:'tableName',title:"表名称",align:"center"},
      {field:'engineName',title:"引擎名称",align:"center"},
    ];
  }

  var param={};
  var tempParams ;
  var queryParamCallBack = function(initParams,param){
    let msg=JSON.parse(vm.oracleList[2].msg);
    let a_1=$('#SipAddressoracle').val();
    param = {tokenID:parent.tokenID,dbID:msg.db_id,parameterName:a_1};
    if(type==3){//表
      param['dbName']=vm.oracleList[3].userName;
    }
    // dbID: 1178
    // dbName: FANG1
    //
    // if(a_1&&a_1!=''){
    //   param['ipAddress']=a_1;
    // }
    return param;
  }
  var h=$('.dbTableBox-box').height();
  getTableInit("dbTableBox","LTPTooloracle",postUrl,param,10,[ 5, 10, 15 , 50, 100,150,300],h,columnConfig,queryParamCallBack);
}
ORACLE.prototype.oracleYTab=function (TH,type) {
  /*type--代表要切换到哪个页面*/
  // kafka.kafkaClear();//清空
  // vm.kafkaYStat=type;
  vm.oracleList[0].type=type;
  if(type==0){
    if($('#oracleYTable-table-1').length){
      $('#oracleYTable-table-1').bootstrapTable('destroy')
    }
  }else if(type==1){//新建页面
    // vm.kafkaInitForm=1;
  }else if(type==2){//已有页面
    vm.kafkaInitForm=13;
  }
}
ORACLE.prototype.oracleYSelc=function () {
  // 选中主机信息
  let selectData=$('#oracleYTable-table-1').bootstrapTable('getSelections');
  if(selectData.length==0){
    layer.msg('请选择数据',{icon:2,time:1200});
    return;
  }
  $('#oracleYTable-table-1').bootstrapTable('destroy');
  vm.oracleList[0].type=1;
  vm.oracleList[0].list.forEach(function (item,index) {
    vm.oracleList[0].list[index].value=selectData[0][item.paramName];
  })

console.log(vm.oracleList)

}
ORACLE.prototype.oracleNextDo=function (TH) {
  if(vm.oracleStep==0){//主机信息

  }else if(vm.oracleStep==1){//根目录

  }else if(vm.oracleStep==2){//数据源1
   //    数据源初始化
    if(vm.oracleList[2].isshowTable){
      vm.kafkaInitForm=14;
    }
   //  oracle.oracleYTable2();
  }
}
ORACLE.prototype.oraclePrev=function (TH) {
  if($('#dbTableBox').html()){
    $('#dbTableBox').bootstrapTable('destroy');
  }
  vm.oracleStep--;
  if(vm.oracleStep==2){
    vm.oracleList[3].type=1;
  }
}
ORACLE.prototype.oracleNext=function (TH,type) {
//  下一步
  if(vm.oracleStep==0){
    vm.loading('验证中，请稍等');
    //第一步
                       //    通过ajax验证
    var daats2=TH.oracleList[0].list;
    var datas1={
      hostName:daats2[0].value,
      hostIp:daats2[1].value,
      hostPort:daats2[2].value,
      userName:daats2[3].value,
      passWord:daats2[4].value,
      tokenID:parent.tokenID,
      flowID:TH.flowID,
      engineID:TH.oracleD.engineID,
      moduleID:TH.oracleD.moduleID
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
            if(vm.DRdragDropDatas.index2!=-1){//当为新建时才可以给框 赋（接口传的）——值

              vm.oracleList[1].list[0].value=data[0].pathInfo.path;
              if(data[0].pathInfo.doc){
                vm.oracleList[1].list[1].value=data[0].pathInfo.doc;
              }else{
                // vm.oracleList[1].list[1].value='';
              }
              vm.oracleList[1].msg=JSON.stringify(data[0].pathInfo);

              console.log(vm.oracleStep)
              // vm.kafaListData.data['osName']=data[0].pathInfo.os;
              // var ad23=TH.kafkaList[TH.kafkaStep+1].modelName;
              // if(ad23=='pathConfig'){
              //   var ad234=vm.KAFpathConfig;
              // }else if(ad23=='kafkaPathConfig'){//kafa
              //   var ad234=vm.KAFpathConfigkafka;
              // }
              // ad234[0].value=data[0].pathInfo.path;
              // if(data[0].pathInfo.doc){
              //   ad234[1].value=data[0].pathInfo.doc;
              // }else{
              //   ad234[1].value='';
              // }
              // if(ad234[2]){
              //   if(data[0].pathInfo.javaHome){
              //     ad234[2].value=data[0].pathInfo.javaHome;
              //   }else{
              //     ad234[2].value='';
              //   }
              // }

            }
            vm.oracleStep++;
            oracle.oracleNextDo();

            // kafka.kafkaNextDo(true);//下一步的操作
          });
        }else{
          layer.confirm('当前填写内容不正确；错误信息如下 ：'+data[0].message,{btn:['确定'],area:['80%','80%']},function (index) {
            layer.close(index);
          });
        }
      },
    });
  }else if(vm.oracleStep==1){
    let istrue=false;
    vm.oracleList[1].list.forEach(function (item) {
      if(item.value=='')istrue=true;
    })
    if(istrue){
      layer.msg('请完善信息',{icon:2,time:1200})
      return;
    }
    //  第二步
    vm.oracleStep++;
    oracle.oracleNextDo();

  }else if(vm.oracleStep==2){//数据源
    //  第三步
    vm.oracleStep++;
    // oracle.oracleNextDo();
  }else if(vm.oracleStep==3){//存储表名称
    $('#SipAddressoracle').val('');
    let typeD=vm.oracleList[3].type;
    if(type==undefined){//保存
      //  第四步
      if(vm.oracleList[3].list[0].value==''){
        layer.msg('请完善信息',{icon:2,time:1200})
        return;
      }
      oracle.oracleSave(TH);
    }else if(typeD==0&&type==0){//新建表名
      vm.oracleList[3].type=1;
    }else if(typeD==0&&type==1){//选择已有表名
      vm.oracleList[3].type=2;
      // oracle.oracleYTable3();
      vm.kafkaInitForm=15;
    }else if(typeD==1&&type==0){//重选表
      vm.oracleList[3].type=2;
      // oracle.oracleYTable3();
      vm.kafkaInitForm=15;
    }else if((typeD==2||typeD==3)&&type==0){//编辑表名称
      if($('#dbTableBox').html()){
        $('#dbTableBox').bootstrapTable('destroy');
      }
      vm.oracleList[3].type=1;
    }else if(typeD==2&&type==1){//打开用户
      let selecD=$('#dbTableBox').bootstrapTable('getSelections');
      if(!selecD.length){
        layer.msg('请选择数据',{icon:2,time:1200});
        return;
      }
      vm.oracleList[3].userName=selecD[0].name;
      vm.oracleList[3].type=3;
      // oracle.oracleYTable3();
      vm.kafkaInitForm=15;
    }else if(typeD==3&&type==1){//返回上一级
      vm.oracleList[3].type=2;
      // oracle.oracleYTable3();
      vm.kafkaInitForm=15;
    }else if(typeD==3&&type==2){//选择表
      let selecD=$('#dbTableBox').bootstrapTable('getSelections');
      if(!selecD.length){
        layer.msg('请选择数据',{icon:2,time:1200});
        return;
      }
      vm.oracleList[3].list[0].value=vm.oracleList[3].userName+'.'+selecD[0].tableName;
      if($('#dbTableBox').html()){
        $('#dbTableBox').bootstrapTable('destroy');
      }
      vm.oracleList[3].type=1;
    }




    // vm.oracleStep++;
    // oracle.oracleNextDo();
  }


}
ORACLE.prototype.oracleSelectDBID=function (TH) {
  //保存数据源
  let selectData=$('#type_oracle #dbTableBox').bootstrapTable('getSelections');
  if(!selectData.length){
    layer.msg('请选择数据源信息',{icon:2,time:1200});
    return;
  }else{
    layer.confirm('确认数据源后，不可更改，是否继续选择当前数据源 ？',{btn:['确认','取消'],icon:3},function (index) {
      layer.close(index);
      console.log(selectData)
      vm.oracleList[2].isshowTable=false;
      vm.oracleList[2].list[0].value=selectData[0].db_name;
      vm.oracleList[2].list[1].value=selectData[0].host_ip;
      vm.oracleList[2].msg=JSON.stringify(selectData[0])
      if($('#type_oracle #dbTableBox').length){
        $('#type_oracle #dbTableBox').bootstrapTable('destroy');
      }

    },function (index) {
      layer.close(index);
    });
  }


  // layer.msg('保存成功')

}
ORACLE.prototype.oracleSave=function (TH) {
   //save
  vm.loading('保存模块中 ...');
  // console.log(basePath_par)
  var daats2=TH.oracleList[0].list;
  var daats3=TH.oracleList[1].list;
  let daats3Msg=JSON.parse(TH.oracleList[1].msg);
  var daats4=TH.oracleList[2].list;
  let daats4Msg=JSON.parse(TH.oracleList[2].msg);
  var datas1={
    hostName:daats2[0].value,
    hostIp:daats2[1].value,
    hostPort:daats2[2].value,
    userName:daats2[3].value,
    passWord:daats2[4].value,
    tokenID:parent.tokenID,
    flowID:TH.flowID,
    engineID:TH.oracleD.engineID,
    moduleID:TH.oracleD.moduleID
  };
  var daats5=TH.oracleList[3].list;
  // let dbSame='no';
  // if(daats2[1].value==daats4[1].value){
  //   dbSame='yes';
  // }

  var params1={
    tokenID:parent.tokenID,
    flowID:TH.flowID,
    engineID:TH.oracleD.engineID  ,
    moduleID:TH.oracleD.moduleID ,
    db_id: daats4Msg.db_id,
    ip:daats2[1].value,
    port:daats2[2].value,
    userName:daats2[3].value,
    // dbSame:dbSame
  };

  // javaHome: ""
  // oraDbHOME: "/mydata/app/oracle/product/11.2.0/db_1"
  // os: "Linux mysql3 2.6.18-308.el5 #1 SMP Fri Jan 27 17:17:51 EST 2012 x86_64 x86_64 x86_64 GNU/Linux↵"
  // osName: "Linux mysql3 2.6.18-308.el5 #1 SMP Fri Jan 27 17:17:51 EST 2012 x86_64 x86_64 x86_64 GNU/Linux↵"
  // packageJavaHome: ""
  // packagePath: "/dsg/sunjw↵"
  // path: "/dsg/sunjw↵"
  // pathFlag: "true"

  var params={
    tokenID:parent.tokenID,
    flowID:vm.flowID,
    engineID:TH.oracleD.engineID,
    moduleID:TH.oracleD.moduleID,
    osName:daats3Msg.osName?daats3Msg.osName:'',
    hostName:daats2[0].value,
    ip:daats2[1].value,
    port:daats2[2].value,
    userName:daats2[3].value,
    passWord:daats2[4].value,
    packageJavaHome:daats3Msg.packageJavaHome?daats3Msg.packageJavaHome:'',
    packagePath:daats3[0].value,
    packageName:daats3[1].value,
    baseConfigInfo:JSON.stringify([{'1042':daats5[0].value,'1044':daats5[1].value,'130':daats3[2].value,'110':daats3[3].value,}]),
  }
  $.ajax({
    type: 'post',
    data:params1,
    url: vm.basePath + 'serviceByModuleOperation/publicSaveEngineModuleDataBaseID.do',
    success: function (data) {
      if(!verificationInstruction(data)){
        return false;
      };
      data=data.dataInfo;
      if(data.flag){
        $.ajax({
          type:'post',
          dataType:'json',
          data:params,
          url:vm.basePath+'unstructuredServiceByDynamicFlow/publicSaveFlowConfigureInfo.do',
          success:function (data) {
            if(!verificationInstruction(data)){
              return false;
            };
            if(data.dataInfo=='sucess'){
              // savedata();保存
              layer.msg('保存成功',{icon:1})
              oracle.addModel_oracle(TH);
              //成功后 ，不需要赋值， 当其失败时  需要还原其原来值
            }else{
              layer.msg('保存失败',{icon:2})
            }
          },
        });
      }else{
        layer.msg('保存dbid失败',{icon:2})
      }
    }
  });





}
ORACLE.prototype.addModel_oracle=function(TH){
  // let z_={};
  // vm.KAFremortConfig.forEach(function (item1) {
  //   z_[1+item1.paramName]=item1.value;
  // })
  // vm.KAFpathConfig.forEach(function (item1) {
  //   z_[2+item1.paramName]=item1.value;
  // })
  // vm.KAFpathConfigkafka.forEach(function (item1) {
  //   z_[3+item1.paramName]=item1.value;
  // })
  // let newKafka=[];
  // vm.kafkaList.forEach(function (item1) {
  //   if(item1.modelView){
  //     item1.modleList.forEach(function (item2) {
  //       if(item2.pageView==1){
  //         newKafka.push(item2);
  //         newKafka[newKafka.length-1].eType=item1.eType;
  //         newKafka[newKafka.length-1].value=item2.value;
  //       }
  //     })
  //   }
  // })
  // let detailsTp=[2];//2 --指向的是kafka类型--详细配置--菜单
  var daats2=TH.oracleList[0].list;
  var daats3=TH.oracleList[1].list;
  let daats3Msg=JSON.parse(TH.oracleList[1].msg);
  var daats4=TH.oracleList[2].list;

  // let detailsDa=[{
  //   name:'主机名称',
  //   // type:deindex,
  //   value:daats2[0].value,
  //   // mid:item2.mid,
  //   icon:'icon-lanmupeizhi'
  // },
  //   {
  //     name:'数据源名称',
  //     // type:deindex,
  //     value:daats4[0].value,
  //     // mid:item2.mid,
  //     icon:'icon-lanmupeizhi'
  //   },
  // {
  //   name:'数据源ip',
  //     // type:deindex,
  //     value:daats4[1].value,
  //   // mid:item2.mid,
  //   icon:'icon-lanmupeizhi'
  // }];
  if(vm.DRdragDropDatas.index2==-1) {//修改
    let in_=vm.DRcontextmenuData.index1;
    // vm.DRdropDatas[in_].kafkaList=JSON.stringify(vm.kafkaList);
    // vm.DRdropDatas[in_].kafkaYStat=vm.kafkaYStat;
    // vm.DRdropDatas[in_].kafaListDataisinit=vm.kafaListData.isinit;
    // vm.DRdropDatas[in_].kafaListDatadata=JSON.stringify(vm.kafaListData.data);
    // vm.DRdropDatas[in_].others=JSON.stringify(z_);
    // vm.DRdropDatas[in_].ItemCon=newKafka;
    // vm.DRdropDatas[in_].detailsTp=detailsTp;
    vm.DRdropDatas[in_].oracleList=JSON.stringify(vm.oracleList);
    // vm.DRdropDatas[in_].detailsDa=detailsDa;
  }else{//新建
    vm.DRdropDatas.push({
      type:4,
      name:'oracle',
      // version:vm.kafkaVersion[vm.kafkaVersionD.selectIndex].version,
      // msg:vm.kafkaVersion[vm.kafkaVersionD.selectIndex].details,
      iconImg:vm.HserverType[vm.DRdragDropDatas.index2].img,
      isupload:false,//定义当前是否上传
      left:vm.DRdragDropDatas.left,
      top:vm.DRdragDropDatas.top,
      oracleList:JSON.stringify(vm.oracleList),
      // kafkaYStat:vm.kafkaYStat,
      // kafaListDataisinit:true,
      // kafaListDatadata:JSON.stringify(vm.kafaListData.data),
      // others:JSON.stringify(z_),
      ItemCon:[
        {
          paramName:'主机名称',
          // type:deindex,
          value:daats2[0].value,
          // mid:item2.mid,
          icon:'icon-lanmupeizhi'
        },
          {
            paramName:'数据源名称',
            // type:deindex,
            value:daats4[0].value,
            // mid:item2.mid,
            icon:'icon-lanmupeizhi'
          },
        {
          paramName:'数据源ip',
            // type:deindex,
            value:daats4[1].value,
          // mid:item2.mid,
          icon:'icon-lanmupeizhi'
        }
      ],
      // detailsTp:detailsTp,
      // detailsDa:detailsDa,
      engineID:vm.oracleD.engineID,
      moduleID:vm.oracleD.moduleID,
      engineTypeCode:vm.oracleD.engineTypeCode
    })
    // if(!vm.kafaListData.isshowTable){//添加数据源
    //   vm.DRdropDatas[vm.DRdropDatas.length-1].TLdbIDList=JSON.stringify(vm.TLdbIDList);
    // }
    ++vm.moduleID;
  }
  vm.cancel();
  vm.saveDo1();//保存流程
}//生成模块

ORACLE.prototype.oracleYTableSearch=function () {
  console.log(334)
  //  搜索
  let stype=vm.oracleStep;
  let boots=['#oracleYTable-table-1','','#dbTableBox','#dbTableBox'];
  $(boots[stype]).bootstrapTable('refresh');
}
var oracle=new ORACLE();




