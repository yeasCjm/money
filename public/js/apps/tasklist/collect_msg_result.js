require.config({
  baseUrl: "../../public/js",
  urlArgs: "v=" + parseInt(parseInt((new Date()).getTime() / 1000) / 100).toString(),  // 每分钟更新，方便开发,生产环境去掉
  paths: {
    "public": "lib/public"
  }
});

require(["public"], function () {
  web_init()
});

function gotoFir(t) {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) {
    return parent.plus_alert('请选择记录');
  };
  parent.concernAndcheat.show(data) ;
  /* if (t == 1) {
    parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment_chat.html', 'new_collectComment_chat', 'new_collectComment_chat123123', false, false, data);
  } else if (t == 2) {

  } else {
    parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment_concern.html', 'new_collectComment_concern', 'new_collectComment_concern123123', false, false, data);
  }; */
}
function search_init() {

  $('#tableMy').bootstrapTable('destroy')

  var tableColumns = [
    { width: 50, field: "checked", checkbox: true, },
    { width: 150, field: 'task_name', title: '任务名', align: 'center', valign: 'middle', sortable: false },
    { width: 100, field: 'unique_id', title: '抖音号', align: 'center', valign: 'middle', },
  
    { width: 100, field: 'nickname', title: '昵称', align: 'center', valign: 'middle', },
    { width: 75, field: 'is_msg_name', title: '是否私信', align: 'center', valign: 'middle', },
    { width: 75, field: 'is_god_name', title: '是否神评', align: 'center', valign: 'middle', },
    { width: 75, field: 'is_fan_name', title: '是否关注', align: 'center', valign: 'middle', },
    
    /*   { width:100,field: 'order_count', title: '粉丝量',align : 'center',valign : 'middle', width:100}, */
    {
      width: 150, field: 'keyword', title: '关键词', align: 'center', valign: 'middle', sortable: false, formatter:function(a){
        return '<span style="display: -webkit-box;-webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;">'+a+'</span>'
  
    }},
    { width: 50, field: 'sex_name', title: '性别', align: 'center', valign: 'middle', },
    { width: 100, field: 'comment_like_count', title: '评论点赞数', align: 'center', valign: 'middle', sortable: true },
    {
      width: 100, field: 'content_val', title: '评论内容', align: 'center', valign: 'middle', },
    { width: 100, field: 'play_url', title: '来自视频', align: 'center', valign: 'middle', },
    { width: 150, field: 'addtime_name', title: '评论时间', align: 'center', valign: 'middle', },
  ];
  function responseHandler(info) {
    if (!parent.checkCode1002(info)) {
      return
    }
    if (info.data.info) {
      var sex_type = ['女', '男', '未知'];
      var time_name = ['立即执行任务', '定时任务']
      var is_name = ['否', '是']
      $.each(info.data.info.list, function (i, v) {
        v.time_tick_name = v.begin_time == 0 ? "" : parent.UnixToDateTime(v.begin_time);
        v.addtime_name = v.content_time ? parent.UnixToDateTime(v.content_time) : "";
        v.sex_name = sex_type[v.sex];
        v.task_type_name = v.time_type == 0 ? "" : (v.time_week == 0 || v.time_week == null) ? '不循环' : "周" + v.time_week;
        v.time_type_name = time_name[v.time_type];
        v.is_msg_name = is_name[v.is_message]
        v.is_god_name = is_name[v.is_god]
        v.is_fan_name = is_name[v.is_follow]
        v.content_val = '<span data-placement="right" data-toggle="tooltip" data-trigger="hover" data-animation="true" style="display: -webkit-box;-webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;" title="' + v.content + '">' + v.content + '</span>'
     
      })
    }

    return {
      "total": info.data.info.page.total,
      "rows": info.data.info.list
    }

  }

  function queryParams(params) {
    var node = $('#tb');
    var data = { //每页多少条数据
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      "page_count": params.limit,
      "begin_date": $("#begin_date").val(),
      "end_date": $("#end_date").val(),
      "is_type": 0,
      "comment_like_count_begin": node.find('input[name=comment_like_count_begin]').val(),
      "comment_like_count_end": node.find('input[name=comment_like_count_end]').val(),
      "keyword": node.find('input[name=keyword]').val(),
      "task_name": node.find('input[name=task_name]').val(),
      "sex": $("#task_type_sel").val(),
      "page": (params.offset / params.limit) + 1,
      'order_field': params.sort,      //排序列名  
      'order_type': params.order,//排位命令（desc，asc）  
    }

    return data
  }
  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.Task_fan_result,
    "responseHandler": responseHandler,
    "queryParams": queryParams
  }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'),'',tol);
  
}
function delAll() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var str =  '<p>确认是否删除选择的' + data.length + '条记录?</p>';
  var i_id = $.map(data, function (v) { return v.id }).join(',')
  parent.config_delInfo.show(str, {
    acquisition_type: 2,
    id: i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Task_Del_acquisition_result, TBrefresh);

}
function tol() {
  $('[data-toggle="tooltip"]').tooltip();

}
  