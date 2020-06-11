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

var csData;
function AddEventBtn(a, value, c) {
  return ['<button id="douyin_info"  type="button" class="btn">详情</button> ', '<button id="del_info"  type="button" class="btn">删除</button> ',/*'<button id="change_status"  type="button" class="btn">修改状态</button> '*/].join('')
}

var btn_events = {
  "click #change_status": function (a, b, value) {
    var msg = '<p>修改手机状态</p><p>手机:' + value.mobile_label + '</p>';
    var ss = value.status == 0 ? 1 : 0;


    parent.config_delInfo.show(msg, { id: value.id, imei: value.imei, status: ss, session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token }, parent.DmConf.api.new.Status_mobile, TBrefresh);
  },
  "click #del_info": function (a, b, value) {
    var msg = '删除手机:' + value.mobile_label;
    parent.config_delInfo.show(msg, { id: value.id, imei: value.imei, session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token }, parent.DmConf.api.new.Del_mobile, TBrefresh);
  },
  "click #douyin_info": function (a, b, value) {
    csData['scrollTop'] = $('.fixed-table-body')[0].scrollTop;
    csData['showId'] = value.id;
    csData['timeSel'] = $("#timeSel").val();
    parent.mainPlatform.show_child_iframe('/apps/equipment/accountDetail.html', value.id, 'accountDetail' + value.id, false, false, value, 'equipment', csData);
  }
}

