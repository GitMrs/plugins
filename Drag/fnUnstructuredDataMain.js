//页面的--基本方法扩展
function fns(){}
//layer
layer.config({
    extend: 'skin/yourskin/style.css', //加载您的扩展样式
    skin: 'layer-ext-yourskin'
});
fns.prototype.layerCMDType=-1;
//方法 start
//0.2----视图工具栏 ---- 放大缩小 视图工具栏
fns.prototype.initScale=function (TH) {
    //view  250 250 //canvas  4000 4000
    var width1=$('body').width();
    var height1=$('body').height();

    var WSc=parseFloat((width1/4000).toFixed(2));
    var HSc=parseFloat((height1/4000).toFixed(2));
    TH.VLdatas.minscale=WSc>HSc?(WSc+0.01):(HSc+0.01);//当前最小的比例（加上0.1 误差值）
    TH.refreshViewBtnWH();//刷新当前  视图工具内 视图可视窗口大小
}
fns.prototype.narrow=function (TH) {
    var minscale=TH.VLdatas.minscale;
    var newscale1=TH.VLdatas.scale-0.1;
    if(minscale==TH.VLdatas.scale){
        layer.msg('已到最小值');
        return ;
    }
    if(newscale1<minscale){
        TH.VLdatas.scale=minscale;
        layer.msg('已到最小值');
    }else{
        TH.VLdatas.scale=newscale1;
    }
    layer.msg('当前比例 : '+parseFloat((TH.VLdatas.scale*100).toFixed(2))+'%')
    TH.refreshViewBtnWH();//刷新当前  视图工具内 视图可视窗口大小
}
fns.prototype.blowUp=function (TH) {
    var maxscale=TH.VLdatas.maxscale;
    var newscale1=parseFloat(TH.VLdatas.scale)+0.1;
    if(maxscale==TH.VLdatas.scale){
        layer.msg('已到最大值');
        return ;
    }
    if(newscale1>maxscale){
        TH.VLdatas.scale=maxscale;
        layer.msg('已到最大值');
    }else{
        TH.VLdatas.scale=newscale1;
    }
    layer.msg('当前比例 : '+parseFloat((TH.VLdatas.scale*100).toFixed(2))+'%');
    TH.refreshViewBtnWH();//刷新当前  视图工具内 视图可视窗口大小
}
fns.prototype.directionClick=function (TH,type) {
//移动比  当前比的0.2
    var scale1=TH.VLdatas.scale;
    var w1=$('body').width();
    var h1=$('body').height()-40;
    var L1=w1/(scale1)*0.2;
    var T1=h1/(scale1)*0.2;
    var left1=TH.VLdatas.left1;
    var top1=TH.VLdatas.top1;
    var newdata=scale1*4000;
    if(type==0){//左
        TH.validationView(0,(left1-L1)/scale1);
    }else if(type==1){//上
        TH.validationView(1,(top1-T1)/scale1);
    }else if(type==2){//右
        TH.validationView(0,(left1+L1)/scale1);
    }else if(type==3){//下
        TH.validationView(1,(top1+T1)/scale1);
    }
}
fns.prototype.xvdown=function (TH,ev) {
    ev.stopPropagation();
    ev.preventDefault();
    TH.VLdatas.left3=ev.clientX;
    TH.VLdatas.top3=ev.clientY;
    TH.VLdatas.left2o=TH.VLdatas.left2;
    TH.VLdatas.top2o=TH.VLdatas.top2;
    $(document).on('mousemove',function(event) {//每次移动时，跟随连线
        var scale=vm.VLdatas.scale;
        var left1=vm.VLdatas.left3;
        var top1=vm.VLdatas.top3;
        var left2=event.clientX;
        var top2=event.clientY;
        var L1=left2-left1;
        var T1=top2-top1;
        var left3=vm.VLdatas.left2o;
        var top3=vm.VLdatas.top2o;
        vm.validationView(0,-(left3+L1)*20);
        vm.validationView(1,-(top3+T1)*20);
    });
    $(document).one('mouseup',function(event) {
        $(document).off('mousemove');
    });
}
fns.prototype.viewmobile=function (TH,ev) {
    var target = $(ev.target);
    if(target.closest(".modelView").length==1||target.closest(".labelBox").length==1){
        return ;
    }
    ev.stopPropagation();
    ev.preventDefault();
 
    TH.VLdatas.left4=ev.clientX;
    TH.VLdatas.top4=ev.clientY;
    TH.VLdatas.left4o=TH.VLdatas.left1;
    TH.VLdatas.top4o=TH.VLdatas.top1;
    $(document).on('mousemove',function(event){
        var L1=event.clientX-vm.VLdatas.left4;
        var T1=event.clientY-vm.VLdatas.top4;
        var newl=vm.VLdatas.left4o+L1;
        var newt=vm.VLdatas.top4o+T1;
        var scale=vm.VLdatas.scale;
        vm.validationView(0,newl/scale);
        vm.validationView(1,newt/scale);
    });
    $(document).one('mouseup',function(event) {
        $(document).off('mousemove');

    });
}
fns.prototype.validationView=function (TH,type,datas) {
    var scale1=TH.VLdatas.scale;
    var w1=$('body').width()/scale1;
    var h1=($('body').height()-40)/scale1;
    if(type==0){//左 右
        if(datas>0){
            TH.VLdatas.left1=0;
            TH.VLdatas.left2=0;
            layer.msg('已到最左端');
        }else if(w1-datas>4000){
            TH.VLdatas.left1=(w1-4000)*scale1;
            TH.VLdatas.left2=-(w1-4000)*0.0625;
            layer.msg('已到最右端');
        }else{
            TH.VLdatas.left1=(datas)*scale1;
            TH.VLdatas.left2=-(datas)*0.0625;
        }
        return ;
    }else if(type==1){//上  下
        if(datas>0){
            TH.VLdatas.top1=0;
            TH.VLdatas.top2=0;
            layer.msg('已到最上端');
        }else if(h1-datas>4000){
            TH.VLdatas.top1=(h1-4000)*scale1;
            TH.VLdatas.top2=-(h1-4000)*0.0625;
            layer.msg('已到最下端');
        }else{
            TH.VLdatas.top1=(datas)*scale1;
            TH.VLdatas.top2=-(datas)*0.0625;
        }
        return ;
    }
}
fns.prototype.refreshViewBtnWH=function (TH,type,datas) {
    var scale=TH.VLdatas.scale;
    var width1=$('body').width();
    var height1=$('body').height()-40;
    var neww1=4000*scale;
    var newh1=4000*scale;
    TH.VLdatas.width=(width1/neww1)*250;
    TH.VLdatas.height=(height1/newh1)*250;
    TH.validationView(0,TH.VLdatas.left1/scale);
    TH.validationView(1,TH.VLdatas.top1/scale);
}
//0.3----视图工具栏 ---- 设置配置下
fns.prototype.asideSetupSelect=function (TH,index1) {
    var a1=TH.VLsetUpDatas[index1].value;
    //  上传只对  已经配置完成的模块操作
    //  启动停止  只对 上传的模块操作
    if(a1==0){//连线
        //赋值
        TH.VLsetUpData.index1=index1;
        TH.VLsetUpData.isva=true;
        var arrs1=TH.VLsetUpDatas[index1];
    }else if(a1==1){//启动
        TH.loading('全部模块启动中，请稍等 ...');
        de.layerCMDType=3;
        bction.layerCMD();
        return ;
    }else if(a1==2){//停止
        TH.loading('全部模块停止中，请稍等 ...');
        de.layerCMDType=5;
        bction.layerCMD();
        return ;
    }else if(a1==3){//上传
        TH.UploadFn_1(1);//执行全部上传---打开弹框- 1全部上传
        return ;
    }
    TH.kafkaInitForm = 12;
    $('#setUpLineBoxs').removeClass('hide');
    TH.layerIndex=layer.open({
        type:1,
        title:arrs1.name,
        content:$('#setUpLineBoxs'),
        area:['400px','80%'],
        success:function(layero){
            var a=$(layero);
            a.find('.layui-layer-content').css('height',a.height()-42+'px')
        },
        end:function(){
            $('#setUpLineBoxs').addClass('hide');
            //    重置
            var a1=vm.VLsetUpData.index1;
            var a2=vm.VLsetUpDatas[a1].value;
            if(a2==0){//连线的销毁
                //    销毁验证
                $('#setUpLineForm').data('bootstrapValidator').resetForm(true);
                $('#setUpLineForm').data('bootstrapValidator').destroy();
            }
            vm.VLsetUpData.index1=-1;
        },
        resizing: function(layero){
            var a=$(layero);
            a.find('.layui-layer-content').css('height',a.height()-42+'px')
        }
    })
}
fns.prototype.addSetUpLine=function (TH) {
    TH.loading('保存中，请稍等 ...');
    $('#setUpLineForm').data('bootstrapValidator').validate();
    if(!$('#setUpLineForm').data('bootstrapValidator').isValid()){
        layer.msg('填写有误',{icon:2,time:900});
        return ;
    }
    vm.cancel();//关闭窗口
    //保存值
    var a1=vm.VLsetUpLine;
    for(var i in a1){
        a1[i].value[0]=a1[i].value1;
        a1[i].value2?a1[i].value[1]=a1[i].value2:0;
    }
    layer.msg('保存成功',{icon:1,time:900});
    vm.refreshCanvasParams('canvasLine',2,true);
}
fns.prototype.SetUpLineValidation=function (TH) {
    $('#setUpLineForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            lineWidth0: {
                validators: {
                    notEmpty: {
                        message: '连线宽度不能为空'
                    },
                    lessThan: {
                        value: 15,
                        inclusive: true,
                        message: '最大15'
                    },
                    greaterThan: {
                        value: 1,
                        inclusive: true,
                        message: '最小1'
                    }
                }
            },
            lineHover0: {
                validators: {
                    notEmpty: {
                        message: '连线未成线的颜色不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 6,
                        message: '颜色值在6位以内'
                    },
                    regexp: {
                        regexp: /^[a-fA-F0-9]+$/,
                        message: 'a-f 0-9'
                    },
                }
            },
            lineActive0: {
                validators: {
                    notEmpty: {
                        message: '连线即将成线的颜色不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 6,
                        message: '颜色值在6位以内'
                    },
                    regexp: {
                        regexp: /^[a-fA-F0-9]+$/,
                        message: 'a-f 0-9'
                    },
                }
            },
            lineSelect0: {
                validators: {
                    notEmpty: {
                        message: '连线已成线的颜色不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 6,
                        message: '颜色值在6位以内'
                    },
                    regexp: {
                        regexp: /^[a-fA-F0-9]+$/,
                        message: 'a-f 0-9'
                    },
                }
            },
            lineSelect1: {
                validators: {
                    notEmpty: {
                        message: '连线已成线的颜色不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 6,
                        message: '颜色值在6位以内'
                    },
                    regexp: {
                        regexp: /^[a-fA-F0-9]+$/,
                        message: 'a-f 0-9'
                    },
                }
            },
            lineSelectBad0: {
                validators: {
                    notEmpty: {
                        message: '坏线成线的颜色不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 6,
                        message: '颜色值在6位以内'
                    },
                    regexp: {
                        regexp: /^[a-fA-F0-9]+$/,
                        message: 'a-f 0-9'
                    },
                }
            },
            lineDHWidth0: {
                validators: {
                    notEmpty: {
                        message: '连线的间隔不能为空'
                    },
                    regexp: {
                        regexp: /^[0-9]{1,3}[,][0-9]{1,3}$/,
                        message: '格式错误'
                    }
                }
            },
            lineAngle0: {
                validators: {
                    notEmpty: {
                        message: '连线的箭头角度不能为空'
                    },
                    lessThan: {
                        value: 150,
                        inclusive: true,
                        message: '最大150'
                    },
                    greaterThan: {
                        value: 30,
                        inclusive: true,
                        message: '最小30'
                    }
                }
            },
            lineAngleWidth0: {
                validators: {
                    notEmpty: {
                        message: '连线的箭头长度不能为空'
                    },
                    lessThan: {
                        value: 60,
                        inclusive: true,
                        message: '最大60'
                    },
                    greaterThan: {
                        value: 5,
                        inclusive: true,
                        message: '最小5'
                    }
                }
            },
        }
    });
}
//0.4----其他公共的方法
fns.prototype.FormValidation=function (type,a1,formName) {
    //    公共的表单验证
    /**
     * type (参数值) 0普通的正常的
     * @params a1 格式 a1=[{regex:'',paramName:'',viewName:''}]
     *  type (参数值) 1为简单的表单验证 特殊处理
     *  @params a1 格式 a1=[{name:''}]
     * **/
        //    生成表单
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
//1.0----流程之间的拖拽
fns.prototype.dragFlow=function (TH,ev,index) {
    if(TH.LIlineDatas.istrue){
        //当激活连线模式时 拖拽锁定
        ev.preventDefault();
        return;
    }
    var dataArrs=TH.DRdropDatas[index];
    var scale1=TH.VLdatas.scale;
    var left1=TH.VLdatas.left1;
    var top1=TH.VLdatas.top1;
    if(ev.dataTransfer.setDragImage){
        ev.dataTransfer.setDragImage(document.getElementById('dropimg'),(ev.clientX-dataArrs.left*scale1-left1),(ev.clientY-40-dataArrs.top*scale1-top1));
    }
    console.log(ev.clientX)
    TH.DRdragDropDatas.type=1;
    TH.DRdragDropDatas.index3=index;
    TH.DRdragDropDatas.left1=ev.clientX;
    TH.DRdragDropDatas.top1=ev.clientY;
    TH.defaultOff();//每次拖拽  刷新默认关闭
}
fns.prototype.openModule=function (TH,type1) {
  console.log(type1)

    TH.COM1Data.type1=type1;
    let layer_title=['','HTTP流程配置','FTP流程配置','','oracle流程配置'];
    let cont=['','#N_http','#N_ftp','','#N_oracle'];
    let area=['70%','70%'];
    if(type1==3){
        let title_1='KAFKA流程配置';
        vm.kafkaVersionD.selectIndex=0;
        if(vm.DRdragDropDatas.index2!=-1) {//新建
            vm.kafaListData.isinit=true;//新建
            vm.kafkaYStat=0;
            vm.kafkaStep=0;
            vm.kafkaList=[];
            title_1='KAFKA版本选择';
            vm.TLdbIDList=-1;
            vm.kafaListData.isshowTable=true;
        }else{//修改
            let index1_= vm.DRcontextmenuData.index1;
            let data_1 = vm.DRdropDatas[index1_];
            vm.kafkaVersionD.engineID=data_1.engineID;
            vm.kafkaVersionD.moduleID=data_1.moduleID;
            vm.kafaListData.isinit=false;//新建
            vm.kafkaYStat=1;
            vm.kafkaStep=0;
            vm.kafaListData.data=JSON.parse(data_1.kafaListDatadata);
            let z_=JSON.parse(data_1.others);
            vm.KAFremortConfig.forEach(function (item1) {
                item1.value=z_[1+item1.paramName];
            })
            vm.KAFpathConfig.forEach(function (item1) {
                item1.value=z_[2+item1.paramName];
            })
            vm.KAFpathConfigkafka.forEach(function (item1) {
                item1.value=z_[3+item1.paramName];
            })
            vm.kafkaList=[];
            JSON.parse(data_1.kafkaList).forEach(function (item1,index1) {
                vm.kafkaList.push({});
                for(var i in item1){
                    vm.$set(vm.kafkaList[index1],i,item1[i]);
                }
            })
            if(data_1.TLdbIDList){//存在dbid
                vm.TLdbIDList=JSON.parse(data_1.TLdbIDList);
                vm.kafaListData.isshowTable=false;
            }else{//不存在dbid
                vm.TLdbIDList=-1;
                vm.kafaListData.isshowTable=true;
            }
            vm.kafkaInitForm=1;//初始化初始表单
        }
        /*初始化--kafka*/
        //    打开kafka
        vm.layerIndex=layer.open({
            type:1,
            title:title_1,
            content:$('#type_kafka'),
            area:['70%','70%'],
            success:function(layero){
                $('#type_kafka').removeClass('hide');
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
            }, end:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px');
                $('#type_kafka').addClass('hide');
                // 还原
                kafka.kafkaClear();
                vm.kafkaInitForm=0;
                vm.kafkaList=[];
                vm.kafaListData.isinit=true;
                vm.kafaListData.data={};
                vm.kafkaYStat=0;
                vm.kafkaStep=0;
                vm.KAFremortConfig.forEach(function (item) {
                    item.value='';
                })
                vm.KAFpathConfig.forEach(function (item) {
                    item.value='';
                })
                vm.KAFpathConfigkafka.forEach(function (item) {
                    item.value='';
                })
                vm.DRdragDropDatas.index2=-1;


            },resizing:function (layero) {
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                if ($('#type_kafka #kafkaYTable-table').length!=0) {//远程配置----选择已有数据 resizeTable
                    var h=$('.kafka_BOX').height()-80;
                    $('#kafkaYTable-table').bootstrapTable('resetView',{height:h})
                }
                if ($('#type_kafka #dbTableBox').length!=0) {//数据源配置----选择已有数据 resizeTable
                    var h=$('.kafka_BOX').height()-80;
                    $('#type_kafka #dbTableBox').bootstrapTable('resetView',{height:h})
                }
            }
        })
        return;
    }else if(type1==4){
      let title_1='oracle流程配置';
      vm.oracleStep=0;
      if(vm.DRdragDropDatas.index2!=-1) {//新建
        vm.oracleList.forEach(function (item,index) {
          vm.oracleList[index].type=0;
          vm.oracleList[index].list.forEach(function (item2,index2) {
            item2.value=item2.def?item2.def:'';
          })
        })
        vm.oracleList[2].isshowTable=true;
        vm.oracleList[3].type=0;
        // vm.oracleList[3].isshowTable=true;
        vm.oracleD.moduleID=++vm.moduleID;
      }else{//修改
        // vm.oracleList[2].isshowTable=false;
        // // vm.oracleList[3].isshowTable=false;
        //
        // vm.oracleList[3].type=1;
        let index1_= vm.DRcontextmenuData.index1;
        let data_1 = vm.DRdropDatas[index1_];
        console.log(JSON.parse(data_1.oracleList))
        vm.oracleList=JSON.parse(data_1.oracleList);
        vm.oracleStep=0;
        vm.oracleD.moduleID=data_1.moduleID;


        // vm.kafkaVersionD.engineID=data_1.engineID;
        // vm.kafkaVersionD.moduleID=data_1.moduleID;
        // vm.kafaListData.isinit=false;//新建
        // vm.kafkaYStat=1;
        // vm.kafkaStep=0;
        // vm.kafaListData.data=JSON.parse(data_1.kafaListDatadata);
        // let z_=JSON.parse(data_1.others);
        // vm.KAFremortConfig.forEach(function (item1) {
        //   item1.value=z_[1+item1.paramName];
        // })
        // vm.KAFpathConfig.forEach(function (item1) {
        //   item1.value=z_[2+item1.paramName];
        // })
        // vm.KAFpathConfigkafka.forEach(function (item1) {
        //   item1.value=z_[3+item1.paramName];
        // })
        // vm.kafkaList=[];
        // JSON.parse(data_1.kafkaList).forEach(function (item1,index1) {
        //   vm.kafkaList.push({});
        //   for(var i in item1){
        //     vm.$set(vm.kafkaList[index1],i,item1[i]);
        //   }
        // })
        // if(data_1.TLdbIDList){//存在dbid
        //   vm.TLdbIDList=JSON.parse(data_1.TLdbIDList);
        //   vm.kafaListData.isshowTable=false;
        // }else{//不存在dbid
        //   vm.TLdbIDList=-1;
        //   vm.kafaListData.isshowTable=true;
        // }
        // vm.kafkaInitForm=1;//初始化初始表单
      }
      /*初始化--kafka*/
      //    打开kafka
      vm.layerIndex=layer.open({
        type:1,
        title:title_1,
        content:$('#type_oracle'),
        area:['70%','70%'],
        success:function(layero){
          $('#type_oracle').removeClass('hide');
          var a=$(layero);
          a.find('.layui-layer-content').css('height',a.height()-42+'px')
        }, end:function(layero){
          var a=$(layero);
          a.find('.layui-layer-content').css('height',a.height()-42+'px');
          $('#type_oracle').addClass('hide');
          // 还原
          kafka.kafkaClear();
          vm.kafkaInitForm=0;
          vm.kafkaList=[];
          vm.kafaListData.isinit=true;
          vm.kafaListData.data={};
          vm.kafkaYStat=0;
          vm.kafkaStep=0;
          vm.KAFremortConfig.forEach(function (item) {
            item.value='';
          })
          vm.KAFpathConfig.forEach(function (item) {
            item.value='';
          })
          vm.KAFpathConfigkafka.forEach(function (item) {
            item.value='';
          })
          vm.DRdragDropDatas.index2=-1;


        },resizing:function (layero) {
          var a=$(layero);
          a.find('.layui-layer-content').css('height',a.height()-42+'px')
          if ($('#type_oracle #oracleYTable-table-1').length!=0) {//远程配置----选择已有数据 resizeTable
            var h=$('.oracle_BOX').height()-80;
            $('#oracleYTable-table-1').bootstrapTable('resetView',{height:h})
          }
          if ($('#type_oracle #dbTableBox').length!=0) {//数据源配置----选择已有数据 resizeTable///选择表名称
            var h=$('.oracle_BOX').height()-80;
            $('#type_oracle #dbTableBox').bootstrapTable('resetView',{height:h})
          }
        }
      })
      return;
    }
    if(TH.DRdragDropDatas.index2!=-1) {//新建

        if(type1==1){//http--配置
            TH.clearText();
            TH.COM1Data.step1=1;
            TH.COM1Data.steps=4;
            /*重置信息*/
            TH.N_HTTP_1={
                urlType:'POST',
                    urlPath:"http://mobile.weather.com.cn/data/forecast/101010600.html",
                    params:[
                    {value:'',name:''},
                ],
            };
            TH.COM1getD={
                remotePath:'',//远程目录
                // osName:'',//
                fileType:'txt',//要返回的类型
                codedFormat:'UTF-8',//编码格式
                suffix:'txt',
                fileFormat:'asc',//文件格式 默认ASCII编码
                fileFormat1:'',//文件格式 ASCII编码--的值
                fileFormat2:[{value:''}],//文件格式 十六进制编码--的值
                isColName:true,
            }
            TH.COM1COLD={
                    module:[],
                    list:[],//左侧数据
                    select:[],//右侧数据
                    moduleSelect:[],//选中后 整合后的模板
                    moduleSelectJson:'',//修改后的json模板
                    // show:[],//下侧数据
                    txt:'cjson',//send--格式
                    fileFormat:'asc',//文件格式 默认ASCII编码
                    fileFormat1:'',//文件格式 ASCII编码--的值
                    fileFormat2:[{value:''}],//文件格式 十六进制编码--的值
            }
            TH.COM1ShowD= {
                key: '',
                value: '',
                time_Type: 'r'
            };
            TH.NDaLIST1={
                one:'one',
                two:'day',
                three:[true,true,true],
                oneD:'day',//选中的值
                twoD:'intervalday',//选中的值
                threeD:['loop',0,0,0],//选中的值//无值时 赋值为-1
                CronExpress:'',
                isrefresh:false
            }

            //    重置当前值得情况
        }else if(type1==2){//ftp--配置
            TH.clearText();
            TH.COM1Data.step1=1;
            TH.COM1Data.steps=5;
            /*重置信息*/
            TH.N_FTP_1={
                list:[
                    {viewName: 'ip', value: '',uparamName:'ip', paramName: 'hostIp', title: '请输入ip地址'},
                    {viewName: '端口', value: '',uparamName:'port', paramName: 'hostPort', title: '请输入端口'},
                    {viewName: '用户名', value: '',uparamName:'userName', paramName: 'userName', title: '请输入用户名'},
                    {viewName: '密码', value: '',uparamName:'passWord', paramName: 'passWord', title: '请输入密码'},
                    {viewName: '连接方式', value: 'ftp',uparamName:'linkMode', paramName: 'linkMode', title: '请输入密码',type:'select',selectList:[
                      {name:'ftp',value:'ftp'},
                      {name:'ssh',value:'ssh'},
                    ]},
                    {viewName: '主机类型', value: 'linux',show:true,uparamName:'osName', paramName: 'osName', title: '请输入密码',type:'select',selectList:[
                      {name:'linux',value:'linux'},
                      {name:'windows',value:'windows'},
                    ],
                    },//存在
                  ],//远程配置
                stat:0,//定义远程配置状态（0 双按钮页面 1新建页面 书写页面 2 选择已有页面）
                isinit:true,//定义 打开的kafka是否是新建
                data:{},//存储一些关于kafka临时的数据
                isUpdate:true,//弥补 自动表单 select 不重置问题
                detailData:{},//定义当前kafka详细配置的信息
                //    db数据源
                isshowTable: true,//定义 是否展示 当前数据源 table
            };
            TH.COM1getD={
                typePath:true,//远程目录 类型 true 按目录   false按文件
                remotePath:'',//远程目录
                signType:'',//标记当前匹配的规则 是否有zip类型
                signFile:'',//存储 文件时的状态
                selectFile:'',//远程文件----选中文件
                ignoreFile:'',//远程文件----忽略文件
                osName:'',
                fileType:'txt',//要返回的类型
                codedFormat:'UTF-8',//编码格式
                suffix:'txt',
                fileFormat:'asc',//文件格式 默认ASCII编码
                fileFormat1:'',//文件格式 ASCII编码--的值
                fileFormat2:[{value:''}],//文件格式 十六进制编码--的值
                isColName:true,
            }
            TH.COM1COLD={
                    module:[],
                    list:[],//左侧数据
                    select:[],//右侧数据
                    moduleSelect:[],//选中后 整合后的模板
                    moduleSelectJson:'',//修改后的json模板
                    // show:[],//下侧数据
                    txt:'cjson',//send--格式
                    fileFormat:'asc',//文件格式 默认ASCII编码
                    fileFormat1:'',//文件格式 ASCII编码--的值
                    fileFormat2:[{value:''}],//文件格式 十六进制编码--的值
            }
            TH.COM1ShowD= {
                key: '',
                value: '',
                time_Type: 'r'
            };
            TH.NDaLIST1={
                one:'one',
                two:'day',
                three:[true,true,true],
                oneD:'day',//选中的值
                twoD:'intervalday',//选中的值
                threeD:['loop',0,0,0],//选中的值//无值时 赋值为-1
                CronExpress:'',
                isrefresh:false
            }
        }else if(type1==3){//kafka--配置

        }
    }else {//修改
        if(type1==1){//http--配置///
            TH.COM1Data.step1=1;
            TH.COM1Data.steps=4;
            /*重置信息*/
            let index1_=vm.DRcontextmenuData.index1;
            let data=vm.DRdropDatas[index1_];
            TH.N_HTTP_1=JSON.parse(data.step1);
            TH.COM1getD=JSON.parse(data.step2);
            TH.COM1COLD= JSON.parse(data.step3);
            TH.COM1ShowD= JSON.parse(data.step4);
            TH.NDaLIST1=JSON.parse(data.step5);
            //    重置当前值得情况
        }else if(type1==2){///ftp--配置
            TH.COM1Data.step1=1;
            TH.COM1Data.steps=5;
            /*重置信息*/
            let index1_=vm.DRcontextmenuData.index1;
            let data=vm.DRdropDatas[index1_];
            TH.N_FTP_1=JSON.parse(data.step1);
            TH.N_FTP_1.list.forEach(function (item,index) {
              if(item.paramName=='osName'){
                TH.N_FTP_1.list[index].show=false;
              }
            })
            TH.COM1getD=JSON.parse(data.step2);
            TH.COM1COLD= JSON.parse(data.step3);
            TH.COM1ShowD= JSON.parse(data.step4);
            TH.NDaLIST1=JSON.parse(data.step5);
            //    init step---表单
            TH.kafkaInitForm = 10;
        }else if(type1==3){//kafka--配置

        }
    }



    TH.layerIndex=layer.open({
        type:1,
        title:layer_title[type1],
        content:$(cont[type1]),
        area:area,
        success:function(layero){
            console.log(layero)
            var a=$(layero);
            a.css({position:'absolute'})
            a.find('.layui-layer-content').css({'height':a.height()-42+'px'})
            $(cont[type1]).removeClass('hide');
        }, end:function(layero){
            var a=$(layero);
            a.find('.layui-layer-content').css('height',a.height()-42+'px')
            $(cont[type1]).addClass('hide');
            //重置
            vm.DRdragDropDatas.index2=-1;
            if(type1!=3){
                vm.clearText();
            }
        }
    })


    return;

    TH.openModuleType=type1;
    layer_title=['','HTTP流程配置','FTP流程配置'];
    if(type1==1){//HTTP配置

        if(type1==1){//http
            /*1--http*/
            if(vm.DRdragDropDatas.index2!=-1){//新建
                vm.urlType='POST';
                vm.urlPath="http://mobile.weather.com.cn/data/forecast/101010600.html";
                vm.parameter_data=[];
                vm.typeinfoData='text';
                vm.time_Type='实时定时器';
                vm.addInputbox_http();
            }else {//修改
                let index1_ = vm.DRcontextmenuData.index1;
                let step_1 = vm.DRdropDatas[index1_].step1;
                let step_2 = vm.DRdropDatas[index1_].step2;
                let step_3 = vm.DRdropDatas[index1_].step3;
                vm.urlType=step_1.urlType;
                vm.urlPath=step_1.urlPath;
                vm.parameter_data=step_1.urlPar;
                vm.typeinfoData=step_2.jsontype;
                vm.time_Type=step_3.step3Type;
            }
        }
        TH.layerIndex=layer.open({
            type:1,
            title:layer_title[type1],
            content:$('#type_http'),
            area:['90%','90%'],
            success:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                $('#type_http').removeClass('hide');
            }, end:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                $('#type_http').addClass('hide');
                /*重置*/
                $('#time_http #time_Real').prop('checked',true);
                $(".HTTP_part2,.HTTP_part3,.HTTP_part4").hide();
                $(".HTTP_part1").show();
                $('.step_http>li').removeClass("active");
                $('.step_http>li').eq(0).addClass("active");
                /*2*/
                // $('#type_http .format_text_1').prop('checked',true);
                vm.DRdragDropDatas.index2=-1;
            }, resizing: function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
            }
        })
    }else if(type1==2){//ftp
        /*1//ftp*/
        if(vm.DRdragDropDatas.index2!=-1) {//新建
            vm.kafaListData_ftp.isinit=true;//新建
            vm.kafkaYStat_ftp=0;
            vm.kafkaStep_ftp=0;
            vm.kafaListData_ftp.isshowTable=true;
            vm.remotePath='';
            vm.osName='';
            vm.fileFormat='asc';
            vm.fileFormat1='';
            vm.fileFormat2=[{value:''}];
            vm.isColName=true;
        }else{//修改
            let index1_ = vm.DRcontextmenuData.index1;
            vm.kafaListData_ftp.isinit=false;//新建
            vm.kafkaYStat_ftp=1;
            vm.kafkaStep_ftp=0;
            vm.kafaListData_ftp.isshowTable=false;
            let step_1 = vm.DRdropDatas[index1_].step1;
            let step_2 = JSON.parse(vm.DRdropDatas[index1_].step2);
            let step_3 = vm.DRdropDatas[index1_].step3;
            let step_4 = vm.DRdropDatas[index1_].step4;
            let step_5 = vm.DRdropDatas[index1_].step5;
            vm.KAFremortConfig_ftp.forEach(function (item1) {
                item1.value=step_1[item1.paramName];
            })
            vm.kafkaInitForm=7;
            //    2步
            vm.remotePath=step_2.remotePath;
            vm.osName=step_2.osName?step_2.osName:'';

            vm.fileType=step_2.fileType;
            vm.fileFormat=step_2.fileFormat;
            vm.fileFormat1=step_2.fileFormat1;
            vm.fileFormat2=step_2.fileFormat2;
            vm.isColName=step_2.isColName;
            //4
            vm.time_Type=step_4.step3Type;
            //    3--步
            let st_3_t=JSON.parse(step_3.txtd)
            vm.txtTxt=st_3_t.txtTxt;
            vm.txtTxtAsc=st_3_t.txtTxtAsc;
        }
        //init--form
        TH.layerIndex=layer.open({
            type:1,
            title:layer_title[type1],
            content:$('#type_ftp'),
            area:['90%','90%'],
            success:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                $('#type_ftp').removeClass('hide');
            }, end:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                $('#type_ftp').addClass('hide');
                /*重置*/
                $('#time_http #time_Real').prop('checked',true);

                $(".HTTP_part2,.HTTP_part3,.HTTP_part4,.HTTP_part5").hide();
                $(".HTTP_part1").show();
                $('.step_http>li').removeClass("active");
                $('.step_http>li').eq(0).addClass("active");
                $('#FTP_form').bootstrapValidator('destroy');
                /*2*/
                // $('#type_http .format_text_1').prop('checked',true);
                vm.DRdragDropDatas.index2=-1;
            }, resizing: function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
            }
        })
    }else if(type1==3){//kafka配置
        let title_1='KAFKA流程配置';
        vm.kafkaVersionD.selectIndex=0;
        if(vm.DRdragDropDatas.index2!=-1) {//新建
            vm.kafaListData.isinit=true;//新建
            vm.kafkaYStat=0;
            vm.kafkaStep=0;
            vm.kafkaList=[];
            title_1='KAFKA版本选择';
            vm.TLdbIDList=-1;
            vm.kafaListData.isshowTable=true;
        }else{//修改
            let index1_= vm.DRcontextmenuData.index1;
            let data_1 = vm.DRdropDatas[index1_];
            vm.kafkaVersionD.engineID=data_1.engineID;
            vm.kafkaVersionD.moduleID=data_1.moduleID;
            vm.kafaListData.isinit=false;//新建
            vm.kafkaYStat=1;
            vm.kafkaStep=0;
            vm.kafaListData.data=JSON.parse(data_1.kafaListDatadata);
            let z_=JSON.parse(data_1.others);
            vm.KAFremortConfig.forEach(function (item1) {
                item1.value=z_[1+item1.paramName];
            })
            vm.KAFpathConfig.forEach(function (item1) {
                item1.value=z_[2+item1.paramName];
            })
            vm.KAFpathConfigkafka.forEach(function (item1) {
                item1.value=z_[3+item1.paramName];
            })
            vm.kafkaList=[];
            JSON.parse(data_1.kafkaList).forEach(function (item1,index1) {
                vm.kafkaList.push({});
                for(var i in item1){
                    vm.$set(vm.kafkaList[index1],i,item1[i]);
                }
            })
            if(data_1.TLdbIDList){//存在dbid
                vm.TLdbIDList=JSON.parse(data_1.TLdbIDList);
                vm.kafaListData.isshowTable=false;
            }else{//不存在dbid
                vm.TLdbIDList=-1;
                vm.kafaListData.isshowTable=true;
            }
            vm.kafkaInitForm=1;//初始化初始表单
        }
        /*初始化--kafka*/
        //    打开kafka
        vm.layerIndex=layer.open({
            type:1,
            title:title_1,
            content:$('#type_kafka'),
            area:['90%','90%'],
            success:function(layero){
                $('#type_kafka').removeClass('hide');
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
            }, end:function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px');
                $('#type_kafka').addClass('hide');
                // 还原
                kafka.kafkaClear();
                vm.kafkaInitForm=0;
                vm.kafkaList=[];
                vm.kafaListData.isinit=true;
                vm.kafaListData.data={};
                vm.kafkaYStat=0;
                vm.kafkaStep=0;
                vm.KAFremortConfig.forEach(function (item) {
                    item.value='';
                })
                vm.KAFpathConfig.forEach(function (item) {
                    item.value='';
                })
                vm.KAFpathConfigkafka.forEach(function (item) {
                    item.value='';
                })
                vm.DRdragDropDatas.index2=-1;


            },resizing:function (layero) {
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
                if ($('#type_kafka #kafkaYTable-table').length!=0) {//远程配置----选择已有数据 resizeTable
                    var h=$('.kafka_BOX').height()-80;
                    $('#kafkaYTable-table').bootstrapTable('resetView',{height:h})
                }
                if ($('#type_kafka #dbTableBox').length!=0) {//数据源配置----选择已有数据 resizeTable
                    var h=$('.kafka_BOX').height()-80;
                    $('#type_kafka #dbTableBox').bootstrapTable('resetView',{height:h})
                }
            }
        })
        return;




    }
}
fns.prototype.drop=function (TH,ev) {
    var scale1=TH.VLdatas.scale;
    var vlleft1=TH.VLdatas.left1;
    var vltop1=TH.VLdatas.top1;
    TH.DRdragDropDatas.left=(ev.clientX-vlleft1)/scale1;
    TH.DRdragDropDatas.top=(ev.clientY-40-vltop1)/scale1;
    var type2=TH.DRdragDropDatas.type;//取得当前拖拽类型
    if(type2==0){//header---视图
        var type1=TH.HserverType[TH.DRdragDropDatas.index2].type;//取得当前类型
        de.openModule(TH,type1);
    }else if(type2==1){//视图---视图
        var index3=TH.DRdragDropDatas.index3;
        var dataArrs=TH.DRdropDatas[index3];
        var left1=TH.DRdragDropDatas.left1;
        var top1=TH.DRdragDropDatas.top1;
        var left2=ev.clientX;
        var top2=ev.clientY;
        var left3=parseFloat(dataArrs.left+(left2-left1)/scale1);
        var top3=parseFloat(dataArrs.top+(top2-top1)/scale1);
        TH.DRdropDatas[index3].left=left3>0?left3:0;
        TH.DRdropDatas[index3].top=top3>0?top3:0;
        TH.mouseenterModel(index3);//更新 鼠标划入  连线按钮位置
        TH.refreshCanvasParams('canvasLine',2,true);//刷新连线
        //重置 鼠标连线按钮，导航位置
        TH.LIlineDatas.left1=-500;
        TH.LIlineDatas.top1=-500
        TH.prossDatas.left=-500;//导航模块
        TH.prossDatas.top=-500;// 导航模块;
    }
    //重置
    TH.DRdragDropDatas.type=-1;
}
//2.0----header   事件
fns.prototype.saveProcess=function (TH,index1) {
    var type1=TH.HstartingAreaDataClick[index1].type;
    if(type1==0){//保存流程
        vm.issavepross=false;
        //重置值
        var f1=vm.saveProcessName;
        for(var i in f1){
            f1[i].value='';
        }

        $('#saveConfimName').removeClass('hide');
        var a1=vm.importProcessData.index1;
        vm.saveProcessName[0].value=vm.importProcessData.flowName;
        vm.saveProcessName[1].value=vm.importProcessData.flowDescribe;

        de.FormValidation(0,TH.saveProcessName,'#SCNform');//表单验证
        TH.layerIndex2=layer.open({
            type:1,
            content:$('#saveConfimName'),
            title:'保存流程的名称信息',
            area:['400px','150px'],
            success:function (layero) {
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px');
            },
            end:function () {
                $('#saveConfimName').addClass('hide');
                $('#SCNform').data('bootstrapValidator').resetForm(false);
            },
            resizing: function(layero){
                var a=$(layero);
                a.find('.layui-layer-content').css('height',a.height()-42+'px')
            }
        })
    }else if(type1==1){//导入已有流程
        vm.loading('打开中 ...');
        $.ajax({
            type: 'post',
            dataType:'json',
            data:{tokenID:parent.tokenID,limit:1000000000,offset:0},
            url: vm.basePath + 'serviceByDynamicFlow/getAllSaveModuleEngineFlowDescInfo.do',
            success: function (data) {
                if(!verificationInstruction(data)){
                    return false;
                };
                data=data.dataInfo.rows;

                vm.closeLoading();
                //赋值
                var a1=vm.importProcessDatas=[];
                for(var i in data){
                    a1.push({});
                    vm.$set(a1[a1.length-1],'flowName',data[i].flowName);
                    vm.$set(a1[a1.length-1],'flowDescribe',data[i].flowDescribe);
                    vm.$set(a1[a1.length-1],'createTime',data[i].createTime);
                    vm.$set(a1[a1.length-1],'flowId',data[i].flowId);
                }
                $('#importProcess').removeClass('hide');
                TH.layerIndex1=layer.open({
                    type:1,
                    title:'请选择要导入的流程',
                    content:$('#importProcess'),
                    area:['500px','80%'],
                    success:function (layero) {
                        var a=$(layero);
                        a.find('.layui-layer-content').css('height',a.height()-42+'px');
                    },
                    end:function(){
                        $('#importProcess').addClass('hide');
                    },
                    resizing: function(layero){
                        var a=$(layero);
                        a.find('.layui-layer-content').css('height',a.height()-42+'px')
                    }
                })
            },
            error:function () {
                layer.msg('打开错误');
            }
        });
    }else if(type1==2){//退出
        layer.confirm('是否退出安装部署',{btn:['退出','退出并保存','取消'],icon:3},function (index) {
            layer.close(index);
            parent.closedrag();
        },function (index) {
            //退出并保存
            layer.close(index);
            de.saveProcess(vm,0);
            vm.issavepross=true;
        },function (index) {
            layer.close(index);
        });

    }else if(type1==3) {//设置内的   全部启动  全部上传  全部停止
        de.asideSetupSelect(vm,index1-1);
    }
}
fns.prototype.addSCN=function (TH,type) {
    if(type!=2){//当 type不等于2 时 验证保存流程验证
        $('#SCNform').data('bootstrapValidator').validate();
        if(!$('#SCNform').data('bootstrapValidator').isValid()){
            layer.msg('数据不正确',{icon:2,time:900});
            return false;
        }
    }
    //检索当前 模块是否符合 上传要求
    var a1=TH.DRdropDatas;
    var a3=TH.LIlineDatasArrs;
    var a11=TH.serverNames;
    if(0){
        var istrue=false;
        if(a1.length==0){
            layer.msg('请选择模块');
            return ;
        }
        if(istrue){
            layer.msg('serverName不能为空');
            return ;
        }
        for(var i=0;i<a1.length;i++){
            if(a1[i].Upload==0){
                istrue=true;
            }
        }
        if(istrue){
            layer.msg('vagentd与yloader必须全部上传');
            return ;
        }
        var f1=[];//存储所有上传的索引
        var f2=a3.join(',');//存储所有连线的索引
        for(var i=0;i<a1.length;i++){
            if(a1[i].Upload==1){//上传
                f1.push(i);
            }
        }
        for(var i=0;i<f1.length;i++){
            if(f2.indexOf(f1[i])==-1){
                istrue=true;
            }
        }
        if(istrue){
            layer.msg('上传的vagentd与yloader必须连线');
            return ;
        }
    }

    if(type!=2){
        TH.loading('保存当前流程');
    }
    //保存值
    var a4=[];
    for(var i in a3){
        a4.push({
            startId:a1[a3[i][0]].id,
            endId:a1[a3[i][1]].id,
            startOrderId:a3[i][0],
            endOrderId:a3[i][1],
            startModuleId:a1[a3[i][0]].moduleID,
            endModuleId:a1[a3[i][1]].moduleID,
        });
        if(a11[i].isshow){//ds---dt
            a4[a4.length-1]['serverName']=a11[i].name;
        }

    }
    var t1=TH.saveProcessName[0].value;
    if(type==2){//当为自动保存
        var t2=vm.importProcessData.flowName;
        var t3=vm.importProcessData.flowDescribe;
    }else{
        var t2=TH.saveProcessName[0].value;
        var t3=TH.saveProcessName[1].value;
    }
    if(!parent.userID){
        top.location.href = "../../login.html";
    }
    var a5={
        "flowId":TH.flowID+'',
        "flowName":t2,
        "flowDescribe":t3,
        "modelDatas":JSON.stringify(a1),
        "modelLines":JSON.stringify(a4),
        tokenID:parent.tokenID,
        userID:parent.userID
    };
    $.ajax({
        type: 'post',
        data:a5,
        url: vm.basePath + 'serviceByDynamicFlow/saveModuleEngineFlowInfo.do',
        success: function (data) {
            if(!verificationInstruction(data)){
                return false;
            };
            data=data.dataInfo;
            if(type!=2){
                if(data.flag=='true'){
                    layer.msg('保存成功',{icon:1,time:1200},function(){
                        vm.cancelModel2();
                        if(vm.issavepross){//保存成功 并退出
                            parent.closedrag();
                        }else{//保存成功，赋值给 当前 保存所需值
                            var t1=vm.saveProcessName[0].value;
                            if(t1!=''){
                                vm.importProcessData.flowName=t1;
                                vm.importProcessData.flowDescribe=vm.saveProcessName[1].value;
                            }
                        }
                    });
                }else{
                    layer.msg('保存失败',{icon:2,time:1200});
                }
            }
        }
    });
}
fns.prototype.selectProcess=function (TH,index1) {
    TH.importProcessData.index1=index1;
    layer.confirm('是否打开 <label class="layerMsgC">['+TH.importProcessDatas[index1].flowName+']</label> 此流程',{icon:3},function (index2) {
        vm.cancelModel1();
        layer.close(index2);
        var index1=vm.importProcessData.index1;//导入值 index 只有新建流程后才会清空
        var name=vm.importProcessDatas[index1].flowName;
        var iddata=vm.importProcessDatas[index1].flowId;
        vm.loading('正在打开名为 <label class="layerMsgC">['+name+']</label> 的流程');
        //   取值 赋值
        de.openSelectProcess(vm,{flowID:iddata});
    },function (index2) {
        layer.close(index2);
    })
}
fns.prototype.openSelectProcess=function (TH,data) {
    data["tokenID"]=parent.tokenID;
    $.ajax({
        type: 'post',
        dataType: 'json',
        data:data,
        url: vm.basePath + 'serviceByDynamicFlow/getSaveModuleEngineFlowDescInfo.do',
        success: function (data) {
            if(!verificationInstruction(data)){
                return false;
            };
            data=data.dataInfo;

            var a1=vm.DRdropDatas=[];
            var a2=vm.LIlineDatasArrs=[];
            var f1=vm.serverNames=[];
            var a4=JSON.parse(data.modelDatas);
            var a5=JSON.parse(data.modelLines);
            vm.DRdragDropDatas.index4=-1;//去掉选中  index
            //赋值
            vm.importProcessData.flowName=data.flowName;
            vm.importProcessData.flowDescribe=data.flowDescribe;
            vm.importProcessData.createTime=data.createTime;
            vm.moduleID=a4[a4.length-1].moduleID;
            vm.flowID=data.flowId;
            for(var i in a4){
                a1.push({});
                for(var j in a4[i]){
                    vm.$set(a1[a1.length-1],j,a4[i][j])
                }
            }
            for(var i in a5){
                a2.push([
                    a5[i].startOrderId,
                    a5[i].endOrderId,
                ]);
                var isshow=false;
                var arrqw12=bction.mod_show_service;
                // var adf1=getModelType(a4[a5[i].startOrderId].engineTypeCode);
                // var adf2=getModelType(a4[a5[i].endOrderId].engineTypeCode);
                if(arrqw12.indexOf(adf1)!=-1&&arrqw12.indexOf(adf2)!=-1){//给定当前 源端 ，目标端  加servername
                    isshow=true;
                }
                f1.push({
                    name:a5[i].serverName,
                    left:-500,
                    top:-500,
                    isshow:isshow
                })
            }
            layer.msg('打开成功',{icon:1});
        }
    });
}
fns.prototype.addModel=function (TH) {
    var datas=TH.DRdropDatas[TH.DRdropDatas.length-1];
    TH.$set(datas,'left', TH.DRdragDropDatas.left);
    TH.$set(datas,'top', TH.DRdragDropDatas.top);
    TH.$set(datas,'imgName',TH.HserverType[TH.DRdragDropDatas.index2].imgName);
    TH.$set(datas,'isStart',false);//关于是否启动true启动 /// false停止(默认)
    TH.$set(datas,'Upload',0);//关于是否上传  0 未上传  1上传
    TH.$set(datas,'ip','');
    TH.$set(datas,'hostName','');
    TH.$set(datas,'userName','');
    TH.$set(datas,'port','');
    TH.$set(datas,'passWord','');
    TH.$set(datas,'path','');
    TH.$set(datas,'ItemCon',[]);//存储  配置项中的值
    TH.$set(datas,'isinit',true);//存储  当前模块是否是新建  （当保存配置后  isinit为false）
    TH.$set(datas,'moduleID',++(vm.moduleID));//存储 当前模块的 moduleID
    TH.$set(datas,'dbIDList',-1);//存储 当前模块的 dbid  (-1为新建数据源) (有值时  为对象)
    TH.$set(datas,'detailsConfigData',[]);//存储 右键详细配置的二级菜单
    var indexdata=TH.DRdragDropDatas.index1;//所选择的的版本信息
    var dataarrs=TH.DRdragBeforeLayerDatas[indexdata];
    for(var i in dataarrs){
        TH.$set(datas,i,dataarrs[i]);
    }
    //存储显示项  的内容
    var data1={engineID:dataarrs.id,tokenID:parent.tokenID}
    $.ajax({
        type:'post',
        dataType:'json',
        data:data1,
        url:TH.basePath+'serviceByDynamicFlow/getSystemEngineModuleConfInfo.do',
        success:function (data) {
            if(!verificationInstruction(data)){
                return false;
            };
            data=data.dataInfo;

            var datas=vm.DRdropDatas[vm.DRdropDatas.length-1];
            vm.$set(datas,'conInfo',data);
            data.forEach(function (item1) {
                if(item1.modelView){
                    item1.modleList.forEach(function (item2) {
                        if(item2.pageView==1){
                            datas.ItemCon.push(item2);
                            datas.ItemCon[0].eType=item1.eType;
                            datas.ItemCon[0].value='';
                        }
                    })
                }
            })
            //存储显示项的值
        },
    });
    TH.cancelModel1();//关闭弹框
}
fns.prototype.fliterDatas=function (TH) {
    var arrs3=TH.DRdragBeforeLayerDatas;
    var a1=TH.DRdragBeforeLayerDatas4.select1;
    var a2=TH.DRdragBeforeLayerDatas4.select2;
    var a3=TH.DRdragBeforeLayerDatas4.select3.split(',');
    var isshow=true;
    for(var i in arrs3){
        var b1=arrs3[i].showType1;
        var b2=arrs3[i].showType2.split(',');
        if((b1==a1||a1==-1)&&(b2.indexOf(a2)!=-1||a2==-1)){
            if(!a3[0]&&!a3[1]&&!a3[2]){
                arrs3[i].showType3=true;
                isshow?TH.DRdragDropDatas.index1=i:0;//给筛选过后的内容 赋一个初始值
                isshow=false;
                continue ;
            }
            var refre_data1=arrs3[i].name?arrs3[i].name:'';
            var refre_data2=arrs3[i].version?arrs3[i].version:'';
            var refre_data3=arrs3[i].msg?arrs3[i].msg:'';
            if((refre_data1.indexOf(a3[0])!=-1||!a3[0])&&(refre_data2.indexOf(a3[1])!=-1||!a3[1])&&(refre_data3.indexOf(a3[2])!=-1||!a3[2])){
                arrs3[i].showType3=true;
                isshow?TH.DRdragDropDatas.index1=i:0;//给筛选过后的内容 赋一个初始值
                isshow=false;
            }else{
                arrs3[i].showType3=false;
            }
        }else{
            arrs3[i].showType3=false;
        }
    }
    TH.DRdragBeforeLayerDatas4.vcContentIsshow=isshow;
}
fns.prototype.autoSave=function (TH) {
    //自动保存验证
//    首先验证是否要新建保存流程的名称
    var a1=vm.importProcessData.flowName;
    if(a1==''){//打开保存流程名称
        de.saveProcess(vm,0);
    }else{//修改的保存
        vm.saveProcessName[0].value=vm.importProcessData.flowName;
        vm.saveProcessName[1].value=vm.importProcessData.flowDescribe;
        de.addSCN(vm,2);//type  为2时  修改的自动保存
    }
}
fns.prototype.newSave=function () {
//    保存页面，
//     只有第一次需要打开保存页面


}
//3.0----视图层  事件
//3.1---- -----视图模块内的事件
fns.prototype.openSelectProcessModel=function (TH,index) {
    if(!bction.mod_Verification_show(TH,index)){
        return false;
    }
    TH.DRdragDropDatas.index4=index;
    var menus=TH.DRcontextmenuData;
    // var a1=TH.DRdropDatas[index].engineTypeCode;
    menus.index1=getModelType(a1);//赋值  启用哪个右键
}
fns.prototype.editServerNames=function (TH,index2,type) {//type 0是新建  1是修改
    $('#editServerName').removeClass('hide');
    TH.DRcontextmenuData.index2=index2;
    var arr3=TH.serverNames;
    $('#editSN').val(arr3[index2].name);
    TH.layerIndex1=layer.open({
        type:1,
        title:'请设置当前serviceName信息',
        area:['300px','150px'],
        content:$('#editServerName'),
        success:function (layero) {
            var a=$(layero);
            a.find('.layui-layer-content').css('height',a.height()-42+'px');
        },
        end:function () {
            //保存
            de.autoSave();// 自动保存
            //重置清空
            $('#editSN').val('');
            $('#editServerName').addClass('hide');
            if(vm.serverNames[vm.serverNames.length-1].name==''){
                vm.serverNames.splice(vm.serverNames.length-1,1);
                vm.LIlineDatasArrs.splice(vm.LIlineDatasArrs.length-1,1);
                vm.refreshCanvasParams('canvasLine',2,true);//refreshcanvas
            }
        },
        resizing: function(layero){
            var a=$(layero);
            a.find('.layui-layer-content').css('height',a.height()-42+'px')
        }
    });
}
fns.prototype.saveESN=function (TH) {
    var b1=TH.DRcontextmenuData.index2;
    var a1=$('#editSN').val();
    if(a1==''){
        layer.msg('servername 不能为空',{icon:2,time:1200});
        return;
    }
    if(b1!=-1){//修改的保存  当其值不变时，不去验证
        if(vm.serverNames[b1].name==a1){
            vm.cancelModel1();
            layer.msg('保存成功',{icon:1});
            return;
        }
    }
    //验重 servername
    $.ajax({
        type:'post',
        dataType:'json',
        data:{tokenID:parent.tokenID,serviceName:a1},
        url:TH.basePath+'serviceByDynamicFlow/validateServiceNameInfo.do',
        success:function (data) {
            if(!verificationInstruction(data)){
                return false;
            };
            data=data.dataInfo;
            if(data.length==0){//不存在 重复的servername
                if(b1==-1){//新增的保存
                    vm.serverNames[vm.serverNames.length-1].name=a1; //增加连线标签
                }else{//修改的保存
                    vm.serverNames[b1].name=a1; //修改连线标签
                }
                vm.cancelModel1();
                layer.msg('保存成功',{icon:1});
                //清空
                vm.DRcontextmenuData.index2=-1;
            }else{//存在 重复的servername
                var strs1=[];
                data.forEach(function (item1) {
                    strs1.push('流程名称：[ <span class="color_1_server">'+item1.flowName+'</span> ]<br>serviceName：[ <span class="color_2_server">'+item1.serviceName+'</span> ]');
                })
                layer.confirm('servername重复，请重新填写。'+'<br>重复的位置 ：<br><hr>'+strs1.join('<hr>'), {icon: 0, title:'提示',btn:['关闭']}, function(index){
                    layer.close(index);
                });
            }
            //加载配置版本项
        },
    });
}
fns.prototype.ServerNamesCon=function (TH,ev,index2) {
    ev.preventDefault();
    TH.DRcontextmenuData.istrue=false;//注销右键（模块）
    TH.DRcontextmenuData.istrue1=true;//激活右键(server)
    TH.DRcontextmenuData.index2=index2;//选中右键的模块  赋值  server name
    var menus=TH.DRcontextmenuData;
    var width1=$('body').width();
    var height1=$('body').height();
    menus.height=TH.DRcontextmenuDatas1[0].child.length*34+40;
    var left2=ev.clientX;
    var top2=ev.clientY-menus.height/2;
    if(left2+200>width1){
        left2=left2-200;
    }
    if(top2+menus.height>height1-10){
        top2=height1-menus.height-10;//10为误差值
    }else if(top2<40){
        top2=40;
    }
    menus.left2=left2;//定义右键菜单值
    menus.top2=top2;//定义右键菜单值
}
fns.prototype.clickSelectMenu1=function (TH,index) {
    var a1=TH.DRcontextmenuDatas1[0].child[index].type;
    var a2=TH.DRcontextmenuData.index2;
    var arrs1=TH.LIlineDatasArrs;
    var arr3=TH.serverNames;
    if(a1==0){// 修改
        TH.editServerNames(a2,1);
    }else if(a1==1){//删除
        layer.confirm('是否删除serverName名为<label class="layerMsgC"> [ '+arr3[a2].name+' ] </label>的连线',{icon:3},function (index) {
            layer.close(index);
            arrs1.splice(a2,1);
            arr3.splice(a2,1);
            de.autoSave();
            vm.refreshCanvasParams('canvasLine',2,true);
        },function (index) {
            layer.close(index);
        })
    }
    TH.DRcontextmenuData.istrue1=false;//注销右键
}
// 3.3----视图内连线
fns.prototype.getWdata=function (TH,a,b,c) {
    $.ajax({
        type:'post',
        data:{tokenID:parent.tokenID,flowID:TH.flowID,engineID:a,moduleID:b,engineTypeCode:c},
        url:basePath_par+'serviceByDynamicFlow/getFlowInfoConfigureStep.do',
        success:function (data) {
            if(!verificationInstruction(data)){
                return false;
            };
            data=data.dataInfo;
            var t1=vm.prossList[vm.prossDatas.type];
            var t3=0;
            for(var i=0;i<t1.length;i++){
                var qw1=data[t1[i].paramname];
                if(qw1!='0'){
                    t1[i].check=qw1;
                    t3++;
                }else{
                    t1[i].check=0;
                }
            }
            $('.prossList').css('width',(t3-1)*60+'px');
        },
    });
}
fns.prototype.mouseenterModel=function (TH,event,index) {
    var dataArrs=TH.DRdropDatas[index];
    if(!TH.LIlineDatas.istrue&&index!=undefined){//只有未激活时才具有划入样式  btn
        TH.LIlineDatas.index1=index;
        TH.LIlineDatas.left1=dataArrs.left+165;
        TH.LIlineDatas.top1=dataArrs.top+65;
    }else{
        TH.LIlineDatas.index2=index;
    }
    if(!dataArrs||dataArrs.type!=3){
        return;
    }
    TH.prossDatas.type=dataArrs.type;//激活 导航模块
    TH.prossDatas.left=event.clientX-130;//导航模块
    TH.prossDatas.top=event.clientY-90;// 导航模块
    TH.getWdata(dataArrs.engineID,dataArrs.moduleID,dataArrs.engineTypeCode);
}
fns.prototype.selectOverDown=function (TH) {
    TH.defaultOff();//每次拖拽  刷新默认关闭
    TH.LIlineDatas.istrue=true;//激活连线
    TH.LIlineDatas.index3=TH.LIlineDatas.index1;//将划入下坐标转入连线起点下坐标
    $(document).on('mousemove',function(event){//每次移动时，跟随连线
        var scale1=vm.VLdatas.scale;
        var vlleft1=vm.VLdatas.left1;
        var vltop1=vm.VLdatas.top1;
        vm.LIlineDatas.left1=(event.clientX+10-vlleft1)/scale1;
        vm.LIlineDatas.top1=(event.clientY-50-vltop1)/scale1;
        //识别当前 是否划入其他模块
        let is_l=false;
        var upIndex=$((event.target || event.srcElement)).closest(".modelView").index();
        console.log((event.target || event.srcElement).closest(".modelView").getAttribute('data-index'))
        // if($((event.target || event.srcElement)).closest(".modelView").length==1){
        //     var upIndex=$((event.target || event.srcElement)).closest(".modelView").index();
        //     if(upIndex>-1&&upIndex!=vm.LIlineDatas.index3){//闪烁
        //         let t_1=vm.DRdropDatas[vm.LIlineDatas.index3].type;
        //         let t_2=vm.DRdropDatas[upIndex].type;
        //         let t_3=t_1+'-'+t_2;
        //         let t_4s=['1-3','2-3','3-1','3-2','1-4','2-4','4-1','4-2'];
        //         if(t_4s.indexOf(t_3)!=-1){
        //             let i_1=vm.LIlineDatas.index3;
        //             let i_2=upIndex;
        //             let i_3=i_1+'-'+i_2;
        //             let i_4=[];
        //             vm.LIlineDatasArrs.forEach(function (item1) {
        //                 i_4.push(item1[0]+'-'+item1[1]);
        //                 i_4.push(item1[1]+'-'+item1[0]);
        //             })
        //             console.log(i_4)
        //             if(i_4.indexOf(i_3)==-1){
        //                 vm.LIlineDatas.index2=upIndex;
        //                 //刷新canvas
        //                 vm.refreshCanvasParams('canvasLineOver',1,true);
        //                 is_l=true;
        //             }

        //         }
        //     }
        // }
        if(!is_l){
            //刷新canvas
            // vm.LIlineDatas.index2=-1;
            vm.refreshCanvasParams('canvasLineOver',0,true);
        }
    });
    $(document).one('mouseup',function(event) {
        $(document).off('mousemove');
        console.log(vm.LIlineDatas)
        let n_1 = vm.LIlineDatas.index3;//开始
        let n_2 = vm.LIlineDatas.index2;//结束
        //刷新canvas
        vm.refreshCanvasParams('canvasLineOver', 0, false);
        //重置
        vm.LIlineDatas.index1 = -1;
        vm.LIlineDatas.left1 = -500;
        vm.LIlineDatas.top1 = -500;
        vm.LIlineDatas.istrue = false;//注销连线
        vm.LIlineDatas.index2 = -1;
        console.log(n_1)
        console.log(n_2)
        // n_2 = 1;
        //判断是否符合连线规则
        if (n_1 != -1 && n_2 != -1) {
            let n_3 = vm.DRdropDatas[n_1].type;//开始
            let n_4 = vm.DRdropDatas[n_2].type;//结束
            if (n_3 < n_4) {
                vm.LIlineDatasArrs.push([n_1, n_2]);
            } else {
                vm.LIlineDatasArrs.push([n_2, n_1]);
            }
            de.lineDataSet(n_3,n_4);//判断当前是否添加servername
            vm.refreshCanvasParams('canvasLine', 2, true);
        }
        vm.LIlineDatas.index3 = -1;
    });
}
fns.prototype.lineDataSet=function (n_3,n_4) {
    // let issevername=true;
    let t_4s=['1-3','2-3','3-1','3-2','1-4','2-4','4-1','4-2'];
    if(t_4s.indexOf(n_3+'-'+n_4)!=-1){
        //判断当前是否 存在servernme
        vm.serverNames.push({
            name:'',
            left:-500,
            top:-500,
            isshow:true,//定义 是否显现 servername  （ds---dt）
        })//增加连线标签
        vm.editServerNames(vm.serverNames.length-1,0);//编辑修改servername
    }else{
      vm.serverNames.push({
        name:'',
        left:-500,
        top:-500,
        isshow:false,//定义 是否显现 servername  （ds---dt）
      })//增加连线标签
        // vm.saveDo1();
    }
    return;
    if(type==0){
        var str1=index1+','+index2;
        var isadd=true;
        for(var i in TH.LIlineDatasArrs){
            var str2=TH.LIlineDatasArrs[i][0]+','+TH.LIlineDatasArrs[i][1];
            if(str1==str2){
                layer.msg('已有连线');
                isadd=false;
            }
        }
        var isshow=false;
        // var a1=vm.DRdropDatas[index1].engineTypeCode;
        // var a2=vm.DRdropDatas[index2].engineTypeCode;
        var indexs12=bction.mod_show_service;
        if(indexs12.indexOf(getModelType(a1))!=-1&&indexs12.indexOf(getModelType(a2))!=-1){//符合 ds --dt servername  出现
            isshow=true;
        }
        if(isadd){
            TH.LIlineDatasArrs.push([index1,index2]);//增加连线
            // //增加一个 不重复的名称
            TH.serverNames.push({
                name:'',
                left:-500,
                top:-500,
                isshow:isshow,//定义 是否显现 servername  （ds---dt）
            })//增加连线标签
            if(isshow){
                vm.editServerNames(TH.serverNames.length-1,0);
            }else{//当 有连线 但是无servername时 添加自动保存
                de.autoSave();// 自动保存
            }
        }
    }
    //refreshcanvas
    TH.refreshCanvasParams('canvasLine',2,true);
}
//3.4-----canvas  绘制
fns.prototype.refreshCanvasParams=function (TH,id,type,istrue) {
    // 清空canvas-----
    var c=document.getElementById(id);
    var ctx=c.getContext("2d");
    ctx.clearRect(0,0,TH.LIlineDatas.canvasH1,TH.LIlineDatas.canvasW1);//清除画布
    if(istrue){
        TH.refreshCanvas(type);
    }
}
fns.prototype.refreshCanvas=function (TH,type) {
    var arrs1=[
        {id:'canvasLineOver'},//type  0
        {id:'canvasLineOver'},//type  1
        {id:'canvasLine'}//type  2
    ];//存储类型内的 不同参数
    var setLineDash=TH.VLsetUpLine[5].value[0].split(',');

    function lineEndPosition(a,b,c,d){
        var w1=w2=330,h1=h2=160;
        var arr=[];
        var arr1=[];
        if(a>c+w2){
            arr.push(w2);
        }else if(a+w1<c){
            arr.push(0);
        }else{
            arr.push(w2/2);
        }
        arr[0]=arr[0]+c;
        if(b>d+h2){
            arr.push(h2);
        }else if(b+h1<d){
            arr.push(0);
        }else{
            arr.push(h2/2);
        }
        arr[1]=arr[1]+d;
        return arr;
    }

    function  lineEndPosition1(a,b,c,d) {
        var scale=vm.VLdatas.scale;
        var referenceRatio1=4/7;//参照比
        var w1=c-a;
        var h1=d-b;
        var arrs1=[];
        if(w1>0){
            var new1=-1;
        }else {
            var new1=1;
            w1=w1*(-1);
        }
        if(h1>0){
            var new2=-1;
        }else {
            var new2=1;
            h1=h1*(-1);
        }
        var referenceRatio2=h1/w1;
        if(referenceRatio2<referenceRatio1){
            var w2=(w1-165)/2;
            var h2=(w2*h1)/w1;
            arrs1.push(c+w2*new1+15);
            arrs1.push(d+h2*new2-15);
        }
        var referenceRatio3=w1/h1;
        var referenceRatio4=7/4;//参照比
        if(referenceRatio3<referenceRatio4){
            var h2=(h1-80)/2;
            var w2=(h2*w1)/h1;
            arrs1.push(c+w2*new1);
            arrs1.push(d+h2*new2);
        }
        return arrs1;
    }

    /*画箭头*/
    function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color,typ,isbad) {
        var theta = theta || 30,
            headlen = headlen || 10,
            width = width || 1,
            color = color || '#000',
            angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();
        var arrowX, arrowY;
        ctx.setLineDash(setLineDash);
        if(type==2){
            if(!isbad){
                var index1=vm.linearrsIndex;
                ctx.lineDashOffset = index1*20;
            }
        }
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        arrowX = toX + topX;
        arrowY = toY + topY;
        if(type==2){
            ctx.beginPath();
            ctx.setLineDash([0,0]);
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
        }
        //小球  走动
        if(TH.VLsetUpLine[8].value[0]!='1'){
            return ;
        }
        if(type==2) {
            ctx.beginPath();
            var b1 = (toX - fromX) / 22;
            var b2 = (toY - fromY) /22;
            var b5 = vm.linearrsIndex;
            var b3 = fromX + b1 * b5-10;
            var b4 = fromY + b2 * b5-10;
            var b6=[1,-1,1,1,-1,1,-1,-1];
            var b7 = b3+3*b6[(b5%4)*2];
            var b8 = b4+3*b6[((b5%4)*2+1)];
            ctx.lineWidth = 0;
            var grd=ctx.createRadialGradient(b7,b8,0,b7,b8,6);//生成小球径向渐变色
            grd.addColorStop(0,"#fff");//里面的颜色
            grd.addColorStop(1,'#1aa469');//外界的颜色
            ctx.globeAlpha=0.2;//透明度
            ctx.fillStyle=grd;//以渐变色填充小球
            ctx.strokeStyle = '#1aa469';
            ctx.arc(b3,b4, 6, 0, Math.PI * 2, true);//画圆函数
            ctx.fill();
            ctx.stroke();
        }
    }

    function lineation(left1,top1,left2,top2,isbad){
        var style='';
        //  1,2,3  鼠标三种颜色的坐标
        var a1=vm.VLsetUpLine[type+1];
        if(type==0||type==1){
            style = '#'+a1.value[0];
        }else if(type==2){
            if(isbad){//坏线
                style = '#'+vm.VLsetUpLine[4].value[0];
            }else{
                style = '#'+a1.value[0];
            }
        }
        lineCanvas.strokeStyle = style;
        var linheadangle=parseInt(vm.VLsetUpLine[6].value[0])/2;
        var linheawidth=parseInt(vm.VLsetUpLine[7].value[0]);
        drawArrow(lineCanvas, left1, top1, left2,top2,linheadangle,linheawidth,2,style,type,isbad);
    }//根据起始结束点 位置划线
    var tag=arrs1[type].id;
    //--------开始
    //1.0---初始化canvas
    var c=document.getElementById(tag);
    var lineCanvas=c.getContext("2d"); //初始化  canvas对象
    lineCanvas.lineWidth = parseFloat(TH.VLsetUpLine[0].value[0]);
    // console.log(type)
    if(type==0||type==1){//鼠标划入
        // console.log(TH.LIlineDatas.index1)
        var index1=TH.LIlineDatas.index1;//定义 当前起点下坐标
        var left1=TH.DRdropDatas[index1].left+165;//定义起点left
        var top1=TH.DRdropDatas[index1].top+80;//定义起点top
        var left2=TH.LIlineDatas.left1-10;//定义尾点left
        var top2=TH.LIlineDatas.top1+10;//定义尾点top
        lineation(left1,top1,left2,top2);
    }else if(type==2){
        var arrs1=TH.LIlineDatasArrs;
        var arrs2=TH.DRdropDatas;
        var arr3=TH.serverNames;
        for(var i in arrs1){
            var left1=arrs2[arrs1[i][0]].left;//定义起点left
            var top1=arrs2[arrs1[i][0]].top;//定义起点top
            var left2=arrs2[arrs1[i][1]].left;//定义尾点left
            var top2=arrs2[arrs1[i][1]].top;//定义尾点top
            // typedata  0 vgent--aoxd////  1  aoxd--yload
            var newLW1=lineEndPosition(left1,top1,left2,top2);//重新生成尾点位置(前俩位连线尾点，后两位label位置)
            var newW2=lineEndPosition1(left1,top1,newLW1[0],newLW1[1]);//重新生成 server name 位置
            arr3[i].left=newW2[0];
            arr3[i].top=newW2[1];
            // if(arrs2[arrs1[i][0]].Upload==1&&arrs2[arrs1[i][1]].Upload==1){
                var isbad=false;
            // }else{
            //     var isbad=true;
            // }
            lineation(left1+165,top1+80,newLW1[0],newLW1[1],isbad);//生成连线  isbad(所在线是否是坏线  是坏线为true)
        }
    }
}
fns.prototype.SetFromchecked=function () {
    // alert("mycheck");
    $("#FTP_form").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            ftp_IP: {
                validators: {
                    notEmpty: {
                        message: 'ip地址不能为空'
                    },
                    regexp: {
                        regexp: /([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}/,
                        message:'ip地址格式不正确'
                    },
                }
            },
            ftp_port: {
                validators: {
                    notEmpty: {
                        message: '端口号不能为空'
                    },
                    regexp: {
                        regexp: /^(\d{3,5})$/,
                        message:'端口号格式不正确'
                    },
                }
            },
            ftp_userName: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 3,
                        max: 6,
                        message: '用户名只能在3-6个字符之间哦~'
                    }
                }
            },
            ftp_passWord: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 8,
                        message: '密码必须在6-8个字符之间~'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '密码只能由字母、数字组成~'
                    }
                }
            },
            ftp_filename: {
                validators: {
                    notEmpty: {
                        message: '文件名不能为空'
                    },
                    lessThan: {
                        value: 15,
                        inclusive: true,
                        message: '最大15'
                    },
                    greaterThan: {
                        value: 1,
                        inclusive: true,
                        message: '最小1'
                    }
                }
            },
        }
    })
}
//方法 end
var de = new fns();
