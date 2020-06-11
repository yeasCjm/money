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
       $('.time_tick').datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',//显示格式
        todayHighlight: 1,//今天高亮
        minView: "0",//设置只显示到月份
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: true,
        autoclose: 1//选择后自动关闭
      });
  $(".time_tick").datetimepicker("setDate", new Date());
 

    $('input[name=time_type]').click(function(){
       
        if($(this).val() == 1){
            $('.time_task').show()
        }else{
            $('.time_task').hide()
        }
    })

    $("#time_week").selectpicker('refresh');


}

function saveTask(){

  var data = {
    "resource_id" : $("#addTaskResource1").val() ,
    "name" : $('input[name=massion_name]').val(),
    "task_type" : $('input[name=task_type]').data('value') ,
    "application_account_id" :$('#addTaskAccount1').val() ,
    "level" : $('#level').val(),
    "task_content" : $('input[name=task_content]').val(),
    "notes" :  $('input[name=task_notes]').val(),
    
    "session_id" : parent.DmConf.userinfo.id,
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "id" : 0,
  }
  if($('#addTaskAccount1').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}