function delAll() {
  var data = $('#tableMy').bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var name_text = data.length == 1 ? '<p class="delInfocontent">删除手机:' + data[0].mobile_label + '?</p>' : '<p class="delInfocontent">是否删除手机:' + data[0].mobile_label + '等' + data.length + '条手机数据?</p>';
  var id_list = [];
  var imei_list = [];
  $.each(data, function (i, v) {

    id_list.push(v.id);
    imei_list.push(v.imei)
  })
  parent.config_delInfo.show(name_text, { id: id_list.toString(), imei: imei_list.toString(), session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token }, parent.DmConf.api.new.Del_mobile, TBrefresh);

}
function search_init() {


  $("#tableMy").bootstrapTable('destroy')
  var sel_valList = [];
  $.each(parent.DmConf.data.user, function (i, v) {

    sel_valList.push({ text: v.emp_name, value: v.id })
  })

  var tableColumns = [
    {
      field: "checked", checkbox: true, width: '50', formatter: function (r, i, v) {
        if (window.taskDetailInfo) {
          if (i.id == window.taskDetailInfo.showIframe_data.showId) {
            return {
              checked: true
            }
          }
        }
      }
    }, {
      field: 'mobile_label', title: '手机标签', width: 100, align: 'center', valign: 'middle',
      editable: {
        type: 'text',
        title: '修改手机标签',

        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;
          var dats = { account_id: data[idx].account_id, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, mobile_label: v, id: d_id, imei: data[idx].imei };
   
          var ret = parent.getByRsync(parent.DmConf.api.new.add_mobile, dats);

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
      },
    },
    { field: 'last_upload_date_time', title: '最新上报时间', align: 'center', valign: 'middle', width: 100 ,formatter:function(value,row,index){
      return value.slice(0,11)+'<br/>'+value.slice(11)
    }},
    {
      field: 'con_user', title: '管理员', width: 100, align: 'center', valign: 'middle',
      formatter: function (value, row, index) {
        var emp_name = ''
        $.each(parent.DmConf.data.user, function (i, v) { if (v.id == row.account_id) emp_name = v.emp_name })


        return "<a   style=\"color:green;text-decoration:none\" data-text=\"" + emp_name + "\" data-title=\"修改管理员\">" + emp_name + "</a";
      },
      editable: {
        type: 'select',
        title: '修改管理员',
        source: sel_valList,

        validate: function (v) {

          var data = $('#tableMy').bootstrapTable('getData');

          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;


          var dats = { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, id: d_id, imei: data[idx].imei, account_id: v };
          var ret = parent.getByRsync(parent.DmConf.api.new.Emp_mobile, dats);

          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          }
          $('#tableMy').bootstrapTable('updateRow', {
            index: idx,
            row: {
              account_id: dats['account_id']
            }
          })
          /* $('#tableMy').bootstrapTable('refresh') */

        }
      },
    }, {
      field: 'group_name', title: '手机分组', align: 'center', width: 100, valign: 'middle',
      editable: {
        type: 'text',
        title: '修改手机分组名',
        validate: function (v) {
          var data = $('#tableMy').bootstrapTable('getData');
          var idx = $(this).parent().parent().data('index');
          var d_id = data[idx].id;
          var dats = { id: data[idx].id, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, group_name: v, id: d_id, imei: data[idx].imei };
          var ret = parent.getByRsync(parent.DmConf.api.new.Group_mobile, dats);
          /*  $('#tableMy').bootstrapTable('refresh') */
          if ($.trim(ret.data.code) != 0) {
            return ret.data.msg;
          }
          $('#tableMy').bootstrapTable('updateRow', {
            index: idx,
            row: {
              group_name: dats['group_name']
            }
          })
        }
      },
    },
    { field: 'status_name', title: '设备状态', width: 75, align: 'center', valign: 'middle', },
    { field: 'on_line_name', title: '连接状态', width: 75, align: 'center', valign: 'middle', },
    { field: 'amount', title: '电量', width: 50, align: 'center', valign: 'middle', },
    { field: 'network_name', title: '网络', width: 50, align: 'center', valign: 'middle', },
    { field: 'task_typeLabel', title: '任务类型', width: 75, align: 'center', valign: 'middle', },



    { field: 'brand', title: '品牌', width: 75, align: 'center', valign: 'middle', },
    { field: 'branch_verion', title: '抖音版本', width: 75, align: 'center', valign: 'middle', },
    { field: 'model', title: '型号', width: 75, align: 'center', valign: 'middle', },
    { field: 'apk_verion', title: 'APK版本', width: 75, align: 'center', valign: 'middle', },
    { field: 'duoshan', title: '是否安装多闪', width: 100, align: 'center', valign: 'middle', },
    { field: 'is_server_name', title: '无障碍', width: 75, align: 'center', valign: 'middle', },


    { field: 'imei', title: '手机串号', align: 'center', valign: 'middle', width: 150 },
    { field: 'reg_date_time', title: '首次上报时间', align: 'center', valign: 'middle', width: 100 },
    /*       { field: 'branch', title: '分身', width: 100, align: 'center', valign: 'middle', },
          { field: 'branch_online', title: '抖音号', width: 100, align: 'center', valign: 'middle', }, */
    { field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn, width: 130 }
  ];







  function responseHandler(info) {
    var is_online_name = ['<span style="color:red">离线</span>', '<span style="color:green">在线</span>', '<span style="color:red">故障</span>',];
    var status = ['<span style="color:red">无效</span>', '<span style="color:green">有效</span>'];
    var status_t = ['<span style="color:red">故障</span>', '<span style="color:green">正常</span>'];
    var is_network_name = ['<span >移动网络</span>', '<span >WIFI</span>'];
    var cont_user = parent.DmConf.data.user;
    var task_typeLabel_name = ['普通任务', '采集任务'];
    var is_name = ['<span style="color:red">否</span>', '<span style="color:green">是</span>']
    if (!parent.checkCode1002(info)) {
      return
    }
    for (var i = 0; i < info.data.info.list.length; i++) {
      info.data.info.list[i].status_name = status_t[info.data.info.list[i].status];
      info.data.info.list[i].branch_verion = info.data.info.list[i].branch_verion ? info.data.info.list[i].branch_verion : "<span style='color:red'>未安装</span>";
      $.each(cont_user, function (a, b) {
        if (b.id == info.data.info.list[i].emp_id) {
          info.data.info.list[i].con_user = b.emp_name
        }
      })
      info.data.info.list[i].task_typeLabel = task_typeLabel_name[info.data.info.list[i].task_type]
      info.data.info.list[i].is_server_name = status[info.data.info.list[i].is_server]
      info.data.info.list[i].on_line_name = is_online_name[info.data.info.list[i].on_line];
      info.data.info.list[i].duoshan = is_name[info.data.info.list[i].is_install_duoshan];
      info.data.info.list[i].network_name = is_network_name[info.data.info.list[i].network];
      info.data.info.list[i].reg_date_time = info.data.info.list[i].reg_date > 0 ? parent.UnixToDateTime(info.data.info.list[i].reg_date).substr(0, 11) : '';
      info.data.info.list[i].last_upload_date_time = info.data.info.list[i].last_upload_date > 0 ? parent.UnixToDateTime(info.data.info.list[i].last_upload_date) : '';
      if (info.data.info.list[i].branch_verion == '6.6.0' && info.data.info.list[i].task_type == 0) {
        info.data.info.list[i].task_typeLabel = '<span style="color:red">' + info.data.info.list[i].task_typeLabel + '</span>'
        info.data.info.list[i].branch_verion = '<span style="color:red">' + info.data.info.list[i].branch_verion + '</span>'
      }
    }

    return {
      "total": info.data.info.page.total,
      "rows": info.data.info.list
    }

  };
  function queryParams(params) {
    var node = $('#tb');
    var data = { //每页多少条数据  
      "mobile_label": node.find('input[name=user_name]').val(),
      "imei": node.find('input[name=imei]').val(),
      "group_name": node.find('input[name=group_name]').val(),
      "status": $('#online_id').val(),
      "page_count": params.limit,
      "page": (params.offset / params.limit) + 1,
      "session_id": parent.DmConf.userinfo.id,
      'token': parent.DmConf.userinfo.token,
      'customer_id': parent.DmConf.userinfo.customer_id,
    }
    if ($("#begin_date").val().length == 0 && $("#end_date").val().length == 0) {
      data["begin_date"] = 0
      data["end_date"] = 0
    } else {
      if ($("#timeSel").val() == 0) {
        data["begin_date"] = new Date($("#begin_date").val()).valueOf() / 1000;
        data["end_date"] = new Date($("#end_date").val()).valueOf() / 1000;
      } else {
        data["begin_reg_date"] = new Date($("#begin_date").val()).valueOf() / 1000;
        data["end_reg_date"] = new Date($("#end_date").val()).valueOf() / 1000;
      }
    }


    if (self.frameElement.getAttribute('id') == 'equipment1') {//普通用户
      data["agent_type"] = 4
    }
    csData = data;
    if (window.taskDetailInfo) {
      data = window.taskDetailInfo.showIframe_data;

    }

    return data;
  };

  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.mobile_list,
    "responseHandler": responseHandler,
    "queryParams": queryParams,
    'page': window.window.taskDetailInfo ? parseInt(window.window.taskDetailInfo.showIframe_data.page) : 0,
    'pageSize': window.window.taskDetailInfo ? parseInt(window.window.taskDetailInfo.showIframe_data.page_count) : 50,
    "clickToSelect": false,
  }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'), returnBack)


}

