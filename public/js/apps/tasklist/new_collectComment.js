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

function removePlayurl(t) {
  $(t).parent().remove()
}

function addPlayurl(url, type) {

  var v_url = url ? url : '';

  if (type) {
    $('.moreUrlist').append(' <div class="input-group margin10 dyORvideo_1" >\
    <span class= "input-group-addon width90" id = "basic-addon1" > 视频</span >\
    <input disabled type="text" value="'+ v_url + '" class="form-control" name="play_url" placeholder="请输入链接" aria-describedby="basic-addon1">\
    <span onclick="addPlayurl()" class=" left10pxSp iconfont icon-jia"></span><span onclick="removePlayurl(this)" class=" left10pxSp iconfont icon-jian"></span>\
    </div>');
  } else {
    $('.moreUrlist').append(' <div class="input-group margin10 dyORvideo_1" >\
    <span class= "input-group-addon width90" id = "basic-addon1" > 视频</span >\
    <input type="text" value="'+ v_url + '" class="form-control" name="play_url" placeholder="请输入链接" aria-describedby="basic-addon1">\
    <span onclick="addPlayurl()" class=" left10pxSp iconfont icon-jia"></span><span onclick="removePlayurl(this)" class=" left10pxSp iconfont icon-jian"></span>\
    </div>');
  }

}
function search_init() {
  create_datePicker($('.time_tick'))
  $('input[name=time_type]').click(function () {

    if ($(this).val() == 1) {
      $('.time_task').show()
    } else {
      $('.time_task').hide()
    }
  })

  if (window.taskDetailInfo) {

    $.each(window.taskDetailInfo, function (i, v) {
  
      if (i == 0) {
    
        $('.moreUrlist1').val(v.url).attr('disabled', true)
      } else {
        addPlayurl(v.url, 1)
      }

    })
    // $('input[name=play_url]').val(urlist).attr('disabled', true).attr('title',urlist);
  }

}

function saveTask() {
  var urlist = $('.moreUrlist').find('input[name=play_url]').map(function (v) { return this.value; }).get().filter(item => item);
  var comment_time = $('input[name=rightTime]:checked').val() == 0 ? $('input[name=timeHour]').val() * 3600 : $('input[name=timeMin]').val() * 60;
  var node = $('.step3');

  var data = {
    "application_account_id": $('#addTaskAccount1').val(),
    "task_type": 2,
    "session_id": parent.DmConf.userinfo.id,
    "url_list": JSON.stringify(urlist),
    "name": node.find('input[name=task_name]').val(),
    "is_god": node.find('input[name=is_god]').val(),
    "sex": $("#sex_type").val(),
    "class_name": $('input[name=class_name]').val().replace(/\+/ig, ','),
    "task_time": comment_time,
    "token": parent.DmConf.userinfo.token,
    "customer_id": parent.DmConf.userinfo.customer_id,
    "id": 0,
  }

  let error_obj = [
    { at: "name", er_msg: "请填写任务名" },
    { at: "application_account_id", er_msg: "请选择应用账号" },
  ]
  if(data['is_god'] == 0){
    error_obj.push({ at: "url_list", er_msg: "请填写视频链接", detail: { "len": 2 } }, { at: "task_time", er_msg: "请填写评论时长" })
   
  }
  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }


  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition, data);
  if (ret.data.code == 0) {
    parent.plus_alertShow.show('任务设置成功')
  } else {
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}