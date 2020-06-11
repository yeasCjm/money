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
        $("#time_type").selectpicker('refresh');
        var ret = parent.getByRsync(parent.DmConf.api.new.task_class_list,{
          session_id:parent.DmConf.userinfo.id,
             "token" : parent.DmConf.userinfo.token,
        })
      if(ret.data.code == 0){
        if(ret.data.info.length > 0 ){
           $.each(ret.data.info,function(i,v){
            var opt = '<option value='+v.name+'>'+v.name+'</option>';
              $('#his_label').append(opt)
          })
        }
        
         $('#his_label').selectpicker('refresh');
          $('#his_label').parent().css({'z-index':7,'height':'28px'}) 
      }
      $('#his_label').prop('disabled',true)
 $('input[name=dyORvideo]').change(function(){

     if($(this).val() == 0){
      $('#his_label').prop('disabled',true)
      node.find('input[name=class_name]').prop('disabled',false)

     }else{
         $('#his_label').prop('disabled',false)
          node.find('input[name=class_name]').prop('disabled',true)
   
     }
   })

}

function saveTask(){

  var node = $('.step3');
  var task_time = $("#time_type").val() == 0 ?  parseInt(node.find('input[name=task_time]').val()*3600 ) :  parseInt(node.find('input[name=task_time]').val()*60);
  if($('#addTaskAccount1').val() == 0){
    
  }
  var class_name = ''
  if($('input[name=dyORvideo]:checked').val() == 0 ){
    class_name = $('input[name=class_name]').val()
  }else{
    class_name = $('#his_label').val()
  }
  var data = {
    "application_account_id": $('#addTaskAccount1').val(),
    "imei" :  $('#addTaskResource1').val(),
    "session_id" : parent.DmConf.userinfo.id,
    "play_url": node.find('input[name=play_url]').val(),
    "name": $(".step2").find('input[name=task_name]').val(),
    "task_type" : $("#nowDo").prop('checked') ? 1 : 0 , 
    "class_name" : class_name,
    "task_time": task_time,
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "id" : 0,
  }

  if($('#addTaskAccount1').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }

  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}