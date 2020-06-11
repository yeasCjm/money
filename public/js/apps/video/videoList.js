require.config({
   baseUrl: "../../public/js",
   urlArgs: "v=" +  parseInt(parseInt((new Date()).getTime()/1000)/100).toString(),  // 每分钟更新，方便开发,生产环境去掉
　　　paths: {
        "public" :"lib/public"
　　　}
});

require( ["public"], function (){
 web_init()
});

function AddEventBtn(a,value,c){
  var arr = ['<button id="mobile_info"  type="button" class="btn">详情</button> ', '<button id="fabuInfo"  type="button" class="btn">编辑发布</button> ',  '<button id="del_info"  type="button" class="btn">删除</button> ']
  if(value.is_update){
    arr.unshift('<button id="update_o"  type="button" class="btn">已更新</button> ' )
  }else{
    arr.unshift('<button id="update_o"  type="button" class="btn">更新</button> ')
  }
  return arr.join('') 
}
var btn_events = {
  "click #fabuInfo": function (a, b, value) {
    parent.editIssue.show([value])
  },
    "click #del_info" : function(a,b,value){
    parent.config_delInfo.show('确定删除该抖音用户吗？', {
      open_id: value.open_id,
      token: parent.DmConf.userinfo.token,
      session_id: parent.DmConf.userinfo.id,
      id : value.id,
    }, parent.DmConf.api.new.Openuser_Del_obj, TBrefresh);

    },        
    "click #mobile_info" : function(a,b,value){
      parent.mainPlatform.show_iframe('/apps/video/videoDetail.html', '视频详情', 'videoDetail', value,'sendManage')
    },
  "click #update_o": function (a, b, value,idx) {
    if(value.is_login == 0 ) return parent.plus_alertShow.show('已过期，请重新登录')
     $(a.target).html('更新中')  
     update_o(value, idx, $(a.target)) 
   
  }
}

function update_o(val,idx,aNode){
  
  var pro = new Promise(function(res,rej){
    var ret = parent.getByRsync(parent.DmConf.api.new.Openuser_Refresh_fans,{open_id:val.open_id,session_id:parent.DmConf.userinfo.id,token:parent.DmConf.userinfo.token})
    res(ret)
  })
  pro.then(function(data){
    var ddd = data.data ;
    if(ddd.code == 0){
      aNode.html('已更新');
 
      $('#tableMy').bootstrapTable('updateRow', {
        index: idx,
        row: {
          nickname: ddd.info.nickname,
          follows_count: ddd.info.follows_count,
          fans_count: ddd.info.fans_count,
          reg_date_name: parent.UnixToDateTime(ddd.info.last_login_time),
        }
      })
    }
  })
}

function search_init(){

  var tableColumns = [
      /*   {width:150,field : "checked" , checkbox:true,}, */
    { width: 150, field: 'nickname', title: '抖音昵称', align: 'center', valign: 'middle', },
    { width: 80, field: 'avatar', title: '头像', align: 'center', valign: 'middle', formatter:function(a){
      return '<img src="' + a+'" style="width:40px;height:40px;border-radius:40px;">'
    }},
    {
      width: 150, field: 'mobile_label', title: '手机标签', align: 'center', valign: 'middle', editable: {
       /*  type: 'text', */
        title: '修改手机标签',

        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;
          var dats = { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, mobile_label: v, mobile_group: data[idx].mobile_group, id: d_id, open_id: data[idx].open_id };
       
          var ret = parent.getByRsync(parent.DmConf.api.new.Openuser_Update_user, dats);

          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          }
          $('#tableMy').bootstrapTable('updateRow', {
            index: idx,
            row: {
              mobile_label: dats['mobile_label']
            }
          })
        }
      }, },
    {
      width: 150, field: 'mobile_group', title: '手机分组', align: 'center', valign: 'middle', editable: {
        type: 'text',
        title: '修改手机分组',

        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;
          var dats = { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, mobile_group: v, mobile_label: data[idx].mobile_label, id: d_id, open_id: data[idx].open_id };
      
          var ret = parent.getByRsync(parent.DmConf.api.new.Openuser_Update_user, dats);

          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          }
          $('#tableMy').bootstrapTable('updateRow', {
            index: idx,
            row: {
              mobile_group: dats['mobile_group']
            }
          })
        }
      },},
      
        { width: 150, field: 'is_login_name', title: '授权登陆', align: 'center', valign: 'middle', },
/*     { width: 150, field: 'follows_count', title: '关注', align: 'center', valign: 'middle', }, */
    { width: 150, field: 'fans_count', title: '粉丝<span class="iconfont icon-bangzhu" data-placement="right" data-toggle = "tooltip" data-trigger="hover" data-animation="true" style="margin-left:5px;color:#aeaeae" title="首次登录授权后，需要间隔2天才会产生全部数据"></span>', align : 'center',valign : 'middle',},
/*         {width:150,field: 'reg_date_name', title: '任务名称', align : 'center',valign : 'middle',},
        {width:150,field: 'imei_info', title: '视频话题', align : 'center',valign : 'middle',},
        {width:150,field: 'mobile_info', title: '视频内容', align : 'center',valign : 'middle',},
        {width:150,field: 'admin', title: '视频时长', align : 'center',valign : 'middle',}, 
        {width:150,field: 'user_name_info', title: '@好友', align : 'center',valign : 'middle',},*/
    { width: 150, field: 'reg_date_name', title: '上次更新新时间', align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];

  function responseHandler(info) {
        var is_online_name = ['<span style="color:red">否</span>','<span style="color:green">是</span>']
        var is_busy_name = ['<span style="color:green">空闲</span>','<span style="color:red">忙碌</span>'];
         if(!parent.checkCode1002(info)){
          return 
        }
         $.each(info.data.info.list,function(i,v){
           v.is_login_name = is_online_name[v.is_login] ;
           v.reg_date_name = v.last_refresh_time == 0 ? '' : parent.UnixToDateTime(v.last_refresh_time)

          })
        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

        };
  function queryParams(params){
        var node = $('#tb');

        return { //每页多少条数据
          "customer_id" : parent.DmConf.userinfo.customer_id,
          "page_count" :params.limit,
          "nickname" :node.find('input[name=user_name]').val(),
          "is_login": $("#task_type_sel").val(),
          "begin_date": $("#begin_date").val(),
          "end_date" : $("#end_date").val(),
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
        
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api": parent.DmConf.api.new.Openuser_Obj_list,
        "responseHandler" :  responseHandler,
        singleSelect:true,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  })    
  }

 function goDYlogin(){
   window.open(parent.DmConf.server.douyinUrl()+'/open/?customer_id='+parent.DmConf.userinfo.customer_id,'')
 }


function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
}

function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}