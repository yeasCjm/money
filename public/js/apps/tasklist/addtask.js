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
  $('.time_tick').datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss',//显示格式
    todayHighlight: 1,//今天高亮
    minView: "0",//设置只显示到月份
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    todayBtn: true,
    autoclose: 1//选择后自动关闭
  });
  $(".time_tick").datetimepicker("setDate", new Date());


  $('input[name=time_type]').click(function () {

    if ($(this).val() == 1) {
      $('.time_task').show()
    } else {
      $('.time_task').hide()
    }
  })

  $("#time_week").selectpicker('refresh');

  $('.emojiBtn').popover({
    html: true,
    content: htmlContent(),
    title: '抖音表情',
    placement: 'left',
    delay: { show: 500, hide: 100 }
  })
}

function saveTask() {


  var node = $('.step3');
  var addCont = $('.addContent').find('input[name=content]').map(function () { return this.value; }).get().join("_#_");
  var addMsg = $('.addMsg').find('input[name=addMsg]').map(function () { return this.value; }).get().join("_#_");
  var data = {
    application_account_id: $('#addTaskAccount1').val(),
    target_fan_count: node.find('input[name=target_fan_count]').val(),
    target_like_count: node.find('input[name=target_like_count]').val(),

    like_pbb: node.find('input[name=like_pbb]').val(),

    target_comment_fan_count: node.find('input[name=target_comment_fan_count]').val(),
    video_replay_pbb: node.find('input[name=video_replay_pbb]').val(),
    video_opencomment_pbb: node.find('input[name=video_opencomment_pbb]').val(),
    target_message_count: node.find('input[name=target_message_count]').val(),
    task_time: node.find('input[name=task_time_0]').val() + '_' + node.find('input[name=task_time_1]').val(),
    play_time: node.find('input[name=play_time_0]').val() + '_' + node.find('input[name=play_time_1]').val(),
    video_page_count: node.find('input[name=video_page_count_0]').val() + '_' + node.find('input[name=video_page_count_1]').val(),
    time_type: node.find('input[name=time_type]:checked').val(),
    time_tick: $('#time_tick').val(),
    time_week: $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    keyword: $("#yw_keyword").val().replace(/\+/ig, ','),
    use_keyword: $("#keywordUse").prop('checked') ? 1 : 0,
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    message_text: addMsg,
    'send_model': node.find('input[name=sendmodeladdtask]:checked').attr('valueAttr'),
    name: "养号管理",
  }


  let error_obj = [
    { at: "name", er_msg: "请填写任务名" },
    { at: "application_account_id", er_msg: "请选择账号" },
    { at: "task_time", er_msg: "请填写正确养号时长", detail: { 'len': 2 } },
    { at: "play_time", er_msg: "请填写正确停留时长", detail: { 'len': 2 } },
    { at: "target_fan_count", er_msg: "请填写关注作者概率" },
    { at: "target_comment_fan_count", er_msg: "请填写每视频关注概率" },
    { at: "target_message_count", er_msg: "请填写评论区私信概率" },
    { at: "like_pbb", er_msg: "请填写随机点赞视频概率" },
    { at: "video_page_count", er_msg: "请填写的翻屏次数", detail: { 'len': 1 } },
    { at: "video_replay_pbb", er_msg: "请填写视频回播率" },
    { at: "video_opencomment_pbb", er_msg: "请填写视频打开评论率" },
  ]

  if (data.target_message_count > 0) {
    error_obj.push({ at: "message_text", er_msg: "请填写私信内容" })
  }
  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }


  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task, data);
  if (ret.data.code == 0) {
    parent.plus_alertShow.show('任务设置成功');
  } else {
    parent.plus_alertShow.show(ret.data.info.msg);
  }
}



function del_msg(t) {

  $(t).parent().remove()
}

function func(check_tree) {
  return;
  var arr = []
  var $id = 0
  $.each(check_tree, function (i, v) {
    if (v.parentId != 99999999 && !v.nodes) {
      $id++

      var newK = v.keyword.split(',');
      for (var oo = 0; oo < newK.length; oo++) {
        arr.push(newK[oo]);
      }

    }

  });

  var temp = [];
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    var dt = arr[i];
    if (obj[dt]) {
      //存在了 
      obj[dt]++;
    } else {
      //不存在 
      temp.push(dt);
      obj[dt] = 1;
    }
  }
  var saveArr = [];

  for (var attr in obj) {
    if (obj[attr] >= $id) {
      saveArr.push(attr)
    }
  }
  $("#keyword").find('option').remove();

  if (saveArr.length > 0) {

    $.each(saveArr, function (i, v) {
      if (v.length > 0) {
        $("#keyword").attr('mustSel', 1)
        $("#keyword").append('<option value="' + v + '">' + v + '</option>')
      }

    })
    $("#keyword").selectpicker('refresh')

    return
  } else {
    $("#keyword").selectpicker('refresh')
  }


  $("#keyword").attr('mustSel', 0)
}