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
     
  $.each(window.taskDetailInfo, function (i, v) {

    var sp = '<span dyId=' + v.unique_id + ' class="okName">' + v.nickname + '<span class="delName" onclick="delT(this)"></span></span>';
    $(".addTaskMobile2").append(sp)
  })  

}
function delT(t) {
  $(t).parent().remove()
}
function saveTask(){

  var node = $('.step3');
  var addMsg = $('.addMsg').find('input[name=addMsg]').map(function () { return this.value; }).get().join("_#_");
  var imei_id = $.map($('.okName'), function (v) { return $(v).attr('dyId') }).join(',')
  
  var data = {
    "application_account_id": $('#addTaskAccount1').val(),
    'time_type': node.find('input[name=time_type]:checked').val(),
    'time_tick': $('#time_tick').val(),
    'time_week': $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    "session_id" : parent.DmConf.userinfo.id,
    "target_message_count": node.find('input[name=tagret_num]').val() ,
    "name":'私信',
    
    unique_id : imei_id ,
    message_text: addMsg,
      "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "id" : 0,
  }
  let error_obj = [
    { at: "application_account_id", er_msg: "请选择应用账号" },
    { at: "unique_id", er_msg: "请选择私信的对象" },
    { at: "target_message_count", er_msg: "请填写私信数量" },
  ]
  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }


  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_message,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}