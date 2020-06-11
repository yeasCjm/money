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
 /*  var haowubang = parent.DmConf.haowubang;
  $.each(haowubang,function(i,v){
    $("#haowu").append('<option value="'+v+'">'+v+'</option>' )
  })
  $('#haowu').selectpicker('refresh') */
}

function saveTask(){
  
  var node = $('.step3');
 
 
  var data = {
    "application_account_id": $('#addTaskAccount1').val(),
   /*  "haowu" : $("#haowu").val().toString(), */
    "session_id" : parent.DmConf.userinfo.id,
    "task_type" : 3 ,
    "name": node.find('input[name=task_name]').val(),
 
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "id" : 0,
  }

  let error_obj = [
    { at: "name", er_msg: "请填写任务名" },
    { at: "application_account_id", er_msg: "请选择账号" },

  ]
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