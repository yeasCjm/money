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




function search_init() {

  $('#tableMy').bootstrapTable('destroy')

  var tableColumns = [
    { width: 50, field: "checked", checkbox: true, },
    { width: 100, field: 'unique_id', title: '抖音号', align: 'center', valign: 'middle', },
    { width: 100, field: 'nickname', title: '昵称', align: 'center', valign: 'middle', },
    { width: 75, field: 'sex_name', title: '性别', align: 'center', valign: 'middle', },
    { width: 75, field: 'is_msg_name', title: '是否关注', align: 'center', valign: 'middle', },
    { width: 75, field: 'is_god_name', title: '是否私信', align: 'center', valign: 'middle', },
   /* { width: 75, field: 'is_god_name', title: '粉丝数', align: 'center', valign: 'middle', },
       { width:100,field: 'order_count', title: '粉丝量',align : 'center',valign : 'middle', width:100}, 
    { width: 150, field: 'keyword', title: '是否商品橱窗', align: 'center', valign: 'middle', sortable: false },
    
    { width: 150, field: 'addtime_name', title: '采集时间', align: 'center', valign: 'middle', },*/
  
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
        v.addtime_name = v.addtime ? parent.UnixToDateTime(v.addtime) : "";
        v.sex_name = sex_type[v.sex];
       
        v.is_msg_name = is_name[v.is_follow]
        v.is_god_name = is_name[v.is_message]
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
      "from_unique_id": window.taskDetailInfo.unique_id,
      "page": (params.offset / params.limit) + 1,
      "task_id" : window.taskDetailInfo.task_id,
      'order_field': params.sort,      //排序列名  
      'order_type': params.order,//排位命令（desc，asc）  
      is_type : 3,
    }

    return data
  }
  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.Task_fan_result,
    "responseHandler": responseHandler,
    "queryParams": queryParams
  }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'));

}
function delAll() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var str = data.length == 1 ? '<p>确定删除昵称' + data[0].nickname + '?</p>' : '<p>确定删除昵称' + data[0].nickname + '等' + data.length + '条记录?</p>';
  var i_id = $.map(data, function (v) { return v.id }).join(',')
  parent.config_delInfo.show(str, {
    acquisition_type: 2,
    id: i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Task_Del_acquisition_result, TBrefresh);

}


function goCheat() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) {
    return parent.plus_alert('请选择记录');
  };
  parent.concernAndcheat.show(data);
}

function goVideo() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) {
    return parent.plus_alert('请选择记录');
  };
  parent.replyVideo.show(data,window.taskDetailInfo);
}

