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



}

function saveTask(){



  var data = {
    
    "application_account_id" :  $('#addTaskAccount1').val(),
    "fan_time" : $('input[name=fan_time]').val(),
    "from_task_id" :  $('#super_taskList1').val(),
    "target_fan_count" :  $('#fan_count_total').val(),

    "session_id" : parent.DmConf.userinfo.id,
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "name" : "截流管理—私信产粉—关注已采集的抖音号",
    "id" : 0,
  }
  

  if($('#addTaskAccount1').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_fan,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}