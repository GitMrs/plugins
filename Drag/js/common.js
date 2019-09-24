/**
 * Created by admin on 2018/6/15.
 */
/*公共接口---*/
var tokenID,basePath,basePath_un;
// $.ajaxSettings.async = false;
// tokenID = window.sessionStorage.getItem("Admin-Token"),
//   $.getJSON('./../globalParams.json', function(data){
//     basePath  = data.communicationAddressDataXone+'/';
//     basePath_un  = data.communicationAddressUnstructuredData+'/';
// });
// $.ajaxSettings.async=true;
tokenID = window.sessionStorage.getItem("Admin-Token");
basePath = window.localStorage.getItem("dataXoneAddress")+'/';
basePath_un = window.localStorage.getItem("unstructuredModuleAddress")+'/';
var parent={
  parentdata:[],
  tokenID:tokenID,
  userID:window.sessionStorage.getItem("userId")
}
if(localStorage.getItem('unstructuredList')){
  parent.parentdata=[JSON.parse(localStorage.getItem('unstructuredList'))];
}
// let anF=JSON.parse();
// var basePath='http://192.168.5.170:9033/';//定义公共接口的基础路径
// var basePath = 'http://10.0.0.241:8080/autoMaticEngineBoot-1.0.0/';//定义公共接口的基础路径
// var basePath_un = 'http://10.0.0.241:8080/dataXone_unstructuredData_project_nogit-0.0.2/';//定义公共接口(非结构化)的基础路径
// var basePath_theme = 'http://10.0.0.241:8070/dataXone_theme_dsg_project-0.0.1/';//定义主题的基础路径
/**1.0---根据返回值判断当前 指令是否正确 是否进行下一步(本层)
 **@params value:接口返回值 的指令是否正确的值 400身份令牌错误  0正确
 **/
function verificationInstruction(data) {
    // return true;
    var a = data.statFlag;
    var istrue = true;
    if (a == 400 || a == -103 || a == -102 || a == -101) {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            //移动端
            window.location.href = window.location.href.split('dynamicSubject')[0] + 'dynamicSubject/login.html'
        } else {
            // pc端
            top.location.href = "../../login.html";
            istrue = false;
        }
    } else if (a != 0 && a != 10) {
        if (layer) {
            if (data.message) {
                layer.msg(data.message, {icon: 0});
            } else {
                layer.msg('出错了 !', {icon: 0});
            }
        }
        istrue = false;
    }
    return istrue;
}

//实例
function a() {
    //返回参数调用
    verificationInstruction(data.statFlag);
    data = data.dataInfo;
    var b = {
        //参数值（子页面  iframe）
        tokenID: parent.tokenID
    }
}

//去掉回车事件
$('body').on('keypress', 'input', function (event) {
    if (event.keyCode == "13") {
        event.preventDefault();
    }
});
//取得 按钮值
if (parent.btnDatas) {
    var btnDatas = parent.btnDatas;
}
// console.log(btnDatas)
if (parent.basePath) {
    var basePath = parent.basePath;
}
/*加载公共的layer--start*/
if(typeof(layer)!="undefined"){
    layer.config({
        extend: 'skin/yourskin/style.css',
        anim:1,
        config_fn:function (layero) {
            var a=$(layero);
            var h1=a.find('.layui-layer-title').height();
            var h2=a.find('.layui-layer-btn').height();
            var h3=a.find('.layui-layer-content').height();
            var h4=a.height();
            h1=h1?h1:0;
            h2=h2?h2+12:0;
            if(h1||h2){
                a.find('.layui-layer-content').css('height',h4-h1-h2+'px')
            }
        },
        resizing: function(layero){
            this.config_fn(layero);
        },
        full:function (layero) {
            this.config_fn(layero);
        },
        min:function (layero) {
            this.config_fn(layero);
        },
        restore :function (layero) {
            this.config_fn(layero);
        },
        success:function (layero) {
            this.config_fn(layero);
        },
    });
}
/*加载公共的layer--end*/
