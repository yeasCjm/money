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


function delAll() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var str = data.length == 1 ? '<p>确定删除' + data[0].dy_uid + '?</p>' : '<p>确定删除' + data[0].dy_uid + '等' + data.length + '条记录?</p>';
  var i_id = $.map(data, function (v) { return v.task_id }).join(',')
  parent.config_delInfo.show(str, {
    task_id: i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Del_task, TBrefresh);


}

function search_init() {

  $("#tableMy").bootstrapTable('refresh')

  var tableColumns = [
    { width: 50, field: "checked", checkbox: true, },

    { width: 150, field: 'dy_uid', title: '直播抖音号', align: 'center', valign: 'middle', },

    { width: 150, field: 'time_tick_name', title: '关注时间', align: 'center', valign: 'middle', },
    { width: 100, field: 'mobile_label', title: '操作手机', align: 'center', valign: 'middle', },
    { width: 150, field: 'fan_count', title: '已关注数量', align: 'center', valign: 'middle', },

    { width: 170, field: 'more_status_name', title: '状态', align: 'center', valign: 'middle', },
    {
      width: 100, field: 'message', title: '备注', align: 'center', valign: 'middle', editable: {
        type: 'text',
        title: '填写备注',

        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;
          var dats = {  token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, message: v, id: d_id, };
          var ret = parent.getByRsync(parent.DmConf.api.new.Task_Question_fan_remark, dats);

          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          } 
        }
      },
    },

  ];
  function responseHandler(info) {
    if (!parent.checkCode1002(info)) {
      return
    }

    if (info.data.info) {
      var task_status_name = parent.DmConf.task_status
      var time_name = ['立即执行任务', '定时任务']
      $.each(info.data.info.list.list, function (i, v) {
        v.time_tick_name = v.begin_time == 0 ? "" : parent.UnixToDateTime(v.begin_time);
        v.more_status_name = task_status_name[v.status]
        v.notes = ''
      })
    }

    return {
      "total": info.data.info.list.page.total,
      "rows": info.data.info.list.list
    }

  }

  function queryParams(params) {
    var node = $('#tb');
    var data = { //每页多少条数据
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      "page_count": params.limit,
      "status": $('#status').val(),
      "dy_uid": node.find('input[name=dy_uid]').val(),
      "message": node.find('input[name=remark]').val(),
      "page": (params.offset / params.limit) + 1,
      "begin_date": new Date($("#begin_date").val()).valueOf() / 1000,
      "end_date": new Date($("#end_date").val()).valueOf() / 1000
    }




    return data
  }
  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.Task_Question_fan_result,
    "responseHandler": responseHandler,
    "queryParams": queryParams
  }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'));

}

