//JSON字符串转JSON对象
function isJson(data){
   var json_data = null;
   var data_type = typeof(data);
   switch(data_type){
     case "string":
        try {
           json_data = JSON.parse(data);
        } catch (err){ return false; }
     break;
     case "object":
        json_data = data;
     break;
   }
	return json_data;
}
//对消息进行排序(顺)
function sort_for_dats_line(propertyName) {
  return function(object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 > value1) {
      return 1;
    } else if (value2 < value1) {
      return -1;
    } else {
      return 0;
    }
  }
}
function downloadFile(url) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; // 防止影响页面
  iframe.style.height = 0; // 防止影响页面
  iframe.src = url; 
  document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用）
  setTimeout(()=>{
    iframe.remove();
  }, 5 * 60 * 1000);
}
function checkCode1002(d){
    if(d.data.code == 1002){
      window.sessionStorage.setItem('token',''); 
      parent.plus_alert(d.data.msg,function(){
        window.parent.location.reload()
      })
      return false
    }else if( d.data.code != 0){
      parent.plus_alert(d.data.msg)
      return false
    }
    return true;
}
function create_datePicker_p(node){
  return node.datetimepicker({
        format: 'yyyy-mm-dd',//显示格式
        todayHighlight: 1,//今天高亮
        minView: "month",//设置只显示到月份
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: true,
        autoclose: 1,//选择后自动关闭
        pickerPosition:'bottom-right',
      });
}


var get_search_list = function (node,opt,refresh_btn,func,tol){//TOL:初始化表格里title标签
      var def = {
        columns : opt.columns ?  opt.columns : [],
        api : opt.api ? opt.api : '' ,
        sidePagination :  opt.sidePagination ? opt.sidePagination : 'server',
        singleSelect    : opt.singleSelect  ?  opt.singleSelect : false,    //true 单选
        responseHandler : opt.responseHandler ? opt.responseHandler : "" ,
        queryParams : opt.queryParams ? opt.queryParams : "",
        method : opt.method ?  opt.method : "post" ,
        clickToSelect : opt.clickToSelect ? opt.clickToSelect : true ,
        page : opt.page ? opt.page : 1 ,
        pageSize : opt.pageSize ? opt.pageSize : 50 ,
      }
      
     
      var equId = $("#content-wrapper").find('iframe:first-child').attr('id') ;
      var hh = $('#' + equId, window.parent.document).height() - $('#' + equId, window.parent.document).contents().find('.container-fluid').height() - $('#' + equId, window.parent.document).contents().find('.page-header').height() - 75
      if(equId == 'drama'){
        hh = 590
      } else if (equId == 'static') {
        hh = 630
      }

      var _self = this ;
      if(tol){
        _self.tol = tol
      }
     
      var option = {//表格初始化
            columns: def.columns,  //表头
            responseHandler : def.responseHandler,
            width:'100%',
            height:hh,
            method: def.method,
            sidePagination:def.sidePagination,//在服务器分页--前端是client
            pageSize: def.pageSize,
            fixedColumns: true, 
          /*   fixedNumber: 1 ,  */
            pageNumber: def.page  ,  ///第1页
        pageList:  [50, 100, 200, 400, 600, 800, 1000], 
            singleSelect : def.singleSelect, //danxuan
            cache: false,   //不缓存
            striped: true,
            //dataField: "count",
            pagination: true,
            search: false,
            showRefresh: false,
            showExport: false,
            showFooter: false,

            contentType: "application/x-www-form-urlencoded; charset=UTF-8",//必须要有！！！！
            dataType: "json",//数据类型
            ajaxOptions:{
              /*xhrFields: {        //跨域
                withCredentials: true
              },*/
             /* crossDomain: true,*/
             // headers: {"Authorization":window.localStorage.getItem('com_tok'),}
            },
            url:parent.DmConf.server.url()+def.api,//要请求数据的文件路径 
            queryParamsType:'limit',//查询参数组织方式 
            queryParams:def.queryParams,//请求服务器时所传的参数 
            clickToSelect: def.clickToSelect,
            'refreshOptions' :{pageNumber: def.page ? def.page : 0},
            onLoadSuccess: function (data) {
              _self.flag = true ;
              if(_self.tol){
                _self.tol()
              }
              
            }
          }
       _self.flag = true ;
      _self.init = function (def,node,refresh_btn){

         node.bootstrapTable(def);
      
          refresh_btn.click(function(){
          
            if (_self.flag == true){
              node.bootstrapTable('refresh')
            
            }
            _self.flag = false
           
          })   
      }

      _self.init(option,node,refresh_btn)
      if(func){
        func()
      }
   
}

