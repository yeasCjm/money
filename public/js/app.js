var DmConf = {
  "token"    : "",
  "exptime"  : 600,
  "myinfo"   : null,
  "uploadFile" :0 ,
  "pagesize" : 30,     /* 分页大小 */
  "socket"   : null,   /* websocket */
  "eject"    : false,  /* 是否已被踢出 */
  "clipboard": null,   /* 剪贴板 */
  "server" : {
      "protocol": window.location.protocol,
      "host": window.location.hostname,
 	 // 'host' : 'dy.gzdameng.com/api/public/?s=',
     "port": 9167,
     "url" : function(){
    //   return this.protocol+"://"+this.host/*+":"+this.port*/;
       return this.protocol + "//" + this.host + ":" + this.port+'?s=';

     },
     douyinUrl:function(){
       return 'https://test.dytool.net';
     }
  },
  

  "LocalData" : {   /*静态数据*/
    "sex" : ["女","男"],
  },
  "task_status":   ['未运行', '运行中', '已结束', '错误',  '手动结束'],//0未运行,1运行中，2结束，3错误，4手动结束
    /* "haowubang": [ '人气总榜','居家日用','3C数码','母婴用品','食品饮料','美妆个护','精品女装','潮流男装',], */
  "data" : {},                                 /* 公共信息缓存 */
  "city": "株洲,镇江,北京,长沙,深圳,北京,上海,成都,广州,重庆,西安,苏州,武汉,杭州,郑州,南京,合肥,长沙,福州,阿坝藏族羌,阿克苏地区,阿勒泰地区,阿拉善盟,阿拉善盟,巴彦淖尔,蚌埠,巴中,北海,常州,郴州,潮州,承德,大庆,达州,承德,德阳,达州,德宏傣族景,阜阳,甘孜藏族自,抚州,甘南藏族自,海东,杭州,海西蒙古族,哈密,贺州,杭州,贺州,黄冈,香港特别行,红河哈尼族,湖州,吉林,佳木斯,济宁,九江,荆门,乐山,喀什地区,九江,荆门,临夏回族自,连云港,辽阳,娄底,梅州,连云港,吕梁,南京,梅州,连云港,阿里地区,萍乡,鄂尔多斯,盘锦,萍乡,钦州,齐齐哈尔,黔南布依族,衢州,三沙,沈阳,山南,汕头,双鸭山,台湾省,山南,宿迁,双鸭山,天水,铜仁,天津,乌海,芜湖,武汉,邢台,西宁,新乡,忻州,西宁,烟台,宜昌,银川,枣庄,张家口,湛江,玉树藏族自,淄博,张家口,湛江,驻马店,淄博,资阳,驻马店,株洲,淄博,自贡,资阳,遵义",
};


require.config({
   baseUrl: "public/js",
   urlArgs: "v=" +  parseInt(parseInt((new Date()).getTime()/1000)/100).toString(),  // 每分钟更新，方便开发,生产环境去掉
　　　paths: {
        "api"         : "lib/api",
        "crypt"       : "lib/crypt",
        "func"        : "model/func",
        "protocol"    : "model/protocol",
        "glob_object" : "lib/glob_object",
        "menu"        : "model/menu",
      
        "index"       : "index",

　　　}
});

require( ["api","crypt","func","protocol","glob_object","menu","index",], function (){


/* 上正式环境删掉 */
if(window.localStorage.getItem('douyin_debug') == 1){
  DmConf.server.host = 'test.dytool.net'
      DmConf.server.protocol = 'http:' ;
      DmConf.server.port = '9167'
}
 
   // 主界面初始化
   main_init();
    $('body').append(getHtm('/module/common.html?_t='+(new Date().valueOf()-3600).toString().substr(0,7)));
   // 其他初始化
   Dm_Init();
});


function Dm_Init(){
    /*登录判断*/
    Check_Login();
   //loadobj("module/login.htm", $("#Wellcome_window"), null);  // 加载登录页
}

/**登录检查**/
function Check_Login(){
 var login_proof = window.sessionStorage.getItem('token');

 if(login_proof){
        
        var dats = JSON.parse(window.sessionStorage.getItem('userInfo'));
        DmConf.userinfo = dats.info ;      
        $("#Wellcome_window").remove();
        $("#show_index").show();
        user_init(dats);
  
        var ret = parent.getByRsync(parent.DmConf.api.new.account_list,{session_id:parent.DmConf.userinfo.id,token:parent.DmConf.userinfo.token,customer_id:parent.DmConf.userinfo.customer_id,page_count:1000,page:1})
       
        if(!parent.checkCode1002(ret)){
          return   loadobj("module/login.htm", $("#Wellcome_window"), null);  
        }
        parent.DmConf.data['user'] = ret.data.info.list;
   var lousername = parent.DmConf.userinfo.emp_name ? parent.DmConf.userinfo.emp_name : parent.DmConf.userinfo.user_name
   $('.cus_code').html(lousername)
        var res = parent.getByRsync(parent.DmConf.api.new.Notice_Get_notice, { session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, })
       
        if(res.data.code == 0){
          window.sessionStorage.setItem('dm_notice',JSON.stringify(res.data.info));
          
          showNotice()
        }else{
          window.sessionStorage.setItem('dm_notice', '')
        }
 }else{
      loadobj("module/login.htm", $("#Wellcome_window"), null);  
        
 }
          
  
}

function uploadNotice(){
  var res = parent.getByRsync(parent.DmConf.api.new.Notice_Get_notice, { session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, });
  if (res.data.code == 0) {
    window.sessionStorage.setItem('dm_notice', JSON.stringify(res.data.info));

    showNotice()
  }
}

function AutoScroll(obj) {
  
  $(obj).find("ul:first").animate({
    top: "-60px"
  }, 3000, function () {
    $(this).css({ top: "0px" }).find("li:first").appendTo(this);
  }); 
}

var myar ;
function showNotice(){
  var data = JSON.parse(window.sessionStorage.getItem('dm_notice'));
  $('#marqueeH5').find('ul').find('li').remove()
  $.each(data,function(i,v){
    $('#marqueeH5').find('ul').append('<li class="marqueeH5Li"><a href="/gmsg.html?opd='+v.id+'" target="_blank">'+v.title+'</a></li>')
  })
  clearInterval(myar)
   myar = setInterval('AutoScroll("#marqueeH5")', 3000); 
}
$('#marqueeH5').find('ul').mouseenter(function (event) { 
  
  clearInterval(myar); 
});
$('#marqueeH5').find('ul').mouseout(function (event) { myar = setInterval('AutoScroll("#marqueeH5")', 3000) })
function hideMarqueeH5(){
  clearInterval(myar)
  $('#marqueeH5').stop().slideUp();
  setTimeout(function () {
    $('#marqueeH5').stop().slideDown();
    uploadNotice()
  }, 1800000)
}
function show_index(){
/*  $('.content-wrapper').children('iframe').remove();
  var iframe = '<iframe class="page-iframe" src="/apps/main.html" frameborder="no" border="no" height="100%" width="100%" scrolling="auto"></iframe>';
  $('.content-wrapper').append(iframe) */
}
/***用户初始化***/
function user_init(dats){


      DmConf.myinfo = dats.userinfo;


      $('.index_man').text(DmConf.userinfo.user_name)
   
      // 用户菜单权限初始化
      mainPlatform.init();

/* 
      //显示首页
      show_index(); */

     
   

}

