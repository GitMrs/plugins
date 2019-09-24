/**
 * Created by 24999 on 2018/5/15.
 */
var upLoadStart = 0;//定义当前上传状态 （0--无 1选择文件 2成功 3失败）
var tokenID = parent.tokenID;
function getModelType(value) {
    //获取模块的类型
    var a = parseFloat(value) % 100;
    return a;
}
let timeList = [];
//1.0----init vue
var vm = new Vue({
    el: '#containBox',
    data: {
        linearrsIndex: 3,//定义联线流动  时的起始值
        layerIndexS1: -1,//定义弹出框 保存---的弹框 index
        layerIndex: -1,//定义弹出框index
        layerIndex2: -1,//定义弹出框index 2
        loadLayerIndex: -1,//定义加载中
        basePath: basePath,//方法 基础路径
        flowID: 0,//定义流程id
        /**1.0----header  起始区 H**/
        HserverType: [
            { img: './images/http.png', title: 'HTTP', type: 1 },
            { img: './images/ftp.png', title: 'FTP', type: 2 },
            { img: './images/kafka.png', title: 'KAFKA', type: 3 },
            { img: './images/oracle.png', title: 'oracle', type: 4 },
        ],//存储头部起始区域 按钮的基本信息  drag @param type类型 1代表一般模块
        HserverTypeClick: [
            { icon: 'icon-shangchuan', title: '全部上传', type: 0 },
            { icon: 'icon-baocun', title: '保存当前的全部流程', type: 3 },
            { icon: 'icon-tuichu', title: '退出', type: 4 },
        ],//存储头部起始区域 按钮的基本信息  clcik(1--全部启动，2--全部停止，3-保存全部，4--退出)
        /*2.0-----拖拽  DR**/
        DRdragDropDatas: {
            type: -1,//定义当前拖拽类型 0 从header向视图层   /////1从视图区域 拖向视图区域
            top: 0,//定义当前drop 时  所选择的top值
            left: 0,//定义当前drop 时  所选择的left值
            top1: 0,//定义视图拖向视图时 起点的鼠标 的top
            left1: 0,//定义视图拖向视图时 起点的鼠标 的left
            index1: 0,//定义 版本信息选择的index值
            index2: -1,//定义  header  拖拽的下坐标
            index3: -1,//定义  从视图拖向视图时 ，选中的下坐标
            //在视图中操作时的基本信息
            index4: -1,//定义当双击时，单机  右键 选中的index时
        },//定义拖拽时的基本信息
        DRdragBeforeLayerDatas: [],//存储drag以后  弹出框  版本配置的具体信息  名称 版本 信息  所属选择类型
        DRdragBeforeLayerDatas1: [
            { name: '全部', type: -1 },
        ],//储drag以后  弹出框  版本配置的具体信息  一级类型选择
        DRdragBeforeLayerDatas2: [
            // {name:'orcal1',ptype:0,type:0},
        ],//储drag以后  弹出框  版本配置的具体信息  二级类型选择
        DRdragBeforeLayerDatas4: {
            select1: -1,
            select2: -1,
            select2Index: -1,
            select3: '',
            vcContentIsshow: true,//供选择的内容 是否存在
        },//储drag以后  弹出框  版本配置的具体信息
        DRdropDatas: [],//定义drop后 存储 所有模块的信息  /////isStart true 启动  false停止/// //// type DRdragBeforeLayerDatas  所属选择类型
        // DRdropLines:[],//存储连线
        DRcontextmenuData: {
            istrue: false,//是否启用右键
            index1: -1,//定义当前启用哪个 右键菜单  //定义模块右键菜单标识
            left1: 0,//定义右键单机时鼠标位置 top
            top1: 0,//定义右键单机时鼠标位置 left
            height: 0,//定义右键单机时菜单位置 height
            left2: -500,//定义右键单机时菜单位置 top
            top2: -500,//定义右键单机时菜单位置 left

            index2: -1,//定义servername 右键菜单哪个索引
            istrue1: false,//server  是否启用 右键菜单
            isedit: true,//定义 模块的基本配置信息 是否可以编辑 true编辑、、、、、false查看
        },//存储右键 的基本信息
        DRcontextmenuDatas1: [{
            child: [
                { name: '修改', type: 0, icon: 'icon-xiugai' },
                { name: '删除', type: 1, icon: 'icon-iconfont-shanchu' },
            ]
        }],//定义右键的菜单 server name 右键菜单
        DRnEWData: [
            {
                name: 'serviceName', type: 0, child: [
                    { name: '基本配置', type: 0, icon: 'icon-xiugai', isshowChild: false },
                    { name: '删除连线', type: 1, icon: 'icon-iconfont-shanchu', isshowChild: false },
                ]
            },//servername
            {
                name: 'http', type: 1, child: [
                    { name: '基本配置', type: 0, icon: 'icon-xiugai', isshowChild: false },
                    { name: '删除模块', type: 1, icon: 'icon-iconfont-shanchu', isshowChild: false },
                ]
            },//http
            {
                name: 'ftp', type: 2, child: [
                    { name: '基本配置', type: 0, icon: 'icon-xiugai', isshowChild: false },
                    { name: '删除模块', type: 1, icon: 'icon-iconfont-shanchu', isshowChild: false },
                ]
            },//ftp
            {
                name: 'kafka', type: 3, child: [
                    { name: '基本配置', type: 0, icon: 'icon-xiugai', isshowChild: false },
                    { name: '上传', type: 1, icon: 'icon-shangchuan', isshowChild: false },
                    { name: '详细配置', type: 2, icon: 'icon-lanmupeizhi', isshowChild: false },
                    { name: '删除模块', type: 3, icon: 'icon-iconfont-shanchu', isshowChild: false },
                ]
            },//kafka
            {
                name: 'oracle', type: 4, child: [
                    { name: '基本配置', type: 0, icon: 'icon-xiugai', isshowChild: false },
                    { name: '上传', type: 1, icon: 'icon-shangchuan', isshowChild: false },
                    // {name: '详细配置', type: 2, icon: 'icon-lanmupeizhi',isshowChild:false},
                    { name: '删除模块', type: 3, icon: 'icon-iconfont-shanchu', isshowChild: false },
                ]
            },//kafka
        ],//右键菜单信息

        /**3.0  连线  LI**/
        LIlineDatas: {
            istrue: false,//连线是否激活
            index1: -1,//定义 划入模块后的index
            index2: -1,//定义  连线时划入要连线尾端的模块index
            index3: -1,//定义 划入后 转入 起点下坐标
            canvasH1: 4000,//定义 canvas  宽度
            canvasW1: 4000,//定义 canvas高度
            top1: -500,//定义鼠标滑动时 位置 top
            left1: -500,//定义鼠标滑动时 位置 left
        },//定义连线时的基本信息
        LIlineDatasArrs: [],//定义连线组成后的 连数据
        LIlineDatasLabel: {},//存储所有连线上的标签 基本信息
        LIlineDatasLabelArrs: [
            // {name:'123',msg:'33'}
        ],//存储所有连线上的标签 的数据




        /**4.0----视图处  VL工具栏*/
        VLdatas: {
            //放大缩小
            scale: 0.7,//当前比例100%；
            minscale: 0.1,//最小比例
            maxscale: 1.5,//最大比例
            //放大缩小工具框信息
            scale1: 0.0625,//当前视图比例
            left1: 0,//视图移动后的位置
            top1: 0,//视图移动后的位置
            //工具栏内的视图窗口的移动
            left2: 0,//工具栏内的视图窗口的移动
            top2: 0,//工具栏内的视图窗口的移动
            left2o: 0,//工具栏内的视图窗口的移动  鼠标起始位置 移动时临时存储值
            top2o: 0,//工具栏内的视图窗口的移动 鼠标起始位置
            left3: 0,//工具栏内的视图窗口的移动  鼠标起始位置
            top3: 0,//工具栏内的视图窗口的移动 鼠标起始位置

            width: 30,//工具内 视图的宽度
            height: 30,//工具内 视图高度

            //视图 mousedown 移动时
            left4: 0,  //移动前  left  鼠标位置
            top4: 0, //移动前  top鼠标位置
            left4o: 0,  //移动前  left  暂时存在值
            top4o: 0, //移动前  top暂时存在值
        },//定义工具栏内基本信息
        VLsetUpData: {
            index1: -1,//定义当前选中设置的按钮
            isva: false,//是否进行表单验证
        },//设置中的基本信息
        VLsetUpDatas: [
            { name: '连线的配置', value: 0, icon: 'icon-lianxian_icon', iddata: 'setUpLineBoxs' },
            { name: '当前设备全部上传', value: 3, icon: 'icon-shangchuan', iddata: 'setUpLineBoxs' },
        ],//设置中的基本信息  --数据
        VLsetUpLine: [
            { name: '连线的宽度', value: [2], value1: 2, title: '宽度1-15', namedata: 'lineWidth' },
            {
                name: '连线未成线的颜色',
                iscolor: true,
                title: '例 : cccccc',
                value: ['f00'],
                value1: 'f00',
                namedata: 'lineHover'
            },
            {
                name: '连线即将成线的颜色',
                iscolor: true,
                title: '例 : cccccc',
                value: ['0f0'],
                value1: '0f0',
                namedata: 'lineActive'
            },
            {
                name: '连线已成线的颜色',
                iscolor: true,
                title: '例 : cccccc',
                value: ['1cd485'],
                value1: '1cd485',
                namedata: 'lineSelect'
            },
            {
                name: '坏线成线的颜色',
                iscolor: true,
                title: '例 : cccccc',
                value: ['ccc'],
                value1: 'ccc',
                namedata: 'lineSelectBad'
            },
            {
                name: '连线的间隔',
                value: ['13,8'],
                value1: '13,8',
                title: '俩组数据用英文逗号分开，前面为实线，后面为间隔，有0时为实线',
                namedata: 'lineDHWidth'
            },
            { name: '连线的箭头角度', value: ['60'], value1: '60', title: '30-150', namedata: 'lineAngle' },
            { name: '连线的箭头长度', value: ['15'], value1: '15', title: '5-60', namedata: 'lineAngleWidth' },
            { name: '是否启用连线上的小球', type: 2, value: ['0'], value1: '0', title: '', namedata: 'ballRoll' },//default 0 否/////1 是
        ],//设置 --  连线---layer  type 代表是选择的类型，没有默认text/////  2代表radio


        //5.2    流程导航
        prossList: [
            [], [], [],
            [
                { name: '基础配置', check: 0, paramname: 'base' },
                { name: '上传信息', check: 0, paramname: 'upload' },
                { name: '详细配置', check: 0, paramname: 'details' },
            ],//kafa
        ],//存储 导航状态信息
        prossDatas: {
            type: -1, //定义当前划入模块类型  0代表 ds--dt类
            left: -300,//定义 导航视图 left
            top: -300,//定义 导航视图 top
        },//定义 导航时所需的基本信息

        /*流程信息*/
        importProcessData: {
            index1: -1,//定义 选中的 哪个流程
            flowName: '',//流程name
            flowDescribe: '',//流程 描述
            createTime: '',//流程时间
            isenter: false,//是否退出当前页面
        },//定义一些导入流程的基本信息
        saveProssBox: [
            { viewName: '流程名称', paramName: 'flowName', value: '', title: '请输入流程名称' },
            { viewName: '流程描述', paramName: 'flowDescribe', value: '', title: '请输入流程描述' }
        ],//定义保存流程 弹框的基本信息
        serverNames: [],//存储servername
        serverNameBox: [
            { viewName: 'serviceName名称', paramName: 'serviceName', value: '', title: '请输入serviceName名称' },
        ],//定义保存流程 弹框的基本信息
        serverNameData: {
            index1: -1,//定义当前servername 的索引
        },//存储servername 基本信息
        upAllNames: [],//存储 全部上传时 用的信息
        upDatas: {
            data: [],//存储 ---要操作的索引值得集合
            index1: -1,//定义当前执行上传的 索引
            type: -1,//定义当前操作的类型 0上传 1全部上传
            isshow: true,//定义 多操作时 当前是否展示详情
            isshow2: true,//定义 多操作时 当前是否展示信息名称 框
        },//存储 全部上传--基本信息
        /*HTTP\FTP\WebServer的相关配置参数*/
        moduleID: 0,//定义自增的modulid 当前已知最大的moduld
        arr11: [],

        ischeckboxAll: false,//定义当前是否是全选中
        KAFremortConfig_ftp: [
            { viewName: 'ip', value: '', uparamName: 'ip', paramName: 'hostIp', title: '请输入ip地址' },
            { viewName: '端口', value: '', uparamName: 'port', paramName: 'hostPort', title: '请输入端口' },
            { viewName: '用户名', value: '', uparamName: 'userName', paramName: 'userName', title: '请输入用户名' },
            { viewName: '密码', value: '', uparamName: 'passWord', paramName: 'passWord', title: '请输入密码' },
        ],//远程配置
        kafkaStep_ftp: 0,//步骤数从0开始
        kafkaYStat_ftp: 0,//定义远程配置状态（0 双按钮页面 1新建页面 书写页面 2 选择已有页面）
        kafaListData_ftp: {
            isinit: true,//定义 打开的kafka是否是新建
            data: {},//存储一些关于kafka临时的数据
            isUpdate: true,//弥补 自动表单 select 不重置问题
            detailData: {},//定义当前kafka详细配置的信息
            //    db数据源
            isshowTable: true,//定义 是否展示 当前数据源 table
        },//定义kafka 基础信息
        /*选择kafka版本 start*/
        kafkaVersion: [],//kafka的版本信息
        kafkaVersionD: {
            selectIndex: 0,//当前选中的值
            engineID: 0,//临时的kafka信息
            moduleID: 0,//临时的kafka信息
            engineTypeCode: 0//临时的kafka信息
        },//存储关于 kafka版本的信息
        /*选择kafka版本 end*/
        /*kafka----基础配置参数 start*/
        kafkaList: [],//存储kafka基础配置参数(接口而来)
        kafkaStep: 0,//步骤数从0开始
        TLdbIDList: -1,//存储 临时打开 数据源的id（默认-1  未有数据源）
        /*远程配置--*/
        kafkaYStat: 0,//定义远程配置状态（0 双按钮页面 1新建页面 书写页面 2 选择已有页面）
        kafkaInitForm: 0,//定义表单是否初始化(0代表不用初始化  其余数值代表初始化类型  )
        KAFremortConfig: [
            { viewName: '主机名称', value: '', paramName: 'hostName', title: '请输入主机名称' },
            { viewName: 'ip', value: '', paramName: 'ip', title: '请输入ip地址' },
            { viewName: 'SSH端口', value: '', paramName: 'port', title: '请输入SSH端口' },
            { viewName: '用户名', value: '', paramName: 'userName', title: '请输入用户名' },
            { viewName: '密码', value: '', paramName: 'passWord', title: '请输入密码' },
        ],//远程配置
        KAFpathConfig: [
            { viewName: '根路径', value: '', paramName: 'path', title: '请输入根路径' },
            { viewName: '目录名称', value: '', paramName: 'packageName', title: '请输入根路径名称' },
        ],//路径配置
        KAFpathConfigkafka: [
            { viewName: '根路径', value: '', paramName: 'path', title: '请输入根路径' },
            { viewName: '目录名称', value: '', paramName: 'packageName', title: '请输入根路径名称' },
            { viewName: 'JAVA_HOME', value: '', paramName: 'JAVA_HOME', title: '请输入JAVA_HOME' },
        ],//路径配置 kafa
        kafaListData: {
            isinit: true,//定义 打开的kafka是否是新建
            data: {},//存储一些关于kafka临时的数据
            isUpdate: true,//弥补 自动表单 select 不重置问题
            detailData: {},//定义当前kafka详细配置的信息
            //    db数据源
            isshowTable: true,//定义 是否展示 当前数据源 table
        },//定义kafka 基础信息
        /*kafka----基础配置参数end*/
        /*公共的---COM1*/
        COM1Data: {
            type1: -1,//当前的类型(http1,,,ftp2,,)
            step1: 1,//当前的步骤(从1开始)
            title1: [
                [],
                ['', 'http接口参数', '选择格式', '选择要用的数据', '数据的比对', '配置时间'],
                ['', 'ftp接口参数', '选择格式', '选择要用的数据', '数据的比对', '配置时间']
            ],//名称的集合
            steps: 5,//总的步数 （http--ftp--5）
        },//http--ftp--公共的基础配置
        COM1getD: {
            typePath: true,//远程目录 类型 true 按目录   false按文件
            remotePath: '',//远程目录
            signType: '',//标记当前匹配的规则 是否有zip类型
            signFile: '',//存储 文件时的状态
            selectFile: '',//远程文件----选中文件
            ignoreFile: '',//远程文件----忽略文件
            osName: '',
            fileType: 'txt',//要返回的类型
            codedFormat: 'UTF-8',//编码格式
            suffix: 'txt',//后缀名
            fileFormat: 'asc',//文件格式 默认ASCII编码
            fileFormat1: '',//文件格式 ASCII编码--的值
            fileFormat2: [{ value: '' }],//文件格式 十六进制编码--的值
            isColName: true,
        },//发送的数据格式(step2)
        COM1COLD: {
            module: [],
            list: [{ name: '1', type: '1' }, { name: '2', type: 'string' }],//左侧数据
            select: [],//右侧数据
            moduleSelect: [],//选中后 整合后的模板
            moduleSelectJson: '',//修改后的json模板
            // show:[],//下侧数据
            // txt:'text',//send--格式
            txt: 'cjson',//send--格式
            fileFormat: 'asc',//文件格式 默认ASCII编码
            fileFormat1: '',//文件格式 ASCII编码--的值
            fileFormat2: [{ value: '' }],//文件格式 十六进制编码--的值
        },//得到的数据--获取到可拖拽的列 (step3)
        COM1ShowD: {
            key: '',
            value: '',
            time_Type: 'r'//Real time /cycle(r实时  c周期)
        },//拖拽以后，展示的数据 step4
        /*new  时间联动 NDa*/
        NDaLIST: {
            one: [
                { name: '天', value: 'day', Associated1: 'day' },
                { name: '周', value: 'week', Associated1: 'week' },
                { name: '月', value: 'month', Associated1: 'month' },
            ],
            day: [
                { name: '每天', value: 'intervalday' },
                { name: '每小时', value: 'intervalhour', Associated2: [false, true, true] },
                { name: '每分', value: 'intervalmin', Associated2: [false, false, false] },
            ],
            week: [
                { name: '星期一', value: 'MON', check: false },
                { name: '星期二', value: 'TUE', check: false },
                { name: '星期三', value: 'WED', check: false },
                { name: '星期四', value: 'THU', check: false },
                { name: '星期五', value: 'FIR', check: false },
                { name: '星期六', value: 'SAT', check: false },
                { name: '星期日', value: 'SUN', check: false },
            ],
            month: [
                { name: '每1天', value: 'intervaldayon' },
                { name: '每2天', value: 'intervaldaytw' },
                { name: '每3天', value: 'intervaldayth' },
            ],
            frequency: [
                { name: '重复', value: 'loop' },
                { name: '一次', value: 'once' },
            ],
            hour: [],
            min: [],
            sec: []
        },//时间联动总的参数列表
        NDaLIST1: {
            one: 'one',
            two: 'day',
            three: [true, true, true],
            oneD: 'day',//选中的值
            twoD: 'intervalday',//选中的值
            threeD: ['loop', 0, 0, 0],//选中的值//无值时 赋值为-1
            CronExpress: '',
            isrefresh: false
        },//存储基本的参数值
        /*new--http-1.0 N_HTTP --START*/
        N_HTTP_1: {
            urlType: 'POST',
            urlPath: "http://mobile.weather.com.cn/data/forecast/101010600.html",
            params: [
                { value: '', name: '' },
            ],
        },
        /*new--http-1.0 N_HTTP --END*/
        /*new--http-1.0 N_FTP --START*/
        N_FTP_1: {
            list: [
                { viewName: 'ip', value: '', uparamName: 'ip', paramName: 'hostIp', title: '请输入ip地址' },
                { viewName: '端口', value: '', uparamName: 'port', paramName: 'hostPort', title: '请输入端口' },
                { viewName: '用户名', value: '', uparamName: 'userName', paramName: 'userName', title: '请输入用户名' },
                { viewName: '密码', value: '', uparamName: 'passWord', paramName: 'passWord', title: '请输入密码' },
                {
                    viewName: '连接方式', value: 'ftp', uparamName: 'linkMode', paramName: 'linkMode', title: '', type: 'select', selectList: [
                        { name: 'ftp', value: 'ftp' },
                        { name: 'ssh', value: 'ssh' },
                    ],
                },
                {
                    viewName: '主机类型', value: 'linux', show: true, uparamName: 'osName', paramName: 'osName', title: '请输入密码', type: 'select', selectList: [
                        { name: 'linux', value: 'linux' },
                        { name: 'windows', value: 'windows' },
                    ],
                },
            ],//远程配置
            stat: 0,//定义远程配置状态（0 双按钮页面 1新建页面 书写页面 2 选择已有页面）
            isinit: true,//定义 打开的kafka是否是新建
            data: {},//存储一些关于kafka临时的数据
            isUpdate: true,//弥补 自动表单 select 不重置问题
            detailData: {},//定义当前kafka详细配置的信息
            //    db数据源
            isshowTable: true,//定义 是否展示 当前数据源 table
        },
        /*new--http-1.0 NFTP --END*/
        /*new--http-1.0 N_oracle --START*/

        oracleList: [
            {
                type: 0, list: [
                    { viewName: '主机名称', value: '', paramName: 'hostName', title: '请输入主机名称' },
                    { viewName: 'ip', value: '', paramName: 'ip', title: '请输入ip地址' },
                    { viewName: 'SSH端口', value: '', paramName: 'port', title: '请输入SSH端口' },
                    { viewName: '用户名', value: '', paramName: 'userName', title: '请输入用户名' },
                    { viewName: '密码', value: '', paramName: 'passWord', title: '请输入密码' },
                ], titleName: '主机信息'
            },
            {
                type: 0, list: [
                    { viewName: '根路径', value: '', paramName: 'path', title: '请输入根路径' },
                    { viewName: '目录名称', value: '', paramName: 'packageName', title: '请输入目录名称' },
                    { viewName: '进程名', value: '', paramName: 'process_name', id: 130, title: '请输入进程名' },
                    { viewName: 'JDDM监听端口', value: '', paramName: 'jddm_port', id: 110, title: '请输入JDDM监听端口' },
                ], titleName: '基础信息配置', msg: ''
            },
            {
                type: 0, isshowTable: true, list: [
                    { name: 'hostname', value: '' },
                    { name: 'ip', value: '' }
                ], titleName: '数据源信息'
            },
            // {type:0,list:[
            //   {viewName:'表名称',name:'tablename',value:''},
            //   // {name:'ip',value:''}
            // ],titleName:'存储表名称'},
            {
                type: 0, list: [
                    { viewName: '表名称', name: 'tablename', value: '' },
                    { viewName: '表名称', name: 'tablename', value: 'real', def: 'real' },
                    // {name:'ip',value:''}
                ], userName: '', titleName: '存储表名称'
            },
        ],
        oracleStep: 0,
        oracleD: {
            engineID: 96,
            moduleID: 0,
            engineTypeCode: 104,
        },
        /*new--http-1.0 N_oracle --END*/

        //  文件目录---1
        fileDirectory: {
            root: '',
            selectData: [],//远程文件展示目录集合
            isinitTrue: false,//文件 时的初始化
            //1.0--文件

            index: -1,//选中文件的索引
            hoverIndex: -1,//划入文件索引
            regHoverIndex: -1,//匹配规则的划入
            isZip: true,//定义当前文件是否是zip打开
            //  标记---
            signList: {},//标记的集合
            //匹配的规则
            regSignList: {},//匹配的规则 标记忽略 集合
            regType: 0,//匹配规则类型 0  追加 1全部替换 2部分替换

            //2.0--目录
            //选中的文件目录
            selectFileList: [],//存储当前 选中的文件目录的集合
            hoverFileIndex: -1,//当前划入的那个目录集合
            selectFileIndex: -1,//当前选中的那个目录集合

        },
        isrefresh: true,
    },
    mounted: function () {
        let TH = this;
        this.loading('加载中 ...');
        //添加模块  选择时的  数据
        this.initScale();//初始化当前比例
        //补充时间联动的列表
        this.initDateL();
        /*kafka版本信息*/
        // serviceByDynamicFlow/getThisSystemEngineInfo
        $.ajax({
            type: 'post',
            url: basePath_par + 'serviceByDynamicFlow/getThisSystemEngineInfo.do',
            data: {
                tokenID: parent.tokenID,
            },
            success: function (data) {
                let data = {
                    "statFlag": 0, "dataInfo": [{
                        "imgName": "kafka", "gid": "2",
                        "level": 6,
                        "name": "Kafka 0.10 (JDEE)",
                        "details": " Kafka 0.10 的Java版本",
                        "id": "1",
                        "engineTypeCode": 1002,
                        "version": "v.2.2.3",
                        "tid": "1"
                    }
                        , { "imgName": "kafka", "gid": "2", "level": 6, "name": "Kafka 0.9 (JDEE)", "details": " Kafka 0.0 的Java版本", "id": "2", "engineTypeCode": 1002, "version": "v.2.2.3", "tid": "1" }, { "imgName": "kafka", "gid": "2", "level": 6, "name": "Kafka DB 0.10 (JDDM)", "details": " Kafka 0.10 数据库版本", "id": "3", "engineTypeCode": 1002, "version": "v.2.2.3", "tid": "1" }, { "imgName": "kafka", "gid": "2", "level": 6, "name": "Kafka Huawei Kerberos 0.10 (JDEE)", "details": " 华为 Kafka Kerberos 0.10 的Java版本", "id": "4", "engineTypeCode": 1002, "version": "v.2.2.6", "tid": "1,2" }, { "imgName": "kafka", "gid": "2", "level": 6, "name": "Kafka Huawei Kerberos 0.9 (JDEE)", "details": " 华为 Kafka Kerberos 0.9 的Java版本", "id": "5", "engineTypeCode": 1002, "version": "v.2.2.6", "tid": "1,2" }, { "imgName": "kudu", "gid": "2", "level": 6, "name": "Kudu (JDEE)", "details": " Kudu 的Java版本", "id": "6", "engineTypeCode": null, "version": "v.1.1.2", "tid": "4" }, { "imgName": "gemfire", "gid": "2", "level": 6, "name": "GemFire (JDEE)", "details": " GemFire 的Java版本", "id": "7", "engineTypeCode": null, "version": "v.1.5.3", "tid": "5" }, { "imgName": "hbase", "gid": "2", "level": 6, "name": "Hbase (JDEE)", "details": " Hbase 的Java版本", "id": "8", "engineTypeCode": null, "version": "v.1.6.7", "tid": "6" }, { "imgName": "hive", "gid": "2", "level": 6, "name": "Hive (JDEE)", "details": " Hive 的Java版本", "id": "9", "engineTypeCode": null, "version": "v.1.0.8", "tid": "7" }, { "imgName": "kafka", "gid": "2", "level": 6, "name": "Confluent Kafka (JDEE)", "details": " Confluent kafka 的 java版本", "id": "10", "engineTypeCode": null, "version": "v.1.1.4", "tid": "1,3" }, { "imgName": "http", "gid": null, "level": 2, "name": "HTTP", "details": "HTTP请求模块", "id": "11", "engineTypeCode": null, "version": "v.1.1.0", "tid": "9" }, { "imgName": "ftp", "gid": null, "level": 2, "name": "FTP", "details": "FTP请求模块", "id": "12", "engineTypeCode": null, "version": "v.1.1.0", "tid": "9" }, { "imgName": "yloader", "gid": "2", "level": 2, "name": "dt(sqlserver-kafka)", "details": "sqlserver到kafka", "id": "16", "engineTypeCode": 203, "version": "v.1.5.3.4", "tid": "10" }, { "imgName": "yloader", "gid": "2", "level": 2, "name": "dt(c-kafka)", "details": "DSG 目标端 for Kafka", "id": "17", "engineTypeCode": 203, "version": "v.1.5.3.4", "tid": "10,18" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.18-308.el5.x86_64", "id": "20", "engineTypeCode": 100, "version": "11.2.0.1_ASM_64", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.18-308.el5.x86_64", "id": "21", "engineTypeCode": 101, "version": "11.2.0.1_ASM_64", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.18-308.el5PAE", "id": "22", "engineTypeCode": 100, "version": "11.2.0.1_ASM_32", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.18-308.el5PAE", "id": "23", "engineTypeCode": 100, "version": "10.2.0.1_ASM_32", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.18-308.el5PAE", "id": "24", "engineTypeCode": 100, "version": "11.1.0.6_ASM_32", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.18-308.el5", "id": "25", "engineTypeCode": 101, "version": "10.2.0.1_ASM_32", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.18-308.el5PAE", "id": "26", "engineTypeCode": 100, "version": "12.1.0.2_ASM_32", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.18-308.el5PAE", "id": "27", "engineTypeCode": 100, "version": "12.2.0.1_ASM_32", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "28", "engineTypeCode": 100, "version": "10.2.0.1_ASM_64", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "29", "engineTypeCode": 100, "version": "11.1.0.6_ASM_64", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.18-308.el5", "id": "30", "engineTypeCode": 101, "version": "11.1.0.6_ASM_32", "tid": "10,15" }, { "imgName": "mysql", "gid": "4", "level": 2, "name": "dt(mysql)", "details": "DSG Mysql目标端复制", "id": "31", "engineTypeCode": 201, "version": "v.2.1.1", "tid": "10,12" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "32", "engineTypeCode": 100, "version": "12.1.0.2_ASM_64", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "33", "engineTypeCode": 100, "version": "12.2.0.1_ASM_64", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.18-308.el5", "id": "34", "engineTypeCode": 101, "version": "11.2.0.1_ASM_32", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.18-308.el5", "id": "35", "engineTypeCode": 101, "version": "12.1.0.2_ASM_32", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.18-308.el5", "id": "36", "engineTypeCode": 101, "version": "12.2.0.1_ASM_32", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "37", "engineTypeCode": 101, "version": "10.2.0.1_ASM_64", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "39", "engineTypeCode": 101, "version": "12.1.0.2_ASM_64", "tid": "10,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "40", "engineTypeCode": 101, "version": "12.2.0.1_ASM_64", "tid": "10,15" }, { "imgName": "sqlserver", "gid": "1", "level": 2, "name": "dt(sqlserver)", "details": "DSG SqlServer目标端复制", "id": "41", "engineTypeCode": 301, "version": "v.2.1.1", "tid": "10" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "2.6.32-358.el6.x86_64", "id": "42", "engineTypeCode": 101, "version": "11.1.0.6_ASM_64", "tid": "10,15" }, { "imgName": "db2", "gid": "5", "level": 2, "name": "dt(db2)", "details": "Linux-2.6.18", "id": "51", "engineTypeCode": 401, "version": "v10.5_64", "tid": "10,13" }, { "imgName": "db2", "gid": "5", "level": 2, "name": "dt(db2)", "details": "Linux-2.6.18", "id": "52", "engineTypeCode": 401, "version": "v9.7_64", "tid": "10,13" }, { "imgName": "postgresql", "gid": "6", "level": 2, "name": "dt(postgresql)", "details": "DSG postgresql目标端复制", "id": "61", "engineTypeCode": 501, "version": "", "tid": "10,14" }, { "imgName": "oracle", "gid": "8", "level": 1, "name": "ds(oracle)", "details": "AIX-5.3", "id": "71", "engineTypeCode": 100, "version": "12.1.0.2_ASM_32", "tid": "9,16" }, { "imgName": "oracle", "gid": "8", "level": 2, "name": "dt(oracle)", "details": "AIX-5.3", "id": "72", "engineTypeCode": 101, "version": "12.1.0.2_ASM_32", "tid": "10,16" }, { "imgName": "oracle", "gid": "8", "level": 1, "name": "ds(oracle)", "details": "AIX-5.3", "id": "73", "engineTypeCode": 100, "version": "11.2.0.1_ASM_64", "tid": "9,16" }, { "imgName": "oracle", "gid": "8", "level": 2, "name": "dt(oracle)", "details": "AIX-5.3", "id": "74", "engineTypeCode": 101, "version": "11.2.0.1_ASM_64", "tid": "10,16" }, { "imgName": "oracle", "gid": "8", "level": 1, "name": "ds(oracle)", "details": "AIX-5.3", "id": "75", "engineTypeCode": 100, "version": "12.1.0.2_ASM_64", "tid": "9,16" }, { "imgName": "oracle", "gid": "8", "level": 2, "name": "dt(oracle)", "details": "AIX-5.3", "id": "76", "engineTypeCode": 101, "version": "12.1.0.2_ASM_64", "tid": "10,16" }, { "imgName": "oracle", "gid": "8", "level": 1, "name": "ds(oracle)", "details": "AIX-5.3", "id": "77", "engineTypeCode": 100, "version": "10.2.0.1_ASM_64", "tid": "9,16" }, { "imgName": "oracle", "gid": "8", "level": 2, "name": "dt(oracle)", "details": "AIX-5.3", "id": "78", "engineTypeCode": 101, "version": "10.2.0.1_ASM_64", "tid": "10,16" }, { "imgName": "oracle", "gid": "3", "level": 1, "name": "ds(oracle)", "details": "SunOS-5.10", "id": "79", "engineTypeCode": 100, "version": "10.2.0.1_ASM_64", "tid": "11,9" }, { "imgName": "oracle", "gid": "3", "level": 2, "name": "dt(oracle)", "details": "SunOS-5.10", "id": "80", "engineTypeCode": 101, "version": "10.2.0.1_ASM_64", "tid": "11,10" }, { "imgName": "oracle", "gid": "3", "level": 1, "name": "ds(oracle)", "details": "SunOS-5.10", "id": "81", "engineTypeCode": 100, "version": "11.2.0.1_ASM_64", "tid": "11,9" }, { "imgName": "oracle", "gid": "3", "level": 2, "name": "dt(oracle)", "details": "SunOS-5.10", "id": "82", "engineTypeCode": 101, "version": "11.2.0.1_ASM_64", "tid": "11,10" }, { "imgName": "oracle", "gid": "3", "level": 1, "name": "ds(oracle)", "details": "SunOS-5.10", "id": "83", "engineTypeCode": 100, "version": "12.1.0.2_ASM_64", "tid": "11,9" }, { "imgName": "oracle", "gid": "3", "level": 2, "name": "dt(oracle)", "details": "SunOS-5.10", "id": "84", "engineTypeCode": 101, "version": "12.1.0.2_ASM_64", "tid": "11,10" }, { "imgName": "oracle", "gid": "7", "level": 1, "name": "ds(oracle)", "details": "3.10.0-123.el7.x86_64", "id": "85", "engineTypeCode": 100, "version": "11.2.0.1_ASM_64", "tid": "9,15" }, { "imgName": "oracle", "gid": "7", "level": 2, "name": "dt(oracle)", "details": "3.10.0-123.el7.x86_64", "id": "86", "engineTypeCode": 101, "version": "11.2.0.1_ASM_64", "tid": "10,15" }, { "imgName": "oracle", "gid": "9", "level": 1, "name": "ds(oracle)", "details": "HP-UX-11.23", "id": "87", "engineTypeCode": 100, "version": "10.2.0.1_ASM_64", "tid": "9,17" }, { "imgName": "oracle", "gid": "9", "level": 2, "name": "dt(oracle)", "details": "HP-UX-11.23", "id": "88", "engineTypeCode": 101, "version": "10.2.0.1_ASM_64", "tid": "10,17" }, { "imgName": "mysql", "gid": "4", "level": 1, "name": "ds(mysql)", "details": "DSG Mysql源端复制", "id": "89", "engineTypeCode": 200, "version": "v.2.1.1", "tid": "12" }, { "imgName": "db2", "gid": "5", "level": 1, "name": "ds(db2)", "details": "Linux-2.6.18", "id": "90", "engineTypeCode": 400, "version": "v10.5_64", "tid": "13" }, { "imgName": "postgresql", "gid": "6", "level": 1, "name": "ds(postgresql)", "details": "DSG postgresql源端复制", "id": "91", "engineTypeCode": 500, "version": null, "tid": "14" }, { "imgName": "sqlserver", "gid": "10", "level": 1, "name": "ds(sqlserver)", "details": "DSG sqlserver源端复制", "id": "92", "engineTypeCode": 300, "version": "SQLSync-2.0.4", "tid": "19" }, { "imgName": "sqlserver", "gid": "10", "level": 2, "name": "dt(sqlserver)", "details": "DSG sqlserver目标端复制(源端非oracle)", "id": "93", "engineTypeCode": 301, "version": "SQLSync-2.0.4", "tid": "19" }, { "imgName": "sqlserver", "gid": "10", "level": 2, "name": "dt(sqlserver)", "details": "DSG sqlServer目标端复制(源端oracle)", "id": "95", "engineTypeCode": 301, "version": "SQLSync-2.0.4", "tid": "19" }, { "imgName": "oracle", "gid": null, "level": 6, "name": "Kafka_Oracle", "details": "kafka对应的oracle版本", "id": "96", "engineTypeCode": 104, "version": "v.1.1.0", "tid": "1" }]
                }
                if (!verificationInstruction(data)) {
                    return false;
                };
                data = data.dataInfo;
                let n_ = [];
                data.forEach(function (item) {
                    if (item.imgName == 'kafka') {
                        n_.push(item);
                    }
                })
                TH.kafkaVersion = n_;
            }
        })

        //    创建流程id  flowID
        function getrandom() {
            var str = '';
            for (var i = 0; i < 5; i++) {
                str += (Math.random() * 10).toFixed(0);
            }
            return str;
        }
        this.flowID = Date.now() + getrandom();
        //是否打开已有
        if (parent.parentdata && parent.parentdata.length == 1) {
            this.loading('加载中 ...');
            $.ajax({
                type: 'post',
                url: basePath + '/unstructuredServiceByDynamicFlow/getSaveModuleEngineFlowDescInfo.do',
                data: {
                    tokenID: parent.tokenID,
                    flowID: parent.parentdata[0].flowId
                },
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    };
                    data = data.dataInfo;
                    TH.closeLoading();
                    TH.flowID = data.flowId;
                    TH.importProcessData.flowName = data.flowName;
                    TH.importProcessData.flowDescribe = data.flowDescribe;
                    if (data.modelDatas && data.modelDatas != '') {
                        TH.DRdropDatas = JSON.parse(data.modelDatas);
                        TH.moduleID = TH.DRdropDatas[TH.DRdropDatas.length - 1].moduleID;
                    }
                    if (data.modelLines && data.modelLines != '') {
                        let l_1 = JSON.parse(data.modelLines);
                        l_1.forEach(function (item) {
                            TH.LIlineDatasArrs.push([item.startOrderId, item.endOrderId]);
                            let name_1 = '';
                            let isshow = false;
                            if (item.serverName) {
                                name_1 = item.serverName;
                                isshow = true;
                            }
                            TH.serverNames.push({
                                name: name_1,
                                left: -500,
                                top: -500,
                                isshow: isshow,//定义 是否显现 servername  （ds---dt）
                            });
                        })
                    }
                }
            })
        } else {
            this.closeLoading();
        }
        //    线的流动
        setInterval(function () {
            if (vm.LIlineDatasArrs.length != 0) {
                (vm.linearrsIndex)++;
                (vm.linearrsIndex > 20) ? vm.linearrsIndex = 6 : 0;
                vm.refreshCanvasParams('canvasLine', 2, true);//refreshcanvas
            }
        }, 200);
    },
    methods: {
        initDateLC1: function (data) {
            let i_1 = [];
            for (var i = 0; i < data; i++) {
                i_1.push({ name: i < 10 && i != 0 ? '0' + i : i, value: i });
            }
            return i_1;
        },//联动的分方程式
        initDateL: function () {
            this.NDaLIST.hour = this.initDateLC1(24);
            this.NDaLIST.min = this.initDateLC1(60);
            this.NDaLIST.sec = this.initDateLC1(60);
            this.getCronExpressParams();
        },//补充时间联动的列表
        getCronExpressParams: function () {
            let val = this.NDaLIST1;
            var day_flag = 0;
            if (val.oneD == 'week' && typeof val.twoD == 'object') {
                let d_1 = [];
                this.NDaLIST.week.forEach(function (item1, index1) {
                    if (val.twoD[index1]) {
                        d_1.push(item1.value);
                    }
                })
                day_flag = d_1.length == 0 ? '' : d_1.join(',');
            } else {
                day_flag = val.twoD;
            }
            this.CronExpressFn(val.oneD, day_flag, val.threeD[0], val.threeD[1], val.threeD[2], val.threeD[3]);
        },//获取要需要的参数
        CronExpressFn: function (loopQuartzValue, day_flag, frequence, hour, min, sec) {
            var conExpressStr = "";
            //每天
            if (loopQuartzValue == "day") {
                //---------单次
                if (frequence == "once") {
                    if (day_flag == "intervalday") {
                        conExpressStr = parseInt(sec) + " " + parseInt(min) + " " + parseInt(hour) + " * * ?";
                    }
                    if (day_flag == "intervalhour") {
                        conExpressStr = parseInt(sec) + " " + parseInt(min) + " * * * ?";
                    }
                    if (day_flag == "intervalmin") {
                        conExpressStr = parseInt(sec) + " * * * * ?";
                    }
                }
                if (frequence == "loop") {

                    if (day_flag == "intervalday") {
                        conExpressStr = parseInt(sec) + " " + parseInt(min) + " 0/" + parseInt(hour) + " * * ?";
                    }
                    if (day_flag == "intervalhour") {
                        conExpressStr = parseInt(sec) + " 0/" + parseInt(min) + " * * * ?";
                    }
                    if (day_flag == "intervalmin") {
                        conExpressStr = "0/" + parseInt(sec) + " * * * * ?";
                    }
                }
            }
            //-------------------------每周-------------0 15 10 ? * MON-FRI -----------
            if (loopQuartzValue == "week") {

                if (day_flag == "intervalday") {
                    day_flag = 1;
                }
                if (day_flag == "intervalhour") {
                    day_flag = 2;
                }
                if (day_flag == "intervalmin") {
                    day_flag = 3;
                }
                if (frequence == "once") {
                    conExpressStr = parseInt(sec) + " " + parseInt(min) + " " + parseInt(hour) + " ? * " + day_flag;
                }
                if (frequence == "loop") {
                    conExpressStr = parseInt(sec) + " " + parseInt(min) + " 0/" + parseInt(hour) + " ? * " + day_flag;
                }
            }

            //-------------------------每月-------------0 15 10 ? * 任何时间 -----------
            if (loopQuartzValue == "month") {

                if (day_flag == "intervaldayon") {
                    day_flag = 1;
                }
                if (day_flag == "intervaldaytw") {
                    day_flag = 2;
                }
                if (day_flag == "intervaldayth") {
                    day_flag = 3;
                }
                if (frequence == "once") {
                    conExpressStr = parseInt(sec) + " " + parseInt(min) + " " + parseInt(hour) + " " + "1 * ? * ";
                }
                if (frequence == "loop") {
                    conExpressStr = parseInt(sec) + " " + parseInt(min) + " 0/" + parseInt(hour) + " 1/" + day_flag + " * ? * ";
                }
            }
            this.NDaLIST1.CronExpress = conExpressStr;
        },//根据联动时间计算CronExpress
        loading: function (text) {
            this.loadLayerIndex = layer.msg(text, { time: 1800000, icon: 16, shade: [0.5, '#000'] });
        },//加载中
        closeLoading: function () {
            layer.close(this.loadLayerIndex);
            this.loadLayerIndex = -1;
        },//关闭加载中
        cancelS1: function () {
            layer.close(this.layerIndexS1);
            this.layerIndexS1 = -1;
        },//关闭layer --保存弹框
        cancel: function () {
            layer.close(this.layerIndex);
            this.layerIndex = -1;
        },//关闭layer
        cancel2: function () {
            layer.close(this.layerIndex2);
            this.layerIndex2 = -1;
        },//关闭layer 2
        //0.2----视图工具栏 ---- 放大缩小
        initScale: function () {
            de.initScale(this);
        },//初始化比例
        narrow: function () {//每次倍数比  +10
            de.narrow(this);
        },//缩小
        blowUp: function () {//每次倍数比  +10
            de.blowUp(this);
        },//放大
        directionClick: function (type) {
            de.directionClick(this, type);
        },//视图四周移动
        xvdown: function (ev) {
            de.xvdown(this, ev);
        },//视图中 的  工具栏  放大缩小  --- 显示窗口的鼠标按下
        viewmobile: function (ev) {
            de.viewmobile(this, ev);
        },//视图中的 的移动视图
        validationView: function (type, datas) {//datas  为正常数据要移动后的值  type 0左右//1上 下
            de.validationView(this, type, datas);
        },//验证视图  是否符合要求
        refreshViewBtnWH: function () {
            de.refreshViewBtnWH(this);
        },//刷新 视图工具放大缩小 中可视区域的width  height  当lefttop  超出时，更正
        asideConfigurationBtn: function (isshow) {
            if (isshow) {
                $('#asideConfiguration').removeClass('hide');
            } else {
                $('#asideConfiguration').addClass('hide');
            }
        },//模块同步 信息  菜单
        asideOperationBtn: function (isshow) {
            if (isshow) {
                $('#asideOperation').removeClass('hide');
            } else {
                $('#asideOperation').addClass('hide');
            }
        },//模块同步 信息  缩放
        asideSetupBtn: function (isshow) {
            if (isshow) {
                $('#asideSetup').removeClass('hide');
            } else {
                $('#asideSetup').addClass('hide');
            }
        },//视图中  工具  内  设置
        //0.3----视图工具栏 ---- 设置配置下
        asideSetupSelect: function (index1) {
            de.asideSetupSelect(this, index1);
        },//设置中按钮点击
        addSetUpLine: function () {
            de.addSetUpLine(this);
        },//连线的保存
        SetUpLineValidation: function () {
            de.SetUpLineValidation(this);
        },//连线配置内的验证
        //1.0----流程之间的拖拽
        allowDrop: function (ev) {
            ev.preventDefault();
        },
        drag: function (ev, index) {
            ev.dataTransfer.setData("Text", 'text');
            this.DRdragDropDatas.index2 = index;
            this.DRdragDropDatas.type = 0;
            this.defaultOff();//每次拖拽  刷新默认关闭
        },
        dragMsg: function () {
            layer.msg('请拖拽至表格区域');
        },//拖拽时  点击 弹出提示框
        dragFlow: function (ev, index) {
            ev.dataTransfer.setData("Text", 'text');
            de.dragFlow(this, ev, index);
        },
        drop: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            de.drop(this, ev);
        },
        saveProcess: function (index) {
            let type = this.HserverTypeClick[index].type;
            if (type == 0) {//全部上传
                this.UploadFn_1(1);//执行全部上传---打开弹框- 1全部上传
            } else if (type == 1) {

            } else if (type == 2) {

            } else if (type == 3) {//保存
                this.saveDo1({ isLayersg: true });//触发保存
            } else if (type == 4) {//退出
                layer.confirm('是否退出非结构化流程', { btn: ['退出', '退出并保存', '取消'], icon: 3 }, function (index) {
                    layer.close(index);
                    // parent.switchNav3(5);
                    window.close();
                }, function (index) {
                    //退出并保存
                    layer.close(index);
                    vm.saveDo1({ isLayersg: true });//触发保存
                    vm.importProcessData.isenter = true;
                }, function (index) {
                    layer.close(index);
                });
            }
        },//header---事件
        saveProssFn: function () {
            $('#saveProssForm').data('bootstrapValidator').validate();
            if (!$('#saveProssForm').data('bootstrapValidator').isValid()) {
                layer.msg('请输入正确的数据', { icon: 2 });
                return;
            }
            this.saveDo2({
                flowName: this.saveProssBox[0].value,
                flowDescribe: this.saveProssBox[1].value,
                isLayersg: true
            });
        },//保存流程窗口的 保存
        saveDo1: function (params_1) {
            let name = this.importProcessData.flowName;
            if (name == '') {//打开书写保存框
                kafka.customFormValidation(3, vm.saveProssBox, '#saveProssForm');
                $('#saveProssBox').removeClass('hide');
                this.layerIndexS1 = layer.open({
                    type: 1,
                    content: $('#saveProssBox'),
                    title: '保存流程的名称信息',
                    area: ['400px', '230px'],
                    end: function () {
                        $('#saveProssBox').addClass('hide');
                        $('#saveProssForm').bootstrapValidator('destroy');
                    },
                })
            } else {//保存
                if (params_1) {
                    this.saveDo2(params_1);
                } else {
                    this.saveDo2();
                }
            }
        },//保存开始第一步
        saveDo2: function (params_1) {
            if (params_1 && params_1.isLayersg) {
                vm.loading('保存流程中 ...');
            }
            let a4 = [];
            let a1 = this.DRdropDatas;
            this.LIlineDatasArrs.forEach(function (item, index) {
                a4.push({
                    startId: a1[item[0]].engineID,
                    endId: a1[item[1]].engineID,
                    startOrderId: item[0],
                    endOrderId: item[1],
                    startModuleId: a1[item[0]].moduleID,
                    endModuleId: a1[item[1]].moduleID,
                    // serverName:vm.serverNames[index].name
                });
                if (vm.serverNames[index].name != '') {
                    a4[a4.length - 1]['serverName'] = vm.serverNames[index].name;
                }
            })

            var params = {
                tokenID: parent.tokenID,
                flowId: this.flowID,
                flowName: this.importProcessData.flowName,
                flowDescribe: this.importProcessData.flowDescribe,
                userID: parent.userID,
                modelDatas: JSON.stringify(this.DRdropDatas),
                modelLines: JSON.stringify(a4)
            }
            if (params_1) {
                for (var i in params_1) {
                    params[i] = params_1[i];
                }
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: params,
                url: basePath + 'unstructuredServiceByDynamicFlow/saveModuleEngineFlowInfo.do',
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    };
                    data = data.dataInfo;
                    if (data.flag == 'true') {
                        if (vm.importProcessData.flowName == '') {//新建
                            vm.cancelS1();
                            vm.importProcessData.flowName = vm.saveProssBox[0].value;
                            vm.importProcessData.flowDescribe = vm.saveProssBox[1].value;
                        }
                        if (params_1 && params_1.isLayersg) {
                            layer.msg('保存流程成功', { icon: 1, time: 1200 }, function () {
                                if (vm.importProcessData.isenter) {//退出非结构安装
                                    // parent.switchNav3(5);
                                    window.close();
                                }
                            });
                        }
                    } else {
                        layer.msg('保存流程失败', { icon: 2, time: 1200 });
                    }
                },
            });
        },//保存开始第二步
        /*2、0---视图的事件*/
        addModel: function (index) {
            var type = vm.HserverTypeClick[vm.DRdragDropDatas.index2].type;
            if (type == 1) {//生成的是HTTP模块
                http.addModel_http(this, index);
            }
        },//添加时生成模块






        /*3、0视图*/
        //3、1视图内的事件
        clickSelectModel: function (index) {
            // de.openSelectProcessModel(this,index);
            this.DRcontextmenuData.type = this.DRdropDatas[index].type;
            this.DRcontextmenuData.index1 = index;
        },//单机选中模块，
        dbclickSelectModel: function (index, isedit) {
            this.DRcontextmenuData.type = this.DRdropDatas[index].type;
            this.DRcontextmenuData.index1 = index;
            this.clickSelectMenu(0);
        },//双机选中模块，并且弹出配置
        contextmenuSModel: function (ev, index, type) {

            /*
            * type --当前右键的类型
            * ==2时--servername的右键
            * */

            ev.preventDefault();
            let bh = $('body').height();
            let bw = $('body').width();
            this.DRcontextmenuData.istrue = true;
            this.DRcontextmenuData.index1 = index;//右键单击的索引
            if (type == 2) {//servername
                this.DRcontextmenuData.type = 0;//右键菜单的类型--servername
            } else {
                this.DRcontextmenuData.type = this.DRdropDatas[index].type;//右键菜单的类型
            }
            let child_1 = this.DRnEWData[this.DRcontextmenuData.type].child;
            let h = child_1.length * 34 + 40;
            this.DRcontextmenuData.left2 = bw < ev.clientX + 200 ? bw - 200 : ev.clientX;
            let t = ev.clientY - h / 2;
            let minT = bh - h;
            this.DRcontextmenuData.top2 = t < 40 ? 40 : (t > minT ? minT : t);
            this.DRcontextmenuData.height = h;
            /*判断当前是否有二级菜单*/
            let dat_4 = this.DRdropDatas[index];
            child_1.forEach(function (item) {
                if (item.child && item.child.length > 0) {
                    item.child = [];
                    item.isshowChild = false;
                }
            })
            if (dat_4.detailsTp && dat_4.detailsTp.length > 0) {//有二级菜单
                child_1.forEach(function (item) {
                    if (dat_4.detailsTp.indexOf(item.type) != -1) {
                        item.child = dat_4.detailsDa;
                    }
                })
            }
        },//右键单机
        menuChild: function (index, type) {
            let child_1 = this.DRnEWData[this.DRcontextmenuData.type].child[index];
            if (child_1.child && child_1.child.length > 0) {
                if (type) {
                    child_1.isshowChild = false;
                } else {
                    child_1.isshowChild = true;
                }
            }
        },//二级菜单进入 type==0  二级菜单离开type==1
        clickSelectMenu: function (index) {
            this.DRcontextmenuData.istrue = false;
            let type1 = this.DRcontextmenuData.type;
            let type2 = this.DRnEWData[this.DRcontextmenuData.type].child[index].type;
            let index1 = this.DRcontextmenuData.index1;
            if (type1 == 0) {//servername
                if (type2 == 0) {//基本配置
                    this.editServerNames(index1, 0);
                } else if (type2 == 1) {//删除
                    this.moduleDeleteAjax(0);
                }
            } else if (type1 == 1) {//http
                if (type2 == 0) {//基本配置
                    de.openModule(this, type1);
                } else if (type2 == 1) {//删除
                    this.moduleDeleteAjax(1);
                }
            } else if (type1 == 2) {//ftp
                if (type2 == 0) {//基本配置
                    de.openModule(this, type1);
                } else if (type2 == 1) {//删除
                    this.moduleDeleteAjax(1);
                }
            } else if (type1 == 3) {//kafka
                if (type2 == 0) {//基本配置
                    if (this.DRdragDropDatas.index2 == -1) {//修改
                        let data = this.DRdropDatas[index1];
                        let module_n = JSON.parse(data.kafkaList);
                        vm.kafkaList = module_n;
                    }
                    de.openModule(this, type1);
                } else if (type2 == 1) {//上传
                    this.UploadFn_1(0);
                } else if (type2 == 2) {/*详细配置*/ } else if (type2 == 3) {//删除
                    this.moduleDeleteAjax(1);
                    // if(this.DRdropDatas[index1].isupload){//kaka已上传
                    //     this.moduleDeleteAjax(1);
                    // }else{//kafka未上传（本地删除）
                    //     // this.moduleDelete(1);
                    //     this.moduleDeleteAjax(1);
                    // }



                }
            } else if (type1 == 4) {//oracle
                if (type2 == 0) {//基本配置
                    if (this.DRdragDropDatas.index2 == -1) {//修改
                        let data = this.DRdropDatas[index1];
                        let module_n = JSON.parse(data.oracleList);
                        vm.oracleList = module_n;
                    }
                    de.openModule(this, type1);
                } else if (type2 == 1) {//上传
                    this.UploadFn_1(0);
                } else if (type2 == 2) {/*详细配置*/ } else if (type2 == 3) {//删除
                    this.moduleDeleteAjax(1);
                    // if(this.DRdropDatas[index1].isupload){//kaka已上传
                    //     this.moduleDeleteAjax(1);
                    // }else{//kafka未上传（本地删除）
                    //     // this.moduleDelete(1);
                    //     this.moduleDeleteAjax(1);
                    // }



                }
            }
        },//右键 选中菜单后
        clickSelectMenuCh: function (index2, index) {
            let index_e = this.DRcontextmenuData.index1;
            let child_1 = this.DRnEWData[this.DRcontextmenuData.type].child[index];
            let chid_2 = child_1.child[index2];
            let isupload = this.DRdropDatas[index_e].isupload;
            if (isupload) {
                this.clickSelectMenuChLayer(chid_2);
            } else {
                layer.msg('请先上传当前模块', { icon: 0, time: 1200 });
            }
        },//二级菜单 的选择(判断当前--是否符合打开二级菜单的要求)
        clickSelectMenuChLayer: function (chid_2) {
            /*重置*/
            this.kafaListData.detailData = {};

            var url = 'serviceByDynamicFlow/getModuleEngineFlowConfigInfoByEngineStep.do';
            let data_1 = this.DRdropDatas[this.DRcontextmenuData.index1];
            var str123 = { "paramID": chid_2.mid, "paramValue": chid_2.value };
            var datas = {
                flowID: this.flowID + '',
                engineID: data_1.engineID + '',
                tokenID: parent.tokenID,
                moduleID: data_1.moduleID,
                paramInfo: JSON.stringify(str123)
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: datas,
                url: basePath_par + url,
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    };
                    data = data.dataInfo;
                    if (data.msg == '') {
                        var cc = '无信息';
                        var area = ['80%', '80%'];
                        $('#CMDDeConfig .pre').val(cc);
                    } else {
                        $('#CMDDeConfig .pre').val(data.fileContent);
                    }
                    vm.kafaListData.detailData['fileName'] = data.fileName;
                    $('#CMDDeConfig').removeClass('hide');
                    vm.layerIndex = layer.open({
                        type: 1,
                        title: '详细配置信息',
                        area: ['80%', '90%'],
                        content: $('#CMDDeConfig'),
                        end: function () {
                            //重置清空
                            $('#CMDDeConfig .pre').val('');
                            $('#CMDDeConfig').addClass('hide');
                        }
                    });
                }
            });
        },//二级菜单打开layer
        CMDDeConfigSave: function () {
            this.loading('更改中 ...');
            let data_1 = this.DRdropDatas[this.DRcontextmenuData.index1];
            let str123 = $('#CMDDeConfig .pre').val();
            let params = {
                flowID: this.flowID,
                tokenID: parent.tokenID,
                engineID: data_1.engineID,
                moduleID: data_1.moduleID,
                fileName: this.kafaListData.detailData.fileName,
                paramString: str123
            }
            $.ajax({
                type: 'post',
                data: params,
                url: basePath_par + 'serviceByDynamicFlow/saveKafkaModuleEngineConfFile.do',
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    }
                    data = data.dataInfo;
                    vm.closeLoading();
                    if (data) {
                        layer.msg('保存成功', { icon: 1 })
                        vm.cancel();
                    } else {
                        layer.msg('保存失败', { icon: 2 })
                    }
                }
            });
        },//详细配置--保存
        UploadFn_1: function (type) { /*type0--上传  1--全部上传*/
            let TH = this;
            this.upDatas.type = type;
            let title1 = '';
            if (type % 2 == 0) {//单操作
                let index1 = this.DRcontextmenuData.index1;
                this.upDatas.index1 = index1;
                title1 = '上传 [ ' + this.DRdropDatas[index1].name + ' ]';
            } else {//多操作
                title1 = '全部上传';
                this.upDatas.isshow = true;
                this.upDatas.isshow2 = true;
                this.upAllNames = [];
                let z_1 = [];
                let z_2 = [];
                this.DRdropDatas.forEach(function (item1, index1) {
                    if (item1.type == 3) {//kafka 有上传
                        z_1.push(index1);
                        z_2.push({
                            name: TH.DRdropDatas[index1].name,
                            state: 3,
                            msg: '无信息 。'
                        })
                    }
                })
                this.upDatas.data = z_1;
                this.upAllNames = z_2;
                // start 0---执行中加载中  1完成  2失败 3等待中
                this.upDatas.index1 = z_1[0];
                this.upAllNames[0].state = 0;
            }
            this.layerIndex = layer.open({
                type: 1,
                title: title1,
                area: ['80%', '80%'],
                content: $('#uploadBox'),
                success: function (layero) {
                    var a = $(layero);
                    a.find('.layui-layer-content').css('height', a.height() - 42 + 'px');
                    $('#uploadBox').removeClass('hide');
                    vm.UploadFn_2();
                },
                end: function (layero) {
                    var a = $(layero);
                    a.find('.layui-layer-content').css('height', a.height() - 42 + 'px');
                    $('#uploadBox').addClass('hide');
                    /*重置cmd 基本信息*/
                    $('#uploadBox  .uploadPro1').attr('aria-valuenow', 0).attr('style', 'width:' + 0 + '%;');
                    $('#uploadBox  .uploadPro2').html(0 + '%');
                    //详情
                    $('#uploadBox  .uploadBox_1_1_1').html('');
                }
            });
        },//上传(打开layer)
        UploadFn_2: function () {//类型 0--kafka单上传
            let type = this.upDatas.type;
            let index1 = this.upDatas.index1;
            let urls = ['uploadEngineModuleToRemotrHost', 'operationEngineModuleToRemotrHost', 'operationEngineModuleToRemotrHost'];
            let datas = {
                flowID: this.flowID + '',
                engineID: this.DRdropDatas[index1].engineID + '',
                tokenID: parent.tokenID,
                moduleID: this.DRdropDatas[index1].moduleID,
                engineTypeCode: this.DRdropDatas[index1].engineTypeCode
            }
            let url = 'serviceByModuleOperation/' + urls[Math.floor(type / 2)] + '.do';
            let TH = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                timeout: 1800000, //超时时间设置，单位毫秒（半个小时）
                data: datas,
                url: basePath_par + url,
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        if (type % 2 == 1) {//多操作
                            let n_1 = TH.upDatas.data.indexOf(index1);
                            TH.upAllNames[n_1].state = 2;
                        }
                        return false;
                    };
                    data = data.dataInfo;
                    /*循环的清除 --start*/
                    if (gh) {
                        clearInterval(gh);//  清除循环
                    }
                    setTimeout(function () {
                        if (gh) {
                            clearInterval(gh);//  清除循环
                        }
                    }, 100);
                    /*循环的清除 --end*/
                    if (data.flag == 'true') {//成功
                        TH.DRdropDatas[index1].isupload = true;
                        if (type % 2 == 1) {//多操作
                            let n_1 = TH.upDatas.data.indexOf(index1);
                            let n_l = TH.upDatas.data.length;
                            TH.upAllNames[n_1].state = 1;
                            if (n_1 + 1 == n_l) {//全部完成
                                successFnLa('全部上传成功。 是否关闭上传窗口 ?');
                            } else {//有未完成的
                                TH.upDatas.index1 = TH.upDatas.data[n_1 + 1];
                                TH.upAllNames[n_1 + 1].state = 0;
                                TH.UploadFn_2();
                            }
                        } else {//单操作
                            successFnLa('上传成功。 是否关闭上传窗口 ?');
                        }
                        function successFnLa(title) {
                            layer.open({
                                title: '提示信息'
                                , content: title
                                , btn: ['确认', '取消']
                                , yes: function (index) {
                                    layer.closeAll();
                                }, no: function (index) {
                                    layer.close(index);
                                }
                            });
                        }
                    } else {
                        if (type % 2 == 1) {//多操作
                            let n_1 = TH.upDatas.data.indexOf(index1);
                            TH.upAllNames[n_1].state = 2;
                        }
                        layer.msg('上传失败', { icon: 2, time: 1200 });
                    }
                    //    自动保存
                    vm.saveDo1();
                },
                error: function () {
                    layer.msg('打开错误', { icon: 2 });
                    if (gh) {
                        clearInterval(gh);//  清除循环
                    }
                    let n_1 = TH.upDatas.data.indexOf(index1);
                    TH.upAllNames[n_1].state = 2;
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        layer.msg('超时了', { time: 0 });
                        if (gh) {
                            clearInterval(gh);//  清除循环
                        }
                        let n_1 = TH.upDatas.data.indexOf(index1);
                        TH.upAllNames[n_1].state = 2;
                    }
                }
            });
            this.UploadFn_3();
        },//上传（保存信息）
        UploadFn_3: function () {
            let TH = this;
            let type = this.upDatas.type;
            let index1 = vm.upDatas.index1;
            gh = setInterval(function () {
                let urls = ['getUploadFileInfomation', 'getModuelOperationInfomation', 'getModuelOperationInfomation'];
                let datas = {
                    flowID: vm.flowID + '',
                    engineID: vm.DRdropDatas[index1].engineID + '',
                    tokenID: parent.tokenID,
                    moduleID: vm.DRdropDatas[index1].moduleID,
                }
                let url = 'serviceByModuleOperation/' + urls[Math.floor(type / 2)] + '.do';
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: datas,
                    url: basePath_par + url,
                    success: function (data) {
                        if (!verificationInstruction(data)) {
                            return false;
                        };
                        data = data.dataInfo;

                        if (data.msg == '') {
                            var cc = '无信息请稍等 ...';
                        } else {
                            var cc = data.msg.replace(/[\r\n]/g, "<br/>");
                        }
                        var a1 = data.percenTage;
                        let msgs = '';
                        if (type % 2 == 0) {//kafka上传 (单操作)
                            // var a1=data.percenTage;
                            msgs = cc;
                        } else {//多操作
                            let d_1 = TH.upDatas.data;
                            let d_l = d_1.length;
                            let index1 = TH.upDatas.index1;
                            let index2 = d_1.indexOf(index1);
                            a1 = a1 * (1 / d_l) + (index2 / d_l) * 100;
                            let n_1 = TH.upDatas.data.indexOf(index1);
                            TH.upAllNames[n_1].msg = cc;
                            msgs = '';
                            TH.upAllNames.forEach(function (item) {
                                msgs = msgs + '*********' + item.name + '*********<br/>信息如下 ：<br/><br/>' + item.msg + '<br/><br/><br/>';
                            })
                        }
                        if (a1 != null && parseFloat(a1) != 0) {
                            //进度条
                            $('#uploadBox  .uploadPro1').attr('aria-valuenow', a1).attr('style', 'width:' + a1 + '%;');
                            $('#uploadBox  .uploadPro2').html(a1 + '%');
                        }
                        //详情
                        $('#uploadBox  .uploadBox_1_1_1').html(msgs);
                        $('#cmdbtn1').trigger('click');
                    },
                    error: function () {
                        layer.msg('打开错误', { icon: 2 });
                        if (gh) {
                            clearInterval(gh);//  清除循环
                        }
                        let n_1 = TH.upDatas.data.indexOf(index1);
                        TH.upAllNames[n_1].state = 2;
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            layer.msg('超时了', { time: 0 });
                            if (gh) {
                                clearInterval(gh);//  清除循环
                            }
                            let n_1 = TH.upDatas.data.indexOf(index1);
                            TH.upAllNames[n_1].state = 2;
                        }
                    }
                });
            }, 100);
        },//上传（取得循环上传的实时信息）
        moduleDeleteAjax: function (type) {
            let TH = this;
            layer.confirm('是否删除服务器上的模块？会影响其他模块', { btn: ['是', '否'] }, function (index) {
                var f1 = vm.DRdropDatas[vm.DRcontextmenuData.index1];
                var data = {
                    flowID: vm.flowID,
                    engineID: f1.engineID,
                    tokenID: parent.tokenID,
                    moduleID: f1.moduleID
                }
                $.ajax({
                    type: 'post',
                    data: data,
                    url: basePath + 'unstructuredServiceByDynamicFlow/deleteConfigureByFlowAndEngineID.do',
                    success: function (data) {
                        if (!verificationInstruction(data)) {
                            return false;
                        };
                        data = data.dataInfo;
                        if (data) {
                            vm.moduleDelete(type);
                        }
                    },
                });
                layer.close(index);
            }, function () {
                layer.close(index);
            })
        },//模块的删除 ajax
        moduleDelete: function (type) {
            let i_1 = this.DRcontextmenuData.index1;
            if (type == 0) {//删除 servername
                this.LIlineDatasArrs.splice(i_1, 1);
                this.serverNames.splice(i_1, 1);
            } else if (type == 1) {//删除模块
                /*删除模块*/
                this.DRdropDatas.splice(i_1, 1);
                /*删除连线*/
                let n_l = [];
                let n_s = [];
                this.LIlineDatasArrs.forEach(function (item1, index1) {
                    if (item1[0] != i_1 && item1[1] != i_1) {
                        n_l.push([]);
                        n_s.push(vm.serverNames[index1]);
                        if (i_1 < item1[0]) {
                            n_l[n_l.length - 1].push(item1[0] - 1);
                        } else {
                            n_l[n_l.length - 1].push(item1[0]);
                        }
                        if (i_1 < item1[1]) {
                            n_l[n_l.length - 1].push(item1[1] - 1);
                        } else {
                            n_l[n_l.length - 1].push(item1[1]);
                        }
                    }
                })
                this.LIlineDatasArrs = n_l;
                this.serverNames = [];
                this.serverNames = n_s;
            }
            this.DRcontextmenuData.index1 = -1;
            /*重新绘制连线*/
            this.refreshCanvasParams('canvasLine', 2, true);
            //注销右键菜单
            this.DRcontextmenuData.istrue = false;
            //接口的删除
            layer.msg('删除成功', { icon: 1, time: 1200 }, function () {
                vm.saveDo1();
            });
        },//模块的删除
        //3.3----视图内连线
        getWdata: function (a, b, c) {
            de.getWdata(this, a, b, c);
        },//取得导航信息
        mouseenterModel: function (event, index) {
            de.mouseenterModel(this, event, index)
        },// 进入模块后
        mouseleaveModel: function () {
            //清除信息
            this.prossDatas.left = -500;//导航模块
            this.prossDatas.top = -500;// 导航模块
        },//离开模块
        selectOverDown: function () {
            de.selectOverDown(this);
        },//鼠标按下 激活连线事件
        lineDataSet: function (index1, index2, type) {
            de.lineDataSet(this, index1, index2, type);
        },// 关于 连线的操作  @param  index1 起点下坐标  index2 尾点下坐标   type操作数据类型  0（根据起始结束点坐标 检测是否可以添加 并添加）
        //3.4-----canvas  绘制
        refreshCanvasParams: function (id, type, istrue) {
            de.refreshCanvasParams(this, id, type, istrue);
        },//关于重新绘制 所需参数  arrs//   arrs虚线的间隔  /// canvas id///type  0  划入未呈线////1可成线////2绘制成线  istrue是只是清空（false），还是重新绘制(true)
        refreshCanvas: function (type) {//类型 鼠标按下到抬起  type  0  划入未呈线////1可成线////2绘制成线
            de.refreshCanvas(this, type);
        },//刷新canvas
        //3、4----右键注销
        defaultOff: function () {
            vm.DRcontextmenuData.istrue = false;//注销右键
        },

        /*3.5----servername*/
        editServerNames: function (index2, type) {
            this.serverNameData.index1 = index2;
            this.serverNameBox[0].value = this.serverNames[index2].name;
            $('#servernameBox_1').removeClass('hide');
            this.layerIndex = layer.open({
                type: 1,
                content: $('#servernameBox_1'),
                title: '编辑serviceName名称',
                area: ['400px', '230px'],
                end: function () {
                    $('#servernameBox_1').addClass('hide');
                }
            })
        },//配置servername
        saveServerName2: function () {
            let d_1 = this.serverNames;
            let index_1 = this.serverNameData.index1;
            let val_1 = this.serverNameBox[0].value;
            let istrue = false;
            d_1.forEach(function (item1, index1) {
                if (index_1 != index1 && item1.name == val_1) {
                    istrue = true;//有重复
                }
            })
            if (istrue) {
                layer.msg('serviceName有重复,请重新编辑', { icon: 0, time: 1200 });
                return;
            }
            this.serverNames[index_1].name = this.serverNameBox[0].value;
            this.serverNameData.index1 = -1;
            this.cancel();
            layer.msg('保存serviceName成功', { icon: 1, time: 1200 });
            this.saveDo1();
        },//servername的保存
        /*kafka---方法*/
        /*选择kafka的版本*/
        selectKafka: function () {
            let data_1 = this.kafkaVersion[this.kafkaVersionD.selectIndex];
            this.kafkaVersionD.engineID = data_1.id;
            this.kafkaVersionD.engineTypeCode = data_1.engineTypeCode;
            this.kafkaVersionD.moduleID = this.moduleID + 1;
            this.loading('加载kafka配置界面，请稍等 ...');
            $.ajax({
                type: 'post',
                dataType: 'json',
                timeout: 1800000, //超时时间设置，单位毫秒
                data: { tokenID: parent.tokenID, engineID: this.kafkaVersionD.engineID, flowID: this.flowID },
                url: basePath_par + 'serviceByDynamicFlow/getSystemEngineModuleConfInfo.do',
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    };
                    data = data.dataInfo;
                    if (!data.length) {
                        layer.msg('此版本暂时没有对应配置信息，请选择其他版本', { icon: 3 });
                    }
                    //设定（type===config 时 所有端口号均不能相同）
                    data.forEach(function (item1, index1) {
                        if (item1.modelType == 'config') {
                            let differentArrs = [];
                            item1.modleList.forEach(function (item2, index2) {
                                let a_1 = item2.paramName.toLowerCase()
                                if (a_1.indexOf('port') != -1) {
                                    differentArrs.push(item2.paramName);
                                    item2['differentArrs'] = true;
                                }
                            })
                            if (differentArrs.length > 1) {
                                item1['differentArrs'] = differentArrs;
                            }
                        }
                    })
                    vm.closeLoading();
                    data.forEach(function (item1) {
                        item1.modleList.forEach(function (item2) {
                            item2.value = item2.defaultValue;
                        })
                    })
                    vm.kafkaList = data;
                },
                error: function () {
                    layer.msg('打开错误', { icon: 2 });
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        layer.msg('超时了', { time: 0 });
                    }
                }
            });
        },//选择kafka的版本以后，进入配置kafka界面
        /*关于kafka的方法*/
        kafkaYTab: function (type) {
            kafka.kafkaYTab(this, type);
        },//kafka远程配置页面的--切换
        kafkaPrev: function () {
            kafka.kafkaPrev(this);
        },//kafka--上一步
        kafkaNext: function () {
            kafka.kafkaNext(this);
        },//kafka--下一步
        selectDBID: function () {
            let a1 = $('#type_kafka #dbTableBox').bootstrapTable('getSelections');
            if (a1.length == 0) {
                layer.msg('请选择数据', { icon: 2, time: 1200 });
                return;
            }
            layer.confirm('数据源选择后无法修改，确认选择当前数据源？', { icon: 3, btn: ['确认', '取消'] }, function (index) {
                vm.TLdbIDList = a1[0];
                vm.kafaListData.isshowTable = false;
                layer.close(index);
            }, function (index) {
                layer.close(index);
            })
        },//dbid --保存
        kafkaYTableSearch: function () {
            kafka.kafkaYTableSearch();
        },//远程配置---选择已有---搜索按钮
        kafkaYSelc: function () {
            kafka.kafkaYSelc(this);
        },//远程配置---选择已有--应用此条
        kafkaSave: function () {
            kafka.kafkaSave(this);
        },
        uploadChange: function (paramName, index1) {
            var file = $(".file" + paramName).val();
            var pos = file.lastIndexOf("\\");
            var fileName = file.substring(pos + 1);
            this.kafkaList[this.kafkaStep].modleList[index1].value = fileName;
            this.kafkaList[this.kafkaStep].modleList[index1].ULstat = 1;
            $('#' + paramName).attr('datastat', 1);
            setTimeout(function () {
                $('#customForm').data('bootstrapValidator').revalidateField(paramName);
            }, 10);
        },//上传文件的更改
        upLoadFlie: function (paramName, index1) {
            kafka.upLoadFlie(this, paramName, index1);
        },//上传文件
        /*new--http---ftp*/
        /*公共的*/
        clearText: function () {
            if ($('#N_http .selectpicker')) {
                for (var i = 0; i < $('#N_http .selectpicker').length; i++) {
                    $('#N_http .selectpicker').eq(i).selectpicker('destroy');
                }
            }
        },//清除内容
        n_prev: function () {
            /*清除*/
            this.clearText();
            this.COM1Data.step1--;
            let ty_ = this.COM1Data.type1;
            if (this.COM1Data.step1 == 1 && ty_ == 2) {//ftp--第一步
                //    init step---表单
                this.kafkaInitForm = 10;
            }
        },//上一步
        n_next: function () {
            let ty_ = this.COM1Data.type1;
            // this.COM1Data.step1++;
            if (ty_ == 1) {//http
                http.n_next(this);
            } else if (ty_ == 2) {//ftp
                ftp.n_next(this);
            }
        },//下一步
        slideToggle1: function (className) {
            $('.' + className).slideToggle();
        },//折叠 操作
        //3
        drag_col: function (ev, name, type) {
            vm.evTarget = ev.target;
            ev.dataTransfer.setData('Text', name);
            ev.dataTransfer.setData('type', type);
        },//http拖拽--拖动时
        drop_col: function (ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("Text");
            var data1 = ev.dataTransfer.getData("type");
            if (data == 'check-all') {
                //    全选
                vm.COM1COLD.list.forEach(function (item, index) {
                    if (!item.checkHttp) {
                        item.checkHttp = true;
                        vm.COM1COLD.select.push(item);
                    }
                })
                this.ischeckboxAll = false;
            } else {
                let istrue = true;
                vm.COM1COLD.select.forEach(function (item, index) {
                    if (item.name == data) {
                        layer.msg("数据已存在，不可拖拽此条数据", { icon: 2, time: 3000 });
                        istrue = false;
                    }
                })
                if (istrue) {
                    vm.COM1COLD.list.forEach(function (item, index) {
                        if (item.name == data) {
                            item.checkHttp = true;
                            vm.COM1COLD.select.push(item);
                        }
                    })
                }
            }



        },//拖动放置事发生的事件
        tableDelOne_col: function (ev, item) {
            //删除数组中选中的数据
            vm.COM1COLD.select.forEach(function (a, index) {
                if (a.name == item.name) {
                    vm.COM1COLD.select.splice(index, 1);
                    vm.COM1COLD.list.forEach(function (item, index) {
                        if (item.name == a.name) {
                            item.checkHttp = false;
                        }
                    })
                }
            })
        },//删除选中的数据
        // checkType
        checkType: function () {
            if (this.COM1COLD.fileFormat == 'asc') {
                if (this.COM1COLD.fileFormat1 == '') {
                    layer.msg('ASCII编码的值不能为空', { icon: 2, time: 1200 });
                    return;
                }
            } else {
                let istrue = false;
                let se1 = this.COM1COLD.fileFormat2;
                for (var i in se1) {
                    if (se1[i].value == '') {
                        istrue = true;
                    }
                }
                if (istrue) {
                    layer.msg('十六进制编码的值不能为空', { icon: 2, time: 1200 });
                    return;
                }
            }
            this.cancel2();
            if (this.COM1Data.step1 != this.COM1Data.steps) {
                this.clearText();
            }
            //原始数据---转--txt数据
            // COM1getD:{
            //     remotePath:'',//远程目录
            //         fileType:'txt',//要返回的类型
            //         fileFormat:'asc',//文件格式 默认ASCII编码
            //         fileFormat1:'',//文件格式 ASCII编码--的值
            //         fileFormat2:[{value:''}],//文件格式 十六进制编码--的值
            //         isColName:true,
            // },//发送的数据格式(step2)
            // COM1COLD:{
            //     module:[],
            //         list:[],//左侧数据
            //         select:[],//右侧数据
            //         moduleSelect:[],//选中后 整合后的模板
            //         // show:[],//下侧数据
            //         txt:'text',//send--格式
            //         fileFormat:'asc',//文件格式 默认ASCII编码
            //         fileFormat1:'',//文件格式 ASCII编码--的值
            //         fileFormat2:[{value:''}],//文件格式 十六进制编码--的值
            // },//得到的数据--获取到可拖拽的列 (step3)

            /**/
            let stds = '';
            if (vm.COM1COLD.fileFormat == 'asc') {
                stds = vm.COM1COLD.fileFormat1;
            } else {
                let ar = [];
                for (var i in vm.COM1COLD.fileFormat2) {
                    ar.push('0X' + vm.COM1COLD.fileFormat2[i].value);
                }
                stds = ar.join(',');
            }
            //txt-txt
            let as_1 = [];
            let as_2 = [];
            vm.COM1COLD.select.forEach(function (item1) {
                as_1.push(item1.name);
                as_2.push(item1.value);
            })
            vm.COM1ShowD.key = as_1.join(stds);
            vm.COM1ShowD.value = as_2.join(stds);
            this.COM1Data.step1++;
        },//选择txt--编码分隔符
        //checkTimer
        checkTimer: function () {
            this.cancel2();
            if (this.COM1Data.step1 != this.COM1Data.steps) {
                this.clearText();
            }
            this.COM1Data.step1++;
        },//选择定时器
        /*http*/
        /*1*/
        httpCheck: function () {

        },//校验是否成功
        //ftp
        //    1
        ftpSearch: function () {
            ftp.ftpSearch();
        },//远程配置---选择已有---搜索按钮
        ftpSelect: function () {
            ftp.ftpSelect(this);
        },//远程配置---选择已有--应用此条
        ftpTab: function (type, params) {
            ftp.ftpTab(this, type, params);
        },//kafka远程配置页面的--切换


        //  oracle---模块
        oracleYTab: function (type) {
            oracle.oracleYTab(this, type);
        },//kafka远程配置页面的--切换
        oracleYSelc: function () {
            oracle.oracleYSelc();
        },//选中主机信息
        oraclePrev: function () {
            oracle.oraclePrev(this);
        },//上一步
        oracleNext: function (type) {
            oracle.oracleNext(this, type);
        },//下一步
        oracleSave: function () {
            oracle.oracleSave(this);
        },//save
        oracleYTableSearch: function () {
            oracle.oracleYTableSearch(this);
        },//搜索
        oracleSelectDBID: function () {
            oracle.oracleSelectDBID();
        },//oracle--数据源


        //  file 目录文件  文件目录---1

        selectFileAjax(params, callback, url) {
            //    选择文件 ajax
            vm.loading('打开中 ...');
            let urls = 'ftpExternalInterFaceController/getFileFolderInfo.do';
            if (url) urls = url;
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: params,
                url: basePath_un + urls,
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    };
                    data = data.dataInfo;

                    //  绑定当前是否是zip
                    let index = vm.fileDirectory.index;
                    let a = vm.fileDirectory.selectData[index];
                    if (a && a.type == 'decompress') {//压缩
                        vm.fileDirectory.isZip = true;
                    } else {
                        vm.fileDirectory.isZip = false;
                    }

                    vm.closeLoading();
                    if (callback) callback(data);



                    let istrue = vm.fileDirectory.isinitTrue;
                    if (data && !istrue) {//
                        vm.fileDirectory.index = -1;
                        vm.fileDirectory.ignore = -1;
                        vm.fileDirectory.selected = -1;
                        if (!vm.COM1getD.typePath) {//文件  --清除下面匹配的
                            vm.fileDirectory.signList = {};
                            vm.fileDirectory.regSignList = {};
                        } else {//目录
                            vm.isRefreshFile();//将上方路径更新到下方
                        }
                    } else {
                        vm.fileDirectory.isinitTrue = false;
                    }


                },
                error: function () {
                    layer.msg('打开错误');
                }
            });
        },
        selectFile(type, index) {
            //    选择文件
            let a = this.fileDirectory.selectData[index];
            let b = this.fileDirectory.root;
            let c = this.N_FTP_1.list;
            this.fileDirectory.index = index;
            let params = {
                tokenID: tokenID,
                hostIp: c[0].value,
                hostPort: c[1].value,
                userName: c[2].value,
                passWord: c[3].value,
                osName: c[5].value,
                linkMode: c[4].value,
                path: this.fileDirectory.root,
                searchType: this.COM1getD.typePath ? 'directory' : 'file',
            };
            if (type == 0) {//选中文件

            } else if (type == 1) {//双机打开文件
                //  ajax
                if (a.type == 'file') {
                    layer.msg('此文件不能打开', { icon: 2, time: 1200 });
                    this.fileDirectory.index = -1;
                    return;
                } else if (a.type == 'decompress') {//解压缩
                    params['fileName'] = a.name;
                    this.selectFileAjax(params, function (data) {
                        if (data && data.date) {
                            vm.fileDirectory.selectData = data.date;
                            vm.fileDirectory.root = data.pathInfo;
                        }
                    }, 'ftpExternalInterFaceController/decompressFileInfo.do');
                    return;
                }
                params['fileFolder'] = a.name;
                this.selectFileAjax(params, function (data) {
                    if (data && data.date) {
                        vm.fileDirectory.selectData = data.date;
                        vm.fileDirectory.root = data.pathInfo;
                    }
                });
            } if (type == 2) {//返回上一级
                params['operateType'] = 'previous';
                this.selectFileAjax(params, function (data) {
                    if (data && data.date) {
                        vm.fileDirectory.root = data.pathInfo;
                        vm.fileDirectory.selectData = data.date;
                    }
                });
            } if (type == 3) {//input  搜索
                this.selectFileAjax(params, function (data) {
                    if (data && data.date) {
                        // let data1=data.date.concat(data.date).concat([
                        //   {name:'nanmdm',isDirectory:false},
                        //   {name:'nanmdm',isDirectory:false},
                        //   {name:'nanmdm',isDirectory:false},
                        //   {name:'nanmdm',isDirectory:false},
                        //   {name:'nanmdm',isDirectory:false}
                        // ]);
                        // console.log(data1)
                        vm.fileDirectory.selectData = data.date;
                        vm.fileDirectory.index = -1;
                    }
                });
            }
        },
        openFile() {
            //    打开文件
            ftp.openFile();
        },

        //多文件目录
        isRefreshFile() {
            //    是否将上层选中路径更新到下方
            if (this.COM1getD.typePath) {//目录
                let index = this.fileDirectory.selectFileIndex;
                this.fileDirectory.selectFileList[index] = this.fileDirectory.root;
            }
        },
        reselectDirectory(index) {
            // 重新选择目录
            this.fileDirectory.selectFileIndex = index;
            //  赋值
            this.fileDirectory.root = this.fileDirectory.selectFileList[index];
            this.selectFile(3);
        },
        deleteFile(index) {
            //    删除目录
            this.fileDirectory.selectFileList.splice(index, 1);
            if (this.fileDirectory.selectFileIndex + 1 > this.fileDirectory.selectFileList.length) {
                this.reselectDirectory(0);
            }
        },
        addDirectory() {
            //    增加目录
            let a = this.fileDirectory.selectFileList;
            a.push(a[a.length - 1]);
        },
        //多文件
        matchingRule() {
            //    匹配规则
            vm.loading('匹配中，请稍等 ...');
            let urls = 'ftpExternalInterFaceController/fileNameFilter.do';
            let a = this.fileDirectory.signList;
            let b = [];
            let c = [];
            for (var i in a) {
                if (a[i].type == 1) c.push(i);//选中
                if (a[i].type == 0) b.push(i);//忽略
            }
            let params = {
                tokenID: tokenID,
                ignoreFileName: b.join(';'),
                fileName: c.join(';'),
            }
            //判断当前左侧是否有zip
            // signType
            let istrue = 'file';
            for (var i in a) {
                if (a[i].signType == 'decompress') istrue = 'decompress';
            }
            vm.COM1getD.signType = istrue;
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: params,
                url: basePath_un + urls,
                success: function (data) {
                    if (!verificationInstruction(data)) {
                        return false;
                    };
                    data = data.dataInfo;

                    vm.closeLoading();
                    let g = {};
                    if (data.filterFileStr) {
                        let f = data.filterFileStr.split(';');
                        f.forEach(function (item, index) {
                            g[item] = {
                                type: 1,
                                name: item
                            }
                        })
                    }
                    if (data.ignoreFilterFileStr) {
                        let f = data.ignoreFilterFileStr.split(';');
                        f.forEach(function (item, index) {
                            g[item] = {
                                type: 0,
                                name: item
                            }
                        })
                    }
                    let type = vm.fileDirectory.regType;
                    // if(type==0){//追加
                    //   for(var i in g){
                    //     vm.fileDirectory.regSignList[i]=g[i];
                    //   }
                    // }else if(type==1){//全部替换
                    //   vm.fileDirectory.regSignList=g;
                    // }else if(type==2){//部分替换
                    //   for(var i in g){
                    //     vm.fileDirectory.regSignList[i]=g[i];
                    //   }
                    // }


                    vm.fileDirectory.regSignList = g;
                },
                error: function () {
                    layer.msg('打开错误');
                }
            });
        },
        signFile(type, index) {
            //    标记选中
            //验证是否添加或者修改
            let a = this.fileDirectory.selectData[index];
            let b = this.fileDirectory.signList;
            let c = b[a.name];
            if (c) {//存在
                if (c.type == type) {//同种类型
                    delete this.fileDirectory.signList[a.name];//删除
                    this.isrefresh = !this.isrefresh;//刷新当前不及时显示的内容
                } else {
                    b[a.name].type = type;
                }
            } else {//不存在
                vm.$set(b, a.name, {
                    type: type,
                    signType: a.type
                });
            }



            // let c=-1;//定义当前不存在选中值
            // let d=false;
            // b.forEach(function (item,index) {
            //   if(item.name==a.name){//存在
            //     c=index;
            //     if(item.type==type){//同种类型
            //       d=true;
            //     }
            //   }
            // })
            //
            // if(c==-1){//不存在
            //   this.fileDirectory.signList.push({
            //     name:a.name,
            //     type:type,
            //   });
            // }else{//存在
            //   if(d){//同种类型
            //     this.fileDirectory.signList.splice(index,1);
            //   }else{//不同种类型
            //     this.fileDirectory.signList[c].type=type;
            //   }
            // }
            //
            //
            //
            //
            // return;

            // let a=this.fileDirectory.ignore;
            // let b=this.fileDirectory.selected;
            // if(type==0){//忽略
            //   if(a==index){
            //     this.fileDirectory.ignore=-1;
            //     return;
            //   }
            //   this.fileDirectory.ignore=index;
            // }else if(type==1){//选中
            //   if(b==index){
            //     this.fileDirectory.selected=-1;
            //     return;
            //   }
            //   this.fileDirectory.selected=index;
            // }
            // let c=this.fileDirectory.ignore;
            // let d=this.fileDirectory.selected;
            // if(type==0&&c==d){//忽略
            //   this.fileDirectory.selected=-1;
            // }else if(type==1&&c==d){//选中
            //   this.fileDirectory.ignore=-1;
            // }
        },
        editRegFile(index) {
            //    编辑规则内容

        },
        deleteRegFile(index) {
            //    删除规则内容
            delete this.fileDirectory.regSignList[index];
            this.isrefresh = !this.isrefresh;//刷新--视图的不更新
        },

        //按钮
        saveFile() {
            //    保存文件
            if (this.COM1getD.typePath) {//目录
                this.COM1getD.remotePath = this.fileDirectory.selectFileList.join(';');
            } else {//文件
                let a1 = this.fileDirectory.signList;
                let a = this.fileDirectory.regSignList;
                // let b=this.fileDirectory.selected;
                let b = true;
                let c = [];
                let d = [];
                let e = 0;

                for (var i in a) {
                    if (a[i].type == 0) {//忽略
                        c.push(a[i].name);
                    }
                    if (a[i].type == 1) {//选中
                        b = false;
                        d.push(a[i].name);
                    }
                    e++;
                }

                if (!e) {
                    layer.msg('请匹配规则', { icon: 2, time: 1200 });
                    return;
                }
                if (b) {
                    layer.msg('请标记要选中的文件', { icon: 2, time: 1200 });
                    return;
                }
                this.COM1getD.signFile = JSON.stringify(a1);
                this.COM1getD.selectFile = d.join(';');
                this.COM1getD.ignoreFile = c.join(';');
                let root = this.fileDirectory.root;
                let root1 = '';
                console.log(this.fileDirectory.isZip)
                if (this.fileDirectory.isZip) {//压缩
                    this.fileDirectory.isZip = false;
                    let signs = vm.COM1getD.osName.substring(0, 1);
                    if (signs == 'l' || signs == 'L') {
                        root1 = root.substring(0, root.lastIndexOf('/'));
                    } else {
                        root1 = root.substring(0, root.lastIndexOf('\\'));
                    }
                } else {
                    root1 = root;
                }
                this.COM1getD.remotePath = root1;
            }



            layer.close(layerIndexTree);
        },
        calcelFile() {
            layer.close(layerIndexTree);
        }
    },
    computed: {

    },
    updated: function () {
        $('.selectpicker').selectpicker('refresh');
        let type = this.kafkaInitForm;
        if (type) {
            if ($('#type_kafka #customForm').html() && type == 1) {//远程配置--新建页面的表单验证
                kafka.customFormValidation(0, vm.KAFremortConfig, '#customForm');
                this.kafkaInitForm = 0;
            } else if ($('#type_kafka #kafkaYTable-table').length != 0 && type == 2) {//远程配置----选择已有数据 initTable
                kafka.kafkaYTable();//初始化
                this.kafkaInitForm = 0;
            } else if ($('#type_kafka #customForm').html() && type == 3) {//--路径配置
                kafka.customFormValidation(0, vm.KAFpathConfigkafka, '#customForm');
                this.kafkaInitForm = 0;
            } else if ($('#type_kafka #customForm').html() && type == 4) {//--后台--基础配置
                let data1 = vm.kafkaList[vm.kafkaStep];
                kafka.customFormValidation(0, data1.modleList, '#customForm', data1.differentArrs);
                this.kafkaInitForm = 0;
            } else if ($('#type_kafka #dbTableBox').length != 0 && type == 5) {//----数据源配置
                kafka.kafkaDBTable(this);//初始化
                this.kafkaInitForm = 0;
            } else if ($('#type_http #customForm').html() && type == 6) {//----ftp--step--1
                let data1 = vm.savefirstinput;
                kafka.customFormValidation(0, data1, '#customForm');
                this.kafkaInitForm = 0;
            } else if ($('#type_ftp #customForm').html() && type == 7) {//ftp---远程配置--新建页面的表单验证
                kafka.customFormValidation(0, vm.KAFremortConfig_ftp, '#customForm');
                this.kafkaInitForm = 0;
            } else if ($('#type_ftp #kafkaYTable-table').length != 0 && type == 8) {//ftp---远程配置----选择已有数据 initTable
                kafka.kafkaYTable();//初始化
                this.kafkaInitForm = 0;
            } else if (type == 9) {//http/ftp---step--3--
                this.ischeckboxAll = false;
                vm.t1 = setTimeout(function () {//
                    initRotate('rotate-http', 3, 60);
                })
                this.kafkaInitForm = 0;
            } else if ($('#N_ftp #customForm').html() && type == 10) {//ftp---远程配置--新建页面的表单验证
                kafka.customFormValidation(0, vm.N_FTP_1.list, '#customForm');
                this.kafkaInitForm = 0;
            } else if ($('#N_ftp #kafkaYTable-table').length != 0 && type == 11) {//ftp---远程配置----选择已有数据 initTable
                kafka.kafkaYTable();//初始化
                this.kafkaInitForm = 0;
            } else if (type == 12) {//连线按钮的验证
                this.SetUpLineValidation();//创建连线内的表单验证
                //生成颜色选择器
                var arrs = ['#lineHover0', '#lineActive0', '#lineSelect0', '#lineSelectBad0'];
                for (var i in arrs) {
                    $(arrs[i]).colpick({
                        colorScheme: 'dark',
                        layout: 'rgbhex',
                        color: 'ff8800',
                        onSubmit: function (hsb, hex, rgb, el) {
                            var arrs = ['lineHover0', 'lineActive0', 'lineSelect0', 'lineSelectBad0'];
                            var a3 = $(el).attr('id');
                            var a1 = arrs.indexOf(a3);
                            var a2 = vm.VLsetUpLine;
                            a2[a1 + 1].value1 = hex;
                            $('#setUpLineForm').data('bootstrapValidator').validateField(a3);
                            $(el).colpickHide();
                        }
                    })
                }
                this.kafkaInitForm = 0;
            } else if ($('#type_oracle #oracleYTable-table-1').length != 0 && type == 13) {//oracle---远程配置----选择已有数据 initTable
                oracle.oracleYTable();//初始化
                this.kafkaInitForm = 0;
            } else if ($('#type_oracle #dbTableBox').length != 0 && type == 14) {//oracle---数据源----选择已有数据 initTable
                oracle.oracleYTable2();//初始化
                this.kafkaInitForm = 0;
            } else if ($('#type_oracle #dbTableBox').length != 0 && type == 15) {//oracle---选择表----选择已有数据 initTable
                oracle.oracleYTable3();//初始化
                this.kafkaInitForm = 0;
            }
        }
        //    时间的联动
        if (this.NDaLIST1.isrefresh) {
            $('.m_two select').selectpicker('render');
            this.NDaLIST1.isrefresh = false;
        }


    },
    watch: {
        'NDaLIST1.oneD': function (val, oldval) {
            if (val == 'week') {
                $('.m_two .selectpicker').selectpicker('destroy');
                this.NDaLIST1.two = val;
                this.NDaLIST1.twoD = [false, false, false, false, false, false, false];
            } else if (val == 'day') {
                this.NDaLIST1.two = val;
                this.NDaLIST1.twoD = 'intervalday';
            } else if (val == 'month') {
                this.NDaLIST1.two = val;
                this.NDaLIST1.twoD = 'intervaldayon';
            }
        },
        'NDaLIST1.two': function (val, oldval) {
            this.NDaLIST1.isrefresh = true;
        },
        'NDaLIST1.twoD': function (val, oldval) {
            if (val == 'intervalhour') {
                this.NDaLIST1.three = [false, true, true];
            } else if (val == 'intervalmin') {
                this.NDaLIST1.three = [false, false, true];
            } else {
                this.NDaLIST1.three = [true, true, true];
            }
        },
        NDaLIST1: {
            handler: function (val, oldval) {
                this.getCronExpressParams();
            },
            deep: true
        }
    }
})
//2.0---jquery  load
$(function () {
    vm.initScale();//初始化当前比例
    $("#tabs").tabs({
        collapsible: true
    });//标签页 设置
    $(document).bind("click", function (e) {
        var target = $(e.target);
        if (target.closest("#contextmenuBox").length == 0) {
            vm.DRcontextmenuData.istrue = false;//注销右键
        }
        if (target.closest("#contextmenuBox1").length == 0) {
            vm.DRcontextmenuData.istrue1 = false;//注销右键
        }
        if (target.closest(".modelView").length == 0) {
            vm.LIlineDatas.left1 = -500;//隐藏连线按钮
            vm.LIlineDatas.top1 = -500;//隐藏连线按钮
        }
    });//点击空白处  右键菜单消失
    // 2.1---视图中鼠标滑轮  放大缩小
    if (typeof (document.onmousewheel) == "undefined") {
        document.addEventListener("DOMMouseScroll", myFunction, false)
    } else {
        document.onmousewheel = function () {
            // myFunction();
        };
    }
    function myFunction(e) {
        var direction;
        e = e || window.event;
        var target = $(e.target);
        if (target.closest("#showProcessViews").length == 0 || target.closest(".modelView").length == 1) {
            return;
        }
        if (e.wheelDelta) {
            direction = e.wheelDelta > 0 ? 1 : -1;
        } else if (e.detail) {
            direction = e.detail < 0 ? 1 : -1;
        }
        if (direction == -1) {
            vm.narrow(e);
        } else if (direction == 1) {
            vm.blowUp(e);
        }
    }
})
