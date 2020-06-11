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
  reloadCity()

}

function saveTask(){
  var node = $('.step3');
  var comment_num = $('input[name=concern_0]').val() + '_' + $('input[name=concern_1]').val()  ;
  var data = {
    "task_type" : 1 ,
    "application_account_id" : $('#addTaskAccount1').val() ,
    "task_time": node.find('input[name=ctime]').val() ,
    "session_id" : parent.DmConf.userinfo.id ,   
    "acquisition_num" : comment_num ,
    "name" : node.find('input[name=task_name]').val() , 
    'time_type' : node.find('input[name=time_type]:checked').val() ,
    'time_tick' : $('#time_tick').val() ,
    'time_week' : $('#time_week').val() == null ? 0 : $('#time_week').val().toString() ,
    "token" : parent.DmConf.userinfo.token ,
    "customer_id" : parent.DmConf.userinfo.customer_id ,
    "id" : 0 ,
  }

  let  error_obj = [
    { at: "name", er_msg: "请填写任务名" },
    { at: "application_account_id", er_msg: "请选择应用账号" },

    { at: "task_time", er_msg: "请填写采集时长" },
    { at: "acquisition_num", er_msg: "请填写正确的评论数量", detail: { len: 2, } },
  ]
 

   if (node.find('input[name=key_type]:checked').val() == 1) {
      data['video_type'] = 1;
      data['class_name'] = node.find('input[name=class_name]').val();
      error_obj.push({at:'class_name',er_msg:"请填写关键词"})
  } else if (node.find('input[name=key_type]:checked').val() == 2) {
      data['video_type'] = 2;
      data['city'] = $('#city').val();
      error_obj.push({ at: 'city', er_msg: "请选择城市" })
  } else if (node.find('input[name=key_type]:checked').val() == 3) {
      data['video_type'] = 3 ;
      data['big_dy'] = node.find('input[name=big_dy]').val() ;
      error_obj.push({ at: 'big_dy', er_msg: "请填写大号" })
  } 

  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }

  
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}