//判断是否数组
function isArray(o){
   return Object.prototype.toString.call(o)=='[object Array]';
}
/* =======================================    显示弹窗函数         ====================================================================================================*/

var show_modal = function(setting){
    var _self = this;
   // $('.modal-backdrop').hide()
    //判断为null或者空值
    _self.IsNull = function(value) {
        if (typeof (value) == "function") { return false; }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }
    //默认配置
    _self.DefautlSetting = {
        modalId:'',
        titleTxt: '温馨提示',
        modalCon: '这是提示的信息！',
        bootstrapOptionObj: {},
        callback: function() { }
    };
    //读取配置
    _self.Setting = {
        modalId: _self.IsNull(setting.modalId) ? _self.DefautlSetting.modalId : setting.modalId,
        titleTxt: _self.IsNull(setting.titleTxt) ? _self.DefautlSetting.titleTxt : setting.titleTxt,
        modalCon: _self.IsNull(setting.modalCon) ? _self.DefautlSetting.modalCon : setting.modalCon,
        bootstrapOptionObj: _self.IsNull(setting.bootstrapOptionObj) ? _self.DefautlSetting.bootstrapOptionObj : setting.bootstrapOptionObj,
        callback: _self.IsNull(setting.callback) ? _self.DefautlSetting.callback : setting.callback
    };
    //定义函数操作
    _self.int = function(){
        if (_self.Setting.modalId == '') {
            return;
        }
        if($("#modal_con").children().length >0 ) $("#modal_con").children().remove();
        $("#aler_warm_title").text(_self.Setting.titleTxt);//这里设置弹窗的标题
        $("#modal_con").append(_self.Setting.modalCon);//设置弹窗内容
    
      var node = $('#alert_like')

      var hh = (node.height() - node.find('.modal-content')[0].clientHeight) / 2;
      var ww = (node.width() - node.find('.modal-content')[0].clientWidth) / 2;
      var sty = { top: hh + 'px', left: ww + 'px' }
      $("#" + _self.Setting.modalId).modal(_self.Setting.bootstrapOptionObj).css(sty);//设置弹窗的bootstrap属性方法
        $("#ok_btn").click(function(){
          _self.Setting.callback();
        })
    }
    //执行操作
    _self.int();
}

//show_modal回调函数，4s后隐藏弹窗

function timeClose(){

  setTimeout(function(){
    $('#alert_like').modal('hide');
    $('.modal-backdrop').hide()
    },4000);
}
/* ===================================================================================================================================             ========*/
function alert_center(o){

  return o.modal().find('.modal-dialog').css({width:'45%',top:"20%"});
}
//千分位格式
function Number_Format(n){
   var num = n.toString().split('.');
   var str = num[0].replace(/(?=(?!(\b))(\d{3})+$)/g, ",");
   if(num.length > 1) str += '.' + num[1];
   return str;
}

//获取静态内容
function getHtm(action, r){
   var res;
   var rsync = r ? "?_=" + (new Date().getTime()) : "";
   var result = $.ajax({
      url      : action + rsync,
      type     : "GET",
      cache    : false,
      async    : false,
      success  : function(data){
        res = data;
      }
   });
   return res;
}

//清除html标签
function del_html_node(str){
  return str.replace(/<[^>]+>/g,"")
}


/*加载页面部分
 * 目标元素
 * htm: 页面名称
 * node: 输出到节点
 * callback: 回调函数
 * */
function loadobj(htm, node, callback){
   //if ( !node || !htm ) { return false; }
   var obj = {
      node     : node ? node : $("#Wellcome_window"),
      htm      : htm ? htm   : "login.html",
      callback : callback ? callback : null
   };

   $.ajax( {
      url     : "/" + obj.htm, //这里是静态页的地址
      type    : "GET", //静态页用get方法，否则服务器会抛出405错误
      cache   : false,

      success : function(data){
			    obj.node.html(data)
          if( null != obj.callback) { obj.callback(); };
      }
   });
}

/* 提交修改 -- 同步
 * 提交请求会 等待返回
 * */