function start_mission(o) {
  var rows = $('#tableMy').bootstrapTable('getSelections')
  parent.start_mission.go('', rows)
}

var alert_changeName = {
  node: "",

  show: function (o) { //修改名字
    var info = $(o).data('info');
    alert_changeName.node = o;
    $('#mobileTitle').data('info', info);
    $('#mobileTitle').find('input[name=mobiel_title]').val(info.name);

    $('#mobileTitle').modal('show').find('.modal-dialog').css({ width: "43%", top: "25%" });

  },
  save: function () {
    var dats = {
      name: $('#mobileTitle').find('input[name=mobiel_title]').val(),
      id: $('#mobileTitle').data('info').id
    }
    var text = '<i class="mdi mdi-box-cutter"></i>' + dats.name

    var ret = parent.getByRsync(parent.DmConf.api.device.add, dats)
    if (ret.status) {
      $('#mobileTitle').modal('hide')
      $(alert_changeName.node).html(text)
    } else {
      parent.plus_alertShow.show(ret.msg)
    }
  }
}
var MobileList = {
  node: $('#mobileList'),
  id: 0,
  show() {
    this.node.find('input').val('')
    this.node.modal('show').find('.modal-dialog').css({ width: "43%", top: "15%" });
  },
  add() {

  },
  save() {
    var dats = {
      "id": this.id,
      "mobile_code": this.node.find('input[name=customer_id]').val(),
      "account_id": this.node.find('input[name=user_id]').val(),
      "imei": this.node.find('input[name=customer_imei]').val(),
      "mobile_label": $('#phoneLabel').val(),
      "token": parent.DmConf.userinfo.token,
      "session_id": parent.DmConf.userinfo.id,
    };
    var ret = parent.getByRsync(parent.DmConf.api.new.add_mobile, dats)
    if (!ret.data.code) {
      this.node.modal('hide');
      $('#tableMy').bootstrapTable('refresh')
    } else {
      parent.plus_alert(ret.data.msg)
    }
  },

}





