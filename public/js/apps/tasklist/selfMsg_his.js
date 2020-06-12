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

function goback(){
    parent.mainPlatform.show_child_iframe('apps/tasklist/concern_his.html',window.taskDetailInfo.name+'的任务详情','taskDetail_'+window.taskDetailInfo.id,false,false,window.taskDetailInfo,)
}
function search_init(){
/*
  create_datePicker($('.begin_time'));
  create_datePicker($('.end_time'));

  var bg_date =  new Date(parent.getLocalTime().substr(0,11)+"00:00:00");
  
 $(".begin_time").datetimepicker("setDate", bg_date);

 $(".end_time").datetimepicker("setDate", new Date());
  $("#timeSel").selectpicker('refresh');*/
$('.smd_page_header').html(window.taskDetailInfo.name+'的私信任务历史')
      var tableColumns = [

        {width:150,field: 'name', title: '任务名称',align : 'center',valign : 'middle',},
        {width:150,field: 'acquisition_count', title: '采集数量',align : 'center',valign : 'middle',},
        {width:150,field: 'class_name', title: '标签', align : 'center',valign : 'middle',
        editable: {
                    type: 'text',
                    title: '修改标签名',
                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,mobile_label:v,id :d_id,};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Group_mobile, dats);
                        $('#tableMy').bootstrapTable('refresh')
                    }
                },},
        {width:150,field: 'is_fan_count', title: '关注数量',align : 'center',valign : 'middle',},

       {width:150,field: 'reg_date_name1', title: '关注时间',align : 'center',valign : 'middle', },
       {width:150,field: 'reg_date_name', title: '私信时间',align : 'center',valign : 'middle', },

      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['未运行','正在运行','已结束'];
          $.each(info.data.info.list,function(i,v){
            v.reg_date_name = v.last_message_time == 0 ? "" : parent.UnixToDateTime(v.last_message_time)
            v.reg_date_name1 = v.last_fan_time == 0 ? "" : parent.UnixToDateTime(v.last_fan_time)
          
          })
        }

        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }

      function queryParams(params){
        var node = $('#tb');
        var data = { //每页多少条数据
          "session_id":parent.DmConf.userinfo.id,
          "token":parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "task_status" : $('#task_status_sel').val(),
          "page" :(params.offset/params.limit)+1, 
        }
        
        return data
      }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Task_fan_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
      
}

function task_resInfo(msg){
  var ret = parent.getByRsync(parent.DmConf.api.new.Task_result,{
    task_id : msg.id,
    session_id:parent.DmConf.userinfo.id,
    token : parent.DmConf.userinfo.token
  })
   if(!ret.data.code){
        var vv =  '<p>增长粉丝数:'+ret.data.info.result[0].fan_count
            +'</p><p>增长点赞数:'+ret.data.info.result[0].like_count
            +'</p><p>增长评论数:'+ret.data.info.result[0].comment_count
            +'</p><p>增长播放数:'+ret.data.info.result[0].play_count
            +'</p><p>评论用户关注数量:'+ret.data.info.result[0].comment_fan_count
            +'</p><p>私信数量:'+ret.data.info.result[0].message_count+'</p>';
        $('.task_resInfo').html('')
        $('.task_resInfo').html(vv)
        $('#task_res').modal()
     }else{
      parent.plus_alert(ret.data.msg)
     }
  
}