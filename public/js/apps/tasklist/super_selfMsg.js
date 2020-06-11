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
  $('#sex_text').selectpicker('refresh')


}

function selStore(){
  var oo = $("#sex_text").val()
  return parent.material.show(1,write_msg,oo)
}
function saveTask(){

  var addMsg = $('.addMsg').find('input[name=addMsg]').map(function(){return this.value;}).get().join("_#_") ;

  var data = {
    "name" : "截流管理—私信产粉—私信",
    "from_task_id" :  $('#super_taskList1').val(),
    "application_account_id" : $('.super_mobile_show').attr('user_id'),
    "session_id" : parent.DmConf.userinfo.id,
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "message_text":addMsg,
    "sex":$('#sex_text').val(),
    "id" : 0,
  }

  if($('#super_taskList1').val()==0 ){
     return parent.plus_alertShow.show('请选择任务后重试')
  }
  if($('.super_mobile_show').attr('is_fan_count') == 0){
    return parent.plus_alertShow.show('请选择成功关注数不为0的任务')
  }
  
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_message,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}