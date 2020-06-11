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


function search_init(){
  create_datePicker($('.time_tick'))
  $('input[name=time_type]').click(function () {

    if ($(this).val() == 1) {
      $('.time_task').show()
    } else {
      $('.time_task').hide()
    }
  })
 
  $(".addTaskMobile2").find('span').remove()
  $.each(window.taskDetailInfo,function(i,v){
    var sp = '<span dyId=' + v.url + ' class="okName">' + v.url+'<span class="delName" onclick="delT(this)"></span></span>' ;
    $(".addTaskMobile2").append(sp)
  })
  
}

function delT(t){
  $(t).parent().remove()
}
function saveTask(){

  var node = $('.step3'); 
  var addCont = $('.addContent').find('input[name=content]').map(function () { return this.value; }).get().join("_#_");
  var imei_id = $.map($(".addTaskMobile2").find('.okName'),function(v){return $(v).attr('dyid')});

  var data = {
    "application_account_id": $('#addTaskAccount1').val(),
    "is_like": node.find('input[name=is_like]').prop('checked') ? 1 : 0 ,
    "videos" : JSON.stringify(imei_id) ,
    "session_id" : parent.DmConf.userinfo.id,
    'time_type': node.find('input[name=time_type]:checked').val(),
    'time_tick': $('#time_tick').val(),
    'time_week': $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    "name" : "二次点赞评论" ,
    "message_text" : addCont ,
    "keywords": node.find('input[name=keywords]').val(),
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "id" : 0,
  }
  let error_obj = [
    { at: "application_account_id", er_msg: "请选择应用账号" },
    { at: "videos", er_msg: "请选择视频地址" },
    { at: "videos", er_msg: "请选择视频地址" },
   
  ]
  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }

  let imLen = imei_id
  let appLen = data['application_account_id'].split(',')

  if(appLen.length > imLen.length){
    parent.plus_alert('选择执行账号多于执行视频，将导致多余的执行账号不执行该次任务。')
  }
  setTimeout(function(){
    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_dzpl, data);
    if (ret.data.code == 0) {
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }  
  },2000)
  
}