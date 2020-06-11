require.config({
   baseUrl: "../../public/js",
   urlArgs: "v=" +  parseInt(parseInt((new Date()).getTime()/1000)/100).toString(),  // 每分钟更新，方便开发,生产环境去掉
　　　paths: {
        "public" :"lib/public"
　　　}
});
var csData ;
require( ["public"], function (){
 web_init()
});

function AddEventBtn(a,value,c){
  var arr = ['<button id="del"  type="button" class="btn btn_pink" >删除</button> ', '<button id="follow"  type="button" class="btn btn_pink" >关注</button> ', '<button id="msg"  type="button" class="btn btn_pink" >私信</button> ', ]
 
  return arr.join('');
 
}
var btn_events = {
  "click #del" : function(a,b,value){
    delAll([value])
  },
  "click #msg": function (a, b, value) {
    parent.dyprivately.show([value],TBrefresh)
  },
  "click #follow":function(a,b,value){
    parent.dyFollow.show([value])
  }
}
function delAll(data) {
  
  if (data.length == 0) return parent.plus_alert("请选择记录");
  var str = data.length == 1 ? '<p>确定删除:' + data[0]['number'] + "?</p>" : '<p>确定删除:' + data[0]['number'] + "等" + data.length + "条记录吗?</p>";

  let dyId = $.map(data, function (v) {
   
    return v.id
  }).join(',');

  parent.config_delInfo.show(str, { 
    id: dyId,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.TikTokNumber_Del_obj,TBrefresh);

}

function search_init(){

      $('#tableMy').bootstrapTable('destroy');


      var tableColumns = [
         {
          width: 50, field: "checked", checkbox: true,
        }, 
        {
          editable: {
            type: 'text',
            title: '修改分组',

            validate: function (v) {
              var data = $('#tableMy').bootstrapTable('getData');
              var idx = $(this).parent().parent().data('index');
              var d_id = data[idx].id;
              var dats = { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, class_name: v,  id: d_id,  };

              var ret = parent.getByRsync(parent.DmConf.api.new.TikTokNumber_Update_obj, dats);

              if ($.trim(ret.data.code) != 0) {
                return ret.data.msg;
              }
              $('#tableMy').bootstrapTable('updateRow', {
                index: idx,
                row: {
                  class_name: dats['class_name']
                }
              })
            }
          }, width: 200, field: 'class_name', title: '分组', align: 'center', valign: 'middle', },
        { width: 100, field: 'number', title: '抖音号', align: 'center', valign: 'middle', },
        { width: 140, field: 'addtime_name', title: '创建时间', align: 'center', valign: 'middle', },
        
      
        { width: 70, field: 'message_number_name', title: '已私信', align: 'center', valign: 'middle', },
        { width: 140, field: 'message_time_name', title: '私信时间', align: 'center', valign: 'middle', },
  
        // { width: 100, field: 'message_text', title: '私信内容', align: 'center', valign: 'middle', },
        { width: 70, field: 'follow_number_name', title: '已关注', align: 'center', valign: 'middle', },
        { width: 140, field: 'follow_time_name', title: '关注时间',align : 'center',valign : 'middle', },

   
        { width: 220, field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn },

      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){

          $.each(info.data.info.list,function(i,v){
            v.message_time_name = parent.UnixToDateTime(v.message_time);
            v.addtime_name = parent.UnixToDateTime(v.addtime);
            v.follow_time_name = parent.UnixToDateTime(v.follow_time);
            v.follow_number_name = v.is_follow > 0 ? '是' : '否'
            v.message_number_name = v.is_message > 0? '是' : '否'

          
          })
        }
        
        return  { 
                   "total" : info.data.info.page.total ,
          "rows": info.data.info.list
                }

      }

      function queryParams(params){
        var node = $('#tb');
        var cre = $("#begin_date").val().split('至')
        var data = { //每页多少条数据
          "session_id":parent.DmConf.userinfo.id,
          "token":parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "keyword": node.find('input[name=keyword_sma]').val(),
          is_follow: $("#is_follow").val(),
          is_message: $("#is_message").val(),
          add_time_begin: parent.DateToUnix(cre[0] + ' 00:00:00'),
          add_time_end: parent.DateToUnix(cre[1] + ' 23:59:59'),
         
          "page" :(params.offset/params.limit)+1, 
        }
        csData = data;
        if (window.taskDetailInfo) {
          data = window.taskDetailInfo.showIframe_data;

        }
  
        
        return data
      }
      var detail = {
            "columns" :  tableColumns,
        "api": parent.DmConf.api.new.TikTokNumber_obj_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
            'page':window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page) : 0,
            'pageSize':window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page_count) : 50,
      }
    
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'),returnBack);

 
}