function getByRsync(action, dats, met,rsync){
   var res;
   var result = $.ajax({
      url      : DmConf.server.url() + action,
      type     : met ? met : "POST",
      data     : dats,
      dataType : "json",
      beforeSend: function(request) {
             //request.setRequestHeader("Authorization", window.localStorage.getItem('com_tok') );
        },
     /* xhrFields: {withCredentials: true}, */ //带cookie
      cache    : false,
      async    : false,
      success  : function(data){
        res = data;
        var errMsg = {data:{
          code:res.data.code,
          msg : res.data.msg
        }}
    
        if(!parent.checkCode1002(res)){
          res =  errMsg
        }
      }
   });
   return res;
}
function localData(data, def, node) {

  var _self = this;
  var option = {//表格初始化
    data: data,
    columns: def.columns,  //表头
    responseHandler: def.responseHandler,
    width: '100%',
    height: 336,
    /* method: def.method,*/
    sidePagination: 'client',//在服务器分页--前端是client
    pageSize: 30,
    fixedColumns: true,
  /*   fixedNumber: 1, */
    /* pageNumber: 0,  //第1页*/
    pageList: [60, 100,],
    singleSelect: false, //danxuan
    cache: false,   //不缓存
    striped: true,
    //dataField: "count",
    pagination: false,
    search: false,
    showRefresh: false,
    showExport: false,
    showFooter: false,
    queryParams: def.queryParams,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",//必须要有！！！！
    dataType: "json",//数据类型

    ajaxOptions: {
      /*xhrFields: {        //跨域
        withCredentials: true
      },*/
      /* crossDomain: true,*/
      // headers: {"Authorization":window.localStorage.getItem('com_tok'),}
    },

    queryParamsType: 'limit',//查询参数组织方式 

    clickToSelect: true,

  }

  _self.init = function (def, node) {

    node.bootstrapTable(def);


  }

 return _self.init(option, node)
}
/*
 * 公共异步调用函数
 * action    接口url
 * dats      提交数据
 * callback  回调函数
 * load_win  是否显示加载窗口(选传): 不传则不显示，否则显示
 */
function get_dats(action, dats, callback, load_win){
  //加载层
  var loading = load_win ? $('<div id="Loading_win"><div class="loading_div"><span class="load_img"></span>正在加载...</div></div>') : null;
  var api_url = DmConf.server.url() + action;
  if(loading) $("body").prepend(loading);

	$.ajax( {
      url      : api_url, //这里是静态页的地址
      type     : "POST", //静态页用get方法，否则服务器会抛出405错误
      data     : dats,
      beforeSend: function(request) {
           //  request.setRequestHeader("Authorization", window.localStorage.getItem('com_tok') );
      },
      dataType : "json",  //跨域
      xhrFields: {withCredentials: true},  //带cookie
      cache    : false,
      success  : function(data){
        if(loading) loading.remove();
        if(callback) callback(data, false);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        plus_alert({title:'发生错误',content : '<p style="color:red;">无法正常访问服务器，请检查网络连接</p>'
//          '<p>status: ' + XMLHttpRequest.status + "</p>" +
//          "<p>readyState: " + XMLHttpRequest.readyState + "</p>" +
//          "<p>textStatus: " + textStatus + "</p>" +
//          "<p>errorThrown: " + errorThrown + "</p>"
        });
        if(loading) loading.remove();
        if(callback) callback(null, true);
      }
    });
}
function get_dats_login(action, dats, callback, load_win){
  //加载层
  var loading = load_win ? $('<div id="Loading_win"><div class="loading_div"><span class="load_img"></span>正在加载...</div></div>') : null;
  var api_url = DmConf.server.url() + action;
  if(loading) $("body").prepend(loading);

  $.ajax({
      url      : api_url, //这里是静态页的地址
      type     : "POST", //静态页用get方法，否则服务器会抛出405错误
      data     : dats,
      dataType : "json",  //跨域
   /*   xhrFields: {withCredentials: true},  //带cookie
      cache    : false,*/
      success  : function(data){

        if(loading) loading.remove();
        if(callback) callback(data, false);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        
        plus_alert({title:'发生错误',content : '<p style="color:red;">无法正常访问服务器，请检查网络连接</p>'
//          '<p>status: ' + XMLHttpRequest.status + "</p>" +
//          "<p>readyState: " + XMLHttpRequest.readyState + "</p>" +
//          "<p>textStatus: " + textStatus + "</p>" +
//          "<p>errorThrown: " + errorThrown + "</p>"
        });
        if(loading) loading.remove();
        if(callback) callback(null, true);
      }
    });
}
/* 保存配置 */
function ConfSave(cval, exptime){
	var Rets = false;
	try{
		var exp = new Date();
		exp.setTime(exp.getTime()+exptime*1000);
		document.cookie="DMCONF="+escape(cval)+";expires="+exp.toGMTString();
		Rets = true;
	}catch(err){
		alert(err.name+": "+err.message);
	}
	return Rets;
}

