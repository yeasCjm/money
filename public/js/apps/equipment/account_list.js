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

  return [  '<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}
var btn_events = {

  "click #mobile_info" : function(a,b,value){


  },
    "click #del_info" : function(a,b,value){
      
      var msg = '分身ID:' + value.branch_no +';';
      if(value.user_name.length > 0 ) msg += '抖音号:'+value.user_name+';'
      msg +='    是否确认移除?' ;
      parent.config_delInfo.show(msg,{
      id:value.id,
      token:parent.DmConf.userinfo.token,
      session_id:parent.DmConf.userinfo.id,
      customer_id:parent.DmConf.userinfo.customer_id,
    },parent.DmConf.api.new.Del_applicationaccount,TBrefresh);

  }
}

function AddEventBtn2(a, value, c) {

  return ['<button id="mobile_info"  type="button" class="btn" >修改</button> ', '<button id="del_info"  type="button" class="btn">删除</button> '].join('')
}
var btn_events2 = {

  "click #del_info": function (a, b, value) {
    var msg = '大号昵称名:' + value.user_name;
    parent.config_delInfo.show(msg, { id: value.id, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id }, parent.DmConf.api.new.Del_applicationaccount, TBrefresh);
  },
  "click #mobile_info": function (a, b, value) {
    parent.addAccount.show(2, value)
  }
}

function delACC(type){
  var data = $('#tableMy').bootstrapTable('getSelections');
  if(data.length == 0 ) return parent.plus_alert('请选择记录');
  var name_text = data.length == 1 ? '<p class="delInfocontent">是否删除抖音号:' + data[0].user_name + '?</p>' : '<p class="delInfocontent">是否删除抖音号:' + data[0].user_name + '等'+data.length+'条应用账号记录?</p>';
  var id_list = [];
  $.each(data,function(i,v){
   /*  if(type == 1){
      name_text += '<p class="delInfocontent">分身ID:' + v.branch_no + ';';
      if (v.user_name.length > 0) name_text += '抖音号' + v.user_name + ';'
    } 
   
    name_text += '    是否确认移除 ?</p/>';*/

    id_list.push(v.id)
  })
  var dats = {
    id:id_list.toString(),
    token:parent.DmConf.userinfo.token,
    session_id:parent.DmConf.userinfo.id,
    customer_id:parent.DmConf.userinfo.customer_id,
  }
  parent.config_delInfo.show(name_text,dats,parent.DmConf.api.new.Del_applicationaccount,TBrefresh);
}
$('.changeTable').on('click','span',function(){
  $(this).addClass('active').siblings().removeClass('active');
  var att = $(this).attr('app_type');
  $("div[class*='active']").hide()
  $('.active'+att).show();

  search_init(att)
})
function cz(data) {
  var id_list = data.id.split(',')
  var d = $('#tableMy').bootstrapTable('getSelections');
  $.each(d,function(i,v){
    for(var a=0;a<id_list.length;a++){
      if(id_list[a] == v.id){
       
        $("#tableMy").bootstrapTable('updateRow', {
          index: i,
          row: {
            keyword : data.keyword
          }
      })
    }}
  })
}
function someChangeKyeword(){
  var data = $('#tableMy').bootstrapTable('getSelections');
  if(data.length == 0) return parent.plus_alert('请选择记录') ;
  parent.changeKeywordAp.show(data,cz)
}


function search_init(){
  var type = $('.active').attr('app_type')
  $("#tableMy").bootstrapTable('destroy');
  
  var tableColumns = [
    { width: 50,  field: "checked", checkbox: true,},
      
     /*   {field: 'customer_id', title: '客户ID', align : 'center',valign : 'middle',},*/
    { width: 100,  field: 'branch_no', title: '分身ID', align: 'center', valign: 'middle', },
       /* {field: 'mobile_id', title: '设备ID', align : 'center',valign : 'middle',},*/
    { width: 100,  field: 'user_name', title: '抖音号', align: 'center', valign: 'middle', },
     /*   {field: 'password', title: '密码', align : 'center',valign : 'middle',
        editable: {
                    type: 'text',
                    title: '修改密码',
                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {id:data[idx].id,token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,password:v,id :d_id,telphone:data[idx].telphone};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_applicationaccount, dats);
                        $('#tableMy').bootstrapTable('refresh')
                    }
                },},
        {field: 'telphone', title: '电话号码', align : 'center',valign : 'middle',
        editable: {
                    type: 'text',
                    title: '修改手机',
                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {id:data[idx].id,token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,telphone:v,id :d_id,password:data[idx].password};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_applicationaccount, dats);
                        $('#tableMy').bootstrapTable('refresh')
                    }
                },}, */
    {
      field: 'keyword', width: 150, title: '业务关键词', align: 'center', valign: 'middle',
      editable: {
        type: 'text',
        title: '修改业务关键词(多个用,隔开)',
        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
    
          var dats = { id: data[idx].id, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, keyword: v,  };
          var ret = parent.getByRsync(parent.DmConf.api.new.Applicationaccount_Update_keyword, dats);
          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          }
        }
      },
    },
    { width: 100,  field: 'nick_name', width: 100,  title: '昵称', align: 'center', valign: 'middle', },
        { width: 100, field: 'mobile_label', title: '手机标签', align : 'center',valign : 'middle',},
        { width: 100, field: 'signature', title: '个性签名', align : 'center',valign : 'middle',},
    { width: 75, field: 'get_fan_count', title: '粉丝数', align : 'center',valign : 'middle',},      
        { width: 75, field: 'get_like_count', title: '获赞数', align : 'center',valign : 'middle',},
    { width: 75, field: 'fan_count', title: '关注数', align : 'center',valign : 'middle',},
       /* {  width: 100, field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        { width: 100, field: 'message_count', title: '私信数', align : 'center',valign : 'middle',},
        { width: 100, field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        { width: 100, field: 'comment_fan_count', title: '评论区关注数', align : 'center',valign : 'middle',},
        { width: 100, field: 'play_count', title: '播放数', align : 'center',valign : 'middle',}, */
        { width: 100,  field: 'reg_date_t', title: '创建时间', align: 'center', valign: 'middle', },
        { width: 75, field: 'is_use_name', title: '手机状态', align : 'center',valign : 'middle',},
        { width: 150, field: 'last_update_date_t', title: '最后一次更新时间', align : 'center',valign : 'middle',},
        
/*        { width: 100, field: 'type', title: '应用账号标签', align : 'center',valign : 'middle',},
       
        { width: 100, field: 'type', title: '应用账号标签', align : 'center',valign : 'middle',},*/
        { width: 80, field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn}
       
      ];
    if(type == 2){
      tableColumns = [
        { width: 50,  field: "checked", checkbox: true, },
        { width: 100,  field: 'user_name', title: '大号账号', align: 'center', valign: 'middle', },
        {width:150,field: 'keyword', title: '业务关键词', align: 'center', valign: 'middle',editable: {
            type: 'text',
            title: '修改业务关键词(多个用,隔开)',
            validate: function (v) {
              var data = $('#tableMy').bootstrapTable('getData');
              var idx = $(this).parent().parent().data('index');

              var dats = { id: data[idx].id, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, keyword: v, };
              var ret = parent.getByRsync(parent.DmConf.api.new.Applicationaccount_Update_keyword, dats);
              if ($.trim(ret.data.code) != 0) {
                return ret.data.msg;
              }
              //$('#tableMy').bootstrapTable('refresh')
            }
          },
        },
        { width: 100,  field: 'nick_name', title: '抖音昵称', align: 'center', valign: 'middle', },
      /* { width: 100,  field: 'like_count', title: '点赞数', align: 'center', valign: 'middle', },*/
        { width: 100, field: 'fan_count', title: '关注数', align: 'center', valign: 'middle', },
        { width: 100,  field: 'get_like_count', title: '获赞数', align: 'center', valign: 'middle', },
 
        { width: 100, field: 'get_fan_count', title: '粉丝数', align: 'center', valign: 'middle', },
    /*     { width: 100,  field: 'play_count', title: '播放', align: 'center', valign: 'middle', }, */
        { width: 150,  field: 'Button', title: '操作', events: btn_events2, formatter: AddEventBtn2 },
      ];
    }
  function responseHandler(info) {
       
    var use_name = ['<span style="color:red">无效</span>','<span style="color:green">有效</span>',];
         if(!parent.checkCode1002(info)){
          return 
        }
        for(var i=0;i<info.data.info.list.length;i++){
   
          info.data.info.list[i].is_use_name = use_name[info.data.info.list[i].mobile_status] ;
            info.data.info.list[i].reg_date_t = info.data.info.list[i].reg_date > 0 ? parent.UnixToDateTime(info.data.info.list[i].reg_date).substr(0,11) : '';
            info.data.info.list[i].last_update_date_t = info.data.info.list[i].last_update_date > 0 ? parent.UnixToDateTime(info.data.info.list[i].last_update_date) : '';

        }
        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

        };
      var self = this  
  function queryParams(params){
        var node = $('#tb');
        var type = $('.active').attr('app_type')
        var keywords = node.find('input[name=user_name'+type+']').val() ;
        var data = { //每页多少条数据
            "customer_id": parent.DmConf.userinfo.customer_id,
            "page_count": params.limit,
            "keyword": keywords,
          "user_name": keywords,
            "page": (params.offset / params.limit) + 1,
            "session_id": parent.DmConf.userinfo.id,
            'token': parent.DmConf.userinfo.token,
            "type": type, //1 小号 2 大号
          } 
        if(type == 1){
          data['mobile_status'] = $("#phone_status").val()
        }
        return data
  };

   var detail = {
        "columns" :  tableColumns,
     "api": $('.active').attr('app_type') == 1 ?  parent.DmConf.api.new.Applicationaccount_list : parent.DmConf.api.new.Applicationaccount_Big_list ,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'+type))
  
          
  }




  