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


function AddEventBtn(a, value, c) {// 0未运行,1运行中，2结束，3错误，4中断，5手动结束
  var arr = ['<button id="delMission"  type="button" class="btn" >删除</button> ', '<button id="check_res"  type="button" class="btn" >详情</button> '];
  if (value.over_count > 0) arr.push('<button id="reloadMission"  type="button" class="btn" >重发</button> ');
  if (value.running_count > 0) arr.push('<button id="stopMission"  type="button" class="btn" >手动结束</button> ');
  return arr.join('');

}

var btn_events = {
  "click #check_res": function (a, b, value) {

   

    parent.mainPlatform.show_iframe('apps/tasklist/liveroomBriskDetail.html', value.name + '的任务详情', 'briskDetail',  value, 'tasklist')
  },
  "click #reloadMission": function (a, b, value) {
    parent.pause_taskList.show(value, parent.DmConf.api.new.Start_task, TBrefresh, 2)
   

  },
  "click #delMission": function (a, b, value) {
    parent.config_delInfo.show('删除任务:' + value.name, {
      task_id: value.id,
      token: parent.DmConf.userinfo.token,
      session_id: parent.DmConf.userinfo.id,
    }, parent.DmConf.api.new.Del_task, TBrefresh);


  },
  "click #stopMission": function (a, b, value) {
    parent.pause_taskList.show(value, parent.DmConf.api.new.Stop_task, TBrefresh, 1)
    


  },

}
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

    { width: 150, field: 'task_content', title: '直播抖音号', align: 'center', valign: 'middle', },

    { width: 150, field: 'time_tick_name', title: '活跃时间', align: 'center', valign: 'middle', },
    { width: 100, field: 'mobile_info', title: '操作手机', align: 'center', valign: 'middle', },
    { width: 150, field: 'user_name', title: '操作抖音号', align: 'center', valign: 'middle', },

    { width: 170, field: 'more_status_name', title: '状态', align: 'center', valign: 'middle', },
    {
      width: 100, field: 'notes', title: '备注', align: 'center', valign: 'middle', /* editable: {
        type: 'text',
        title: '填写备注',

        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;
          var dats = { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, message: v, id: d_id, };
          var ret = parent.getByRsync(parent.DmConf.api.new.Task_Question_fan_remark, dats);

          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          }
        }
      }, */
    },
    { width: 150, field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn },
  ];
  function responseHandler(info) {
    if (!parent.checkCode1002(info)) {
      return
    }

    if (info.data.info) {
    
      $.each(info.data.info.list, function (i, v) {
        v.time_tick_name = v.begin_time == 0 ? "" : parent.UnixToDateTime(v.begin_time);
        v.more_status_name = v.not_running_count > 0 ? '<p style="color:#000">未运行设备数量:' + v.not_running_count + '</p>' : '';
        v.more_status_name += v.over_count > 0 ? '<p style="color:#000">结束设备数量:' + v.over_count + '</p>' : '';
        v.more_status_name += v.running_count > 0 ? '<p style="color:#000">运行中设备数量:' + v.running_count + '</p>' : '';
        v.more_status_name += v.pause_count > 0 ? '<p style="color:#000">手动结束设备数量:' + v.pause_count + '</p>' : '';
        v.more_status_name += v.error_count > 0 ? '<p style="color:#000">报错设备数量:' + v.error_count + '</p>' : '';
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
      "task_status": $('#status').val(),
      "task_content": node.find('input[name=dy_uid]').val(),
      "message": node.find('input[name=remark]').val(),
      "page": (params.offset / params.limit) + 1,
      level:121,
      "begin_date": new Date($("#begin_date").val()).valueOf() / 1000,
      "end_date": new Date($("#end_date").val()).valueOf() / 1000
    }




    return data
  }
  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.Task_list,
    "responseHandler": responseHandler,
    "queryParams": queryParams
  }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'));

}