/* 读取配置 */
function ConfRead(){
	var json = null;
	try{
		var arr,reg=new RegExp("(^| )DMCONF=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){return unescape(arr[2]);}
	}catch(err){
		console.log(err.name+": "+err.message);
	}
	return json;
}

/* 清除配置 */
function DelConf() {
   var Rets = false;
   try {
     var exp = new Date();
     exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
     document.cookie = "DMCONF=null; expires=" + exp.toGMTString();
     Rets = true;
  }catch(err){
     console.log(err.name+": "+err.message);
  }
  return Rets;
}

/* 本地存储保存 */
function save_local(key, val){
  var n = 0;
  try{
     localStorage.setItem(key, val);
     // 记录数量控制在 10000 条
     while(localStorage.length > 10000){
       if( FlyObj.local.guests != localStorage.key(n) ) localStorage.removeItem(localStorage.key(n));
       n++;
     }
     //console.log("length: %d", localStorage.length);
  }catch(err){
     if(err.name == 'QuotaExceededError'){ // 超出存储限额
       var t = 0;
        while(t < 10){
          if( FlyObj.local.guests != localStorage.key(n) ){
            localStorage.removeItem(localStorage.key(n));
            t++;
          }
          n++;
        }
        // 清掉最老的十条记录，再写入
        save_local(key, val);
     }
  }
}


//判断浏览器类型
var isBrowser = function() {
    var u = navigator.userAgent;
    return {
            ie: u.indexOf('Trident') > -1, //IE内核
            opera: u.indexOf('Presto') > -1, //opera内核
            webkit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            ff: u.indexOf('Firefox') > -1, //火狐内核Gecko
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android
            iPhone: u.indexOf('iPhone') > -1 , //iPhone
            iPad: u.indexOf('iPad') > -1, //iPad
            webApp: u.indexOf('Safari') > -1 //Safari
        };
}();



//复制到粘贴板
function copyToClipBoard(copyText) {
    if (window.clipboardData) { // ie
        window.clipboardData.setData("Text", copyText);
    }
}

/*时间戳转换*/
function UnixToDateTime(unixTime,timeZone,isFull) {
  if(unixTime == 0) return  '';
   timeZone = parseInt(timeZone) || 8;
   isFull = isFull || true;
   unixTime = parseInt(unixTime) + timeZone * 60 * 60;

   var time = new Date(unixTime * 1000);
   var ymdhis = "";
   ymdhis += time.getUTCFullYear() + "-";
   ymdhis += ('0' + (time.getUTCMonth()+1)).substr(-2) + "-";
   ymdhis += ('0' + time.getUTCDate()).substr(-2);
   if (isFull === true)
   {
      ymdhis += " " + ('0' + time.getUTCHours()).substr(-2) + ":";
      ymdhis += ('0' + time.getUTCMinutes()).substr(-2) + ":";
      ymdhis += ('0' + time.getUTCSeconds()).substr(-2);
   }
   return ymdhis;
}

/* 返回当前时间 */
function getLocalTime(t){
  var timestamp = parseInt(new Date().valueOf()/1000);
  if("number" == typeof(t)){
    timestamp += t;
  }
  return UnixToDateTime(timestamp);
}


function DateToUnix(d) {
  if(d == 0) return  '' ;
  return (new Date(d)).valueOf() / 1000
}


// 公共提示窗口
function plus_alert(obj, callback){
  parent.plus_alertShow.show('<p>' + obj + '</p>',callback)
  // new show_modal({modalId:'alert_like',modalCon:'<p>'+obj+'</p>',bootstrapOptionObj:{show:true,backdrop:false},callback:callback});
}

